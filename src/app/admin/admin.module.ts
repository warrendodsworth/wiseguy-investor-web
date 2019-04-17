import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ContentLoaderModule } from '@netbasal/content-loader';

import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ContentLoaderModule,

    AdminRoutingModule,
  ]
})
export class AdminModule { }
