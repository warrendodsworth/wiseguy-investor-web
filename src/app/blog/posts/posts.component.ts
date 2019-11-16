import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { map } from 'rxjs/operators';
import { PhotoService } from 'src/app/shared/services/photo.service';

import { User } from '../../shared/models/user';
import { AuthService } from '../../shared/services/auth.service';
import { UtilService } from '../../shared/services/util.service';
import { BlogService } from '../blog.service';
import { Post } from '../post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  constructor(
    public auth: AuthService,
    public afs: AngularFirestore,
    public util: UtilService,
    public blogService: BlogService,
    public _photo: PhotoService,
    public route: ActivatedRoute,
    public router: Router,
    public location: Location
  ) {}
  posts: any;
  post: any = new Post();
  user: User;
  action = 'list';
  Editor = ClassicEditor;

  selectedFile: ImageSnippet;

  async ngOnInit() {
    this.auth.currentUser$.subscribe(u => {
      if (u) {
        this.user = u;
        this.posts = this.afs.collection('posts', q => q.orderBy('createDate', 'desc')).valueChanges();
      }
    });

    this.route.paramMap.subscribe(async params => {
      const postId = params.get('postId');
      this.action = postId ? 'edit' : 'list';

      if (postId) {
        this.post = new Post();
        this.post = await this.blogService
          .postRef(postId)
          .get()
          .pipe(map(p => p.data()))
          .toPromise();
      }
    });
  }
}
