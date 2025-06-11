import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Roles, AppUser } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  @ViewChild('userForm', { static: false }) userForm: NgForm;
  currentUser: AppUser;
  user: AppUser;
  showCropper = false;
  allRoles = [];

  constructor(
    public route: ActivatedRoute,
    public auth: AuthService,
    public util: UtilService,
    public afs: AngularFirestore,
    public router: Router
  ) {}

  ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');

    const sub1 = this.auth.currentUser$.subscribe(async (u) => {
      this.currentUser = u;

      if (uid) {
        this.user = await this.auth.one$(uid).toPromise();
      } else {
        this.user = u;
      }
    });

    this.allRoles = Object.keys(new Roles());
    this.subs.add(sub1);
  }

  async update(user: AppUser) {
    await this.auth.updateUser(user);
    this.util.openSnackbar('Saved');
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
