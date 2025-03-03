import { transformCourseData, transformStudentData } from "../DataAdapters";
import { Student, Course } from "../types";

export async function getAllCoursesWithInitialStudents(): Promise<
  Array<Course & { students: Student[] }>
> {
  const courses = await transformCourseData();

  const coursesWithStudentsPromises = courses.map(async (course) => {
    const firstPageStudents = await transformStudentData(course.id);
    return { ...course, students: firstPageStudents };
  });

  return Promise.all(coursesWithStudentsPromises);
}

export async function getPaginatedStudents(
  courseId: number,
  page: number
): Promise<Student[]> {
  const students = await transformStudentData(courseId, page);

  return students;
}
