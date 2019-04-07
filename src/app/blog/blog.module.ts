import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ContentLoaderModule } from '@netbasal/content-loader';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogService } from './blog.service';
import { BlogComponent } from './blog/blog.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostComponent } from './post/post.component';
import { PostsComponent } from './posts/posts.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ContentLoaderModule,

    BlogRoutingModule
  ],
  declarations: [
    PostsComponent,
    PostComponent,
    BlogComponent,
    PostDetailComponent
  ],
  providers: [
    BlogService
  ],
  exports: [
    PostComponent
  ]
})
export class BlogModule { }
