import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'jsx', 'js'],
  watchPathIgnorePatterns: ['node_modules', 'dist', 'coverage', '\\.git'],
  watchman: true,
};

export default config;
