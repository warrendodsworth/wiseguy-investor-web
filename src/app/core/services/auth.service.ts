import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Params, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { DateTime } from 'luxon';

import { environment } from '../../../environments/environment';
import { AppUser, EmailSignupModel, Roles } from '../models/user';
import { AuthStore } from './auth.store';
import { DeviceStore } from './device.store';
import { UtilService } from './util.service';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class AuthService extends AuthStore {
  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public analytics: AngularFireAnalytics,
    public funcs: AngularFireFunctions,
    public rtdb: AngularFireDatabase,
    public util: UtilService,
    public _device: DeviceStore
  ) {
    super(router, afAuth, afs, rtdb, funcs, util);
  }

  /** Auth related routes */
  readonly routes = {
    affirmations: '/accounts/affirmations',
    chooseUserType: '/accounts/choose-user-type',
    onboardingForm: '/accounts/onboarding-form',
  };

  goAffirmations = (p: Params = {}) =>
    this.router.navigate([this.routes.affirmations], { queryParams: { flow: 'signin', ...p }, queryParamsHandling: 'merge' });
  goChooseUserType = () => this.router.navigate([this.routes.chooseUserType], { queryParamsHandling: 'merge' });
  goOnboardingForm = (type: string) =>
    this.router.navigate([this.routes.onboardingForm], { queryParams: { type }, queryParamsHandling: 'merge' });
  goHome = () => this.router.navigateByUrl('/app/tabs/accounts');

  async loginGoogle() {
    const loading = await this.util.openLoading('Going to Google..');

    if (Capacitor.isNativePlatform()) {
      console.log('app:auth: loginGoogle Capacitor');

      // await loading.close();
      // const googleUser = await GoogleAuth.signIn();
      // loading = await this.util.openLoading('Logging you in..');

      // const oAuthCred = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
      // const cred = await this.afAuth.signInWithCredential(oAuthCred);

      // console.log(`app:auth: loginGoogle Capacitor OK`, cred.additionalUserInfo.username);
      // await this.updateUserData(cred);
    } else {
      console.log('app:auth: loginGoogle Web');
      await this.afAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    }

    loading.close();
  }

  async loginApple() {
    // Apple Sign-in Setup guide - https://firebase.google.com/docs/auth/ios/apple?authuser=0&hl=en
    const loading = await this.util.openLoading('Going to Apple..');
    const provider = new firebase.auth.OAuthProvider('apple.com');

    if (Capacitor.isNativePlatform()) {
      // // plugin apple signin - only on ios, not android
      // // - in prog, requires backend service - https://github.com/capacitor-community/apple-sign-in/issues/13
      // const rawNonce = this.afs.createId();
      // const nonce = shajs('sha256').update(rawNonce).digest('hex');
      // const options: SignInWithAppleOptions = {
      //   clientId: capacitorJson.appId,
      //   redirectURI: 'https://linkmateapp.firebaseapp.com/__/auth/handler',
      //   scopes: 'email name',
      //   state: '123456',
      //   nonce,
      // };
      // try {
      //   // plugin
      //   // - only returns profile data the first time, after that only returns idToken
      //   console.log(`app:auth: loginApple Capacitor rawNonce:`, rawNonce, ' nonce:', nonce);
      //   await loading.close();
      //   const { response } = await SignInWithApple.authorize(options);
      //   console.log('app:auth: loginApple response - ', response);
      //   if (!response || !response.identityToken) {
      //     throw new Error('No identity token receieved.');
      //   }
      //   loading = await this.util.openLoading('Logging you in..');
      //   // firebase
      //   // - validate token with server and create new session
      //   try {
      //     const oAuthCred = provider.credential({ idToken: response.identityToken, rawNonce });
      //     const cred = await this.afAuth.signInWithCredential(oAuthCred);
      //     cred.user.displayName = response.givenName;
      //     cred.user.email = response.email;
      //     await this.updateUserData(cred);
      //   } catch (error) {
      //     // hack - empty error object appears without trycatch here & no error log printed with try catch
      //     console.log('app:auth: signInWithCred (tested)', error);
      //   }
      // } catch (error) {
      //   console.log('app:auth: loginApple error:', error);
      //   if (error.code == 'auth/missing-or-invalid-nonce') {
      //     // possible error code from firebase
      //   }
      //   this.util.openSnackbar(`Sorry, we had an issue`);
      // }
    } else {
      // web
      console.log('app:auth: loginApple Web');
      provider.addScope('name');
      provider.addScope('email');
      await this.afAuth.signInWithRedirect(provider);
    }

    loading.close();
  }

  async loginAnonymous() {
    const cred = await this.afAuth.signInAnonymously();
    return await this.updateUserData(cred);
  }

  async loginPhone(cred: firebase.auth.UserCredential) {
    return await this.updateUserData(cred);
  }

  /**
   * Post Login
   *
   * https://github.com/angular/angularfire/blob/master/docs/analytics/getting-started.md
   * AngularFire provides a UserTrackingService which will dynamically import firebase/auth, monitor for changes in the logged in user, and call setuserid for you automatically.
   * this.analytics.setUserId(cred.user.uid);
   *
   *
   * apple doesn't provide cred.additionalInfo.profile data
   * handles case
   * - db not exists, firebase user exists
   * - by checking if user doesn't exist in db to setup - shouldn't be a problem anymore
   * todo handle case
   * - db exists but isNewUser
   * - search user_meta by email to get uid - find db user by email using cred.user.email
   */
  async updateUserData(cred: firebase.auth.UserCredential, displayName?: string) {
    const fbUser = cred.user;
    const socialProfile: any = cred.additionalUserInfo.profile;

    const user = cred.user as any;

    if (cred.additionalUserInfo.isNewUser) {
      const fullName = displayName || fbUser.displayName || socialProfile?.name;
      user.displayName = this.util.firstName(fullName);
      user.photoURL = fbUser.photoURL || socialProfile?.picture || environment.gravatarURL;
    }

    return this.updateUserDataWithoutCred(user, cred.additionalUserInfo.isNewUser);
  }

  async updateUserDataWithoutCred(user: firebase.User, isNewUser: boolean) {
    let appUser = await this.getUserById(user.uid);
    if (!appUser?.id) appUser = new AppUser();

    if (isNewUser || !appUser.id) {
      appUser.displayName = this.util.firstName(user.displayName);
      appUser.photoURL = user.photoURL || environment.gravatarURL;
      appUser.roles = Object.assign({}, new Roles());

      if (!this.util.env.prod) appUser.roles.admin = true;
      this.analytics.logEvent('sign_up', { provider: user.providerId });
    } else {
      this.analytics.logEvent('login', { provider: user.providerId });
    }

    appUser.id = user.uid;
    appUser.uid = user.uid; // used to query multiple users by id's
    appUser.lastLoginDate = DateTime.now().toISO();

    this._device.dispatch({ hasLoggedIn: true });
    return super.updateUser(appUser, { snackbar: false, loading: false });
  }

  async signupEmail(model: EmailSignupModel) {
    const loading = this.util.openLoading('Signing you up..');
    let cred: firebase.auth.UserCredential = null;

    try {
      cred = await this.afAuth.createUserWithEmailAndPassword(model.email, model.password);
    } catch (error) {
      this.util.openSnackbar(error.message, '', 5000);
      loading.close();
    }

    if (cred) {
      const user = await this.updateUserData(cred, model.displayName);
      cred.user.sendEmailVerification();
      loading.close();
      return user;
    }
    return null;
  }

  async resetPassword(email: string) {
    await this.afAuth.sendPasswordResetEmail(email);
    this.util.openSnackbar('Password reset email sent');
  }

  async logout(confirm = false) {
    if (confirm) {
      const confirm = await this.util.confirmDialog('Sign out', 'Are you sure?', 'Sign out');
      if (!confirm) return;
    }

    await this.afAuth.signOut();
    await this.router.navigateByUrl('/accounts/login');
  }

  getRoles(user?: AppUser): string {
    let roleString = '';
    Object.keys(new Roles()).forEach((k, i, a) => {
      if (user.roles[k]) {
        roleString += k + (i != a.length - 1 ? ', ' : '');
      }
    });

    return roleString;
  }
  canRead(user?: AppUser) {
    const allowed = ['admin', 'editor', 'user'];
    return this.checkAuthorization(user, allowed);
  }
  canEdit(user?: AppUser) {
    const allowed = ['admin', 'editor'];
    return this.checkAuthorization(user, allowed);
  }
  canDelete(user?: AppUser) {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }
  private async checkAuthorization(user: AppUser, allowedRoles: string[]) {
    user = user || (await this.currentUser_);

    if (!user) {
      return false;
    }
    for (const role of allowedRoles) {
      if (user.roles[role]) return true;
    }
    return false;
  }
}
