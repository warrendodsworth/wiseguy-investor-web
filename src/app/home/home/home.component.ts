import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { LayoutService } from '../../core/services/layout.service';
import { Post } from '../../blog/post';
import { PostService } from '../../blog/post.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(public auth: AuthService, public _post: PostService, public route: ActivatedRoute, public router: Router) {}

  posts$: Observable<Post[]>;

  ngOnInit() {
    this.posts$ = this._post.col$('posts', (q) => q.where('draft', '==', false).orderBy('createDate', 'desc'));
  }
}
