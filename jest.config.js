/**
 * https://www.amadousall.com/how-to-set-up-angular-unit-testing-with-jest/
 * --runInBand https://stackoverflow.com/questions/65907608/firebase-emulator-leaking-when-using-with-jest
 * simpler use = ng add @briebug/jest-schematic
 * can create config with - https://kulshekhar.github.io/ts-jest/docs/getting-started/installation
 */

// jest.config.js
module.exports = {
  verbose: false,
  testEnvironment: 'node',
  // rootDir: '.',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['./setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup', // from jest-preset-angular readme.md
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@environments/(.*)': '<rootDir>/src/environments/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/functions/', '<rootDir>/src/test.ts'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};

// snapshotSerializers: ['jest-preset-angular/build/serializers/ng-snapshot'],
// transform: {
//   '^.+.(ts|js|html)$': 'jest-preset-angular',
// },
// transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
// coverageReporters: ['html', 'lcov'],
