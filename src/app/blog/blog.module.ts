import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { CoreModule } from '../core/core.module';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './components/post/post.component';
import { EditGuard } from './edit.guard';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostsComponent } from './posts/posts.component';

const routes: Routes = [
  {
    path: '',
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
  declarations: [...blogComponents, ...postsComponents],
  imports: [CommonModule, CoreModule, FormsModule, CKEditorModule, RouterModule],
  exports: [PostComponent],
})
export class BlogSharedModule {}

@NgModule({
  imports: [CommonModule, CoreModule, BlogSharedModule, RouterModule.forChild(routes)],
})
export class BlogModule {}
