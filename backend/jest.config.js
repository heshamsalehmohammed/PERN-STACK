// jest.config.js => https://jestjs.io/docs/en/configuration

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/coverage/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  automock: false,
  maxWorkers: 2,
  maxConcurrency: 1,
  verbose: true,
  errorOnDeprecated: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|ts)$': [
      'ts-jest',
      { babelConfig: true, tsconfig: 'tsconfig.spec.json' },
    ],
  },
  collectCoverage: true,
  coverageReporters: ['html', 'lcov'],
  coverageDirectory: 'coverage/unit_test_coverage',
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverageFrom: ['src/**/*.{js,ts}', '!**/node_modules/**'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/test/'],
};
