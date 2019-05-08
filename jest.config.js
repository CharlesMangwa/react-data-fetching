module.exports = {
  coverageDirectory: "./modules/__tests__/__coverage__",
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageReporters: ["lcov"],
  // rootDir: '.',
  // testRegex: './modules/__tests__/.*.spec.js$',
  preset: "ts-jest",
  testEnvironment: "node",
}
