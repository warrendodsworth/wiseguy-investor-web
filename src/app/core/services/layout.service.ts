import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { CoreConfig } from '../core.config';
import { UtilService } from './util.service';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  isHandset$: Observable<boolean>;
  disableContainer = false;

  constructor(
    public config: CoreConfig,
    private util: UtilService,
    private breakpointObserver: BreakpointObserver,
    public router: Router
  ) {
    this.isHandset$ = this.breakpointObserver
      .observe([Breakpoints.TabletLandscape, Breakpoints.TabletPortrait, Breakpoints.Handset])
      .pipe(
        map((result) => result.matches),
        share()
      );

    // * from old wgi site
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.disableContainer = false;
      }
    });

    this.config = this.util.getStorage<CoreConfig>('core-config') || this.config;
    this.saveConfig(this.config);
  }

  saveConfig(config: CoreConfig) {
    this.util.setStorage('core-config', config);
  }
}
