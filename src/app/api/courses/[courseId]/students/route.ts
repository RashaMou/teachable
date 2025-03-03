import { NextResponse } from "next/server";
import { getPaginatedStudents } from "@/lib/api/teachableService";

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");

    const { courseId } = await params;
    const courseIdNum = parseInt(courseId);

    const students = await getPaginatedStudents(courseIdNum, page);
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch students: ${error}` },
      { status: 500 }
    );
  }
}
