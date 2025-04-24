import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import os from "os"
import { uploadOnCloudinary } from "@/lib/cloudinary"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Create a temporary file path
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Use the system's temp directory
    const tempDir = os.tmpdir()
    const sanitizedFileName = file.name.replace(/\s+/g, "-").replace(/[\/:*?"<>|]/g, "_") // Sanitize the file name
    const tempFilePath = join(tempDir, sanitizedFileName)

    // Write the file to the temporary location
    await writeFile(tempFilePath, buffer)

    // Upload to Cloudinary
    const result = await uploadOnCloudinary(tempFilePath)

    if (!result) {
      return NextResponse.json({ error: "Failed to upload to Cloudinary" }, { status: 500 })
    }

    return NextResponse.json(
      {
        url: result.url,
        publicId: result.publicId,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in upload route:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
