import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from '../core/core.module';
import { AboutComponent } from './about/about.component';
import { ChannelComponent } from './channel/channel.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { PostComponent } from '../blog/components/post/post.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), PostComponent],
  declarations: [],
})
export class HomeModule {}
