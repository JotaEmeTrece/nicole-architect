"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { useProjects } from "@/lib/context/project-context"
import { useMoodboards } from "@/lib/hooks/use-moodboards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Palette, Plus, FileDown, Upload, ArrowLeft, Grid, ImageIcon, X } from "lucide-react"
import type { Moodboard } from "@/lib/models"

export default function MoodboardsPage() {
  const { projects, activeProject, setActiveProject } = useProjects()
  const { moodboards, createMoodboard, addColor } = useMoodboards(null) // Get all moodboards
  const { toast } = useToast()

  const [selectedMoodboard, setSelectedMoodboard] = useState<Moodboard | null>(null)
  const [newMoodboardOpen, setNewMoodboardOpen] = useState(false)
  const [newColorOpen, setNewColorOpen] = useState(false)

  const [moodboardForm, setMoodboardForm] = useState({
    name: "",
    projectId: "",
    description: "",
  })

  const [colorForm, setColorForm] = useState({
    hex: "#3B82F6",
    name: "",
  })

  const handleCreateMoodboard = async () => {
    if (!moodboardForm.name.trim() || !moodboardForm.projectId) {
      toast({
        title: "Error",
        description: "Nombre y proyecto son requeridos",
        variant: "destructive",
      })
      return
    }

    const newMoodboard = await createMoodboard({
      name: moodboardForm.name,
      projectId: moodboardForm.projectId,
      description: moodboardForm.description || undefined,
    })

    setNewMoodboardOpen(false)
    setMoodboardForm({ name: "", projectId: "", description: "" })
    setSelectedMoodboard(newMoodboard)
    toast({ title: "Moodboard creado", description: `${newMoodboard.name} ha sido creado` })
  }

  const handleAddColor = async () => {
    if (!selectedMoodboard || !colorForm.hex) return

    await addColor(selectedMoodboard.id, {
      hex: colorForm.hex,
      name: colorForm.name || undefined,
    })

    setNewColorOpen(false)
    setColorForm({ hex: "#3B82F6", name: "" })
    toast({ title: "Color agregado" })
  }

  const handleExport = () => {
    toast({
      title: "Demo",
      description: "La exportación estará disponible en la versión completa",
    })
  }

  // Grid view (all moodboards)
  if (!selectedMoodboard) {
    return (
      <AppShell title="Moodboards">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Moodboards"
            description="Crea tableros de inspiración para tus proyectos"
            actions={
              <Dialog open={newMoodboardOpen} onOpenChange={setNewMoodboardOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Moodboard
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo Moodboard</DialogTitle>
                    <DialogDescription>Crea un tablero de inspiración para tu proyecto</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Nombre *</Label>
                      <Input
                        value={moodboardForm.name}
                        onChange={(e) => setMoodboardForm({ ...moodboardForm, name: e.target.value })}
                        placeholder="Ej: Concepto Sala - Minimalista"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Proyecto *</Label>
                      <Select
                        value={moodboardForm.projectId}
                        onValueChange={(value) => setMoodboardForm({ ...moodboardForm, projectId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar proyecto" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Descripción</Label>
                      <Textarea
                        value={moodboardForm.description}
                        onChange={(e) => setMoodboardForm({ ...moodboardForm, description: e.target.value })}
                        placeholder="Describe el concepto..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewMoodboardOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateMoodboard}>Crear</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
          />

          {moodboards.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState
                  icon={<Palette className="h-8 w-8" />}
                  title="Sin moodboards"
                  description="Crea tu primer moodboard para comenzar a recopilar inspiración"
                  action={
                    <Button onClick={() => setNewMoodboardOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear moodboard
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {moodboards.map((moodboard) => {
                const project = projects.find((p) => p.id === moodboard.projectId)
                return (
                  <Card
                    key={moodboard.id}
                    className="group cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                    onClick={() => setSelectedMoodboard(moodboard)}
                  >
                    {/* Preview Images */}
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {moodboard.images.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Grid className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-1 h-full p-1">
                          {moodboard.images.slice(0, 4).map((img, idx) => (
                            <div
                              key={img.id}
                              className={`bg-muted rounded overflow-hidden ${
                                idx === 0 && moodboard.images.length === 1 ? "col-span-2 row-span-2" : ""
                              }`}
                            >
                              <img
                                src={img.url || "/placeholder.svg"}
                                alt={img.caption || ""}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Color palette preview */}
                      {moodboard.colorPalette.length > 0 && (
                        <div className="absolute bottom-2 right-2 flex gap-0.5">
                          {moodboard.colorPalette.slice(0, 5).map((color) => (
                            <div
                              key={color.id}
                              className="h-4 w-4 rounded-full border border-white/50 shadow-sm"
                              style={{ backgroundColor: color.hex }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {moodboard.name}
                      </CardTitle>
                      {project && <p className="text-xs text-muted-foreground">{project.name}</p>}
                    </CardHeader>
                    {moodboard.description && (
                      <CardContent className="pt-0 pb-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{moodboard.description}</p>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
        <Toaster />
      </AppShell>
    )
  }

  // Detail view (selected moodboard)
  const project = projects.find((p) => p.id === selectedMoodboard.projectId)

  return (
    <AppShell title={selectedMoodboard.name}>
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title={selectedMoodboard.name}
          description={project?.name}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedMoodboard(null)}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-1" />
                Exportar
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Images Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Imágenes</CardTitle>
                  <Button variant="outline" size="sm">
                    <Upload className="h-3 w-3 mr-1" />
                    Añadir
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-2 gap-2 p-4">
                    {/* Upload zone */}
                    <div className="col-span-2 border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <ImageIcon className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Arrastra imágenes</p>
                    </div>

                    {/* Available images (mock thumbnails) */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg overflow-hidden border hover:ring-2 ring-primary cursor-pointer transition-all"
                      >
                        <img
                          src={`/interior-design-inspiration.png?height=100&width=100&query=interior design inspiration ${i}`}
                          alt={`Inspiración ${i}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Moodboard Canvas */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardContent className="p-4">
                {selectedMoodboard.images.length === 0 ? (
                  <div className="aspect-[16/10] border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Grid className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium">Moodboard vacío</p>
                      <p className="text-xs mt-1">Arrastra imágenes del panel izquierdo</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 auto-rows-[150px]">
                    {selectedMoodboard.images.map((img, idx) => (
                      <div
                        key={img.id}
                        className={`relative group rounded-lg overflow-hidden ${
                          idx === 0 ? "col-span-2 row-span-2" : ""
                        }`}
                      >
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={img.caption || ""}
                          className="w-full h-full object-cover"
                        />
                        <button className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <X className="h-3 w-3" />
                        </button>
                        {img.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-xs text-white">{img.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Color Palette */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Paleta de Colores</CardTitle>
                  <Dialog open={newColorOpen} onOpenChange={setNewColorOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3 mr-1" />
                        Añadir color
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Añadir Color</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={colorForm.hex}
                              onChange={(e) => setColorForm({ ...colorForm, hex: e.target.value })}
                              className="h-10 w-20 rounded border cursor-pointer"
                            />
                            <Input
                              value={colorForm.hex}
                              onChange={(e) => setColorForm({ ...colorForm, hex: e.target.value })}
                              placeholder="#000000"
                              className="font-mono"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Nombre (opcional)</Label>
                          <Input
                            value={colorForm.name}
                            onChange={(e) => setColorForm({ ...colorForm, name: e.target.value })}
                            placeholder="Ej: Azul petróleo"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddColor}>Añadir</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {selectedMoodboard.colorPalette.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">No hay colores en la paleta</div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {selectedMoodboard.colorPalette.map((color) => (
                      <div key={color.id} className="flex flex-col items-center gap-1">
                        <div className="h-12 w-12 rounded-lg border shadow-sm" style={{ backgroundColor: color.hex }} />
                        <span className="text-[10px] font-mono text-muted-foreground">{color.hex}</span>
                        {color.name && <span className="text-[10px] text-muted-foreground">{color.name}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </AppShell>
  )
}
