import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  setupFiles: ["<rootDir>/jest.setup.js"],
};

export default createJestConfig(config);
