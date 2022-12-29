module.exports = {
  preset: "ts-jest",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  setupFilesAfterEnv: ['./jest.setup.js'],
  globals: {
    "ts-jest": {
      diagnostics: {
        ignoreCodes: [
          2741,
          2339
        ]
      }
    },
  }
};