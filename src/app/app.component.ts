import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AppUser } from './core/models/user';
import { AuthService } from './core/services/auth.service';
import { FCMBaseService } from './core/services/fcm.service';
import { LayoutService } from './core/services/layout.service';
import { UtilService } from './core/services/util.service';
import { AppConfig } from './core/core.config';
import { ConfigService } from './core/services/config.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  year = new Date().getFullYear();
  user: AppUser;
  isCollapsed = true;
  notification: any;

  constructor(
    private titleService: Title,
    public route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public fcm: FCMBaseService,
    public layout: LayoutService,
    public util: UtilService,
    public config: ConfigService,
    private _theme: ThemeService
  ) {}

  async ngOnInit() {
    // Set the default title initially
    const appConfig = await this.config.getApp();
    this.titleService.setTitle(appConfig.title);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isCollapsed = true;
      // Find the deepest activated route
      let route = this.route;
      while (route.firstChild) {
        route = route.firstChild;
      }
      const routeData = route.snapshot.data;
      const pageTitle = routeData['title'] ? `${routeData['title']} - ${appConfig.title}` : appConfig.title;
      this.titleService.setTitle(pageTitle);
    });

    this._theme.initThemeListener();
  }

  isView(name: string) {
    let path = this.route.pathFromRoot.join('/');
    path = path.substring(1, path.length).trim();
    return path.indexOf(name) > -1;
  }
}
