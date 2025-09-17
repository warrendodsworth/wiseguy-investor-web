import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
// import { Post } from '../../blog/post';
// import { PostService } from '../../blog/post.service';
// import { SharedModule } from '../../shared/shared.module';
// import { PostComponent } from '../../blog/components/post/post.component';
import { query, where, orderBy, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { SharedModule } from '../../shared/shared.module';

@Component({
  templateUrl: './home.html',
  imports: [SharedModule],
})
export class HomeComponent implements OnInit {
  private readonly firestore = inject(Firestore);
  protected readonly posts = signal<readonly { title: string }[]>([]);

  constructor(public auth: AuthService, public router: Router) {
    // DEMO: Load some data from Firestore

    // Reference to the 'posts' collection
    const postsRef = collection(this.firestore, 'posts');
    // Subscribe to collection data
    collectionData(postsRef, { idField: 'id' }).subscribe((data: any[]) => {
      // Only keep title field
      this.posts.set(data.map((post) => ({ title: post.title })));
    });
  }

  // posts$: Observable<Post[]>;

  ngOnInit() {
    // Modular API: use collectionData, query, where, orderBy
    // this.posts$ = this._post.many$(query(this._post.manyRef(), where('draft', '==', false), orderBy('createDate', 'desc')));
  }
}
