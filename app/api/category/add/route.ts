import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
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
      select: { role: true },
    })

    if (!user || user.role !== "TEACHER") {
      console.error(`Unauthorized access attempt by user ID: ${session.id}`)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Ensure the category name is unique
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
    }

    // Generate a slug and ensure it's unique
    const slug = name.toLowerCase().replace(/\s+/g, "-")
    const existingSlug = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingSlug) {
      return NextResponse.json({ error: "Category slug already exists" }, { status: 400 })
    }

    // Create the new category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
