import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookService, InitParams } from 'ngx-facebook';
import { ToastrService } from 'ngx-toastr';

import { User } from './shared/models/user';
import { AuthService } from './shared/services/auth.service';
import { FcmService } from './shared/services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'WiseGuy Investor';
  year = new Date().getFullYear();
  user: User;
  isCollapsed = true;
  notification: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _auth: AuthService,
    public _fcm: FcmService,
    public facebookService: FacebookService,
    public toastr: ToastrService
  ) {}

  ngOnInit() {
    this._auth.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this._fcm.setupFCMToken(user);
        this._fcm.listenToNotifications();
      }
    });

    this._fcm.currentMessage.subscribe(msg => {
      if (msg) {
        this.notification = (<any>msg).notification;
        this.toastr.info(this.notification.body, this.notification.title);
      }
    });

    const initParams: InitParams = { xfbml: true, version: 'v3.2' };
    this.facebookService.init(initParams);
  }

  loginGoogle() {
    this._auth.loginGoogle();
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

// adminMenu = false
// toggleAdminMenu() {
//   this.adminMenu = !this.adminMenu
//   localStorage.setItem('adminMenu', this.adminMenu.toString())
// }

// isView(name) {
//   var path = this.route.pathFromRoot.join('/')
//   path = path.substring(1, path.length).trim()
//   return path.indexOf(name) > -1;
// }
