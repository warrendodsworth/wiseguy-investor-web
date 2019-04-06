import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { User } from '../../../models/user';
import { AuthService } from '../../auth.service';
import { UtilService } from '../../util.service';
import { BlogService } from '../blog.service';
import { Post } from '../post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  posts: any;
  post: any = new Post();
  user: User;
  action = 'list';
  innerAction = false;
  froalaOptions: Object = {
    charCounterCount: false,
    heightMin: 200,
    fileUpload: false,
    fileInsertButtons: [],
    videoUpload: false,
    toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|',
      'fontFamily', 'fontSize', 'color', 'inlineClass', 'inlineStyle', 'paragraphStyle', 'lineHeight', '|',
      'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-',
      'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertTable', '|',
      'emoticons', 'fontAwesome', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|',
      'print', 'getPDF', 'spellChecker', 'help', 'html', '|', 'undo', 'redo']
  }

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
        this.posts = this.afs.collection('posts', q => q.where('uid', '==', this.user.uid)).valueChanges()
      }
    })
  }

  edit(post: Post) {
    this.post = post;
    this.action = 'edit';
    // this.location.replace('manage/blog/' + post.id);
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
