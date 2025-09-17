import { AuthBlockingEvent, beforeUserCreated } from 'firebase-functions/v2/identity';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

import { environment } from '../../environments/environment';
import { app } from '../../main';
import { trueKeys } from '../shared/util';

/**
 * onCreateAccount - add email to user_meta secure collection
 */
export const onCreateAccount = beforeUserCreated(async (event: AuthBlockingEvent) => {
  const promises: Promise<any>[] = [];
  const uid = event.data?.uid;
  const db = app.firestore();
  const batch = db.batch();

  // Update user meta
  batch.set(db.doc(`user_meta/` + uid), { email: event.data?.email }, { merge: true });

  // Temp fix #254 till Apple Sign-in not saving user on create is resolved
  batch.set(db.doc(`users/` + uid), { uid: event.data?.uid }, { merge: true });

  promises.push(batch.commit());
  Promise.all(promises);
});

/**
 * onCreateUser doc: trigger add-user Zap to send Flodesk welcome email
 * - displayName is update after login with social data so using that one
 */
export const onCreateUser = onDocumentCreated(
  {
    region: 'australia-southeast1',
    document: 'users/{uid}',
  },
  async (event) => {
    const appUser = event.data?.data();
    if (!appUser) return;

    // initialize user_roles
    const trueRoles: any = trueKeys(appUser.roles);
    delete trueRoles.user;

    // init photoURL if missing
    if (!appUser.photoURL) {
      await app
        .firestore()
        .doc('users/' + event.data?.id)
        .set({ photoURL: environment.gravatarURL }, { merge: true });
    }

    await app
      .firestore()
      .doc('user_roles/' + event.data?.id)
      .set({ roles: trueRoles }, { merge: true });

    // ...existing code with Zapier integration...

    return await event.data?.ref.update('roles.user', true);
  }
);
