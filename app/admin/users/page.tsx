"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit,
  User,
  X,
  Check,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserType {
  id: string
  name: string
  email: string
  role: string
  password?: string
  createdAt: string
  updatedAt?: string
  avatar?: string
  avatarPublicId?: string
  introVideoUrl?: string | null
  videoPublicId?: string | null
  status?: "active" | "inactive" | "pending"
  lastLogin?: string
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserType[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

  const usersPerPage = 10

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:3000/api/user/getuser")
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        // Handle the specific API response format
        let fetchedUsers: UserType[] = []

        if (data.user) {
          // Single user response
          const user = data.user
          fetchedUsers = [
            {
              ...user,
              // Convert role to lowercase for consistent display
              role: user.role?.toLowerCase() || "user",
              // Add status field if not present
              status: user.status || "active",
            },
          ]
        } else if (Array.isArray(data)) {
          // Array of users
          fetchedUsers = data.map((user) => ({
            ...user,
            role: user.role?.toLowerCase() || "user",
            status: user.status || "active",
          }))
        } else if (data.users && Array.isArray(data.users)) {
          // Users property containing array
          fetchedUsers = data.users.map((user) => ({
            ...user,
            role: user.role?.toLowerCase() || "user",
            status: user.status || "active",
          }))
        }

        setUsers(fetchedUsers)
        setFilteredUsers(fetchedUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
        // Use mock data for demonstration if API fails
        const mockUsers = generateMockUsers(25)
        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    let result = [...users]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter)
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, statusFilter, roleFilter, users])

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleViewUser = (user: UserType) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleDeleteUser = (user: UserType) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!selectedUser) return

    // In a real app, you would call your API to delete the user
    // await fetch(`/api/users/${selectedUser.id}`, { method: 'DELETE' })

    // For now, we'll just remove the user from our local state
    setUsers(users.filter((user) => user.id !== selectedUser.id))
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const handleSaveUser = async (updatedUser: UserType) => {
    try {
      // Perform the API call to update the user
      const response = await fetch(`/api/user/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
  
      // Check if the update was successful
      if (!response.ok) {
        // Handle the case where the server responds with an error
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }
  
      // Update the user in the local state if the API call was successful
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      
      // Close the edit dialog and clear the selected user
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Handle any errors that occurred during the fetch request
      console.error('Error updating user:', error);
      alert('An error occurred while updating the user. Please try again.');
    }
  };
  

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(currentUsers.map((user) => user.id))
    }
  }

  const handleBulkDelete = () => {
    setIsBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = () => {
    // In a real app, you would call your API to delete multiple users
    // await Promise.all(selectedUsers.map(id => fetch(`/api/users/${id}`, { method: 'DELETE' })))

    // For now, we'll just remove the users from our local state
    setUsers(users.filter((user) => !selectedUsers.includes(user.id)))
    setSelectedUsers([])
    setIsBulkDeleteDialogOpen(false)
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "teacher":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "student":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Generate mock users for demonstration
  function generateMockUsers(count: number): UserType[] {
    const roles = ["admin", "teacher", "student"]
    const statuses = ["active", "inactive", "pending"]

    return Array.from({ length: count }, (_, i) => ({
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)] as "active" | "inactive" | "pending",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      lastLogin:
        Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString() : undefined,
    }))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">View and manage user accounts</p>
        </div>
        <Button onClick={() => router.push("/admin/users/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>User Statistics</CardTitle>
          <CardDescription>Overview of user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Total Users</div>
              <div className="text-2xl font-bold">{users.length}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Active Users</div>
              <div className="text-2xl font-bold">{users.filter((user) => user.status === "active").length}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">New This Month</div>
              <div className="text-2xl font-bold">
                {
                  users.filter((user) => {
                    const date = new Date(user.createdAt)
                    const now = new Date()
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                  }).length
                }
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Pending Approval</div>
              <div className="text-2xl font-bold">{users.filter((user) => user.status === "pending").length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name, email or ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" /> Export Users
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Upload className="mr-2 h-4 w-4" /> Import Users
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setRoleFilter("all")
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-2 bg-slate-50 dark:bg-slate-800 rounded">
              <span className="text-sm">{selectedUsers.length} users selected</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                  Clear Selection
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onCheckedChange={handleSelectAllUsers}
                    aria-label="Select all users"
                  />
                </TableHead>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={`${getRoleColor(user.role || "user")}`}>{user.role || "user"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(user.status || "active")}`}>
                        {user.status === "active" && <Check className="mr-1 h-3 w-3" />}
                        {user.status === "inactive" && <X className="mr-1 h-3 w-3" />}
                        {user.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                        {user.status || "active"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.updatedAt ? (
                        new Date(user.updatedAt).toLocaleDateString()
                      ) : (
                        <span className="text-muted-foreground text-sm">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <User className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum = currentPage
                if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                }
                return null
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed information about the selected user.</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback className="text-2xl">{selectedUser.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={`${getRoleColor(selectedUser.role || "user")}`}>
                      {selectedUser.role || "user"}
                    </Badge>
                    <Badge variant="outline" className={`${getStatusColor(selectedUser.status || "active")}`}>
                      {selectedUser.status || "active"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Information</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">User ID</Label>
                      <p className="font-medium">{selectedUser.id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Created On</Label>
                      <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Last Updated</Label>
                      <p className="font-medium">
                        {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Role</Label>
                      <p className="font-medium capitalize">{selectedUser.role || "user"}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="activity" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Last Login</Label>
                      <p className="font-medium">
                        {selectedUser.lastLogin
                          ? new Date(selectedUser.lastLogin).toLocaleDateString()
                          : "No login recorded"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Account Status</Label>
                      <p className="font-medium capitalize">{selectedUser.status || "active"}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="media" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Avatar</Label>
                      {selectedUser.avatar ? (
                        <div className="mt-2">
                          <img
                            src={selectedUser.avatar || "/placeholder.svg"}
                            alt="User avatar"
                            className="w-32 h-32 object-cover rounded-md border"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Public ID: {selectedUser.avatarPublicId || "N/A"}
                          </p>
                        </div>
                      ) : (
                        <p className="font-medium">No avatar uploaded</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-muted-foreground">Intro Video</Label>
                      {selectedUser.introVideoUrl ? (
                        <div className="mt-2">
                          <video
                            src={selectedUser.introVideoUrl}
                            controls
                            className="w-full max-w-md rounded-md border"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Public ID: {selectedUser.videoPublicId || "N/A"}
                          </p>
                        </div>
                      ) : (
                        <p className="font-medium">No intro video uploaded</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false)
                handleEditUser(selectedUser!)
              }}
            >
              Edit User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Make changes to the user's information.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback className="text-3xl">{selectedUser.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" defaultValue={selectedUser.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" defaultValue={selectedUser.email} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select defaultValue={selectedUser.role?.toLowerCase() || "user"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={selectedUser.status || "active"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="avatar" className="text-right">
                  Avatar URL
                </Label>
                <Input id="avatar" defaultValue={selectedUser.avatar || ""} className="col-span-3" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleSaveUser({
                    ...selectedUser,
                    // In a real app, you would get the updated values from form inputs
                    name: (document.getElementById("name") as HTMLInputElement)?.value || selectedUser.name,
                    email: (document.getElementById("email") as HTMLInputElement)?.value || selectedUser.email,
                    avatar: (document.getElementById("avatar") as HTMLInputElement)?.value || selectedUser.avatar,
                  })
                }
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove their data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete multiple users?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {selectedUsers.length} users. This action cannot be undone. All selected user
              accounts will be permanently removed from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
