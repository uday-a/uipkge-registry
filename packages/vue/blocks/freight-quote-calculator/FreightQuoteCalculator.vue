<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface Props {
  initialOrigin?: string
  initialDestination?: string
  initialPallets?: number
  initialLengthCm?: number
  initialWidthCm?: number
  initialHeightCm?: number
  initialGrossWeightKg?: number
  initialCurrency?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialOrigin: 'CNSHA',
  initialDestination: 'USLAX',
  initialPallets: 6,
  initialLengthCm: 120,
  initialWidthCm: 80,
  initialHeightCm: 160,
  initialGrossWeightKg: 400,
  initialCurrency: 'USD',
})

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
  rate: number // USD to currency
}

const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', label: 'USD ($)', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£)', rate: 0.79 },
  CNY: { code: 'CNY', symbol: '¥', label: 'CNY (¥)', rate: 7.23 },
  SGD: { code: 'SGD', symbol: 'S$', label: 'SGD (S$)', rate: 1.34 },
}

// Reactive Form State
const origin = ref(props.initialOrigin)
const destination = ref(props.initialDestination)
const pallets = ref(props.initialPallets)
const lengthCm = ref(props.initialLengthCm)
const widthCm = ref(props.initialWidthCm)
const heightCm = ref(props.initialHeightCm)
const grossWeightKg = ref(props.initialGrossWeightKg)
const selectedCurrency = ref(props.initialCurrency)

// Add-on Services
const addCustoms = ref(false)
const addInsurance = ref(false)
const addLiftgate = ref(false)

// Selected Freight Quote Option
type FreightMode = 'ocean-fcl' | 'ocean-lcl' | 'air' | 'ground'
const selectedMode = ref<FreightMode>('ocean-fcl')

// UI Feedback States
const isBooked = ref(false)
const isDownloading = ref(false)

function swapRoute() {
  const temp = origin.value
  origin.value = destination.value
  destination.value = temp
}

// Calculations
// 1. Single pallet volume in CBM = (L * W * H) / 1,000,000
const singlePalletVolumeCbm = computed(() => {
  const l = Number(lengthCm.value) || 0
  const w = Number(widthCm.value) || 0
  const h = Number(heightCm.value) || 0
  return (l * w * h) / 1_000_000
})

// 2. Total Volume in CBM
const totalVolumeCbm = computed(() => {
  const count = Number(pallets.value) || 0
  return count * singlePalletVolumeCbm.value
})

// 3. Total Actual Gross Weight in KG
const totalGrossWeightKg = computed(() => {
  const count = Number(pallets.value) || 0
  const unitWeight = Number(grossWeightKg.value) || 0
  return count * unitWeight
})

// 4. Air Volumetric Chargeable Weight (IATA 1 CBM = 166.67 kg)
const airVolumetricWeightKg = computed(() => {
  return Math.round(totalVolumeCbm.value * (1000 / 6)) // 1 CBM = 166.6667 kg -> 9.216 * 166.6667 = 1536 kg
})

// 5. Mode-Specific Chargeable Weight
const chargeableWeightKg = computed(() => {
  return Math.max(totalGrossWeightKg.value, airVolumetricWeightKg.value)
})

// Currency Formatting Helper
const currentCurrency = computed(() => CURRENCIES[selectedCurrency.value] ?? CURRENCIES.USD)

function formatMoney(amountInUsd: number): string {
  const converted = amountInUsd * currentCurrency.value.rate
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currentCurrency.value.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted)
}

// Base USD Pricing calculation based on volume, weight, pallets
const fclContainersCount = computed(() => Math.max(1, Math.ceil(pallets.value / 10)))

// Option 1: Ocean FCL 20ft Container
const oceanFclBaseUsd = computed(() => {
  // 1x 20ft container handles up to 10 pallets / 28 CBM: $2,850.00 baseline
  return fclContainersCount.value * 2850
})

