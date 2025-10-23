export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extnesionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        isolatedModules: true,
        tsconfig: {
          module: "nodenext",
          target: "es2017",
        },
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  testTimeout: 10000,
  forceExit: true,
};
