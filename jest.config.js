module.exports = {
  preset: "ts-jest",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  setupFilesAfterEnv: ['./jest.setup.js'],
};