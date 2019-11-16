import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserEditComponent } from '../account/user-edit/user-edit.component';
import { AdminGuard } from './admin.guard';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'users',
    canActivate: [AdminGuard],
    children: [
      { path: '', component: UsersComponent },
      { path: ':uid', component: UserEditComponent },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
