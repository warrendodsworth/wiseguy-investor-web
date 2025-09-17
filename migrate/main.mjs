/**
 * https://firebase.google.com/docs/admin/setup#linux-or-macos
 * useEmulators
 * - https://firebase.google.com/docs/emulator-suite/connect_auth#node.js-admin-sdk
 *
 * update doesn't accept firestore.Timestamp
 * - https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
 */

// Use to point to emulator: https://github.com/firebase/firebase-admin-node/issues/575
import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Node env to use emulators
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

const projectId = 'wiseguyapp';

const projectConfig = {
  projectId: projectId,
  databaseURL: `https://${projectId}-default-rtdb.asia-southeast1.firebasedatabase.app`,
};
const app = admin.initializeApp({
  credential: cert(join(__dirname, '../service-key.json')),
  ...projectConfig,
});

const db = app.firestore();
const auth = app.auth();
const messaging = app.messaging();

export { app, db, auth, messaging };

// Extra
export const adminsProd = {
  warrenUid: 'pciP9RZiVOZut0nhJeVFgoF50vn2',
};
