// module.exports = () => {
//   return {
//     preset: "ts-jest",
//     testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
//     setupFilesAfterEnv: ['./jest.setup.js'],
//   };
// };

module.exports = {
  verbose: true,
  preset: "ts-jest",
  // testMatch: ["(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$"],
  testMatch: ["**/tests/index.test.tsx"],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: "jsdom",
};