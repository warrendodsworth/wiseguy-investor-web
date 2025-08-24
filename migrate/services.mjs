import { app, auth, db, messaging } from './main.mjs';

export function printUser(user, data) {
  if (user?.uid == undefined) {
    console.log(`User undefined: `, user);
  } else {
    console.log(`User: `, user.uid, ' ', user.displayName, data);
  }
}

export const UserService = {
  ref: (uid) => db.doc(`users/${uid}`),
  snap: (uid) => db.doc(`users/${uid}`).get(),
  get: async (uid) => {
    const snap = await db.doc(`users/${uid}`).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : {};
  },

  metaRef: (uid) => db.doc(`user_meta/${uid}`),
  meta: async (uid) => {
    const snap = await db.doc(`user_meta/${uid}`).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : {};
  },
};

export function processTokens(tokens) {
  if (typeof tokens == 'string') return [tokens];

  const tokens1 = Array.isArray(tokens) ? tokens || [] : Object.keys(tokens || {});
  return tokens1.filter((t) => t !== null && t !== '');
}
