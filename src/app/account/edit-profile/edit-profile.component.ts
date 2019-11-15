import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { User } from '../../shared/models/user';
import { AuthService } from '../../shared/services/auth.service';
import { UtilService } from '../../shared/services/util.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  user: User;
  showCropper = false;

  constructor(public _auth: AuthService, public _util: UtilService, public afs: AngularFirestore, public router: Router) {}

  ngOnInit() {
    this._auth.currentUser$.subscribe(u => {
      this.user = u;
    });
  }

  async update(user: User) {
    await this._auth.updateUser(user);

    this._util.toastr.success(null, 'Saved');
  }

  async logout() {
    await this._auth.logout();
    this.router.navigate(['/']);
  }
}
