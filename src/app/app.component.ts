import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { User } from './shared/models/user';
import { AuthService } from './shared/services/auth.service';
import { FcmService } from './shared/services/fcm.service';
import { LayoutService } from './shared/services/layout.service';
import { UtilService } from './shared/services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  appTitle = 'Wise Guy Investor';
  year = new Date().getFullYear();
  user: User;
  isCollapsed = true;
  notification: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public title: Title,
    public authService: AuthService,
    public fcm: FcmService,
    public layout: LayoutService,
    public util: UtilService
  ) {}

  disableContainer: boolean;

  ngOnInit() {
    this.disableContainer = this.layout.disableContainer;
    this.title.setTitle(this.appTitle);
    this.fcm.showMessages();

    this.authService.currentUser$.subscribe(user => {
      this.user = user;

      if (user) {
        this.fcm.requestPermission();
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = true;
      }
    });
  }
}
