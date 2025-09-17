import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then((m) => m.HomeComponent), data: { title: 'Home' } },
  {
    path: 'about',
    loadComponent: () => import('./about/about').then((m) => m.AboutComponent),
    data: { title: 'About' },
  },
  {
    path: 'channel',
    loadComponent: () => import('./channel/channel').then((m) => m.ChannelComponent),
    data: { title: 'Channel' },
  },
];
