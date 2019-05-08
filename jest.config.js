module.exports = {
  coverageDirectory: "./modules/__tests__/__coverage__",
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageReporters: ["lcov"],
  roots: ["<rootDir>/modules"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  preset: "ts-jest",
  testEnvironment: "jsdom",
}
