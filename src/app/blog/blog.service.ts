import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Chance } from 'chance';
import { AuthService } from '../auth.service';
import { Post } from './post';


@Injectable()
export class BlogService {
  chance = new Chance();

  constructor(
    public auth: AuthService,
    public afs: AngularFirestore) { }


  upsertPost(post: Post) {
    if (!post.id)
      post.id = this.afs.createId();
    if (!post.text)
      post.text = this.chance.sentence();
    if (!post.photoURL)
      post.photoURL = 'https://loremflickr.com/1080/1080/' + this.chance.country() + ',girl';
    if (post.id)
      post.editDate = new Date();


    return this.afs.doc(`posts/${post.id}`).set(Object.assign({}, post), { merge: true })
  }

  async deletePost(postId) {
    await this.afs.doc(`posts/${postId}`).delete()

    const batch = this.afs.firestore.batch();
    const hearts = await this.afs.collection('hearts', r => r.where('postId', '==', postId)).ref.get();
    hearts.forEach(doc => batch.delete(doc.ref));

    batch.commit();
  }

  heartPost(post, hearted, uid) {
    const heartId = `${uid}_${post.id}`;
    const heartRef = this.afs.doc(`hearts/${heartId}`);

    if (!hearted) {
      heartRef.set({ userId: uid, postId: post.id })
      post.likes++
    } else {
      heartRef.delete()
      post.likes--
    }

    post.hearted = !hearted;
  }

}
