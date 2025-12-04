"use client"

import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProjects } from "@/lib/context/project-context"
import { Ruler, FileText, CheckSquare, Palette, Calculator, Sun, Clock, MapPin } from "lucide-react"
import Link from "next/link"

const modules = [
  {
    title: "Levantamientos",
    description: "Gestiona levantamientos arquitectónicos con mediciones y croquis",
    href: "/field/levantamientos",
    icon: <Ruler className="h-5 w-5" />,
    group: "Field",
  },
  {
    title: "Planos",
    description: "Sube y anota planos de tus proyectos",
    href: "/field/planos",
    icon: <FileText className="h-5 w-5" />,
    group: "Field",
  },
  {
    title: "Checklists",
    description: "Listas de verificación para inspecciones de obra",
    href: "/field/checklists",
    icon: <CheckSquare className="h-5 w-5" />,
    group: "Field",
  },
  {
    title: "Moodboards",
    description: "Crea tableros de inspiración para tus proyectos",
    href: "/studio/moodboards",
    icon: <Palette className="h-5 w-5" />,
    group: "Studio",
  },
  {
    title: "Calculadoras",
    description: "Herramientas de cálculo para área, materiales y más",
    href: "/studio/calculadoras",
    icon: <Calculator className="h-5 w-5" />,
    group: "Studio",
  },
  {
    title: "SunPath",
    description: "Análisis de trayectoria solar para diseño bioclimático",
    href: "/design/sunpath",
    icon: <Sun className="h-5 w-5" />,
    group: "Design",
  },
]

export default function DashboardPage() {
  const { projects } = useProjects()

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)

  const statusColors = {
    activo: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pausado: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    completado: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  }

  return (
    <AppShell title="Dashboard">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Bienvenida, Nicole" description="Tu suite de herramientas de arquitectura" />

        {/* Quick Access Modules */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Herramientas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <SectionCard
                key={module.href}
                title={module.title}
                description={module.description}
                href={module.href}
                icon={module.icon}
                badge={module.group}
              />
            ))}
          </div>
        </section>

        {/* Recent Projects */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Proyectos Recientes</h2>
            <Link href="/field/levantamientos" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-medium">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {project.type} • {project.clientName}
                      </p>
                    </div>
                    <Badge variant="secondary" className={statusColors[project.status]}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {project.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {project.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(project.updatedAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
