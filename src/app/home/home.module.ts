import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogSharedModule } from '../blog/blog.module';
import { CoreModule } from '../core/core.module';
import { AboutComponent } from './about/about.component';
import { ChannelComponent } from './channel/channel.component';
import { HomeComponent } from './home/home.component';
import { SkeletonTextComponent } from '../core/components/skeleton-text.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [CommonModule, CoreModule, BlogSharedModule, RouterModule.forChild(routes), SkeletonTextComponent],
  declarations: [HomeComponent, AboutComponent, ChannelComponent],
})
export class HomeModule {}
