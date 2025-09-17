import { Routes } from '@angular/router';
import { AdminGuard } from './admin.guard';

export const accountsRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginComponent),
    title: 'Login',
  },
  {
    path: 'profile',
    loadComponent: () => import('./user-profile/user-profile.page').then((m) => m.UserProfileComponent),
    title: 'Profile',
  },
  {
    path: 'edit',
    loadComponent: () => import('./user-edit/user-edit.page').then((m) => m.UserEditPage),
    title: 'Edit Profile',
  },
  {
    path: 'users',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./user-list/user-list').then((m) => m.UserList),
        title: 'User List',
      },
      {
        path: ':uid',
        loadComponent: () => import('./user-profile/user-profile.page').then((m) => m.UserProfileComponent),
        title: 'User Profile',
      },
      {
        path: ':uid/edit',
        loadComponent: () => import('./user-edit/user-edit.page').then((m) => m.UserEditPage),
        title: 'Edit User',
      },
    ],
  },
];
