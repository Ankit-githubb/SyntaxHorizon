import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Get counts for dashboard (users, courses, payments, etc.)
  const userCount = await prisma.user.count();
  const studentCount = await prisma.student.count(); // Count of students
  const teacherCount = await prisma.teacher.count(); // Count of teachers
  const courseCount = await prisma.course.count(); // Count of courses
  const paymentCount = await prisma.payment.count(); // Count of payments
  const enrollmentCount = await prisma.enrollment.count(); // Count of enrollments

  // Get recent users (both students and teachers)
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="container mx-auto py-10">
      <AdminDashboard
        userCount={userCount}
        studentCount={studentCount}
        teacherCount={teacherCount}
        courseCount={courseCount}
        paymentCount={paymentCount}
        enrollmentCount={enrollmentCount}
        recentUsers={recentUsers}
      />
    </div>
  );
}
