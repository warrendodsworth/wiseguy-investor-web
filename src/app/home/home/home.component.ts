import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { LayoutService } from '../../shared/services/layout.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  posts: any;

  constructor(
    public authService: AuthService,
    public afs: AngularFirestore,
    public route: ActivatedRoute,
    public router: Router,
    public layout: LayoutService
  ) {}

  ngOnInit() {
    this.layout.disableContainer = true;

    this.posts = this.afs.collection('posts', q => q.where('draft', '==', false).orderBy('createDate', 'desc')).valueChanges();
  }
}
