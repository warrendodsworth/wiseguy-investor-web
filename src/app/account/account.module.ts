import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentLoaderModule } from '@netbasal/content-loader';

import { AccountRoutingModule } from './account-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ContentLoaderModule, AccountRoutingModule],
  declarations: [EditProfileComponent],
})
export class AccountModule {}
