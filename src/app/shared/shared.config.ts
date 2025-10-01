import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';

import { RouterModule } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { EmptyListComponent } from '../core/components/empty-list.component';
import { SkeletonTextComponent } from '../core/components/skeleton-text.component';
import { CORE_PIPES } from '../core/core.module';
import { FormlyCoreModule } from '../core/formly/formly-core.module';
import { MaterialModule } from '../core/material.module';
import { FormlyChildModule } from './shared-formly.config';

// Grouped here only to ensure frequently used Standalone Components can be imported together in one shot
const standaloneComponents = [EmptyListComponent, SkeletonTextComponent];

const modules = [
  CommonModule,
  RouterModule, // neeeded for routerLink in templates
  FormsModule,
  ReactiveFormsModule,

  // 3rd party
  NgPipesModule,

  // material
  MaterialModule,

  // formly
  FormlyModule,
  FormlyMaterialModule,
  FormlyCoreModule, // needed for custom wrappers and types in components
  FormlyChildModule,
];

export const SHARED_CONFIG = [...modules, ...standaloneComponents, ...CORE_PIPES];
