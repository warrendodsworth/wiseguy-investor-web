// export const onCreateMember = functions.firestore.document('groups/{groupId}/members/{uid}').onCreate(async (snap, ctx) => {
//   const db = app.firestore();
//   const uid = ctx.params.uid;
//   const groupId = ctx.params.groupId;
//   const member = snap.data();

//   const groupRef = db.doc(`groups/${groupId}`);
//   const userRef = db.doc(`users/${uid}`);

//   Recent members - not required
//   const membersSnap = await groupRef.collection('members').orderBy('createDate', 'desc').get();

//   // add data from the 5 most recent members to the array
//   const recentMembers = membersSnap.docs.slice(0, 5).map(d => {
//         const c: any = { id: d.id, ...d.data() };
// delete c.editUid;
// return c;
//     delete c.editUid;
//     return c;
//   });
//   if (!recentMembers?.length) return null;

//   // get the total count - expensive - could be hundreds of members
//   const memberCount = membersSnap.size;
//   // record last join date
//   const latestJoinDate = recentMembers[0].createDate;

//   return groupRef.update({ memberCount, latestJoinDate });
// });
