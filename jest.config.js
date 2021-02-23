module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "./src"
  ],
  testMatch: [
    "**/__tests__/**/*.test.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};