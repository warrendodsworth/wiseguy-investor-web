import 'firebase/messaging';

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FcmService {
  private messaging;
  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable(); // message observable to show in Angular component

  testNotificationData: any = {
    notification: {
      title: 'New Subscriber',
      body: 'Someone is following your content!',
      icon: 'https://skaoss.blob.core.windows.net/brand/icon512.png',
    },
    collapse_key: 'do_not_collapse',
    from: '515731833571',
    to:
      'eijcuH8xmn0:APA91bE-hTUHa7pzbXTtKcuAE8kmg87e9anELCIJOR8yXcJPta9-6fYM0YNrajNIOVel9Ivka5Qn4Vbd33RTm_xbT06ByqP86HysE9fqvYZzeXevMoVIr9cuZ1wMKZlBmL9Vx0xDt8dR',
  };

  constructor(public afs: AngularFirestore, public _auth: AuthService) {
    if (firebase.messaging.isSupported()) {
      this.messaging = firebase.messaging();
    }
  }

  async setupFCMToken(user) {
    try {
      if (!firebase.messaging.isSupported()) {
        return;
      }

      const app = !document.URL.startsWith('http');
      if (!app) {
        const registration = await navigator.serviceWorker.register('firebase-messaging-sw.js');
        this.messaging.useServiceWorker(registration);

        await this.messaging.requestPermission();
        const token = await this.messaging.getToken();
        this.upsertToken(user, token);

        // update token on refresh
        this.messaging.onTokenRefresh(async () => {
          const token = await this.messaging.getToken();
          this.upsertToken(user, token);
        });
      }
    } catch (error) {
      console.error('[fcm] get & save token', error);
    }
  }

  listenToNotifications() {
    if (!firebase.messaging.isSupported()) {
      return;
    }

    this.messaging.onMessage(payload => {
      console.log('[fcm] notification recived', payload);
      this.messageSource.next(payload);
    });
  }

  private upsertToken(user, token): void {
    if (!user) {
      return;
    }

    const currentTokens = user.fcmTokens || {};

    if (!currentTokens[token]) {
      const userRef = this.afs.doc(`users/${user.uid}`);
      const tokens = { ...currentTokens, [token]: true };

      userRef.update({ fcmTokens: tokens });

      console.log('[fcm] token saved', token.substring(0, 5));
    }
  }

  async saveNotification(user: User, data) {
    const notifySnaps = await this.afs
      .collection(`notifications/${user.uid}`, q => q.orderBy('timestamp').limit(1))
      .get()
      .pipe(map(x => x.docs.map(d => d)))
      .toPromise();

    // Prevent duplicate entry - get last notification to compare to incoming
    const last = notifySnaps[0].data();

    if (last == null || (last && last.title != data.title)) {
      // && o.body != data.body
      data.timestamp = firebase.database.ServerValue.TIMESTAMP;

      this.afs.collection(`notifications/${user.uid}`).add(data);
    }
  }
}

// Tutorial - https://angularfirebase.com/lessons/push-messages-with-firestore/
