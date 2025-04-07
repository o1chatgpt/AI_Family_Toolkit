"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, UserPlus, Trash2, Edit2, Check, UserCheck } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UserManagementProps {
  onClose: () => void
}

export function UserManagement({ onClose }: UserManagementProps) {
  const [users, setUsers] = useState([
    { id: 1, name: "Admin User", email: "admin@example.com", role: "admin", active: true },
    { id: 2, name: "Test User", email: "test@example.com", role: "user", active: true },
    { id: 3, name: "Demo Account", email: "demo@example.com", role: "guest", active: false },
  ])
  const [editingUser, setEditingUser] = useState<number | null>(null)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user", active: true })
  const [activeTab, setActiveTab] = useState("users")

  const handleEditUser = (id: number) => {
    setEditingUser(id)
  }

  const handleSaveUser = (id: number) => {
    setEditingUser(null)
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([...users, { ...newUser, id: users.length + 1 }])
      setNewUser({ name: "", email: "", role: "user", active: true })
      setActiveTab("users")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <UserCheck className="h-5 w-5" /> User Management
            </CardTitle>
            <CardDescription>Manage users and permissions</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="users">User List</TabsTrigger>
              <TabsTrigger value="add">Add User</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <Input
                              value={user.name}
                              onChange={(e) => {
                                const updatedUsers = [...users]
                                const index = updatedUsers.findIndex((u) => u.id === user.id)
                                updatedUsers[index] = { ...user, name: e.target.value }
                                setUsers(updatedUsers)
                              }}
                              className="h-8"
                            />
                          ) : (
                            user.name
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <Input
                              value={user.email}
                              onChange={(e) => {
                                const updatedUsers = [...users]
                                const index = updatedUsers.findIndex((u) => u.id === user.id)
                                updatedUsers[index] = { ...user, email: e.target.value }
                                setUsers(updatedUsers)
                              }}
                              className="h-8"
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <Select
                              value={user.role}
                              onValueChange={(value) => {
                                const updatedUsers = [...users]
                                const index = updatedUsers.findIndex((u) => u.id === user.id)
                                updatedUsers[index] = { ...user, role: value }
                                setUsers(updatedUsers)
                              }}
                            >
                              <SelectTrigger className="h-8 w-[120px]">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="guest">Guest</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="capitalize">{user.role}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <Switch
                              checked={user.active}
                              onCheckedChange={(checked) => {
                                const updatedUsers = [...users]
                                const index = updatedUsers.findIndex((u) => u.id === user.id)
                                updatedUsers[index] = { ...user, active: checked }
                                setUsers(updatedUsers)
                              }}
                            />
                          ) : (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.active
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {user.active ? "Active" : "Inactive"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingUser === user.id ? (
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleSaveUser(user.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditUser(user.id)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="add">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter user name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="block mb-2">
                      Status
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="status"
                        checked={newUser.active}
                        onCheckedChange={(checked) => setNewUser({ ...newUser, active: checked })}
                      />
                      <Label htmlFor="status">{newUser.active ? "Active" : "Inactive"}</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {activeTab === "add" ? (
            <Button onClick={handleAddUser}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          ) : (
            <Button onClick={() => setActiveTab("add")}>
              <UserPlus className="h-4 w-4 mr-2" />
              New User
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

