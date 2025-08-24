const { DateTime } = require('luxon');
const { FieldValue } = require('@google-cloud/firestore');
const { app, auth, db, messaging, printUser, adminsProd } = require('./main');

const promisesAll = [];
console.log('Running migrate');
updateTheme();

async function updateTheme() {
  const users = [
    { '5qmwJGTEWcOff0HHXVk5jZc0JOl2': 'DARK' },
    { '7249PtDHLYYGukn1FJYcDkaEvdQ2': 'DARK' },
    { '9hrOFniVknXKNTNu6mb8P8BFJcf1': 'DARK' },
    { DMEp9N1xzvQdSB60UJKCiSxkY4v2: 'DARK' },
    { E0C4khxupObOq8XQuux0YfRVO9I2: 'DARK' },
    { El8Md1xC5UXnAiZiwtVbiZlY5RJ2: 'DARK' },
    { FJAwfqSKB2RKfb9xUdrWJkZTsGP2: 'DARK' },
    { KTwTceUSfFhaunpFYlIJ5SmEZIn1: 'DARK' },
    { KqnhsyIoQuRPKK33RQnvN8rRld92: 'DARK' },
    { PXdIUw5sLGNmPCLxjBa9dZicXqB2: 'DARK' },
    { R3im0F3syUdbCa1t2fVUs1SFijs1: 'DARK' },
    { RvdcnrFjmUTNz5tCJFBMNuDeHnF3: 'DARK' },
    { Thz8Ycqv6OQzfjmd3bjVrdjnEAM2: 'DARK' },
    { Tp7SA8wHk1Ppd31dZlm2w9WKLSm1: 'DARK' },
    { TpBDiXXH2sWrUtQZMe2BMWDmRH72: 'DARK' },
    { Uo0vfhezWte1HPPgZkuZWMQTaEO2: 'DARK' },
    { V2exQjnoWNgFi4GdSWDsNBY7vgl2: 'DARK' },
    { Xr9yzM3gqLVbrL0pUVlB1zHepoG3: 'DARK' },
    { XxgkfKcfNBhuHf06x7zrWkpI7ou2: 'DARK' },
    { Z3TOmoXGjJbAkOkmk5K7XSVXGwl1: 'DARK' },
    { aR7Natz9mLR6RPBbJ39rP2TRAp23: 'DARK' },
    { bMbBEfPiQyendGIfsGSlfoOO2aU2: 'DARK' },
    { c2Dj1jnRI4MiTt0rch5UpZN17Kv1: 'DARK' },
    { czv3qVNlMBQ3vyDUGXIPERxG2O83: 'DARK' },
    { dj21Q0n7QndrCKCRM6ZGtP80PLG2: 'DARK' },
    { h5Uft3ovovXYEYjobRvW3hXG6552: 'DARK' },
    { hLGgh8c6JcbYHE3MrJGul1KSeDx1: 'DARK' },
    { iz7tbjuveoQN1E3CuYMxV3nTF5x1: 'DARK' },
    { nKJG7LHqv4c9ocCoGh5YsIFrkrH3: 'DARK' },
    { q3glZmTVlANgPcSfaV5gURkURfd2: 'DARK' },
    { sbzGGGKiGvgXSeuFEbIRpn89BrK2: 'DARK' },
    { yHZUe2MSfJSesWIxWmrKJ8FzwNm1: 'DARK' },
    { zbK6TGiC1jUOaC5ag2orB8WkxuS2: 'DARK' },
    { zggInbTSdSXd5MfHu7o6WD9gKaB2: 'DARK' },
    { V4Hm85nFZBZ3S8NJ66CGg1KzObw2: 'DARK' },
    { aTBRmhjVr1bXh0LOU3DzUZ6NrnC2: 'DARK' },
    { e0YmprDuigbEZnmjdIsZUvY6UiV2: 'DARK' },
    { wJsUmydXyAfdkewEhbB32boc3Ki1: 'DARK' },
  ];

  const usersSnap = await db.collection('users').get();

  usersSnap.docs.forEach((snap) => {
    const u = snap.data();

    if (users.find((kv) => Object.keys(kv)[0] == snap.id)) {
      printUser(u, u.theme);
      snap.ref.update({ theme: 'DARK' });
      console.count();
    }
  });

  console.log('Users local: ', users.length);

  // let theme = 'LIGHT';
  // if (u.theme == 'light') {
  //   theme = 'LIGHT';
  // } else if (u.theme == 'dark') {
  //   theme = 'DARK';
  // }
}

