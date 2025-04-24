"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ExternalLink, Edit, Eye } from "lucide-react"
import { AddCourseForm } from "./AddCourseForm"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

type Course = {
  id: string
  title: string
  description: string
  price: number
  type: string
  imageUrl?: string
  categoryId?: string
}

type Category = {
  id: string
  name: string
}

interface CourseManagementProps {
  teacherId: string
}

export function CourseManagement({ teacherId }: CourseManagementProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddingCourse, setIsAddingCourse] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    Promise.all([fetchCourses(), fetchCategories()]).finally(() => setIsLoading(false))
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/coursess")
      console.log(response)
      const data = await response.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      })
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category/add")
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleCourseAdded = (newCourse: Course) => {
    setCourses([...courses, newCourse])
    setIsAddingCourse(false)
    toast({
      title: "Success",
      description: "Course added successfully",
    })
  }

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Uncategorized"
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
        <Button onClick={() => setIsAddingCourse(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      {isAddingCourse && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
            <CardDescription>Create a new course with details and media</CardDescription>
          </CardHeader>
          <CardContent>
            <AddCourseForm
              teacherId={teacherId}
              categories={categories}
              onSuccess={handleCourseAdded}
              onCancel={() => setIsAddingCourse(false)}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses found. Create your first course to get started.</p>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video relative">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl || "/placeholder.svg?height=180&width=320"}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">No image</div>
                )}
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <Badge variant={course.type === "FREE" ? "secondary" : "default"}>
                    {course.type === "FREE" ? "Free" : `$${course.price}`}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-md">{getCategoryName(course.categoryId)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
              </CardContent>
              <CardFooter className="mt-auto pt-2 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/dashboard/courses/${course.id}`}>
                    <Eye className="mr-1.5 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/courses/${course.id}/edit`}>
                    <Edit className="mr-1.5 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button variant="default" size="sm" className="flex-1" asChild>
                  <Link href={`/courses/${course.id}/manage`}>
                    <ExternalLink className="mr-1.5 h-4 w-4" />
                    Manage
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
