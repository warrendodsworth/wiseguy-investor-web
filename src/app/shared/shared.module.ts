import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContentLoaderModule } from '@netbasal/content-loader';

const libs = [ContentLoaderModule, FlexLayoutModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...libs],
  exports: [...libs],
})
export class SharedModule {}
