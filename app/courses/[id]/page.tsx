"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Course } from "@/types/course"
import CourseHeader from "../components/CourseHeader"
import CourseContent from "../components/CourseContent"
import EnrollmentCard from "../components/EnrollmentCard"

export default function CourseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch the specific course by ID
        const response = await fetch("http://localhost:3000/api/coursess")
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        const allCourses = data.courses.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          instructor: course.teacher?.user?.name || "Unknown",
          category: course.category?.name || "Uncategorized",
          level: course.type || "Unknown",
          price: course.price,
          rating: 4.5,
          image: course.imageUrl,
          // Mock additional details
          duration: "10 hours",
          totalLessons: 24,
          enrolledStudents: 1240,
          lastUpdated: "March 2023",
          whatYouWillLearn: [
            "Understand core concepts and principles",
            "Build real-world projects with practical applications",
            "Master advanced techniques and best practices",
            "Develop problem-solving skills through hands-on exercises",
            "Receive a certificate upon course completion",
          ],
          curriculum: [
            {
              section: "Getting Started",
              lessons: [
                { title: "Introduction to the Course", duration: "10:15", type: "video" },
                { title: "Setting Up Your Environment", duration: "15:30", type: "video" },
                { title: "Basic Concepts Quiz", duration: "10:00", type: "quiz" },
              ],
            },
            {
              section: "Core Fundamentals",
              lessons: [
                { title: "Understanding Key Principles", duration: "20:45", type: "video" },
                { title: "Practical Application", duration: "25:10", type: "video" },
                { title: "Hands-on Exercise", duration: "30:00", type: "assignment" },
                { title: "Review and Discussion", duration: "15:20", type: "video" },
              ],
            },
            {
              section: "Advanced Topics",
              lessons: [
                { title: "Advanced Techniques", duration: "22:30", type: "video" },
                { title: "Case Study Analysis", duration: "18:45", type: "video" },
                { title: "Final Project", duration: "45:00", type: "assignment" },
                { title: "Course Conclusion", duration: "10:00", type: "video" },
              ],
            },
          ],
        }))

        const foundCourse = allCourses.find((c: Course) => c.id === courseId)
        if (foundCourse) {
          setCourse(foundCourse)
        } else {
          // Handle course not found
          console.error("Course not found")
        }
      } catch (error) {
        console.error("Error fetching course details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseDetails()
  }, [courseId])

  if (isLoading) {
    return <CourseDetailsSkeleton />
  }

  if (!course) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <p className="mb-8">The course you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/courses")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Course Header */}
      <CourseHeader course={course} router={router} />

      {/* Course Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <CourseContent course={course} />
          </div>

          {/* Enrollment Card */}
          <div>
            <EnrollmentCard course={course} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="container mx-auto py-12 px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-6" />

              <div className="flex gap-4 mb-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="flex items-center mb-6">
                <Skeleton className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>

              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />

              <Skeleton className="h-6 w-16" />
            </div>

            <div>
              <Skeleton className="aspect-video rounded-lg w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>

            <Skeleton className="h-[300px] w-full mb-8 rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>

          <div>
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
