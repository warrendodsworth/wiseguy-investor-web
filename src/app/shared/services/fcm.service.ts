import 'firebase/messaging';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireMessaging } from '@angular/fire/messaging';
import * as firebase from 'firebase/app';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/shared/models/user';

import { AuthService } from './auth.service';
import { UtilService } from './util.service';

@Injectable({ providedIn: 'root' })
export class FcmService {
  constructor(
    public afMessaging: AngularFireMessaging,
    public afs: AngularFirestore,
    public funcs: AngularFireFunctions,
    public afAuth: AngularFireAuth,
    public authService: AuthService,
    public util: UtilService
  ) {
    if (firebase.messaging.isSupported()) {
      this.messaging = firebase.messaging();
    }
  }
  private messaging: firebase.messaging.Messaging;

  get currntMessage$(): Observable<Notification> {
    return this.messageSource.asObservable();
  }

  private messageSource = new Subject<Notification>();
  private swRegistration: ServiceWorkerRegistration;
  private initialized = false;
  private token: string;

  notifications: Notification[] = [];
  notificationCount: number;

  async showMessages() {
    if (!('ServiceWorker' in window)) {
      console.log('This browser does not support service workers!');
      return;
    }

    this.swRegistration = await navigator.serviceWorker.getRegistration();

    if (this.swRegistration) {
      firebase.messaging().useServiceWorker(this.swRegistration);

      this.afMessaging.messages.subscribe(msg => {
        console.log('[fcm] message', msg);
        const notification = (msg as any).notification;
        this.util.newToast(notification.body);
      });
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications!');
      return;
    }

    if (!firebase.messaging.isSupported()) {
      return;
    }

    if (this.initialized) {
      return;
    }

    this.afMessaging.requestToken.subscribe(token => {
      this.initialized = true;
      this.token = token;
      this.saveToken(this.authService.currentUser, token);
    });
  }

  async sendTestTopicNotification(topic: string = 'events', body?: string) {
    await this.funcs
      .httpsCallable('sendTestTopicNotification')({ topic, body })
      .toPromise();
    console.log(`test notification sent to ${topic}`);
  }

  async sub(topic: string) {
    await this.funcs
      .httpsCallable('subscribeToTopic')({ topic, token: this.token })
      .toPromise();
    console.log(`subscribed to ${topic}`);
  }

  async unsub(topic: string) {
    await this.funcs
      .httpsCallable('unsubscribeFromTopic')({ topic, token: this.token })
      .toPromise();
    console.log(`unsubscribed from ${topic}`);
  }

  showNotification(notification: Notification | any) {
    // tslint:disable-next-line: prefer-const
    let { title, body, icon, data, actions } = notification;
    icon = '/assets/img/labor_academy_logo_white_stacked.png';

    const n = (notification as any) as Notification;

    this.messageSource.next(n);
    this.notifications.push(n);

    this.notificationCount = this.notifications.length;

    if (this.swRegistration) {
      this.swRegistration.showNotification(title, { body, icon, data, actions });
    }
  }

  private saveToken(user: User, token: string): void {
    const currentTokens = user.fcmTokens || {};

    if (!currentTokens[token]) {
      const userRef = this.afs.doc(`users/${user.uid}`);
      const tokens = { ...currentTokens, [token]: true };
      userRef.update({ fcmTokens: tokens });
    }

    console.log('[fcm] token saved - ' + token.substr(0, 5) + '...' + token.substr(-5, 5), token);
  }

  private saveNotification(data: any) {
    const notifyCol = this.afs.collection('notifications/' + this.authService.currentUser.uid, q => q.orderBy('latest').limit(1));

    const notifySub = notifyCol.valueChanges().subscribe(latestNotification => {
      const n = latestNotification[0] as any;

      if (n == null || (n && n.title !== data.title)) {
        data.timestamp = firebase.database.ServerValue.TIMESTAMP;
        notifyCol.ref.add(data);
      }
      notifySub.unsubscribe();
    });
  }
}

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
