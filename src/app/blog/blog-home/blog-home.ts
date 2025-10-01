import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { where } from 'firebase/firestore';
import { AuthService } from '../../core/services/auth.service';
import { SHARED_CONFIG } from '../../shared/shared.config';
import { PostComponent } from '../components/post/post';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  templateUrl: './blog-home.html',
  imports: [SHARED_CONFIG, PostComponent],
})
export class BlogHomePage implements OnInit {
  posts$: Observable<Post[]> | undefined;
  featuredPost: Post | undefined;

  constructor(public auth: AuthService, public postService: PostService) {}

  ngOnInit() {
    this.posts$ = this.postService.many$(where('draft', '==', false));

    this.posts$.pipe(map((p) => p.find((x) => x.featured))).subscribe((post) => {
      this.featuredPost = post;
    });
  }
}
