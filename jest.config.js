/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/$1"
  },
  coverageReporters: ["json", "html"],
  testMatch: ['**/*.spec.(ts|js)']
};