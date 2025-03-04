/** @jest-environment node */

import * as DataAdapters from "../../lib/DataAdapters";

jest.mock("../../lib/DataAdapters", () => ({
  transformCourseData: jest.fn(),
  transformStudentData: jest.fn(),
}));

import {
  getAllCoursesWithInitialStudents,
  getPaginatedStudents,
} from "../../lib/api/teachableService";

describe("teachableService", () => {
  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
  });

  describe("getAllCoursesWithInitialStudents", () => {
    it("should return courses with their initial students", async () => {
      // Mock course data
      const mockCourses = [
        { id: 1, title: "Course 1" },
        { id: 2, title: "Course 2" },
      ];

      // Mock student data
      const mockStudents1 = [{ id: 101, name: "Student 1" }];
      const mockStudents2 = [{ id: 102, name: "Student 2" }];

      // Set up mock implementations
      DataAdapters.transformCourseData.mockResolvedValue(mockCourses);
      DataAdapters.transformStudentData.mockImplementation((courseId) => {
        return Promise.resolve(courseId === 1 ? mockStudents1 : mockStudents2);
      });

      // Call the service function
      const result = await getAllCoursesWithInitialStudents();

      // Verify the function correctly combines data
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].students).toEqual(mockStudents1);
      expect(result[1].id).toBe(2);
      expect(result[1].students).toEqual(mockStudents2);

      // Verify correct function calls
      expect(DataAdapters.transformCourseData).toHaveBeenCalledTimes(1);
      expect(DataAdapters.transformStudentData).toHaveBeenCalledTimes(2);
      expect(DataAdapters.transformStudentData).toHaveBeenCalledWith(1);
      expect(DataAdapters.transformStudentData).toHaveBeenCalledWith(2);
    });
  });

  describe("getPaginatedStudents", () => {
    it("should return paginated students for a course", async () => {
      const courseId = 1;
      const page = 2;
      const mockStudents = [
        { id: 103, name: "Student 3" },
        { id: 104, name: "Student 4" },
      ];

      // Set up mock
      DataAdapters.transformStudentData.mockResolvedValue(mockStudents);

      // Call the service function
      const result = await getPaginatedStudents(courseId, page);

      // Verify the result
      expect(result).toEqual(mockStudents);

      // Verify correct function calls
      expect(DataAdapters.transformStudentData).toHaveBeenCalledTimes(1);
      expect(DataAdapters.transformStudentData).toHaveBeenCalledWith(
        courseId,
        page
      );
    });
  });
});
