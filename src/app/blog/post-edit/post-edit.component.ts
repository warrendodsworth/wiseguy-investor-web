import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassicEditor } from 'ckeditor5';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AppUser } from '../../core/models/user';
import { PhotoService } from '../../core/services/photo.service';
import { UtilService } from '../../core/services/util.service';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  templateUrl: './post-edit.component.html',
})
export class PostEditComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _post: PostService,
    public photoService: PhotoService,
    public util: UtilService
  ) {}
  private subs = new Subscription();
  @ViewChild('editForm') editform: NgForm;

  Editor = ClassicEditor;
  user: AppUser;
  post: Post;

  selectedFile: any;
  working = true;

  async ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('postId');
    if (postId) {
      this.post = await this._post
        .post$(postId)
        .pipe(finalize(() => (this.working = false)))
        .toPromise();
    } else {
      this.post = new Post();
      this.working = false;
    }
  }

  async save(post: Post) {
    await this._post.upsertPost(post, this.selectedFile);

    this.editform.reset();
    this.router.navigateByUrl(`/posts`);
  }

  processFile(imageInput: any) {
    // TODO
    // this.selectedFile = this.photoService.processFile(imageInput);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
