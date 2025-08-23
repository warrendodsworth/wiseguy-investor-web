import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { BlogComponent } from './blog/blog.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostsComponent } from './posts/posts.component';
import { SkeletonTextComponent } from '../core/components/skeleton-text.component';
import { AdminGuard } from '../accounts/admin.guard';
import { SharedModule } from '../shared/shared.module';
import { PostComponent } from './components/post/post.component';

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
  declarations: [BlogComponent, PostDetailComponent, PostEditComponent],
  imports: [
    SharedModule,
    CKEditorModule,
    RouterModule.forChild(routes),

    // standalone components
    SkeletonTextComponent,
    PostComponent,
  ],
})
export class BlogModule {}
