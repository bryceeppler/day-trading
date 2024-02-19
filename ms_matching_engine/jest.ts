// https://jestjs.io/docs/configuration
// https://jestjs.io/docs/getting-started#using-typescript
// Can be configured in the package.json but it doesn't get picked up by
// the jest extension for vscode
import type { Config } from "jest";

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
};

export default config;
