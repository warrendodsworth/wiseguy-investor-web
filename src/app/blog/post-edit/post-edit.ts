import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { finalize } from 'rxjs/operators';

import { firstValueFrom } from 'rxjs';
import { PhotoService } from '../../core/services/photo.service';
import { UtilService } from '../../core/services/util.service';
import { SharedModule } from '../../shared/shared.module';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  templateUrl: './post-edit.html',
  imports: [SharedModule],
})
export class PostEditComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public util: UtilService,
    public postService: PostService,
    public photoService: PhotoService,
    private cdRef: ChangeDetectorRef
  ) {}

  form = new FormGroup({});
  options: FormlyFormOptions = { formState: {} };
  model: Post | undefined = new Post();

  working = true;
  selectedFile: any;

  postFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'flex flex-col gap-1',
      fieldGroup: [
        {
          key: 'photoURL',
          type: 'photo',
          className: 'mb-4',
          props: {
            className: 'w-full h-48 rounded-lg bg-gray-100',
            label: 'Photo',
            onFileSelected: (file: any) => (this.selectedFile = file),
          },
        },
        {
          key: 'title',
          type: 'input',
          props: { label: 'Title', placeholder: 'Add a title', required: true },
        },
        {
          key: 'text',
          type: 'rich-editor',
          className: 'mb-4',
          props: { label: 'Body', placeholder: 'Write your post here...' },
        },
        {
          key: 'videoURL',
          type: 'input',
          props: { label: 'Video Embed Url', placeholder: 'eg. youtube' },
        },
        {
          key: 'category',
          type: 'input',
          props: { label: 'Category', placeholder: 'Add a category' },
        },
        { key: 'draft', type: 'toggle', props: { label: 'Draft' } },
        { key: 'featured', type: 'toggle', props: { label: 'Featured' } },
      ],
    },
  ];

  async ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('postId');
    if (postId) {
      this.model = await firstValueFrom(this.postService.one$(postId).pipe(finalize(() => (this.working = false))));
    } else {
      this.model = new Post();
      this.working = false;
    }
    this.cdRef.detectChanges();
  }

  async save(model: Post | undefined) {
    if (!model) return;
    await this.postService.upsertPost(model, this.selectedFile);
    this.form.reset();
    this.router.navigateByUrl(`/posts`);
  }
}
