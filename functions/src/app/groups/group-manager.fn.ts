import * as functions from 'firebase-functions';

import { db } from '../../main';
import { errors } from '../shared/util';
import { deleteCollection } from '../shared/utils.firebase';

/**
 * Update cascade Group details - name, photo to user docs in different collections
 */
export const updateGroupData = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;
  if (!data.groupId) throw errors.missingParam('Missing name');
  if (!data.name) throw errors.missingParam('Missing name');
  if (!data.photoURL) throw errors.missingParam('Missing photoURL');

  const memberSnap = await db.doc(`groups/${data.groupId}/members/${ctx.auth.uid}`).get();
  const member = memberSnap.data();
  if (member?.role != 'admin') {
    throw errors.unauthorized(`User is not a Group Admin`);
  } else if (!ctx.auth.token.admin) {
    throw errors.unauthorized(`Not an admin`);
  }

  const promises: Promise<any>[] = [];

  // Update Members User Doc Groups
  console.log('Update UserGroup data: ', data.groupId, ' User: ', data.name, data.photoURLThumb);

  const groupUsersSnap = await db.collection(`users`).where(`groups.${data.groupId}`, '!=', null).orderBy(`groups.${data.groupId}`).get();
  groupUsersSnap.forEach(s => {
    const userData: any = {
      [`groups.${data.groupId}.name`]: data.name,
      [`groups.${data.groupId}.photoURL`]: data.photoURLThumb || data.photoURL,
    };

    promises.push(s.ref.update(userData));
  });

  return Promise.all(promises);
});

export const onDeleteGroup = functions.firestore.document(`groups/{id}`).onDelete(async (snap, ctx) => {
  const groupId = ctx.params.id;

  // update group users
  // now: done by cascading onDeleteMember function
  // const groupSnap = await db.collection(`users`).where(`groups.${groupId}`, '==', '*').get();
  // groupSnap.forEach(snap1 => {
  //   snap1.ref.update({ [`groups.${groupId}`]: admin.firestore.FieldValue.delete() });
  // });

  // delete members subcollection
  return await deleteCollection(db, `groups/${groupId}/members`, 1000);
});
