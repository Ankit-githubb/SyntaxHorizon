import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"
import { TeacherDashboard } from "./components/TeacherDashboard"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Check if user is a teacher, if not redirect to unauthorized page
  if (user.role !== "TEACHER" as Role) {
    redirect("/unauthorized")
  }

  return (
    <div className="container mx-auto py-10">
      <TeacherDashboard user={user} />
    </div>
  )
}

