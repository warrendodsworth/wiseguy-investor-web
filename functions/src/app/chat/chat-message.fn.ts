import { FieldValue, Timestamp } from '@google-cloud/firestore';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { environment } from '../../environments/environment';
import { db } from '../../main';
import { getBadge, processTokens, sendMulticast } from '../notifs/notif-send.util';

/**
 * onMsg sent - increment otherUser users unread count by 1
 * badge = unreadCount + chatRequest count
 *
 * decrement user.chatThreadCount & chat.usersUnreadCount[uid] onopenthread
 * decrement user.chatRequestCount onaccept/delete request
 */
export const onChatMessageCreate = functions.firestore.document('chats/{cid}/messages/{mid}').onCreate(async (snap, ctx) => {
  const msg = snap.data();
  const chatId = ctx.params.cid;
  const fromUid = msg.fromUid || msg.uid;
  const fromFirstName = msg.fromFirstName || msg.senderName;
  const promises: Promise<any>[] = [];

  // CHAT
  const chatSnap = await db.doc('chats/' + chatId).get();
  const chat = chatSnap.data() as any;

  const chatUids = Object.keys(chat.uids);
  const otherUids = chatUids?.length == 1 ? chatUids : chatUids.filter((uid1) => uid1 != fromUid); // to allow self chat

  // update chat unread counts
  // allow self chat -> when uids.length == 1
  const usersUnreadCount = {};
  chatUids?.forEach((uid) => {
    if (uid != fromUid || chatUids.length == 1) {
      usersUnreadCount[uid] = FieldValue.increment(1);
    }
  });
  chat.usersUnreadCount = usersUnreadCount;

  if (msg.text) chat.lastMessage = msg.text;
  chat.lastMessageUid = msg.fromUid || '';
  chat.lastMessageDate = Timestamp.now();

  // Clear draft
  if (chat.users[fromUid].draftText) {
    chat.users[fromUid].draftText = '';
  }

  promises.push(chatSnap.ref.set(chat, { merge: true }));

  // Aug 23, 2022 using set Fixes chatUnreadCount update issue
  // - update needs a dot notation obj to work for nested objects
  // - was causing usersUnreadCount[uid] to be 1 after multiple updates with increent(1)

  // Update chat user details
  // - now done in user-update.fn.ts

  // update other users & notify them
  const users = await db.collection('users').where('uid', 'in', chatUids).get();

  users.forEach((u) => {
    if (otherUids.includes(u.id)) {
      const user = u.data();

      const data: any = {};
      data.chatUnreadCount = !user.chatUnreadCount ? 1 : FieldValue.increment(1);
      promises.push(u.ref.update(data));

      const notificationsEnabled = chat.users[u.id]?.notificationsEnabled;
      if (notificationsEnabled) {
        promises.push(notifyChatMessageSent(user, chatId, fromFirstName));
      }
    }
  });

  return Promise.all(promises);
});

/**
 * Notify Message To
 */
export const notifyChatMessageSent = (user: any, chatId: string, fromFirstName: string): Promise<any> => {
  console.log('fn:chat UpdateUser & SendNewMessageNotif: uid', user.uid);

  // badge +1 to include the latest message

  const tokens = processTokens(user.fcmTokens);
  if (!tokens?.length) return Promise.resolve();

  const msg: admin.messaging.MulticastMessage = {
    tokens: tokens,
    notification: { title: `You've got a new message from ` + fromFirstName?.split(' ')[0] + '!' || '' },
    apns: { payload: { aps: { badge: getBadge(user) + 1 } } },
    webpush: {
      fcmOptions: { link: environment.rootURL + '/app/tabs/chats/' + chatId },
      notification: { icon: environment.iconURL },
    },
  };

  return sendMulticast(msg);
};

// todo reading
// color: environment.notificationColor,
// tag: fromUid, // one notif recd per uid, subsequent msgs don't trigger notif show
// contentAvailable: true, priority: 'high'
