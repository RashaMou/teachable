/** @jest-environment node */

import { TeachableClient } from "@/lib/api/client/teachableClient";

describe("TeachableClient", () => {
  describe("initialization", () => {
    it("should initialize from environment variables", () => {
      // The environment variables are already set in jest.setup.js
      const client = TeachableClient.fromEnv();
      // We just need to check that it constructs successfully
      expect(client).toBeInstanceOf(TeachableClient);
    });

    it("should throw error if TEACHABLE_API_KEY is missing", () => {
      const originalApiKey = process.env.TEACHABLE_API_KEY;
      delete process.env.TEACHABLE_API_KEY;

      expect(() => TeachableClient.fromEnv()).toThrow(
        "TEACHABLE_API_KEY environment variable is not set"
      );

      // Restore the environment
      process.env.TEACHABLE_API_KEY = originalApiKey;
    });

    it("should throw error if TEACHABLE_API_URL is missing", () => {
      const originalApiUrl = process.env.TEACHABLE_API_URL;
      delete process.env.TEACHABLE_API_URL;

      expect(() => TeachableClient.fromEnv()).toThrow(
        "TEACHABLE_API_URL environment variable is not set"
      );

      // Restore the environment
      process.env.TEACHABLE_API_URL = originalApiUrl;
    });
  });
});
