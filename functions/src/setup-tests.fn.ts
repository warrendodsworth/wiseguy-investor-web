// setupTests.js
// https://firebase.google.com/docs/functions/unit-testing
// jest https://medium.com/@leejh3224/testing-firebase-cloud-functions-with-jest-4156e65c7d29
// e.g. https://github.com/firebase/functions-samples/tree/master/quickstarts/uppercase/functions

// Mock functions config values
// https://firebase.google.com/docs/functions/unit-testing#mocking_config_values
// testEnv.mockConfig({ stripe: { key: '23wr42ewr34' } });

// Constructing test data
// https://firebase.google.com/docs/functions/unit-testing#constructing_test_data

/**
 * strategy: Online mode (recommended): (live, no emulator) Write tests that interact with a Firebase project dedicated to testing.
 * purpose: To give unit tests access to firebase functions and firestore
 * __dirname: returns an absolute path to the directory of the current file that is being executed
 */

// process.env.NODE_ENV = 'prod'; // online mode recommended in firebase docs

import './main'; // for admin.initializeApp()
import functionsTestInitialize from 'firebase-functions-test';

import { projectConfig, serviceKeyPath } from './environments/environment';

const testEnv = functionsTestInitialize({ ...projectConfig.prod }, serviceKeyPath);

export { testEnv };
