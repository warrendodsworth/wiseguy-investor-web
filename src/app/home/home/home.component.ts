import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { Post } from '../../blog/post';
import { PostService } from '../../blog/post.service';
import { SharedModule } from '../../shared/shared.module';
import { PostComponent } from '../../blog/components/post/post.component';
import { query, where, orderBy, collection } from '@angular/fire/firestore';

@Component({
  templateUrl: './home.component.html',
  imports: [SharedModule, PostComponent],
})
export class HomeComponent implements OnInit {
  constructor(public auth: AuthService, public _post: PostService, public router: Router) {}

  posts$: Observable<Post[]>;

  ngOnInit() {
    // Modular API: use collectionData, query, where, orderBy
    this.posts$ = this._post.many$(query(this._post.manyRef(), where('draft', '==', false), orderBy('createDate', 'desc')));
  }
}
