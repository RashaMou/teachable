import { fetchAndCacheStudents, transformCourseData } from "../DataAdapters";
import { Course, Student } from "../types";

export async function getAllCoursesWithStudents(): Promise<Course[]> {
  const studentMap = await fetchAndCacheStudents();
  const courses = await transformCourseData();

  const enrichedCourses: Course[] = courses.map((course) => {
    const students: Student[] = Object.entries(studentMap)
      .map(([id, studentData]) => {
        const enrollment = studentData.courses.find(
          (c) => c.course_id === course.id
        );
        if (!enrollment) return null; // not enrolled in this course
        return {
          id: Number(id),
          name: studentData.name,
          email: studentData.email,
          enrolledAt: enrollment.enrolled_at,
          percentComplete: enrollment.percent_complete,
        };
      })
      .filter((student): student is Student => student !== null); // filter out non-enrolled

    return {
      ...course,
      students,
    };
  });

  return enrichedCourses;
}
