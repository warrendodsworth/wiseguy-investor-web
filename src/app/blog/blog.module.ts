import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ContentLoaderModule } from '@netbasal/content-loader';

import { PhotoService } from '../photo.service';
import { BlogManageComponent } from './blog-manage/blog-manage.component';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogService } from './blog.service';
import { BlogComponent } from './blog/blog.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostComponent } from './post/post.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ContentLoaderModule,
    CKEditorModule,

    BlogRoutingModule
  ],
  declarations: [
    BlogManageComponent,
    BlogComponent,
    PostComponent,
    PostDetailComponent
  ],
  providers: [
    BlogService,
    PhotoService
  ],
  exports: [
    PostComponent
  ]
})
export class BlogModule { }
