import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
      select: { id: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If user is a teacher, get their courses
    if (user.role === "TEACHER") {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: user.id },
      })

      if (!teacher) {
        return NextResponse.json({ courses: [] })
      }

      const courses = await prisma.course.findMany({
        where: { teacherId: teacher.id },
        orderBy: { createdAt: "desc" },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      return NextResponse.json({ courses })
    }

    // For non-teachers, return an empty array or handle differently
    return NextResponse.json({ courses: [] })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
      select: { id: true, role: true },
    })

    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, price, type, teacherId, categoryId, imageUrl, videoUrl, imagePublicId, videoPublicId } =
      body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Course title is required" }, { status: 400 })
    }

    if (!description || !description.trim()) {
      return NextResponse.json({ error: "Course description is required" }, { status: 400 })
    }

    // Ensure the teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 400 })
    }

    // Validate the teacher is the current user
    if (teacher.userId !== user.id) {
      return NextResponse.json({ error: "You can only create courses for yourself" }, { status: 403 })
    }

    // Optionally, validate the price if needed
    if (price < 0) {
      return NextResponse.json({ error: "Price cannot be negative" }, { status: 400 })
    }

    // Create the new course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        type,
        imageUrl,
        videoUrl,
        imagePublicId,
        videoPublicId,
        teacherId,
        categoryId,
      },
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
      select: { id: true, role: true },
    })

    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { courseId } = body

    // Ensure the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Validate the teacher is the current user
    if (course.teacherId !== user.id) {
      return NextResponse.json({ error: "You can only delete your own courses" }, { status: 403 })
    }

    // Delete the course
    await prisma.course.delete({
      where: { id: courseId },
    })

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}