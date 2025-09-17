import * as functions from 'firebase-functions';

import { app } from '../../main';

/**
 * Calculate each Group Member's totalSecondsInChat by tallying time data from each Chat
 *
 * Could Calc. member's chatRequestsMade { toUid: status }
 */
export const processGroupMemberAnalytics = functions.pubsub
  .schedule('0 */12 * * *')
  .timeZone('Australia/Sydney')
  .onRun(async event => {
    const db = app.firestore();
    const b = db.batch();

    const chats = await db.collection(`chats`).where('fromGroupId', '!=', null).get();
    const groupMap = {};

    chats.forEach(s => {
      const c: any = { id: s.id, ...s.data() };

      groupMap[c.fromGroupId] = groupMap[c.fromGroupId] || {};
      groupMap[c.fromGroupId][c.fromUid] = groupMap[c.fromGroupId][c.fromUid] || {};

      // time in chat
      const secondsInChat = c.users[c.fromUid]?.secondsInChat;
      if (secondsInChat > 0) {
        groupMap[c.fromGroupId][c.fromUid][`totalSecondsInChat`] = (groupMap[c.fromGroupId][c.fromUid].totalSecondsInChat || 0) + secondsInChat;
      }

      // chat counts
      groupMap[c.fromGroupId][c.fromUid][`chatRequestsMade.${c.toUid}`] = c.status;
    });

    Object.keys(groupMap).forEach(fromGroupId => {
      const groupUsersMap = groupMap[fromGroupId]; // for this group

      Object.keys(groupUsersMap).forEach(fromUid => {
        const updateData = groupUsersMap[fromUid];

        b.update(db.doc(`groups/${fromGroupId}/members/${fromUid}`), updateData);
      });
    });

    return b.commit();
  });
