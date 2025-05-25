import { FieldValue } from '@google-cloud/firestore';
import * as functions from 'firebase-functions';

import { db } from '../../main';
import { subscribeToTopics, unsubscribeFromTopics } from '../notifs/notif-subscribe.util';
import { UserService } from '../shared/user.model';
import { errors } from '../shared/util';
import { notifyChatRequestToUser } from './chat-request.fn';

/**
 * Chat status changes
 *
 * requested > open - notify chat request accepted, notify mate of pending requests (reminders)
 * open > closed
 * closed > open
 */

export const onChatCreate = functions.firestore.document('chats/{id}').onCreate(async (snap, ctx) => {
  const promises: Promise<any>[] = [];
  const chat = snap.data();
  const chatId = ctx.params.id;
  const chatUids = Object.keys(chat.uids);

  const users = await db.collection('users').where('uid', 'in', chatUids).get();

  // temp - update chat.fromGroupId for users who haven't got the latest app yet v3.0
  const fromUser = users.docs.find((u) => u.id == chat.fromUid)?.data() as any;
  if (!chat.fromGroupId && fromUser?.currentGroupId) {
    snap.ref.update({ fromGroupId: fromUser.currentGroupId });
  }

  // update user.topics and user.chatRequestsAccepted
  if (chat.status == 'open' || !chat.status) {
    users.forEach((u) => {
      const user = u.data();
      const topics = getUserChatTopics(chatId, chatUids, user.uid);

      user.topics = FieldValue.arrayUnion(...topics);
      promises.push(u.ref.set(user, { merge: true }));
      promises.push(subscribeToTopics(user.fcmTokens, topics));
      console.log('CreateChat: ', user.displayName);

      // only if it's one user - if you start an open chat with a group - don't include in request data flow
      // const otherUsers = chatUids?.filter(uid1 => uid1 != user.uid);
      // if (otherUsers.length) data.chatRequestsAccepted = FieldValue.arrayUnion(...otherUsers);
    });
  }

  if (chat.status == 'requested') {
    // update fromUser
    promises.push(UserService.userRef(chat.fromUid).update(`chatRequestsMade.${chat.toUid}`, 'requested'));

    // update toUser
    promises.push(UserService.userRef(chat.toUid).set({ chatRequestCount: FieldValue.increment(1) }, { merge: true }));

    // notify toUser
    const user = await UserService.getUser(chat.toUid);
    promises.push(notifyChatRequestToUser(user, chat));
  }

  // compat - old requests accepted won't have a status
  if (!chat.status) {
    promises.push(snap.ref.update({ status: 'open' }));
  }

  // temp #270 update chat.fromGroupId using user.currentGroupId - to avoid waiting for app update cycle
  if (!chat.fromGroupId) {
    const u = await UserService.getUser(chat.fromUid);
    if (u.currentGroupId) {
      chat.fromGroupId = u.currentGroupId;
      promises.push(snap.ref.update({ groupId: u.currentGroupId }));
    }
  }

  // group analytics
  promises.push(updateGroupMemberAnalytics(chat));

  return Promise.all(promises);
});

export const onChatClose = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;
  // either an admin or your uid must be from or to

  const b = db.batch();
  const chat = data.chat;

  if (chat.fromUid && chat.toUid) {
    // update fromUser
    b.update(db.doc(`users/${chat.fromUid}`), { [`chatRequestsMade.${chat.toUid}`]: 'closed' });

    // group analytics
    updateGroupMemberAnalytics(chat);
  }

  return b.commit();
});

export const onChatDelete = functions.firestore.document('chats/{id}').onDelete(async (snap, ctx) => {
  const promises: Promise<any>[] = [];
  const chat = snap.data();
  const chatId = ctx.params.id;
  const chatUids = Object.keys(chat.uids);

  const users = await db.collection('users').where('uid', 'in', chatUids).get();

  if (!chat.usersUnreadCount) chat.usersUnreadCount = {};

  users.forEach((u) => {
    const user = u.data();
    const topics = getUserChatTopics(chatId, chatUids, u.id);
    const otherUsers = chatUids.length > 1 ? chatUids?.filter((_uid) => _uid != user.uid) : chatUids; // for self chat

    user.topics = FieldValue.arrayRemove(...topics);
    user.chatUnreadCount = FieldValue.increment(-(chat.usersUnreadCount[u.id] || 0)); // decrement user total when chat deleted

    Object.entries(user.chatRequestsMade || {}).forEach(([uid]) => {
      //, status
      if (otherUsers?.includes(uid)) {
        // used to be marked 'closed'
        user.chatRequestsMade[uid] = FieldValue.delete();
      }
    });

    promises.push(u.ref.set(user, { merge: true }));

    promises.push(...unsubscribeFromTopics(user.fcmTokens, topics));
  });

  // group analytics
  // - tricky to get the right currentGroupId and shouldn't delete from group/id/members as it would mess up their analytics numbers
  if (chat.fromGroupId) {
    db.doc(`groups/${chat.fromGroupId}/members/${chat.fromUid}`).update({
      [`chatRequestsMade.${chat.id}`]: FieldValue.delete(),
    });
  }

  // delete messages
  const messageDocs = await snap.ref.collection('messages').listDocuments();
  promises.push(...messageDocs.map((d) => d.delete()));

  console.log('Chat Deleted:', chatId, chatUids);
  return Promise.all(promises);
});

/**

 Helpers

 */

// analytics: update group member from requesting ChatUser
const updateGroupMemberAnalytics = async (chat: any) => {
  if (chat.fromGroupId) {
    const data: any = {
      [`chatRequestsMade.${chat.id}`]: chat.status,
    };
    db.doc(`groups/${chat.fromGroupId}/members/${chat.fromUid}`).update(data);
  }
};

const getUserChatTopics = (chatId: string, uids: string[], uid?: string) => {
  // test - to notify self if you're the only one in the chat
  if (uids.length == 1) {
    return uids.map((_uid) => '/topics/chats-' + chatId + '-' + _uid);
  }

  if (uid) {
    uids = uids.filter((_uid) => _uid != uid);
  }

  return uids.map((_uid) => '/topics/chats-' + chatId + '-' + _uid);
};

/**
 * Idea to use chatUpdated function to handle accepted/declined chat requests.
 * !Can't use - cost - callablefunction to handle requested > open notification
 * !don't plan to use this - 2x fn call for each message sent
 */
