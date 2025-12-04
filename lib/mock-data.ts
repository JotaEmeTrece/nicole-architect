import type {
  Project,
  Space,
  Measurement,
  Photo,
  Plan,
  PlanAnnotation,
  ChecklistTemplate,
  ChecklistItem,
  Moodboard,
  SunPathData,
} from "./models"

// ============================================
// MOCK DATA - Nicole Architect PWA
// TODO: Reemplazar con datos reales de API/DB
// ============================================

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Casa Martínez",
    type: "Casa",
    clientName: "Juan Martínez",
    location: "Col. Del Valle, CDMX",
    description: "Remodelación completa de casa de 2 pisos",
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-11-20"),
    status: "activo",
    imageUrl: "/modern-house-exterior.png",
  },
  {
    id: "proj-2",
    name: "Apartamento Luna",
    type: "Apartamento",
    clientName: "María Luna",
    location: "Polanco, CDMX",
    description: "Diseño de interiores para departamento de 120m²",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-15"),
    status: "activo",
    imageUrl: "/modern-apartment.png",
  },
  {
    id: "proj-3",
    name: "Oficina Tech Solutions",
    type: "Oficina",
    clientName: "Tech Solutions SA",
    location: "Santa Fe, CDMX",
    description: "Diseño de espacio de trabajo colaborativo",
    createdAt: new Date("2024-08-20"),
    updatedAt: new Date("2024-10-30"),
    status: "completado",
    imageUrl: "/modern-office.png",
  },
  {
    id: "proj-4",
    name: "Local Café Aroma",
    type: "Comercial",
    clientName: "Café Aroma",
    location: "Roma Norte, CDMX",
    description: "Diseño de cafetería con estilo industrial",
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-28"),
    status: "activo",
    imageUrl: "/industrial-coffee-shop-interior.jpg",
  },
]

export const mockSpaces: Space[] = [
  {
    id: "space-1",
    projectId: "proj-1",
    name: "Sala Principal",
    area: 35,
    perimeter: 24,
    height: 2.8,
    notes: "Incluye chimenea existente",
    createdAt: new Date("2024-10-16"),
  },
  {
    id: "space-2",
    projectId: "proj-1",
    name: "Cocina",
    area: 18,
    perimeter: 17,
    height: 2.8,
    notes: "Conexión de gas existente",
    createdAt: new Date("2024-10-16"),
  },
  {
    id: "space-3",
    projectId: "proj-1",
    name: "Recámara Principal",
    area: 22,
    perimeter: 19,
    height: 2.8,
    notes: "Con vestidor adjunto",
    createdAt: new Date("2024-10-17"),
  },
  {
    id: "space-4",
    projectId: "proj-2",
    name: "Estancia",
    area: 45,
    perimeter: 28,
    height: 3.0,
    createdAt: new Date("2024-09-02"),
  },
  {
    id: "space-5",
    projectId: "proj-2",
    name: "Recámara 1",
    area: 16,
    perimeter: 16,
    height: 3.0,
    createdAt: new Date("2024-09-02"),
  },
]

export const mockMeasurements: Measurement[] = [
  {
    id: "meas-1",
    spaceId: "space-1",
    projectId: "proj-1",
    label: "Largo pared norte",
    value: 7.5,
    unit: "m",
    description: "Incluye ventanal",
    createdAt: new Date("2024-10-16"),
  },
  {
    id: "meas-2",
    spaceId: "space-1",
    projectId: "proj-1",
    label: "Ancho sala",
    value: 4.7,
    unit: "m",
    createdAt: new Date("2024-10-16"),
  },
  {
    id: "meas-3",
    spaceId: "space-1",
    projectId: "proj-1",
    label: "Altura chimenea",
    value: 1.8,
    unit: "m",
    createdAt: new Date("2024-10-16"),
  },
  {
    id: "meas-4",
    spaceId: "space-2",
    projectId: "proj-1",
    label: "Largo cocina",
    value: 4.5,
    unit: "m",
    createdAt: new Date("2024-10-17"),
  },
  {
    id: "meas-5",
    spaceId: "space-2",
    projectId: "proj-1",
    label: "Ancho cocina",
    value: 4.0,
    unit: "m",
    createdAt: new Date("2024-10-17"),
  },
]

export const mockPhotos: Photo[] = [
  {
    id: "photo-1",
    projectId: "proj-1",
    spaceId: "space-1",
    url: "/cozy-living-room.png",
    caption: "Vista general sala",
    createdAt: new Date("2024-10-16"),
  },
  {
    id: "photo-2",
    projectId: "proj-1",
    spaceId: "space-1",
    url: "/fireplace-detail.jpg",
    caption: "Detalle chimenea",
    createdAt: new Date("2024-10-16"),
  },
  {
    id: "photo-3",
    projectId: "proj-1",
    spaceId: "space-2",
    url: "/modern-kitchen-interior.png",
    caption: "Cocina actual",
    createdAt: new Date("2024-10-17"),
  },
]

