import { NgModule } from '@angular/core';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.page';
import { SharedModule } from '../shared/shared.module';
import { ShowPhotoComponent } from '../core/components/show-photo.component';

@NgModule({
  declarations: [LoginComponent, UserDetailComponent, UserEditComponent, UsersComponent],
  imports: [SharedModule, AccountsRoutingModule, ShowPhotoComponent],
})
export class AccountsModule {}
