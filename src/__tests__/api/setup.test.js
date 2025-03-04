/** @jest-environment node */

describe("Jest Setup", () => {
  describe("global.fetch mock", () => {
    it("should be a mock function", () => {
      expect(typeof global.fetch).toBe("function");
      expect(jest.isMockFunction(global.fetch)).toBe(true);
    });
  });

  describe("mockFetchResponse helper", () => {
    it("should create a properly structured response", async () => {
      const testData = { key: "value" };

      mockFetchResponse(testData);

      const response = await fetch("any-url");
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toEqual(testData);
    });

    it("should allow custom status codes", async () => {
      mockFetchResponse({}, { status: 201 });

      const response = await fetch("any-url");
      expect(response.status).toBe(201);
    });
  });

  describe("mockFetchError helper", () => {
    it("should create an error response", async () => {
      const errorText = "Custom error message";
      mockFetchError(errorText, 404);

      const response = await fetch("any-url");
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);

      const text = await response.text();
      expect(text).toBe(errorText);
    });
  });
});
