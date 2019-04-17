import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users$: Observable<User[]>;

  constructor(
    public _auth: AuthService,
    public afs: AngularFirestore,
    public router: Router) { }

  ngOnInit() {
    this.users$ = this.afs.collection<User>('users').valueChanges()
  }

}
