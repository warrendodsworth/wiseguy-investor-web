import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
// Add '/compat' to all @angular/fire imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';
import { firebaseConfig } from '../environments/firebase-config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './core/material.module';

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

    MaterialModule,
    AppRoutingModule,
  ],
  providers: [{ provide: APP_BASE_HREF, useFactory: getBaseHref }],
  bootstrap: [AppComponent],
})
export class AppModule {}

function getBaseHref() {
  const el = document.getElementsByTagName('base').item(0);
  return el ? el.href : '/';
}
