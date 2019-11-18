import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AccountsRoutingModule } from './accounts-routing.module';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  imports: [CommonModule, FormsModule, SharedModule, AccountsRoutingModule],
  declarations: [UserEditComponent, UsersComponent],
})
export class AccountsModule {}
