import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { EmptyListComponent } from '../core/components/empty-list.component';
import { SkeletonTextComponent } from '../core/components/skeleton-text.component';
import { CORE_PIPES } from '../core/core.module';
import { MaterialModule } from '../core/material.module';

// Grouped here only to ensure frequently used Standalone Components can be imported together in one shot
const standaloneComponents = [EmptyListComponent, SkeletonTextComponent];

const modules = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,

  // 3rd party
  NgPipesModule,
  FormlyModule,

  // app
  MaterialModule,
  FormlyMaterialModule,
];

export const SHARED_CONFIG = [...modules, ...standaloneComponents, ...CORE_PIPES];
