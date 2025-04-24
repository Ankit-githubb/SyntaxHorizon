"use client"

import { ArrowLeft, BookOpen, Clock, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/types/course"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface CourseHeaderProps {
  course: Course
  router: AppRouterInstance
}

export default function CourseHeader({ course, router }: CourseHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
      <div className="container mx-auto py-12 px-4">
        <Button variant="ghost" className="text-white hover:bg-white/10 mb-6" onClick={() => router.push("/courses")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none">{course.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{course.totalLessons} lessons</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{course.enrolledStudents} students</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center mr-3">
                <span className="font-bold text-purple-700">{course.instructor.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium">Instructor</p>
                <p className="text-sm text-white/80">{course.instructor}</p>
              </div>
            </div>

            <p className="text-white/90 mb-6">{course.description}</p>

            <Badge variant={course.level === "FREE" ? "secondary" : "default"} className="mb-4">
              {course.level}
            </Badge>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
              {course.image ? (
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-800 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white/50" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
