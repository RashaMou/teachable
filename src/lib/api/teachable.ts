const apiKey = process.env.TEACHABLE_API_KEY;
const baseUrl = process.env.TEACHABLE_API_URL;
import { Course, Student } from "../types";

async function fetchFromTeachable(endpoint: string) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        accept: "application/json",
        apiKey: `${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error; // Rethrow so calling functions can handle it if needed
  }
}

async function _getUsers() {
  return fetchFromTeachable("/users");
}

async function _getUserById(userId: number) {
  return fetchFromTeachable(`/users/${userId}`);
}

export async function _getCourses() {
  return fetchFromTeachable("/courses");
}

async function _getEnrollments(courseId: number) {
  return fetchFromTeachable(`/courses/${courseId}/enrollments`);
}

async function _getEnrollmentData(
  courseId: number
): Promise<{ totalEnrollments: number; currentMonthEnrollments: number }> {
  const enrollments = await fetchFromTeachable(
    `/courses/${courseId}/enrollments`
  );
  const totalEnrollments = enrollments.meta.total;

  const now = new Date();

  const currentMonthEnrollments = enrollments.enrollments.filter(
    (enrollment) => {
      const enrollmentDate = new Date(enrollment.enrolled_at);
      return (
        enrollmentDate.getFullYear() === now.getUTCFullYear() &&
        enrollmentDate.getUTCMonth() === now.getUTCMonth()
      );
    }
  );

  const currentMonthCount = currentMonthEnrollments.length;
  return { totalEnrollments, currentMonthEnrollments: currentMonthCount };
}

export async function getFullCoursesData(): Promise<Course[]> {
  const courses = await fetchFromTeachable("/courses");
  const activeCourses = courses.courses.filter(
    (course: Course) => course.is_published
  );

  const coursesWithEnrollments = await Promise.all(
    activeCourses.map(async (course: Course) => {
      const { totalEnrollments, currentMonthEnrollments } =
        await _getEnrollmentData(course.id);

      return {
        id: String(course.id),
        name: course.name,
        heading: course.heading,
        image_url: course.image_url,
        totalEnrollments: totalEnrollments,
        newEnrollmentsThisMonth: currentMonthEnrollments,
      };
    })
  );

  return coursesWithEnrollments;
}

export async function getStudentsByCourse(
  courseId: number
): Promise<Student[]> {
  const enrollments = await _getEnrollments(courseId);
  const userIds = enrollments.enrollments.map(
    (enrollment) => enrollment.user_id
  );

  const students = await Promise.all(
    userIds.map(async (userId) => {
      const user = await _getUserById(userId);
      const courseInfo = user.courses.find(
        (course) => course.course_id === courseId
      );

      return {
        id: String(user.id),
        name: user.name,
        email: user.email,
        enrolledAt: courseInfo.enrolled_at,
        isActive: courseInfo.is_active_enrollment,
        percentComplete: courseInfo.percent_complete,
      };
    })
  );

  return students;
}
