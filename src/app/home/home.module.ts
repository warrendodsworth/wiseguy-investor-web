import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BlogModule } from '../blog/blog.module';
import { SharedModule } from '../shared/shared.module';
import { AboutComponent } from './about/about.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [CommonModule, SharedModule, BlogModule, HomeRoutingModule],
  declarations: [HomeComponent, AboutComponent],
})
export class HomeModule {}
