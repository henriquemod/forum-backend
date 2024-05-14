import jestConfig from './jest.config'

module.exports = {
  ...jestConfig,
  testMatch: ['**/__tests__/**/*.test.ts']
}
