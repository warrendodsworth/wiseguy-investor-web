import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as Stripe from 'stripe';
import { UserService } from '../shared/user.model';
import { getBadge, processTokens, sendMulticast } from '../notifs/notif-send.util';
import { environment } from '../../environments/environment';

const stripe = new Stripe.Stripe(functions.config().stripe.testkey);

// const stripe = require('stripe')(functions.config().stripe.testkey);
// https://firebase.google.com/docs/functions/typescript

export const createStripeCustomer = functions.firestore.document('/users/{userId}').onCreate((snap) => {
  const user = snap.data();

  return stripe.customers
    .create({
      email: user.email,
    })
    .then((customer: { id: any }) => {
      // / update database with stripe customer id
      admin.firestore().doc(`customers/${customer.id}`).set({ userId: user.uid });
      return admin.firestore().doc(`/users/${user.uid}`).update({ customerId: customer.id });
    });
});

export const createSubscription = functions.firestore.document('/subscriptions/{userId}').onCreate((snap, event) => {
  const subscription = snap.data();
  const tokenId = subscription.token;
  const userId = event.params.userId;

  if (!tokenId) throw new Error('token missing');

  return admin
    .firestore()
    .doc(`/users/${userId}`)
    .get()
    .then((snapshot) => snapshot.data())
    .then((user) => {
      return stripe.subscriptions.create({
        default_source: tokenId,
        customer: user?.customerId,
        items: [
          {
            plan: subscription.planId, // 'plan_DQ2S6CR2r9WcVz', //basic
          },
        ],
      });
    })
    .then((sub) => {
      admin.firestore().doc(`/subscriptions/${userId}`).update({ status: 'active', subscriptionId: sub.id });
      // admin.firestore().doc(`/users/${userId}`).update({ subscription: { status: 'active', plan: subscription.plan } })
    })
    .catch((err) => console.log(err));
});

export const updateSubscription = functions.firestore.document('/subscriptions/{userId}').onUpdate((snap, event) => {
  const subscription = snap.after.data();
  const subscriptionId = subscription.subscriptionId;
  const status = subscription.status;
  const userId = event.params.userId;

  if (status == 'cancelled') {
    return stripe.subscriptions
      .cancel(subscriptionId, { prorate: true })
      .then((sub) => {
        admin.firestore().doc(`/subscriptions/${userId}`).update({ currentPeriodEnd: sub.current_period_end });
        // admin.firestore().doc(`/users/${userId}`).update({ subscription: null })
      })
      .catch((err) => console.log(err));
  } else if (status == 'active') {
    // reactivate
    return stripe.subscriptions
      .update(subscriptionId)
      .then((sub) => {
        admin.firestore().doc(`/subscriptions/${userId}`).update({ currentPeriodEnd: null });
      })
      .catch((err) => console.log(err));
  }
});

export const notifyNewSubscriber = functions.firestore
  .document('subscribers/{subscriptionId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const userId = data.userId;
    const subscriber = data.subscriberId;

    const user = await UserService.getUser(userId);

    // Notification content
    const msg: admin.messaging.MulticastMessage = {
      tokens: processTokens(user.fcmTokens),
      notification: { title: `New Subscriber`, body: `Your now subscribed!` },
      apns: { payload: { aps: { badge: getBadge(user) } } }, // does it need to update and decrement badges hmm
      webpush: {
        fcmOptions: { link: environment.rootURL + '/app/tabs/accounts/' + user?.uid + '/membership' },
        notification: { icon: environment.iconURL },
      },
    };
    return sendMulticast(msg);
  });

// deprecated
export const heartCount = functions.firestore.document('hearts/{heartId}').onCreate((snap, context) => {
  const postId = snap.get('postId');

  admin
    .firestore()
    .collection('hearts')
    .where('postId', '==', postId)
    .onSnapshot((snap) => {
      admin
        .firestore()
        .doc(`posts/${postId}`)
        .onSnapshot((snap1) => {
          if (snap1.exists) {
            snap1.ref.update({ likes: snap.size });
          }
        });
    });
});
