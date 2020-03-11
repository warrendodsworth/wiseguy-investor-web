import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Chance } from 'chance';
import { map } from 'rxjs/operators';

import { ImageSnippet } from '../shared/models/image-snippet';
import { AuthService } from '../shared/services/auth.service';
import { PhotoService } from '../shared/services/photo.service';
import { UtilService } from '../shared/services/util.service';
import { Post } from './post';

@Injectable({ providedIn: 'root' })
export class PostService {
  chance = new Chance();
  postRef = (postId: string) => this.afs.doc(`posts/${postId}`);
  post$ = (uid: string) =>
    this.postRef(uid)
      .get()
      .pipe(map(x => x.data() as Post));

  constructor(
    public authService: AuthService,
    public afs: AngularFirestore,
    public photoService: PhotoService,
    public util: UtilService
  ) {}

  async upsertPost(post: Post, selectedFile?: ImageSnippet) {
    if (!post.id) {
      post.id = this.afs.createId();
    } else {
      post.editDate = new Date();
    }

    post.uid = this.authService.currentUser.uid;

    if (!post.text) {
      post.text = this.chance.sentence();
    }
    if (!post.photoURL) {
      post.photoURL = 'https://picsum.photos/1080';
    }

    if (selectedFile) {
      const uploadSnap = await this.photoService.uploadPhotoToFirebase(selectedFile.src, post.id);
      post.photoURL = await uploadSnap.ref.getDownloadURL();
    }

    await this.afs.doc<Post>(`posts/${post.id}`).set(Object.assign({}, post), { merge: true });
    this.util.newToast('Post Saved');
  }

  async deletePost(postId: string) {
    await this.afs.doc(`posts/${postId}`).delete();

    const batch = this.afs.firestore.batch();
    const hearts = await this.afs.collection('hearts', r => r.where('postId', '==', postId)).ref.get();
    hearts.forEach(doc => batch.delete(doc.ref));

    batch.commit();
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
