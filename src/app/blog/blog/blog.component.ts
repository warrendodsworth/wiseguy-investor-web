import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  posts$: Observable<Post[]>;
  user: User;
  featuredPost: Post;

  constructor(
    public auth: AuthService,
    public afs: AngularFirestore,
    public util: UtilService,
    public postService: PostService,
    public router: Router
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => {
      this.user = u;
    });

    this.posts$ = this.postService.posts$(q => q.where('draft', '==', false));

    this.posts$.pipe(map(p => p.find(x => x.featured))).subscribe(post => {
      this.featuredPost = post;
    });
  }
}
