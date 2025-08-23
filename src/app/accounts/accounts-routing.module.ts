import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './admin.guard';
import { UsersComponent } from './user-list/users.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.page';
import { UserEditComponent } from './user-edit/user-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'edit', component: UserEditComponent },

  {
    path: 'users',
    canActivate: [AdminGuard],
    children: [
      { path: '', component: UsersComponent },
      { path: ':uid', component: UserProfileComponent },
      { path: ':uid/edit', component: UserEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}
