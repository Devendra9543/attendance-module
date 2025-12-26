"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUsers, addUser, deleteUser, type User as UserType } from "@/lib/storage"

export default function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    email: "",
    role: "employee",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const loadedUsers = getUsers()
    setUsers(loadedUsers)
  }

  const handleAddUser = () => {
    if (!formData.userId || !formData.userName || !formData.email) {
      alert("Please fill all required fields")
      return
    }

    addUser(formData)
    loadUsers()
    setShowModal(false)
    setFormData({ userId: "", userName: "", email: "", role: "employee" })
  }

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(id)
      loadUsers()
    }
  }

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            <p className="text-sm text-gray-500 mt-1">Manage system users for attendance tracking</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">#</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">User ID</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">User Name</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border border-gray-300 px-4 py-12 text-center text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="font-medium">No users added yet</p>
                    <p className="text-sm">Click "Add User" button to create your first user</p>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-3">{user.userId}</td>
                    <td className="border border-gray-300 px-4 py-3">{user.userName}</td>
                    <td className="border border-gray-300 px-4 py-3">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-3 capitalize">{user.role}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center gap-3 text-white">
                <User className="w-6 h-6" />
                <h3 className="text-xl font-bold">Add New User</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white hover:bg-white/20 rounded-lg p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="e.g., EMP001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., john.doe@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddUser} className="flex-1 bg-blue-500 hover:bg-blue-600">
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
