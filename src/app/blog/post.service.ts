import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Chance } from 'chance';
import { map } from 'rxjs/operators';

import { PhotoFile } from '../core/models/photo';
import { AuthService } from '../core/services/auth.service';
import { BaseFirestoreService } from '../core/services/base-firestore.service';
import { PhotoService } from '../core/services/photo.service';
import { UtilService } from '../core/services/util.service';
import { Post } from './post';

@Injectable({ providedIn: 'root' })
export class PostService extends BaseFirestoreService {
  constructor(
    public afs: AngularFirestore,
    public auth: AuthService,
    public photoService: PhotoService,
    public util: UtilService
  ) {
    super(afs, auth, util);
  }

  chance = new Chance();
  postRef = (postId: string) => this.doc<Post>(`posts/${postId}`);
  post$ = (postId: string) => this.doc$(this.postRef(postId));

  postsRef = (q?: QueryFn) => this.col<Post>(`signups`);
  posts$ = (q?: QueryFn) => this.col$(this.postsRef(q));

  async upsertPost(post: Post, selectedFile?: PhotoFile) {
    if (!post.id) post.id = this.afs.createId();

    post.uid = this.auth.currentUser.uid;
    if (!post.text) post.text = this.chance.sentence();
    if (!post.photoURL) post.photoURL = 'https://picsum.photos/1080';

    if (selectedFile) {
      const uploadSnap = await this.photoService.uploadPhotoToFirebase(selectedFile.dataUrl, post.id);
      post.photoURL = await uploadSnap.ref.getDownloadURL();
    }

    await this.set(this.postRef(post.id), post, { toastContent: 'Post saved' });
  }

  async deletePost(postId: string) {
    await this.delete(this.postRef(postId));

    const batch = this.afs.firestore.batch();
    const hearts = await this.afs.collection('hearts', r => r.where('postId', '==', postId)).ref.get();
    hearts.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
    this.util.openSnackbar('Post deleted');
  }

  heartPost(post: Post, hearted: boolean, uid: string) {
    const heartId = `${uid}_${post.id}`;
    const heartRef = this.afs.doc(`hearts/${heartId}`);

    if (!hearted) {
      heartRef.set({ userId: uid, postId: post.id });
      post.likes++;
    } else {
      heartRef.delete();
      post.likes--;
    }

    post.hearted = !hearted;
  }
}
