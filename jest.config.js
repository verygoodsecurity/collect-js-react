module.exports = {
  verbose: true,
  preset: "ts-jest",
  testMatch: ["**/tests/*.test.tsx"],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: "jsdom",
};