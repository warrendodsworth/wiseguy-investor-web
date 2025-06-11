import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { CoreModule } from '../core/core.module';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './components/post/post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostsComponent } from './posts/posts.component';
import { SkeletonTextComponent } from '../core/components/skeleton-text.component';
import { AdminGuard } from '../accounts/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
  },
  {
    path: 'posts',
    children: [
      { path: '', component: PostsComponent, canActivate: [AdminGuard] },
      { path: 'create', component: PostEditComponent, canActivate: [AdminGuard] },
      { path: ':postId', component: PostDetailComponent },
      { path: ':postId/edit', component: PostEditComponent, canActivate: [AdminGuard] },
    ],
  },
];

@NgModule({
  declarations: [BlogComponent, PostComponent, PostsComponent, PostDetailComponent, PostEditComponent],
  imports: [CommonModule, CoreModule, FormsModule, CKEditorModule, RouterModule, SkeletonTextComponent],
  exports: [PostComponent],
})
export class BlogSharedModule {}

@NgModule({
  imports: [CommonModule, CoreModule, BlogSharedModule, RouterModule.forChild(routes)],
})
export class BlogModule {}
