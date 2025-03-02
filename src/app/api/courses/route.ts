import { NextResponse } from "next/server";
import { getCoursesWithStudents } from "@/lib/api/teachable";

export async function GET() {
  try {
    const courses = await getCoursesWithStudents();

    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch courses: ${error}` },
      { status: 500 }
    );
  }
}
