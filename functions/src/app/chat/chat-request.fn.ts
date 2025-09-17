import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { environment } from '../../environments/environment';
import { db } from '../../main';
import { getBadge, processTokens, sendMulticast } from '../notifs/notif-send.util';
import { UserInfo, UserService } from '../shared/user.model';
import { errors, firstName } from '../shared/util';

// todo if admin allow open chat on someone else's behalf

// Mate Accepts Chat Request
export const onAcceptChatRequest = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;

  const promises: Promise<any>[] = [];
  const chat = data.chat;
  console.log('onAcceptChatRequest', chat?.id);

  // update toUser
  promises.push(
    UserService.userRef(chat.toUid).set({ chatRequestCount: admin.firestore.FieldValue.increment(-1) }, { merge: true })
  );

  // update fromUser
  promises.push(UserService.userRef(chat.fromUid).update(`chatRequestsMade.${chat.toUid}`, 'open'));

  // notify fromUser
  const user = await UserService.getUser(chat.fromUid);
  promises.push(notifyChatRequestFromUser(user, chat));

  return Promise.all(promises);
});

// Mate Declines Chat Request
export const onDeclineChatRequest = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;

  const promises: Promise<any>[] = [];
  const action = data.action; // Cancel | Decline
  const chat = data.chat;
  const currentUid = ctx.auth?.uid;

  // update toUser
  promises.push(
    UserService.userRef(chat.toUid).set({ chatRequestCount: admin.firestore.FieldValue.increment(-1) }, { merge: true })
  );

  // update fromUser
  promises.push(UserService.userRef(chat.fromUid).update(`chatRequestsMade.${chat.toUid}`, 'closed'));

  // notify toUser
  if (action == 'Cancel' || currentUid == chat.fromUid) {
    const user = await UserService.getUser(chat.toUid);
    promises.push(notifyToUserChatRequestDeclined(user, chat));
  }

  return Promise.all(promises);
});

// User Re-requests Chat
export const onReRequestChat = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;

  const promises: Promise<any>[] = [];
  const b = db.batch();
  const chat = data.chat;

  // update fromUser
  b.update(UserService.userRef(chat.fromUid), { [`chatRequestsMade.${chat.toUid}`]: 'requested' });

  // update toUser
  b.set(UserService.userRef(chat.toUid), { chatRequestCount: admin.firestore.FieldValue.increment(1) }, { merge: true });
  promises.push(b.commit());

  // notify toUser
  const user = await UserService.getUser(chat.toUid);
  promises.push(notifyChatRequestToUser(user, chat));

  return Promise.all(promises);
});

// For reverse engagement - Mates reach out to new Users
export const updateUserChatRequestsMade = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;
  const promises: Promise<any>[] = [];
  const b = db.batch();
  const chat = data.chat;
  const mateUid = ctx.auth.uid;
  const userUid = chat.fromUid;

  // verify mate - could check claims token
  const currentUser = await UserService.getUser(mateUid);
  const authorized = ctx.auth.token.mate || ctx.auth.token.admin || currentUser.roles.mate;
  if (authorized === false) {
    //  throw errors.unauthorized(`Sorry, you're not authorized to update a User's chat requests`);
    return Promise.resolve();
  }

  // update user
  b.update(UserService.userRef(userUid), { [`chatRequestsMade.${mateUid}`]: 'open' });
  promises.push(b.commit());

  // notify user
  const user = await UserService.getUser(userUid);
  promises.push(notifyToUserOfNewlyOpenedChat(user, chat));

  return Promise.all(promises);
});

const notifyToUserOfNewlyOpenedChat = (user: any, chat: any): Promise<any> => {
  const tokens = processTokens(user.fcmTokens);
  if (!tokens?.length) return Promise.resolve();

  const msg: admin.messaging.MulticastMessage = {
    tokens: tokens,
    notification: { title: `One of our Mates, ` + chat.fromFirstName + ' opened a chat with you' },
    apns: { payload: { aps: { badge: getBadge(user) } } },
    webpush: {
      fcmOptions: { link: environment.rootURL + '/app/tabs/chats/' + chat.id },
      notification: { icon: environment.iconURL },
    },
  };
  return sendMulticast(msg);
};

const notifyToUserChatRequestDeclined = (user: any, chat: any): Promise<any> => {
  console.log(`notifyCancelChatRequest: ${chat.toFirstName}`);

  const msg: admin.messaging.MulticastMessage = {
    tokens: processTokens(user.fcmTokens),
    notification: { title: `Your chat request from ${chat.fromFirstName} has been canceled 🔴` },
    apns: { payload: { aps: { badge: getBadge(user) } } },
    webpush: { fcmOptions: { link: environment.rootURL + '/' }, notification: { icon: environment.iconURL } },
  };
  return sendMulticast(msg);
};

const notifyChatRequestFromUser = (user: any, chat: any): Promise<any> => {
  console.log(`notifyChatRequestAccepted: ${chat.fromFirstName}`);

  const msg: admin.messaging.MulticastMessage = {
    tokens: processTokens(user.fcmTokens),
    notification: {
      title: firstName(chat.toFirstName) + ' accepted your chat request',
      body: `Start chatting when you're ready`,
    },
    apns: { payload: { aps: { badge: getBadge(user) } } },
    webpush: { fcmOptions: { link: environment.rootURL + '/app/tabs/chats' }, notification: { icon: environment.iconURL } },
  };
  return sendMulticast(msg);
};

export const notifyChatRequestToUser = (user: UserInfo, chat: any): Promise<any> => {
  console.log(`notifyChatRequest: ${chat.toFirstName}`);

  const msg: admin.messaging.MulticastMessage = {
    tokens: processTokens(user.fcmTokens),
    notification: { title: chat.fromFirstName + ' sent you a chat request' },
    apns: { payload: { aps: { badge: getBadge(user) } } },
    webpush: {
      fcmOptions: { link: environment.rootURL + '/app/tabs/chats/' + chat.toUid + '/requests' },
      notification: { icon: environment.iconURL },
    },
  };
  return sendMulticast(msg);
};
