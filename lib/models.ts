// ============================================
// CORE DOMAIN MODELS - Nicole Architect PWA
// ============================================

export type ProjectType = "Casa" | "Apartamento" | "Oficina" | "Comercial" | "Remodelación" | "Otro"

export interface Project {
  id: string
  name: string
  type: ProjectType
  clientName?: string
  location?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  status: "activo" | "pausado" | "completado"
  imageUrl?: string
}

export interface Space {
  id: string
  projectId: string
  name: string
  area?: number // m²
  perimeter?: number // m
  height?: number // m
  notes?: string
  createdAt: Date
}

export interface Measurement {
  id: string
  spaceId: string
  projectId: string
  label: string
  value: number
  unit: "m" | "cm" | "mm" | "m²" | "m³"
  description?: string
  createdAt: Date
}

export interface Photo {
  id: string
  projectId: string
  spaceId?: string
  url: string
  caption?: string
  createdAt: Date
}

export interface Sketch {
  id: string
  projectId: string
  spaceId?: string
  dataUrl: string // Base64 canvas data
  createdAt: Date
}

// Planos Module
export type PlanStatus = "nuevo" | "con_anotaciones" | "revisado" | "aprobado"

export interface Plan {
  id: string
  projectId: string
  name: string
  fileUrl: string
  status: PlanStatus
  createdAt: Date
  updatedAt: Date
}

export interface PlanAnnotation {
  id: string
  planId: string
  type: "text" | "arrow" | "highlight" | "marker"
  content?: string
  x: number
  y: number
  color: string
  author: string
  createdAt: Date
}

// Checklists Module
export type ChecklistCategory = "estructura" | "acabados" | "instalaciones" | "exterior" | "general"
export type ChecklistItemStatus = "pendiente" | "en_proceso" | "listo"

export interface ChecklistTemplate {
  id: string
  name: string
  category: ChecklistCategory
  items: ChecklistTemplateItem[]
}

export interface ChecklistTemplateItem {
  id: string
  title: string
  description?: string
}

export interface ChecklistItem {
  id: string
  projectId: string
  templateItemId: string
  category: ChecklistCategory
  title: string
  status: ChecklistItemStatus
  note?: string
  completedAt?: Date
  createdAt: Date
}

// Moodboards Module
export interface MoodboardImage {
  id: string
  url: string
  caption?: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export interface Moodboard {
  id: string
  projectId: string
  name: string
  description?: string
  images: MoodboardImage[]
  colorPalette: ColorSwatch[]
  createdAt: Date
  updatedAt: Date
}

export interface ColorSwatch {
  id: string
  hex: string
  name?: string
}

// Calculadoras Module
export type CalculationType = "area" | "perimeter" | "slope" | "paint" | "concrete" | "mortar"

export interface CalculationResult {
  id: string
  type: CalculationType
  inputs: Record<string, number>
  results: Record<string, number | string>
  createdAt: Date
}

// SunPath Module
export interface SunPathData {
  hour: number
  altitude: number // degrees
  azimuth: number // degrees
  intensity: "baja" | "media" | "alta"
}

export interface SunPathAnalysis {
  id: string
  projectId?: string
  city: string
  date: Date
  latitude: number
  longitude: number
  data: SunPathData[]
  createdAt: Date
}
