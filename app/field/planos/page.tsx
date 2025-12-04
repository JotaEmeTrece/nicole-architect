"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { useProjects } from "@/lib/context/project-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProjectSelector } from "@/components/shared/project-selector"
import { mockPlans, mockAnnotations } from "@/lib/mock-data"
import {
  FileText,
  Upload,
  MousePointer,
  Type,
  ArrowRight,
  Highlighter,
  Palette,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Clock,
  User,
} from "lucide-react"
import type { Plan } from "@/lib/models"

const tools = [
  { id: "pointer", icon: <MousePointer className="h-4 w-4" />, label: "Puntero" },
  { id: "text", icon: <Type className="h-4 w-4" />, label: "Texto" },
  { id: "arrow", icon: <ArrowRight className="h-4 w-4" />, label: "Flecha" },
  { id: "highlight", icon: <Highlighter className="h-4 w-4" />, label: "Resaltador" },
]

const colors = ["#dc2626", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#1a1a1a"]

export default function PlanosPage() {
  const { activeProject } = useProjects()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [activeTool, setActiveTool] = useState("pointer")
  const [activeColor, setActiveColor] = useState("#dc2626")

  const plans = activeProject ? mockPlans.filter((p) => p.projectId === activeProject.id) : mockPlans

  const annotations = selectedPlan ? mockAnnotations.filter((a) => a.planId === selectedPlan.id) : []

  const statusLabels = {
    nuevo: "Nuevo",
    con_anotaciones: "Con anotaciones",
    revisado: "Revisado",
    aprobado: "Aprobado",
  }

  const statusColors = {
    nuevo: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    con_anotaciones: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    revisado: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    aprobado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  }

  return (
    <AppShell title="Planos" showProjectSelector>
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Planos"
          description="Sube y anota planos de tus proyectos"
          actions={
            <div className="flex items-center gap-2">
              <ProjectSelector />
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Plans List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Planos</CardTitle>
                  <Button variant="outline" size="sm">
                    <Upload className="h-3 w-3 mr-1" />
                    Subir
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Drop zone */}
                <div className="mx-4 mb-4 border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Arrastra archivos aquí</p>
                </div>

                <Separator />

                {/* Plans list */}
                <ScrollArea className="h-[400px]">
                  {plans.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No hay planos cargados</div>
                  ) : (
                    <div className="divide-y divide-border">
                      {plans.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan)}
                          className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                            selectedPlan?.id === plan.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{plan.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className={`text-[10px] ${statusColors[plan.status]}`}>
                                  {statusLabels[plan.status]}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(plan.updatedAt).toLocaleDateString("es-MX")}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Plan Viewer */}
          <div className="lg:col-span-3">
            {!selectedPlan ? (
              <Card>
                <CardContent>
                  <EmptyState
                    icon={<FileText className="h-8 w-8" />}
                    title="Selecciona un plano"
                    description="Elige un plano de la lista para verlo y agregar anotaciones"
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Toolbar */}
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-1">
                        {tools.map((tool) => (
                          <Button
                            key={tool.id}
                            variant={activeTool === tool.id ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setActiveTool(tool.id)}
                            title={tool.label}
                          >
                            {tool.icon}
                          </Button>
                        ))}

                        <Separator orientation="vertical" className="h-6 mx-2" />

                        <div className="flex items-center gap-1">
                          <Palette className="h-4 w-4 text-muted-foreground mr-1" />
                          {colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setActiveColor(color)}
                              className={`h-5 w-5 rounded-full border-2 transition-all ${
                                activeColor === color ? "border-foreground scale-110" : "border-transparent"
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground w-12 text-center">100%</span>
                        <Button variant="ghost" size="sm">
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" className="h-6 mx-2" />
                        <Button variant="ghost" size="sm">
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                  {/* Plan Image Area */}
                  <div className="xl:col-span-3">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3] bg-muted/30">
                          <img
                            src={selectedPlan.fileUrl || "/placeholder.svg"}
                            alt={selectedPlan.name}
                            className="w-full h-full object-contain"
                          />
                          {/* TODO: Implementar capa de anotaciones interactiva */}
                          <div className="absolute inset-0 cursor-crosshair" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Annotations Panel */}
                  <div className="xl:col-span-1">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Anotaciones ({annotations.length})</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[300px]">
                          {annotations.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">Sin anotaciones</div>
                          ) : (
                            <div className="divide-y divide-border">
                              {annotations.map((annotation) => (
                                <div key={annotation.id} className="p-3">
                                  <div className="flex items-start gap-2">
                                    <div
                                      className="h-3 w-3 rounded-full mt-1 flex-shrink-0"
                                      style={{ backgroundColor: annotation.color }}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm">{annotation.content || annotation.type}</p>
                                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          {annotation.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {new Date(annotation.createdAt).toLocaleDateString("es-MX")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
