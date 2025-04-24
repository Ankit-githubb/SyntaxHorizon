import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ProfileForm } from "@/components/profile-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PasswordChangeForm } from "./components/PasswordChangeForm"
import { EnrolledCourses } from "./components/EnrolledCourses"
import { UserCircle, Lock, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and view enrolled courses</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b">
            <div className="container py-2">
              <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 h-auto p-1 bg-muted/50">
                <TabsTrigger value="profile" className="flex items-center gap-2 py-2.5">
                  <UserCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center gap-2 py-2.5">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Password</span>
                </TabsTrigger>
                <TabsTrigger value="courses" className="flex items-center gap-2 py-2.5">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Courses</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="container py-6">
            <TabsContent value="profile" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-1">
                  <Card className="border-none shadow-none">
                    <CardHeader className="px-0">
                      <CardTitle>Profile Details</CardTitle>
                      <CardDescription>Update your personal information and profile picture</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                <div className="md:col-span-1">
                  <ProfileForm user={user} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="password" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-1">
                  <Card className="border-none shadow-none">
                    <CardHeader className="px-0">
                      <CardTitle>Password Security</CardTitle>
                      <CardDescription>Change your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                      <p className="text-sm text-muted-foreground">
                        We recommend using a strong password that you don't use elsewhere. Your password should be at
                        least 8 characters long and include a mix of letters, numbers, and special characters.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="md:col-span-1">
                  <PasswordChangeForm userId={user.id} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="mt-0">
              <div className="grid gap-6">
                <div>
                  <Card className="border-none shadow-none">
                    <CardHeader className="px-0">
                      <CardTitle>My Enrolled Courses</CardTitle>
                      <CardDescription>View and manage all your enrolled courses</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                <EnrolledCourses userId={user.id} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
