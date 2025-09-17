import * as functions from 'firebase-functions';

import { app } from '../../main';

/**
 * on delete user account
 */
export const onDeleteAccount = functions.auth.user().onDelete(async (user, ctx) => {
  const promises: Promise<any>[] = [];
  const uid = user.uid;
  const db = app.firestore();
  const batch = db.batch();

  const appUserDoc = await db.doc('users/' + uid).get();
  const appUser: any = appUserDoc.data();

  // delete, keep if this person has been reported and the reports on them for safety reasons

  // user status: deleted - unsure if we should wipe basic data
  batch.update(db.doc('users/' + uid), { status: 'deleted' });

  // blocklist
  batch.delete(db.doc(`user_blocking/` + uid));

  // groups
  const groupIds = Object.keys(appUser.groups || {});
  groupIds.forEach((gid) => batch.delete(db.doc(`groups/${gid}/members/${uid}`)));

  // chats, messages - pause
  // const userChatDocs = await db.collection(`chats`).where(`uids.${uid}`, '==', true).get();
  // userChatDocs.forEach(s => {
  //   deleteCollection(db, `chats/${s.id}/messages`, 10000);
  //   batch.delete(s.ref);
  // });

  // issues
  const issueDocs = await db.collection(`issues`).where('createUid', '==', uid).get();
  issueDocs.forEach((s) => batch.delete(s.ref));

  promises.push(batch.commit());
  return Promise.all(promises);
});
