import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AppUser } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';
import { Post } from '../post';
import { PostService } from '../post.service';
import { PhotoService } from '../../core/services/photo.service';
import { PostComponent } from '../components/post/post.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  standalone: true,
  imports: [SharedModule, PostComponent],
})
export class PostsComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public postService: PostService,
    public _photo: PhotoService,
    public util: UtilService
  ) {}

  posts$: Observable<Post[]>;
  user: AppUser;

  ngOnInit() {
    this.posts$ = this.postService.posts$((q) => q.orderBy('createDate', 'desc'));

    this.auth.currentUser$.subscribe((u) => {
      this.user = u;
    });
  }
}
