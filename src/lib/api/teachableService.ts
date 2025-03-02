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
