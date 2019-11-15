import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ContentLoaderModule } from '@netbasal/content-loader';
import { FacebookModule } from 'ngx-facebook';
import { ParallaxModule } from 'ngx-parallax';
import { ToastrModule } from 'ngx-toastr';

import { environment } from '../environments/environment';
import { firebaseConfig } from '../environments/firebase.config';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogModule } from './blog/blog.module';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
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

    ContentLoaderModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-left', timeOut: 3000 }),
    FacebookModule.forRoot(),
    ParallaxModule.forRoot(),

    AdminModule,
    HomeModule,
    AccountModule,
    BlogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
