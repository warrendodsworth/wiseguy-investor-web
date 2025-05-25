import { projectConfig } from '../../environments/environment';
import { db } from '../../main';
import { testEnv } from '../../setup-tests.fn';

describe('my functions', () => {
  let fns: any;

  beforeAll(async () => {
    // after initializeApp call, we load our functions
    // require('../../index'); // causes test to fail
    fns = require('../_demos/weather.demo');
  });

  afterAll(() => {
    // clean things up
    testEnv.cleanup();

    // reset our database
    // admin.firestore().doc('walks/122').delete();
  });

  it('add weather to walk', async () => {
    // add walk
    const data = { id: '122', location: 'London, UK' };
    await db.doc(`/walks/${data.id}`).set(data, { merge: true });

    // function - wrap your `function` method and pass parameter: walk/model
    const snap = testEnv.firestore.makeDocumentSnapshot(data, `/walks/${data.id}`);
    const wrappedFn = testEnv.wrap(fns.onCreateWalk);
    await wrappedFn(snap);

    // get walk
    const created = await db.doc(`/walks/${data.id}`).get();

    // we expect our newly created walk to have weather and a temperature set
    expect(created.data()).toBeTruthy();
    expect(created.data()).toHaveProperty('weather.temperature');
  });

  // guide - https://firebase.google.com/docs/functions/unit-testing#testing_http_functions
  it('call getWeatherFn', async () => {
    // A fake request object, with req.query.text set to 'input'
    const req = { body: JSON.stringify({ location: 'London, UK' }) };
    // A fake response object, with a stubbed redirect function which does some assertions
    const res = {
      // not req
      redirect: (code: any, url: string) => {
        // Assert code is 200
        expect(code).toEqual(200);
        // If the database push is successful, then the URL sent back will have the following format:
        const expectedRef = new RegExp(projectConfig.prod.databaseURL + '/messages/');
        expect(expectedRef.test(url)).toBeTruthy();
      },
      // works
      json: (data: any) => {
        expect(data).toHaveProperty('temperature');
      },
    };

    // Invoke fn with our fake request and response objects. This will cause the
    // assertions in the response object to be evaluated.
    fns.getWeatherFn(req, res);
  });
});

// !done in weather.spec - onCreate fn test
//   it('should store user in db on GoogleOAuth', async () => {
//     const wrapped = testEnv.wrap(api.on);

//     const testUser = {
//       uid: '122',
//       displayName: 'lee',
//     };

//     // wrap your `onUserCreate` method and pass parameter: user
//     // for the sake of brevity, I omitted other `UserRecord` properties.
//     // you can check https://firebase.google.com/docs/reference/js/firebase.User for more information
//     await wrapped(testUser);

//     // we read our user from database
//     const createdUser = await admin.database().ref(`/users/${testUser.uid}`).once('value');

//     // we expect our newly created user to have zero points
//     // expect(createdUser.val()).toHaveProperty('points', 0);
//     expect(createdUser.val()).toBeTruthy();
//   });
