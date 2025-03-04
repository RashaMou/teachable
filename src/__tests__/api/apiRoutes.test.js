/** @jest-environment node */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/courses/route";
import * as teachableService from "../../lib/api/teachableService";

jest.mock("../../lib/api/teachableService", () => ({
  getAllCoursesWithInitialStudents: jest.fn(),
}));

describe("Courses API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns courses with 200 status when successful", async () => {
    const mockCourses = [
      { id: 1, name: "Course 1", students: [] },
      { id: 2, name: "Course 2", students: [] },
    ];

    teachableService.getAllCoursesWithInitialStudents.mockResolvedValueOnce(
      mockCourses
    );

    const request = new NextRequest("http://localhost:3000/api/courses");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.courses).toEqual(mockCourses);
    expect(response.headers.get("Cache-Control")).toContain("max-age=300");
  });

  it("returns 500 status when an error occurs", async () => {
    teachableService.getAllCoursesWithInitialStudents.mockRejectedValueOnce(
      new Error("Service error")
    );

    const request = new NextRequest("http://localhost:3000/api/courses");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toContain("Failed to fetch courses");
  });
});
