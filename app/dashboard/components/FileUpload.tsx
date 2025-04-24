"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  fileUrl: string | null
  accept: string
  isUploading: boolean
  fileType: "image" | "video"
}

export function FileUpload({ 
  onFileSelect, 
  fileUrl, 
  accept, 
  isUploading,
  fileType 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith(fileType === "image" ? "image/" : "video/")) {
        onFileSelect(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={isUploading}
      />
      
      {!fileUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {isUploading ? (
              "Uploading..."
            ) : (
              <>
                Drag and drop your {fileType}, or <span className="text-primary font-medium">click to browse</span>
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {fileType === "image" ? "PNG, JPG or GIF" : "MP4, WebM or MOV"} up to 10MB
          </p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border">
          {fileType === "image" ? (
            <div className="aspect-video relative">
              <Image 
                src={fileUrl || "/placeholder.svg"} 
                alt="Uploaded image" 
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <video 
              src={fileUrl} 
              controls 
              className="w-full aspect-video object-cover"
            />
          )}
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.value = ""
              }
              onFileSelect(new File([], ""))
            }}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

