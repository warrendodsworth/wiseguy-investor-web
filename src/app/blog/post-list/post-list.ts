import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';
import { Post } from '../post';
import { PostService } from '../post.service';
import { SharedModule } from '../../shared/shared.module';
import { orderBy } from '@angular/fire/firestore';

@Component({
  templateUrl: './post-list.html',
  imports: [SharedModule],
})
export class PostsComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService);
  util = inject(UtilService);
  postService = inject(PostService);

  constructor() {}

  posts$?: Observable<Post[]>;

  ngOnInit() {
    this.posts$ = this.postService.many$(orderBy('createDate', 'desc'));
  }

  async deletePost(postId: string) {
    const res = confirm('Are you sure?');
    if (res) await this.postService.deletePost(postId);
  }
}
