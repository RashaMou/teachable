if (typeof window !== "undefined") {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };
}

global.fetch = jest.fn();

process.env.TEACHABLE_API_KEY = "test-api-key";
process.env.TEACHABLE_API_URL = "https://test.teachable.api";

global.mockFetchResponse = (data, options = {}) => {
  const response = {
    ok: options.ok !== undefined ? options.ok : true,
    status: options.status || 200,
    statusText: options.statusText || "OK",
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(options.errorText || "Error message"),
  };
  global.fetch.mockResolvedValue(response);
  return response;
};

// Add a helper for error responses
global.mockFetchError = (errorText, status = 400) => {
  return global.mockFetchResponse(null, {
    ok: false,
    status,
    statusText: "Error",
    errorText,
  });
};
