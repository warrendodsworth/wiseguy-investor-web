import { app, auth, db, messaging, adminsProd } from './main.mjs';
import { UserService } from './services.mjs';
import admin from 'firebase-admin';
import { FieldValue } from '@google-cloud/firestore';
import { DateTime } from 'luxon';
import { printUser } from './services.mjs';

const storage = app.storage();

console.log('Running Auth');
initAdmins();

// Init
// - add admin role to users
async function initAdmins() {
  const emails = ['warren.dodsworth@gmail.com'];

  emails.map(async (email) => {
    // pciP9RZiVOZut0nhJeVFgoF50vn2 - prod
    // cYaXv0STTNR8aHgu1HhkYgFITAW8 - emulator
    try {
      const user = await auth.getUserByEmail(email);

      if (!user.customClaims.admin) {
        user.customClaims.admin = true;
        await auth.setCustomUserClaims(user.uid, user.customClaims);
        await db.doc('users/' + user.uid).update({ 'roles.admin': true });

        console.log(`User added to admin role: ${user.uid} ${user.email} ${user.displayName}`, user.customClaims);
      }
    } catch (error) {
      console.log(`User not found: ${email} `);
    }
  });
}

async function addGroupIdToUserGroups() {
  const usersSnap = await db.collection('users').where('groups', '!=', null).get();
  let count = 0;

  usersSnap.forEach(async (snap) => {
    const u = { id: snap.id, ...snap.data() };

    try {
      const gids = Object.keys(u.groups);
      if (gids.length > 0) {
        const userData = {};
        count++;

        if (count < 100) {
          gids.forEach((gid) => {
            userData[`groups.${gid}.groupId`] = gid;
          });
          console.log(`user:`, u.id, userData);
          snap.ref.update(userData);
        }
      }
    } catch (error) {
      console.log(`app: - addGroupIdToUserGroups - error:`, error);
    }
  });
}

async function migratePrivacyToMap() {
  const usersSnap = await db.collection('users').get();
  const authUsers = await auth.listUsers();
  let filterCount = 0;

  usersSnap.forEach(async (snap) => {
    const u = { id: snap.id, ...snap.data() };

    if (!u.privacy) {
      const privacy = {
        userJoinReasonPublic: u.userJoinReasonPublic || false,
        userInterestsPublic: u.userInterestsPublic || false,
        wellbeingGraphPublic: u.wellbeingGraphPublic || false,
      };
      filterCount++;
      console.log(filterCount, privacy);
      snap.ref.update('privacy', privacy);
    }
  });
}

async function cleanUserDefaults() {
  const usersSnap = await db.collection('users').get();
  const authUsers = await auth.listUsers();
  let filterCount = 0;

  usersSnap.forEach(async (snap) => {
    const u = { id: snap.id, ...snap.data() };

    try {
      // 1 admin only
      // 2 mate only
      // 3 mate & mentor only
      // 4 user only

      const { admin, mate, mentor, user } = u.roles;
      const write = true;

      if (admin) {
        console.log(u.id, u.roles);
        filterCount++;

        if (write) {
          // for users list filters to work
          snap.ref.update('roles', { admin: true, mate: false, mentor: false, user: true });

          // only necessary claims
          db.doc('user_roles/' + u.id).set('roles', { admin: true });
          await auth.setCustomUserClaims(u.id, { admin: true });
        }
      }

      // if (!user.uid) {
      //   printUser(user);
      // }

      // if (user.email) {
      //   const fbUser = await auth.getUser(userSnap.id);
      //   const meta = await db.doc(`user_meta/${snap.id}`).get();
      //   console.log(user.uid, ` `, user.displayName, user.email, meta.data().email, fbUser.email);
      // }
      // if (!user.roles) {
      //   printUser(user);
      //   const defaultRoles = { admin: false, mate: false };
      // snap.ref.update('roles', defaultRoles);
      //   db.doc(`user_roles/` + snap.id).set({ roles: defaultRoles }, { merge: true });
      // }
      // if (user.email) {
      // const meta = await db.doc(`user_meta/${snap.id}`).get();
      // console.log(user.uid, ` `, user.email === meta.data().email ? 'SAME' : '___DIFF');
      // snap.ref.update('email', FieldValue.delete());
      // console.log(user.uid, ' ', user.email);
      // }
    } catch (error) {}
  });

  // Users with no userDoc
  // authUsers.users.forEach(au => {
  //   if (!usersSnap.docs.map(d => d.id).includes(au.uid)) {
  //     filterCount++;
  //     console.log('User doc not found', au.uid, au.displayName, au.email);
  //   }
  // });

  console.log('Total Count', usersSnap.size);
  console.log('Filter Count', filterCount);
  console.log('Auth Count', authUsers.users.length);
}

// Claims auth - initialize admin users
async function cleanupUserRoles() {
  const users = await auth.listUsers();

  users.users.forEach((u) => {
    if (u.customClaims?.admin) {
      console.log(u.displayName, u.email, u.customClaims);
      //  await auth.setCustomUserClaims(user.uid, user.customClaims);
    }
  });

  // const uid = 'IPgUXyi49dTRedgEdHw5m1iOC902';
  // await auth.setCustomUserClaims(uid, { admin: false, mate: false, mentor: false });
}

