'use client'

import * as React from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  Boxes,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Info,
  Leaf,
  Package,
  Plane,
  Scale,
  Ship,
  Sparkles,
  Truck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export interface FreightQuoteCalculatorProps {
  initialOrigin?: string
  initialDestination?: string
  initialPallets?: number
  initialLengthCm?: number
  initialWidthCm?: number
  initialHeightCm?: number
  initialGrossWeightKg?: number
  initialCurrency?: string
  className?: string
}

// Route Ports & Hubs
const ORIGIN_PORTS = [
  { code: 'CNSHA', name: 'Shanghai Port (CNSHA)', country: 'China', type: 'Marine & Air' },
  { code: 'CNNGB', name: 'Ningbo-Zhoushan Port (CNNGB)', country: 'China', type: 'Marine Port' },
  { code: 'SGSIN', name: 'Port of Singapore (SGSIN)', country: 'Singapore', type: 'Hub Port' },
  { code: 'DEHAM', name: 'Port of Hamburg (DEHAM)', country: 'Germany', type: 'Marine & Rail' },
  { code: 'NLRTM', name: 'Port of Rotterdam (NLRTM)', country: 'Netherlands', type: 'Main Gateway' },
  { code: 'JPTYO', name: 'Port of Tokyo (JPTYO)', country: 'Japan', type: 'Marine & Air' },
]

const DESTINATION_PORTS = [
  { code: 'USLAX', name: 'Port of Los Angeles (USLAX)', country: 'United States', type: 'West Coast Gateway' },
  { code: 'USNYC', name: 'Port of New York & New Jersey (USNYC)', country: 'United States', type: 'East Coast Hub' },
  { code: 'USORD', name: 'Chicago O’Hare Logistics Hub (USORD)', country: 'United States', type: 'Inland Hub' },
  { code: 'GBFXT', name: 'Port of Felixstowe (GBFXT)', country: 'United Kingdom', type: 'Deep Sea Port' },
  { code: 'AUMEL', name: 'Port of Melbourne (AUMEL)', country: 'Australia', type: 'Marine Port' },
  { code: 'AEJEA', name: 'Jebel Ali Port (AEJEA)', country: 'United Arab Emirates', type: 'Middle East Hub' },
]

// Currencies
interface CurrencyConfig {
  code: string
  symbol: string
  label: string
  rate: number
}

const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', label: 'USD ($)', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£)', rate: 0.79 },
  CNY: { code: 'CNY', symbol: '¥', label: 'CNY (¥)', rate: 7.23 },
  SGD: { code: 'SGD', symbol: 'S$', label: 'SGD (S$)', rate: 1.34 },
}

const CUSTOMS_USD = 150
const INSURANCE_USD = 85
const LIFTGATE_USD = 50

type FreightMode = 'ocean-fcl' | 'ocean-lcl' | 'air' | 'ground'

