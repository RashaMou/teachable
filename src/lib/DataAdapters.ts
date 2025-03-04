import { TeachableClient } from "./api/client/teachableClient";
import { SimpleCache } from "./SimpleCache";

import { Course, Student, TeachableUserResponse } from "./types";

interface SimplifiedCourse {
  course_id: number;
  course_name: string;
  enrolled_at: string;
  percent_complete: number;
}

interface StudentMapEntry extends Student {
  courses: SimplifiedCourse[];
}

interface StudentMap {
  [userId: number]: StudentMapEntry;
}

const client = TeachableClient.fromEnv();
const studentCache = new SimpleCache<string, StudentMap>();

async function getEnrollmentData(
  courseId: number
): Promise<{ totalEnrollments: number; enrollmentsThisMonth: number }> {
  let students = studentCache.get("students");
  if (!students) {
    await fetchAndCacheStudents();
    students = studentCache.get("students");
  }
  if (!students) {
    throw new Error("Student data not available");
  }

  // get total enrollments for the course
  const totalEnrollments = Object.values(students).filter((student) =>
    student.courses.some(
      (course: SimplifiedCourse) => course.course_id === courseId
    )
  ).length;

  // get number of new enrollments this months
  const now = new Date();

  const enrollmentsThisMonth = Object.values(students).filter((student) => {
    const course = student.courses.find(
      (c: SimplifiedCourse) => c.course_id === courseId
    );
    if (!course) return false;
    const enrolledAt = new Date(course.enrolled_at);
    return (
      enrolledAt.getUTCFullYear() === now.getUTCFullYear() &&
      enrolledAt.getUTCMonth() === now.getUTCMonth()
    );
  }).length;

  return { totalEnrollments, enrollmentsThisMonth };
}

export async function transformCourseData(): Promise<Course[]> {
  try {
    const activeCourses = await client.getAll<Course>("/courses", "courses", {
      is_published: "true",
    });

    const courseDataPromises = activeCourses.map(async (course) => {
      try {
        const enrollmentData = await getEnrollmentData(course.id);
        return { ...course, ...enrollmentData };
      } catch (error) {
        console.error(
          `Error fetching enrollment data for course ${course.id}:`,
          error
        );
        return {
          ...course,
          totalEnrollments: 0,
          enrollmentsThisMonth: 0,
        };
      }
    });

    return Promise.all(courseDataPromises);
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

// TODO: Replace client-side pagination with server-side pagination. Ideally,
// the API/BFF should accept page and pageSize parameters and return just the
// requested subset, along with metadata (total count, total pages, etc.), to
// improve scalability.

export async function fetchAndCacheStudents(): Promise<StudentMap> {
  const usersResponse = await client.getAll("/users", "users");
  const studentMap = await createStudentMap(usersResponse);
  studentCache.set("students", studentMap);
  return studentMap;
}

async function createStudentMap(
  users: TeachableUserResponse[]
): Promise<StudentMap> {
  const fullUsersDetailsPromises = users.map((user) =>
    client.getById<TeachableUserResponse>("/users/", user.id)
  );
  const fullUsersDetails = await Promise.all(fullUsersDetailsPromises);

  const students = fullUsersDetails.filter((user) => user.role === "student");

  // Build a map: student id as key and user details as value.
  const studentMap = Object.fromEntries(
    students.map((student) => {
      const activeCourses = student.courses
        .filter(
          (course: TeachableUserResponse["courses"][number]) =>
            course.is_active_enrollment
        )
        .map((course: TeachableUserResponse["courses"][number]) => ({
          course_id: course.course_id,
          course_name: course.course_name,
          enrolled_at: course.enrolled_at,
          percent_complete: course.percent_complete,
        }));

      return [
        student.id,
        {
          name: student.name,
          email: student.email,
          courses: activeCourses,
        },
      ];
    })
  );

  return studentMap;
}