async function deleteAllUserData() {
  console.log('Delete User Data');
  const uid = '';

  const batch = db.batch();

  const appUser = await UserService.get(uid);

  // delete, keep if this person has been reported and the reports on them for safety reasons

  // user status: deleted - unsure if we should wipe basic data
  batch.update(db.doc('users/' + uid), { status: 'deleted' });

  // blocklist
  batch.delete(db.doc(`user_blocking/` + uid));

  // groups
  const groupIds = Object.keys(appUser.groups || {});
  groupIds.forEach((gid) => batch.delete(db.doc(`groups/${gid}/members/${uid}`)));

  // chats, messages - pause
  // const userChatDocs = await db.collection(`chats`).where(`uids.${uid}`, '==', true).get();
  // userChatDocs.forEach(s => {
  //   deleteCollection(db, `chats/${s.id}/messages`, 10000);
  //   batch.delete(s.ref);
  // });

  // issues
  const issueDocs = await db.collection(`issues`).where('createUid', '==', uid).get();
  issueDocs.forEach((s) => batch.delete(s.ref));

  promises.push(batch.commit());

  await Promise.all(promises);
  process.exit();
}

// Restore deleted accounts from JSON file
// - Hanh 'Tc98w6t2avcCJNrzGC5kuubdFsr2' - deleted himself
async function restoreUserRecords() {
  // - hwddKjqk46dyq3EMGi3C9QXOZrg2 - db - no auth
  // - 5G32WSD9wNQHF0Rj9PqYsoxgLnu1 - db - auth - doesn't appear to the be the original account
  // * conclusion - even if I try restore the 1st one - it'll reject it as it has a duplicate email
  const uids = ['hwddKjqk46dyq3EMGi3C9QXOZrg2'];

  // Read prod-users backup
  const { users } = require('../prod-users.json');
  // const raw = fs.readFileSync('../prod-users.json');
  // const { users } = JSON.parse(raw);

  const accountsToImport = [];
  if (Array.isArray(users)) {
    users.forEach((ur) => {
      if (uids.includes(ur.localId)) {
        console.log(`Account to restore`, ur);
        ur.uid = ur.localId;
        ur.passwordHash = Buffer.from(ur.passwordHash);
        ur.salt = Buffer.from(ur.salt);
        accountsToImport.push(ur);
      }
    });
  }

  const imported = await auth.importUsers(accountsToImport, {
    hash: {
      algorithm: 'SCRYPT',
      key: Buffer.from(), // needed to import password users - get from console authentication
      rounds: 8,
      memoryCost: 14,
    },
  });
  console.log('Import into FirebaseAuth:', imported);
  imported.errors.forEach((e) => {
    console.log(e.error);
  });
}

async function cleanUsersAuth() {
  const usersSnap = await db.collection('users').get();

  usersSnap.forEach(async (snap) => {
    const user = { id: snap.id, ...snap.data() };

    try {
      const u = await auth.getUser(user.id);
    } catch (error) {
      console.log(user.id, user.displayName);
      console.error(error.errorInfo.code);
    }
  });
}

async function readUsersMetaData() {
  const usersSnap = await db.collection('users').get();

  usersSnap.forEach(async (userSnap) => {
    const user = userSnap.data(); // { id: snap.id, ...snap.data() };

    try {
      const fbUser = await auth.getUser(userSnap.id);
    } catch (error) {
      printUser(user);
      const meta = await db.doc(`user_meta/` + userSnap.id).get();

      console.log(meta.data().email);
      console.log(DateTime.fromMillis(user.lastLoginDate?.seconds * 1000).toISO());

      // meta.ref.delete();
      // userSnap.ref.delete();
    }
  });
}

// fill out user_meta with missing email addresses
async function cleanUsers() {
  const usersSnap = await auth.listUsers();

  usersSnap.users.forEach(async (snap, i) => {
    const user = snap;

    try {
      // Sync user_meta
      // if (user.email) {
      //   console.log(user.uid, ` `, user.displayName, user.email);
      //   await db.doc(`user_meta/${snap.uid}`).set({ email: snap.email }, { merge: true });
      // }
      // Delete Suspicious accounts
      if (user.email.includes('test')) {
        const s = await UserService.snap(user.uid);
        if (!s.exists) {
          console.log('Suspicious', user.uid, ` `, user.displayName, user.email);
          // auth.deleteUser(user.uid);
        }
      }
      // Delete test accounts
      // if (user.email.includes('test') && !user.displayName) {
      //   const s = await UserService.snap(user.uid);
      //   if (!s.exists) {
      //     console.table('Deleting', user.uid, ` `, user.displayName, user.email);
      //     auth.deleteUser(user.uid);
      //   }
      // }
      // Delete anonymous accounts
      // if (!user.email) {
      // const u = await db.doc('users/' + user.uid).get();
      // if (!u.exists) {
      //  auth.deleteUser(user.uid);
      //  console.log(user.uid, ` `, user.displayName, user.email, u.exists ? 'Exists' : `Doesn't exist`);
      // }
      // }
    } catch (error) {
      console.error(error);
    }
  });

  // console.log('Total Users', usersSnap.users.length);
}

