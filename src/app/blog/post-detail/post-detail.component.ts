import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { UtilService } from 'src/app/util.service';
import { User } from 'src/models/user';

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
    public router: Router,
  ) { }

  ngOnInit() {

    this._auth.user$.subscribe(async u => {
      if (u) {
        this.user = u;

        this.post$ = this.route.paramMap.pipe(switchMap(params => {
          let postId = params.get('postId');
          return this.afs.doc(`posts/${postId}`).get().pipe(map(p => <Post>p.data()))
        }))
      }
    })
  }

}

// post: Post;
// let postId = this.route.snapshot.paramMap.get('postId')
// this.post = await this.afs.doc(`posts/${postId}`).get().pipe(map(p => <Post>p.data())).toPromise()

