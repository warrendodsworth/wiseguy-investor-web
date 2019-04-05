import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookService, InitParams } from 'ngx-facebook';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { FcmService } from './fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WiseGuy Investor'

  user: User
  isCollapsed = true
  adminMenu = false
  currentMessage: any

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _auth: AuthService,
    public _fcm: FcmService,
    private facebookService: FacebookService) { }

  ngOnInit() {
    this._auth.user$.subscribe(user => {
      this.user = user
      if (user) {
        this._fcm.getPermission(user)
        this._fcm.monitorRefresh(user)
        this._fcm.receiveMessages()
      }
    })

    //display notification in page
    this._fcm.currentMessage.subscribe(msg => {
      this.currentMessage = msg
    })

    const initParams: InitParams = { xfbml: true, version: 'v3.2' };
    this.facebookService.init(initParams);
  }

  loginGoogle() {
    this._auth.loginGoogle()
  }
}


// testNotifyMe() {
//   this.fcm.testNotifyMe(this.user.uid)
// }
// toggleAdminMenu() {
//   this.adminMenu = !this.adminMenu
//   localStorage.setItem('adminMenu', this.adminMenu.toString())
// }
// isView(name) {
//   var path = this.route.pathFromRoot.join('/')
//   path = path.substring(1, path.length).trim()
//   return path.indexOf(name) > -1;
// }
