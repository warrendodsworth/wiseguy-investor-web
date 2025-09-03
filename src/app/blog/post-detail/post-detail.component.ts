import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Post } from '../post';
import { PostService } from '../post.service';
import { AppUser } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';
import { SharedModule } from '../../shared/shared.module';
import { Firestore, doc, docData, DocumentReference } from '@angular/fire/firestore';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  imports: [SharedModule],
  // encapsulation: ViewEncapsulation.Emulated
})
export class PostDetailComponent implements OnInit {
  post$: Observable<Post>;

  constructor(
    public afs: Firestore,
    public route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public _post: PostService,
    public util: UtilService
  ) {}

  ngOnInit() {
    this.post$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const postId = params.get('postId');
        const postRef = this._post.oneRef(postId);
        return docData<Post>(postRef, { idField: 'id' }).pipe(
          tap((p) => {
            if (!p) {
              this.router.navigateByUrl('/blog');
            }
          })
        );
      })
    );
  }
}
