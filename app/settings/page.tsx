"use client"

import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/lib/context/theme-context"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { User, Bell, Palette, Database, Download, Trash2, Shield, Info } from "lucide-react"

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { toast } = useToast()

  const handleExportData = () => {
    // TODO: Implementar exportación de datos desde IndexedDB
    toast({
      title: "Demo",
      description: "La exportación de datos estará disponible en la versión completa",
    })
  }

  const handleClearCache = () => {
    // TODO: Implementar limpieza de caché del service worker
    toast({
      title: "Demo",
      description: "La limpieza de caché estará disponible en la versión completa",
    })
  }

  return (
    <AppShell title="Configuración">
      <div className="max-w-3xl mx-auto">
        <PageHeader title="Configuración" description="Gestiona las preferencias de tu aplicación" />

        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Perfil</CardTitle>
                  <CardDescription>Tu información personal</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" defaultValue="Nicole" placeholder="Tu nombre" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Título profesional</Label>
                  <Input id="title" defaultValue="Arquitecta" placeholder="Ej: Arquitecta" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="nicole@ejemplo.com" placeholder="tu@email.com" />
              </div>
              <Button size="sm">Guardar cambios</Button>
            </CardContent>
          </Card>

          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Apariencia</CardTitle>
                  <CardDescription>Personaliza el aspecto visual</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo oscuro</Label>
                  <p className="text-sm text-muted-foreground">Cambia entre tema claro y oscuro</p>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Notificaciones</CardTitle>
                  <CardDescription>Gestiona las alertas y recordatorios</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones push</Label>
                  <p className="text-sm text-muted-foreground">Recibe alertas en tu dispositivo</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recordatorios de proyecto</Label>
                  <p className="text-sm text-muted-foreground">Alertas de fechas límite y pendientes</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Data Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Datos y almacenamiento</CardTitle>
                  <CardDescription>Gestiona tus datos locales</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Almacenamiento usado</p>
                  <p className="text-xs text-muted-foreground">
                    {/* TODO: Calcular uso real de IndexedDB */}
                    ~12.5 MB de datos locales
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Caché de la aplicación</p>
                  <p className="text-xs text-muted-foreground">Archivos en caché para uso offline</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleClearCache}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Privacidad</CardTitle>
                  <CardDescription>Control de datos y seguridad</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sincronización en la nube</Label>
                  <p className="text-sm text-muted-foreground">Respalda tus proyectos automáticamente</p>
                </div>
                <Switch />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                <strong>Nota:</strong> Tus datos se almacenan localmente en tu dispositivo. La sincronización en la nube
                requiere una cuenta activa.
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Acerca de</CardTitle>
                  <CardDescription>Información de la aplicación</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Versión</span>
                  <span className="font-mono">1.0.0-beta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Build</span>
                  <span className="font-mono">2024.12.03</span>
                </div>
                <Separator className="my-3" />
                <p className="text-xs text-muted-foreground">
                  Nicole Architect - Field • Studio • Design
                  <br />
                  Suite de herramientas profesionales para arquitectura
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </AppShell>
  )
}
