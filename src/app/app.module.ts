import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFireAnalyticsModule,
  APP_NAME,
  APP_VERSION,
  DEBUG_MODE as ANALYTICS_DEBUG_MODE,
  COLLECTION_ENABLED,
  CONFIG,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/compat/analytics';
import { AngularFireAuthModule, USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';
import { AngularFireDatabaseModule, USE_EMULATOR as USE_DATABASE_EMULATOR } from '@angular/fire/compat/database';
import { AngularFirestoreModule, USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';
import { AngularFireFunctionsModule, REGION, USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/compat/functions';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFirePerformanceModule, PerformanceMonitoringService } from '@angular/fire/compat/performance';
import { AngularFireRemoteConfigModule } from '@angular/fire/compat/remote-config';
import { AngularFireStorageModule, USE_EMULATOR as USE_STORAGE_EMULATOR } from '@angular/fire/compat/storage';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { firebaseConfig } from '../environments/firebase-config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { MaterialModule } from './core/material.module';
import { GlobalErrorHandler } from './core/services/error-handler.service';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormlyAppModule } from './core/formly/formly-app.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register(environment.serviceWorker, { enabled: true }),

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
    AngularFireAnalyticsModule,
    AngularFireRemoteConfigModule,
    AngularFirePerformanceModule,

    CoreModule.forRoot({ id: 'wgi', title: 'Wiseguy Investor' }),
    MaterialModule,
    AppRoutingModule,
    FormlyAppModule,
  ],

  declarations: [AppComponent],

  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    // firebase emulators
    { provide: USE_AUTH_EMULATOR, useValue: environment.useEmulators ? ['http://localhost:9099'] : undefined }, // ['http://localhost:9099']
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.useEmulators ? ['localhost', 8080] : undefined },
    { provide: USE_DATABASE_EMULATOR, useValue: environment.useEmulators ? ['localhost', 9000] : undefined },
    { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.useEmulators ? ['localhost', 5001] : undefined },
    { provide: USE_STORAGE_EMULATOR, useValue: environment.useEmulators ? ['localhost', 9199] : undefined },

    // firebase functions
    { provide: REGION, useValue: 'us-central1' },

    // firebase analytics
    { provide: ANALYTICS_DEBUG_MODE, useValue: false }, // prints to console, needed for GA/admin/debug mode to work
    { provide: COLLECTION_ENABLED, useValue: environment.prod },
    { provide: CONFIG, useValue: { send_page_view: true, allow_ad_personalization_signals: false, anonymize_ip: false } },
    // { provide: APP_NAME, useValue: packageJson.name },
    // { provide: APP_VERSION, useValue: packageJson.version },
    ScreenTrackingService,
    UserTrackingService,

    // firebase performance
    PerformanceMonitoringService,

    // For AngularFire upgrade
    // provideHttpClient(),
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
