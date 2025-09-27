import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { Post } from '../post';
import { PostService } from '../post.service';
import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.html',
  styleUrls: ['./post-detail.scss'],
  imports: [SharedModule],
})
export class PostDetailComponent implements OnInit {
  post$: Observable<Post | undefined> | undefined;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public postService: PostService,
    public util: UtilService
  ) {}

  ngOnInit() {
    this.post$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const postId = params.get('postId') ?? '';

        return this.postService.one$(postId).pipe(
          tap((p) => {
            if (!p?.id) {
              this.router.navigateByUrl('/blog');
            }
          })
        );
      }),
      shareReplay(1)
    );
  }
}
