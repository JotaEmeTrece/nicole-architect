"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, Square, Triangle, Paintbrush, Box, Layers, RotateCcw } from "lucide-react"

interface CalculatorResult {
  label: string
  value: string
  unit: string
  highlight?: boolean
}

export default function CalculadorasPage() {
  // Area & Perimeter Calculator
  const [areaInputs, setAreaInputs] = useState({ largo: "", ancho: "" })
  const [areaResults, setAreaResults] = useState<CalculatorResult[]>([])

  // Slope Calculator
  const [slopeInputs, setSlopeInputs] = useState({ altura: "", longitud: "" })
  const [slopeResults, setSlopeResults] = useState<CalculatorResult[]>([])

  // Paint Calculator
  const [paintInputs, setPaintInputs] = useState({ area: "", manos: "2" })
  const [paintResults, setPaintResults] = useState<CalculatorResult[]>([])

  // Concrete Calculator
  const [concreteInputs, setConcreteInputs] = useState({ largo: "", ancho: "", espesor: "" })
  const [concreteResults, setConcreteResults] = useState<CalculatorResult[]>([])

  // Mortar Calculator
  const [mortarInputs, setMortarInputs] = useState({ area: "", espesor: "" })
  const [mortarResults, setMortarResults] = useState<CalculatorResult[]>([])

  const calculateArea = () => {
    const largo = Number.parseFloat(areaInputs.largo)
    const ancho = Number.parseFloat(areaInputs.ancho)

    if (isNaN(largo) || isNaN(ancho) || largo <= 0 || ancho <= 0) {
      setAreaResults([{ label: "Error", value: "Ingresa valores válidos", unit: "", highlight: false }])
      return
    }

    const area = largo * ancho
    const perimetro = 2 * (largo + ancho)
    const diagonal = Math.sqrt(largo ** 2 + ancho ** 2)

    setAreaResults([
      { label: "Área", value: area.toFixed(2), unit: "m²", highlight: true },
      { label: "Perímetro", value: perimetro.toFixed(2), unit: "m" },
      { label: "Diagonal", value: diagonal.toFixed(2), unit: "m" },
    ])
  }

  const calculateSlope = () => {
    const altura = Number.parseFloat(slopeInputs.altura)
    const longitud = Number.parseFloat(slopeInputs.longitud)

    if (isNaN(altura) || isNaN(longitud) || longitud <= 0) {
      setSlopeResults([{ label: "Error", value: "Ingresa valores válidos", unit: "", highlight: false }])
      return
    }

    const pendientePorcentaje = (altura / longitud) * 100
    const pendienteGrados = Math.atan(altura / longitud) * (180 / Math.PI)
    const hipotenusa = Math.sqrt(altura ** 2 + longitud ** 2)

    // Determine if it meets accessibility standards
    let clasificacion = ""
    if (pendientePorcentaje <= 6) {
      clasificacion = "Apta para accesibilidad (< 6%)"
    } else if (pendientePorcentaje <= 8) {
      clasificacion = "Límite accesibilidad (6-8%)"
    } else if (pendientePorcentaje <= 12) {
      clasificacion = "Rampa vehicular típica"
    } else {
      clasificacion = "Pendiente pronunciada"
    }

    setSlopeResults([
      { label: "Pendiente", value: pendientePorcentaje.toFixed(2), unit: "%", highlight: true },
      { label: "Ángulo", value: pendienteGrados.toFixed(2), unit: "°" },
      { label: "Longitud rampa", value: hipotenusa.toFixed(2), unit: "m" },
      { label: "Clasificación", value: clasificacion, unit: "" },
    ])
  }

  const calculatePaint = () => {
    const area = Number.parseFloat(paintInputs.area)
    const manos = Number.parseInt(paintInputs.manos)

    if (isNaN(area) || area <= 0 || isNaN(manos) || manos <= 0) {
      setPaintResults([{ label: "Error", value: "Ingresa valores válidos", unit: "", highlight: false }])
      return
    }

    // Average paint coverage: 10-12 m² per liter
    const rendimientoPorLitro = 10
    const litrosNecesarios = (area * manos) / rendimientoPorLitro
    const cubetas19L = Math.ceil(litrosNecesarios / 19)
    const galones = Math.ceil(litrosNecesarios / 3.785)

    setPaintResults([
      { label: "Litros necesarios", value: litrosNecesarios.toFixed(1), unit: "L", highlight: true },
      { label: "Galones (3.785 L)", value: galones.toString(), unit: "galones" },
      { label: "Cubetas (19 L)", value: cubetas19L.toString(), unit: "cubetas" },
      { label: "Rendimiento usado", value: rendimientoPorLitro.toString(), unit: "m²/L" },
    ])
  }

  const calculateConcrete = () => {
    const largo = Number.parseFloat(concreteInputs.largo)
    const ancho = Number.parseFloat(concreteInputs.ancho)
    const espesor = Number.parseFloat(concreteInputs.espesor) / 100 // cm to m

    if (isNaN(largo) || isNaN(ancho) || isNaN(espesor) || largo <= 0 || ancho <= 0 || espesor <= 0) {
      setConcreteResults([{ label: "Error", value: "Ingresa valores válidos", unit: "", highlight: false }])
      return
    }

    const volumen = largo * ancho * espesor
    const area = largo * ancho

    // Typical concrete mix: 1 cement : 2 sand : 3 gravel (volumetric)
    // 1 m³ concrete ≈ 7 bags of 50kg cement
    const bolsasCemento = Math.ceil(volumen * 7)
    const arena = volumen * 0.5 // m³
    const grava = volumen * 0.7 // m³

    setConcreteResults([
      { label: "Volumen concreto", value: volumen.toFixed(3), unit: "m³", highlight: true },
      { label: "Área", value: area.toFixed(2), unit: "m²" },
      { label: "Cemento (50kg)", value: bolsasCemento.toString(), unit: "bolsas" },
      { label: "Arena", value: arena.toFixed(2), unit: "m³" },
      { label: "Grava", value: grava.toFixed(2), unit: "m³" },
    ])
  }

  const calculateMortar = () => {
    const area = Number.parseFloat(mortarInputs.area)
    const espesor = Number.parseFloat(mortarInputs.espesor) / 100 // cm to m

    if (isNaN(area) || isNaN(espesor) || area <= 0 || espesor <= 0) {
      setMortarResults([{ label: "Error", value: "Ingresa valores válidos", unit: "", highlight: false }])
      return
    }

    const volumen = area * espesor

    // Mortar mix: typically 1:4 (cement:sand)
    // 1 m³ mortar ≈ 8 bags of 50kg cement
    const bolsasCemento = Math.ceil(volumen * 8)
    const arena = volumen * 1.2 // m³

    setMortarResults([
      { label: "Volumen mortero", value: volumen.toFixed(3), unit: "m³", highlight: true },
      { label: "Cemento (50kg)", value: bolsasCemento.toString(), unit: "bolsas" },
      { label: "Arena", value: arena.toFixed(2), unit: "m³" },
    ])
  }

  const ResultsDisplay = ({ results }: { results: CalculatorResult[] }) => (
    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
      <h4 className="text-sm font-medium mb-3">Resultados</h4>
      <div className="space-y-2">
        {results.map((result, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{result.label}</span>
            <span className={`font-mono ${result.highlight ? "text-2xl font-semibold text-primary" : "text-sm"}`}>
              {result.value}{" "}
              {result.unit && <span className="text-muted-foreground text-sm font-normal">{result.unit}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <AppShell title="Calculadoras">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Calculadoras" description="Herramientas de cálculo para arquitectura y construcción" />

        <Tabs defaultValue="area" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6">
            <TabsTrigger value="area" className="gap-1 text-xs sm:text-sm">
              <Square className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Área</span>
            </TabsTrigger>
            <TabsTrigger value="slope" className="gap-1 text-xs sm:text-sm">
              <Triangle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Pendiente</span>
            </TabsTrigger>
            <TabsTrigger value="paint" className="gap-1 text-xs sm:text-sm">
              <Paintbrush className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Pintura</span>
            </TabsTrigger>
            <TabsTrigger value="concrete" className="gap-1 text-xs sm:text-sm">
              <Box className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Concreto</span>
            </TabsTrigger>
            <TabsTrigger value="mortar" className="gap-1 text-xs sm:text-sm">
              <Layers className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Mortero</span>
            </TabsTrigger>
          </TabsList>

          {/* Area & Perimeter Calculator */}
          <TabsContent value="area">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Square className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Área y Perímetro</CardTitle>
                    <CardDescription>Calcula área, perímetro y diagonal de un rectángulo</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="area-largo">Largo (m)</Label>
                    <Input
                      id="area-largo"
                      type="number"
                      step="0.01"
                      min="0"
                      value={areaInputs.largo}
                      onChange={(e) => setAreaInputs({ ...areaInputs, largo: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="area-ancho">Ancho (m)</Label>
                    <Input
                      id="area-ancho"
                      type="number"
                      step="0.01"
                      min="0"
                      value={areaInputs.ancho}
                      onChange={(e) => setAreaInputs({ ...areaInputs, ancho: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={calculateArea} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAreaInputs({ largo: "", ancho: "" })
                      setAreaResults([])
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {areaResults.length > 0 && <ResultsDisplay results={areaResults} />}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Slope Calculator */}
          <TabsContent value="slope">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Triangle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Pendiente / Rampa</CardTitle>
                    <CardDescription>Calcula pendiente en porcentaje y grados</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="slope-altura">Altura / Desnivel (m)</Label>
                    <Input
                      id="slope-altura"
                      type="number"
                      step="0.01"
                      min="0"
                      value={slopeInputs.altura}
                      onChange={(e) => setSlopeInputs({ ...slopeInputs, altura: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="slope-longitud">Longitud horizontal (m)</Label>
                    <Input
                      id="slope-longitud"
                      type="number"
                      step="0.01"
                      min="0"
                      value={slopeInputs.longitud}
                      onChange={(e) => setSlopeInputs({ ...slopeInputs, longitud: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={calculateSlope} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSlopeInputs({ altura: "", longitud: "" })
                      setSlopeResults([])
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {slopeResults.length > 0 && <ResultsDisplay results={slopeResults} />}
                <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                  <strong>Referencia:</strong> Rampas accesibles: máx 6-8%. Rampas vehiculares: 8-15%.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paint Calculator */}
          <TabsContent value="paint">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Paintbrush className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Pintura</CardTitle>
                    <CardDescription>Calcula la cantidad de pintura necesaria</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="paint-area">Área a pintar (m²)</Label>
                    <Input
                      id="paint-area"
                      type="number"
                      step="0.01"
                      min="0"
                      value={paintInputs.area}
                      onChange={(e) => setPaintInputs({ ...paintInputs, area: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="paint-manos">Número de manos</Label>
                    <Input
                      id="paint-manos"
                      type="number"
                      min="1"
                      max="5"
                      value={paintInputs.manos}
                      onChange={(e) => setPaintInputs({ ...paintInputs, manos: e.target.value })}
                      placeholder="2"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={calculatePaint} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPaintInputs({ area: "", manos: "2" })
                      setPaintResults([])
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {paintResults.length > 0 && <ResultsDisplay results={paintResults} />}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Concrete Calculator */}
          <TabsContent value="concrete">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Box className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Concreto</CardTitle>
                    <CardDescription>Calcula materiales para losas y firmes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="conc-largo">Largo (m)</Label>
                    <Input
                      id="conc-largo"
                      type="number"
                      step="0.01"
                      min="0"
                      value={concreteInputs.largo}
                      onChange={(e) => setConcreteInputs({ ...concreteInputs, largo: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="conc-ancho">Ancho (m)</Label>
                    <Input
                      id="conc-ancho"
                      type="number"
                      step="0.01"
                      min="0"
                      value={concreteInputs.ancho}
                      onChange={(e) => setConcreteInputs({ ...concreteInputs, ancho: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="conc-espesor">Espesor (cm)</Label>
                    <Input
                      id="conc-espesor"
                      type="number"
                      step="0.5"
                      min="0"
                      value={concreteInputs.espesor}
                      onChange={(e) => setConcreteInputs({ ...concreteInputs, espesor: e.target.value })}
                      placeholder="10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={calculateConcrete} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setConcreteInputs({ largo: "", ancho: "", espesor: "" })
                      setConcreteResults([])
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {concreteResults.length > 0 && <ResultsDisplay results={concreteResults} />}
                <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                  <strong>Nota:</strong> Proporción volumétrica 1:2:3 (cemento:arena:grava). Agrega 10-15% por
                  desperdicio.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mortar Calculator */}
          <TabsContent value="mortar">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Mortero</CardTitle>
                    <CardDescription>Calcula materiales para aplanados y pegas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mort-area">Área (m²)</Label>
                    <Input
                      id="mort-area"
                      type="number"
                      step="0.01"
                      min="0"
                      value={mortarInputs.area}
                      onChange={(e) => setMortarInputs({ ...mortarInputs, area: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mort-espesor">Espesor (cm)</Label>
                    <Input
                      id="mort-espesor"
                      type="number"
                      step="0.5"
                      min="0"
                      value={mortarInputs.espesor}
                      onChange={(e) => setMortarInputs({ ...mortarInputs, espesor: e.target.value })}
                      placeholder="1.5"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={calculateMortar} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMortarInputs({ area: "", espesor: "" })
                      setMortarResults([])
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {mortarResults.length > 0 && <ResultsDisplay results={mortarResults} />}
                <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                  <strong>Nota:</strong> Proporción 1:4 (cemento:arena) para aplanados típicos.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
