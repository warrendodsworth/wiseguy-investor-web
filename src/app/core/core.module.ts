import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContentLoaderModule } from '@netbasal/content-loader';

import { ConfirmDialogComponent } from './components/confirm-dialog.component';
import { ShowPhotoComponent } from './components/show-photo.component';
import { MaterialModule } from './material.module';

const libs = [ContentLoaderModule, MaterialModule];
const components = [ConfirmDialogComponent, ShowPhotoComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ...libs],
  exports: [...libs, ...components],
})
export class CoreModule {}
