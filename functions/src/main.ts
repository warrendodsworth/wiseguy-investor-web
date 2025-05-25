import admin from 'firebase-admin';

import { environment, projectConfig, serviceKeyPath } from './environments/environment';
import { applicationDefault, cert } from 'firebase-admin/app';

// ts - https://firebase.google.com/docs/functions/typescript
// env - https://firebase.google.com/docs/functions/config-env#automatically_populated_environment_variables

const app = admin.initializeApp({
  ...projectConfig.prod,
  credential: environment.prod ? applicationDefault() : cert(serviceKeyPath),
});

const messaging = app.messaging();
const db = app.firestore();
const auth = app.auth();

export { app, messaging, db, auth };
