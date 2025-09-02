import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { AppUser } from './core/models/user';
import { AuthService } from './core/services/auth.service';
import { FCMBaseService } from './core/services/fcm.service';
import { LayoutService } from './core/services/layout.service';
import { UtilService } from './core/services/util.service';
import { AppConfig } from './core/core.config';
import { ConfigService } from './core/services/config.service';

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
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,
    public fcm: FCMBaseService,
    public layout: LayoutService,
    public util: UtilService,
    public config: ConfigService
  ) {}

  disableContainer: boolean;

  async ngOnInit() {
    this.disableContainer = this.layout.disableContainer;

    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = true;
      }
    });
  }
}
