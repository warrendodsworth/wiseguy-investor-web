import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogComponent } from './blog/blog.component';
import { EditGuard } from './edit.guard';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostsComponent } from './posts/posts.component';

const routes: Routes = [
  {
    path: 'blog',
    children: [{ path: '', component: BlogComponent }],
  },
  {
    path: 'posts',
    children: [
      { path: '', component: PostsComponent, canActivate: [EditGuard] },
      { path: 'create', component: PostEditComponent, canActivate: [EditGuard] },
      { path: ':postId', component: PostDetailComponent },
      { path: ':postId/edit', component: PostEditComponent, canActivate: [EditGuard] },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
