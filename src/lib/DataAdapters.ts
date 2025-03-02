import { TeachableClient } from "./api/client/teachableClient";
import { Course, Enrollment, Student } from "./types";

const client = TeachableClient.fromEnv();

async function getEnrollmentData(
  courseId: number
): Promise<{ totalEnrollments: number; enrollmentsThisMonth: number }> {
  const enrollments = await client.getAll<Enrollment>(
    `/courses/${courseId}/enrollments`,
    "enrollments"
  );
  const totalEnrollments = enrollments.length;

  const enrollmentsThisMonth = getEnrollmentsThisMonth(enrollments);

  return { totalEnrollments, enrollmentsThisMonth };
}

function getEnrollmentsThisMonth(enrollments: Enrollment[]): number {
  const now = new Date();

  const enrollmentsThisMonth = enrollments.filter((enrollment) => {
    const enrollmentDate = new Date(enrollment.enrolled_at);
    return (
      enrollmentDate.getFullYear() === now.getUTCFullYear() &&
      enrollmentDate.getUTCMonth() === now.getUTCMonth()
    );
  });

  return enrollmentsThisMonth.length;
}

export async function transformCourseData(): Promise<Course[]> {
  const allCourses = await client.getAll<Course>("/courses", "courses");

  const activeCourses = allCourses.filter((course) => course.is_published);

  const courseDataPromises = activeCourses.map(async (course) => {
    const enrollmentData = await getEnrollmentData(course.id);
    return { ...course, ...enrollmentData };
  });

  return Promise.all(courseDataPromises);
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

  const userIds = enrollments.map(
    (enrollment: Enrollment) => enrollment.user_id
  );

  const userPromises = userIds.map(async (userId: number) => {
    const user = await client.getById<Student>(`/users`, userId);
    return user;
  });

  const allUsers = await Promise.all(userPromises);

  const studentUsers = allUsers.filter((user) => user.role === "student");

  const students: Student[] = studentUsers.map((user) => {
    const courseInfo = user.courses.find(
      (course: any) => course.course_id === courseId
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      enrolledAt: courseInfo?.enrolled_at ?? "",
      isActive: courseInfo?.is_active_enrollment ?? false,
      percentComplete: courseInfo?.percent_complete ?? 0,
      role: "student",
    };
  });

  return students;
}
