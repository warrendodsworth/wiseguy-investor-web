import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../core/services/auth.service';
import { UtilService } from '../core/services/util.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard {
  constructor(public authService: AuthService, public util: UtilService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.currentUser$.pipe(
      map((u) => {
        if (!u?.roles.admin) this.util.openSnackbar('Not authorized');

        return u && u.roles.admin ? true : false;
      })
    );
  }
}