async function removeTagsFromUsers() {
  const old = ['Abuse', 'ADHD', 'Anxiety', 'Depression', 'OCD', 'PTSD'];

  const usersWithTagRef = await db.collection('users').where('supportAreas', 'array-contains-any', old).get();

  usersWithTagRef.docs.forEach((snap) => {
    printUser(snap.data());
    snap.ref.update({ supportAreas: FieldValue.arrayRemove(...old) });
  });
}

async function migrateTag() {
  const old = 'Identity';
  const new1 = 'LGBTQIA+';

  const usersWithTagRef = await db.collection('users').where('supportAreas', 'array-contains', old).get();

  usersWithTagRef.forEach((snap) => {
    // snap.ref.set({ supportAreas: FieldValue.arrayRemove(old) }, { merge: true });
    // snap.ref.set({ supportAreas: FieldValue.arrayUnion(new1) }, { merge: true });
  });
}

async function updateGroupUserData() {
  const uid = 'cYaXv0STTNR8aHgu1HhkYgFITAW8';
  const groupsSnap = await db.collectionGroup(`members`).where('uid', '==', uid).get();
  groupsSnap.forEach((s) => {
    const g = s.data();
    console.log(s.id, g.name, g.role, g.status);

    // s.ref.update({ name: ', photoURL: ' });
  });

  process.exit();
}

// Move mateVerified to roles.mate + add mate claim
async function matesMigrateVerifiedToRole() {
  const role = 'mate';
  const usersRef = db.collection(`users`).where('mateVerified', '==', true);
  const usersSnap = await usersRef.get();

  usersSnap.docs.forEach(async (snap, i, arr) => {
    const uid = snap.id;
    const user = snap.data();

    await auth.setCustomUserClaims(uid, { [role]: true });
    await snap.ref.update({ ['roles.' + role]: true });

    console.log(`User: `, uid, ' ', user.displayName, ' roles.' + role + ':', user.roles[role]);
    if (i == arr.length - 1) {
      console.log(`User count: `, usersSnap.size);
      process.exit();
    }
  });
}

async function migrateSupportToIssues() {
  const supportDocs = db.collection(`support`);
  const supportTickets = await supportDocs.get();

  const b = db.batch();

  supportTickets.forEach((s) => {
    b.create(db.doc('issues/' + s.id), s.data());
    console.log(`Issue created: ${s.id}, ${s.data().description}`);
  });

  await b.commit();
  process.exit();
}

// todo delete old docs
async function migrateWellbeingToSingleDocs() {
  const promises = [];
  const wellbeingRef = db.collection(`wellbeing`).where('lastScore', '>', 0); //.where('createUid', '==', 'pciP9RZiVOZut0nhJeVFgoF50vn2');
  const wellbeingSnap = await wellbeingRef.get();
  const colRef = db.collection(`wellbeing`);

  wellbeingSnap.forEach((snap) => {
    const data = snap.data();
    const createUid = snap.id;

    if (data.answers) {
      Object.entries(data.answers).forEach(([date, quizScore]) => {
        const createDate = Timestamp.fromDate(DateTime.fromSQL(date).toJSDate());

        // save each answer in it's own document
        console.log('>', createUid, date, quizScore);
        // promises.push(colRef.add({ quizScore, createUid, createDate }));
      });
    }

    promises.push(snap.ref.delete());
  });

  await Promise.all(promises);
  process.exit();
}

