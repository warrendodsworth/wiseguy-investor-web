import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContentLoaderModule } from '@netbasal/content-loader';

@NgModule({
  declarations: [],
  imports: [CommonModule, ContentLoaderModule],
  exports: [ContentLoaderModule],
})
export class SharedModule {}
