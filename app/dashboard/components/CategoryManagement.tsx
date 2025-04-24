"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { AddCategoryForm } from "./AddCategoryForm"
import { useToast } from "@/hooks/use-toast"

type Category = {
  id: string
  name: string
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use placeholder data
      const response = await fetch("/api/category/add")
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryAdded = (newCategory: Category) => {
    setCategories([...categories, newCategory])
    setIsAddingCategory(false)
    toast({
      title: "Success",
      description: "Category added successfully",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <Button onClick={() => setIsAddingCategory(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {isAddingCategory && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
            <CardDescription>Create a new category for your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <AddCategoryForm onSuccess={handleCategoryAdded} onCancel={() => setIsAddingCategory(false)} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p>No categories found. Create your first category to get started.</p>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

