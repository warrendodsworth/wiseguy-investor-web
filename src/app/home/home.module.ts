import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { ChannelComponent } from './channel/channel.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Home' } },
  { path: 'about', component: AboutComponent, data: { title: 'About' } },
  { path: 'channel', component: ChannelComponent, data: { title: 'Channel' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class HomeModule {}
