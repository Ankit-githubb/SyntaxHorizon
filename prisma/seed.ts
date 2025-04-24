import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/utils";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create a teacher user
  const teacherPassword = await hashPassword("teacher123");
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {},
    create: {
      email: "teacher@example.com",
      name: "Teacher User",
      password: teacherPassword,
      role: "TEACHER",
      teacher: {
        create: {},
      },
    },
  });

  // Create a student user
  const studentPassword = await hashPassword("student123");
  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      name: "Student User",
      password: studentPassword,
      role: "STUDENT",
      student: {
        create: {},
      },
      address: {
        create: [
          {
            type: "HOME",
            name: "Student User",
            email: "student@example.com",
            address: "123 Student Street",
            city: "Studyville",
            state: "ST",
            zip: "56789",
            phone: "555-222-3333",
          },
        ],
      },
    },
  });

  // Create a sample course
  const course = await prisma.course.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      title: "Introduction to Prisma",
      description: "Learn how to use Prisma ORM in your projects.",
      price: 99.99,
      type: "PAID",
      teacherId: teacher.id,
    },
  });

  // Enroll the student in the course
  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course.id } },
    update: {},
    create: {
      studentId: student.id,
      courseId: course.id,
    },
  });

  console.log({ admin, teacher, student, course });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
