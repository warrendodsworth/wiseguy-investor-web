import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Post } from '../post';
import { PostService } from '../post.service';
import { AppUser } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  // encapsulation: ViewEncapsulation.Emulated
})
export class PostDetailComponent implements OnInit {
  user: AppUser;
  post$: Observable<Post>;

  constructor(
    public afs: AngularFirestore,
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,
    public blogService: PostService,
    public util: UtilService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(async (u) => {
      this.user = u;

      this.post$ = this.route.paramMap.pipe(
        switchMap((params) => {
          return this.afs
            .doc(`posts/${params.get('postId')}`)
            .get()
            .pipe(
              tap((p) => {
                if (!p.exists) {
                  this.router.navigateByUrl('/blog');
                }
              }),
              map((p) => p.data() as Post)
            );
        })
      );
    });
  }
}
