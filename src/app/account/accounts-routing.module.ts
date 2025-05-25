import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '../shared/admin.guard';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', redirectTo: 'edit', pathMatch: 'full' },

  { path: 'edit', component: UserEditComponent },
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

// export const accountRoutes: Routes = [
//   { path: '', redirectTo: 'edit', pathMatch: 'full' },
//   {
//     path: '',
//     children: [
//       { path: 'edit', component: UserEditComponent },
//       {
//         path: 'users',
//         canActivate: [AdminGuard],
//         children: [
//           { path: '', component: UsersComponent },
//           { path: ':uid', component: UserEditComponent },
//         ],
//       },
//     ],
//   },
// ];
