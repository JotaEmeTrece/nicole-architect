"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { useProjects } from "@/lib/context/project-context"
import { useLevantamientos } from "@/lib/hooks/use-levantamientos"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Plus, FileDown, Ruler, Camera, PenTool, MapPin, SquareIcon, Trash2, Search } from "lucide-react"
import type { ProjectType } from "@/lib/models"

export default function LevantamientosPage() {
  const { projects, activeProject, setActiveProject, addProject } = useProjects()
  const { spaces, measurements, photos, loading, addSpace, addMeasurement, totalArea } = useLevantamientos(
    activeProject?.id || null,
  )
  const { toast } = useToast()

  const [newProjectOpen, setNewProjectOpen] = useState(false)
  const [newSpaceOpen, setNewSpaceOpen] = useState(false)
  const [newMeasurementOpen, setNewMeasurementOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // New project form state
  const [projectForm, setProjectForm] = useState({
    name: "",
    type: "Casa" as ProjectType,
    clientName: "",
    location: "",
    description: "",
  })

  // New space form state
  const [spaceForm, setSpaceForm] = useState({
    name: "",
    area: "",
    height: "",
    notes: "",
  })

  // New measurement form state
  const [measurementForm, setMeasurementForm] = useState({
    spaceId: "",
    label: "",
    value: "",
    unit: "m" as const,
    description: "",
  })

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateProject = async () => {
    if (!projectForm.name.trim()) {
      toast({ title: "Error", description: "El nombre del proyecto es requerido", variant: "destructive" })
      return
    }

    const newProject = await addProject({
      ...projectForm,
      status: "activo",
    })

    setActiveProject(newProject)
    setNewProjectOpen(false)
    setProjectForm({ name: "", type: "Casa", clientName: "", location: "", description: "" })
    toast({ title: "Proyecto creado", description: `${newProject.name} ha sido creado exitosamente` })
  }

  const handleCreateSpace = async () => {
    if (!activeProject || !spaceForm.name.trim()) return

    await addSpace({
      projectId: activeProject.id,
      name: spaceForm.name,
      area: spaceForm.area ? Number.parseFloat(spaceForm.area) : undefined,
      height: spaceForm.height ? Number.parseFloat(spaceForm.height) : undefined,
      notes: spaceForm.notes || undefined,
    })

    setNewSpaceOpen(false)
    setSpaceForm({ name: "", area: "", height: "", notes: "" })
    toast({ title: "Ambiente creado", description: `${spaceForm.name} ha sido agregado` })
  }

  const handleCreateMeasurement = async () => {
    if (!activeProject || !measurementForm.label || !measurementForm.value) return

    await addMeasurement({
      projectId: activeProject.id,
      spaceId: measurementForm.spaceId,
      label: measurementForm.label,
      value: Number.parseFloat(measurementForm.value),
      unit: measurementForm.unit,
      description: measurementForm.description || undefined,
    })

    setNewMeasurementOpen(false)
    setMeasurementForm({ spaceId: "", label: "", value: "", unit: "m", description: "" })
    toast({ title: "Medición agregada", description: "La medición ha sido guardada" })
  }

  const handleExportPDF = () => {
    // TODO: Integrar con jsPDF para exportación real
    toast({
      title: "Demo",
      description: "La exportación a PDF estará disponible en la versión completa",
    })
  }

  const statusColors = {
    activo: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pausado: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    completado: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  }

  return (
    <AppShell title="Levantamientos">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Levantamientos"
          description="Gestiona levantamientos arquitectónicos de tus proyectos"
          actions={
            <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Proyecto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuevo Proyecto</DialogTitle>
                  <DialogDescription>Crea un nuevo proyecto para comenzar el levantamiento</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del proyecto *</Label>
                    <Input
                      id="name"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      placeholder="Ej: Casa Martínez"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={projectForm.type}
                        onValueChange={(value) => setProjectForm({ ...projectForm, type: value as ProjectType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Apartamento">Apartamento</SelectItem>
                          <SelectItem value="Oficina">Oficina</SelectItem>
                          <SelectItem value="Comercial">Comercial</SelectItem>
                          <SelectItem value="Remodelación">Remodelación</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="client">Cliente</Label>
                      <Input
                        id="client"
                        value={projectForm.clientName}
                        onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                        placeholder="Nombre del cliente"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={projectForm.location}
                      onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                      placeholder="Dirección o zona"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="Breve descripción del proyecto"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewProjectOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateProject}>Crear Proyecto</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects List - Left Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Proyectos</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar proyecto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
                  {filteredProjects.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No hay proyectos</div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredProjects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => setActiveProject(project)}
                          className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                            activeProject?.id === project.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm truncate">{project.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {project.type} • {project.clientName || "Sin cliente"}
                              </p>
                            </div>
                            <Badge variant="secondary" className={`text-[10px] ${statusColors[project.status]}`}>
                              {project.status}
                            </Badge>
                          </div>
                          {project.location && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {project.location}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Detail - Right Panel */}
          <div className="lg:col-span-2">
            {!activeProject ? (
              <Card>
                <CardContent>
                  <EmptyState
                    icon={<Ruler className="h-8 w-8" />}
                    title="Selecciona un proyecto"
                    description="Elige un proyecto de la lista o crea uno nuevo para comenzar el levantamiento"
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{activeProject.name}</CardTitle>
                      <CardDescription>
                        {activeProject.type} • {activeProject.clientName}
                        {activeProject.location && ` • ${activeProject.location}`}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExportPDF}>
                      <FileDown className="h-4 w-4 mr-2" />
                      Exportar PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="resumen" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
                      <TabsTrigger
                        value="resumen"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                      >
                        Resumen
                      </TabsTrigger>
                      <TabsTrigger
                        value="mediciones"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                      >
                        Mediciones
                      </TabsTrigger>
                      <TabsTrigger
                        value="croquis"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                      >
                        Croquis
                      </TabsTrigger>
                      <TabsTrigger
                        value="fotos"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                      >
                        Fotos
                      </TabsTrigger>
                    </TabsList>

                    {/* Resumen Tab */}
                    <TabsContent value="resumen" className="p-4 mt-0">
                      <div className="space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-semibold">{spaces.length}</p>
                            <p className="text-xs text-muted-foreground">Ambientes</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-semibold">{totalArea.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">m² totales</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-semibold">{measurements.length}</p>
                            <p className="text-xs text-muted-foreground">Mediciones</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-semibold">{photos.length}</p>
                            <p className="text-xs text-muted-foreground">Fotos</p>
                          </div>
                        </div>

                        {/* Spaces Grid */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium">Ambientes</h3>
                            <Dialog open={newSpaceOpen} onOpenChange={setNewSpaceOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-3 w-3 mr-1" />
                                  Agregar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Nuevo Ambiente</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label>Nombre *</Label>
                                    <Input
                                      value={spaceForm.name}
                                      onChange={(e) => setSpaceForm({ ...spaceForm, name: e.target.value })}
                                      placeholder="Ej: Sala Principal"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                      <Label>Área (m²)</Label>
                                      <Input
                                        type="number"
                                        value={spaceForm.area}
                                        onChange={(e) => setSpaceForm({ ...spaceForm, area: e.target.value })}
                                        placeholder="0.00"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Altura (m)</Label>
                                      <Input
                                        type="number"
                                        value={spaceForm.height}
                                        onChange={(e) => setSpaceForm({ ...spaceForm, height: e.target.value })}
                                        placeholder="2.80"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>Notas</Label>
                                    <Textarea
                                      value={spaceForm.notes}
                                      onChange={(e) => setSpaceForm({ ...spaceForm, notes: e.target.value })}
                                      placeholder="Observaciones..."
                                      rows={2}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={handleCreateSpace}>Agregar Ambiente</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>

                          {spaces.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                              No hay ambientes registrados
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {spaces.map((space) => (
                                <div
                                  key={space.id}
                                  className="border rounded-lg p-4 hover:border-primary/30 transition-colors"
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-medium text-sm">{space.name}</p>
                                      {space.notes && (
                                        <p className="text-xs text-muted-foreground mt-0.5">{space.notes}</p>
                                      )}
                                    </div>
                                    <SquareIcon className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                                    {space.area && <span>{space.area} m²</span>}
                                    {space.height && <span>h: {space.height}m</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Mediciones Tab */}
                    <TabsContent value="mediciones" className="p-4 mt-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">Mediciones del Proyecto</h3>
                        <Dialog open={newMeasurementOpen} onOpenChange={setNewMeasurementOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="h-3 w-3 mr-1" />
                              Añadir medición
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Nueva Medición</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label>Ambiente</Label>
                                <Select
                                  value={measurementForm.spaceId}
                                  onValueChange={(value) => setMeasurementForm({ ...measurementForm, spaceId: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar ambiente" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {spaces.map((space) => (
                                      <SelectItem key={space.id} value={space.id}>
                                        {space.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label>Descripción *</Label>
                                <Input
                                  value={measurementForm.label}
                                  onChange={(e) => setMeasurementForm({ ...measurementForm, label: e.target.value })}
                                  placeholder="Ej: Largo pared norte"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label>Valor *</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={measurementForm.value}
                                    onChange={(e) => setMeasurementForm({ ...measurementForm, value: e.target.value })}
                                    placeholder="0.00"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Unidad</Label>
                                  <Select
                                    value={measurementForm.unit}
                                    onValueChange={(value: "m" | "cm" | "mm" | "m²" | "m³") =>
                                      setMeasurementForm({ ...measurementForm, unit: value })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="m">metros</SelectItem>
                                      <SelectItem value="cm">centímetros</SelectItem>
                                      <SelectItem value="mm">milímetros</SelectItem>
                                      <SelectItem value="m²">m²</SelectItem>
                                      <SelectItem value="m³">m³</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleCreateMeasurement}>Guardar</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {measurements.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                          No hay mediciones registradas
                        </div>
                      ) : (
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Ambiente</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                <TableHead className="text-right">Unidad</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {measurements.map((m) => {
                                const space = spaces.find((s) => s.id === m.spaceId)
                                return (
                                  <TableRow key={m.id}>
                                    <TableCell className="font-medium">{space?.name || "General"}</TableCell>
                                    <TableCell>{m.label}</TableCell>
                                    <TableCell className="text-right font-mono">{m.value.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">{m.unit}</TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>

                    {/* Croquis Tab */}
                    <TabsContent value="croquis" className="p-4 mt-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">Croquis</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Limpiar
                          </Button>
                          <Button size="sm">
                            <PenTool className="h-3 w-3 mr-1" />
                            Guardar
                          </Button>
                        </div>
                      </div>

                      {/* Canvas placeholder */}
                      <div className="border-2 border-dashed border-border rounded-lg aspect-video flex items-center justify-center bg-muted/30">
                        <div className="text-center text-muted-foreground">
                          <PenTool className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm font-medium">Área de dibujo</p>
                          <p className="text-xs mt-1">
                            {/* TODO: Integrar canvas de dibujo real */}
                            Canvas para croquis - próximamente
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Fotos Tab */}
                    <TabsContent value="fotos" className="p-4 mt-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">Fotos ({photos.length})</h3>
                        <Button variant="outline" size="sm">
                          <Camera className="h-3 w-3 mr-1" />
                          Agregar foto
                        </Button>
                      </div>

                      {photos.length === 0 ? (
                        <div className="border-2 border-dashed border-border rounded-lg py-16 text-center">
                          <Camera className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                          <p className="text-sm text-muted-foreground">No hay fotos</p>
                          <p className="text-xs text-muted-foreground mt-1">Agrega fotos del levantamiento</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {photos.map((photo) => (
                            <div
                              key={photo.id}
                              className="relative group aspect-square rounded-lg overflow-hidden border"
                            >
                              <img
                                src={photo.url || "/placeholder.svg"}
                                alt={photo.caption || "Foto del proyecto"}
                                className="w-full h-full object-cover"
                              />
                              {photo.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                  <p className="text-xs text-white truncate">{photo.caption}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </AppShell>
  )
}
