import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PhotoService } from 'src/app/photo.service';

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
    public _photo: PhotoService,
    public route: ActivatedRoute,
    public router: Router,
    public location: Location
  ) { }

  async ngOnInit() {
    this.auth.user$.subscribe(u => {
      if (u) {
        this.user = u;
        this.posts = this.afs.collection('posts', q => q.orderBy('createDate', 'desc')).valueChanges()
      }
    })

    this.route.paramMap.subscribe(async params => {
      let postId = params.get('postId')
      this.action = postId ? 'edit' : 'list';

      if (postId) {
        this.post = {};
        this.post = await this._blog.post_(postId).get().pipe(map(p => p.data())).toPromise()
      }
    })
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
      const uploadSnap = await this._photo.uploadPhotoToFirebase(this.selectedFile.src, post.id)
      post.photoURL = await uploadSnap.ref.getDownloadURL()
    }

    await this._blog.upsertPost(post)
    this.post = {};
    this._util.toastr.success('Post saved')
  }


  selectedFile: ImageSnippet;
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      console.log('file', this.selectedFile)
    });

    reader.readAsDataURL(file);
  }
}


class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}
