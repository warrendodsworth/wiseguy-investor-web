import 'firebase/compat/messaging';

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import firebase from 'firebase/compat/app';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { FCMBaseService } from './fcm.service';
import { UtilService } from './util.service';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class FCMWebService extends FCMBaseService {
  constructor(
    public messaging: AngularFireMessaging,
    public afs: AngularFirestore,
    public funcs: AngularFireFunctions,
    public auth: AuthService,
    public util: UtilService
  ) {
    super(messaging, afs, funcs, auth, util);

    if (!Capacitor.isNativePlatform()) {
      this.init();
    }
  }
  private destroy$ = new Subject();

  private init() {
    this.auth.afAuth.authState.pipe(delay(3000)).subscribe(async (user) => {
      if (user) {
        this.requestPermission();
        this.listenForegroundNotifications();
      } else {
        console.log('app:fcm-web logged out, shutting down listeners');
        this.destroy$.next(null);
        this.destroy$.complete();
      }
    });
  }

  /**
   * request permission + save device token
   */
  private async requestPermission() {
    if (!this.browserCheck()) return;

    this.messaging.requestToken.pipe(takeUntil(this.destroy$)).subscribe(async (token) => {
      console.log('app:fcm-web push registration success, token: ' + token);

      const user = await this.auth.currentUser_;
      this.fcmToken = token;
      if (user?.uid) {
        this.updateTokenAndTopicSubs(user, token);
      }
    });
  }

  /**
   * recieve & show "foreground" notifs | firebase-messaging-sw.js will handle "background" notifs
   */
  private listenForegroundNotifications() {
    if (!this.browserCheck()) return;

    this.messaging.messages.pipe(takeUntil(this.destroy$)).subscribe((msg: any) => {
      // console.log('app:fcm foreground message', msg);

      const notif: any = msg.notification;
      if (notif) {
        this.util.openSnackbar(notif.title, notif.body, 3000);
      } else if (msg.body || msg.title) {
        this.util.openSnackbar(msg.title, msg.body, 3000);
      }
    });
  }

  /**
   * Can I Use checks
   */
  private browserCheck() {
    if (!window.Notification) {
      console.log('[fcm] This browser does not support notifications!');
      return false;
    }
    if (!window.ServiceWorker) {
      console.log('This browser does not support service workers!');
      return false;
    }
    if (!firebase.messaging.isSupported()) {
      console.log('[fcm] firebase messaging not supported');
      return false;
    }

    return true;
  }
}
