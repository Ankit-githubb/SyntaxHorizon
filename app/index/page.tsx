'use client'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import { BookOpen, Code, Lightbulb, Palette, Search, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function Home() {
  const route = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background Effect */}
      <section className="relative">
        <BackgroundBeamsWithCollision className="h-[600px] md:h-[700px]">
          <div className="container mx-auto px-4 py-24 relative z-10">
            <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-3xl mx-auto">
              <Badge variant="outline" className="px-4 py-1 text-sm">
                Transform Your Future With Online Learning
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Discover Your Potential With Expert-Led Courses
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Access thousands of high-quality courses taught by industry experts and transform your skills at your
                own pace.
              </p>

              <div className="w-full max-w-md relative">
                <Input type="text" placeholder="Search for courses..." className="pl-10 pr-4 py-6 rounded-full" />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={()=>{route.push('courses')}} size="lg" className="rounded-full">
                  Explore Courses
                </Button>
                <Button onClick={()=>{route.push('courses')}} variant="outline" size="lg" className="rounded-full">
                  Join For Free
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 z-20">
          </div>
        </BackgroundBeamsWithCollision>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Browse Top Categories</h2>
            <p className="text-muted-foreground mt-2">Find the perfect course in our diverse catalog</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Code className="h-8 w-8" />, name: "Programming" },
              { icon: <Palette className="h-8 w-8" />, name: "Design" },
              { icon: <TrendingUp className="h-8 w-8" />, name: "Business" },
              { icon: <Lightbulb className="h-8 w-8" />, name: "Personal Development" },
              { icon: <Users className="h-8 w-8" />, name: "Marketing" },
              { icon: <BookOpen className="h-8 w-8" />, name: "Academics" },
            ].map((category, index) => (
              <Link href={`/category/${category.name.toLowerCase()}`} key={index}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">{category.icon}</div>
                    <h3 className="font-medium">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Courses</h2>
              <p className="text-muted-foreground mt-2">Handpicked courses to get you started</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/courses">View All Courses</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Complete Web Development Bootcamp",
                description: "Learn HTML, CSS, JavaScript, React, Node and more to become a full-stack developer",
                image: "data:image/jpeg;base64,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",
                instructor: "Sarah Johnson",
                price: "$89.99",
                rating: 4.8,
                students: 12453,
              },
              {
                title: "Data Science Fundamentals",
                description: "Master the essentials of data analysis, visualization, and machine learning",
                image: "data:image/png;base64,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",
                instructor: "Michael Chen",
                price: "$94.99",
                rating: 4.7,
                students: 8765,
              },
              {
                title: "UX/UI Design Masterclass",
                description: "Create stunning user interfaces and seamless experiences with modern design principles",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt3itybiOe6fLTgrmWBJOE3k5eNUOjnKDW1Q&s",
                instructor: "Emma Rodriguez",
                price: "$79.99",
                rating: 4.9,
                students: 6542,
              },
            ].map((course, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    By {course.instructor} • {course.rating} ★ ({course.students.toLocaleString()} students)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{course.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="font-bold">{course.price}</span>
                  <Button size="sm">Enroll Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

    
      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Start Your Learning Journey Today</h2>
            <p className="text-primary-foreground/80">
              Join thousands of students already learning on our platform. Get unlimited access to all courses.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={()=>{route.push('courses')}}  size="lg" variant="secondary">
                Sign Up For Free
              </Button>
              <Button onClick={()=>{route.push('courses')}} size="lg" variant="outline" className="bg-transparent">
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">EduLearn</h3>
              <p className="text-muted-foreground">Transforming lives through quality online education.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/courses" className="text-muted-foreground hover:text-foreground">
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/instructors" className="text-muted-foreground hover:text-foreground">
                    Instructors
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} EduLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

