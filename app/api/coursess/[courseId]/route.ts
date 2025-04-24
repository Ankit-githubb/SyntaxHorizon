import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: { courseId: string } }
) {
  try {
    const { courseId } = context.params;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        teacher: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course }, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
