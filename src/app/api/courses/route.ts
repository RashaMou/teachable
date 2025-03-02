import { NextResponse } from "next/server";
import { getAllCoursesWithInitialStudents } from "@/lib/api/teachableService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "20");

    const courses = await getAllCoursesWithInitialStudents();

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
