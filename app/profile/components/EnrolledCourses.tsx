"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Award, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Course {
  id: string
  title: string
  description: string
  imageUrl: string
  progress: number
  totalLessons: number
  completedLessons: number
  category: string
  lastAccessedAt: string
  status: "in-progress" | "completed" | "not-started"
}

interface EnrolledCoursesProps {
  userId: string
}

export function EnrolledCourses({ userId }: EnrolledCoursesProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEnrolledCourses() {
      try {
        setLoading(true)
        const response = await fetch(`/api/courses/enrolled?userId=${userId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch enrolled courses")
        }

        const data = await response.json()
        setCourses(data)
      } catch (err) {
        console.error("Error fetching enrolled courses:", err)
        setError(err instanceof Error ? err.message : "Failed to load courses")
        toast({
          title: "Error",
          description: "Failed to load your enrolled courses. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEnrolledCourses()
  }, [userId])

  if (loading) {
    return <CoursesLoadingSkeleton />
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800 mb-4">Unable to load your courses</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/30 p-10 text-center">
        <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No courses enrolled yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you.
        </p>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

function CourseCard({ course }: { course: Course }) {
  const statusColors = {
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    "not-started": "bg-gray-100 text-gray-800",
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={course.imageUrl || "/placeholder.svg?height=192&width=384"}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Badge className={`absolute top-3 right-3 ${statusColors[course.status]}`} variant="outline">
          {course.status === "in-progress"
            ? "In Progress"
            : course.status === "completed"
              ? "Completed"
              : "Not Started"}
        </Badge>
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg line-clamp-1 mb-2">{course.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{course.description}</p>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center">
              <BookOpen className="mr-1.5 h-4 w-4" />
              Lessons
            </span>
            <span className="font-medium">
              {course.completedLessons}/{course.totalLessons}
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${course.progress}%` }}
              aria-label={`${course.progress}% complete`}
            ></div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center">
              <Clock className="mr-1.5 h-4 w-4" />
              Last accessed
            </span>
            <span className="font-medium">{formatDate(course.lastAccessedAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/courses/${course.id}`}>
            <ExternalLink className="mr-1.5 h-4 w-4" />
            View Course
          </Link>
        </Button>
        {course.status === "completed" && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/certificates/${course.id}`}>
              <Award className="mr-1.5 h-4 w-4" />
              Certificate
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function CoursesLoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-5">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-10" />
              </div>

              <Skeleton className="h-2.5 w-full rounded-full" />

              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-5 pt-0">
            <Skeleton className="h-9 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
