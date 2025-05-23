import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';

import { AppUser, Subscriptions, UserPrivate } from '../models/user';
import { BaseFirestoreService, SetOptions } from './base-firestore.service';
import { mapObjectISOs, now } from './date.service';
import { UtilService } from './util.service';

/**
 * Custom claims
 * First Admins claims initialized via firebase admin sdk - migrate.js
 * After that Admins can update any User's roles via the UI
 */

@Injectable({ providedIn: 'root' })
export class AuthStore extends BaseFirestoreService {
  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    protected rtdb: AngularFireDatabase,
    protected funcs: AngularFireFunctions,
    public util: UtilService
  ) {
    super(afs, afAuth, util);

    this.currentUser$ = this.afAuth.authState.pipe(
      tap((user) => {
        if (user) {
          // execute once on app open or login
          // using setTimeout as this causes a timing issue with auth.loginFirebase:
          // - getUser returns the first() in the stream which is just {id, last active, randomizer}
          setTimeout(() => {
            this.oneRef(user.uid).set({ lastActiveDate: now(), randomizer: Math.floor(Math.random() * 10000) } as AppUser, {
              merge: true,
            });
          }, 2560);

          this.listenIdTokenRefresh(user);
        } else {
          this.destroy$.next(null);
          this.destroy$.complete();
        }
      }),
      switchMap((user) => {
        if (user) {
          return this.one$(user.uid).pipe(
            map((u) => {
              if (u) {
                u.email = user.email;
                u.uid = user.uid;
                u.isAnonymous = user.isAnonymous;
              }
              return u;
            }),
            distinctUntilChanged(),
            shareReplay(1)
          );
          // .pipe(tap(() => console.count('auth:user doc read')));
        } else {
          return of<AppUser>(null);
        }
      }),
      switchMap((appUser) => {
        // idTokenRefresh handler - positioned here so the hourly refresh doesn't trigger a doc read for all users
        if (!appUser) return of<AppUser>(null);

        return afAuth.idTokenResult.pipe(
          map((idTokenResult) => {
            if (idTokenResult) {
              const { claims } = idTokenResult;
              this.mapClaimsToRoles(appUser, claims);

              // subscriptions to a plan can be determined from their claim and mapped into a plans object regardless of payment platform here
              appUser.subscriptions = appUser.subscriptions || new Subscriptions();
              appUser.subscriptions.plus = claims.stripeRole == 'plus' || false;
              // console.log(`stripeRole:`, claims.stripeRole);

              return appUser;
            } else {
              return null;
            }
          })
        );
      }),
      shareReplay(1)
    );
  }
  private destroy$ = new Subject();
  currentUser$: Observable<AppUser>;
  get currentUser_() {
    return this.currentUser$
      .pipe(
        filter((u) => !!u?.id),
        first()
      )
      .toPromise();
  }

  oneRef = (uid: string) => this.doc<AppUser>(`users/${uid}`);
  one$ = (uid: string) => this.doc$<AppUser>(`users/${uid}`);

  privateRef = (uid: string) => this.doc<UserPrivate>(`user_meta/${uid}`);
  private$ = (uid: string) => this.doc$<UserPrivate>(`user_meta/${uid}`);
  private_ = (uid: string) => this.doc_<UserPrivate>(`user_meta/${uid}`);

  /**
   * get user or currentUser (if no uid provided).
   * note: shareReplay from this pipe - doesn't cut reads
   */
  getUser$<T extends AppUser>(uid?: string) {
    return (uid ? this.one$(uid) : this.currentUser$).pipe(map((u) => u as T));
  }
  getUser<T extends AppUser>(uid?: string) {
    return this.getUser$<T>(uid).pipe(first()).toPromise();
  }
  getUserById(uid: string) {
    return this.doc<AppUser>(`users/${uid}`)
      .get({ source: 'server' })
      .pipe(
        first(),
        map((doc) => (doc.data() ? ({ ...doc.data(), id: doc.id } as AppUser) : null)),
        mapObjectISOs()
      )
      .toPromise();
  }

  /**
   * Migrating to roles.mate - keep the old prop value mateVerified up to date - so old version app users will see an accurate value
   * We still have to run the update function mateVerified > roles.mate to translate as new mates are verified - last done - Aug 23
   * If none are verified with the old app, then we're good
   *
   * - todo If not mate anymore
   * unsub user from mate topic
   * this.fcm.unsubscribeFromTopics(this.fcm.mateTopic, user.fcmTokens);
   */
  async updateUser(user: AppUser, options?: Partial<SetOptions>) {
    user.roles = user.roles || {};

    // if (user.birthday) user.birthday = user.birthday; // conversion toTimestamp handled by base-firestore-service

    // patch incase count ever gets decremented too much
    if (user.chatUnreadCount < 0) user.chatUnreadCount = 0;
    if (user.chatRequestCount < 0) user.chatRequestCount = 0;
    // backups incase of onboarding issue
    // user.mate = user.mate || new MateData();
    if (!user.chatRequestsMade) user.chatRequestsMade = {};

    const currentUser = await this.afAuth.currentUser;
    const { claims } = await currentUser.getIdTokenResult();
    if (claims.admin) {
      this.updateClaims(user);
      this.updateUserDataCascade(user);
    }

    if (!claims.admin && currentUser.uid == user.id) {
      const prev = await this.getUser(user.uid);

      // only update if there's a change
      if (prev && (prev.displayName !== user.displayName || prev.photoURL !== user.photoURL)) {
        this.updateUserDataCascade(user);
      }
    }

    const data: any = this.util.deepCloneJSON(user); // else Privacy will be considered a custom object
    data.roles.user = true; // temp hack to make admin user list queries work
    delete data.email;

    return super.set_(this.oneRef(user.id), data, { snackbar: true, loading: true, ...options });
  }

  updateUserPartial(id: string, data: Partial<AppUser>, options?: Partial<SetOptions>) {
    return super.update_(this.oneRef(id), data, { snackbar: false, loading: false, ...options });
  }

  private updateUserDataCascade(user: AppUser) {
    const userData = { uid: user.id, displayName: user.displayName, photoURL: user.photoURL, photoURLThumb: user.photoURLThumb };
    return this.funcs.httpsCallable('accounts-updateUserData')(userData).toPromise();
  }

  private updateClaims(user: AppUser) {
    return this.funcs
      .httpsCallable('accounts-updateClaims')({
        uid: user.uid,
        claims: user.roles,
        //  subscriptions: user.subscriptions
      })
      .toPromise();

    // admins can create subscriptions from stripe dashboard for users,
    // avoids having to setup an eventarc custom listener to keep user.subscriptions up to date when a user cancels
  }

  updatePrivate(meta: Partial<UserPrivate>, options?: Partial<SetOptions>) {
    return super.set_(this.privateRef(meta.id), meta, { snackbar: false, loading: false, ...options });
  }

  async deleteAccount() {
    const currentUser = await this.afAuth.currentUser;
    try {
      await currentUser.delete();
      await this.util.openSnackbar(`Your account has been deleted.`, `Sorry to see you go, come back anytime.`);
      await this.router.navigate(['/accounts/login']);
    } catch (deleteErr) {
      // re-authenticate
      this.router.navigate(['/accounts/login'], {
        queryParams: { returnUrl: `/app/tabs/accounts/${currentUser.uid}/delete-account?reauthenticated=true` },
        queryParamsHandling: 'merge',
      });
    }
  }

  listenIdTokenRefresh(user: firebase.User) {
    const idTokenRefreshTriggerRef = this.rtdb.object('metadata/' + user.uid + '/refreshTime');
    const metadataRef = idTokenRefreshTriggerRef.valueChanges();

    metadataRef
      .pipe(
        distinctUntilChanged((prev, curr) => prev === curr),
        takeUntil(this.destroy$)
      )
      .subscribe((refreshTime) => {
        // console.log(`auth:claims idToken refresh triggered: ${refreshTime}`);
        user.getIdToken(true);
      });
  }

  private mapClaimsToRoles(appUser: AppUser, claims: any) {
    appUser.roles = appUser.roles || {};
    appUser.roles.admin = claims.admin || false;
    appUser.roles.editor = claims.mentor || false;
  }

  // todo: email change feature
  async changeEmail(email: string) {
    // if (currentUser.email != user.email) {}
    const currentUser = await this.afAuth.currentUser;
    try {
      currentUser.updateEmail(email);
      await this.util.openSnackbar(`Your account email has been updated.`);
      await this.router.navigate(['/accounts/login']);
    } catch (err) {
      // re-authenticate
      this.router.navigate(['/accounts/login'], {
        queryParams: { returnUrl: `/app/tabs/accounts/${currentUser.uid}/delete-account?reauthenticated=true` },
        queryParamsHandling: 'merge',
      });
    }
  }
}
