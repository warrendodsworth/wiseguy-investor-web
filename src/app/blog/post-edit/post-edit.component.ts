import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { finalize } from 'rxjs/operators';

import { Post } from '../post';
import { PostService } from '../post.service';
import { UtilService } from '../../core/services/util.service';
import { PhotoService } from '../../core/services/photo.service';

@Component({
  templateUrl: './post-edit.component.html',
})
export class PostEditComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _post: PostService,
    public util: UtilService,
    public photoService: PhotoService,
    private cdRef: ChangeDetectorRef
  ) {}

  form = new FormGroup({});
  options: FormlyFormOptions = { formState: {} };
  model: Post = new Post();

  working = true;
  selectedFile: any;

  postFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'flex flex-col gap-1',
      fieldGroup: [
        {
          key: 'photoURL',
          type: 'photo',
          props: {
            label: 'Photo',
            onFileSelected: (file) => (this.selectedFile = file),
          },
        },
        {
          key: 'title',
          type: 'input',
          props: {
            label: 'Title',
            placeholder: 'Add a title',
            required: true,
          },
        },
        {
          key: 'text',
          type: 'ckeditor',
          props: {
            label: 'Text',
            placeholder: 'Write your post here...',
          },
        },

        {
          key: 'videoURL',
          type: 'input',
          props: {
            label: 'Video Embed Url',
            placeholder: 'eg. youtube',
          },
        },
        {
          key: 'category',
          type: 'input',
          props: {
            label: 'Category',
            placeholder: 'Add a category',
          },
        },
        {
          key: 'draft',
          type: 'toggle',
          props: {
            label: 'Draft',
          },
        },
        {
          key: 'featured',
          type: 'toggle',
          props: {
            label: 'Featured',
          },
        },
      ],
    },
  ];

  async ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('postId');
    if (postId) {
      this.model = await this._post
        .post$(postId)
        .pipe(finalize(() => (this.working = false)))
        .toPromise();
    } else {
      this.model = new Post();
      this.working = false;
    }
    this.cdRef.detectChanges();
  }

  async save(model: Post) {
    await this._post.upsertPost(model, this.selectedFile);
    this.form.reset();
    this.router.navigateByUrl(`/posts`);
  }
}
