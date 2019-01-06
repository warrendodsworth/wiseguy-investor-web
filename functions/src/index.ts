import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp()
// https://firebase.google.com/docs/functions/typescript

export const heartCount = functions.firestore.document('hearts/{heartId}').onCreate((snap, context) => {
  let postId = snap.get('postId');

  admin.firestore().collection('hearts').where('postId', '==', postId).onSnapshot(snap => {
    admin.firestore().doc(`posts/${postId}`).onSnapshot(snap1 => {
      if (snap1.exists) {
        snap1.ref.update({ likes: snap.size })
      }
    })
  })
})

export const notifyNewSubscriber = functions.firestore.document('subscribers/{subscriptionId}').onCreate(async (snap, context) => {
  const data = snap.data()

  const userId = data.userId
  const subscriber = data.subscriberId

  // Notification content
  const payload = {
    notification: {
      title: 'New Subscriber',
      body: `${subscriber} is following your content!`,
      icon: 'https://skaoss.blob.core.windows.net/brand/icon512.png'
    }
  }

  return await notifyTokens(userId, payload)
});


async function notifyTokens(uid, payload) {
  const db = admin.firestore()
  const userRef = db.collection('users').doc(uid)

  // get the user's tokens and send notifications
  const tokens = [];
  const devices = await userRef.get()

  for (const token in devices.data().fcmTokens) {
    if (devices.data().fcmTokens.hasOwnProperty(token)) {
      tokens.push(token)
    }
  }

  const testRef = db.doc(`testLastNotified/${uid}`)
  testRef.set({ lastNotifiedAt: new Date().toTimeString() })

  // send a notification to each device token
  return admin.messaging().sendToDevice(tokens, payload)
}




// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// })