export const mockPlans: Plan[] = [
  {
    id: "plan-1",
    projectId: "proj-1",
    name: "Planta Baja - Estado Actual",
    fileUrl: "/architectural-floor-plan.png",
    status: "con_anotaciones",
    createdAt: new Date("2024-10-18"),
    updatedAt: new Date("2024-11-10"),
  },
  {
    id: "plan-2",
    projectId: "proj-1",
    name: "Planta Alta - Estado Actual",
    fileUrl: "/second-floor-architectural-plan.jpg",
    status: "nuevo",
    createdAt: new Date("2024-10-18"),
    updatedAt: new Date("2024-10-18"),
  },
  {
    id: "plan-3",
    projectId: "proj-2",
    name: "Planta General",
    fileUrl: "/apartment-floor-plan.png",
    status: "aprobado",
    createdAt: new Date("2024-09-05"),
    updatedAt: new Date("2024-10-20"),
  },
]

export const mockAnnotations: PlanAnnotation[] = [
  {
    id: "ann-1",
    planId: "plan-1",
    type: "text",
    content: "Demoler muro",
    x: 150,
    y: 200,
    color: "#dc2626",
    author: "Nicole",
    createdAt: new Date("2024-11-10"),
  },
  {
    id: "ann-2",
    planId: "plan-1",
    type: "marker",
    content: "Punto de luz nuevo",
    x: 300,
    y: 150,
    color: "#f59e0b",
    author: "Nicole",
    createdAt: new Date("2024-11-10"),
  },
]

export const mockChecklistTemplates: ChecklistTemplate[] = [
  {
    id: "tpl-1",
    name: "Revisión Estructura",
    category: "estructura",
    items: [
      { id: "tpl-1-1", title: "Verificar estado de muros de carga", description: "Buscar grietas o daños" },
      { id: "tpl-1-2", title: "Revisar vigas y columnas", description: "Estado general y dimensiones" },
      { id: "tpl-1-3", title: "Inspeccionar cimentación visible" },
      { id: "tpl-1-4", title: "Verificar estado de losas", description: "Buscar deflexiones o grietas" },
    ],
  },
  {
    id: "tpl-2",
    name: "Acabados Interiores",
    category: "acabados",
    items: [
      { id: "tpl-2-1", title: "Estado de pintura en muros" },
      { id: "tpl-2-2", title: "Condición de pisos", description: "Material y estado actual" },
      { id: "tpl-2-3", title: "Revisión de carpintería", description: "Puertas y marcos" },
      { id: "tpl-2-4", title: "Estado de herrería", description: "Ventanas y protecciones" },
      { id: "tpl-2-5", title: "Verificar plafones y molduras" },
    ],
  },
  {
    id: "tpl-3",
    name: "Instalaciones",
    category: "instalaciones",
    items: [
      { id: "tpl-3-1", title: "Revisión instalación eléctrica", description: "Centro de carga y circuitos" },
      { id: "tpl-3-2", title: "Estado de instalación hidráulica", description: "Presión y fugas" },
      { id: "tpl-3-3", title: "Verificar instalación sanitaria", description: "Drenajes y ventilación" },
      { id: "tpl-3-4", title: "Revisar instalación de gas", description: "Si aplica" },
      { id: "tpl-3-5", title: "Estado de aire acondicionado", description: "Si existe" },
    ],
  },
]

export const mockChecklistItems: ChecklistItem[] = [
  {
    id: "check-1",
    projectId: "proj-1",
    templateItemId: "tpl-1-1",
    category: "estructura",
    title: "Verificar estado de muros de carga",
    status: "listo",
    note: "Sin daños significativos",
    completedAt: new Date("2024-10-20"),
    createdAt: new Date("2024-10-16"),
  },
  {
    id: "check-2",
    projectId: "proj-1",
    templateItemId: "tpl-1-2",
    category: "estructura",
    title: "Revisar vigas y columnas",
    status: "listo",
    createdAt: new Date("2024-10-16"),
  },
  {
    id: "check-3",
    projectId: "proj-1",
    templateItemId: "tpl-2-1",
    category: "acabados",
    title: "Estado de pintura en muros",
    status: "en_proceso",
    note: "Requiere reparación en sala",
    createdAt: new Date("2024-10-16"),
  },
  {
    id: "check-4",
    projectId: "proj-1",
    templateItemId: "tpl-2-2",
    category: "acabados",
    title: "Condición de pisos",
    status: "pendiente",
    createdAt: new Date("2024-10-16"),
  },
  {
    id: "check-5",
    projectId: "proj-1",
    templateItemId: "tpl-3-1",
    category: "instalaciones",
    title: "Revisión instalación eléctrica",
    status: "en_proceso",
    note: "Pendiente revisión segundo piso",
    createdAt: new Date("2024-10-16"),
  },
]

