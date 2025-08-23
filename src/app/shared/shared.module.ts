import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';

import { CoreModule } from '../core/core.module';
import { UnsplashSearchComponent } from './photos/unsplash-search/unsplash-search.component';
import { MaterialModule } from '../core/material.module';
import { FormlyModule } from '@ngx-formly/core';
import { EmptyListComponent } from '../core/components/empty-list.component';
// import { IonicModule } from '@ionic/angular';

const standaloneComponents = [UnsplashSearchComponent, EmptyListComponent];
const ui = [];
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
  // IonicModule,
];

@NgModule({
  declarations: [...ui, ...pipes, ...directives],
  imports: [...modules, ...standaloneComponents],
  exports: [...modules, ...standaloneComponents, ...pipes, ...directives],
})
export class SharedModule {}
