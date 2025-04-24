import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/utils"
import { sanitizeUser, signJwtToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "STUDENT", // Default role
      },
    })

    // Generate JWT token
    const token = await signJwtToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Set cookie
    const response = NextResponse.json({ user: sanitizeUser(user) }, { status: 201 })

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

