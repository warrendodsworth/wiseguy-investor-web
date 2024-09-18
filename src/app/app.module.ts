import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ParallaxModule } from 'ngx-parallax';

import { environment } from '../environments/environment';
import { firebaseConfig } from '../environments/firebase.config';
import { AccountsModule } from './account/accounts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogModule } from './blog/blog.module';
import { MaterialModule } from './core/material.module';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    ServiceWorkerModule.register(environment.serviceWorker, { enabled: true }),

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireMessagingModule,
    AngularFireFunctionsModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFireAnalyticsModule,
    ParallaxModule.forRoot(),

    MaterialModule,
    AppRoutingModule,
    AccountsModule,
    HomeModule,
    BlogModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useFactory: getBaseHref },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

function getBaseHref() {
  const el = document.getElementsByTagName('base').item(0);
  return el ? el.href : '/';
}
