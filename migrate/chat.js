/* eslint-disable @typescript-eslint/no-unused-vars */
const { DateTime } = require('luxon');
const { FieldValue } = require('@google-cloud/firestore');
const { app, auth, db, messaging } = require('./main');

const twoWeeksAgo = DateTime.now().minus({ weeks: 2 });

console.log(`Running chats`);
updateGroupsUserChatAnalytics();

async function updateGroupsUserChatAnalytics() {
  const chats = await db.collection(`chats`).where('fromGroupId', '!=', null).get();
  const groupMap = {};

  chats.forEach(s => {
    const c = { id: s.id, ...s.data() };

    // if (c.fromUid == 'fkJbbY6dMYdOIpkBza1QjccT0In1') console.log('Chat', c);

    groupMap[c.fromGroupId] = groupMap[c.fromGroupId] || {};
    groupMap[c.fromGroupId][c.fromUid] = groupMap[c.fromGroupId][c.fromUid] || {};

    // time in chats
    const secondsInChat = c.users[c.fromUid]?.secondsInChat;
    if (secondsInChat > 0) {
      groupMap[c.fromGroupId][c.fromUid].totalSecondsInChat = (groupMap[c.fromGroupId][c.fromUid].totalSecondsInChat || 0) + secondsInChat;
    }

    // chat counts
    groupMap[c.fromGroupId][c.fromUid][`chatRequestsMade.${c.toUid}`] = c.status;
  });

  Object.keys(groupMap).forEach(fromGroupId => {
    const groupUsersMap = groupMap[fromGroupId]; // for this group

    Object.keys(groupUsersMap).forEach(fromUid => {
      const updateData = groupUsersMap[fromUid];
      console.log(`member`, fromUid, updateData);

      db.doc(`groups/${fromGroupId}/members/${fromUid}`).update(updateData);
    });
  });

  // better readability
  //  groupMap[c.fromGroupId][c.fromUid].chatRequestsMade = groupMap[c.fromGroupId][c.fromUid].chatRequestsMade || {};
  //  groupMap[c.fromGroupId][c.fromUid].chatRequestsMade[c.id] = c.status;
}

async function queryChatsFromGroupMembers() {
  const refs = await db.collection('chats').where('fromGroupId', '!=', null).get();

  console.log('Total Count', refs.size);

  process.exit();
}

async function queryChatsFromGroupMembers() {
  const b = db.batch();

  const chats = await db.collection(`chats`).where('fromGroupId', '!=', null).get();
  const groupMap = {};

  chats.forEach(s => {
    const c = s.data();
    console.log(s.id);

    const secondsInChat = c.users[c.fromUid]?.secondsInChat;

    if (secondsInChat > 0) {
      groupMap[c.fromGroupId] = groupMap[c.fromGroupId] || {};
      groupMap[c.fromGroupId][c.fromUid] = (groupMap[c.fromGroupId][c.fromUid] || 0) + secondsInChat;
    }
  });

  Object.keys(groupMap).forEach(fromGroupId => {
    const timeMap = groupMap[fromGroupId]; // for this group

    Object.keys(timeMap).forEach(fromUid => {
      //  b.update(db.doc(`groups/${fromGroupId}/members/${fromUid}`), { totalSecondsInChat: timeMap[fromUid] });
    });

    console.log(`app: - Object.keys - timeMap:`, timeMap);
  });
}

async function chatCounts() {
  const refs = await db.collection('chats').get();

  console.log('Total Chat Count', refs.size);

  const groupedByStatus = refs.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .reduce((res, c) => {
      if (!res[c.status]) {
        res[c.status] = 0;
      }

      if (c.status == undefined) {
        console.log(c);
      }

      res[c.status]++;
      return res;
    }, {});

  console.log('Grouped by Status', groupedByStatus);

  process.exit();
}

// 227 Chat request reminders
async function feature227TestQuery() {
  const chatsToNotify = await db.collection('chats').where('status', '==', 'requested').where('editDate', '>', twoWeeksAgo.toJSDate()).get();

  chatsToNotify.forEach(async s => {
    const c = s.data();
    console.log(s.id, c.status, c.toFirstName, c.users[c.toUid]?.role);
  });
}

