import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContentLoaderModule } from '@netbasal/content-loader';

import { ShowPhotoComponent } from './components/show-photo/show-photo.component';

const libs = [ContentLoaderModule, FlexLayoutModule];
const components = [ShowPhotoComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ...libs],
  exports: [...libs, ...components],
})
export class CoreModule {}
