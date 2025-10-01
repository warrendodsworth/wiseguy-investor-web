import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { orderBy, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { PostComponent } from '../../blog/components/post/post';
import { Post } from '../../blog/post';
import { PostService } from '../../blog/post.service';
import { AuthService } from '../../core/services/auth.service';
import { SHARED_CONFIG } from '../../shared/shared.config';

@Component({
  templateUrl: './home.html',
  imports: [SHARED_CONFIG, PostComponent],
})
export class HomeComponent {
  router = inject(Router);
  auth = inject(AuthService);
  postService = inject(PostService);

  protected readonly posts: Signal<Post[]>;

  constructor() {
    this.posts = toSignal(this.postService.many$(where('draft', '==', false), orderBy('createDate', 'desc')), {
      initialValue: [],
    });
  }
}

// DEMO: Load some data from Firestore
// private readonly firestore = inject(Firestore);
// protected readonly posts = signal<readonly { title: string }[]>([]);
// const postsRef = collection(this.firestore, 'posts');
// // Modular API: use collectionData, query, where, orderBy
// collectionData(postsRef, { idField: 'id' }).subscribe((data: any[]) => {
// // Only keep title field
//   this.posts.set(data.map((post) => ({ title: post.title })));
// });
