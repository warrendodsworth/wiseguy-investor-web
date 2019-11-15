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
  selector: 'app-blog-manage',
  templateUrl: './blog-manage.component.html',
  styleUrls: ['./blog-manage.component.scss'],
})
export class BlogManageComponent implements OnInit {
  constructor(
    public auth: AuthService,
    public afs: AngularFirestore,
    public _util: UtilService,
    public _blog: BlogService,
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
        this.post = await this._blog
          .post_(postId)
          .get()
          .pipe(map(p => p.data()))
          .toPromise();
      }
    });
  }

  newPost() {
    this.post = new Post();
    this.action = 'edit';
  }
  backToList() {
    this.action = 'list';
    this.location.go('/blog/manage');
  }

  async save(post: Post) {
    this.action = 'list';
    this.location.go(`/blog/manage`);

    post.uid = this.user.uid;

    if (this.selectedFile) {
      const uploadSnap = await this._photo.uploadPhotoToFirebase(this.selectedFile.src, post.id);
      post.photoURL = await uploadSnap.ref.getDownloadURL();
    }

    await this._blog.upsertPost(post);
    this.post = new Post();
    this._util.toastr.success('Post saved');
  }
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);

      console.log('file', this.selectedFile);
    });

    reader.readAsDataURL(file);
  }
}

class ImageSnippet {
  pending = false;
  status = 'init';

  constructor(public src: string, public file: File) {}
}
