import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import firebase from 'firebase/compat/app';

import { AppUser } from '../models/user';
import { AuthService } from './auth.service';
import { UtilService } from './util.service';

// resubscriribeTokensOnUserTopicChange - doesn't make sense because we don't allow adding topics without subscribing
/**
 * 1. req permission
 * 2. get token, save token, sub token to users topics
 * 3. listen for foreground notifs
 */

@Injectable({ providedIn: 'root' })
export class FCMBaseService {
  constructor(
    public messaging: AngularFireMessaging,
    public afs: AngularFirestore,
    public funcs: AngularFireFunctions,
    public auth: AuthService,
    public util: UtilService
  ) {}

  /** device ID token - recd. upon registration  */
  protected fcmToken: string;

  protected async updateTokenAndTopicSubs(user: AppUser, fcmToken: string) {
    if (!fcmToken || !user?.uid) {
      console.error('[fcm] token: ' + fcmToken, ' user: ' + user?.uid);
      return;
    }

    if (!(user.fcmTokens || []).includes(fcmToken)) {
      this.auth.set_(this.auth.oneRef(user.uid), { fcmTokens: firebase.firestore.FieldValue.arrayUnion(fcmToken) });
      console.log('[fcm] new token added: ' + fcmToken?.substring(0, 5) + '...' + fcmToken?.substring(-5, 5));
    }

    this.cleanTopics(user);
    await this.funcs.httpsCallable('notifs-subscribeToTopic')({ topics: user.topics, tokens: fcmToken }).toPromise();
  }

  /**
   * Topic helpers
   */
  async subscribeToTopics(topics: string | string[], tokens: string | string[], uid: string) {
    if (!(topics && tokens)) return;

    const res = await this.funcs.httpsCallable('notifs-subscribeToTopic')({ topics, tokens }).toPromise();
    if (uid) this.updateUserTopics(uid, topics, 'add');
    console.log(`[fcm] topics subscribed:`, topics, res);
  }

  async unsubscribeFromTopics(topics: string | string[], tokens: string | string[], uid: string) {
    if (!(topics && tokens)) return;

    const res = await this.funcs.httpsCallable('notifs-unsubscribeFromTopic')({ topics, tokens }).toPromise();
    if (uid) this.updateUserTopics(uid, topics, 'remove');
    console.log(`[fcm] topics unsubscribed:`, topics, res);
  }

  private async updateUserTopics(uid: string, topics: string | string[], mode: 'add' | 'remove'): Promise<void> {
    if (!uid) return null;
    if (!topics) return;

    let topicsFieldValue: any;
    if (mode == 'add') {
      topicsFieldValue = Array.isArray(topics)
        ? firebase.firestore.FieldValue.arrayUnion(...topics)
        : firebase.firestore.FieldValue.arrayUnion(topics);
    } else {
      topicsFieldValue = Array.isArray(topics)
        ? firebase.firestore.FieldValue.arrayRemove(...topics)
        : firebase.firestore.FieldValue.arrayRemove(topics);
    }

    await this.auth.update_(this.auth.oneRef(uid), { topics: topicsFieldValue }, { snackbar: false });
    console.log(`app:fcm topics ${mode}ed:`, topics);
  }

  private cleanTopics(user: AppUser) {
    user.topics = user.topics || [];
    user.topics.push('/topics/users');

    user.topics = [...new Set(user.topics)]; // dedupe
  }

  /**
   * Notify helpers
   */
  async notifyTopic(topic: string, title: string, body?: string, clickAction?: string) {
    await this.funcs.httpsCallable('notifs-notifyTopic')({ topic, title, body, clickAction }).toPromise();
  }

  async notifyUser(uid: string, title: string, body?: string, clickAction?: string) {
    await this.funcs.httpsCallable('notifs-notifyUser')({ uid, title, body, clickAction }).toPromise();
  }
}

// not using angular/fire, default browser apis
// private swRegistration: ServiceWorkerRegistration;

// showNotification(notification: Notification | any) {
//   const { title, body, icon, data, actions } = notification;
//   if (this.swRegistration) {
//     this.swRegistration.showNotification(title, { body, icon, data });
//   }
// }

// Old method of saving each as an object key
// private saveToken(user: User, token: string): void {
//   const currentTokens = user.fcmTokens || {};

//   if (!currentTokens[token]) {
//     const userRef = this.afs.doc(`users/${user.uid}`);
//     const tokens = { ...currentTokens, [token]: true };
//     userRef.update({ fcmTokens: tokens });
//   }
// }

// private saveNotification(data: any) {
//   const notifyCol = this.afs.collection('notifications/' + this._auth.currentUser.uid, (q) => q.orderBy('latest').limit(1));

//   const notifySub = notifyCol.valueChanges().subscribe((latestNotification) => {
//     const n = latestNotification[0] as any;

//     if (n == null || (n && n.title !== data.title)) {
//       data.timestamp = firebase.database.ServerValue.TIMESTAMP;
//       notifyCol.ref.add(data);
//     }
//     notifySub.unsubscribe();
//   });
// }

// testNotificationData: any = {
//   notification: {
//     title: 'New Subscriber',
//     body: 'Someone is following your content!',
//     icon: 'https://skaoss.blob.core.windows.net/brand/icon512.png',
//   },
//   collapse_key: 'do_not_collapse',
//   from: '515731833571',
//   to:
//     'eijcuH8xmn0:APA91bE-hTUHa7pzbXTtKcuAE8kmg87e9anELCIJOR8yXcJPta9-6fYM0YNrajNIOVel9Ivka5Qn4Vbd33RTm_xbT06ByqP86HysE9fqvYZzeXevMoVIr9cuZ1wMKZlBmL9Vx0xDt8dR',
// };