async function migrateTagsToIndividualDocs() {
  const promises = [];
  const tagsRef = db.collection(`tags`);

  // delete old
  const toDelete = await tagsRef.where('name', '!=', 'support').get();
  await Promise.all(toDelete.docs.map((snap) => snap.ref.delete()));

  // add new
  const tagSnap = await db.doc(`tags/support`).get();
  const tags = tagSnap.data().items;
  tags.forEach((tag, index) => {
    console.log('Tag', tag);
    if (tag.id) promises.push(tagsRef.doc(tag.id).set({ name: tag.name, disabled: tag.disabled || false, order: index }));
    else promises.push(tagsRef.add({ name: tag.name, disabled: tag.disabled, order: index }));
  });
  await Promise.all(promises);
  process.exit();
}

async function addOrderToTags() {
  const promises = [];
  const tagsRef = db.collection(`tags`).where('name', '!=', 'support');
  const tagsSnap = await tagsRef.get();
  let i = 1;
  tagsSnap.forEach((snap) => {
    promises.push(snap.ref.update({ order: i++ }));
  });
  await Promise.all(promises);
  process.exit();
}

async function queryMates() {
  const userRefs = await db.collection('users').where('mateVerified', '==', true).get();
  const promises = [];

  userRefs.forEach((snap) => {
    const user = snap.data();

    if (!user.mateJoinStatus) {
      console.log(user.displayName, ' mateVerified:', user.mateVerified, ' mateJoin:', user.mateJoinStatus);
      // promises.push(snap.ref.set({ mateJoinStatus: 'verified' }, { merge: true }));
    }
  });
  await Promise.all(promises);
  process.exit();
}

async function publicAllMateInterests() {
  const userRefs = await db.collection('users').where('mateVerified', '==', true).get();
  const promises = [];

  userRefs.forEach((snap) => {
    promises.push(snap.ref.set({ userInterestsPublic: true }, { merge: true }));
  });
  await Promise.all(promises);
  process.exit();
}

async function updateFeedbackTypes() {
  const docs = await db.collection('feedback').get();
  console.log('Count', docs.size);

  docs.forEach((snap) => {
    const data = snap.data();
    console.log('Feedback:', snap.id, ' type:', data.type.toLowerCase());
    const type = data.type.toLowerCase();
    promisesAll.push(snap.ref.update({ type }));
  });

  await Promise.all(promisesAll);
  process.exit();
}

async function savePages() {
  const localPages = await db.collection('apps/passage/pages').get();
  let pages = [];

  localPages.forEach((snap) => {
    // console.log(snap.data());
    if (snap.id.startsWith('affirmation')) {
      pages.push({ [snap.id]: snap.data() });
    }
  });
  console.log(localPages.docs);
  var fs = require('fs');
  fs.writeFile('pages_export.txt', JSON.stringify(pages), function (err) {
    if (err) {
      console.log(err);
    }
  });
}

async function addPages() {
  const localPages = await db.collection(`apps/passage/pages`);
  const promises = [];
  // localPages.doc('test').set({ hey: 'yo' });
  // localPages.
  var fs = require('fs');

  const toTimestamp = (val) => {
    // const date = DateTime.fromJSDate(val.toDate());
    const timeStamp = Timestamp.fromDate(new Date(val));

    return timeStamp;
  };

  fs.readFile('pages_export.txt', (err, data) => {
    JSON.parse(data).forEach((entry) => {
      const key = Object.keys(entry)[0];
      let values = entry[key];
      values = {
        ...values,
        createDate: toTimestamp(values['createDate']['_seconds'] * 1000),
        editDate: toTimestamp(values['editDate']['_seconds'] * 1000),
      };
      promises.push(localPages.doc(key).set(values));
    });
  });

  await Promise.all(promises);
  process.exit();
}

