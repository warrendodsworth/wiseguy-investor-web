import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { environment } from '../../environments/environment';
import { messaging } from '../../main';
import { UserService } from '../shared/user.model';
import { errors } from '../shared/util';

import { getBadge, processTokens, sendMulticast } from './notif-send.util';
import { subscribeToTopics, unsubscribeFromTopics } from './notif-subscribe.util';

export const subscribeToTopic = functions.https.onCall((data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;
  if (!data.tokens) throw errors.missingParam('Missing tokens');
  if (!data.topics) throw errors.missingParam('Missing topics');

  return subscribeToTopics(data.tokens, data.topics);
});

export const unsubscribeFromTopic = functions.https.onCall((data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;
  if (!data.tokens) throw errors.missingParam('Missing tokens');
  if (!data.topics) throw errors.missingParam('Missing topics');

  return Promise.all(unsubscribeFromTopics(data.tokens, data.topics));
});

export const notifyTopic = functions.https.onCall(async (data: any, ctx) => {
  if (!ctx.auth?.token || !ctx.auth?.uid) throw errors.unauthenticated;
  if (!data.topic) throw errors.missingParam('Missing topic');
  if (ctx.auth.uid != data.uid || !ctx.auth.token.admin) throw errors.unauthorized(); // allow only notify self, only admins can notify other users

  const user = await UserService.getUser(data.uid);

  const notif: admin.messaging.Message = {
    topic: data.topic,
    notification: { title: data.title, body: data.body },
    android: {},
    apns: { payload: { aps: { badge: getBadge(user) } } },
    webpush: { fcmOptions: { link: environment.rootURL + data.clickAction }, notification: { icon: environment.iconURL } },
  };

  if (!environment.notify) return Promise.resolve();
  return messaging.send(notif);
});

export const notifyUser = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;
  if (!data.uid) throw errors.missingParam('Missing uid');
  if (ctx.auth.uid != data.uid || !ctx.auth.token.admin) throw errors.unauthorized(); // allow only notify self, only admins can notify other users

  const user = await UserService.getUser(data.uid);

  const notif: admin.messaging.MulticastMessage = {
    tokens: processTokens(user.fcmTokens),
    notification: { title: data.title, body: data.body },
    android: {},
    apns: { payload: { aps: { badge: getBadge(user) } } },
    webpush: { fcmOptions: { link: environment.rootURL + data.clickAction }, notification: { icon: environment.iconURL } },
  };
  return sendMulticast(notif);
});

// async function notifyTokens(uid, payload) {
//   const db = admin.firestore();
//   const userRef = db.collection('users').doc(uid);

//   // get the user's tokens and send notifications
//   const tokens: string[] = [];
//   const devicesDoc = await userRef.get();
//   const devices = devicesDoc.data();

//   for (const token in devices?.fcmTokens) {
//     if (devices.fcmTokens.hasOwnProperty(token)) {
//       tokens.push(token);
//     }
//   }

//   const testRef = db.doc(`testLastNotified/${uid}`);
//   testRef.set({ lastNotifiedAt: new Date().toTimeString() });

//   // send a notification to each device token
//   return admin.messaging().sendToDevice(tokens, payload);
// }
