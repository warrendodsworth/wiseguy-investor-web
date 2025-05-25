/**
 * changed tests only - https://medium.com/@suncommander/run-jest-for-unit-tests-of-modified-files-only-e39b7b176b1b
 */

// jest.config.js
module.exports = {
  verbose: true,
  // rootDir: 'src', // unspeficied rootdir means the dir this file is in
  preset: 'ts-jest', // Use 'ts-jest' if using TypeScript, otherwise remove this line
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.fn.ts'], // Adjust the path if you have setup files
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest', // Use 'babel-jest' if using JavaScript
    '^.+\\.(js|jsx)?$': 'babel-jest', // Add this line to transform ES modules
  },
  testPathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/node_modules/'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    // Add any module name mappings if necessary
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
