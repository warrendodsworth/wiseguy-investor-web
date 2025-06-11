import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // fixed import
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { AppUser } from '../../core/models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users$: Observable<AppUser[]>;

  constructor(public router: Router, public afs: AngularFirestore, public auth: AuthService) {}

  ngOnInit() {
    this.users$ = this.afs.collection<AppUser>('users').valueChanges();
  }
}
