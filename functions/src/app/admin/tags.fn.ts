import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { app } from '../../main';
import { errors } from '../shared/util';

export const updateTagUsageCounts = functions.https.onCall((data, ctx) => {
  if (!ctx.auth?.token) throw errors.unauthenticated;

  const db = app.firestore();
  const b = db.batch();
  const currentGroupId = data.currentGroupId;
  const tags = data.tags;
  const selectedTagNames = data.selectedTagNames;

  const selectedTags = selectedTagNames?.map(name => tags.find(t => t.name == name) as any).filter(t => t !== undefined);

  selectedTags.forEach(tag => {
    b.update(db.doc(`tags/${tag.id}`), { usageCount: admin.firestore.FieldValue.increment(1) });

    // group tag analytics
    if (currentGroupId) {
      b.set(db.doc(`groups/${currentGroupId}/tags/${tag.id}`), { ...tag, usageCount: admin.firestore.FieldValue.increment(1) }, { merge: true });
    }
  });

  return b.commit();
});

// todo
class _Tag {
  id!: string;
  name!: string;
  order?: number;
  disabled?: boolean;
}
