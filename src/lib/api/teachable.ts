const apiKey = process.env.TEACHABLE_API_KEY;
const baseUrl = process.env.TEACHABLE_API_URL;
import { Course, Student } from "../types";

async function fetchFromTeachable(
  endpoint: string,
  page?: number = 1,
  perPage?: number = 20
) {
  try {
    let url = `${baseUrl}${endpoint}`;

    if (page && perPage) {
      url += `?page=${page}&per=${perPage}`;
    }

    const response = await fetch(url, {
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

async function _getUserById(userId: number) {
  return fetchFromTeachable(`/users/${userId}`);
}

export async function _getCourses(page: number = 1, perPage: number = 20) {
  return fetchFromTeachable("/courses", page, perPage);
}

async function _getEnrollments(
  courseId: number,
  page: number = 1,
  perPage: number = 20
) {
  return fetchFromTeachable(`/courses/${courseId}/enrollments`, page, perPage);
}

async function _getEnrollmentData(
  courseId: number
): Promise<{ totalEnrollments: number; currentMonthEnrollments: number }> {
  const enrollments = await _getEnrollments(courseId);
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

async function _getFullCoursesData(
  page: number = 1,
  perPage: number = 20
): Promise<Course[]> {
  // does not have meta
  const coursesData = await _getCourses(page, perPage);
  const activeCourses = coursesData.courses.filter(
    (course: Course) => course.is_published
  );

  const coursesWithEnrollments = await Promise.all(
    activeCourses.map(async (course: Course) => {
      const { totalEnrollments, currentMonthEnrollments } =
        await _getEnrollmentData(Number(course.id));

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
  courseId: number,
  page: number = 1,
  perPage: number = 20
): Promise<{ students: Student[]; meta: any }> {
  const enrollmentsData = await _getEnrollments(
    Number(courseId),
    page,
    perPage
  );
  const meta = enrollmentsData.meta;

  const userIds = enrollmentsData.enrollments.map(
    (enrollment) => enrollment.user_id
  );

  const students = await Promise.all(
    userIds.map(async (userId: number) => {
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

  return { students, meta };
}

export async function getCoursesWithStudents(
  page: number = 1,
  perPage: number = 20
): Promise<{ course: Course[]; meta: any }> {
  const coursesData = await _getFullCoursesData(page, perPage);
  const courses = coursesData.courses;
  const meta = coursesData.meta;

  // For each course, fetch and add its students
  const coursesWithStudents = await Promise.all(
    courses.map(async (course: Course) => {
      const students = await getStudentsByCourse(
        parseInt(course.id),
        1,
        perPage
      );

      return {
        ...course,
        students: students,
      };
    })
  );

  return { courses: coursesWithStudents, meta };
}
