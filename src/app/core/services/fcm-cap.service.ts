import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { LocalNotifications } from '@capacitor/local-notifications';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  RegistrationError,
  Token,
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
// import { Badge } from '@robingenz/capacitor-badge';
import { async, Subject } from 'rxjs';
import { count, debounceTime, delay, takeUntil } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ErrorService } from './error.service';
import { FCMBaseService } from './fcm.service';
import { UtilService } from './util.service';

/**
 * Cap 3 - https://capacitorjs.com/docs/guides/push-notifications-firebase
 * Android fix https://github.com/ionic-team/capacitor-plugins/pull/395
 */

/**
 * 1. req permission
 * 2. get token, save token, sub token to users topics
 * 3. listen for foreground notifs
 */
@Injectable({ providedIn: 'root' })
export class FCMCapacitorService extends FCMBaseService {
  constructor(
    public messaging: AngularFireMessaging,
    public analytics: AngularFireAnalytics,
    public funcs: AngularFireFunctions,
    public afs: AngularFirestore,
    public auth: AuthService,
    public error: ErrorService,
    public util: UtilService
  ) {
    super(messaging, afs, funcs, auth, util);

    if (Capacitor.getPlatform() != 'web') {
      this.init();
    }
  }
  private destroy$ = new Subject();

  private init() {
    this.auth.afAuth.authState.pipe(delay(3000)).subscribe(async (user) => {
      if (user) {
        this.requestPermission();
        this.listenForegroundNotifications();
        this.manageBadges();
      } else {
        console.log('app:fcm-cap logged out, shutting down listeners');
        await PushNotifications.removeAllListeners();
        this.destroy$.next(0);
        this.destroy$.complete();
      }
    });
  }

  /**
   * request permission + save device token
   */
  async requestPermission() {
    // Request permission to use push notifications - iOS will prompt user & Android will grant without prompting
    const pushPerm = await PushNotifications.requestPermissions();
    console.log('app:fcm-cap request push perm', pushPerm);

    // const badgePerm = await Badge.requestPermissions();
    // console.log('app:fcm-cap request badge perm', badgePerm);

    // On success, we should be able to receivew notifications
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('[fcm-cap] Push registration success, token: ' + token.value);

      const user = await this.auth.currentUser_;
      this.fcmToken = token.value;
      this.updateTokenAndTopicSubs(user, token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (ev: RegistrationError) => {
      this.error.logError('device_registration_error', ev.error, null);
    });

    if (pushPerm.receive == 'granted') {
      // Register with Apple / Google to receive push via APNS/FCM
      await PushNotifications.register();
      console.log('[fcm-cap] registered for push');
    } else {
      this.util.openSnackbar(
        'Hi there',
        `If you give us notification permissions we could update you when you're not in the app`,
        5000
      );
    }
  }

  /**
   * recieve & show "foreground" notifs
   */
  private listenForegroundNotifications() {
    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notif: PushNotificationSchema) => {
      this.util.openSnackbar(notif.title, notif.body, 3000);
      console.log('[fcm-cap] Push received: ' + JSON.stringify(notif));
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notif: ActionPerformed) => {
      console.log('[fcm-cap] Push action performed: ' + JSON.stringify(notif));
    });

    //? clear on app start
    // PushNotifications.removeAllDeliveredNotifications();
  }

  private manageBadges() {
    this.auth.currentUser$.pipe(debounceTime(1000), takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        const count = user.chatUnreadCount; // + user.chatRequestCount;
        // Badge.set({ count });

        // patch that android needs to set badge count to 0 - https://github.com/capawesome-team/capacitor-badge/discussions/26 - in this case we're clearing it when 0 notifs
        if (count <= 0 && Capacitor.getPlatform() == 'android') LocalNotifications.schedule({ notifications: [] });

        console.log('[fcm-cap] Notif Badge count update:', count);
      } else {
        // Badge.set({ count: 0 });
        if (Capacitor.getPlatform() == 'android') LocalNotifications.schedule({ notifications: [] });
      }
    });
  }
}
