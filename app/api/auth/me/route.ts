import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession, sanitizeUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: sanitizeUser(user) }, { status: 200 })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

