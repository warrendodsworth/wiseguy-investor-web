import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, writeBatch, collection, query, where, getDocs } from '@angular/fire/firestore';
import { faker } from '@faker-js/faker';

import { FileData } from '../core/models/photo';
import { AuthService } from '../core/services/auth.service';
import { PhotoService } from '../core/services/photo.service';
import { UtilService } from '../core/services/util.service';
import { Post } from './post';
import { EntityBaseFirestoreService } from '../core/services/base-firestore-entity.service';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class PostService extends EntityBaseFirestoreService<Post> {
  constructor(
    public firestore: Firestore,
    public afAuth: Auth,
    public auth: AuthService,
    public photoService: PhotoService,
    public util: UtilService
  ) {
    super(firestore, afAuth, util, 'posts');
  }

  async upsertPost(post: Post, selectedFile?: FileData) {
    if (!post.id) post.id = doc(collection(this.firestore, this.root)).id;

    if (!post.text) post.text = faker.lorem.sentence();
    if (!post.photoURL) post.photoURL = 'https://picsum.photos/1080';

    if (selectedFile) {
      const uploadSnap = await this.photoService.uploadPhotoToFirebase(selectedFile.url, post.id);
      post.photoURL = await uploadSnap.url;
    }

    await setDoc(this.oneRef(post.id), post, { merge: true });
    this.util.openSnackbar('Post saved');
  }

  async deletePost(postId: string) {
    await this.deleteById(postId);

    const batch = writeBatch(this.firestore);
    const heartsQuery = query(collection(this.firestore, 'hearts'), where('postId', '==', postId));
    const heartsSnap = await getDocs(heartsQuery);
    heartsSnap.forEach((docSnap) => batch.delete(docSnap.ref));

    await batch.commit();
    this.util.openSnackbar('Post deleted');
  }

  async heartPost(post: Post, hearted: boolean, uid: string) {
    const heartId = `${uid}_${post.id}`;
    const heartRef = doc(this.firestore, `hearts/${heartId}`);

    if (!hearted) {
      await setDoc(heartRef, { userId: uid, postId: post.id }, { merge: true });
      post.likes++;
    } else {
      await deleteDoc(heartRef);
      post.likes--;
    }

    post.hearted = !hearted;
  }
}
