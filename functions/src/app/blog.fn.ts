import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

export const heartCount = functions.firestore.document('hearts/{heartId}').onCreate((snap, context) => {
  const postId = snap.get('postId');

  admin
    .firestore()
    .collection('hearts')
    .where('postId', '==', postId)
    .onSnapshot(snap => {
      admin
        .firestore()
        .doc(`posts/${postId}`)
        .onSnapshot(snap1 => {
          if (snap1.exists) {
            snap1.ref.update({ likes: snap.size });
          }
        });
    });
});

export const notifyNewSubscriber = functions.firestore
  .document('subscribers/{subscriptionId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    if (!data) {
      return;
    }

    const userId = data.userId;
    const subscriber = data.subscriberId;

    const notification: admin.messaging.Notification = {
      title: 'New Subscriber',
      body: `${subscriber} is following your content!`,
      imageUrl: 'https://picsum.photos/50',
    };

    const payload: admin.messaging.Message = {
      notification,
      topic: data.topic || 'events',
    };

    return admin.messaging().send(payload);
  });

async function notifyTokens(uid: string, payload: admin.messaging.MessagingPayload) {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);

  const deviceTokens = [];
  const devicesSnap = await userRef.get();
  const devices = devicesSnap.data();
  if (!devices) {
    return;
  }

  for (const token in devices.fcmTokens) {
    if (devices.fcmTokens.hasOwnProperty(token)) {
      deviceTokens.push(token);
    }
  }

  const testRef = db.doc(`users/${uid}`);
  testRef.set({ lastNotified: new Date().toTimeString() }, { merge: true });

  return admin.messaging().sendToDevice(deviceTokens, payload);
}
