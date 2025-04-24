"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function CourseLearnPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [progress, setProgress] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="container mx-auto py-6 px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-2"
            onClick={() => router.push(`/courses/${courseId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course Details
          </Button>

          <h1 className="text-2xl font-bold">Course Content</h1>
          <div className="flex items-center mt-2">
            <Progress value={progress} className="h-2 flex-1 bg-white/20" />
            <span className="ml-2 text-sm">{progress}% complete</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="aspect-video bg-black rounded-lg mb-8 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-white/50" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Welcome to your course! This is where you'll access all your learning materials.</p>
                <p>
                  As you progress through the course, your completion status will be tracked. Click on any lesson to
                  begin learning.
                </p>

                <div className="mt-8">
                  <Button
                    onClick={() => setProgress(Math.min(100, progress + 10))}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  >
                    Mark Next Lesson as Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Course Completion</span>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Completed Lessons</h4>
                    <ul className="space-y-2">
                      {progress >= 10 && (
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Introduction to the Course</span>
                        </li>
                      )}
                      {progress >= 20 && (
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Setting Up Your Environment</span>
                        </li>
                      )}
                      {progress >= 30 && (
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Basic Concepts Quiz</span>
                        </li>
                      )}
                      {progress >= 40 && (
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Understanding Key Principles</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {progress === 100 && (
                    <div className="pt-4 border-t text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-bold">Course Completed!</h4>
                      <p className="text-sm text-muted-foreground mt-1">Congratulations on finishing the course</p>
                      <Button className="mt-4 w-full">Download Certificate</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
