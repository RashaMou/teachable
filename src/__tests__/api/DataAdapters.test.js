/** @jest-environment node */

import { transformCourseData, transformStudentData } from "@/lib/DataAdapters";
import { TeachableClient } from "@/lib/api/client/teachableClient";

// Mock the entire TeachableClient module
jest.mock("../../lib/api/client/teachableClient", () => {
  // Create a mock client with all methods we need
  const mockClient = {
    getAll: jest.fn(),
    getPaginated: jest.fn(),
    getById: jest.fn(),
    get: jest.fn(),
  };

  return {
    TeachableClient: {
      fromEnv: jest.fn().mockReturnValue(mockClient),
    },
  };
});

// Export the mock client so we can access it in our tests
export const getMockClient = () => {
  return TeachableClient.fromEnv();
};

describe("DataAdapters", () => {
  describe("transformCourseData", () => {
    it("should transform course data and add enrollment information", async () => {
      // Get the mock client
      const mockClient = getMockClient();

      // Mock the API response for getAll
      const mockCourses = [
        { id: 1, title: "Course 1", is_published: true },
        { id: 2, title: "Course 2", is_published: true },
      ];
      mockClient.getAll.mockResolvedValue(mockCourses);

      // Mock the getPaginated for enrollment data
      // This is used inside getEnrollmentData function
      mockClient.getPaginated.mockResolvedValue({
        meta: { total: 10 },
        enrollments: [
          { user_id: 101, course_id: 1 },
          { user_id: 102, course_id: 1 },
        ],
      });

      // Mock getById for user data
      mockClient.getById.mockImplementation((endpoint, userId) => {
        return Promise.resolve({
          id: userId,
          name: `Student ${userId}`,
          email: `student${userId}@example.com`,
          role: "student",
          courses: [
            {
              course_id: 1,
              course_name: "Course 1",
              enrolled_at: new Date().toISOString(),
              is_active_enrollment: true,
              percent_complete: 50,
            },
          ],
        });
      });

      // Call the function
      const result = await transformCourseData();

      // Assertions
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe("Course 1");

      // Check that enrollment data was added
      expect(result[0].totalEnrollments).toBeDefined();
      expect(typeof result[0].totalEnrollments).toBe("number");
      expect(result[0].enrollmentsThisMonth).toBeDefined();
    });

    it("should handle errors when fetching courses", async () => {
      // Get the mock client
      const mockClient = getMockClient();

      // Make getAll throw an error
      mockClient.getAll.mockRejectedValue(new Error("API error"));

      // Expect the function to throw the same error
      await expect(transformCourseData()).rejects.toThrow("API error");
    });
  });

  describe("transformStudentData", () => {
    it("should transform student data for a course", async () => {
      // Get the mock client
      const mockClient = getMockClient();

      const courseId = 1;

      const fixedDate = "2023-01-15T12:00:00Z";

      // Mock getPaginated for enrollment data
      mockClient.getPaginated.mockResolvedValue({
        meta: {
          total: 3,
          page: 1,
        },
        enrollments: [
          { id: 1, user_id: 101, course_id: courseId },
          { id: 2, user_id: 102, course_id: courseId },
        ],
      });

      // Mock getById for each user
      mockClient.getById.mockImplementation((endpoint, userId) => {
        return Promise.resolve({
          id: userId,
          name: `Student ${userId}`,
          email: `student${userId}@example.com`,
          role: "student",
          courses: [
            {
              course_id: courseId,
              course_name: "Test Course",
              enrolled_at: fixedDate,
              is_active_enrollment: true,
              percent_complete: 50,
            },
          ],
        });
      });

      // Call the function
      const result = await transformStudentData(courseId);

      // Assert the results
      expect(result).toHaveLength(2);

      // Check the first student
      expect(result[0].id).toBe(101);
      expect(result[0].name).toBe("Student 101");
      expect(result[0].email).toBe("student101@example.com");
      expect(result[0].enrolledAt).toBeDefined();
      expect(result[0].percentComplete).toBe(50);

      // Verify the API was called with correct parameters
      expect(mockClient.getPaginated).toHaveBeenCalledWith(
        "/courses/1/enrollments",
        { page: 1 }
      );
    });

    it("should handle pagination correctly", async () => {
      // Get the mock client
      const mockClient = getMockClient();

      const courseId = 1;
      const page = 2;

      // Mock the API responses
      mockClient.getPaginated.mockResolvedValue({
        meta: { page: 2 },
        enrollments: [{ user_id: 103, course_id: courseId }],
      });

      mockClient.getById.mockResolvedValue({
        id: 103,
        name: "Student 103",
        email: "student103@example.com",
        role: "student",
        courses: [
          {
            course_id: courseId,
            course_name: "Test Course",
            enrolled_at: "2023-02-01T12:00:00Z",
            percent_complete: 30,
          },
        ],
      });

      // Call with specific page
      await transformStudentData(courseId, page);

      // Verify pagination parameter was passed correctly
      expect(mockClient.getPaginated).toHaveBeenCalledWith(
        `/courses/${courseId}/enrollments`,
        { page: 2 }
      );
    });
  });
});