async function updateUsersRandomizer() {
  const promises = [];
  const userRefs = await db.collection('users').get();

  userRefs.forEach((snap) => {
    const user = snap.data();
    const randomizer = Math.floor(Math.random() * 10000);

    promises.push(snap.ref.set({ randomizer }, { merge: true }));
    console.log(user.displayName, ' randomizer:', randomizer);
  });

  await Promise.all(promises);
  process.exit();
}

async function correctNegativeCounts() {
  const userDocs = await db.collection('users').where('chatUnreadCount', '<', 0).get();
  console.log('User count', userDocs.size);

  userDocs.forEach((snap) => {
    const user = snap.data();
    console.log('User:', snap.id, ' chatUnreadCount:', user.chatUnreadCount);
    promisesAll.push(snap.ref.update({ chatUnreadCount: 0 }));
  });

  const userDocs2 = await db.collection('users').where('chatRequestCount', '<', 0).get();
  userDocs2.forEach((snap) => {
    const user = snap.data();
    console.log('User:', snap.id, ' chatRequestCount:', user.chatRequestCount);
    promisesAll.push(snap.ref.update({ chatRequestCount: 0 }));
  });

  await Promise.all(promisesAll);
  process.exit();
}

async function migrateChatsToHaveToFrom() {
  const promises = [];
  const chatDocs = await db.collection('chats').get();
  console.log('Chats count', chatDocs.size);

  let uids = chatDocs.docs
    .filter((s) => {
      const chat = s.data();
      if (!chat.fromUid || !chat.toUid) {
        return true;
      }
      return false;
    })
    .map((s) => Object.keys(s.data().users || {}))
    .flat();
  uids = [...new Set(uids)];

  const userDocs = await Promise.all(uids.map((id) => db.doc(`users/${id}`).get()));

  console.log('ChatUsers withIncorrectRoles:', userDocs.length);

  chatDocs.forEach((chatDoc) => {
    let chat = chatDoc.data();
    chat.id = chatDoc.id;
    const users = Object.values(chat.users || {});

    // if (chat.id) {
    //   console.log('Clean Chat id:', chat.id);
    //   if (chat.id == 'bbrtHUr59XNVM8YfvoKA') {
    //   delete chat.uids2;
    //   delete chat.users2;
    //   delete chat.id;
    //   promises.push(chatDoc.ref.set(chat));
    //   }
    // }

    if (!(chat.fromUid && chat.toUid)) {
      // role correction
      users.forEach(async (u, i, arr) => {
        const userDoc = userDocs.find((s) => s.id == u.uid);
        const user = userDoc.data();

        chat.users[u.uid].role = user.mateVerified ? 'Mate' : 'User';
        arr[i] = u = chat.users[u.uid];
      });

      if (users.length == 2) {
        // mate mate
        if (users[0].role == 'Mate' && users[1].role == 'Mate') {
          chat = setFromTo(chat, users[0], users[1]);
        } else if (users[0].role == 'User' && users[1].role == 'User') {
          // console.log(chatDoc.id);
          chat = setFromTo(chat, users[0], users[1]);
        } else {
          // user mate
          const u1 = users.find((u) => u.role == 'User');
          const m1 = users.find((u) => u.role == 'Mate');
          setFromTo(chat, u1, m1);
        }
      }
      // self chat
      else if (users.length == 1) {
        chat = setFromTo(chat, users[0], users[0]);
      }

      // print
      console.log('[cId]:', chat.id, ' from:', chat.fromUid, ' to:', chat.toUid);
      users.forEach(async (u) => {
        const userDoc = userDocs.find((s) => s.id == u.uid);
        const user = userDoc.data();
        const firstName = user.displayName.split(' ')[0];
        //  ' [u] name:', firstName,
        console.log('[c] uid:', u.uid, ' name', u.name, ' role:', u.role, ' mate:', user.mateVerified);
      });

      // update
      delete chat.id;
      promises.push(chatDoc.ref.set(chat, { merge: true }));
    }
  });

  function setFromTo(chat, from, to) {
    if (!from || !to) {
      console.log('UNDEFINED from or to:', chat.id);
      return chat;
    }

    chat.fromUid = from.uid;
    chat.fromFirstName = from.name;
    chat.toUid = to.uid;
    chat.toFirstName = to.name;
    return chat;
  }

  await Promise.all(promises);
  process.exit();
}

