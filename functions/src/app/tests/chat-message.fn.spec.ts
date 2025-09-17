import admin from 'firebase-admin';
import { testEnv } from '../../setup-tests.fn';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { db } from '../../main';

xdescribe('Chat message tests', () => {
  let fns: any;
  const currentUser = { uid: 'pciP9RZiVOZut0nhJeVFgoF50vn2', roles: { admin: true } };
  const mate: any = { uid: 'bp20Jh2o7wO2qexCizPivX5qtv52' }; // Sarah, getwelink@gmail.com

  beforeAll(async () => {
    // after initializeApp call, we load our functions
    fns = require('../chat/chat-request.fn');
  });

  afterAll(async () => {
    // reset our database
    // await db.doc(`chat_requests/${mate.uid}`).delete();

    // clean things up
    await testEnv.cleanup();
  });

  // ! function doesn't exist "onChatRequestUpdate"

  // guide - https://firebase.google.com/docs/functions/unit-testing#using_custom_data
  it('delete chat request', async () => {
    const wrapped = testEnv.wrap(fns.onChatRequestUpdate);
    const mateUid = mate.uid;
    const req = { uid: currentUser.uid, firstName: 'Warren', createDate: Timestamp.now() }; // request chat with self
    const userChatRequests = {
      requests: [],
    };

    await db.doc(`/chat_requests/${mateUid}`).set({ requests: FieldValue.arrayUnion(req) }, { merge: true });

    const afterSnap = testEnv.firestore.makeDocumentSnapshot(userChatRequests, `/chat_requests/${mateUid}`);
    // const change = test.makeChange(beforeSnap, afterSnap);
    await wrapped({ after: afterSnap }); // update funcs need a change object

    // expect().toBe();
  });

  xit('add count & reqs to mates: onChatRequestUpdate', async () => {
    const wrapped = testEnv.wrap(fns.onChatRequestUpdate);
    const mateUid = '122';
    const userChatRequests = {
      requests: [],
    };

    await admin.firestore().doc(`/chat_requests/${mateUid}`).set(userChatRequests, { merge: true });

    const snap = testEnv.firestore.makeDocumentSnapshot(userChatRequests, `/chat_requests/${mateUid}`);
    await wrapped({ after: snap });

    const created = await admin.firestore().doc(`/walks/${mateUid}`).get();

    expect(created.data()).toHaveProperty('requests');
    expect(created.data()).toBeTruthy();
  });
});
