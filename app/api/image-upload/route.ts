import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  [key: string]: any
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "next-cloudinary-uploads",
          public_id: `${user.id}-${Date.now()}`, // Use user id and timestamp for unique file names
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as CloudinaryUploadResult)
        },
      )
      uploadStream.end(buffer)
    })

    // Save the uploaded avatar URL and public ID to the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatar: result.secure_url, // Store the avatar URL
        avatarPublicId: result.public_id, // Store the Cloudinary public ID
      },
    })

    return NextResponse.json(
      {
        message: "Upload successful",
        publicId: result.public_id,
        url: result.secure_url,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 })
  }
}

