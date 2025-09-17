const { DateTime } = require('luxon');
const { FieldValue } = require('@google-cloud/firestore');
const { app, auth, db, messaging } = require('./main');

migrateMateJoin();

async function migrateMateJoin() {
  const usersRef = db.collection('users').where('mateJoinStatus', '!=', null);
  const usersSnap = await usersRef.get();

  console.log(' Total: ', usersSnap.size);

  usersSnap.forEach(async s => {
    const item = s.data();

    console.log(s.id, ' mateJoinStatus', item.mateJoinStatus);

    if (item.mateJoinStatus != 'verified') {
      s.ref.update(`mateJoin.${item.mateJoinStatus}`, true);
    }
  });
}

// Test Query Mates chat counts
async function mostViewedMates() {
  const start = DateTime.now().minus({ month: 1 }).toJSDate();
  const end = DateTime.now().toJSDate();

  const chatsRef = db.collection('chats').where('createDate', '>=', start).where('createDate', '<=', end);
  const chatsSnap = await chatsRef.get();

  console.log(' Total Chats: ', chatsSnap.size);

  chatsSnap.forEach(async s => {
    const chat = s.data();

    console.log('Chat', s.id, ' Status', chat.status, ' To', chat.toFirstName, ' From', chat.fromFirstName);
  });
}
