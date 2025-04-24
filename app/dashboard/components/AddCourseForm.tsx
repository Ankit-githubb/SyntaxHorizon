"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "../components/FileUpload"

type Category = {
  id: string
  name: string
}

type Course = {
  id: string
  title: string
  description: string
  price: number
  type: string
  imageUrl?: string
  videoUrl?: string
  categoryId?: string
}

interface AddCourseFormProps {
  teacherId: string
  categories: Category[]
  onSuccess: (course: Course) => void
  onCancel: () => void
}

export function AddCourseForm({ teacherId, categories, onSuccess, onCancel }: AddCourseFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "0",
    type: "FREE",
    categoryId: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [imagePublicId, setImagePublicId] = useState<string | null>(null)
  const [videoPublicId, setVideoPublicId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (file: File) => {
    setImageFile(file)
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image")
      }
      
      setImageUrl(data.url)
      setImagePublicId(data.publicId)
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleVideoUpload = async (file: File) => {
    setVideoFile(file)
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload video")
      }
      
      setVideoUrl(data.url)
      setVideoPublicId(data.publicId)
      toast({
        title: "Success",
        description: "Video uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading video:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Course title is required",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.description.trim()) {
      toast({
        title: "Error",
        description: "Course description is required",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const courseData = {
        ...formData,
        price: formData.type === "FREE" ? 0 : parseFloat(formData.price),
        teacherId,
        imageUrl,
        videoUrl,
        imagePublicId,
        videoPublicId,
      }
      
      const response = await fetch("/api/coursess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
        
      })
      
      const data = await response.json()
      console.log(data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to create course")
      }
      
      onSuccess(data.course)
    } catch (error) {
      console.error("Error creating course:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create course",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter course title"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter course description"
              disabled={isSubmitting}
              required
              className="min-h-[120px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Course Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">Free</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.type === "PAID" && (
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter course price"
                disabled={isSubmitting}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleSelectChange("categoryId", value)}
              disabled={isSubmitting || categories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categories.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No categories available. Please create a category first.
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Course Thumbnail</Label>
            <FileUpload
              onFileSelect={handleImageUpload}
              fileUrl={imageUrl}
              accept="image/*"
              isUploading={isUploading}
              fileType="image"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Course Video (Optional)</Label>
            <FileUpload
              onFileSelect={handleVideoUpload}
              fileUrl={videoUrl}
              accept="video/*"
              isUploading={isUploading}
              fileType="video"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting || isUploading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? "Creating..." : "Create Course"}
        </Button>
      </div>
    </form>
  )
}
