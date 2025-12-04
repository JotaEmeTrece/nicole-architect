"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Sun, CalendarIcon, MapPin, Calculator, Info } from "lucide-react"
import { mockSunPathData } from "@/lib/mock-data"
import type { SunPathData } from "@/lib/models"

// Mock city data with approximate coordinates
const cities = [
  { name: "Ciudad de México", lat: 19.4326, lng: -99.1332 },
  { name: "Guadalajara", lat: 20.6597, lng: -103.3496 },
  { name: "Monterrey", lat: 25.6866, lng: -100.3161 },
  { name: "Puebla", lat: 19.0414, lng: -98.2063 },
  { name: "Mérida", lat: 20.9674, lng: -89.5926 },
  { name: "Cancún", lat: 21.1619, lng: -86.8515 },
  { name: "Oaxaca", lat: 17.0732, lng: -96.7266 },
  { name: "San Miguel de Allende", lat: 20.9144, lng: -100.7452 },
]

export default function SunPathPage() {
  const [city, setCity] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [results, setResults] = useState<SunPathData[] | null>(null)
  const [selectedCity, setSelectedCity] = useState<(typeof cities)[0] | null>(null)

  const handleCalculate = () => {
    if (!city || !date) return

    // Find matching city (case insensitive, partial match)
    const matchedCity = cities.find((c) => c.name.toLowerCase().includes(city.toLowerCase()))

    setSelectedCity(matchedCity || null)

    // TODO: Implementar cálculo astronómico real
    // Por ahora usamos datos mock que simulan la trayectoria solar
    setResults(mockSunPathData)
  }

  const intensityColors = {
    baja: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    alta: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  }

  // SVG Sun Path Diagram
  const SunPathDiagram = ({ data }: { data: SunPathData[] }) => {
    const width = 400
    const height = 220
    const centerX = width / 2
    const radius = 180

    // Convert altitude and azimuth to x,y coordinates
    const getPoint = (altitude: number, azimuth: number) => {
      // Azimuth: 0 = North, 90 = East, 180 = South, 270 = West
      // We'll draw as if looking at the sky from above
      const r = radius * (1 - altitude / 90) * 0.9
      const angle = ((azimuth - 180) * Math.PI) / 180
      return {
        x: centerX + r * Math.sin(angle),
        y: height - 20 - r * Math.cos(angle) * 0.5, // Flatten for perspective
      }
    }

    const pathPoints = data.filter((d) => d.altitude > 0).map((d) => getPoint(d.altitude, d.azimuth))

    const pathD = pathPoints.length > 0 ? `M ${pathPoints.map((p) => `${p.x},${p.y}`).join(" L ")}` : ""

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md mx-auto">
        {/* Background arc representing horizon */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.85 0.08 220)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.95 0.02 220)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Sky background */}
        <ellipse
          cx={centerX}
          cy={height - 20}
          rx={radius}
          ry={radius * 0.5}
          fill="url(#skyGradient)"
          className="dark:opacity-20"
        />

        {/* Horizon line */}
        <ellipse
          cx={centerX}
          cy={height - 20}
          rx={radius}
          ry={radius * 0.5}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-border"
        />

        {/* Altitude circles */}
        {[30, 60].map((alt) => {
          const r = radius * (1 - alt / 90) * 0.9
          return (
            <ellipse
              key={alt}
              cx={centerX}
              cy={height - 20}
              rx={r}
              ry={r * 0.5}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="4,4"
              className="text-border opacity-50"
            />
          )
        })}

        {/* Cardinal directions */}
        <text x={centerX} y={height - 5} textAnchor="middle" className="fill-muted-foreground text-[10px]">
          S
        </text>
        <text x={centerX} y={25} textAnchor="middle" className="fill-muted-foreground text-[10px]">
          N
        </text>
        <text x={20} y={height / 2 + 40} textAnchor="middle" className="fill-muted-foreground text-[10px]">
          E
        </text>
        <text x={width - 20} y={height / 2 + 40} textAnchor="middle" className="fill-muted-foreground text-[10px]">
          O
        </text>

        {/* Sun path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="oklch(0.75 0.15 60)"
            strokeWidth="3"
            strokeLinecap="round"
            className="drop-shadow-sm"
          />
        )}

        {/* Sun positions at key hours */}
        {data
          .filter((d) => d.altitude > 0 && [8, 10, 12, 14, 16, 18].includes(d.hour))
          .map((d) => {
            const point = getPoint(d.altitude, d.azimuth)
            return (
              <g key={d.hour}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={d.hour === 12 ? 10 : 6}
                  fill={d.hour === 12 ? "oklch(0.80 0.18 60)" : "oklch(0.85 0.12 60)"}
                  className="drop-shadow"
                />
                <text
                  x={point.x}
                  y={point.y - 12}
                  textAnchor="middle"
                  className="fill-foreground text-[9px] font-medium"
                >
                  {d.hour}:00
                </text>
              </g>
            )
          })}

        {/* Legend */}
        <g transform={`translate(${width - 80}, 15)`}>
          <circle cx={0} cy={0} r={5} fill="oklch(0.85 0.12 60)" />
          <text x={10} y={4} className="fill-muted-foreground text-[8px]">
            Posición solar
          </text>
        </g>
      </svg>
    )
  }

  return (
    <AppShell title="SunPath">
      <div className="max-w-5xl mx-auto">
        <PageHeader title="SunPath" description="Análisis de trayectoria solar para diseño bioclimático" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Parámetros</CardTitle>
                <CardDescription>Ingresa ubicación y fecha para el análisis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ej: Ciudad de México"
                      className="pl-9"
                      list="cities"
                    />
                    <datalist id="cities">
                      {cities.map((c) => (
                        <option key={c.name} value={c.name} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Fecha</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button onClick={handleCalculate} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcular trayectoria
                </Button>

                {selectedCity && (
                  <div className="p-3 bg-muted/50 rounded-lg text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Info className="h-3 w-3" />
                      Coordenadas
                    </div>
                    <p className="font-mono">
                      Lat: {selectedCity.lat.toFixed(4)}°
                      <br />
                      Lng: {selectedCity.lng.toFixed(4)}°
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {!results ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Sun className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Ingresa una ubicación y fecha para ver el análisis solar</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Sun Path Diagram */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Diagrama Solar</CardTitle>
                    <CardDescription>
                      Trayectoria del sol para {city} el {date && format(date, "d 'de' MMMM, yyyy", { locale: es })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SunPathDiagram data={results} />
                    <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
                      <span>E = Este (amanecer)</span>
                      <span>S = Sur (mediodía)</span>
                      <span>O = Oeste (atardecer)</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Datos por hora</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px]">Hora</TableHead>
                            <TableHead className="text-right">Altitud</TableHead>
                            <TableHead className="text-right">Azimut</TableHead>
                            <TableHead className="text-right">Intensidad</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results
                            .filter((d) => d.altitude > 0)
                            .map((row) => (
                              <TableRow key={row.hour}>
                                <TableCell className="font-medium">{row.hour}:00</TableCell>
                                <TableCell className="text-right font-mono">{row.altitude}°</TableCell>
                                <TableCell className="text-right font-mono">{row.azimuth}°</TableCell>
                                <TableCell className="text-right">
                                  <Badge
                                    variant="secondary"
                                    className={cn("text-[10px]", intensityColors[row.intensity])}
                                  >
                                    {row.intensity}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Summary */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Resumen del análisis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-semibold text-primary">
                          {results.find((d) => d.hour === 6)?.hour || "~6"}:00
                        </p>
                        <p className="text-xs text-muted-foreground">Amanecer aprox.</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-semibold text-primary">
                          {Math.max(...results.map((d) => d.altitude))}°
                        </p>
                        <p className="text-xs text-muted-foreground">Altitud máxima</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-semibold text-primary">
                          {results.filter((d) => d.intensity === "alta").length}h
                        </p>
                        <p className="text-xs text-muted-foreground">Horas de sol alto</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-semibold text-primary">
                          {results.find((d) => d.hour === 19)?.hour || "~19"}:00
                        </p>
                        <p className="text-xs text-muted-foreground">Atardecer aprox.</p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                      <strong>Recomendaciones de diseño:</strong>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li>Orientar fachada principal hacia el sur para aprovechamiento solar pasivo</li>
                        <li>Considerar elementos de sombreado para horas de alta intensidad</li>
                        <li>Ventanas al norte para iluminación difusa sin ganancia térmica excesiva</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
