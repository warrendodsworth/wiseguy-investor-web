import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { User } from '../../../models/user';
import { AuthService } from '../../auth.service';
import { UtilService } from '../../util.service';
import { BlogService } from '../blog.service';
import { Post } from '../post';

@Component({
  selector: 'app-blog-manage',
  templateUrl: './blog-manage.component.html',
  styleUrls: ['./blog-manage.component.scss']
})
export class BlogManageComponent implements OnInit {
  posts: any;
  post: any = new Post();
  user: User;
  action = 'list';
  innerAction = false;

  constructor(
    public auth: AuthService,
    public afs: AngularFirestore,
    public _util: UtilService,
    public _blog: BlogService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(u => {
      if (u) {
        this.user = u;
        this.posts = this.afs.collection('posts', q => q.orderBy('createDate', 'desc')).valueChanges()
      }
    })
  }

  edit(post: Post) {
    this.post = post;
    this.action = 'edit';
  }
  async save(post: Post) {
    post.uid = this.user.uid;
    await this._blog.upsertPost(post)

    this.action = 'list';
    this.post = {};
  }

  async delete(postId: string) {
    await this._blog.deletePost(postId)
  }

}
