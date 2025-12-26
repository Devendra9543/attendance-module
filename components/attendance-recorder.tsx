"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUsers, addAttendanceRecord, type User } from "@/lib/storage"

export default function AttendanceRecorder() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [attendanceData, setAttendanceData] = useState<
    {
      userId: string
      checkIn: string
      checkOut: string
    }[]
  >([])

  useEffect(() => {
    const loadedUsers = getUsers()
    setUsers(loadedUsers)
    setAttendanceData(
      loadedUsers.map((user) => ({
        userId: user.id,
        checkIn: "",
        checkOut: "",
      })),
    )
  }, [])

  const handleInputChange = (userId: string, field: "checkIn" | "checkOut", value: string) => {
    setAttendanceData((prev) =>
      prev.map((record) => (record.userId === userId ? { ...record, [field]: value } : record)),
    )
  }

  const calculateHours = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return { totalHrs: 0, otHrs: 0 }

    const [inHour, inMin] = checkIn.split(":").map(Number)
    const [outHour, outMin] = checkOut.split(":").map(Number)

    const inMinutes = inHour * 60 + inMin
    const outMinutes = outHour * 60 + outMin

    const totalMinutes = outMinutes - inMinutes
    const totalHrs = totalMinutes / 60

    const otHrs = totalHrs > 8 ? totalHrs - 8 : 0

    return {
      totalHrs: Math.round(totalHrs * 100) / 100,
      otHrs: Math.round(otHrs * 100) / 100,
    }
  }

  const handleSaveAttendance = () => {
    let savedCount = 0

    attendanceData.forEach((record) => {
      if (record.checkIn && record.checkOut) {
        const { totalHrs, otHrs } = calculateHours(record.checkIn, record.checkOut)

        addAttendanceRecord({
          userId: record.userId,
          date: selectedDate,
          checkIn: record.checkIn,
          checkOut: record.checkOut,
          totalHrs,
          otHrs,
        })
        savedCount++
      }
    })

    if (savedCount > 0) {
      alert(`Attendance saved for ${savedCount} user(s)!`)
      // Reset form
      setAttendanceData(
        users.map((user) => ({
          userId: user.id,
          checkIn: "",
          checkOut: "",
        })),
      )
    } else {
      alert("Please enter check-in and check-out times for at least one user")
    }
  }

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Record Daily Attendance</h2>
            <p className="text-sm text-gray-500 mt-1">Enter check-in and check-out times for employees</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="font-medium">No users found</p>
            <p className="text-sm">Please add users in User Management section first</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">#</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">User ID</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                      User Name
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                      Check In
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                      Check Out
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                      Total Hrs
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">OT Hrs</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const record = attendanceData.find((r) => r.userId === user.id)
                    const { totalHrs, otHrs } = record
                      ? calculateHours(record.checkIn, record.checkOut)
                      : { totalHrs: 0, otHrs: 0 }

                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-3">{user.userId}</td>
                        <td className="border border-gray-300 px-4 py-3">{user.userName}</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <input
                              type="time"
                              value={record?.checkIn || ""}
                              onChange={(e) => handleInputChange(user.id, "checkIn", e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <input
                              type="time"
                              value={record?.checkOut || ""}
                              onChange={(e) => handleInputChange(user.id, "checkOut", e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                          {totalHrs > 0 ? totalHrs.toFixed(2) : "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                          {otHrs > 0 ? otHrs.toFixed(2) : "-"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveAttendance} className="bg-blue-500 hover:bg-blue-600">
                <Save className="w-4 h-4 mr-2" />
                Save Attendance
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
