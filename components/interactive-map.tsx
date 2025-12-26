"use client"

import { useRef, useEffect } from "react"

interface InteractiveMapProps {
  latitude: number
  longitude: number
  radius: number
  onLocationChange: (lat: number, lng: number) => void
}

export default function InteractiveMap({ latitude, longitude, radius, onLocationChange }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const circleRef = useRef<any>(null)
  const onLocationChangeRef = useRef(onLocationChange)

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange
  }, [onLocationChange])

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    const loadLeaflet = async () => {
      // Load CSS from CDN
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link")
        link.id = "leaflet-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        link.crossOrigin = ""
        document.head.appendChild(link)
      }

      // Load JS from CDN
      if (!(window as any).L) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        script.crossOrigin = ""
        document.body.appendChild(script)

        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      const L = (window as any).L
      if (!L) return

      // Initialize map
      if (!leafletMapRef.current) {
        leafletMapRef.current = L.map(mapRef.current).setView([latitude, longitude], 13)

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(leafletMapRef.current)

        // Custom marker icon
        const markerIcon = L.icon({
          iconUrl: "/leaflet/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })

        // Add draggable marker
        markerRef.current = L.marker([latitude, longitude], {
          draggable: true,
          icon: markerIcon,
        }).addTo(leafletMapRef.current)

        // Add radius circle
        circleRef.current = L.circle([latitude, longitude], {
          radius: radius,
          color: "#2563eb",
          fillColor: "#60a5fa",
          fillOpacity: 0.2,
          weight: 2,
        }).addTo(leafletMapRef.current)

        // Handle marker drag
        markerRef.current.on("dragend", () => {
          const position = markerRef.current.getLatLng()
          circleRef.current.setLatLng(position)
          onLocationChangeRef.current(position.lat, position.lng)
        })

        // Handle map click
        leafletMapRef.current.on("click", (e: any) => {
          const { lat, lng } = e.latlng
          markerRef.current.setLatLng([lat, lng])
          circleRef.current.setLatLng([lat, lng])
          onLocationChangeRef.current(lat, lng)
        })
      }
    }

    loadLeaflet()

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (markerRef.current && circleRef.current) {
      markerRef.current.setLatLng([latitude, longitude])
      circleRef.current.setLatLng([latitude, longitude])
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([latitude, longitude], leafletMapRef.current.getZoom())
      }
    }
  }, [latitude, longitude])

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(radius)
    }
  }, [radius])

  return (
    <div className="relative">
      <p className="text-sm text-gray-600 mb-2">Click on the map or drag the marker to set station location</p>
      <div ref={mapRef} className="w-full h-[400px] rounded-lg border-2 border-gray-300 z-0" />
    </div>
  )
}