export function FreightQuoteCalculator({
  initialOrigin = 'CNSHA',
  initialDestination = 'USLAX',
  initialPallets = 6,
  initialLengthCm = 120,
  initialWidthCm = 80,
  initialHeightCm = 160,
  initialGrossWeightKg = 400,
  initialCurrency = 'USD',
  className,
}: FreightQuoteCalculatorProps) {
  const [origin, setOrigin] = React.useState(initialOrigin)
  const [destination, setDestination] = React.useState(initialDestination)
  const [pallets, setPallets] = React.useState(initialPallets)
  const [lengthCm, setLengthCm] = React.useState(initialLengthCm)
  const [widthCm, setWidthCm] = React.useState(initialWidthCm)
  const [heightCm, setHeightCm] = React.useState(initialHeightCm)
  const [grossWeightKg, setGrossWeightKg] = React.useState(initialGrossWeightKg)
  const [selectedCurrency, setSelectedCurrency] = React.useState(initialCurrency)

  const [addCustoms, setAddCustoms] = React.useState(false)
  const [addInsurance, setAddInsurance] = React.useState(false)
  const [addLiftgate, setAddLiftgate] = React.useState(false)

  const [selectedMode, setSelectedMode] = React.useState<FreightMode>('ocean-fcl')
  const [isBooked, setIsBooked] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)

  const swapRoute = () => {
    setOrigin((prev) => {
      const next = destination
      setDestination(prev)
      return next
    })
  }

  // Calculations
  const singlePalletVolumeCbm = React.useMemo(() => {
    const l = Number(lengthCm) || 0
    const w = Number(widthCm) || 0
    const h = Number(heightCm) || 0
    return (l * w * h) / 1_000_000
  }, [lengthCm, widthCm, heightCm])

  const totalVolumeCbm = React.useMemo(() => {
    const count = Number(pallets) || 0
    return count * singlePalletVolumeCbm
  }, [pallets, singlePalletVolumeCbm])

  const totalGrossWeightKg = React.useMemo(() => {
    const count = Number(pallets) || 0
    const unitWeight = Number(grossWeightKg) || 0
    return count * unitWeight
  }, [pallets, grossWeightKg])

  const airVolumetricWeightKg = React.useMemo(() => {
    return Math.round(totalVolumeCbm * (1000 / 6))
  }, [totalVolumeCbm])

  const currentCurrency = CURRENCIES[selectedCurrency] ?? CURRENCIES.USD

  const formatMoney = React.useCallback(
    (amountInUsd: number): string => {
      const converted = amountInUsd * currentCurrency.rate
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currentCurrency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(converted)
    },
    [currentCurrency],
  )

  const fclContainersCount = Math.max(1, Math.ceil(pallets / 10))

  const oceanFclBaseUsd = fclContainersCount * 2850
  const oceanLclBaseUsd = Math.round((totalVolumeCbm || 1) * 140 + 130)
  const airFreightBaseUsd = Math.round((airVolumetricWeightKg || 100) * 4.18)
  const groundFreightBaseUsd = (Number(pallets) || 1) * 265

  const addonsTotalUsd =
    (addCustoms ? CUSTOMS_USD : 0) + (addInsurance ? INSURANCE_USD : 0) + (addLiftgate ? LIFTGATE_USD : 0)

  const activeBasePriceUsd = React.useMemo(() => {
    switch (selectedMode) {
      case 'ocean-fcl':
        return oceanFclBaseUsd
      case 'ocean-lcl':
        return oceanLclBaseUsd
      case 'air':
        return airFreightBaseUsd
      case 'ground':
        return groundFreightBaseUsd
      default:
        return oceanFclBaseUsd
    }
  }, [selectedMode, oceanFclBaseUsd, oceanLclBaseUsd, airFreightBaseUsd, groundFreightBaseUsd])

  const activeTotalPriceUsd = activeBasePriceUsd + addonsTotalUsd

  const activeTransitTime = React.useMemo(() => {
    switch (selectedMode) {
      case 'ocean-fcl':
        return '14-18 days'
      case 'ocean-lcl':
        return '18-22 days'
      case 'air':
        return '3-5 days'
      case 'ground':
        return '5-7 days'
    }
  }, [selectedMode])

  const activeCarbonEmission = React.useMemo(() => {
    switch (selectedMode) {
      case 'ocean-fcl':
        return `${(1.2 * fclContainersCount).toFixed(1)} tCO2`
      case 'ocean-lcl':
        return `${(totalVolumeCbm * 0.087).toFixed(1)} tCO2`
      case 'air':
        return `${(airVolumetricWeightKg * 0.003125).toFixed(1)} tCO2`
      case 'ground':
        return `${(pallets * 0.26).toFixed(1)} tCO2`
    }
  }, [selectedMode, fclContainersCount, totalVolumeCbm, airVolumetricWeightKg, pallets])

  const handleBookQuote = () => {
    setIsBooked(true)
    setTimeout(() => {
      setIsBooked(false)
    }, 3500)
  }

  const handleDownloadPdf = () => {
    setIsDownloading(true)
    setTimeout(() => {
      setIsDownloading(false)
    }, 2000)
  }

  return (
    <div
      data-slot="freight-quote-calculator"
      className={cn('mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8', className)}
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 text-xs font-medium">
              <Boxes className="text-primary size-3.5" />
              Multimodal Logistics
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              Spot Rates Live
            </Badge>
          </div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Freight Rate &amp; Cargo Quote Calculator
          </h2>
          <p className="text-muted-foreground text-sm">
            Compare spot rates across Ocean FCL/LCL, Air Freight, and Ground Trucking with instant CBM volumetric
            analysis.
          </p>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-2 sm:self-start">
          <span className="text-muted-foreground text-xs font-medium">Currency:</span>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-[125px] text-xs font-medium">
              <SelectValue placeholder={selectedCurrency} />
            </SelectTrigger>
            <SelectContent align="end">
              {Object.values(CURRENCIES).map((curr) => (
                <SelectItem key={curr.code} value={curr.code} className="text-xs">
                  {{
                    USD: 'USD ($)',
                    EUR: 'EUR (€)',
                    GBP: 'GBP (£)',
                    CNY: 'CNY (¥)',
                    SGD: 'SGD (S$)',
                  }[curr.code] ?? curr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Input Form & Volumetric Calculator (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* 1. Route Configuration Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between">
                <CardTitle className="text-base font-semibold">1. Shipping Route</CardTitle>
                <span className="text-muted-foreground text-xs font-medium">International Corridors</span>
              </div>
              <CardDescription className="text-xs">
                Select origin loading port and destination discharge terminal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr,auto,1fr] sm:items-end">
                {/* Origin */}
                <div className="space-y-1.5">
                  <label htmlFor="route-origin" className="text-foreground text-xs font-medium">
                    Origin (Port / Hub)
                  </label>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger id="route-origin" className="text-xs [&_svg]:shrink-0 [&>span]:truncate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORIGIN_PORTS.map((p) => (
                        <SelectItem key={p.code} value={p.code} className="text-xs">
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center pb-0.5 sm:pb-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-9 shrink-0"
                    aria-label="Swap Origin and Destination"
                    onClick={swapRoute}
                  >
                    <ArrowLeftRight className="size-4" />
                  </Button>
                </div>

                {/* Destination */}
                <div className="space-y-1.5">
                  <label htmlFor="route-destination" className="text-foreground text-xs font-medium">
                    Destination (Port / Hub)
                  </label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger id="route-destination" className="text-xs [&_svg]:shrink-0 [&>span]:truncate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DESTINATION_PORTS.map((p) => (
                        <SelectItem key={p.code} value={p.code} className="text-xs">
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Route Info Banner */}
              <div className="bg-muted/40 border-border/80 flex flex-wrap items-center justify-between rounded-lg border px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <Ship className="text-primary size-4 shrink-0" />
                  <span className="text-foreground font-medium">Transpacific Direct Corridor</span>
                </div>
                <span className="text-muted-foreground tabular-nums">Distance: ~5,800 NM (10,740 km)</span>
              </div>
            </CardContent>
          </Card>

          {/* 2. Cargo Type & Mode Selector */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between">
                <CardTitle className="text-base font-semibold">2. Cargo Freight Mode</CardTitle>
                <span className="text-muted-foreground text-xs">Select primary transport</span>
              </div>
              <CardDescription className="text-xs">
                Choose your preferred multimodal transit mode to evaluate rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Ocean FCL */}
                <button
                  type="button"
                  className={cn(
                    'border-border focus-visible:ring-ring relative flex flex-col justify-between gap-3 rounded-lg border p-3.5 text-left transition-all outline-none focus-visible:ring-2',
                    selectedMode === 'ocean-fcl'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'hover:border-border/80 hover:bg-muted/30 bg-card',
                  )}
                  onClick={() => setSelectedMode('ocean-fcl')}
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                      <Ship className="size-4" />
                    </div>
                    <Badge variant="default" className="text-xs">
                      Recommended
                    </Badge>
                  </div>
                  <div>
                    <div className="text-foreground text-sm font-semibold">Ocean FCL (Full Container)</div>
                    <div className="text-muted-foreground mt-0.5 text-xs">
                      20ft / 40ft dedicated sea freight container
                    </div>
                  </div>
                  <div className="border-border/50 flex w-full items-center justify-between border-t pt-1 text-xs">
                    <span className="text-muted-foreground">Est. Transit: 14-18 days</span>
                    <span className="text-foreground font-semibold tabular-nums">{formatMoney(oceanFclBaseUsd)}</span>
                  </div>
                </button>

                {/* Ocean LCL */}
                <button
                  type="button"
                  className={cn(
                    'border-border focus-visible:ring-ring relative flex flex-col justify-between gap-3 rounded-lg border p-3.5 text-left transition-all outline-none focus-visible:ring-2',
                    selectedMode === 'ocean-lcl'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'hover:border-border/80 hover:bg-muted/30 bg-card',
                  )}
                  onClick={() => setSelectedMode('ocean-lcl')}
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                      <Boxes className="size-4" />
                    </div>
                    <Badge variant="outline" className="text-xs font-normal">
                      Economy
                    </Badge>
                  </div>
                  <div>
                    <div className="text-foreground text-sm font-semibold">Ocean LCL (Shared)</div>
                    <div className="text-muted-foreground mt-0.5 text-xs">
                      Consolidated sea freight priced by CBM volume
                    </div>
                  </div>
                  <div className="border-border/50 flex w-full items-center justify-between border-t pt-1 text-xs">
                    <span className="text-muted-foreground">Est. Transit: 18-22 days</span>
                    <span className="text-foreground font-semibold tabular-nums">{formatMoney(oceanLclBaseUsd)}</span>
                  </div>
                </button>

                {/* Express Air Freight */}
                <button
                  type="button"
                  className={cn(
                    'border-border focus-visible:ring-ring relative flex flex-col justify-between gap-3 rounded-lg border p-3.5 text-left transition-all outline-none focus-visible:ring-2',
                    selectedMode === 'air'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'hover:border-border/80 hover:bg-muted/30 bg-card',
                  )}
                  onClick={() => setSelectedMode('air')}
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                      <Plane className="size-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Fastest
                    </Badge>
                  </div>
                  <div>
                    <div className="text-foreground text-sm font-semibold">Express Air Freight</div>
                    <div className="text-muted-foreground mt-0.5 text-xs">
                      Priority belly/freighter aircraft dispatch
                    </div>
                  </div>
                  <div className="border-border/50 flex w-full items-center justify-between border-t pt-1 text-xs">
                    <span className="text-muted-foreground">Est. Transit: 3-5 days</span>
                    <span className="text-foreground font-semibold tabular-nums">{formatMoney(airFreightBaseUsd)}</span>
                  </div>
                </button>

                {/* Ground Freight */}
                <button
                  type="button"
                  className={cn(
                    'border-border focus-visible:ring-ring relative flex flex-col justify-between gap-3 rounded-lg border p-3.5 text-left transition-all outline-none focus-visible:ring-2',
                    selectedMode === 'ground'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'hover:border-border/80 hover:bg-muted/30 bg-card',
                  )}
                  onClick={() => setSelectedMode('ground')}
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                      <Truck className="size-4" />
                    </div>
                    <Badge variant="outline" className="text-xs font-normal">
                      Overland
                    </Badge>
                  </div>
                  <div>
                    <div className="text-foreground text-sm font-semibold">Ground Freight</div>
                    <div className="text-muted-foreground mt-0.5 text-xs">
                      Regional linehaul, FTL &amp; pallet LTL trucking
                    </div>
                  </div>
                  <div className="border-border/50 flex w-full items-center justify-between border-t pt-1 text-xs">
                    <span className="text-muted-foreground">Est. Transit: 5-7 days</span>
                    <span className="text-foreground font-semibold tabular-nums">
                      {formatMoney(groundFreightBaseUsd)}
                    </span>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* 3. Package Dimensions & Volumetric CBM Calculator */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between">
                <CardTitle className="text-base font-semibold">3. Cargo Dimensions &amp; Volumetric Weight</CardTitle>
                <Badge variant="outline" className="gap-1 text-xs font-normal">
                  <Scale className="text-primary size-3" />
                  IATA 1:6 Standard
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Enter pallet quantity, unit dimensions, and individual gross weight.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Dimensions Inputs Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div className="col-span-2 space-y-1.5 sm:col-span-1">
                  <label htmlFor="dim-pallets" className="text-foreground text-xs font-medium">
                    Quantity
                  </label>
                  <div className="relative">
                    <Input
                      id="dim-pallets"
                      value={pallets}
                      onChange={(e) => setPallets(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      type="number"
                      min="1"
                      max="100"
                      className="pr-8 text-xs tabular-nums"
                    />
                    <span className="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
                      pal
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="dim-length" className="text-foreground text-xs font-medium">
                    Length (L)
                  </label>
                  <div className="relative">
                    <Input
                      id="dim-length"
                      value={lengthCm}
                      onChange={(e) => setLengthCm(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      type="number"
                      min="10"
                      max="1000"
                      className="pr-8 text-xs tabular-nums"
                    />
                    <span className="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
                      cm
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="dim-width" className="text-foreground text-xs font-medium">
                    Width (W)
                  </label>
                  <div className="relative">
                    <Input
                      id="dim-width"
                      value={widthCm}
                      onChange={(e) => setWidthCm(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      type="number"
                      min="10"
                      max="1000"
                      className="pr-8 text-xs tabular-nums"
                    />
                    <span className="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
                      cm
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="dim-height" className="text-foreground text-xs font-medium">
                    Height (H)
                  </label>
                  <div className="relative">
                    <Input
                      id="dim-height"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      type="number"
                      min="10"
                      max="1000"
                      className="pr-8 text-xs tabular-nums"
                    />
                    <span className="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
                      cm
                    </span>
                  </div>
                </div>

                <div className="col-span-2 space-y-1.5 sm:col-span-1">
                  <label htmlFor="dim-weight" className="text-foreground text-xs font-medium">
                    Weight/Pallet
                  </label>
                  <div className="relative">
                    <Input
                      id="dim-weight"
                      value={grossWeightKg}
                      onChange={(e) => setGrossWeightKg(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      type="number"
                      min="1"
                      max="5000"
                      className="pr-8 text-xs tabular-nums"
                    />
                    <span className="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
                      kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Computed Volumetric Display Cards */}
              <div className="border-border/80 bg-muted/30 space-y-3 rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between text-xs">
                  <span className="text-foreground flex items-center gap-1.5 font-semibold">
                    <Package className="text-primary size-3.5" />
                    Cargo Metric Computations
                  </span>
                  <span className="text-muted-foreground">Standard Euro/US Pallet Basis</span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {/* Metric 1: Total Volume */}
                  <div className="bg-card border-border/80 rounded-md border p-2.5">
                    <div className="text-muted-foreground text-xs">Total Volume</div>
                    <div className="text-foreground mt-0.5 text-lg font-bold tabular-nums">
                      {totalVolumeCbm.toFixed(2)} <span className="text-muted-foreground text-xs font-normal">CBM</span>
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {singlePalletVolumeCbm.toFixed(2)} m³ / unit
                    </div>
                  </div>

                  {/* Metric 2: Actual Gross Weight */}
                  <div className="bg-card border-border/80 rounded-md border p-2.5">
                    <div className="text-muted-foreground text-xs">Actual Gross Wt.</div>
                    <div className="text-foreground mt-0.5 text-lg font-bold tabular-nums">
                      {totalGrossWeightKg.toLocaleString('en-US')}{' '}
                      <span className="text-muted-foreground text-xs font-normal">kg</span>
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {pallets} × {grossWeightKg} kg
                    </div>
                  </div>

                  {/* Metric 3: Air Volumetric Weight */}
                  <div className="bg-card border-border/80 rounded-md border p-2.5">
                    <div className="text-muted-foreground text-xs">Chargeable Wt. (Air)</div>
                    <div className="text-foreground mt-0.5 text-lg font-bold tabular-nums">
                      {airVolumetricWeightKg.toLocaleString('en-US')}{' '}
                      <span className="text-muted-foreground text-xs font-normal">kg</span>
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">Volumetric (1:6000)</div>
                  </div>

                  {/* Metric 4: Ocean Revenue Ton */}
                  <div className="bg-card border-border/80 rounded-md border p-2.5">
                    <div className="text-muted-foreground text-xs">Ocean Revenue Ton</div>
                    <div className="text-foreground mt-0.5 text-lg font-bold tabular-nums">
                      {Math.max(totalVolumeCbm, totalGrossWeightKg / 1000).toFixed(2)}{' '}
                      <span className="text-muted-foreground text-xs font-normal">RT</span>
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">Max(CBM, Weight/T)</div>
                  </div>
                </div>

                {/* Note */}
                <p className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                  <Info className="text-primary size-3.5 shrink-0" />
                  <span>
                    Computed Total Volume ({totalVolumeCbm.toFixed(2)} CBM) &amp; Chargeable Weight (
                    {airVolumetricWeightKg.toLocaleString('en-US')} kg) apply dynamically to quotes.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Value-Added Services */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <CardTitle className="text-base font-semibold">4. Value-Added Freight Services</CardTitle>
                <span className="text-muted-foreground text-xs font-medium">Optional Add-ons</span>
              </div>
              <CardDescription className="text-xs">
                Enhance shipment handling with customs, all-risk insurance, and destination equipment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Service 1: Customs Clearance */}
              <label className="border-border hover:border-primary/40 bg-card flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors">
                <div className="flex items-start gap-3">
                  <Checkbox checked={addCustoms} onCheckedChange={(val) => setAddCustoms(Boolean(val))} />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-medium">Customs Clearance</span>
                      <Badge variant="outline" className="text-xs font-normal tabular-nums">
                        +{formatMoney(CUSTOMS_USD)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Export filing, ISF 10+2 documentation, automated customs broker import clearance.
                    </p>
                  </div>
                </div>
              </label>

              {/* Service 2: Cargo Insurance */}
              <label className="border-border hover:border-primary/40 bg-card flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors">
                <div className="flex items-start gap-3">
                  <Checkbox checked={addInsurance} onCheckedChange={(val) => setAddInsurance(Boolean(val))} />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-medium">All-Risk Cargo Insurance</span>
                      <Badge variant="outline" className="text-xs font-normal tabular-nums">
                        +{formatMoney(INSURANCE_USD)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Comprehensive door-to-door insurance coverage up to $100,000 against damage or loss.
                    </p>
                  </div>
                </div>
              </label>

              {/* Service 3: Liftgate Delivery */}
              <label className="border-border hover:border-primary/40 bg-card flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors">
                <div className="flex items-start gap-3">
                  <Checkbox checked={addLiftgate} onCheckedChange={(val) => setAddLiftgate(Boolean(val))} />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-medium">Liftgate at Delivery</span>
                      <Badge variant="outline" className="text-xs font-normal tabular-nums">
                        +{formatMoney(LIFTGATE_USD)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Hydraulic liftgate truck delivery for destinations without a dedicated loading dock.
                    </p>
                  </div>
                </div>
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sticky Instant Rate Quotes Card (5 cols) */}
        <div className="space-y-6 lg:sticky lg:top-8 lg:col-span-5">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Instant Spot Rates
                </span>
                <Badge variant="default" className="gap-1 text-xs">
                  <Sparkles className="size-3" />
                  Live Quote
                </Badge>
              </div>

              {/* Route Preview */}
              <div className="border-border/60 mt-2 flex flex-wrap items-center justify-between border-b pb-3 text-xs">
                <div className="text-foreground flex items-center gap-1.5 font-medium">
                  <span>{origin}</span>
                  <ArrowRight className="text-muted-foreground size-3" />
                  <span>{destination}</span>
                </div>
                <span className="text-muted-foreground tabular-nums">
                  {pallets} Pallets · {totalVolumeCbm.toFixed(2)} CBM
                </span>
              </div>

              {/* Primary Selected Quote Header */}
              <div className="mt-4 space-y-1">
                <div className="text-muted-foreground text-xs font-medium">Total Estimated Landed Freight Cost</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground text-4xl font-bold tracking-tight tabular-nums">
                    {formatMoney(activeTotalPriceUsd)}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">({currentCurrency.code})</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-3 pt-1 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="text-primary size-3" />
                    Transit: {activeTransitTime}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Leaf className="size-3 text-emerald-500" />
                    Est. {activeCarbonEmission}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {/* Rate Quotes Comparison Cards */}
              <div className="space-y-2">
                <span className="text-foreground text-xs font-semibold tracking-wider uppercase">
                  Compare Multimodal Options:
                </span>

                {/* Option 1: Ocean FCL */}
                <div
                  className={cn(
                    'border-border hover:border-primary/50 cursor-pointer rounded-lg border p-3 transition-all',
                    selectedMode === 'ocean-fcl' ? 'border-primary bg-primary/5 ring-primary ring-1' : 'bg-card',
                  )}
                  onClick={() => setSelectedMode('ocean-fcl')}
                >
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ship className="text-primary size-4 shrink-0" />
                      <div>
                        <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                          Ocean FCL (20ft Container)
                          <Badge variant="default" className="px-1.5 py-0.5 text-xs">
                            Recommended
                          </Badge>
                        </div>
                        <div className="text-muted-foreground text-xs">Transit: 14-18 days · 1.2 tCO2</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-foreground text-sm font-bold tabular-nums">
                        {formatMoney(oceanFclBaseUsd + addonsTotalUsd)}
                      </div>
                      <div className="text-muted-foreground text-xs">Port-to-Port</div>
                    </div>
                  </div>
                </div>

                {/* Option 2: Ocean LCL */}
                <div
                  className={cn(
                    'border-border hover:border-primary/50 cursor-pointer rounded-lg border p-3 transition-all',
                    selectedMode === 'ocean-lcl' ? 'border-primary bg-primary/5 ring-primary ring-1' : 'bg-card',
                  )}
                  onClick={() => setSelectedMode('ocean-lcl')}
                >
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Boxes className="text-primary size-4 shrink-0" />
                      <div>
                        <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                          Ocean LCL (Shared)
                          <Badge variant="outline" className="px-1.5 py-0.5 text-xs font-normal">
                            Economy
                          </Badge>
                        </div>
                        <div className="text-muted-foreground text-xs">Transit: 18-22 days · 0.8 tCO2</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-foreground text-sm font-bold tabular-nums">
                        {formatMoney(oceanLclBaseUsd + addonsTotalUsd)}
                      </div>
                      <div className="text-muted-foreground text-xs">CFS-to-CFS</div>
                    </div>
                  </div>
                </div>

                {/* Option 3: Express Air Freight */}
                <div
                  className={cn(
                    'border-border hover:border-primary/50 cursor-pointer rounded-lg border p-3 transition-all',
                    selectedMode === 'air' ? 'border-primary bg-primary/5 ring-primary ring-1' : 'bg-card',
                  )}
                  onClick={() => setSelectedMode('air')}
                >
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plane className="text-primary size-4 shrink-0" />
                      <div>
                        <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                          Express Air Freight
                          <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                            Fastest
                          </Badge>
                        </div>
                        <div className="text-muted-foreground text-xs">Transit: 3-5 days · 4.8 tCO2</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-foreground text-sm font-bold tabular-nums">
                        {formatMoney(airFreightBaseUsd + addonsTotalUsd)}
                      </div>
                      <div className="text-muted-foreground text-xs">Airport-to-Airport</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cost Breakdown Table */}
              <div className="space-y-2 text-xs">
                <span className="text-muted-foreground font-medium tracking-wider uppercase">Itemized Breakdown</span>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between">
                    <span className="text-muted-foreground">Base Freight Carrier Rate</span>
                    <span className="text-foreground font-medium tabular-nums">{formatMoney(activeBasePriceUsd)}</span>
                  </div>
                  {addCustoms && (
                    <div className="flex flex-wrap items-center justify-between">
                      <span className="text-muted-foreground">Customs Clearance Service</span>
                      <span className="text-foreground font-medium tabular-nums">+{formatMoney(CUSTOMS_USD)}</span>
                    </div>
                  )}
                  {addInsurance && (
                    <div className="flex flex-wrap items-center justify-between">
                      <span className="text-muted-foreground">All-Risk Cargo Insurance</span>
                      <span className="text-foreground font-medium tabular-nums">+{formatMoney(INSURANCE_USD)}</span>
                    </div>
                  )}
                  {addLiftgate && (
                    <div className="flex flex-wrap items-center justify-between">
                      <span className="text-muted-foreground">Destination Liftgate Equipment</span>
                      <span className="text-foreground font-medium tabular-nums">+{formatMoney(LIFTGATE_USD)}</span>
                    </div>
                  )}
                  <div className="text-muted-foreground flex flex-wrap items-center justify-between">
                    <span>Bunker / Fuel Surcharge (BAF)</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Included</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Trust / Guarantee Points */}
              <ul className="text-muted-foreground space-y-1.5 text-xs">
                <li className="flex items-center gap-2">
                  <Check className="text-primary size-3.5 shrink-0" />
                  <span>Rate locked for 7 calendar days</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary size-3.5 shrink-0" />
                  <span>IATA &amp; FMC compliant licensed forwarders</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary size-3.5 shrink-0" />
                  <span>Automated EDI customs documentation &amp; bill of lading</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter className="flex flex-col gap-2.5 pt-2">
              {/* Book Button */}
              <Button className="w-full gap-2 font-semibold shadow-xs" size="lg" onClick={handleBookQuote}>
                {isBooked ? (
                  <>
                    <CheckCircle2 className="size-4 text-emerald-300" />
                    Freight Quote Booked!
                  </>
                ) : (
                  <>
                    Book Freight Quote
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>

              {/* Download PDF Button */}
              <Button
                aria-label="Download attachment"
                variant="outline"
                className="w-full gap-2 text-xs"
                size="default"
                onClick={handleDownloadPdf}
              >
                {!isDownloading ? <Download className="size-3.5" /> : <FileText className="size-3.5 animate-pulse" />}
                {isDownloading ? 'Generating PDF Manifest...' : 'Download Detailed Quote PDF'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
