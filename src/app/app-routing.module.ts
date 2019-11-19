import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { blogRoutes } from './blog/blog.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'accounts',
    loadChildren: () => import('./account/accounts.module').then(m => m.AccountsModule),
  },

  ...blogRoutes,

  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      initialNavigation: false,
    }),
  ],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class AppRoutingModule {}

// {
//   path: 'blog',
//   loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
// },
// {
//   path: 'posts',
//   loadChildren: () => import('./blog/posts.module').then(m => m.PostsModule),
// },
