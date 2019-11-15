import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { PhotoService } from '../shared/services/photo.service';
import { SharedModule } from '../shared/shared.module';
import { BlogManageComponent } from './blog-manage/blog-manage.component';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogService } from './blog.service';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './components/post/post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule, SharedModule, BlogRoutingModule],
  declarations: [BlogManageComponent, BlogComponent, PostComponent, PostDetailComponent],
  providers: [BlogService, PhotoService],
  exports: [PostComponent],
})
export class BlogModule {}
