import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { BlogHomeComponent } from './blog-home/blog-home.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostsComponent } from './post-list/post-list.component';
import { SkeletonTextComponent } from '../core/components/skeleton-text.component';
import { AdminGuard } from '../accounts/admin.guard';
import { SharedModule } from '../shared/shared.module';
import { PostComponent } from './components/post/post.component';
import { FormlyCKEditorModule } from '../shared/formly-ckeditor.module';

const routes: Routes = [
  {
    path: '',
    component: BlogHomeComponent,
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
  declarations: [BlogHomeComponent, PostDetailComponent, PostEditComponent],
  imports: [
    SharedModule,

    RouterModule.forChild(routes),

    // standalone components
    SkeletonTextComponent,
    PostComponent,

    FormlyCKEditorModule,
  ],
})
export class BlogModule {}
