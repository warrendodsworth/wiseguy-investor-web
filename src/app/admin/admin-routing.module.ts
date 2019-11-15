import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './admin.guard';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'users',
    children: [{ path: 'manage', component: UsersComponent, canActivate: [AdminGuard] }],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