export const mockMoodboards: Moodboard[] = [
  {
    id: "mood-1",
    projectId: "proj-1",
    name: "Concepto Sala - Minimalista Cálido",
    description: "Paleta de tonos neutros con acentos de madera",
    images: [
      {
        id: "img-1",
        url: "/minimalist-living-room.png",
        caption: "Referencia sala",
        position: { x: 0, y: 0 },
        size: { width: 300, height: 200 },
      },
      {
        id: "img-2",
        url: "/wood-texture-warm.jpg",
        caption: "Textura madera",
        position: { x: 320, y: 0 },
        size: { width: 200, height: 200 },
      },
      {
        id: "img-3",
        url: "/modern-sofa-beige.jpg",
        caption: "Sofá referencia",
        position: { x: 0, y: 220 },
        size: { width: 250, height: 150 },
      },
    ],
    colorPalette: [
      { id: "col-1", hex: "#F5F0EB", name: "Blanco cálido" },
      { id: "col-2", hex: "#D4C4B5", name: "Arena" },
      { id: "col-3", hex: "#8B7355", name: "Madera clara" },
      { id: "col-4", hex: "#4A4A4A", name: "Gris carbón" },
      { id: "col-5", hex: "#2D5A6B", name: "Acento azul" },
    ],
    createdAt: new Date("2024-10-25"),
    updatedAt: new Date("2024-11-15"),
  },
  {
    id: "mood-2",
    projectId: "proj-4",
    name: "Concepto Café Industrial",
    description: "Estilo industrial con toques de vegetación",
    images: [
      {
        id: "img-4",
        url: "/industrial-coffee-shop.jpg",
        caption: "Ambiente general",
        position: { x: 0, y: 0 },
        size: { width: 350, height: 250 },
      },
      {
        id: "img-5",
        url: "/exposed-brick-wall.jpg",
        caption: "Ladrillo expuesto",
        position: { x: 370, y: 0 },
        size: { width: 150, height: 150 },
      },
    ],
    colorPalette: [
      { id: "col-6", hex: "#1A1A1A", name: "Negro mate" },
      { id: "col-7", hex: "#8B4513", name: "Ladrillo" },
      { id: "col-8", hex: "#2F4F4F", name: "Verde oscuro" },
      { id: "col-9", hex: "#D4AF37", name: "Latón" },
    ],
    createdAt: new Date("2024-11-05"),
    updatedAt: new Date("2024-11-20"),
  },
]

export const mockSunPathData: SunPathData[] = [
  { hour: 6, altitude: 5, azimuth: 90, intensity: "baja" },
  { hour: 7, altitude: 15, azimuth: 100, intensity: "baja" },
  { hour: 8, altitude: 28, azimuth: 110, intensity: "media" },
  { hour: 9, altitude: 40, azimuth: 125, intensity: "media" },
  { hour: 10, altitude: 52, azimuth: 145, intensity: "alta" },
  { hour: 11, altitude: 62, azimuth: 165, intensity: "alta" },
  { hour: 12, altitude: 68, azimuth: 180, intensity: "alta" },
  { hour: 13, altitude: 65, azimuth: 195, intensity: "alta" },
  { hour: 14, altitude: 58, azimuth: 215, intensity: "alta" },
  { hour: 15, altitude: 48, azimuth: 235, intensity: "media" },
  { hour: 16, altitude: 35, azimuth: 250, intensity: "media" },
  { hour: 17, altitude: 22, azimuth: 260, intensity: "baja" },
  { hour: 18, altitude: 10, azimuth: 270, intensity: "baja" },
  { hour: 19, altitude: 2, azimuth: 280, intensity: "baja" },
]

// Helper functions for mock data
// TODO: Conectar con API real
export async function getProjects(): Promise<Project[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockProjects
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return mockProjects.find((p) => p.id === id)
}

export async function getSpacesByProject(projectId: string): Promise<Space[]> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return mockSpaces.filter((s) => s.projectId === projectId)
}

export async function getMeasurementsByProject(projectId: string): Promise<Measurement[]> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return mockMeasurements.filter((m) => m.projectId === projectId)
}

export async function getPhotosByProject(projectId: string): Promise<Photo[]> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return mockPhotos.filter((p) => p.projectId === projectId)
}

export async function getPlansByProject(projectId: string): Promise<Plan[]> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return mockPlans.filter((p) => p.projectId === projectId)
}

export async function getChecklistByProject(projectId: string): Promise<ChecklistItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return mockChecklistItems.filter((c) => c.projectId === projectId)
}

export async function getMoodboardsByProject(projectId: string): Promise<Moodboard[]> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return mockMoodboards.filter((m) => m.projectId === projectId)
}
