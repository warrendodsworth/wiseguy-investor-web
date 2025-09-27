import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { Post } from '../post';
import { PostService } from '../post.service';
import { SharedModule } from '../../shared/shared.module';
import { PostComponent } from '../components/post/post';
import { where } from 'firebase/firestore';

@Component({
  templateUrl: './blog-home.html',
  imports: [SharedModule, PostComponent],
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
