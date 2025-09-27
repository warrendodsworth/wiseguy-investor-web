import { inject, Injectable } from '@angular/core';
import { faker } from '@faker-js/faker';

import { FileData } from '../core/models/photo';
import { AuthService } from '../core/services/auth.service';
import { PhotoService } from '../core/services/photo.service';
import { UtilService } from '../core/services/util.service';
import { Post } from './post';
import { EntityBaseFirestoreService } from '../core/services/base-firestore-entity.service';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class PostService extends EntityBaseFirestoreService<Post> {
  afs = inject(Firestore);
  auth = inject(AuthService);
  photoService = inject(PhotoService);
  constructor() {
    super('posts');
  }

  async upsertPost(post: Post, selectedFile?: FileData) {
    if (!post.id) post.id = doc(collection(this.firestore, this.root)).id;

    if (!post.text) post.text = faker.lorem.sentence();
    if (!post.photoURL) post.photoURL = 'https://picsum.photos/1080';

    if (selectedFile) {
      const uploadSnap = await this.photoService.uploadPhotoToFirebase(selectedFile.photoURL, post.id);
      post.photoURL = uploadSnap?.photoURL ?? post.photoURL ?? 'https://picsum.photos/1080';
    }

    await this.setById(post.id, post, { snackbarContent: 'Post saved' });
  }

  async deletePost(postId: string) {
    await this.deleteById(postId);

    const batch = writeBatch(this.afs);

    // Modular Firebase query for hearts
    const heartsCol = collection(this.afs, 'hearts');
    const heartsQuery = query(heartsCol, where('postId', '==', postId));
    const heartsSnap = await getDocs(heartsQuery);
    heartsSnap.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();
    this.util.openSnackbar('Post deleted');
  }

  heartPost(post: Post, hearted: boolean, uid: string) {
    const heartId = `${uid}_${post.id}`;
    const heartRef = doc(this.afs, `hearts/${heartId}`);

    if (!hearted) {
      setDoc(heartRef, { userId: uid, postId: post.id });
      post.likes++;
    } else {
      deleteDoc(heartRef);
      post.likes--;
    }

    post.hearted = !hearted;
  }
}