// Option 2: Ocean LCL (Shared Container by CBM)
const oceanLclBaseUsd = computed(() => {
  // $140 per CBM + $130 CFS handling/consolidation
  const cbm = totalVolumeCbm.value || 1
  return Math.round(cbm * 140 + 130)
})

// Option 3: Express Air Freight (by Air Volumetric / Chargeable kg)
const airFreightBaseUsd = computed(() => {
  // $4.18 per kg of air volumetric chargeable weight
  const weight = airVolumetricWeightKg.value || 100
  return Math.round(weight * 4.18)
})

// Option 4: Ground Freight Trucking (LTL / Pallet rate)
const groundFreightBaseUsd = computed(() => {
  const count = Number(pallets.value) || 1
  return count * 265
})

// Value-added services in USD
const CUSTOMS_USD = 150
const INSURANCE_USD = 85
const LIFTGATE_USD = 50

const addonsTotalUsd = computed(() => {
  let sum = 0
  if (addCustoms.value) sum += CUSTOMS_USD
  if (addInsurance.value) sum += INSURANCE_USD
  if (addLiftgate.value) sum += LIFTGATE_USD
  return sum
})

// Active Selected Option Calculations
const activeBasePriceUsd = computed(() => {
  switch (selectedMode.value) {
    case 'ocean-fcl':
      return oceanFclBaseUsd.value
    case 'ocean-lcl':
      return oceanLclBaseUsd.value
    case 'air':
      return airFreightBaseUsd.value
    case 'ground':
      return groundFreightBaseUsd.value
    default:
      return oceanFclBaseUsd.value
  }
})

const activeTotalPriceUsd = computed(() => {
  return activeBasePriceUsd.value + addonsTotalUsd.value
})

const activeTransitTime = computed(() => {
  switch (selectedMode.value) {
    case 'ocean-fcl':
      return '14-18 days'
    case 'ocean-lcl':
      return '18-22 days'
    case 'air':
      return '3-5 days'
    case 'ground':
      return '5-7 days'
  }
})

const activeCarbonEmission = computed(() => {
  switch (selectedMode.value) {
    case 'ocean-fcl':
      return `${(1.2 * fclContainersCount.value).toFixed(1)} tCO2`
    case 'ocean-lcl':
      return `${(totalVolumeCbm.value * 0.087).toFixed(1)} tCO2`
    case 'air':
      return `${(airVolumetricWeightKg.value * 0.003125).toFixed(1)} tCO2`
    case 'ground':
      return `${(pallets.value * 0.26).toFixed(1)} tCO2`
  }
})

function handleBookQuote() {
  isBooked.value = true
  setTimeout(() => {
    isBooked.value = false
  }, 3500)
}

function handleDownloadPdf() {
  isDownloading.value = true
  setTimeout(() => {
    isDownloading.value = false
  }, 2000)
}
</script>

