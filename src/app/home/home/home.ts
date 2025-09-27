import { Component, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { where, orderBy } from '@angular/fire/firestore';
import { SharedModule } from '../../shared/shared.module';
import { PostService } from '../../blog/post.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Post } from '../../blog/post';
import { AuthService } from '../../core/services/auth.service';
import { PostComponent } from '../../blog/components/post/post';

@Component({
  templateUrl: './home.html',
  imports: [SharedModule, PostComponent],
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
