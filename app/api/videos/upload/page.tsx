import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface CloudinaryUploadResult {
  public_id: string
  bytes: number
  duration?: number
  [key: string]: any
}

export async function POST(request: NextRequest) {
  try {
    // Check Cloudinary credentials
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json({ error: "Cloudinary credentials not found" }, { status: 500 })
    }

    // Extract user ID from the request (assuming it's in the headers or a cookie)
    const userId = request.headers.get("Authorization") // For example, using JWT token
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const originalSize = formData.get("originalSize") as string
    const courseId = formData.get("courseId") as string

    // Check if file exists and is a video
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 })
    }

    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "Only video files are allowed" }, { status: 400 })
    }

    // Check if title or description is missing
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    // Check if courseId is provided
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    // Read file into buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "course-videos",
          transformation: [{ quality: "auto", fetch_format: "mp4" }],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as CloudinaryUploadResult)
        },
      )
      uploadStream.end(buffer)
    })

    // Save video information to the database
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: result.public_id,
        originalSize,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
        user: {
          connect: {
            id: userId,
          },
        },
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    })

    return NextResponse.json(video)
  } catch (error) {
    console.log("Upload video failed", error)
    return NextResponse.json({ error: "Upload video failed" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
