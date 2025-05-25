import * as functions from 'firebase-functions';

import { app } from '../../main';

/**
 * correct chat unread counts - temporary cleanup function
 */
export const chatCorrectUnreadCounts = functions.pubsub
  .schedule('0 0 * * 1/1')
  .timeZone('Australia/Sydney')
  .onRun(async (_event) => {
    const db = app.firestore();

    const usersRef = db.collection(`users`).where('chatUnreadCount', '>', 0);
    const usersSnap = await usersRef.get();

    console.log(`User Count: `, usersSnap.size);
    const promises = usersSnap.docs.map(async (userSnap) => {
      const user = userSnap.data();

      // go through the chats of this user
      const userChats = await db.collection('chats').where(`uids.${userSnap.id}`, '==', true).get();
      let chatUnreadCount = 0;
      userChats.forEach((chatSnap) => {
        const chat = chatSnap.data();
        chat.usersUnreadCount = chat.usersUnreadCount || {};
        chatUnreadCount += chat.usersUnreadCount[userSnap.id] || 0;
      });

      const corrected = user.chatUnreadCount != chatUnreadCount ? '🟢' : '';
      console.log(
        `User: `,
        user.displayName,
        ' chatUnreadCount:',
        user.chatUnreadCount,
        ` corrected:`,
        chatUnreadCount + ' ',
        corrected
      );

      if (corrected) {
        return userSnap.ref.update({ chatUnreadCount });
      }
      return Promise.resolve();
    });

    return Promise.all(promises);
  });
