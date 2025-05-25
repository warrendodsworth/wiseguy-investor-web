import admin from 'firebase-admin';

import { environment } from '../../environments/environment';
import { messaging } from '../../main';
import { processTokens } from './notif-send.util';

/**
 * Legacy API
 * https://firebase.google.com/docs/cloud-messaging/migrate-v1
 * @deprecated
 */
const createNotif = (title: string, body: string, badge: number, clickActionPath?: string) => {
  const payload: admin.messaging.MessagingPayload = {
    notification: {
      title: title,
      badge: badge + '',
      clickAction: environment.rootURL + clickActionPath,
      icon: environment.iconURL,
      color: environment.notificationColor,
    },
  };
  if (body && payload.notification) {
    payload.notification.body = body;
  }
  return payload;
};

/**
 * Notify Tokens
 */
const notifyTokens = (
  fcmTokens: string | string[] | object,
  payload: admin.messaging.MessagingPayload,
  options?: admin.messaging.MessagingOptions
) => {
  const tokens = processTokens(fcmTokens);
  console.log('notifying:', tokens.length + ' tokens');

  if (!environment.notify || !tokens?.length) return Promise.resolve();
  return messaging.sendToDevice(tokens, payload, options);
};

// async function notifyTokens2Old(uid, payload) {
//   const db = admin.firestore();
//   const userRef = db.collection('users').doc(uid);

//   // get the user's tokens and send notifications
//   const tokens = [];
//   const devices = (await userRef.get())?.data();

//   for (const token in devices?.fcmTokens) {
//     if (devices?.fcmTokens.hasOwnProperty(token)) {
//       tokens.push(token);
//     }
//   }

//   // send a notification to each device token
//   return admin.messaging().sendToDevice(tokens, payload);
// }
