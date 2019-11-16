import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { UserEditComponent } from './user-edit/user-edit.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, AccountRoutingModule],
  declarations: [UserEditComponent],
})
export class AccountModule {}
