"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryManagement } from "./CategoryManagement"
import { CourseManagement } from "./CourseManagement"
import { DashboardStats } from "./DashboardStats"

type User = {
  id: string
  name: string | null
  email: string | null
  role: string
}

export function TeacherDashboard({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">Manage your courses and categories from your teacher dashboard.</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardStats />
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <CourseManagement teacherId={user.id} />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

