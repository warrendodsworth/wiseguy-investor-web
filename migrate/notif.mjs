import { FieldValue } from '@google-cloud/firestore';
import { app, auth, db, messaging, adminsProd, printUser, processTokens } from './main.mjs';

console.log('Running notifs.mjs');
resubUsersToTopics();

async function resubUsersToTopics() {
  const topic = `/topics/users`;
  const usersSnap = await db.collection(`users`).get();

  usersSnap.docs.forEach(async (snap) => {
    const user = { id: snap.id, ...snap.data() };

    user.fcmTokens = processTokens(user.fcmTokens);

    if (user.fcmTokens.length > 0) {
      try {
        const res = await messaging.subscribeToTopic(user.fcmTokens, topic);

        if (res?.failureCount > 0) {
          const failedTokens = [];
          const tokensToRemove = [];

          res.errors.forEach((err) => {
            // Cleanup the tokens which are not registered anymore.
            if (
              err.error?.code === 'messaging/invalid-registration-token' ||
              err.error?.code === 'messaging/registration-token-not-registered'
            ) {
              tokensToRemove.push(user.fcmTokens[err.index]);
            }
            failedTokens.push(user.fcmTokens[err.index]);
          });

          // Remove invalid tokens
          if (tokensToRemove.length > 0) {
            await snap.ref.update({ fcmTokens: FieldValue.arrayRemove(...tokensToRemove) });

            console.log(`Bad tokens`, tokensToRemove.length);
            console.log(`Good tokens ` + user.fcmTokens.filter((t) => !tokensToRemove.includes(t)).length);
            console.log(user.id);
            console.log(tokensToRemove);
          }
        }
      } catch (error) {
        console.log('err subscribeToTopic: ', user.uid, user.fcmTokens);
      }
    }
  });
}

async function cleanUserNotifProps() {
  const usersSnap = await db.collection('users').get();
  let count = 0;

  usersSnap.forEach(async (snap) => {
    const user = { id: snap.id, ...snap.data() };
    const tokens = processTokens(user.fcmTokens);

    if (tokens.length == 0) {
      // snap.ref.update({ uid: snap.id });
      printUser(user);
      count++;
    }
  });

  console.log(`Count : `, count);
}

export async function sendMulticast(msg, uid) {
  if (!environment.notify) {
    return Promise.resolve();
  }
  if (!msg.tokens || msg.tokens?.length == 0) {
    return functions.logger.info(`Tokens null or empty`);
  }

  const batchResponse = await messaging.sendMulticast(msg);

  if (batchResponse.failureCount > 0) {
    const failedTokens = [];
    const tokensToRemove = [];

    batchResponse.responses.forEach((res, idx) => {
      if (!res.success) {
        // Cleanup the tokens which are not registered anymore.
        if (
          res.error?.code === 'messaging/invalid-registration-token' ||
          res.error?.code === 'messaging/registration-token-not-registered'
        ) {
          tokensToRemove.push(msg.tokens[idx]);
        }
        // console.log(`err: `, res.error?.code, res.error?.message, msg.tokens[idx]);
        // note: title, body can't be a number AND token can't be any 'RandomString' -> messaging/invalid-argument err
        failedTokens.push(msg.tokens[idx]);
      }
    });

    // Remove invalid tokens
    console.log(`Summary sendMulticast - uid: ${uid}`);
    console.log('- tokens:', msg.tokens?.length, ' success:', batchResponse.successCount);

    if (tokensToRemove.length > 0) {
      if (uid) {
        await db.doc('users/' + uid).update({ fcmTokens: FieldValue.arrayRemove(...tokensToRemove) });
      }

      console.log(`- tokens to remove:`, tokensToRemove.length, 'failed tokens:', failedTokens.length);
      console.log(tokensToRemove);
    }
  }

  return batchResponse;
}

async function restoreTokens() {
  const users = [
    {
      uid: '05sVknRMR3VBNrfcwwZJBpsgXgh2',
      fcmTokens: [
        'eP7sgVtNRGyYtDnyGPkkcG:APA91bEB3Wa9r4ncUYYl5jMA4YFtIOs2iLaRx69l_3hvCQkZH-_lTf5sns5z99gu0NGkqG1Z0mhaGqkE5Dz6MWeI4c3pJp1fkN0JpGLpYkaJJh_nYZm49QZhgZZYjjJ8_foXcSIw7CUL',
      ],
    },
  ];

  const uids = users.map((u) => u.uid);
  const usersSnap = await db.collection(`users`).limit(50).get();

  console.log('Query Count :', usersSnap.size, users.length);

  usersSnap.docs.forEach(async (snap) => {
    //
    if (uids.includes(snap.id)) {
      printUser(snap.data());

      const user = users.find((u) => u.uid == snap.id);

      await snap.ref.update({ fcmTokens: FieldValue.arrayUnion(...user.fcmTokens) });
    }
  });
}
