"use client"

import { useState, useCallback, useEffect } from "react"
import type { Space, Measurement, Photo, Sketch } from "@/lib/models"
import { mockSpaces, mockMeasurements, mockPhotos } from "@/lib/mock-data"

export function useLevantamientos(projectId: string | null) {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [sketches, setSketches] = useState<Sketch[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!projectId) {
      setSpaces([])
      setMeasurements([])
      setPhotos([])
      return
    }

    setLoading(true)
    // TODO: Conectar con API real
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 150))
      setSpaces(mockSpaces.filter((s) => s.projectId === projectId))
      setMeasurements(mockMeasurements.filter((m) => m.projectId === projectId))
      setPhotos(mockPhotos.filter((p) => p.projectId === projectId))
      setLoading(false)
    }
    fetchData()
  }, [projectId])

  const addSpace = useCallback(async (spaceData: Omit<Space, "id" | "createdAt">) => {
    // TODO: Conectar con API real
    const newSpace: Space = {
      ...spaceData,
      id: `space-${Date.now()}`,
      createdAt: new Date(),
    }
    setSpaces((prev) => [...prev, newSpace])
    return newSpace
  }, [])

  const addMeasurement = useCallback(async (measurementData: Omit<Measurement, "id" | "createdAt">) => {
    // TODO: Conectar con API real
    const newMeasurement: Measurement = {
      ...measurementData,
      id: `meas-${Date.now()}`,
      createdAt: new Date(),
    }
    setMeasurements((prev) => [...prev, newMeasurement])
    return newMeasurement
  }, [])

  const addPhoto = useCallback(async (photoData: Omit<Photo, "id" | "createdAt">) => {
    // TODO: Conectar con API real / upload de archivos
    const newPhoto: Photo = {
      ...photoData,
      id: `photo-${Date.now()}`,
      createdAt: new Date(),
    }
    setPhotos((prev) => [...prev, newPhoto])
    return newPhoto
  }, [])

  const saveSketch = useCallback(async (sketchData: Omit<Sketch, "id" | "createdAt">) => {
    // TODO: Conectar con API real / IndexedDB para almacenar canvas
    const newSketch: Sketch = {
      ...sketchData,
      id: `sketch-${Date.now()}`,
      createdAt: new Date(),
    }
    setSketches((prev) => [...prev, newSketch])
    return newSketch
  }, [])

  const deleteSpace = useCallback(async (spaceId: string) => {
    // TODO: Conectar con API real
    setSpaces((prev) => prev.filter((s) => s.id !== spaceId))
    setMeasurements((prev) => prev.filter((m) => m.spaceId !== spaceId))
  }, [])

  const deleteMeasurement = useCallback(async (measurementId: string) => {
    // TODO: Conectar con API real
    setMeasurements((prev) => prev.filter((m) => m.id !== measurementId))
  }, [])

  const totalArea = spaces.reduce((sum, space) => sum + (space.area || 0), 0)

  return {
    spaces,
    measurements,
    photos,
    sketches,
    loading,
    addSpace,
    addMeasurement,
    addPhoto,
    saveSketch,
    deleteSpace,
    deleteMeasurement,
    totalArea,
  }
}
