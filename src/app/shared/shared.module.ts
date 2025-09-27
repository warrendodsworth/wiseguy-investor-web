import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';

import { FormlyModule } from '@ngx-formly/core';
import { EmptyListComponent } from '../core/components/empty-list.component';
import { SkeletonTextComponent } from '../core/components/skeleton-text.component';
import { CoreModule } from '../core/core.module';
import { FormlyCoreModule } from '../core/formly/formly-core.module';
import { MaterialModule } from '../core/material.module';
import { FORMLY_CONFIG_SHARED } from './shared-formly.config';

// Grouped here only to ensure frequently used Standalone Components can be imported together in one shot
const standaloneComponents = [EmptyListComponent, SkeletonTextComponent];

const modules = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,

  // 3rd party
  NgPipesModule,

  // app
  CoreModule,
  MaterialModule,
  FormlyCoreModule,
];

@NgModule({
  declarations: [],
  imports: [...modules, ...standaloneComponents, FormlyModule.forChild(FORMLY_CONFIG_SHARED)],
  exports: [...modules, ...standaloneComponents],
})
export class SharedModule {}
