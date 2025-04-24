"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import type { Course } from "@/types/course"
import PaymentMethodSelector from "./PaymentMethodSelector"

interface EnrollmentCardProps {
  course: Course
}

export default function EnrollmentCard({ course }: EnrollmentCardProps) {
  const router = useRouter()
  const [enrollmentStep, setEnrollmentStep] = useState<"details" | "payment" | "confirmation">("details")
  const [paymentMethod, setPaymentMethod] = useState<"esewa" | "khalti">("esewa")
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
  })

  const processPayment = () => {
    // In a real app, this would call the payment gateway API
    console.log("Processing payment with:", {
      method: paymentMethod,
      userName: userDetails.name,
      userId: userDetails.email, // Using email as ID for this example
      amount: course.price,
      courseId: course.id,
    })

    // For demonstration purposes
    setEnrollmentStep("confirmation")

    // Simulate a redirect after successful enrollment
    setTimeout(() => {
      router.push(`/courses/${course.id}/learn`)
    }, 3000)
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>{course.price === 0 ? "Enroll for Free" : `Enroll for $${course.price.toFixed(2)}`}</CardTitle>
        <CardDescription>Get instant access to this course</CardDescription>
      </CardHeader>

      <CardContent>
        {enrollmentStep === "details" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={userDetails.name}
                onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={userDetails.email}
                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              onClick={() => (course.price > 0 ? setEnrollmentStep("payment") : processPayment())}
            >
              {course.price === 0 ? "Enroll Now" : "Continue to Payment"}
            </Button>
          </div>
        )}

        {enrollmentStep === "payment" && (
          <div className="space-y-4">
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onSelectMethod={(method) => setPaymentMethod(method as "esewa" | "khalti")}
            />

            {paymentMethod === "esewa" && (
              <div className="space-y-2">
                <Label htmlFor="esewaId">eSewa ID</Label>
                <Input id="esewaId" placeholder="Enter your eSewa ID" />
              </div>
            )}

            {paymentMethod === "khalti" && (
              <div className="space-y-2">
                <Label htmlFor="khaltiMobile">Khalti Mobile Number</Label>
                <Input id="khaltiMobile" placeholder="Enter your mobile number" />
              </div>
            )}

            <Separator />

            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>${course.price.toFixed(2)}</span>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              onClick={processPayment}
            >
              Complete Payment
            </Button>

            <Button variant="outline" className="w-full" onClick={() => setEnrollmentStep("details")}>
              Back
            </Button>
          </div>
        )}

        {enrollmentStep === "confirmation" && (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Enrollment Successful!</h3>
            <p className="text-muted-foreground mb-6">
              You now have access to this course. Redirecting you to the course content...
            </p>
            <Progress value={100} className="mb-4" />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="w-full text-center text-sm text-muted-foreground">
          <Calendar className="inline-block mr-1 h-4 w-4" />
          Last updated {course.lastUpdated}
        </div>

        {enrollmentStep === "details" && (
          <div className="flex flex-col space-y-2 w-full">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-sm">30-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-sm">Full Lifetime Access</span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
