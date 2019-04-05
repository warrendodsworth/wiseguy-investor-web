import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentLoaderModule } from '@netbasal/content-loader';
import { AccountRoutingModule } from './account-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ContentLoaderModule,

    AccountRoutingModule
  ],
  declarations: [
    EditProfileComponent,
  ],
  providers: [

  ],
  exports: [

  ]
})
export class AccountModule { }
