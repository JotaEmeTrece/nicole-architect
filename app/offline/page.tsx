"use client"

import { WifiOff, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-2">Sin conexión</h1>

          <p className="text-muted-foreground mb-6">
            Parece que no tienes conexión a internet. Algunas funciones pueden no estar disponibles.
          </p>

          <div className="space-y-3">
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar conexión
            </Button>

            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                <Home className="h-4 w-4 mr-2" />
                Ir al inicio
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Los datos guardados localmente seguirán disponibles para consulta.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
