"use client"

import { useState, useCallback, useEffect } from "react"
import type { Moodboard, MoodboardImage, ColorSwatch } from "@/lib/models"
import { mockMoodboards } from "@/lib/mock-data"

export function useMoodboards(projectId: string | null) {
  const [moodboards, setMoodboards] = useState<Moodboard[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!projectId) {
      setMoodboards(mockMoodboards)
      return
    }

    setLoading(true)
    // TODO: Conectar con API real
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setMoodboards(mockMoodboards.filter((m) => m.projectId === projectId))
      setLoading(false)
    }
    fetchData()
  }, [projectId])

  const createMoodboard = useCallback(async (data: { name: string; projectId: string; description?: string }) => {
    // TODO: Conectar con API real
    const newMoodboard: Moodboard = {
      id: `mood-${Date.now()}`,
      projectId: data.projectId,
      name: data.name,
      description: data.description,
      images: [],
      colorPalette: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setMoodboards((prev) => [...prev, newMoodboard])
    return newMoodboard
  }, [])

  const addImage = useCallback(async (moodboardId: string, image: Omit<MoodboardImage, "id">) => {
    // TODO: Conectar con API real / upload de archivos
    const newImage: MoodboardImage = {
      ...image,
      id: `img-${Date.now()}`,
    }
    setMoodboards((prev) =>
      prev.map((m) => (m.id === moodboardId ? { ...m, images: [...m.images, newImage], updatedAt: new Date() } : m)),
    )
    return newImage
  }, [])

  const addColor = useCallback(async (moodboardId: string, color: Omit<ColorSwatch, "id">) => {
    // TODO: Conectar con API real
    const newColor: ColorSwatch = {
      ...color,
      id: `col-${Date.now()}`,
    }
    setMoodboards((prev) =>
      prev.map((m) =>
        m.id === moodboardId ? { ...m, colorPalette: [...m.colorPalette, newColor], updatedAt: new Date() } : m,
      ),
    )
    return newColor
  }, [])

  const deleteMoodboard = useCallback(async (moodboardId: string) => {
    // TODO: Conectar con API real
    setMoodboards((prev) => prev.filter((m) => m.id !== moodboardId))
  }, [])

  return {
    moodboards,
    loading,
    createMoodboard,
    addImage,
    addColor,
    deleteMoodboard,
  }
}
