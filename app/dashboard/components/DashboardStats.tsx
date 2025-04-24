"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, LayoutGrid, Users } from "lucide-react"

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalCategories: 0,
    totalStudents: 0,
  })

  useEffect(() => {
    // In a real app, you would fetch these stats from your API
    // For now, we'll use placeholder data
    setStats({
      totalCourses: 5,
      totalCategories: 3,
      totalStudents: 42,
    })
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCourses}</div>
          <p className="text-xs text-muted-foreground">Courses you have created</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories Used</CardTitle>
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCategories}</div>
          <p className="text-xs text-muted-foreground">Categories your courses belong to</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudents}</div>
          <p className="text-xs text-muted-foreground">Students enrolled in your courses</p>
        </CardContent>
      </Card>
    </div>
  )
}

