import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { AuthService } from '../core/services/auth.service';
import { UtilService } from '../core/services/util.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(public authService: AuthService, public util: UtilService, public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.currentUser$.pipe(
      map(u => u && u.roles.admin),
      tap(admin => {
        if (!admin) this.util.openSnackbar('Not authorized');
      })
    );
  }
}
