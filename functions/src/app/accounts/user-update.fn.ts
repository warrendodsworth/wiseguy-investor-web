import * as functions from 'firebase-functions';

import { environment } from '../../environments/environment';
import { auth, db } from '../../main';
import { errors, firstName } from '../shared/util';

/**
 * Update cascade user details - name, email, photo to user docs in different collections
 * onCall valiadtes auth tokens https://firebase.google.com/docs/functions/callable
 */
export const updateUserData = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;

  if (!ctx.auth.token.admin && ctx.auth.uid != data.uid) throw errors.unauthorized('Not your account');

  if (!data.displayName) throw errors.missingParam('Missing name');
  if (!data.photoURL) throw errors.missingParam('Missing photoURL');

  // Temp until users update
  if (data.photoURL?.startsWith('/assets/avatars')) {
    data.photoURL = environment.rootURL + data.photoURL;
  }
  if (data.photoURLThumb?.startsWith('/assets/avatars')) {
    data.photoURLThumb = environment.rootURL + data.photoURLThumb;
  }

  const promises: Promise<any>[] = [];

  try {
    // User profile
    const user = await auth.getUser(data.uid);
    const userData: any = { displayName: data.displayName };
    if (data.photoURL) userData.photoURL = data.photoURL; // todo check if url is valid
    await auth.updateUser(data.uid, userData);

    // User meta - incase admins need to see a users email or it needs to be used in a front side query
    await db.doc('user_meta/' + data.uid).set({ email: user.email });

    // User groups
    const groupMembersSnap = await db.collectionGroup(`members`).where('uid', '==', data.uid).get();
    groupMembersSnap.forEach(s => {
      promises.push(s.ref.update({ name: data.displayName, photoURL: data.photoURL }));
      console.log('GroupId:', s.id, ' User: ', data.displayName, data.photoURL);
    });

    // Update chats
    const chatsSnap = await db.collection('chats').where(`uids.${data.uid}`, '==', true).get();
    chatsSnap.forEach(snap => {
      const chat = snap.data();
      chat.users[data.uid].name = firstName(data.displayName);
      chat.users[data.uid].photoURL = data.photoURL;
      chat.users[data.uid].thumbnailURL = data.photoURLThumb || data.photoURL;
      promises.push(snap.ref.update(chat));
    });

    await Promise.all(promises);

    return { message: 'Success' };
  } catch (error: any) {
    const e = error.errorInfo;
    throw new functions.https.HttpsError('internal', e.message, e.code);
  }
});
