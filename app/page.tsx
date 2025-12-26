"use client"

import { Home, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SuperAdminDashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MargSaarthi</h1>
              <p className="text-sm text-gray-600">Transport Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 bg-blue-600 text-white px-4 py-2 rounded-full">
              <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-semibold">
                D
              </div>
              <span className="font-medium">Devendra</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">Super Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Attendance Module Card */}
          <button
            onClick={() => router.push("/station-master")}
            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-left group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform p-2">
              <Image
                src="/attendance-icon.png"
                alt="Attendance Module"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Attendance Module</h3>
            <p className="text-gray-600">Track and manage employee attendance</p>
          </button>
        </div>
      </main>
    </div>
  )
}
