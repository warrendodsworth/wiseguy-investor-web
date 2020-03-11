import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../models/user';
import { UtilService } from './util.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  working: boolean;
  readonly loginUrl = '/';
  currentUser$: Observable<User>;
  currentUser: User;

  analytics = firebase.analytics();

  userRef = (uid: string) => this.afs.doc<User>(`users/${uid}`);
  user$ = (uid: string) =>
    this.userRef(uid)
      .get()
      .pipe(map(x => x.data() as User));

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private util: UtilService) {
    this.currentUser$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.analytics.setUserId(user.uid);

          return this.userRef(user.uid)
            .valueChanges()
            .pipe(
              map(u => {
                this.analytics.setUserProperties({ subscriber: u.roles?.subscriber });
                this.currentUser = u;
                return u;
              })
            );
        } else {
          this.currentUser = null;
          this.router.navigateByUrl(this.loginUrl);
          return of(null);
        }
      })
    );
  }

  loginFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialLogin(provider);
  }

  loginGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialLogin(provider);
  }

  async logout() {
    await this.afAuth.auth.signOut();
    return this.router.navigateByUrl(this.loginUrl);
  }

  private socialLogin(provider: firebase.auth.AuthProvider) {
    return this.afAuth.auth.signInWithPopup(provider).then(cred => {
      this.analytics.logEvent('login', { method: provider.providerId });
      this.updateUser(cred.user);
    });
  }

  updateUser(user: any | firebase.User) {
    const userRef = this.userRef(user.uid);

    const data: any = {
      uid: user.uid,
      roles: user.roles || { user: true },
    };
    if (user.displayName) data.displayName = user.displayName;
    if (user.phoneNumber) data.phoneNumber = user.phoneNumber;
    if (user.email) data.email = user.email;
    if (user.photoURL) data.photoURL = user.photoURL || environment.gravatarUrl;

    this.util.newToast('Saved');
    return userRef.set(Object.assign({}, data), { merge: true });
  }

  canRead(user?: User) {
    const allowed = ['admin', 'editor', 'user'];
    return this.checkAuthorization(user, allowed);
  }
  canEdit(user?: User) {
    const allowed = ['admin', 'editor'];
    return this.checkAuthorization(user, allowed);
  }
  canDelete(user?: User) {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    user = user || this.currentUser;

    if (!user) {
      return false;
    }
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }
}
