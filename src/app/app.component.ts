import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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

    this.facebookService.init({ xfbml: true, version: 'v3.2' });
  }
}

// subscriber: any = {};
// subscribeToMailingList(user) {
//   var body = "FNAME=" + user.firstname + "&LNAME=" + user.lastname + "&EMAIL=" + user.email;

//   this.http.post("https://skaoss.us14.list-manage.com/subscribe/post?u=f87d6e1ec58cd04830f6a367b&amp;id=e58a2a6af0", body)
//     .subscribe((data) => {
//       console.log(data)
//       this.subscriber = {};
//     });
// }
