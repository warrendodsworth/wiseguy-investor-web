import { db } from '../../main';
import { Entity } from '../shared/user.model';

export class Group extends Entity {
  description = '';
}

export const GroupService = {
  oneRef: (id: string) => db.doc(`groups/${id}`),
  one: async (id: string) => {
    const snap = await db.doc(`groups/${id}`).get();
    return (snap.exists ? { id: snap.id, ...snap.data() } : {}) as Group;
  },
};