async function cleanUsersFromAuth() {
  const usersList = await auth.listUsers();
  let count = 0;

  usersList.users.forEach((u) => {
    const datetime = u.metadata.lastSignInTime;
    const date = DateTime.fromJSDate(new Date(datetime));

    const age = date.diffNow().negate().as('days').toFixed();

    if (age >= 30) {
      console.log(`User: `, u.displayName, age, datetime);
      count++;
    }
  });

  console.log('Total User Count: ', usersList.users.length);
  console.log(`Count: `, count);

  // if (user.email) {
  //   db.doc(`user_meta/` + snap.id).set({ email: user.email }, { merge: true });
  // } else {
  //   printUser(user, user.email);
  // }
  // snap.ref.update({ uid: snap.id });
}

async function moveUserEmails() {
  const usersSnap = await db.collection(`users`).get();
  const p = [];

  usersSnap.forEach((s) => {
    const u = { id: s.id, ...s.data() };

    if (u?.email) {
      console.log(`u `, u.id, u.email);
      // p.push(db.doc('user_meta/' + s.id).set({ email: u.email }, { merge: true }));
      p.push(s.ref.update({ email: FieldValue.delete() }));
    } else {
      console.log(`err `, u.id, u.displayName);
    }
  });

  await Promise.all(p);
  process.exit();
}

async function syncUserMeta() {
  const usersSnap = await auth.listUsers(100);
  const p = [];

  usersSnap.users.forEach((u) => {
    if (u.email) {
      // console.log(`u: `, u.uid, u.displayName, u.email);
      // p.push(db.doc('user_meta/' + s.id).set({ email: u.email }, { merge: true }));
    } else {
      console.log(`anon: `, u.uid, u.displayName);
    }
  });

  await Promise.all(p);
  process.exit();
}

/**
 * not sure - seems like image auth tokens in their urls expire
 * storage api not accessible thru service account err - needs perms
 * - checked console, unclear how to add them
 */
async function updateImageTokens() {
  const usersRef = db.collection(`users`).doc('iyNjjlS32baD93SIAQphmiiWKsB2'); // lizzy
  const usersSnap = await usersRef.get();

  const user = usersSnap.data();
  Object.entries(user).forEach(async ([k, v], i, arr) => {
    if (k.startsWith('photo') && k.endsWith('Path')) {
      console.log(`User: ${user.displayName},  ${k} : ${v}`);

      // get image download url
      const f = await storage.bucket('default').get(v);
      console.log(f);
    }
  });
}

// Claims auth - update claims from db roles
async function migrateRolesToHiddenCollection() {
  const usersRef = db.collection(`users`);
  const usersSnap = await usersRef.get();

  usersSnap.docs.forEach(async (snap, i, arr) => {
    const uid = snap.id;
    const user = snap.data();

    if (user.roles) {
      await db.doc('user_roles/' + uid).set({ roles: user.roles }, { merge: true });

      console.log(`User: `, uid, ' ', user.displayName, ' roles:', user.roles);
    }

    if (i == arr.length - 1) {
      console.log(`User count: `, usersSnap.size);
      process.exit();
    }
  });
}

/**
 * notes
 * - added mentor and mate claims based on their roles
 * - added mateVerified = true to roles.mate = true
 */

// Claims auth - update claims from db roles
async function mapRolesToClaims() {
  // get users in role, add claims or clean old orles
  const role = 'mentor';
  const usersRef = db.collection(`users`).where('roles.' + role, '==', true);
  const usersSnap = await usersRef.get();

  usersSnap.docs.forEach(async (snap, i, arr) => {
    const uid = snap.id;
    const user = snap.data();

    await auth.setCustomUserClaims(uid, { [role]: true });
    // await snap.ref.update({ ['roles.' + role]: admin.firestore.FieldValue.delete() });

    console.log(`User: `, uid, ' ', user.displayName, ' roles.' + role + ':', user.roles[role]);
    if (i == arr.length - 1) {
      console.log(`User count: `, usersSnap.size);
      process.exit();
    }
  });
}

// Delete old roles
async function deleteOldRoles() {
  const role = 'subscriber';
  const usersRef = db.collection(`users`).where('roles.' + role, '==', true);
  const usersSnap = await usersRef.get();

  usersSnap.docs.forEach(async (snap, i, arr) => {
    const uid = snap.id;
    const user = snap.data();

    await snap.ref.update({ ['roles.' + role]: admin.firestore.FieldValue.delete() });

    console.log(`User: `, uid, ' ', user.displayName, ' roles.' + role + ':', user.roles[role]);
    if (i == arr.length - 1) {
      console.log(`User count: `, usersSnap.size);
      process.exit();
    }
  });
}

async function migrateUsers() {
  const res = await stagingApp.auth().listUsers();
  console.log(`Export res[0]:`, res.users[0]);

  const imported = await auth.importUsers(res.users);
  console.log('Import into FirebaseAuth:', imported);
}