async function migrateChatRequestsToChats() {
  const promises = [];
  const reqDocs = await db.collection('chat_requests').get();
  const chatsRef = db.collection('chats');

  const uids = reqDocs.docs
    .map((snap) => {
      const req = snap.data();

      return [req.fromUid, req.toUid];
    })
    .flat(3)
    .filter((id) => !!id);
  // console.log('Uids', uids);

  const userDocs = await Promise.all(uids.map((uid) => db.doc(`users/${uid}`).get()));
  const users = userDocs.map((snap) => snap.data());

  reqDocs.forEach((snap) => {
    const req = snap.data();

    if (req && req.fromUid && req.toUid) {
      const fromUser = users.find((u) => u.uid == req.fromUid);
      const toUser = users.find((u) => u.uid == req.toUid);

      console.log('Request: From', fromUser?.displayName, req.fromUid, '- To', toUser?.displayName, req.toUid);

      const chat = {
        archived: true, // don't let old code users see these requests as open chats
        status: 'requested',
        fromUid: req.fromUid,
        fromFirstName: fromUser.displayName.split(' ')[0] || '',
        toUid: req.toUid,
        toFirstName: toUser.displayName.split(' ')[0] || '',
        users: {},
        uids: { [req.fromUid]: true, [req.toUid]: true },
        createDate: req.createDate,
        createUid: req.createUid,
        editDate: req.editDate,
        editUid: req.editUid,
      };
      chat.users[toUser.uid] = {
        uid: toUser.uid,
        name: toUser.displayName,
        photoURL: toUser.photoURL,
        role: 'Mate',
        notificationsEnabled: true,
      };
      chat.users[fromUser.uid] = {
        uid: fromUser.uid,
        name: fromUser.displayName,
        photoURL: fromUser.photoURL,
        role: 'User',
        notificationsEnabled: true,
      };

      // console.log('Chat', chat);
      promises.push(chatsRef.doc(snap.id).set(chat, { merge: true }));
    }
  });

  // snap.ref.delete(); // todo del req on migration

  await Promise.all(promises);
  process.exit();
}

async function migrateUsersChatReqArrays() {
  const promises = [];
  const refs = await db.collection('users').get();
  console.log('Result count', refs.size);

  refs.forEach((snap) => {
    const data = snap.data();
    const chatRequestsMade = {};

    if (data.chatsRequested)
      data.chatsRequested.forEach((uid) => {
        chatRequestsMade[uid] = 'requested';
      });

    if (data.chatRequestsAccepted)
      data.chatRequestsAccepted.forEach((uid) => {
        chatRequestsMade[uid] = 'open';
      });

    console.log('User:', data.displayName, snap.createTime.toDate(), chatRequestsMade);
    promises.push(snap.ref.set({ chatRequestsMade }, { merge: true }));
  });
  await Promise.all(promises);
  process.exit();
}

async function migrateChatUsers1() {
  const promises = [];
  const refs = await db.collection('chats').get();
  console.log('Chat count:', refs.size);

  refs.forEach((snap) => {
    const chat = snap.data();

    if (chat.users) {
      // if (!chat.users2?.length) console.log('no users2', snap.id);

      chat.users = (chat.users ? Object.entries(chat.users) : chat.users2 || [])
        .map(([uid, u]) => {
          return { uid, ...u };
        })
        .reduce((p, c) => {
          p[c.uid] = c;
          return p;
        }, {});

      console.log(
        'Updated:',
        Object.keys(chat.users),
        Object.values(chat.users).map((u) => ({ uid: u.uid, name: u.name }))
      );
      promises.push(snap.ref.set({ ...chat }, { merge: true }));
    }
  });

  await Promise.all(promises);
  process.exit();
}

