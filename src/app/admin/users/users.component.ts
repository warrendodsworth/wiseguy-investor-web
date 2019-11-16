import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';

import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;

  constructor(public router: Router, public afs: AngularFirestore, public authService: AuthService) {}

  ngOnInit() {
    this.users$ = this.afs.collection<User>('users').valueChanges();
  }
}
