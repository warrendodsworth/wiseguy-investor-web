import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UtilService } from 'src/app/shared/services/util.service';

import { BlogService } from '../blog.service';
import { Post } from '../post';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  // encapsulation: ViewEncapsulation.Emulated
})
export class PostDetailComponent implements OnInit {
  user: User;
  post$: Observable<Post>;

  constructor(
    public _auth: AuthService,
    public _util: UtilService,
    public _blog: BlogService,
    public afs: AngularFirestore,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this._auth.currentUser$.subscribe(async u => {
      this.user = u;

      this.post$ = this.route.paramMap.pipe(
        switchMap(params => {
          return this.afs
            .doc(`posts/${params.get('postId')}`)
            .get()
            .pipe(
              tap(p => {
                if (!p.exists) {
                  this.router.navigateByUrl('/blog');
                }
              }),
              map(p => <Post>p.data())
            );
        })
      );
    });
  }
}
