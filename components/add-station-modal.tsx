"use client"

import { useState } from "react"
import { X, MapPin, Building2 } from "lucide-react"
import InteractiveMap from "@/components/interactive-map"
import { Button } from "@/components/ui/button"

interface AddStationModalProps {
  onClose: () => void
  onSave: (station: {
    id: number
    stationName: string
    placeArea: string
    nearbyBusStation: string
    latitude: number
    longitude: number
    radius: number
  }) => void
}

export default function AddStationModal({ onClose, onSave }: AddStationModalProps) {
  const [formData, setFormData] = useState({
    stationName: "",
    placeArea: "",
    nearbyBusStation: "Not Available",
    latitude: 18.52,
    longitude: 73.85,
    radius: 100,
  })

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      stationName: `Station at ${lat.toFixed(2)}, ${lng.toFixed(2)}`,
    }))
  }

  const handleRadiusChange = (radius: number) => {
    setFormData((prev) => ({ ...prev, radius }))
  }

  const handleSave = () => {
    if (!formData.stationName) {
      alert("Please select a location on the map")
      return
    }

    const newStation = {
      id: Date.now(),
      ...formData,
    }

    onSave(newStation)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center gap-3 text-white">
            <MapPin className="w-6 h-6" />
            <h3 className="text-xl font-bold">Add New Station</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Form */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  Station Name
                </label>
                <input
                  type="text"
                  value={formData.stationName}
                  onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                  placeholder="Will be auto-populated from map"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Radius (meters)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={formData.radius}
                    onChange={(e) => handleRadiusChange(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium min-w-[80px] text-center">
                    {formData.radius}m
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>20m</span>
                  <span>500m</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latitude:</span>
                    <span className="font-mono text-blue-900">{formData.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longitude:</span>
                    <span className="font-mono text-blue-900">{formData.longitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">City / Area:</span>
                    <input
                      type="text"
                      value={formData.placeArea}
                      onChange={(e) => setFormData({ ...formData, placeArea: e.target.value })}
                      placeholder="Enter city or area"
                      className="px-2 py-1 border border-gray-300 rounded text-xs w-40"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nearby Station:</span>
                    <input
                      type="text"
                      value={formData.nearbyBusStation}
                      onChange={(e) => setFormData({ ...formData, nearbyBusStation: e.target.value })}
                      placeholder="Enter nearby station"
                      className="px-2 py-1 border border-gray-300 rounded text-xs w-40"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>Tip:</strong> Click on the map or drag the marker to set station location
                </p>
              </div>
            </div>

            {/* Right Side - Map */}
            <div className="lg:col-span-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Select Location on Map
              </label>
              <p className="text-xs text-gray-500 mb-3">Click on the map or drag the marker to set station location</p>
              <div className="border-2 border-blue-200 rounded-lg overflow-hidden">
                <InteractiveMap
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  radius={formData.radius}
                  onLocationChange={handleLocationChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-blue-500 hover:bg-blue-600">
            <MapPin className="w-4 h-4 mr-2" />
            Save Station
          </Button>
        </div>
      </div>
    </div>
  )
}
