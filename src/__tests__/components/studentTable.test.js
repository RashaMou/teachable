/** @jest-environment jsdom */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudentTable from "@/components/StudentTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("StudentTable", () => {
  const mockStudents = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      enrolledAt: "2023-01-15T12:00:00Z",
      percentComplete: 25,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      enrolledAt: "2023-02-20T12:00:00Z",
      percentComplete: 50,
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      enrolledAt: "2023-03-10T12:00:00Z",
      percentComplete: 75,
    },
  ];

  // Create a fresh Query Client for each test
  const createQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });

  const renderWithQueryClient = (ui, queryClient) => {
    const client = queryClient || createQueryClient();
    return render(
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Set up fetch mock
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockStudents,
    });
  });

  it("renders the student table with initial data", async () => {
    renderWithQueryClient(
      <StudentTable students={mockStudents} courseId={1} />
    );

    // Use findByText instead of getByText when waiting for async elements
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("Jane Smith")).toBeInTheDocument();
    expect(await screen.findByText("Bob Johnson")).toBeInTheDocument();
  });

  it("filters students by search term", async () => {
    renderWithQueryClient(
      <StudentTable students={mockStudents} courseId={1} />
    );

    // Wait for initial render
    await screen.findByText("John Doe");

    // Type in search box
    const searchInput = screen.getByPlaceholderText("Search students...");
    fireEvent.change(searchInput, { target: { value: "Jane" } });

    // Should show only Jane and hide others
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
  });

  it("sorts students when column headers are clicked", async () => {
    renderWithQueryClient(
      <StudentTable students={mockStudents} courseId={1} />
    );

    // Wait for initial render
    await screen.findByText("John Doe");

    // Click on email header to sort by email
    const emailHeader = screen.getByText("Email");
    fireEvent.click(emailHeader);

    // Get all rows - need to find a reliable way to get rows in order
    const rows = screen.getAllByRole("row").slice(1); // Skip header row

    // Check that Bob (b...) comes before Jane (j...) comes before John (j...)
    // This is an indirect way to verify sorting, as Testing Library doesn't guarantee order
    // We're looking at the DOM structure to infer order
    expect(rows[0]).toHaveTextContent("Bob Johnson");
    expect(rows[1]).toHaveTextContent("Jane Smith");
    expect(rows[2]).toHaveTextContent("John Doe");

    // Click again to reverse sort
    fireEvent.click(emailHeader);

    // Need to re-query the rows as React may have re-rendered them
    const rowsAfterReverse = screen.getAllByRole("row").slice(1);
    expect(rowsAfterReverse[0]).toHaveTextContent("John Doe");
    expect(rowsAfterReverse[1]).toHaveTextContent("Jane Smith");
    expect(rowsAfterReverse[2]).toHaveTextContent("Bob Johnson");
  });

  it("fetches next page of students when pagination is clicked", async () => {
    // Initial fetch for first page
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockStudents,
    });

    // Mock second page fetch
    const page2Students = [
      {
        id: 4,
        name: "Alice Brown",
        email: "alice@example.com",
        enrolledAt: "2023-04-05T12:00:00Z",
        percentComplete: 30,
      },
    ];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => page2Students,
    });

    renderWithQueryClient(
      <StudentTable students={mockStudents} courseId={1} />
    );

    // Wait for initial render
    await screen.findByText("John Doe");

    // Click next page button (there might be multiple buttons with "Next" text)
    // Using the more specific one in the desktop pagination section
    const nextButtons = screen.getAllByText("Next");
    const nextButton = nextButtons[1]; // The one in the desktop pagination
    fireEvent.click(nextButton);

    // Should show page 2 data after fetch completes
    await waitFor(() => {
      expect(screen.getByText("Alice Brown")).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });

    // Check that fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/courses/1/students?page=2"
    );
  });

  it("handles error states gracefully", async () => {
    // Mock fetch error
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    renderWithQueryClient(<StudentTable students={[]} courseId={1} />);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/An error has occurred/)).toBeInTheDocument();
    });
  });

  it("shows empty state message when no students match search", async () => {
    renderWithQueryClient(
      <StudentTable students={mockStudents} courseId={1} />
    );

    // Wait for initial render
    await screen.findByText("John Doe");

    // Search for something that won't match any students
    const searchInput = screen.getByPlaceholderText("Search students...");
    fireEvent.change(searchInput, { target: { value: "xyz123" } });

    // Should show empty state message
    expect(
      screen.getByText("No students found matching your search criteria.")
    ).toBeInTheDocument();
  });
});