<template>
  <div
    data-slot="freight-quote-calculator"
    :class="cn('mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8', props.class)"
  >
    <!-- Header Section -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <Badge variant="outline" class="gap-1.5 px-2.5 py-0.5 text-xs font-medium">
            <Boxes class="text-primary size-3.5" />
            Multimodal Logistics
          </Badge>
          <Badge variant="secondary" class="text-xs font-normal"> Spot Rates Live </Badge>
        </div>
        <h2 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          Freight Rate &amp; Cargo Quote Calculator
        </h2>
        <p class="text-muted-foreground text-sm">
          Compare spot rates across Ocean FCL/LCL, Air Freight, and Ground Trucking with instant CBM volumetric
          analysis.
        </p>
      </div>

      <!-- Currency Selector -->
      <div class="flex items-center gap-2 sm:self-start">
        <span class="text-muted-foreground text-xs font-medium">Currency:</span>
        <Select v-model="selectedCurrency">
          <SelectTrigger class="w-[125px] text-xs font-medium">
            <SelectValue :placeholder="selectedCurrency" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem v-for="curr in CURRENCIES" :key="curr.code" :value="curr.code" class="text-xs">
              {{ curr.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Main 2-Column Layout -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      <!-- Left Column: Input Form & Volumetric Calculator (7 cols) -->
      <div class="space-y-6 lg:col-span-7">
        <!-- 1. Route Configuration Card -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex flex-wrap items-center justify-between">
              <CardTitle class="text-base font-semibold">1. Shipping Route</CardTitle>
              <span class="text-muted-foreground text-xs font-medium">International Corridors</span>
            </div>
            <CardDescription class="text-xs">
              Select origin loading port and destination discharge terminal.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-[1fr,auto,1fr] sm:items-end">
              <!-- Origin -->
              <div class="space-y-1.5">
                <label for="route-origin" class="text-foreground text-xs font-medium"> Origin (Port / Hub) </label>
                <Select v-model="origin">
                  <SelectTrigger id="route-origin" class="text-xs [&_svg]:shrink-0 [&>span]:truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="p in ORIGIN_PORTS" :key="p.code" :value="p.code" class="text-xs">
                      {{ p.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Swap Button -->
              <div class="flex justify-center pb-0.5 sm:pb-0">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  class="size-9 shrink-0"
                  aria-label="Swap Origin and Destination"
                  @click="swapRoute"
                >
                  <ArrowLeftRight class="size-4" />
                </Button>
              </div>

              <!-- Destination -->
              <div class="space-y-1.5">
                <label for="route-destination" class="text-foreground text-xs font-medium">
                  Destination (Port / Hub)
                </label>
                <Select v-model="destination">
                  <SelectTrigger id="route-destination" class="text-xs [&_svg]:shrink-0 [&>span]:truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="p in DESTINATION_PORTS" :key="p.code" :value="p.code" class="text-xs">
                      {{ p.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <!-- Route Info Banner -->
            <div
              class="bg-muted/40 border-border/80 flex flex-wrap items-center justify-between rounded-lg border px-3 py-2 text-xs"
            >
              <div class="flex items-center gap-2">
                <Ship class="text-primary size-4 shrink-0" />
                <span class="text-foreground font-medium">Transpacific Direct Corridor</span>
              </div>
              <span class="text-muted-foreground tabular-nums">Distance: ~5,800 NM (10,740 km)</span>
            </div>
          </CardContent>
        </Card>

        <!-- 2. Cargo Type & Mode Selector -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex flex-wrap items-center justify-between">
              <CardTitle class="text-base font-semibold">2. Cargo Freight Mode</CardTitle>
              <span class="text-muted-foreground text-xs">Select primary transport</span>
            </div>
            <CardDescription class="text-xs">
              Choose your preferred multimodal transit mode to evaluate rates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <!-- Ocean FCL -->
              <button
                type="button"
                :class="
                  cn(
                    'border-border focus-visible:ring-ring relative flex flex-col justify-between gap-3 rounded-lg border p-3.5 text-left transition-all outline-none focus-visible:ring-2',
                    selectedMode === 'ocean-fcl'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'hover:border-border/80 hover:bg-muted/30 bg-card',
                  )
                "
                @click="selectedMode = 'ocean-fcl'"
              >
                <div class="flex w-full items-start justify-between">
                  <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                    <Ship class="size-4" />
                  </div>
                  <Badge variant="default" class="text-xs">Recommended</Badge>
                </div>
                <div>
                  <div class="text-foreground text-sm font-semibold">Ocean FCL (Full Container)</div>
                  <div class="text-muted-foreground mt-0.5 text-xs">20ft / 40ft dedicated sea freight container</div>
                </div>
                <div class="border-border/50 flex w-full items-center justify-between border-t pt-1 text-xs">
                  <span class="text-muted-foreground">Est. Transit: 14-18 days</span>
                  <span class="text-foreground font-semibold tabular-nums">{{ formatMoney(oceanFclBaseUsd) }}</span>
                </div>
              </button>

              <!-- Ocean LCL -->
              <button
                type="button"
                :class="
                  cn(
                    'border-border focus-visible:ring-ring relative flex flex-col justify-between gap-3 rounded-lg border p-3.5 text-left transition-all outline-none focus-visible:ring-2',
                    selectedMode === 'ocean-lcl'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'hover:border-border/80 hover:bg-muted/30 bg-card',
                  )
                "
                @click="selectedMode = 'ocean-lcl'"
              >
                <div class="flex w-full items-start justify-between">
                  <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                    <Boxes class="size-4" />
                  </div>
                  <Badge variant="outline" class="text-xs font-normal">Economy</Badge>
                </div>
                <div>
                  <div class="text-foreground text-sm font-semibold">Ocean LCL (Shared)</div>
                  <div class="text-muted-foreground mt-0.5 text-xs">Consolidated sea freight priced by CBM volume</div>
                </div>
                <div class="border-border/50 flex w-full items-center justify-between border-t pt-1 text-xs">
                  <span class="text-muted-foreground">Est. Transit: 18-22 days</span>
                  <span class="text-foreground font-semibold tabular-nums">{{ formatMoney(oceanLclBaseUsd) }}</span>
                </div>
              </button>

              <!-- Express Air Freight -->
              <button
                type="button"
                :class="
                  cn(
                    'border-border focus-visible:ring-ring relative flex flex-col justify-between gap-3 rounded-lg border p-3.5 text-left transition-all outline-none focus-visible:ring-2',
                    selectedMode === 'air'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'hover:border-border/80 hover:bg-muted/30 bg-card',
                  )
                "
                @click="selectedMode = 'air'"
              >
                <div class="flex w-full items-start justify-between">
                  <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                    <Plane class="size-4" />
                  </div>
                  <Badge variant="secondary" class="text-xs">Fastest</Badge>
                </div>
                <div>
                  <div class="text-foreground text-sm font-semibold">Express Air Freight</div>
                  <div class="text-muted-foreground mt-0.5 text-xs">Priority belly/freighter aircraft dispatch</div>
                </div>
                <div class="border-border/50 flex w-full items-center justify-between border-t pt-1 text-xs">
                  <span class="text-muted-foreground">Est. Transit: 3-5 days</span>
                  <span class="text-foreground font-semibold tabular-nums">{{ formatMoney(airFreightBaseUsd) }}</span>
                </div>
              </button>

              <!-- Ground Freight -->
              <button
                type="button"
                :class="
                  cn(
                    'border-border focus-visible:ring-ring relative flex flex-col justify-between gap-3 rounded-lg border p-3.5 text-left transition-all outline-none focus-visible:ring-2',
                    selectedMode === 'ground'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'hover:border-border/80 hover:bg-muted/30 bg-card',
                  )
                "
                @click="selectedMode = 'ground'"
              >
                <div class="flex w-full items-start justify-between">
                  <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                    <Truck class="size-4" />
                  </div>
                  <Badge variant="outline" class="text-xs font-normal">Overland</Badge>
                </div>
                <div>
                  <div class="text-foreground text-sm font-semibold">Ground Freight</div>
                  <div class="text-muted-foreground mt-0.5 text-xs">
                    Regional linehaul, FTL &amp; pallet LTL trucking
                  </div>
                </div>
                <div class="border-border/50 flex w-full items-center justify-between border-t pt-1 text-xs">
                  <span class="text-muted-foreground">Est. Transit: 5-7 days</span>
                  <span class="text-foreground font-semibold tabular-nums">{{
                    formatMoney(groundFreightBaseUsd)
                  }}</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <!-- 3. Package Dimensions & Volumetric CBM Calculator -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex flex-wrap items-center justify-between">
              <CardTitle class="text-base font-semibold">3. Cargo Dimensions &amp; Volumetric Weight</CardTitle>
              <Badge variant="outline" class="gap-1 text-xs font-normal">
                <Scale class="text-primary size-3" />
                IATA 1:6 Standard
              </Badge>
            </div>
            <CardDescription class="text-xs">
              Enter pallet quantity, unit dimensions, and individual gross weight.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-5">
            <!-- Dimensions Inputs Grid -->
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div class="col-span-2 space-y-1.5 sm:col-span-1">
                <label for="dim-pallets" class="text-foreground text-xs font-medium">Quantity</label>
                <div class="relative">
                  <Input
                    id="dim-pallets"
                    v-model.number="pallets"
                    type="number"
                    min="1"
                    max="100"
                    class="pr-8 text-xs tabular-nums"
                  />
                  <span class="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">pal</span>
                </div>
              </div>

              <div class="space-y-1.5">
                <label for="dim-length" class="text-foreground text-xs font-medium">Length (L)</label>
                <div class="relative">
                  <Input
                    id="dim-length"
                    v-model.number="lengthCm"
                    type="number"
                    min="10"
                    max="1000"
                    class="pr-8 text-xs tabular-nums"
                  />
                  <span class="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">cm</span>
                </div>
              </div>

              <div class="space-y-1.5">
                <label for="dim-width" class="text-foreground text-xs font-medium">Width (W)</label>
                <div class="relative">
                  <Input
                    id="dim-width"
                    v-model.number="widthCm"
                    type="number"
                    min="10"
                    max="1000"
                    class="pr-8 text-xs tabular-nums"
                  />
                  <span class="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">cm</span>
                </div>
              </div>

              <div class="space-y-1.5">
                <label for="dim-height" class="text-foreground text-xs font-medium">Height (H)</label>
                <div class="relative">
                  <Input
                    id="dim-height"
                    v-model.number="heightCm"
                    type="number"
                    min="10"
                    max="1000"
                    class="pr-8 text-xs tabular-nums"
                  />
                  <span class="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">cm</span>
                </div>
              </div>

              <div class="col-span-2 space-y-1.5 sm:col-span-1">
                <label for="dim-weight" class="text-foreground text-xs font-medium">Weight/Pallet</label>
                <div class="relative">
                  <Input
                    id="dim-weight"
                    v-model.number="grossWeightKg"
                    type="number"
                    min="1"
                    max="5000"
                    class="pr-8 text-xs tabular-nums"
                  />
                  <span class="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">kg</span>
                </div>
              </div>
            </div>

            <!-- Computed Volumetric Display Cards -->
            <div class="border-border/80 bg-muted/30 space-y-3 rounded-lg border p-4">
              <div class="flex flex-wrap items-center justify-between text-xs">
                <span class="text-foreground flex items-center gap-1.5 font-semibold">
                  <Package class="text-primary size-3.5" />
                  Cargo Metric Computations
                </span>
                <span class="text-muted-foreground">Standard Euro/US Pallet Basis</span>
              </div>

              <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <!-- Metric 1: Total Volume -->
                <div class="bg-card border-border/80 rounded-md border p-2.5">
                  <div class="text-muted-foreground text-xs">Total Volume</div>
                  <div class="text-foreground mt-0.5 text-lg font-bold tabular-nums">
                    {{ totalVolumeCbm.toFixed(2) }} <span class="text-muted-foreground text-xs font-normal">CBM</span>
                  </div>
                  <div class="text-muted-foreground mt-1 text-xs">{{ singlePalletVolumeCbm.toFixed(2) }} m³ / unit</div>
                </div>

                <!-- Metric 2: Actual Gross Weight -->
                <div class="bg-card border-border/80 rounded-md border p-2.5">
                  <div class="text-muted-foreground text-xs">Actual Gross Wt.</div>
                  <div class="text-foreground mt-0.5 text-lg font-bold tabular-nums">
                    {{ totalGrossWeightKg.toLocaleString('en-US') }}
                    <span class="text-muted-foreground text-xs font-normal">kg</span>
                  </div>
                  <div class="text-muted-foreground mt-1 text-xs">{{ pallets }} × {{ grossWeightKg }} kg</div>
                </div>

                <!-- Metric 3: Air Volumetric Weight -->
                <div class="bg-card border-border/80 rounded-md border p-2.5">
                  <div class="text-muted-foreground text-xs">Chargeable Wt. (Air)</div>
                  <div class="text-foreground mt-0.5 text-lg font-bold tabular-nums">
                    {{ airVolumetricWeightKg.toLocaleString('en-US') }}
                    <span class="text-muted-foreground text-xs font-normal">kg</span>
                  </div>
                  <div class="text-muted-foreground mt-1 text-xs">Volumetric (1:6000)</div>
                </div>

                <!-- Metric 4: Ocean Revenue Ton -->
                <div class="bg-card border-border/80 rounded-md border p-2.5">
                  <div class="text-muted-foreground text-xs">Ocean Revenue Ton</div>
                  <div class="text-foreground mt-0.5 text-lg font-bold tabular-nums">
                    {{ Math.max(totalVolumeCbm, totalGrossWeightKg / 1000).toFixed(2) }}
                    <span class="text-muted-foreground text-xs font-normal">RT</span>
                  </div>
                  <div class="text-muted-foreground mt-1 text-xs">Max(CBM, Weight/T)</div>
                </div>
              </div>

              <!-- Note -->
              <p class="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                <Info class="text-primary size-3.5 shrink-0" />
                <span
                  >Computed Total Volume ({{ totalVolumeCbm.toFixed(2) }} CBM) &amp; Chargeable Weight ({{
                    airVolumetricWeightKg.toLocaleString('en-US')
                  }}
                  kg) apply dynamically to quotes.</span
                >
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- 4. Value-Added Services -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <CardTitle class="text-base font-semibold">4. Value-Added Freight Services</CardTitle>
              <span class="text-muted-foreground text-xs font-medium">Optional Add-ons</span>
            </div>
            <CardDescription class="text-xs">
              Enhance shipment handling with customs, all-risk insurance, and destination equipment.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <!-- Service 1: Customs Clearance -->
            <label
              class="border-border hover:border-primary/40 bg-card flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors"
            >
              <div class="flex items-start gap-3">
                <Checkbox :model-value="addCustoms" @update:model-value="(val) => (addCustoms = Boolean(val))" />
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-foreground text-sm font-medium">Customs Clearance</span>
                    <Badge variant="outline" class="text-xs font-normal tabular-nums">
                      +{{ formatMoney(CUSTOMS_USD) }}
                    </Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Export filing, ISF 10+2 documentation, automated customs broker import clearance.
                  </p>
                </div>
              </div>
            </label>

            <!-- Service 2: Cargo Insurance -->
            <label
              class="border-border hover:border-primary/40 bg-card flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors"
            >
              <div class="flex items-start gap-3">
                <Checkbox :model-value="addInsurance" @update:model-value="(val) => (addInsurance = Boolean(val))" />
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-foreground text-sm font-medium">All-Risk Cargo Insurance</span>
                    <Badge variant="outline" class="text-xs font-normal tabular-nums">
                      +{{ formatMoney(INSURANCE_USD) }}
                    </Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Comprehensive door-to-door insurance coverage up to $100,000 against damage or loss.
                  </p>
                </div>
              </div>
            </label>

            <!-- Service 3: Liftgate Delivery -->
            <label
              class="border-border hover:border-primary/40 bg-card flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors"
            >
              <div class="flex items-start gap-3">
                <Checkbox :model-value="addLiftgate" @update:model-value="(val) => (addLiftgate = Boolean(val))" />
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-foreground text-sm font-medium">Liftgate at Delivery</span>
                    <Badge variant="outline" class="text-xs font-normal tabular-nums">
                      +{{ formatMoney(LIFTGATE_USD) }}
                    </Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Hydraulic liftgate truck delivery for destinations without a dedicated loading dock.
                  </p>
                </div>
              </div>
            </label>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Sticky Instant Rate Quotes Card (5 cols) -->
      <div class="space-y-6 lg:sticky lg:top-8 lg:col-span-5">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex flex-wrap items-center justify-between">
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Instant Spot Rates
              </span>
              <Badge variant="default" class="gap-1 text-xs">
                <Sparkles class="size-3" />
                Live Quote
              </Badge>
            </div>

            <!-- Route Preview -->
            <div class="border-border/60 mt-2 flex flex-wrap items-center justify-between border-b pb-3 text-xs">
              <div class="text-foreground flex items-center gap-1.5 font-medium">
                <span>{{ origin }}</span>
                <ArrowRight class="text-muted-foreground size-3" />
                <span>{{ destination }}</span>
              </div>
              <span class="text-muted-foreground tabular-nums"
                >{{ pallets }} Pallets · {{ totalVolumeCbm.toFixed(2) }} CBM</span
              >
            </div>

            <!-- Primary Selected Quote Header -->
            <div class="mt-4 space-y-1">
              <div class="text-muted-foreground text-xs font-medium">Total Estimated Landed Freight Cost</div>
              <div class="flex items-baseline gap-2">
                <span class="text-foreground text-4xl font-bold tracking-tight tabular-nums">
                  {{ formatMoney(activeTotalPriceUsd) }}
                </span>
                <span class="text-muted-foreground text-xs font-medium"> ({{ currentCurrency.code }}) </span>
              </div>
              <div class="text-muted-foreground flex items-center gap-3 pt-1 text-xs">
                <span class="flex items-center gap-1">
                  <Clock class="text-primary size-3" />
                  Transit: {{ activeTransitTime }}
                </span>
                <span>·</span>
                <span class="flex items-center gap-1">
                  <Leaf class="size-3 text-emerald-500" />
                  Est. {{ activeCarbonEmission }}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-0">
            <!-- Rate Quotes Comparison Cards -->
            <div class="space-y-2">
              <span class="text-foreground text-xs font-semibold tracking-wider uppercase">
                Compare Multimodal Options:
              </span>

              <!-- Option 1: Ocean FCL -->
              <div
                :class="
                  cn(
                    'border-border hover:border-primary/50 cursor-pointer rounded-lg border p-3 transition-all',
                    selectedMode === 'ocean-fcl' ? 'border-primary bg-primary/5 ring-primary ring-1' : 'bg-card',
                  )
                "
                @click="selectedMode = 'ocean-fcl'"
              >
                <div class="flex flex-wrap items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Ship class="text-primary size-4 shrink-0" />
                    <div>
                      <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                        Ocean FCL (20ft Container)
                        <Badge variant="default" class="px-1.5 py-0.5 text-xs">Recommended</Badge>
                      </div>
                      <div class="text-muted-foreground text-xs">Transit: 14-18 days · 1.2 tCO2</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-foreground text-sm font-bold tabular-nums">
                      {{ formatMoney(oceanFclBaseUsd + addonsTotalUsd) }}
                    </div>
                    <div class="text-muted-foreground text-xs">Port-to-Port</div>
                  </div>
                </div>
              </div>

              <!-- Option 2: Ocean LCL -->
              <div
                :class="
                  cn(
                    'border-border hover:border-primary/50 cursor-pointer rounded-lg border p-3 transition-all',
                    selectedMode === 'ocean-lcl' ? 'border-primary bg-primary/5 ring-primary ring-1' : 'bg-card',
                  )
                "
                @click="selectedMode = 'ocean-lcl'"
              >
                <div class="flex flex-wrap items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Boxes class="text-primary size-4 shrink-0" />
                    <div>
                      <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                        Ocean LCL (Shared)
                        <Badge variant="outline" class="px-1.5 py-0.5 text-xs font-normal">Economy</Badge>
                      </div>
                      <div class="text-muted-foreground text-xs">Transit: 18-22 days · 0.8 tCO2</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-foreground text-sm font-bold tabular-nums">
                      {{ formatMoney(oceanLclBaseUsd + addonsTotalUsd) }}
                    </div>
                    <div class="text-muted-foreground text-xs">CFS-to-CFS</div>
                  </div>
                </div>
              </div>

              <!-- Option 3: Express Air Freight -->
              <div
                :class="
                  cn(
                    'border-border hover:border-primary/50 cursor-pointer rounded-lg border p-3 transition-all',
                    selectedMode === 'air' ? 'border-primary bg-primary/5 ring-primary ring-1' : 'bg-card',
                  )
                "
                @click="selectedMode = 'air'"
              >
                <div class="flex flex-wrap items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Plane class="text-primary size-4 shrink-0" />
                    <div>
                      <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                        Express Air Freight
                        <Badge variant="secondary" class="px-1.5 py-0.5 text-xs">Fastest</Badge>
                      </div>
                      <div class="text-muted-foreground text-xs">Transit: 3-5 days · 4.8 tCO2</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-foreground text-sm font-bold tabular-nums">
                      {{ formatMoney(airFreightBaseUsd + addonsTotalUsd) }}
                    </div>
                    <div class="text-muted-foreground text-xs">Airport-to-Airport</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <!-- Cost Breakdown Table -->
            <div class="space-y-2 text-xs">
              <span class="text-muted-foreground font-medium tracking-wider uppercase">Itemized Breakdown</span>
              <div class="space-y-1.5">
                <div class="flex flex-wrap items-center justify-between">
                  <span class="text-muted-foreground">Base Freight Carrier Rate</span>
                  <span class="text-foreground font-medium tabular-nums">{{ formatMoney(activeBasePriceUsd) }}</span>
                </div>
                <div v-if="addCustoms" class="flex flex-wrap items-center justify-between">
                  <span class="text-muted-foreground">Customs Clearance Service</span>
                  <span class="text-foreground font-medium tabular-nums">+{{ formatMoney(CUSTOMS_USD) }}</span>
                </div>
                <div v-if="addInsurance" class="flex flex-wrap items-center justify-between">
                  <span class="text-muted-foreground">All-Risk Cargo Insurance</span>
                  <span class="text-foreground font-medium tabular-nums">+{{ formatMoney(INSURANCE_USD) }}</span>
                </div>
                <div v-if="addLiftgate" class="flex flex-wrap items-center justify-between">
                  <span class="text-muted-foreground">Destination Liftgate Equipment</span>
                  <span class="text-foreground font-medium tabular-nums">+{{ formatMoney(LIFTGATE_USD) }}</span>
                </div>
                <div class="text-muted-foreground flex flex-wrap items-center justify-between">
                  <span>Bunker / Fuel Surcharge (BAF)</span>
                  <span class="font-medium text-emerald-600 dark:text-emerald-400">Included</span>
                </div>
              </div>
            </div>

            <Separator />

            <!-- Trust / Guarantee Points -->
            <ul class="text-muted-foreground space-y-1.5 text-xs">
              <li class="flex items-center gap-2">
                <Check class="text-primary size-3.5 shrink-0" />
                <span>Rate locked for 7 calendar days</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="text-primary size-3.5 shrink-0" />
                <span>IATA &amp; FMC compliant licensed forwarders</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="text-primary size-3.5 shrink-0" />
                <span>Automated EDI customs documentation &amp; bill of lading</span>
              </li>
            </ul>
          </CardContent>

          <CardFooter class="flex flex-col gap-2.5 pt-2">
            <!-- Book Button -->
            <Button class="w-full gap-2 font-semibold shadow-xs" size="lg" @click="handleBookQuote">
              <template v-if="isBooked">
                <CheckCircle2 class="size-4 text-emerald-300" />
                Freight Quote Booked!
              </template>
              <template v-else>
                Book Freight Quote
                <ArrowRight class="size-4" />
              </template>
            </Button>

            <!-- Download PDF Button -->
            <Button
              aria-label="Download attachment"
              variant="outline"
              class="w-full gap-2 text-xs"
              size="default"
              @click="handleDownloadPdf"
            >
              <Download v-if="!isDownloading" class="size-3.5" />
              <FileText v-else class="size-3.5 animate-pulse" />
              {{ isDownloading ? 'Generating PDF Manifest...' : 'Download Detailed Quote PDF' }}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
