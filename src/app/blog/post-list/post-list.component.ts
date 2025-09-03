import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AppUser } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';
import { Post } from '../post';
import { PostService } from '../post.service';
import { PhotoService } from '../../core/services/photo.service';
import { SharedModule } from '../../shared/shared.module';
import { orderBy, query } from '@angular/fire/firestore';

@Component({
  selector: 'app-posts',
  templateUrl: './post-list.component.html',
  standalone: true,
  imports: [SharedModule],
})
export class PostsComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public _post: PostService,
    public _photo: PhotoService,
    public util: UtilService,
    public _blog: PostService
  ) {}

  posts$: Observable<Post[]>;
  user: AppUser;

  ngOnInit() {
    this.posts$ = this._post.many$(query(this._post.manyRef(), orderBy('createDate', 'desc')));
  }

  async deletePost(postId: string) {
    const res = confirm('Are you sure?');
    if (res) await this._blog.deletePost(postId);
  }
}