// Issue: missing messages with Tahlia
async function issueQuery() {
  const mateId = 'c6UsaicUgSbEWQcPhyIIjyC81sb2'; // Tahlia

  const chatsRef = db.collection('chats').where('uids.' + mateId, '==', true);
  const chatsSnap = await chatsRef.get();

  console.log('Chats & Message Counts for - ', mateId, ' Total Chats: ', chatsSnap.size);
  chatsSnap.forEach(async s => {
    const msgs = await s.ref.collection('messages').get();

    console.log('Chat: ', s.id, ` - `, msgs.size, ' messages');
    msgs.forEach(m => {
      const msg = m.data();
      const text = msg.text || '';
      if (text?.includes('therapy')) {
        console.log(`-> Found `, m.id, ': ', msg.text);
      }
    });
  });
}

async function testMyChatQuery() {
  // test Update chats
  const data = { uid: 'pciP9RZiVOZut0nhJeVFgoF50vn2' };
  const chatsSnap = await db.collection('chats').where(`uids.${data.uid}`, '==', true).get();

  chatsSnap.forEach(snap => {
    const chat = snap.data();
    // chat.users[data.uid].name = firstName(data.displayName);
    // chat.users[data.uid].photoURL = data.photoURL;
    // chat.users[data.uid].thumbnailURL = data.photoURLThumb || data.photoURL;

    console.log(chat.users[data.uid]);
    // promises.push(snap.ref.update(chat));
  });
}

async function correctChatUnreadCounts() {
  const promises = [];
  const usersRef = db.collection(`users`).where('chatUnreadCount', '>', 0); // .where('createUid', '==', 'pciP9RZiVOZut0nhJeVFgoF50vn2');
  const usersSnap = await usersRef.get();

  console.log(`User Count: `, usersSnap.size);
  promises = usersSnap.docs.map(async userSnap => {
    const user = userSnap.data();

    // go through the chats of this user
    const userChats = await db.collection('chats').where(`uids.${userSnap.id}`, '==', true).get();
    let chatUnreadCount = 0;
    userChats.forEach(chatSnap => {
      const chat = chatSnap.data();
      chat.usersUnreadCount = chat.usersUnreadCount || {};
      chatUnreadCount += chat.usersUnreadCount[userSnap.id] || 0;
    });

    const corrected = user.chatUnreadCount != chatUnreadCount ? '🟢' : '';
    console.log(`User: `, user.displayName, ' chatUnreadCount:', user.chatUnreadCount, ` corrected:`, chatUnreadCount + ' ', corrected);

    if (corrected) {
      return userSnap.ref.update({ chatUnreadCount });
    }
    return Promise.resolve();
  });

  await Promise.all(promises);
  process.exit();
}

async function migrateUserPhotosToChats() {
  const usersRef = db.collection(`users`); // .where('uid', '==', 'pciP9RZiVOZut0nhJeVFgoF50vn2');
  const usersSnap = await usersRef.get();
  const b = db.batch();

  console.log(`User Count: `, usersSnap.size);
  const usersChats_ = usersSnap.docs.map(snap => {
    // console.log(`> user: `, snap.data().displayName);
    return db.collection('chats').where(`uids.${snap.id}`, '==', true).get();
  });

  const usersChats = await Promise.all(usersChats_);
  usersChats.forEach(userChats => {
    userChats.forEach(chatSnap => {
      const chat = chatSnap.data();

      Object.entries(chat.users).forEach(([uid, chatUser]) => {
        const user = usersSnap.docs.find(u => u.id == uid)?.data();

        // update photo
        if (user) {
          chat.users[uid].photoURL = user.photoURL;
          chat.users[uid].thumbnailURL = user.photoURLThumb || user.thumbnailURL || user.photoURL;
        }
      });

      console.log('> chatUsers', chat.users);
      b.update(chatSnap.ref, { users: chat.users });
    });
  });

  await b.commit();
  process.exit();
}
