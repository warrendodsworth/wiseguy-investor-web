import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const heartCount = functions.firestore.document('hearts/{heartId}').onCreate((snap, context) => {
  const postId = snap.get('postId');

  admin
    .firestore()
    .collection('hearts')
    .where('postId', '==', postId)
    .onSnapshot((snap) => {
      admin
        .firestore()
        .doc(`posts/${postId}`)
        .onSnapshot((snap1) => {
          if (snap1.exists) {
            snap1.ref.update({ likes: snap.size });
          }
        });
    });
});
