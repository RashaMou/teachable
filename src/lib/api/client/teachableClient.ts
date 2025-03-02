interface PaginatedParams {
  page?: number;
  per_page?: number;
}

interface ApiResponse {
  [key: string]: any;
}

interface PaginatedResponse<T> extends ApiResponse {
  meta: {
    page: number;
    total: number;
    number_of_pages: number;
    from: number;
    to: number;
    per_page: number;
  };
}

export class TeachableClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Makes a GET request to the Teachable API
   * @param endpoint The API endpoint to call (without the base URL)
   * @param params Optional query parameters
   * @returns Promise with the response data
   */
  async get<T = any>(
    endpoint: string,
    params: Record<string, string | number> = {}
  ): Promise<ApiResponse> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
          apiKey: this.apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Api request to ${url} failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}: ${error}`);
      throw error;
    }
  }

  /**
   * Makes a GET request with pagination support
   * @param endpoint The API endpoint to call
   * @param params Optional pagination and other parameters
   * @returns Promise with the paginated response data
   */
  async getPaginated<T = any>(
    endpoint: string,
    params: PaginatedParams & Record<string, string | number> = {}
  ): Promise<PaginatedResponse<T>> {
    return this.get<T>(endpoint, params) as Promise<PaginatedResponse<T>>;
  }

  /**
   * Fetches all pages of data for a given endpoint
   * @param endpoint The API endpoint to call
   * @param dataKey The key in the response that contains the array of items
   * @param params Additional query parameters
   * @param perPage Number of items per page (default: 50)
   * @returns Promise with all data combined from all pages
   */
  async getAll<T = any>(
    endpoint: string,
    dataKey: string,
    params: Record<string, string | number> = {},
    perPage: number = 20
  ): Promise<T[]> {
    let allData: T[] = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
      const paginatedParams = {
        ...params,
        page: currentPage,
        per_page: perPage,
      };
      const response = await this.getPaginated<T>(endpoint, paginatedParams);

      const items = response[dataKey];

      if (!Array.isArray(items)) {
        throw new Error(
          `Response does not contain an array at key "${dataKey}"`
        );
      }

      allData = [...allData, ...items];
      totalPages = response.meta.number_of_pages;
      currentPage++;
    } while (currentPage <= totalPages);

    return allData;
  }

  /**
   * Gets a single resource by ID
   * @param endpoint Base endpoint without ID (e.g., '/courses')
   * @param id The resource ID
   * @returns Promise with the single resource
   */
  async getById<T = any>(
    endpoint: string,
    id: string | number
  ): Promise<ApiResponse> {
    const response = await this.get<T>(`${endpoint}/${id}`);
    return response;
  }

  /**
   * Helper method to create a client from environment variables
   */
  static fromEnv(): TeachableClient {
    const apiKey = process.env.TEACHABLE_API_KEY;
    const baseUrl = process.env.TEACHABLE_API_URL;

    if (!apiKey) {
      throw new Error("TEACHABLE_API_KEY environment variable is not set");
    }

    if (!baseUrl) {
      throw new Error("TEACHABLE_API_URL environment variable is not set");
    }

    return new TeachableClient(apiKey, baseUrl);
  }
}
