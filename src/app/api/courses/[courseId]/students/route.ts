import { NextResponse } from "next/server";
import { getStudentsByCourse } from "@/lib/api/teachable";

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = parseInt(params.courseId);
    const students = await getStudentsByCourse(courseId);
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch students: ${error}` },
      { status: 500 }
    );
  }
}