async function migrateChatMessages() {
  const promises = [];

  const msgRefs = await db.collectionGroup('messages').get();
  console.log('Msg count', msgRefs.size);

  msgRefs.forEach((snap) => {
    const msg = snap.data();

    if (!msg.fromUid) {
      console.log('Msg Updated:', msg.uid, msg.text);
      promises.push(snap.ref.set({ fromUid: msg.uid, fromFirstName: msg.senderName || '' }, { merge: true }));
    }
  });
  await Promise.all(promises);
  process.exit();
}

async function updateUsersCreateDate() {
  const promises = [];
  const refs = await db.collection('users').get();
  console.log('Result count', refs.size);

  refs.forEach((snap) => {
    const data = snap.data();
    console.log('User:', data.displayName, snap.createTime.toDate());
    promises.push(snap.ref.set({ createDate: snap.createTime.toDate() }, { merge: true }));
  });
  await Promise.all(promises);
  process.exit();
}

async function updateChats() {
  const promises = [];
  const chatRefs = await db.collection('chats').get();
  console.log('Chat count', chatRefs.size);

  chatRefs.forEach((snap) => {
    const chat = snap.data();
    if (chat.archived == undefined || chat.archived == null) {
      console.log('Chat:', chat);
      promises.push(snap.ref.set({ archived: false }, { merge: true }));
    }
  });
  await Promise.all(promises);
  process.exit();
}

async function updateUsersLastActiveDate() {
  const userRefs = await db.collection('users').get();

  const date = Timestamp.fromDate(DateTime.now().minus({ days: 4 }).toJSDate());
  const promises = [];

  const daysAgo7 = DateTime.now().minus({ weeks: 1 });
  console.log('DaysAgo7:' + daysAgo7.startOf('day').toISO());

  userRefs.forEach((snap) => {
    const user = snap.data();
    // find user who's lad == daysAgo7 and update those users
    if (DateTime.fromSeconds(+user.lastActiveDate._seconds).startOf('day').toISO() == daysAgo7.startOf('day').toISO()) {
      promises.push(snap.ref.set({ lastActiveDate: date }, { merge: true }));
      console.log(user.displayName, 'set lastActiveDate:', user.lastActiveDate);
    }
  });
  await Promise.all(promises);
  process.exit();
}

async function queryStaleMates() {
  const twoWeeksAgo = DateTime.now().minus({ weeks: 2 });

  const usersRef = await db
    .collection('users')
    .where('mateActive', '==', true)
    .where('lastActiveDate', '<', twoWeeksAgo.toJSDate())
    .get();
  usersRef.forEach((snap) => {
    const user = snap.data();
    const editDate = DateTime.fromSeconds(user.editDate.seconds);
    console.log(user.displayName, editDate.toISODate(), editDate.diffNow().negate().as('days').toFixed());

    // snap.ref.set({ mateActive: false }, { merge: true });
  });
  process.exit();
}

async function resetUnreadCounts() {
  const userRefs = await db.collection('users').get();
  userRefs.forEach((snap) => {
    snap.ref.set({ chatUnreadCount: 0 }, { merge: true });
  });

  const chatRefs = await db.collection('chats').get();
  chatRefs.forEach((snap) => {
    snap.ref.set({ usersUnreadCount: {} }, { merge: true });
  });
}

