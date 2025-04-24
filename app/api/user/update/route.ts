import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { uploadOnCloudinary } from "@/lib/cloudinary"
import { writeFile, mkdir } from "fs/promises"
import os from "os"
import path from "path"

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    // Check if the session is valid (i.e., user is logged in)
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()

    // Extract fields from form data
    const name = formData.get("name") as string
    const avatarFile = formData.get("avatar") as File | null

    const updateData: any = { name }

    // If an avatar is provided, upload it to Cloudinary
    if (avatarFile) {
      const bytes = await avatarFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Use the system's temp directory
      const tempDir = os.tmpdir()
      const sanitizedFileName = avatarFile.name.replace(/[\/:*?"<>|]/g, "_") // Sanitize the file name
      const tempFilePath = path.join(tempDir, sanitizedFileName)

      // Ensure the temporary directory exists
      await mkdir(tempDir, { recursive: true })

      // Write the file temporarily
      await writeFile(tempFilePath, buffer)

      // Upload the avatar to Cloudinary
      const cloudinaryUrl = await uploadOnCloudinary(tempFilePath)

      // If the upload is successful, add the avatar info to updateData
      if (cloudinaryUrl) {
        const urlParts = cloudinaryUrl.url.split("/")
        const publicId = urlParts[urlParts.length - 1].split(".")[0]

        updateData.avatar = cloudinaryUrl.url // Set the URL directly to the avatar field
        updateData.avatarPublicId = publicId
      }
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: session.id as string },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true, // Include avatar in the returned user data
      },
    })

    // Return the updated user data as the response
    return NextResponse.json({ user: updatedUser }, { status: 200 })
  } catch (error) {
    // Log the error based on its type
    if (error instanceof Error) {
      console.error("Update user error:", error.message)
    } else {
      console.error("Update user error:", error)
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
