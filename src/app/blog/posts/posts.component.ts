import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from 'src/app/shared/services/photo.service';

import { User } from '../../shared/models/user';
import { AuthService } from '../../shared/services/auth.service';
import { UtilService } from '../../shared/services/util.service';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public afs: AngularFirestore,
    public auth: AuthService,
    public blogService: BlogService,
    public photoService: PhotoService,
    public util: UtilService
  ) {}

  posts: any;
  user: User;

  ngOnInit() {
    this.posts = this.afs.collection('posts', q => q.orderBy('createDate', 'desc')).valueChanges();

    this.auth.currentUser$.subscribe(u => {
      this.user = u;
    });
  }
}
