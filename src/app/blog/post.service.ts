import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Chance } from 'chance';
import { map } from 'rxjs/operators';

import { FileData, Photo } from '../core/models/photo';
import { AuthService } from '../core/services/auth.service';
import { BaseFirestoreService } from '../core/services/base-firestore.service';
import { PhotoService } from '../core/services/photo.service';
import { UtilService } from '../core/services/util.service';
import { Post } from './post';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class PostService extends BaseFirestoreService {
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public auth: AuthService,
    public photoService: PhotoService,
    public util: UtilService
  ) {
    super(afs, afAuth, util);
  }

  chance = new Chance();
  postRef = (postId: string) => this.doc<Post>(`posts/${postId}`);
  post$ = (postId: string) => this.doc$(this.postRef(postId));

  postsRef = (q?: QueryFn) => this.col<Post>(`signups`);
  posts$ = (q?: QueryFn) => this.col$(this.postsRef(q));

  async upsertPost(post: Post, selectedFile?: FileData) {
    if (!post.id) post.id = this.afs.createId();

    post.uid = (await this.auth.currentUser_).uid;
    if (!post.text) post.text = this.chance.sentence();
    if (!post.photoURL) post.photoURL = 'https://picsum.photos/1080';

    if (selectedFile) {
      const uploadSnap = await this.photoService.uploadPhotoToFirebase(selectedFile.url, post.id);
      post.photoURL = await uploadSnap.url;
    }

    await this.set_(this.postRef(post.id), post, { snackbarContent: 'Post saved' });
  }

  async deletePost(postId: string) {
    await this.delete(this.postRef(postId));

    const batch = this.afs.firestore.batch();
    const hearts = await this.afs.collection('hearts', (r) => r.where('postId', '==', postId)).ref.get();
    hearts.forEach((doc) => batch.delete(doc.ref));

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
