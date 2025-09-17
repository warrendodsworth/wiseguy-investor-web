import admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { DateTime } from 'luxon';

import { environment } from '../../environments/environment';
import { app } from '../../main';
import { getBadge, processTokens, sendMulticast } from '../notifs/notif-send.util';

/**
 * find users with mateActive and editDate < 2 weeks ago
 * lastActiveDate - updated on app open
 */
export const disableStaleMates = onSchedule(
  {
    schedule: '0 0 * * *',
    timeZone: 'Australia/Sydney',
  },
  async (event) => {
    const promises: Promise<any>[] = [];
    const db = app.firestore();
    const twoWeeksAgo = DateTime.now().minus({ weeks: 2 });
    const threeWeeksAgo = DateTime.now().minus({ weeks: 3 });
    const fiveWeeksAgo = DateTime.now().minus({ weeks: 5 });

    // 2 week mark notify
    const usersToNotify = await db
      .collection('users')
      .where('mateActive', '==', true)
      .where('lastActiveDate', '<', twoWeeksAgo.toJSDate())
      .get();

    console.log('Notifying the following users:');

    usersToNotify.forEach((snap) => {
      const user = snap.data();
      const lastActiveDate = DateTime.fromSeconds(user.lastActiveDate.seconds);
      promises.push(notifyStaleMate(user, StaleMateType.Notify2Weeks));

      console.log(
        'Reminder 1: ',
        user.displayName,
        ' Last active date: ' + lastActiveDate.toISODate(),
        ': ' + lastActiveDate.diffNow().negate().as('days').toFixed() + ' days ago'
      );
    });

    // 3 week mark notify and deactivate
    const usersToDeactivate = await db
      .collection('users')
      .where('mateActive', '==', true)
      .where('lastActiveDate', '<', threeWeeksAgo.toJSDate())
      .get();

    console.log('\n \nDeactivating the following users:');

    usersToDeactivate.forEach((snap) => {
      const user = snap.data();
      const lastActiveDate = DateTime.fromSeconds(user.lastActiveDate.seconds);
      promises.push(snap.ref.update({ mateActive: false, deactivateDate: DateTime.now().toJSDate() })); // add a new deactivated date field
      promises.push(notifyStaleMate(user, StaleMateType.NotifyAndDeactivate));

      console.log(
        'Deactivate: ',
        user.displayName,
        ' Last active date: ' + lastActiveDate.toISODate(),
        ': ' + lastActiveDate.diffNow().negate().as('days').toFixed() + ' days ago'
      );
    });

    // 5 week mark notify - reminder
    const usersToRemind = await db
      .collection('users')
      .where('mateActive', '==', false)
      .where('deactivateDate', '<', fiveWeeksAgo.toJSDate())
      .get();

    console.log('\n \nReminding the following users:');

    usersToRemind.forEach((snap) => {
      const user = snap.data();
      const deactivateDate = DateTime.fromSeconds(user.deactivateDate.seconds);

      promises.push(notifyStaleMate(user, StaleMateType.Remind));

      console.log(
        'Reminder Last: ',
        user.displayName,
        ' Deactivate date: ' + deactivateDate.toISODate(),
        ': ' + deactivateDate.diffNow().negate().as('days').toFixed() + ' days ago'
      );
    });

    Promise.all(promises);
  }
);

/**
 * Helpers
 */

const notifyStaleMate = (user: any, type: StaleMateType): Promise<any> => {
  let title: string;
  let body: string;

  if (type == StaleMateType.Notify2Weeks) {
    title = 'We noticed you haven’t been active on the app in 2 weeks 💁';
    body = `Just letting you know we will be deactivating your Mate profile in 2 weeks so you don't receive any chat requests for now. You can always reactivate in your profile settings`;
  } else if (type == StaleMateType.NotifyAndDeactivate) {
    title = 'We noticed you haven’t been active on the app in 3 weeks 💁';
    body = `Just letting you know we have deactivated your Mate profile so you don’t receive any chat requests for now. You can always reactivate in your profile settings.`;
  } else {
    // Remind
    title = 'We noticed you haven’t been active on the app in a few weeks 💁';
    body = `Just letting you know we have deactivated your Mate profile so you don’t receive any chat requests for now. You can always reactivate in your profile settings.`;
  }

  console.log(`NotifyStaleMate: ${user.displayName} ${type}`);
  const msg: admin.messaging.MulticastMessage = {
    tokens: processTokens(user.fcmTokens),
    notification: { title, body },
    apns: { payload: { aps: { badge: getBadge(user) } } },
    webpush: { fcmOptions: { link: environment.rootURL + '/' }, notification: { icon: environment.iconURL } },
  };
  return sendMulticast(msg);
};

enum StaleMateType {
  Notify2Weeks,
  NotifyAndDeactivate,
  Remind,
}
