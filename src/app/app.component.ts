import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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


  constructor(
    public auth: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    public http: HttpClient,
    public fcm: FcmService) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user
      if (user) {
        this.fcm.getPermission(user)
        this.fcm.monitorRefresh(user)
        this.fcm.receiveMessages()
      }
    })

  }

  loginGoogle() {
    this.auth.loginGoogle()
  }
}


 // this.fcm.currentMessage.subscribe(msg => {
    //   this.currentMessage = msg
    // })
 // adminMenu = false
  // currentMessage: any

  // testNotifyMe() {
  //   this.fcm.testNotifyMe(this.user.uid)
  // }

   // subscriber: any = {};
  // subscribeToMailingList(user) {
  //   var body = "FNAME=" + user.firstname + "&LNAME=" + user.lastname + "&EMAIL=" + user.email;

  //   this.http.post("https://skaoss.us14.list-manage.com/subscribe/post?u=f87d6e1ec58cd04830f6a367b&amp;id=e58a2a6af0", body)
  //     .subscribe((data) => {
  //       console.log(data)
  //       this.subscriber = {};
  //     });
  // }

  // loginFacebook() {
  //   this.auth.loginFacebook()
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
