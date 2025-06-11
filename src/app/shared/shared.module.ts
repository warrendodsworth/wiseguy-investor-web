import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';

import { CoreModule } from '../core/core.module';
import { UnsplashSearchComponent } from './unsplash/unsplash-search/unsplash-search.component';
import { MaterialModule } from '../core/material.module';
import { EmptyListComponent } from '../core/components/empty-list.component';
import { AppFormlyModule } from './formly/app-formly.module';
import { FormlyModule } from '@ngx-formly/core';

const ui = [UnsplashSearchComponent];
const pipes = [];
const directives = [];

const modules = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,

  // 3rd party
  NgPipesModule,
  FormlyModule,

  // app
  CoreModule,
  MaterialModule,
];
const standaloneComponents = [EmptyListComponent];

@NgModule({
  declarations: [...ui, ...pipes, ...directives, UnsplashSearchComponent],
  imports: [...modules, ...standaloneComponents],
  exports: [...modules, ...ui, ...pipes, ...directives],
})
export class SharedModule {}
