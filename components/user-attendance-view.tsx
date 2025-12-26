"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { getUsers, getAttendanceByUserAndMonth } from "@/lib/storage"

interface AttendanceRecord {
  userId: string
  userName: string
  days: {
    [day: number]: {
      checkIn: string
      checkOut: string
      totalHrs: number
      otHrs: number
    }
  }
}

export default function UserAttendanceView() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = () => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate()
  }

  useEffect(() => {
    loadAttendanceData()
  }, [selectedMonth, selectedYear])

  const loadAttendanceData = () => {
    const users = getUsers()

    const formattedData: AttendanceRecord[] = users.map((user) => {
      const userAttendance = getAttendanceByUserAndMonth(user.id, selectedYear, selectedMonth)

      const days: AttendanceRecord["days"] = {}
      userAttendance.forEach((record) => {
        const day = new Date(record.date).getDate()
        days[day] = {
          checkIn: record.checkIn,
          checkOut: record.checkOut,
          totalHrs: record.totalHrs,
          otHrs: record.otHrs,
        }
      })

      return {
        userId: user.userId,
        userName: user.userName,
        days,
      }
    })

    setAttendanceData(formattedData)
  }

  const daysInMonth = getDaysInMonth()
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Monthly_Attendance_{selectedYear}_{(selectedMonth + 1).toString().padStart(2, "0")}
        </h2>

        {/* Month/Year Selector */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Month:</label>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Year:</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
            />
          </div>

          <button
            onClick={loadAttendanceData}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Show
          </button>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-12">#</th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700 min-w-[100px]">
                  User ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700 min-w-[120px]">
                  User Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700 min-w-[140px]">
                  Duty Status
                </th>
                {dayNumbers.map((day) => (
                  <th
                    key={day}
                    className="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 w-12"
                  >
                    {day}
                  </th>
                ))}
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 min-w-[100px]">
                  Total Present Day
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 min-w-[100px]">
                  Total OT Hrs
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length === 0 ? (
                <tr>
                  <td
                    colSpan={dayNumbers.length + 5}
                    className="border border-gray-300 px-4 py-12 text-center text-gray-500"
                  >
                    <p className="font-medium">No users found</p>
                    <p className="text-sm">Please add users in User Management section first</p>
                  </td>
                </tr>
              ) : (
                attendanceData.map((user, index) => (
                  <>
                    {/* Check In Row */}
                    <tr key={`${user.userId}-checkin`} className="hover:bg-gray-50">
                      <td rowSpan={4} className="border border-gray-300 px-3 py-2 text-center font-medium">
                        {index + 1}
                      </td>
                      <td rowSpan={4} className="border border-gray-300 px-4 py-2 text-center">
                        {user.userId}
                      </td>
                      <td rowSpan={4} className="border border-gray-300 px-4 py-2 text-center">
                        {user.userName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-600">Check in</td>
                      {dayNumbers.map((day) => (
                        <td key={day} className="border border-gray-300 px-2 py-2 text-center text-xs">
                          {user.days[day]?.checkIn || ""}
                        </td>
                      ))}
                      <td rowSpan={4} className="border border-gray-300 px-3 py-2 text-center font-medium">
                        {Object.keys(user.days).length}
                      </td>
                      <td rowSpan={4} className="border border-gray-300 px-3 py-2 text-center font-medium">
                        {Object.values(user.days)
                          .reduce((sum, day) => sum + day.otHrs, 0)
                          .toFixed(2)}
                      </td>
                    </tr>

                    {/* Check Out Row */}
                    <tr key={`${user.userId}-checkout`} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-gray-600">Check Out</td>
                      {dayNumbers.map((day) => (
                        <td key={day} className="border border-gray-300 px-2 py-2 text-center text-xs">
                          {user.days[day]?.checkOut || ""}
                        </td>
                      ))}
                    </tr>

                    {/* Total Hrs Row */}
                    <tr key={`${user.userId}-total`} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-gray-600">Total Hrs</td>
                      {dayNumbers.map((day) => (
                        <td key={day} className="border border-gray-300 px-2 py-2 text-center text-xs">
                          {user.days[day]?.totalHrs || ""}
                        </td>
                      ))}
                    </tr>

                    {/* OT Hrs Row */}
                    <tr key={`${user.userId}-ot`} className="hover:bg-gray-50 border-b-2 border-gray-400">
                      <td className="border border-gray-300 px-4 py-2 text-gray-600">OT Hrs (After 8hrs)</td>
                      {dayNumbers.map((day) => (
                        <td key={day} className="border border-gray-300 px-2 py-2 text-center text-xs">
                          {user.days[day]?.otHrs || ""}
                        </td>
                      ))}
                    </tr>
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
