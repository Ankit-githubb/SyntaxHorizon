"use client"

import type React from "react"

import { useState } from "react"
import { Video, Plus, Trash2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface CourseVideo {
  id: string
  title: string
  description?: string
  publicId?: string
  url?: string
  duration?: number
  thumbnail?: string
  createdAt: string
  originalSize?: string
  compressedSize?: string
}

interface CourseVideosProps {
  courseId: string
  initialVideos: CourseVideo[]
}

export function CourseVideos({ courseId, initialVideos = [] }: CourseVideosProps) {
  const [videos, setVideos] = useState<CourseVideo[]>(initialVideos)
  const [isAddingVideo, setIsAddingVideo] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
  })
  const { toast } = useToast()

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoFile) {
      toast({
        title: "Error",
        description: "Please select a video file to upload",
        variant: "destructive",
      })
      return
    }

    if (!videoData.title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for the video",
        variant: "destructive",
      })
      return
    }

    if (!videoData.description.trim()) {
      toast({
        title: "Error",
        description: "Please provide a description for the video",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Start progress simulation
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 300)

    try {
      // Create form data for upload
      const formData = new FormData()
      formData.append("file", videoFile)
      formData.append("title", videoData.title)
      formData.append("description", videoData.description)
      formData.append("courseId", courseId)
      formData.append("originalSize", videoFile.size.toString())

      // Upload to the Cloudinary API endpoint
      const response = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
        headers: {
          // Include authorization if needed
          // "Authorization": "user-id-or-token"
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload video")
      }

      const newVideo = await response.json()

      // Add the new video to the list
      setVideos([
        ...videos,
        {
          id: newVideo.id,
          title: newVideo.title,
          description: newVideo.description,
          publicId: newVideo.publicId,
          url: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${newVideo.publicId}`,
          duration: newVideo.duration,
          createdAt: newVideo.createdAt || new Date().toISOString(),
          originalSize: newVideo.originalSize,
          compressedSize: newVideo.compressedSize,
          // Generate thumbnail URL from Cloudinary
          thumbnail: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/c_thumb,w_320,h_180/${newVideo.publicId}.jpg`,
        },
      ])

      clearInterval(interval)
      setUploadProgress(100)

      setTimeout(() => {
        setIsUploading(false)
        setIsAddingVideo(false)
        setVideoFile(null)
        setVideoData({ title: "", description: "" })
        setUploadProgress(0)

        toast({
          title: "Success",
          description: "Video uploaded successfully",
        })
      }, 500)
    } catch (error) {
      clearInterval(interval)
      setIsUploading(false)
      setUploadProgress(0)

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload video. Please try again.",
        variant: "destructive",
      })
      console.error("Error uploading video:", error)
    }
  }

  const handleDeleteVideo = async (videoId: string, publicId?: string) => {
    try {
      if (!publicId) {
        throw new Error("Video public ID not found")
      }

      // Call API to delete the video
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete video")
      }

      // Remove the video from the list
      setVideos(videos.filter((video) => video.id !== videoId))

      toast({
        title: "Success",
        description: "Video deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete video",
        variant: "destructive",
      })
      console.error("Error deleting video:", error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid video file",
          variant: "destructive",
        })
        return
      }
      setVideoFile(file)

      // Auto-fill title from filename if empty
      if (!videoData.title) {
        const fileName = file.name.split(".").slice(0, -1).join(".")
        setVideoData((prev) => ({
          ...prev,
          title: fileName,
        }))
      }
    }
  }

  const formatFileSize = (sizeInBytes?: string) => {
    if (!sizeInBytes) return "Unknown size"

    const size = Number.parseInt(sizeInBytes, 10)
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown duration"

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Course Videos</h2>
        <Dialog open={isAddingVideo} onOpenChange={setIsAddingVideo}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
              <DialogDescription>Upload a video for this course. Supported formats: MP4, WebM.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddVideo}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="video-file">Video File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="video-file"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="flex-1"
                    />
                    {videoFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setVideoFile(null)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {videoFile && (
                    <p className="text-xs text-muted-foreground">
                      {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={videoData.title}
                    onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                    disabled={isUploading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={videoData.description}
                    onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                    disabled={isUploading}
                    rows={3}
                    required
                  />
                </div>
                {isUploading && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-center text-muted-foreground">Uploading... {uploadProgress}%</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isUploading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isUploading || !videoFile}>
                  {isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-pulse" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Video className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No videos yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add videos to your course to provide valuable content to your students.
          </p>
          <Button onClick={() => setIsAddingVideo(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Video
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {videos.map((video) => (
            <Card key={video.id}>
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/3 aspect-video relative">
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Video className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{video.title}</h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{video.description}</p>
                      )}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                        <span>Added on {new Date(video.createdAt).toLocaleDateString()}</span>
                        {video.duration && <span>Duration: {formatDuration(video.duration)}</span>}
                        {video.originalSize && <span>Original: {formatFileSize(video.originalSize)}</span>}
                        {video.compressedSize && <span>Compressed: {formatFileSize(video.compressedSize)}</span>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteVideo(video.id, video.publicId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                        Preview
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Edit Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
