import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FacebookService } from 'ngx-facebook';

import { User } from './shared/models/user';
import { AuthService } from './shared/services/auth.service';
import { FcmService } from './shared/services/fcm.service';
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
    public facebookService: FacebookService,
    public fcm: FcmService,
    public util: UtilService
  ) {}

  ngOnInit() {
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

    this.facebookService.init({ xfbml: true, version: 'v3.2' });
  }
}
