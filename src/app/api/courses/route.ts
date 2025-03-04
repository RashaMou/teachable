import { NextResponse } from "next/server";
import { getAllCoursesWithStudents } from "@/lib/api/teachableService";

export async function GET(request: Request) {
  try {
    const courses = await getAllCoursesWithStudents();
    console.log("HELLO");
    console.log(courses);

    return NextResponse.json(
      { courses },
      {
        headers: {
          "Cache-Control": "max-age=300, s-maxage=300",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch courses: ${error}` },
      { status: 500 }
    );
  }
}
