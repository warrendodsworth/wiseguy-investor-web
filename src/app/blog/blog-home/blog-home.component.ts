import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppUser } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';
import { Post } from '../post';
import { PostService } from '../post.service';
import { SharedModule } from '../../shared/shared.module';
import { PostComponent } from '../components/post/post.component';

@Component({
  templateUrl: './blog-home.component.html',
  imports: [SharedModule, PostComponent],
})
export class BlogHomeComponent implements OnInit {
  posts$: Observable<Post[]>;
  user: AppUser;
  featuredPost: Post;

  constructor(
    public auth: AuthService,
    public afs: AngularFirestore,
    public util: UtilService,
    public postService: PostService,
    public router: Router
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe((u) => {
      this.user = u;
    });

    this.posts$ = this.postService.posts$((q) => q.where('draft', '==', false));

    this.posts$.pipe(map((p) => p.find((x) => x.featured))).subscribe((post) => {
      this.featuredPost = post;
    });
  }
}
