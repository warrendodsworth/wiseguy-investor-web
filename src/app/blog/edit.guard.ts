import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EditGuard implements CanActivate {
  constructor(public _auth: AuthService, public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._auth.currentUser$.pipe(
      map(u => u && this._auth.canEdit(u)),
      tap(allowed => {
        if (!allowed) {
          this.router.navigate(['/blog']);
        }
      })
    );
  }
}
