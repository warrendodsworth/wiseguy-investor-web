import { serviceKeyPath } from '../../environments/environment';
import { testEnv } from '../../setup-tests.fn';

describe('my functions', () => {
  // let fns: any;

  beforeAll(() => {
    // after initializeApp call, we load our functions
    // fns = require('../index');
    // console.log('funcs:', fns);
  });

  it('should pass (basic test)', () => {
    expect(testEnv).toBeTruthy();
    expect(serviceKeyPath).toBeTruthy();
  });

  it('should pass (simple test)', () => {
    expect(true).toBe(true);
  });

  afterAll(() => {
    // clean things up
  });
});
