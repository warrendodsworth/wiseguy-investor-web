// import busboy, { Busboy } from 'busboy';
// import * as functions from 'firebase-functions';

// import { auth } from '../../main';
// import { UserService } from '../shared/user.model';

// /**
//  * trainingComplete function is called by jotform webhook
//  * - https://firebase.google.com/docs/functions/terminate-functions
//  */
// export const trainingCompleteJotFormWebhook = functions.https.onRequest(async (req, res) => {
//   const bb = busboy({ headers: req.headers as any });
//   const userEmail = await parseJotFormData(bb, req);

//   const user = await auth.getUserByEmail(userEmail);
//   if (user) {
//     await UserService.userRef(user.uid).update({ ['mateJoin.trainingComplete']: true });
//     functions.logger.info('mate Join Status: trainingComplete', user.uid);
//     res.status(200).send();
//   } else {
//     functions.logger.info('User not found');
//     res.statusMessage = 'User not found';
//     res.status(404).send();
//   }
// });

// async function parseJotFormData(bb: Busboy, request: functions.https.Request) {
//   const formData = {};
//   bb.on('field', (fieldname: string | number, value: any) => {
//     formData[fieldname] = value;
//     // functions.logger.info(fieldname, value);
//   });

//   let userEmail = '';
//   bb.on('finish', async () => {
//     const emailFromRaw = JSON.parse(formData['rawRequest']);
//     userEmail = emailFromRaw.q1_email; // questionN_fieldName
//     // functions.logger.info(emailFromRaw.q1_email);
//   });

//   if (request.rawBody) {
//     bb.end(request.rawBody);
//   } else {
//     request.pipe(bb);
//   }

//   return userEmail;
// }

// /**
//  * User counter
//  * Notify admins on signup
//  */
// // needs to be in an app-meta sub doc - else it would trigger a read for everyone
// // const appRef = db.doc('app_meta/' + 'appname');
// // promises.push(appRef.set({ signupCount: admin.firestore.FieldValue.increment(1) }, { merge: true }));

// // * groups - idea, in future get appId from userDoc and increment that app's count
// // const user = snap.data();
// // const appId = user.appId

// // @deprecated - done in google analytics - temp
// // const adminsRef = await db.collection('users').where('roles.admin', '==', true).get();
// // adminsRef.forEach(snap => {
// //   const user = snap.data();

// //   const title = `New Signup 💁`;
// //   const body = newUser.displayName;

// //  const msg: admin.messaging.MulticastMessage = {
// //    tokens: processTokens(user.fcmTokens),
// //    notification: { title, body },
// //    apns: { payload: { aps: { badge: getBadge(user) } } },
// //    webpush: { fcmOptions: { link: environment.rootURL + '/' } },
// //  };
// //  promises.push(messaging.sendMulticast(msg));
// // });
