import { projectConfig } from '../../environments/environment';
import { testEnv } from '../../setup-tests.fn';

/**
 * notif tests - sub/unsub
 * https://github.com/firebase/functions-samples/blob/master/quickstarts/uppercase/functions/test/test.online.js
 */

describe('notifs', () => {
  let fns: any;

  beforeAll(() => {
    // after initializeApp call, we load our functions
    fns = require('../index');
  });

  afterAll(() => {
    // clean things up
    testEnv.cleanup();
  });

  // ! not designed to work with firebase.https.onCall (callable method)
  xit('should call subscribeTopic()', async () => {
    // A fake request object, with req.query.text set to 'input'
    const req = { data: { topic: 'tests', token: '' } };
    // A fake response object, with a stubbed redirect function which does some assertions
    const res = {
      redirect: (code: any, url: string) => {
        // Assert code is 303
        expect(code).toEqual(303);
        // If the database push is successful, then the URL sent back will have the following format:
        const expectedRef = new RegExp(projectConfig.prod.databaseURL + '/messages/');
        expect(expectedRef.test(url)).toBeTruthy();
      },
    };

    fns.subscribeToTopic(req, res);
  });
});
