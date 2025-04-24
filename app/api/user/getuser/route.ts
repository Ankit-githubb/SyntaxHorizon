import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    // Optional: Check if session exists or if the user is an admin
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all users from the database
    const users = await prisma.user.findMany();

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    // Return the list of users
    return NextResponse.json({ users }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
