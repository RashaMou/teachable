import { TeachableClient } from "./api/client/teachableClient";
import { Course, Enrollment, Student } from "./types";

interface TeachableUserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  last_sign_in_ip: string | null;
  courses: Array<{
    course_id: number;
    course_name: string;
    enrolled_at: string;
    is_active_enrollment: boolean;
    completed_at: string | null;
    percent_complete: number;
  }>;
}

const client = TeachableClient.fromEnv();
const userRequestCache = new Map<number, Promise<any>>();

function getStudentsEnrolledInCourse(
  users: TeachableUserResponse[],
  courseId: number
): TeachableUserResponse[] {
  return users.filter((user) =>
    user.courses.some((course) => course.course_id === courseId)
  );
}

async function getEnrollmentData(
  courseId: number
): Promise<{ totalEnrollments: number; enrollmentsThisMonth: number }> {
  const enrollmentsResponse = await client.getPaginated<Enrollment>(
    `/courses/${courseId}/enrollments`,
    { page: 1, per_page: 20 }
  );

  const totalEnrollments = enrollmentsResponse.meta.total;

  const enrollments = enrollmentsResponse["enrollments"];
  const studentUsers = await fetchStudentUsers(enrollments);
  const courseStudents = getStudentsEnrolledInCourse(studentUsers, courseId);
  const enrollmentsThisMonth = countEnrollmentsThisMonth(courseStudents);

  return { totalEnrollments, enrollmentsThisMonth };
}

async function fetchStudentUsers(
  enrollments: Enrollment[]
): Promise<TeachableUserResponse[]> {
  const userIds = enrollments.map((enrollment) => enrollment.user_id);

  const userPromises = userIds.map((userId) => {
    if (!userRequestCache.has(userId)) {
      userRequestCache.set(userId, client.getById<Student>(`/users`, userId));
    }
    return userRequestCache.get(userId)!;
  });

  const allUsers = await Promise.all(userPromises);
  return allUsers.filter((user) => user.role === "student");
}

function countEnrollmentsThisMonth(students: TeachableUserResponse[]): number {
  const now = new Date();

  const enrollmentsThisMonth = students.filter((student) => {
    const enrollmentDate = new Date(student.enrolled_at);
    return (
      enrollmentDate.getFullYear() === now.getUTCFullYear() &&
      enrollmentDate.getUTCMonth() === now.getUTCMonth()
    );
  });

  return enrollmentsThisMonth.length;
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

export async function transformStudentData(
  courseId: number,
  page: number = 1
): Promise<Student[]> {
  const enrollmentsResponse = await client.getPaginated<Enrollment>(
    `/courses/${courseId}/enrollments`,
    { page }
  );

  const enrollments = enrollmentsResponse["enrollments"];

  const studentUsers: TeachableUserResponse[] =
    await fetchStudentUsers(enrollments);

  const students: Student[] = studentUsers.map((user) => {
    const courseInfo = user.courses.find(
      (course: any) => course.course_id === courseId
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      enrolledAt: courseInfo?.enrolled_at ?? "",
      percentComplete: courseInfo?.percent_complete ?? 0,
    };
  });

  return students;
}
