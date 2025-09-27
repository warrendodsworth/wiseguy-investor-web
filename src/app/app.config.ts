import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { importProvidersFrom } from '@angular/core';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectDatabaseEmulator, getDatabase, provideDatabase } from '@angular/fire/database';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
import { provideQuillConfig, QuillModule } from 'ngx-quill';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { CoreModule } from './core/core.module';
import { MaterialModule } from './core/material.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    importProvidersFrom(CoreModule.forRoot({ id: 'wgi', title: 'Wiseguy Investor' })),
    importProvidersFrom(MaterialModule),

    importProvidersFrom(QuillModule.forRoot()),
    provideQuillConfig({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ color: [] }, { background: [] }], // dropdown with defaults
          [{ align: [] }],
          ['link', 'image', 'code-block'],
          ['clean'], // remove formatting button
        ],
      },
    }),

    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'wiseguyapp',
        appId: '1:423044829241:web:d3b002d490262564bf7de8',
        databaseURL: 'https://wiseguyapp.firebaseio.com',
        storageBucket: 'wiseguyapp.appspot.com',
        apiKey: 'AIzaSyCar7ZgSXx3bIO1rMycjZhe7UjwGewCXbE',
        authDomain: 'wiseguyapp.firebaseapp.com',
        messagingSenderId: '423044829241',
        measurementId: 'G-VXG0TE4NX5',
      })
    ),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
      return auth;
    }),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
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
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
  ],
};
