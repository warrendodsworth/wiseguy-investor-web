import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { AuthService } from '../core/services/auth.service';
import { UtilService } from '../core/services/util.service';

import firebase from 'firebase/compat/app';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(public auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.currentUser$.pipe(
      // tap(u => console.log('[admin_guard] isAdmin', u?.displayName, u?.roles?.admin)),
      filter((u) => u?.id != null),
      map((u) => u.roles?.admin == true),
      tap((notAdmin) => {
        if (!notAdmin) this.router.navigateByUrl('/');
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class AdminChildGuard implements CanActivateChild {
  constructor(public auth: AuthService, private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.currentUser$.pipe(
      // tap(u => console.log('[admin_guard] isAdmin (child)', u?.displayName, u?.roles?.admin)),
      filter((u) => u?.id != null),
      map((u) => u.roles?.admin == true),
      tap((notAdmin) => {
        if (!notAdmin) this.router.navigateByUrl('/');
      })
    );
  }
}

/**
 * if currentUser is admin or if uid in route is currentUser.uid allow
 */
@Injectable({ providedIn: 'root' })
export class AdminOrCurrentUserGuard implements CanActivate {
  constructor(public auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.afAuth.idTokenResult.pipe(
      filter((r) => r.claims != null),
      map((r) => {
        const uid = route.paramMap.get('uid') || route.queryParamMap.get('uid');
        logUser(uid, r);

        return r.claims.admin == true || uid == r.claims.user_id || !uid;
      }),
      tap((notAdminOrCurrentUser) => {
        if (!notAdminOrCurrentUser) this.router.navigateByUrl('/');
      })
    );
  }
}

/**
 * if currentUser is admin or if uid in route is currentUser.uid allow
 * - if we use afAuth.idTokenResult$ here - it removes claims backwards compat and option to revert
 */
@Injectable({ providedIn: 'root' })
export class AdminOrCurrentUserChildGuard implements CanActivateChild {
  constructor(public auth: AuthService, private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.afAuth.idTokenResult.pipe(
      filter((r) => r?.claims != null),
      map((r) => {
        const uid = route.paramMap.get('uid') || route.queryParamMap.get('uid');
        logUser(uid, r);

        return r.claims.admin == true || uid == r.claims.user_id || !uid;
      }),
      tap((notAdminOrCurrentUser) => {
        if (!notAdminOrCurrentUser) this.router.navigateByUrl('/');
      })
    );
  }
}

const logUser = (uid: string, r: firebase.auth.IdTokenResult) => {
  if (!environment.prod) {
    if (uid) console.log('AdminOrCurrentUserGuard: ', r.claims.name, r.claims.user_id, 'admin:', r.claims?.admin);
    else console.log('AdminOrCurrentUserGuard: no uid in url');
  }
};
