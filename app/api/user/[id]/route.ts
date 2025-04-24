import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Wait for params
    const { id } = params; // Ensure this is correctly awaited before using it

    // Get the user data from the request body
    const body = await request.json();
    const { email, password, name, role, avatar, avatarPublicId, introVideoUrl, videoPublicId } = body;

    // Check if all required fields are provided
    if (!email || !name || !role) {
      return NextResponse.json({ error: "Email, name, and role are required" }, { status: 400 });
    }

    // Find the user by ID
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        password, // Make sure to handle password hashing if you are updating it
        name,
        role,
        avatar,
        avatarPublicId,
        introVideoUrl,
        videoPublicId,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
