import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.service';

export interface DeactivationGuarded {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({ providedIn: 'root' })
export class CanDeactivateGuard implements CanDeactivate<DeactivationGuarded> {
  constructor(private util: UtilService) {}

  canDeactivate(
    component: DeactivationGuarded,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!component.canDeactivate) {
      return true;
    }

    const canLeave = component.canDeactivate();
    if (!canLeave) {
      return new Promise<boolean>(async (resolve: any) => {
        const res = await this.util.confirmDialog('Leave this page?', 'Your changes will be lost', 'Leave');

        resolve(res === true);
      });
    }

    return true;
  }
}
