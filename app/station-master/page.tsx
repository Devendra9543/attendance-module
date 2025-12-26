"use client"

import { useState, useEffect } from "react"
import { Building2, Plus, ArrowLeft, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserAttendanceView from "@/components/user-attendance-view"
import AddStationModal from "@/components/add-station-modal"

interface Station {
  id: number
  stationName: string
  placeArea: string
  nearbyBusStation: string
  latitude: number
  longitude: number
  radius: number
}

export default function StationMaster() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<"station" | "attendance">("station")
  const [activeView, setActiveView] = useState<"add" | "view">("view")
  const [showModal, setShowModal] = useState(false)
  const [stations, setStations] = useState<Station[]>([])
  const [editingStation, setEditingStation] = useState<Station | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [showUserAttendance, setShowUserAttendance] = useState(false)

  const [formData, setFormData] = useState({
    stationName: "",
    placeArea: "",
    nearbyBusStation: "",
    latitude: 18.52,
    longitude: 73.85,
    radius: 100,
  })

  useEffect(() => {
    const storedStations = localStorage.getItem("stations")
    if (storedStations) {
      setStations(JSON.parse(storedStations))
    }
  }, [])

  const filteredStations = stations.filter(
    (station) =>
      station.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.placeArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.nearbyBusStation.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredStations.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentStations = filteredStations.slice(startIndex, endIndex)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#1e3a8a] to-[#1e40af] text-white flex flex-col">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold">Navigation</h2>
        </div>

        <nav className="flex-1 py-6">
          {/* Station Master Section */}
          <div className="mb-6">
            <button
              onClick={() => setActiveSection("station")}
              className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
                activeSection === "station" ? "bg-white/20" : ""
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">Station Master</span>
            </button>

            {activeSection === "station" && (
              <div className="mt-2 space-y-1">
                <button
                  onClick={() => {
                    setActiveView("add")
                    setShowUserAttendance(false)
                  }}
                  className={`w-full flex items-center gap-3 px-12 py-2 text-sm hover:bg-white/10 transition-colors ${
                    activeView === "add" && !showUserAttendance ? "bg-white/10" : ""
                  }`}
                >
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Add Station</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView("view")
                    setShowUserAttendance(false)
                  }}
                  className={`w-full flex items-center gap-3 px-12 py-2 text-sm hover:bg-white/10 transition-colors ${
                    activeView === "view" && !showUserAttendance ? "bg-white/10" : ""
                  }`}
                >
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>View Station</span>
                </button>
              </div>
            )}
          </div>

          {/* User Attendance Section */}
          <div className="mb-6">
            <button
              onClick={() => setActiveSection("attendance")}
              className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
                activeSection === "attendance" ? "bg-white/20" : ""
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">User Attendance</span>
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-white/20 text-center">
          <p className="text-sm italic text-white/60 mb-2">"Contact We Stand, Together We Achieve."</p>
          <p className="text-xs text-white/40">© Copyright Margisanthi. All rights reserved</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#1e2875]" />
              <div>
                <h1 className="text-2xl font-bold text-[#1e2875]">
                  {activeSection === "attendance" ? "User Attendance" : "Station Master"}
                </h1>
                <p className="text-sm text-gray-500">
                  {activeSection === "attendance"
                    ? "Monthly Attendance View"
                    : activeView === "add"
                      ? "Add Station"
                      : "View Station"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {activeSection === "attendance" ? (
          <UserAttendanceView />
        ) : activeView === "add" ? (
          <div className="flex-1 p-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Add New Station</h2>
                <p className="text-gray-600">Click the "+ Add Station" button to open the map and add a new station</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Station
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-8">
            {/* Control Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Station
                </button>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show</span>
                    <select
                      value={entriesPerPage}
                      onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                      className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    <span className="text-sm text-gray-600">entries</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Search:</span>
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search stations..."
                      className="w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#1e2875] uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#1e2875] uppercase">Station Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#1e2875] uppercase">Place / Area</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#1e2875] uppercase">
                      Nearby Bus Station
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#1e2875] uppercase">Latitude</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#1e2875] uppercase">Longitude</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#1e2875] uppercase">Radius</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-24 h-24 mb-6 relative">
                            <div className="absolute inset-0 bg-blue-100 rounded-full opacity-50"></div>
                            <div className="absolute inset-2 bg-blue-200 rounded-full opacity-50"></div>
                            <div className="absolute inset-4 bg-blue-300 rounded-full flex items-center justify-center">
                              <Building2 className="w-8 h-8 text-blue-600" />
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">No stations added yet</h3>
                          <p className="text-gray-500 mb-6">Click "Add Station" button to create your first station</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentStations.map((station) => (
                      <tr key={station.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{station.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{station.stationName || "—"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{station.placeArea}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {station.nearbyBusStation}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{station.latitude.toFixed(14)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{station.longitude.toFixed(14)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {station.radius} m
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {filteredStations.length === 0 ? 0 : startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredStations.length)} of {filteredStations.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="text-gray-400"
                  >
                    Previous
                  </Button>
                  <div className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-medium">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages || filteredStations.length === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="text-gray-400"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <AddStationModal
          onClose={() => setShowModal(false)}
          onSave={(station) => {
            const newStations = [...stations, station]
            setStations(newStations)
            localStorage.setItem("stations", JSON.stringify(newStations))
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}
