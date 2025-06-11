import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.page';
import { AdminGuard } from './admin.guard';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'profile', component: UserDetailComponent },
  { path: 'accounts/edit', component: UserEditComponent },

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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}
