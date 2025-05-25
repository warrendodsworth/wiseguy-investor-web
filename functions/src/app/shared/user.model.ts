import { db } from '../../main';

export class Entity {
  id!: string;
  name!: string;
  photoURL!: string;
}

export class UserInfo {
  uid!: string;
  displayName!: string;
  email!: string;
  photoURL!: string;

  providerId = '';

  fcmTokens: string[] = [];
}

export const UserService = {
  userRef: (uid?: string) => db.doc(`users/${uid}`),
  getUser: async (uid: any) => {
    const snap = await db.doc(`users/${uid}`).get();
    return (snap.exists ? { id: snap.id, ...snap.data() } : {}) as any;
  },

  userMetaRef: (uid: string) => db.doc(`user_meta/${uid}`),
  userMeta: async (uid: any) => {
    const snap = await db.doc(`user_meta/${uid}`).get();
    return (snap.exists ? { id: snap.id, ...snap.data() } : {}) as any;
  },
};
