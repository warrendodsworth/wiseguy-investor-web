import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ContentLoaderModule } from '@netbasal/content-loader';
import { FacebookModule } from 'ngx-facebook';
import { ParallaxModule } from 'ngx-parallax';
import { ToastrModule } from 'ngx-toastr';
import { firebaseConfig } from 'src/environments/firebase.config';

import { AccountModule } from './account/account.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { BlogModule } from './blog/blog.module';
import { FcmService } from './fcm.service';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ContentLoaderModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-left', timeOut: 3000 }),
    FacebookModule.forRoot(),
    ParallaxModule.forRoot(),

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    AccountModule,
    BlogModule,
  ],
  providers: [
    AuthService,
    FcmService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
