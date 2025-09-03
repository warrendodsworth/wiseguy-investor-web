import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';
import { firebaseConfig } from '../environments/firebase-config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { MaterialModule } from './core/material.module';
import { GlobalErrorHandler } from './core/services/error-handler.service';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { FormlyAppModule } from './core/formly/formly-app.module';

// Modular AngularFire imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideDatabase, getDatabase, connectDatabaseEmulator } from '@angular/fire/database';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { provideStorage, getStorage, connectStorageEmulator } from '@angular/fire/storage';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register(environment.serviceWorker, { enabled: true }),

    CoreModule.forRoot({ id: 'wgi', title: 'Wiseguy Investor' }),
    MaterialModule,
    AppRoutingModule,
    FormlyAppModule,
  ],
  declarations: [AppComponent],
  providers: [
    // Modular Firebase initialization
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
      return auth;
    }),
    provideDatabase(() => {
      const db = getDatabase();
      if (environment.useEmulators) {
        connectDatabaseEmulator(db, 'localhost', 9000);
      }
      return db;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
    provideStorage(() => {
      const storage = getStorage();
      if (environment.useEmulators) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      return storage;
    }),
    provideAnalytics(() => getAnalytics()),
    provideRemoteConfig(() => getRemoteConfig()),
    providePerformance(() => getPerformance()),
    provideMessaging(() => getMessaging()),

    // Analytics and Performance services
    ScreenTrackingService,
    UserTrackingService,
    // PerformanceMonitoringService,

    // { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    provideHttpClient(withInterceptorsFromDi()),
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
