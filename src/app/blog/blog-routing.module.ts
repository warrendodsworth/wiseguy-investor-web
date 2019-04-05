
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { PostsComponent } from './posts/posts.component';


const routes: Routes = [
  { path: 'blog', component: BlogComponent },

  { path: 'blog/manage', component: PostsComponent },
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
