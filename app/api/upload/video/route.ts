import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { uploadOnCloudinary } from "@/lib/cloudinary"

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Process the form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "File must be a video" }, { status: 400 })
    }

    // Validate file size (100MB max)
    const MAX_SIZE = 100 * 1024 * 1024 // 100MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 100MB limit" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a temporary file path
    const tempFilePath = join("/tmp", `${Date.now()}-${file.name}`)

    // Write the file to disk
    await writeFile(tempFilePath, buffer)

    // Upload to Cloudinary with resource_type: video
    const result = await uploadOnCloudinary(tempFilePath)

    if (!result) {
      return NextResponse.json({ error: "Failed to upload video" }, { status: 500 })
    }

    // Return the Cloudinary URL and public ID
    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

