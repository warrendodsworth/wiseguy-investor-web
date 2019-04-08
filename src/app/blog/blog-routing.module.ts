import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogManageComponent } from './blog-manage/blog-manage.component';
import { BlogComponent } from './blog/blog.component';
import { EditGuard } from './edit.guard';
import { PostDetailComponent } from './post-detail/post-detail.component';



const routes: Routes = [
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:postId', component: PostDetailComponent },

  { path: 'manage/blog', component: BlogManageComponent, canActivate: [EditGuard] },
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class BlogRoutingModule { }
