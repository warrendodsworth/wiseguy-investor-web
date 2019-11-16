import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { PhotoService } from '../shared/services/photo.service';
import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogService } from './blog.service';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './components/post/post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostsComponent } from './posts/posts.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule, SharedModule, BlogRoutingModule],
  declarations: [PostsComponent, BlogComponent, PostComponent, PostDetailComponent, PostEditComponent],
  providers: [BlogService, PhotoService],
  exports: [PostComponent],
})
export class BlogModule {}
