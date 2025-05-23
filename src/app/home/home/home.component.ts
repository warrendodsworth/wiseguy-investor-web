import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public afs: AngularFirestore,
    public route: ActivatedRoute,
    public router: Router,
    public layout: LayoutService
  ) {}

  posts$: Observable<any>;

  ngOnInit() {
    this.layout.disableContainer = true;

    this.posts$ = this.afs.collection('posts', q => q.where('draft', '==', false).orderBy('createDate', 'desc')).valueChanges();
  }
}
