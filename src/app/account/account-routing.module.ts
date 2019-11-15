import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [{ path: 'accounts/edit', component: EditProfileComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
