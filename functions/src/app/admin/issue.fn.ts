import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { environment } from '../../environments/environment';
import { db } from '../../main';
import { getBadge, processTokens, sendMulticast } from '../notifs/notif-send.util';

export const onIssueCreate = functions.firestore.document('issues/{id}').onCreate(async (snap, ctx) => {
  const data = snap.data();
  const promises: Promise<any>[] = [];

  // notify admins
  const adminDocs = await db.collection('users').where('roles.admin', '==', true).get();
  adminDocs.forEach(snap => {
    const user: any = { ...snap.data(), id: snap.id };

    const msg: admin.messaging.MulticastMessage = {
      tokens: processTokens(user.fcmTokens),
      notification: { title: `Issue reported`, body: data.description },
      apns: { payload: { aps: { badge: getBadge(user) } } },
      webpush: { fcmOptions: { link: environment.rootURL + '/admin/issues' }, notification: { icon: environment.iconURL } },
    };

    promises.push(sendMulticast(msg, snap.id));
  });

  return Promise.all(promises);
});

export const onSupportCreateTempMigration = functions.firestore.document('support/{id}').onCreate(async (snap, ctx) => {
  const data = snap.data();
  const id = ctx.params.id;
  const batch = db.batch();

  batch.create(db.doc('issues' + id), data);

  return batch.commit();
});
