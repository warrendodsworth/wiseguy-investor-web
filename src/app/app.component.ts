import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { AppUser } from './core/models/user';
import { AuthService } from './core/services/auth.service';
import { FCMBaseService } from './core/services/fcm.service';
import { LayoutService } from './core/services/layout.service';
import { UtilService } from './core/services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  appTitle = 'Wise Guy Investor';
  year = new Date().getFullYear();
  user: AppUser;
  isCollapsed = true;
  notification: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public title: Title,
    public authService: AuthService,
    public fcm: FCMBaseService,
    public layout: LayoutService,
    public util: UtilService
  ) {}

  disableContainer: boolean;

  ngOnInit() {
    this.disableContainer = this.layout.disableContainer;
    this.title.setTitle(this.appTitle);

    this.authService.currentUser$.subscribe((user) => {
      this.user = user;

      if (user) {
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = true;
      }
    });
  }
}