async function addTagIds() {
  const tagRef = db.doc('tags/support');
  const tag = (await tagRef.get()).data();
  console.log(`🚀 ~ file: migrate.js ~ line 37 ~ tag.data()`, tag);
  tag.items.forEach((item, i) => {
    const docRef = db.collection('_').doc();
    const newId = docRef.id;

    item.id = newId;
  });
  console.log(tag.items);
  tagRef.set({ items: tag.items }, { merge: true });
}

async function migrateChatUsers() {
  const chatRefs = await db.collection('chats').get();
  console.log('Chat count', chatRefs.size);

  chatRefs.forEach((snap) => {
    const chat = snap.data();

    if (chat.users) {
      const users2 = Object.entries(chat.users).map(([uid, u]) => ({ uid, ...u, notificationsEnabled: true }));
      users2.forEach((u) => {
        chat.users[u.uid].notificationsEnabled = true;
      });

      snap.ref.set({ users2: users2, users: chat.users }, { merge: true });
    }
  });
}

async function migrateChatsRequested() {
  const userRefs = await db.collection('users').get();

  userRefs.forEach((u) => {
    const user = u.data();
    if (user.chatsRequested?.length > 0) console.log('Updating user:', user.uid, user.chatsRequested);

    const reqs = user.chatsRequested?.map((c) => c.uid);
    if (reqs) {
      u.ref.update({ chatsRequested: reqs });
    }
  });
}

async function migrateFCMTokens() {
  const userRefs = await db.collection('users').get();

  userRefs.forEach((snap) => {
    const user = snap.data();

    const tokenArr = Object.keys(user.fcmTokens || {});

    if (tokenArr) {
      snap.ref.update({ fcmTokens: tokenArr });
    }
  });
}

async function duplicateDoc() {
  const colPath = `apps/passage/pages`;

  const prevId = 'welcome';
  const newId = 'wellbeing';

  const doc = (await db.doc(`${colPath}/${prevId}`).get()).data();

  await db.doc(`${colPath}/${newId}`).set({ ...doc }, { merge: true });
  console.log('Duplicated Doc:', doc);
}

async function migrateTags() {
  const snaps = await db.collection('tags').where('type', '==', 'focus').get();

  // copy tags into doc
  const tags = snaps.docs.map((s) => s.data()).map((t) => ({ name: t.name }));

  const id = 'support';
  const tagGroup = { name: id, editDate: new Date(), disabled: true, items: tags };
  const docRef = db.doc(`tags/${id}`);
  await docRef.set(tagGroup, { merge: true });

  //backup
  const docBackupRef = db.doc(`tags/${id}_backup`);
  await docBackupRef.set(tagGroup, { merge: true });

  // await docRef.update({ items: admin.firestore.FieldValue.arrayUnion(...tags) });
  // special update works only with 'firebase/compat/app' NOT with 'firebase-admin'

  // get & backup into second doc
  let res = await docRef.get();
  console.log('tags>' + id, res.data());

  // await Promise.all(snaps.docs.map(s => s.ref.delete()));

  process.exit();
}

async function cleanUsersSupportTags() {
  const cols = dbAdmin.collection('users');
  const snaps = await cols.get();
  console.log('snaps:', snaps.size);

  snaps.forEach(async (s) => {
    let d = s.data();

    // migrate focus > supportAreas
    // if (d.focus) {
    //   d.supportAreas = d.focus;
    //   delete d.focus;
    //   console.log('user:', d.displayName, d.focus, d.supportAreas);
    //   await s.ref.set(d);
    // }
  });
}

// migrateBirthdays();
async function migrateBirthdays() {
  const cols = dbAdmin.collection('users').where('age', '>', 0);
  const snaps = await cols.get();

  snaps.forEach(async (s) => {
    let d = s.data();
    if (d['age']) {
      let birthday = DateTime.now().minus({ years: d['age'] });
      console.log('user.birthday:', d.displayName, birthday.toISODate());

      // await s.ref.update('birthday', birthday.toJSDate());
    }
  });
}
