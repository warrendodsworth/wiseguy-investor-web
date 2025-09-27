import { Routes } from '@angular/router';
import { homeRoutes } from './home/home.routes';
import { accountsRoutes } from './accounts/accounts.routes';
import { blogRoutes } from './blog/blog.routes';

export const routes: Routes = [
  ...homeRoutes,
  {
    path: 'accounts',
    children: accountsRoutes,
  },
  {
    path: 'blog',
    children: blogRoutes,
  },

  // other routes
];
