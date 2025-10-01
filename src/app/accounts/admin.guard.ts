import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppUser } from '../core/models/user';
import { AuthService } from '../core/services/auth.service';
import { UtilService } from '../core/services/util.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard {
  private auth = inject(AuthService);
  private util = inject(UtilService);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.currentUser$.pipe(
      filter((u) => !!u), // wait for initial auth to resolve
      map((user: AppUser) => {
        if (!user?.roles.admin) this.util.openSnackbar('Not authorized');

        return user && user.roles.admin ? true : false;
      })
    );
  }
}
