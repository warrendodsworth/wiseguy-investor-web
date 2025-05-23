import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Roles, AppUser } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  @ViewChild('userForm') userForm: NgForm;
  currentUser: AppUser;
  user: AppUser;
  showCropper = false;
  allRoles = [];

  constructor(
    public route: ActivatedRoute,
    public authService: AuthService,
    public util: UtilService,
    public afs: AngularFirestore,
    public router: Router
  ) {}

  ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');

    const sub1 = this.authService.currentUser$.subscribe(async (u) => {
      this.currentUser = u;

      this.user = !uid ? u : await this.authService.getUser(uid);
    });

    this.allRoles = Object.keys(new Roles());
    this.subs.add(sub1);
  }

  async update(user: AppUser) {
    await this.authService.updateUser(user);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
