"use client"

import { useState, useCallback, useEffect } from "react"
import type { ChecklistItem, ChecklistItemStatus, ChecklistCategory } from "@/lib/models"
import { mockChecklistItems, mockChecklistTemplates } from "@/lib/mock-data"

export function useChecklists(projectId: string | null) {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(false)
  const templates = mockChecklistTemplates

  useEffect(() => {
    if (!projectId) {
      setItems([])
      return
    }

    setLoading(true)
    // TODO: Conectar con API real
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setItems(mockChecklistItems.filter((c) => c.projectId === projectId))
      setLoading(false)
    }
    fetchData()
  }, [projectId])

  const updateItemStatus = useCallback(async (itemId: string, status: ChecklistItemStatus, note?: string) => {
    // TODO: Conectar con API real
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status,
              note: note ?? item.note,
              completedAt: status === "listo" ? new Date() : undefined,
            }
          : item,
      ),
    )
  }, [])

  const addItem = useCallback(async (itemData: Omit<ChecklistItem, "id" | "createdAt">) => {
    // TODO: Conectar con API real
    const newItem: ChecklistItem = {
      ...itemData,
      id: `check-${Date.now()}`,
      createdAt: new Date(),
    }
    setItems((prev) => [...prev, newItem])
    return newItem
  }, [])

  const getItemsByCategory = (category: ChecklistCategory) => items.filter((item) => item.category === category)

  const getProgress = () => {
    if (items.length === 0) return { total: 0, completed: 0, percentage: 0 }
    const completed = items.filter((item) => item.status === "listo").length
    return {
      total: items.length,
      completed,
      percentage: Math.round((completed / items.length) * 100),
    }
  }

  return {
    items,
    templates,
    loading,
    updateItemStatus,
    addItem,
    getItemsByCategory,
    getProgress,
  }
}
