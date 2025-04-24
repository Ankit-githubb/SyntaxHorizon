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

export async function DELETE(request: NextRequest, { params }: { params: { videoId: string } }) {
  try {
    const videoId = params.videoId
    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: "Public ID is required" }, { status: 400 })
    }

    // Delete from Cloudinary
    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, { resource_type: "video" }, (error, result) => {
        if (error) reject(error)
        else resolve()
      })
    })

    // Delete from database
    await prisma.video.delete({
      where: {
        id: videoId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete video failed", error)
    return NextResponse.json({ error: "Delete video failed" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { videoId: string } }) {
  try {
    const videoId = params.videoId
    const data = await request.json()
    const { title, description } = data

    // Update video in database
    const updatedVideo = await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        title,
        description,
      },
    })

    return NextResponse.json(updatedVideo)
  } catch (error) {
    console.error("Update video failed", error)
    return NextResponse.json({ error: "Update video failed" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: NextRequest, { params }: { params: { videoId: string } }) {
  try {
    const videoId = params.videoId

    // Get video from database
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error("Get video failed", error)
    return NextResponse.json({ error: "Get video failed" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
