import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Users, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CourseVideos } from "../components/CourseVideos"

// Define the metadata for the page
export async function generateMetadata({ params }: { params: { courseId: string } }): Promise<Metadata> {
  const course = await getCourse(params.courseId)

  if (!course) {
    return {
      title: "Course Not Found",
    }
  }

  return {
    title: course.title,
    description: course.description,
  }
}

// Fetch course data
async function getCourse(courseId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/coursess/${courseId}`, {
      cache: "no-store", // Don't cache this data
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.course
  } catch (error) {
    console.error("Error fetching course:", error)
    return null
  }
}

// Fetch category data
async function getCategory(categoryId: string | undefined) {
  if (!categoryId) return { name: "Uncategorized" }

  try {
    const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return { name: "Uncategorized" }
    }

    const data = await response.json()
    return data.category
  } catch (error) {
    console.error("Error fetching category:", error)
    return { name: "Uncategorized" }
  }
}

// Fetch course videos
async function getCourseVideos(courseId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}/videos`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.videos || []
  } catch (error) {
    console.error("Error fetching course videos:", error)
    return []
  }
}

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const course = await getCourse(params.courseId)

  if (!course) {
    notFound()
  }

  const category = await getCategory(course.categoryId)
  const videos = await getCourseVideos(params.courseId)

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
              {course.imageUrl ? (
                <Image
                  src={course.imageUrl || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">No image available</div>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={course.type === "FREE" ? "secondary" : "default"}>
                {course.type === "FREE" ? "Free" : `$${course.price}`}
              </Badge>
              <Badge variant="outline">{category.name}</Badge>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Created: {new Date(course.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              {course.totalLessons && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{course.totalLessons} lessons</span>
                </div>
              )}
              {course.enrolledStudents && (
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{course.enrolledStudents} students enrolled</span>
                </div>
              )}
              <div className="flex items-center">
                <Video className="mr-2 h-4 w-4" />
                <span>{videos.length} videos</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="text-xl font-semibold mb-4">Course Description</h2>
              <div className="prose max-w-none">
                <p>{course.description}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <CourseVideos courseId={params.courseId} initialVideos={videos} />
          </div>

          <div className="md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Course Actions</CardTitle>
                <CardDescription>Manage your course content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href={`/courses/${course.id}/manage`}>Manage Course</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/courses/${course.id}/edit`}>Edit Course Details</Link>
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={`/courses/${course.id}/lessons`}>Manage Lessons</Link>
                </Button>
                <Button variant="default" className="w-full flex items-center justify-center">
                  <Video className="mr-2 h-4 w-4" />
                  <span>Add Videos</span>
                </Button>
              </CardContent>
            </Card>

            {course.chapters && course.chapters.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>{course.chapters.length} chapters</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.chapters.map((chapter: any) => (
                      <li key={chapter.id} className="border-b pb-2 last:border-0">
                        <Link href={`/courses/${course.id}/chapters/${chapter.id}`} className="hover:underline">
                          {chapter.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
