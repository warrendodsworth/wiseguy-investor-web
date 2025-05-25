import * as functions from 'firebase-functions';

import { app, auth, db } from '../../main';
import { errors, trueKeys } from '../shared/util';

/**
 * Custom claims
 * Designed for the function caller to be a claims admin
 * - https://firebase.google.com/docs/auth/admin/custom-claims
 * - currently setting, could find user and upsert claims
 * -- lqlTJMEkTpXL3hagMewAHW9AJ5D3 - Warren (Review) account
 */
export const updateClaims = functions.https.onCall(async (data: any, ctx: functions.https.CallableContext) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;
  if (!data.uid) throw errors.missingParam('uid is required');

  const isAdmin = ctx.auth?.token.admin;
  if (!isAdmin) throw errors.unauthorized('Only admins can update roles');

  try {
    // Set custom user claims on this newly created user.
    let claimsData: any = {};

    claimsData = trueKeys(data.claims);
    delete claimsData.user;

    // also in auth.store.ts where updateClaims fn is called
    // admins can create subscriptions from stripe dashboard for users,
    // avoids having to setup an eventarc custom listener to keep user.subscriptions up to date when a user cancels
    // if (data.subscriptions?.plus) {
    //   claimsData.stripeRole = 'plus'; // other payment providers can be added into this if
    // }

    await auth.setCustomUserClaims(data.uid, Object.keys(claimsData).length == 0 ? null : claimsData);

    // Update real-time database to notify client to force refresh.
    // Set the refresh time to the current UTC timestamp.
    // This will be captured on the client to force a token refresh.
    const metadataRef = app.database().ref('metadata/' + data.uid);
    await metadataRef.set({ refreshTime: new Date().getTime() });

    // Temporary - store user roles in a secure collection for use in firebase.rules until all users have migrated over to Claims Auth
    // - so even if someone overwrote their roles in the user collection it wouldn't matter
    // - needs to write false values in also, so they don't remain true in the object, until I move to set overwrite
    await db.doc('user_roles/' + data.uid).set({ roles: data.claims }, { merge: true });

    return { message: `Success, ${data.uid} has been made an admin` };
  } catch (error: any) {
    const e = error.errorInfo;
    throw new functions.https.HttpsError('internal', e.message, e.code);
  }
});
