module.exports = {
  preset: 'ts-jest',
  modulePaths: ['<rootDir>', '<rootDir>/src/'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
