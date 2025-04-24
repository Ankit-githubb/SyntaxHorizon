import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export default async function CoursePage({ params }: CoursePageProps) {
  try {
    // Get the course ID from params and ensure it's available
    const courseId = params.courseId as string;

    if (!courseId) {
      throw new Error('Course ID is required');
    }

    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // If user is a teacher, verify they own the course
    if (user.role === "TEACHER") {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: user.id },
      });

      if (!teacher || course.teacherId !== teacher.id) {
        return NextResponse.json({ error: "You don't have access to this course" }, { status: 403 });
      }
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
