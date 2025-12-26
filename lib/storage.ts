export interface User {
  id: string
  userId: string
  userName: string
  email: string
  role: string
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  userId: string
  date: string
  checkIn: string
  checkOut: string
  totalHrs: number
  otHrs: number
}

// User Management
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("users")
  return stored ? JSON.parse(stored) : []
}

export const saveUsers = (users: User[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("users", JSON.stringify(users))
}

export const addUser = (user: Omit<User, "id" | "createdAt">) => {
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export const deleteUser = (userId: string) => {
  const users = getUsers().filter((u) => u.id !== userId)
  saveUsers(users)
}

// Attendance Management
export const getAttendanceRecords = (): AttendanceRecord[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("attendance")
  return stored ? JSON.parse(stored) : []
}

export const saveAttendanceRecords = (records: AttendanceRecord[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("attendance", JSON.stringify(records))
}

export const addAttendanceRecord = (record: Omit<AttendanceRecord, "id">) => {
  const records = getAttendanceRecords()
  const newRecord: AttendanceRecord = {
    ...record,
    id: Date.now().toString(),
  }
  records.push(newRecord)
  saveAttendanceRecords(records)
  return newRecord
}

export const getAttendanceByUserAndMonth = (userId: string, year: number, month: number) => {
  const records = getAttendanceRecords()
  return records.filter((record) => {
    const recordDate = new Date(record.date)
    return record.userId === userId && recordDate.getFullYear() === year && recordDate.getMonth() === month
  })
}
