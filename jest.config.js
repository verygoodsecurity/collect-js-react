module.exports = {
  verbose: true,
  preset: "ts-jest",
  testMatch: ["**/tests/*.test.tsx"],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: "jsdom",
};

if (process.env.REACT_VERSION === '17') {
  console.log('Testing with React 17');

  module.exports.cacheDirectory = '.cache/jest-cache-react-17';
  module.exports.moduleNameMapper = {
    ...module.exports.moduleNameMapper,
    '^react((\\/.*)?)$': 'react-17$1'
  };
}