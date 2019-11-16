import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../shared/models/user';
import { AuthService } from '../../shared/services/auth.service';
import { UtilService } from '../../shared/services/util.service';
import { BlogService } from '../blog.service';
import { Post } from '../post';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  posts: Observable<{}[]>;
  user: User;
  featuredPost: Post;

  constructor(
    public authService: AuthService,
    public afs: AngularFirestore,
    public util: UtilService,
    public _blog: BlogService,
    public router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });

    this.posts = this.afs.collection('posts', q => q.where('draft', '==', false)).valueChanges();

    this.posts
      .pipe(
        map(p => <Post[]>p),
        map(p => p.find(x => x.featured))
      )
      .subscribe(post => {
        this.featuredPost = post;
      });
  }
}
