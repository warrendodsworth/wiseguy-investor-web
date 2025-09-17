import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';

import { environment } from '../../environments/environment';
import { db } from '../../main';
import { getBadge, processTokens, sendMulticast } from '../notifs/notif-send.util';
import { UserService } from '../shared/user.model';

const reminderMap = {
  1: 'Don’t forget to accept #name’s chat request 🙂 ',
  2: '#name is keen to hear from you 🙏',
  3: 'How are things? #name’s chat request is waiting for you',
  5: 'Are you still open to responding to X?',
  7: '#name is still waiting to hear from you, please respond 🙏',
};

/**
 * Find chats with status requested within the last 1 week
 * maybe save last reminder sent
 */
export const chatRequestReminders = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('Australia/Sydney')
  .onRun(async (_event) => {
    const promises: Promise<any>[] = [];
    const oneWeekAgo = DateTime.now().minus({ weeks: 1 });

    const chatsToNotify = await db
      .collection('chats')
      .where('status', '==', 'requested')
      .where('editDate', '>=', oneWeekAgo.toJSDate())
      .get();

    chatsToNotify.forEach(async (snap) => {
      const chat = snap.data();
      const requestedDaysAgo = DateTime.fromSeconds(chat.editDate.seconds).diffNow().as('days').toPrecision(1);

      console.log(`Reminder: chatRequestedDaysAgo - `, chat.id, requestedDaysAgo, reminderMap[requestedDaysAgo]);

      const message = reminderMap[requestedDaysAgo];
      if (message) {
        const user = await UserService.getUser(chat.toUid);
        const title = 'Friendly Chat Request Reminder 💁';
        const body = message.replace('#name', chat.fromFirstName);

        promises.push(notifyUser(user, title, body));
        promises.push(snap.ref.update('reminderSent', requestedDaysAgo));
      }
    });

    return Promise.all(promises);
  });

// Notif
const notifyUser = (user: any, title: string, body: string): Promise<any> => {
  const msg: admin.messaging.MulticastMessage = {
    tokens: processTokens(user.fcmTokens),
    notification: { title, body },
    apns: { payload: { aps: { badge: getBadge(user) } } },
    webpush: { fcmOptions: { link: environment.rootURL + '/' }, notification: { icon: environment.iconURL } },
  };
  return sendMulticast(msg);
};
