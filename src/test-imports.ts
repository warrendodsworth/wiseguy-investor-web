import { isDevMode } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideDatabase, getDatabase, connectDatabaseEmulator } from '@angular/fire/database';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreModule } from './app/core/core.module';
import { SharedModule } from './app/shared/shared.module';
import { firebaseConfig } from './environments/firebase-config';
import { FormlyAppModule } from './app/core/formly/formly-app.module';

// import { IonicStorageModule } from '@ionic/storage-angular'; // test err - can't find IonicStorage in here

export const COMMON_CONFIG = firebaseConfig;
export const currentUser = { uid: 'pciP9RZiVOZut0nhJeVFgoF50vn2', roles: { admin: true } };
/**
 * custom - common imports
 */
export const testImports = [
  RouterTestingModule,
  FormsModule,
  ReactiveFormsModule,

  // core
  FormlyAppModule,
  SharedModule,
  CoreModule.forRoot({ title: 'Test' }, {}),
];

export const testProviders = [
  // Modular AngularFire
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  provideDatabase(() => {
    const db = getDatabase();
    if (isDevMode()) connectDatabaseEmulator(db, 'localhost', 9000);
    return db;
  }),
  provideFirestore(() => {
    const firestore = getFirestore();
    if (isDevMode()) connectFirestoreEmulator(firestore, 'localhost', 8080);
    return firestore;
  }),
  provideFunctions(() => {
    const functions = getFunctions();
    if (isDevMode()) connectFunctionsEmulator(functions, 'localhost', 5001);
    return functions;
  }),
  provideMessaging(() => getMessaging()),
];

// Emulator providers are not needed with modular API, handled in provide* above
export const emulatorProviders = () => [];

export const testStubs = [];
