"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/shared/page-header"
import { ProjectSelector } from "@/components/shared/project-selector"
import { useProjects } from "@/lib/context/project-context"
import { useChecklists } from "@/lib/hooks/use-checklists"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { CheckSquare, MoreHorizontal, MessageSquare, Plus } from "lucide-react"
import type { ChecklistCategory, ChecklistItemStatus } from "@/lib/models"

const categories: { value: ChecklistCategory; label: string }[] = [
  { value: "estructura", label: "Estructura" },
  { value: "acabados", label: "Acabados" },
  { value: "instalaciones", label: "Instalaciones" },
  { value: "exterior", label: "Exterior" },
  { value: "general", label: "General" },
]

export default function ChecklistsPage() {
  const { activeProject } = useProjects()
  const { items, templates, updateItemStatus, getItemsByCategory, getProgress, addItem } = useChecklists(
    activeProject?.id || null,
  )
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState<ChecklistCategory>("estructura")
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteValue, setNoteValue] = useState("")

  const progress = getProgress()
  const categoryItems = getItemsByCategory(activeCategory)

  const statusColors: Record<ChecklistItemStatus, string> = {
    pendiente: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    en_proceso: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    listo: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  }

  const statusLabels: Record<ChecklistItemStatus, string> = {
    pendiente: "Pendiente",
    en_proceso: "En proceso",
    listo: "Listo",
  }

  const handleStatusChange = async (itemId: string, checked: boolean) => {
    const newStatus: ChecklistItemStatus = checked ? "listo" : "pendiente"
    await updateItemStatus(itemId, newStatus)
    toast({
      title: checked ? "Completado" : "Marcado como pendiente",
      description: "El estado del item ha sido actualizado",
    })
  }

  const handleStatusSelect = async (itemId: string, status: ChecklistItemStatus) => {
    await updateItemStatus(itemId, status)
    toast({
      title: "Estado actualizado",
      description: `Cambiado a: ${statusLabels[status]}`,
    })
  }

  const handleSaveNote = async (itemId: string) => {
    await updateItemStatus(itemId, items.find((i) => i.id === itemId)?.status || "pendiente", noteValue)
    setEditingNote(null)
    setNoteValue("")
    toast({ title: "Nota guardada" })
  }

  const handleAddFromTemplate = async () => {
    if (!activeProject) return

    const template = templates.find((t) => t.category === activeCategory)
    if (!template) return

    for (const templateItem of template.items) {
      const exists = items.some((i) => i.templateItemId === templateItem.id)
      if (!exists) {
        await addItem({
          projectId: activeProject.id,
          templateItemId: templateItem.id,
          category: activeCategory,
          title: templateItem.title,
          status: "pendiente",
        })
      }
    }

    toast({
      title: "Items agregados",
      description: `Se agregaron los items de la plantilla "${template.name}"`,
    })
  }

  return (
    <AppShell title="Checklists" showProjectSelector>
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Checklists"
          description="Listas de verificación para inspecciones de obra"
          actions={
            <div className="flex items-center gap-2">
              <ProjectSelector />
            </div>
          }
        />

        {!activeProject ? (
          <Card>
            <CardContent className="py-16 text-center">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Selecciona un proyecto para ver su checklist</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progreso general</span>
                  <span className="text-sm text-muted-foreground">
                    {progress.completed} de {progress.total} completados
                  </span>
                </div>
                <Progress value={progress.percentage} className="h-2" />
              </CardContent>
            </Card>

            {/* Checklist Tabs */}
            <Card>
              <CardContent className="p-0">
                <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as ChecklistCategory)}>
                  <div className="border-b">
                    <TabsList className="w-full justify-start rounded-none bg-transparent h-auto p-0 overflow-x-auto">
                      {categories.map((cat) => (
                        <TabsTrigger
                          key={cat.value}
                          value={cat.value}
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm"
                        >
                          {cat.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {categories.map((cat) => (
                    <TabsContent key={cat.value} value={cat.value} className="mt-0">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium">Items de {cat.label}</h3>
                          <Button variant="outline" size="sm" onClick={handleAddFromTemplate}>
                            <Plus className="h-3 w-3 mr-1" />
                            Agregar de plantilla
                          </Button>
                        </div>

                        {categoryItems.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <CheckSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No hay items en esta categoría</p>
                            <p className="text-xs mt-1">Agrega items desde una plantilla</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {categoryItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                              >
                                <Checkbox
                                  checked={item.status === "listo"}
                                  onCheckedChange={(checked) => handleStatusChange(item.id, checked as boolean)}
                                  className="mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm ${
                                      item.status === "listo" ? "line-through text-muted-foreground" : ""
                                    }`}
                                  >
                                    {item.title}
                                  </p>
                                  {item.note && editingNote !== item.id && (
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3" />
                                      {item.note}
                                    </p>
                                  )}
                                  {editingNote === item.id && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <Input
                                        value={noteValue}
                                        onChange={(e) => setNoteValue(e.target.value)}
                                        placeholder="Agregar nota..."
                                        className="h-8 text-xs"
                                      />
                                      <Button size="sm" className="h-8" onClick={() => handleSaveNote(item.id)}>
                                        Guardar
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8"
                                        onClick={() => {
                                          setEditingNote(null)
                                          setNoteValue("")
                                        }}
                                      >
                                        Cancelar
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className={`text-[10px] ${statusColors[item.status]}`}>
                                    {statusLabels[item.status]}
                                  </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleStatusSelect(item.id, "pendiente")}>
                                        Marcar pendiente
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusSelect(item.id, "en_proceso")}>
                                        Marcar en proceso
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusSelect(item.id, "listo")}>
                                        Marcar listo
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setEditingNote(item.id)
                                          setNoteValue(item.note || "")
                                        }}
                                      >
                                        Agregar nota
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Toaster />
    </AppShell>
  )
}
