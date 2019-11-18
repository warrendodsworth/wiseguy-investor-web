import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { SharedModule } from '../shared/shared.module';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './components/post/post.component';
import { EditGuard } from './edit.guard';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostsComponent } from './posts/posts.component';

export const blogRoutes: Routes = [
  {
    path: 'blog',
    component: BlogComponent,
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

const postsComponents = [PostComponent, PostsComponent, PostDetailComponent, PostEditComponent];
const blogComponents = [BlogComponent];

@NgModule({
  imports: [CommonModule, FormsModule, CKEditorModule, SharedModule, RouterModule.forChild(blogRoutes)],
  declarations: [...blogComponents, ...postsComponents],
  exports: [PostComponent],
})
export class BlogModule {}
