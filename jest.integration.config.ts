import jestConfig from './jest.config'

module.exports = {
  ...jestConfig,
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFiles: ['<rootDir>/__tests__/e2e/setup-envs.ts']
}
