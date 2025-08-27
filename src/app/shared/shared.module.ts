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
import { SkeletonTextComponent } from '../core/components/skeleton-text.component';
import { FormlyCKEditorModule } from './formly-ckeditor.module';

// Grouped here only to ensure frequently used Standalone Components can be imported together in one shot
const standaloneComponents = [UnsplashSearchComponent, EmptyListComponent, SkeletonTextComponent];

const modules = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,

  // 3rd party
  NgPipesModule,
  FormlyModule,
  FormlyCKEditorModule,

  // app
  CoreModule,
  MaterialModule,
  // IonicModule,
];

@NgModule({
  declarations: [],
  imports: [...modules, ...standaloneComponents],
  exports: [...modules, ...standaloneComponents],
})
export class SharedModule {}
