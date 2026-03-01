import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  // Пути для резолвинга алиасов
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@ui(.*)$': '<rootDir>/src/ui$1',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@services(.*)$': '<rootDir>/src/services$1'
  },

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },

  // Игнорируем node_modules и cypress
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],

  // Где искать тесты
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8'
};

export default config;