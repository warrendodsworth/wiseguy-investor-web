import { isDevMode } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule, USE_EMULATOR as USE_DATABASE_EMULATOR } from '@angular/fire/compat/database';
import { AngularFirestoreModule, USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';
import {
  AngularFireFunctionsModule,
  ORIGIN as FUNCTIONS_ORIGIN,
  USE_EMULATOR as USE_FUNCTIONS_EMULATOR,
} from '@angular/fire/compat/functions';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreModule } from './app/core/core.module';
import { AppFormlyModule } from './app/shared/formly/app-formly.module';
import { SharedModule } from './app/shared/shared.module';
import { firebaseConfig } from './environments/firebase-config';

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

  // 3rd-party
  AngularFireModule.initializeApp(firebaseConfig),
  AngularFireDatabaseModule, // needed for spy to work
  AngularFirestoreModule,
  AngularFireFunctionsModule,
  AngularFireMessagingModule,

  // core
  AppFormlyModule,
  SharedModule,
  CoreModule.forRoot({ appTitle: 'Test' }, {}),
];

export const emulatorProviders = (emulators: boolean) => [
  { provide: USE_AUTH_EMULATOR, useValue: false ? ['http://localhost:9099'] : undefined },
  { provide: USE_DATABASE_EMULATOR, useValue: emulators ? ['localhost', 9000] : undefined },
  { provide: USE_FIRESTORE_EMULATOR, useValue: emulators ? ['localhost', 8080] : undefined },
  { provide: USE_FUNCTIONS_EMULATOR, useValue: emulators ? ['localhost', 5001] : undefined },
  // { provide: NEW_ORIGIN_BEHAVIOR, useValue: true }, // doesn't exist in af 7
  { provide: FUNCTIONS_ORIGIN, useFactory: () => (isDevMode() ? undefined : location.origin) },
];

export const testStubs = [];
