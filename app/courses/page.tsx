"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, Users, Star, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: string
  price: number
  rating: number
  image?: string
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:3000/api/coursess")
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        const formattedCourses = data.courses.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          instructor: course.teacher?.user?.name || "Unknown",
          category: course.category?.name || "Uncategorized",
          level: course.type || "Unknown", // assuming FREE / PAID = level
          price: course.price,
          rating: 4.5, // Or use course.rating if it exists
          image: course.imageUrl,
        }))

        setCourses(formattedCourses)
        setFilteredCourses(formattedCourses)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    let filtered = [...courses]

    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter((course) => course.category === activeCategory)
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query) ||
          course.level.toLowerCase().includes(query),
      )
    }

    setFilteredCourses(filtered)
  }, [searchQuery, courses, activeCategory])

  // Extract unique categories for the tabs
  const categories = ["all", ...new Set(courses.map((course) => course.category))]

  const handleViewCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="container mx-auto py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Expand Your Knowledge</h1>
          <p className="text-xl opacity-90 max-w-2xl mb-8">
            Discover top-quality courses taught by industry experts and take your skills to the next level
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-5 w-5" />
            <Input
              placeholder="Search for any course, topic, or instructor..."
              className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus-visible:ring-purple-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        {/* Category Tabs */}
        <Tabs defaultValue="all" className="mb-8" value={activeCategory} onValueChange={setActiveCategory}>
          <div className="border-b mb-4">
            <TabsList className="bg-transparent h-auto p-0 mb-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-4 py-2 h-10"
                >
                  {category === "all" ? "All Courses" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <CourseCardSkeleton key={index} />
                  ))}
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} onViewCourse={handleViewCourse} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                    <BookOpen className="h-8 w-8 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setActiveCategory("all")
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

function CourseCard({ course, onViewCourse }: { course: Course; onViewCourse: (id: string) => void }) {
  // Function to determine badge color based on level
  const getLevelBadgeVariant = (level: string) => {
    if (level === "FREE") return "success"
    if (level === "PAID") return "default"
    return "outline"
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] group">
      <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
        {course.image ? (
          <img
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
            <BookOpen className="h-12 w-12 text-slate-400" />
          </div>
        )}
        <Badge className="absolute top-3 right-3 font-medium" variant={getLevelBadgeVariant(course.level)}>
          {course.level}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">{course.title}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5 mr-1" />
          <span>{course.instructor}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow pb-2">
        <p className="text-sm line-clamp-3 text-slate-600 dark:text-slate-300">{course.description}</p>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 pt-4 border-t">
        <div className="flex justify-between items-center w-full">
          <Badge
            variant="secondary"
            className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
          >
            {course.category}
          </Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">{course.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center w-full">
          <span className="font-bold text-lg">{course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 -mr-2"
            onClick={() => onViewCourse(course.id)}
          >
            View Course <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Skeleton className="h-48 w-full" />
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pt-4 border-t">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-10" />
        </div>
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-28" />
        </div>
      </CardFooter>
    </Card>
  )
}
