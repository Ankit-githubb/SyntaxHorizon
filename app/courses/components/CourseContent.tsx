import { BookOpen, CheckCircle, PlayCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Course } from "@/types/course"

interface CourseContentProps {
  course: Course
}

export default function CourseContent({ course }: CourseContentProps) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
        <TabsTrigger value="instructor">Instructor</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>What You'll Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-3">
              {course.whatYouWillLearn?.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{course.description}</p>
            <p>
              This comprehensive course is designed to take you from beginner to proficient, with hands-on projects and
              practical examples. Whether you're looking to advance your career or pursue a personal interest, this
              course provides the knowledge and skills you need to succeed.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="curriculum">
        <Card>
          <CardHeader>
            <CardTitle>Course Curriculum</CardTitle>
            <CardDescription>
              {course.totalLessons} lessons • {course.duration} total length
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {course.curriculum?.map((section, index) => (
                <AccordionItem key={index} value={`section-${index}`}>
                  <AccordionTrigger className="hover:bg-slate-50 px-4 dark:hover:bg-slate-800/50">
                    <div className="flex justify-between w-full pr-4">
                      <span>{section.section}</span>
                      <span className="text-muted-foreground text-sm">{section.lessons.length} lessons</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <ul className="space-y-2">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex items-center">
                            {lesson.type === "video" && <PlayCircle className="h-4 w-4 mr-2 text-blue-500" />}
                            {lesson.type === "quiz" && <BookOpen className="h-4 w-4 mr-2 text-purple-500" />}
                            {lesson.type === "assignment" && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
                            <span>{lesson.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="instructor">
        <Card>
          <CardHeader>
            <CardTitle>About the Instructor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-purple-700">{course.instructor.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{course.instructor}</h3>
                <p className="text-muted-foreground">Expert Instructor</p>
              </div>
            </div>

            <p className="mb-4">
              {course.instructor} is a passionate educator with years of experience in teaching and industry practice.
              Their teaching approach focuses on practical, hands-on learning that prepares students for real-world
              challenges.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="font-medium">Courses</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div>
                <p className="font-medium">Students</p>
                <p className="text-2xl font-bold">10,000+</p>
              </div>
              <div>
                <p className="font-medium">Reviews</p>
                <p className="text-2xl font-bold">4.8/5</p>
              </div>
              <div>
                <p className="font-medium">Experience</p>
                <p className="text-2xl font-bold">8+ years</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
