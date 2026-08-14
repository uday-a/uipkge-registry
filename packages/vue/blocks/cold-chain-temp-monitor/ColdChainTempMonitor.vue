<script setup lang="ts">
import { ref, computed, type HTMLAttributes } from 'vue'
import {
  Activity,
  Battery,
  Bell,
  Bluetooth,
  CheckCircle2,
  Download,
  Droplets,
  Flame,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Snowflake,
  ThermometerSnowflake,
  ThermometerSun,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface LogEntry {
  id: string
  timestamp: string
  timeAgo: string
  internalTemp: number
  ambientTemp: number
  deltaT: number
  probeLocation: string
  probeId: string
  humidity: number
  status: 'optimal' | 'in-spec' | 'warning' | 'breach'
  isLatest?: boolean
}

export interface ChartReading {
  time: string
  hourLabel: string
  internalTemp: number
  ambientTemp: number
  milestone: string
}

export interface ColdChainTempMonitorProps {
  shipmentId?: string
  shipmentTitle?: string
  tempClass?: string
  beaconId?: string
  protocolVersion?: string
  batteryPercent?: number
  batteryDays?: number
  currentInternalTemp?: number
  currentAmbientTemp?: number
  currentHumidity?: number
  totalExcursions?: number
  monitoringHours?: number
  logs?: LogEntry[]
  chartData?: ChartReading[]
  class?: HTMLAttributes['class']
}

const defaultChartData: ChartReading[] = [
  { time: '00:00', hourLabel: '00:00 UTC', internalTemp: -19.8, ambientTemp: 18.2, milestone: 'FRA Departure Tarmac' },
  { time: '03:00', hourLabel: '03:00 UTC', internalTemp: -20.4, ambientTemp: -4.5, milestone: 'Flight EK046 Climb' },
  {
    time: '06:00',
    hourLabel: '06:00 UTC',
    internalTemp: -20.8,
    ambientTemp: -6.2,
    milestone: 'Cruise Flight Level 380',
  },
  {
    time: '09:00',
    hourLabel: '09:00 UTC',
    internalTemp: -20.1,
    ambientTemp: 12.4,
    milestone: 'DXB Descent & Approach',
  },
  {
    time: '12:00',
    hourLabel: '12:00 UTC',
    internalTemp: -19.2,
    ambientTemp: 38.6,
    milestone: 'DXB Ramp Tarmac Transfer',
  },
  {
    time: '15:00',
    hourLabel: '15:00 UTC',
    internalTemp: -19.6,
    ambientTemp: 32.0,
    milestone: 'Perishable Hub Staging',
  },
  { time: '18:00', hourLabel: '18:00 UTC', internalTemp: -19.8, ambientTemp: 26.5, milestone: 'Active Reefer Bay #4' },
  {
    time: '21:00',
    hourLabel: '21:00 UTC',
    internalTemp: -19.5,
    ambientTemp: 25.0,
    milestone: 'Pre-Connection QA Inspection',
  },
  { time: '24:00', hourLabel: '14:30 UTC', internalTemp: -19.4, ambientTemp: 24.8, milestone: 'Dubai Hub Terminal 2' },
]

const defaultLogs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: 'Aug 21, 14:30 UTC',
    timeAgo: '24s ago',
    internalTemp: -19.4,
    ambientTemp: 24.8,
    deltaT: 44.2,
    probeLocation: 'Pallet Center Core',
    probeId: 'Probe #A1',
    humidity: 18,
    status: 'optimal',
    isLatest: true,
  },
  {
    id: 'log-2',
    timestamp: 'Aug 21, 14:00 UTC',
    timeAgo: '30m ago',
    internalTemp: -19.5,
    ambientTemp: 25.2,
    deltaT: 44.7,
    probeLocation: 'Upper Cargo Lid',
    probeId: 'Probe #B2',
    humidity: 18,
    status: 'optimal',
  },
  {
    id: 'log-3',
    timestamp: 'Aug 21, 13:30 UTC',
    timeAgo: '1h ago',
    internalTemp: -19.2,
    ambientTemp: 28.4,
    deltaT: 47.6,
    probeLocation: 'Lower Ventral Core',
    probeId: 'Probe #C1',
    humidity: 19,
    status: 'in-spec',
  },
  {
    id: 'log-4',
    timestamp: 'Aug 21, 13:00 UTC',
    timeAgo: '1.5h ago',
    internalTemp: -19.8,
    ambientTemp: 36.1,
    deltaT: 55.9,
    probeLocation: 'Pallet Center Core',
    probeId: 'Probe #A1',
    humidity: 20,
    status: 'optimal',
  },
  {
    id: 'log-5',
    timestamp: 'Aug 21, 12:30 UTC',
    timeAgo: '2h ago',
    internalTemp: -20.1,
    ambientTemp: 38.6,
    deltaT: 58.7,
    probeLocation: 'Outer Thermal Jacket',
    probeId: 'Probe #D4',
    humidity: 19,
    status: 'optimal',
  },
]

const props = withDefaults(defineProps<ColdChainTempMonitorProps>(), {
  shipmentId: '#CC-9482',
  shipmentTitle: 'Vaccine Cold-Chain Consignment #CC-9482',
  tempClass: 'Ultra-Cold Frozen · Target: -20°C ± 2°C',
  beaconId: 'SensorTag #BT-4892 · BLE 5.3',
  protocolVersion: 'IATA CEIV / WHO-PQS Standard',
  batteryPercent: 94,
  batteryDays: 180,
  currentInternalTemp: -19.4,
  currentAmbientTemp: 24.8,
  currentHumidity: 18,
  totalExcursions: 0,
  monitoringHours: 96,
})

const activeLogs = computed(() => props.logs ?? defaultLogs)
const activeChartData = computed(() => props.chartData ?? defaultChartData)

const isExporting = ref(false)
const exportNotification = ref(false)
const activeTimeframe = ref<'24h' | '48h' | '96h'>('24h')
const selectedReadingIndex = ref<number | null>(null)
const dryIceEnduranceHours = ref(72)
const dryIceCapacityPercent = ref(78)

function handleExportCSV() {
  isExporting.value = true
  setTimeout(() => {
    isExporting.value = false
    exportNotification.value = true
    setTimeout(() => {
      exportNotification.value = false
    }, 4500)
  }, 500)
}

// Coordinate mapping for SVG telemetry chart
// Internal Temp scale: -24°C (Y: 200) to -16°C (Y: 20)
// Setpoint -20°C -> Y: 110
// Upper threshold -18°C -> Y: 65
// Lower threshold -22°C -> Y: 155
const chartPoints = computed(() => {
  const data = activeChartData.value
  const svgWidth = 740
  const svgHeight = 220
  const paddingX = 40

  const usableWidth = svgWidth - paddingX * 2

  return data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * usableWidth
    // Map -24°C..-16°C to 195..25
    // formula: y = 110 - (temp - (-20)) * 22.5
    const yInternal = 110 - (d.internalTemp - -20) * 22.5
    // Map ambient -10°C..+45°C to 200..30
    const yAmbient = 180 - ((d.ambientTemp - -10) / 55) * 150

    return {
      x,
      yInternal,
      yAmbient,
      ...d,
    }
  })
})

const internalPath = computed(() => {
  const pts = chartPoints.value
  if (!pts.length) return ''
  let path = `M ${pts[0].x},${pts[0].yInternal}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cx = (prev.x + curr.x) / 2
    path += ` C ${cx},${prev.yInternal} ${cx},${curr.yInternal} ${curr.x},${curr.yInternal}`
  }
  return path
})

const internalArea = computed(() => {
  const pts = chartPoints.value
  if (!pts.length) return ''
  const firstX = pts[0].x
  const lastX = pts[pts.length - 1].x
  return `${internalPath.value} L ${lastX},210 L ${firstX},210 Z`
})

const ambientPath = computed(() => {
  const pts = chartPoints.value
  if (!pts.length) return ''
  let path = `M ${pts[0].x},${pts[0].yAmbient}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cx = (prev.x + curr.x) / 2
    path += ` C ${cx},${prev.yAmbient} ${cx},${curr.yAmbient} ${curr.x},${curr.yAmbient}`
  }
  return path
})
</script>

<template>
  <div data-slot="cold-chain-temp-monitor" :class="cn('mx-auto w-full max-w-6xl space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="flex items-center gap-2">
            <div
              class="flex size-9 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-600 shadow-xs dark:text-sky-400"
            >
              <Snowflake class="size-5" />
            </div>
            <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              {{ shipmentTitle }}
            </h1>
          </div>
          <!-- Temperature Class Badge in Sky Blue -->
          <Badge
            wrap
            variant="outline"
            class="gap-1.5 border-sky-500/30 bg-sky-500/10 text-xs font-medium text-sky-700 dark:text-sky-400"
          >
            <span class="size-1.5 rounded-full bg-sky-500" />
            <span>{{ tempClass }}</span>
          </Badge>
        </div>

        <div class="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <div class="flex items-center gap-1.5">
            <Bluetooth class="text-primary size-3.5" />
            <span class="text-foreground font-medium">{{ beaconId }}</span>
          </div>
          <span>·</span>
          <div class="flex items-center gap-1.5">
            <Battery class="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span class="text-foreground font-medium tabular-nums">{{ batteryPercent }}%</span>
            <span>({{ batteryDays }} days remaining)</span>
          </div>
          <span>·</span>
          <div class="flex items-center gap-1.5">
            <span class="relative flex size-2">
              <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span class="text-foreground font-medium">Live Telemetry</span>
            <span>· DXB Terminal 2 Transit</span>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex flex-wrap items-center gap-2.5">
        <Button
          aria-label="Download attachment"
          variant="outline"
          size="sm"
          class="gap-2 text-xs font-medium shadow-xs"
          :disabled="isExporting"
          @click="handleExportCSV"
        >
          <Download :class="['size-3.5', isExporting ? 'animate-bounce' : '']" />
          <span>{{ isExporting ? 'Exporting...' : 'Export Audit Log CSV' }}</span>
        </Button>
      </div>
    </div>

    <!-- Export Success Banner -->
    <div
      v-if="exportNotification"
      class="border-border bg-card text-card-foreground flex items-center justify-between gap-x-2 rounded-lg border p-3 text-xs shadow-xs"
      role="status"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="size-4 shrink-0 text-emerald-500" />
        <span class="text-foreground font-medium">
          Cold-chain telemetry audit log exported successfully with cryptographic SHA-256 chain-of-custody seal.
        </span>
      </div>
      <Button
        aria-label="Dismiss notification"
        variant="ghost"
        size="icon-sm"
        class="text-muted-foreground hover:text-foreground size-6"
        @click="exportNotification = false"
      >
        <span class="text-xs">✕</span>
      </Button>
    </div>

    <!-- 4 Telemetry Overview Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 1. Current Internal Temperature -->
      <Card class="border-border bg-card text-card-foreground shadow-xs">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
              >
                <ThermometerSnowflake class="size-4" />
              </div>
              <CardTitle class="truncate text-sm font-medium">Internal Core Temp</CardTitle>
            </div>
            <Badge wrap variant="success" class="shrink-0 text-xs">In Target Zone</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2.5 pt-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">
                {{ currentInternalTemp > 0 ? `+${currentInternalTemp}` : currentInternalTemp }}°C
              </span>
              <span class="text-muted-foreground text-xs font-normal">Payload</span>
            </div>
            <span class="text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400">±0.6°C setpoint</span>
          </div>

          <div class="border-border/60 border-t pt-2 text-xs">
            <div class="text-muted-foreground flex items-center justify-between gap-x-2">
              <span>Target Corridor:</span>
              <span class="text-foreground font-medium tabular-nums">-22.0°C to -18.0°C</span>
            </div>
            <p class="text-muted-foreground mt-0.5 text-xs">Probe #A1 (Pallet Center Core)</p>
          </div>
        </CardContent>
      </Card>

      <!-- 2. Ambient External Temperature -->
      <Card class="border-border bg-card text-card-foreground shadow-xs">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              >
                <ThermometerSun class="size-4" />
              </div>
              <CardTitle class="truncate text-sm font-medium">Ambient External</CardTitle>
            </div>
            <Badge wrap variant="outline" class="shrink-0 text-xs">Dubai Tarmac</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2.5 pt-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">
                {{ currentAmbientTemp > 0 ? `+${currentAmbientTemp}` : currentAmbientTemp }}°C
              </span>
              <span class="text-muted-foreground text-xs font-normal">Air Temp</span>
            </div>
            <div class="text-muted-foreground flex items-center gap-1 text-xs font-medium tabular-nums">
              <Flame class="size-3 text-amber-500" />
              <span>ΔT 44.2°C</span>
            </div>
          </div>

          <div class="border-border/60 border-t pt-2 text-xs">
            <div class="text-muted-foreground flex items-center justify-between gap-x-2">
              <span>Transfer Node:</span>
              <span class="text-foreground font-medium">DXB Cargo T2</span>
            </div>
            <p class="text-muted-foreground mt-0.5 text-xs">VIP Cryo-Insulation Envelope Active</p>
          </div>
        </CardContent>
      </Card>

      <!-- 3. Relative Humidity -->
      <Card class="border-border bg-card text-card-foreground shadow-xs">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400"
              >
                <Droplets class="size-4" />
              </div>
              <CardTitle class="truncate text-sm font-medium">Cargo Humidity</CardTitle>
            </div>
            <Badge wrap variant="success" class="shrink-0 text-xs">Optimal Dry</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2.5 pt-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">{{ currentHumidity }}%</span>
              <span class="text-muted-foreground text-xs font-normal">RH</span>
            </div>
            <span class="text-xs font-medium text-teal-600 dark:text-teal-400">Zero Condensation</span>
          </div>

          <div class="space-y-1">
            <Progress :model-value="currentHumidity" class="h-1.5 [&_[data-slot=progress-indicator]]:bg-teal-500" />
            <div class="text-muted-foreground flex items-center justify-between gap-x-2 text-xs">
              <span>Dew Point: <span class="text-foreground font-medium tabular-nums">-32.4°C</span></span>
              <span>Spec &lt; 35%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 4. Total Excursions / Breach Events -->
      <Card class="border-border bg-card text-card-foreground shadow-xs">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              >
                <ShieldCheck class="size-4" />
              </div>
              <CardTitle class="truncate text-sm font-medium">Excursion Events</CardTitle>
            </div>
            <Badge wrap variant="success" class="shrink-0 text-xs">100% Compliant</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2.5 pt-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">{{ totalExcursions }}</span>
              <span class="text-muted-foreground text-xs font-normal">Breaches</span>
            </div>
            <span class="text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
              {{ monitoringHours }}h in-transit
            </span>
          </div>

          <div class="border-border/60 border-t pt-2 text-xs">
            <div class="text-muted-foreground flex items-center justify-between gap-x-2">
              <span>Mean Kinetic Temp (MKT):</span>
              <span class="text-foreground font-medium tabular-nums">-19.7°C</span>
            </div>
            <p class="text-muted-foreground mt-0.5 text-xs">0 cumulative seconds out-of-spec</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 24-Hour Temperature Curve / Telemetry Graph -->
    <Card class="border-border bg-card text-card-foreground shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Activity class="text-primary size-4" />
              <CardTitle class="text-base font-semibold">24-Hour Payload & Ambient Telemetry Curve</CardTitle>
            </div>
            <CardDescription class="text-xs">
              Continuous thermal gradient monitoring comparing internal core payload against ambient flight & tarmac
              temperatures with strict excursion threshold corridors.
            </CardDescription>
          </div>

          <!-- Legend & Timeframe -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
              <div class="flex items-center gap-1.5">
                <span class="size-2 rounded-full bg-sky-500" />
                <span class="text-foreground font-medium">Internal Core</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="size-2 rounded-full bg-amber-500" />
                <span>Ambient Air</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="h-0.5 w-3 border-b border-dashed border-rose-500 bg-rose-500" />
                <span>Upper Limit (-18°C)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="h-0.5 w-3 border-b border-dashed border-sky-600 bg-sky-600" />
                <span>Lower Limit (-22°C)</span>
              </div>
            </div>

            <div class="bg-muted border-border/60 flex items-center rounded-lg border p-0.5 text-xs">
              <button
                type="button"
                :class="[
                  'rounded-md px-2.5 py-1 font-medium transition-colors',
                  activeTimeframe === '24h'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                ]"
                @click="activeTimeframe = '24h'"
              >
                24h
              </button>
              <button
                type="button"
                :class="[
                  'rounded-md px-2.5 py-1 font-medium transition-colors',
                  activeTimeframe === '48h'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                ]"
                @click="activeTimeframe = '48h'"
              >
                48h
              </button>
              <button
                type="button"
                :class="[
                  'rounded-md px-2.5 py-1 font-medium transition-colors',
                  activeTimeframe === '96h'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                ]"
                @click="activeTimeframe = '96h'"
              >
                96h
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <!-- SVG Chart Area -->
        <div class="bg-muted/20 border-border/60 relative w-full overflow-x-auto rounded-lg border p-2 sm:p-4">
          <svg class="h-64 w-full max-w-[600px] min-w-full" viewBox="0 0 740 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad-internal-vue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--color-sky-500, #0ea5e9)" stop-opacity="0.25" />
                <stop offset="100%" stop-color="var(--color-sky-500, #0ea5e9)" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Target Corridor Shaded Band (-18°C [y=65] to -22°C [y=155]) -->
            <rect
              x="40"
              y="65"
              width="660"
              height="90"
              fill="var(--color-sky-500, #0ea5e9)"
              fill-opacity="0.06"
              rx="4"
            />

            <!-- Grid Lines -->
            <line x1="40" y1="30" x2="700" y2="30" stroke="currentColor" class="text-border/40" stroke-width="1" />
            <line
              x1="40"
              y1="65"
              x2="700"
              y2="65"
              stroke="var(--color-rose-500, #f43f5e)"
              stroke-width="1.5"
              stroke-dasharray="4 4"
            />
            <line
              x1="40"
              y1="110"
              x2="700"
              y2="110"
              stroke="var(--color-emerald-500, #10b981)"
              stroke-width="1"
              stroke-dasharray="2 3"
              stroke-opacity="0.6"
            />
            <line
              x1="40"
              y1="155"
              x2="700"
              y2="155"
              stroke="var(--color-sky-600, #0284c7)"
              stroke-width="1.5"
              stroke-dasharray="4 4"
            />
            <line x1="40" y1="200" x2="700" y2="200" stroke="currentColor" class="text-border/40" stroke-width="1" />

            <!-- Y-Axis Threshold Labels -->
            <text x="36" y="69" text-anchor="end" class="fill-rose-500 text-xs font-medium">-18°C (Max)</text>
            <text x="36" y="113" text-anchor="end" class="fill-emerald-600 text-xs dark:fill-emerald-400">
              -20°C (Set)
            </text>
            <text x="36" y="159" text-anchor="end" class="fill-sky-600 text-xs font-medium dark:fill-sky-400">
              -22°C (Min)
            </text>

            <!-- Ambient Temperature Curve (Dashed Amber) -->
            <path
              :d="ambientPath"
              fill="none"
              stroke="var(--color-amber-500, #f59e0b)"
              stroke-width="2"
              stroke-dasharray="3 3"
              stroke-linecap="round"
            />

            <!-- Internal Temperature Gradient Area & Curve (Solid Sky) -->
            <path :d="internalArea" fill="url(#grad-internal-vue)" />
            <path
              :d="internalPath"
              fill="none"
              stroke="var(--color-sky-500, #0ea5e9)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Data Point Markers -->
            <g v-for="(pt, idx) in chartPoints" :key="idx">
              <!-- Internal Point -->
              <circle
                :cx="pt.x"
                :cy="pt.yInternal"
                r="3.5"
                class="stroke-background cursor-pointer fill-sky-500 stroke-2 transition-transform hover:scale-125"
                @mouseenter="selectedReadingIndex = idx"
              />
              <!-- Ambient Point -->
              <circle :cx="pt.x" :cy="pt.yAmbient" r="2.5" class="stroke-background fill-amber-500 stroke-1" />
            </g>
          </svg>

          <!-- X-Axis Timeline Milestones -->
          <div class="mt-2 grid grid-cols-3 gap-2 text-xs sm:grid-cols-5 lg:grid-cols-9">
            <div
              v-for="(pt, idx) in chartPoints"
              :key="idx"
              :class="[
                'rounded p-1 text-center transition-colors',
                selectedReadingIndex === idx ? 'bg-muted border-border/80 border' : '',
              ]"
            >
              <p class="text-foreground font-mono text-xs font-semibold tabular-nums">{{ pt.time }}</p>
              <p class="text-muted-foreground truncate text-xs">{{ pt.milestone }}</p>
              <p class="font-mono text-xs font-medium text-sky-600 tabular-nums dark:text-sky-400">
                {{ pt.internalTemp }}°C
              </p>
            </div>
          </div>
        </div>

        <!-- Metric Summary Strip -->
        <div class="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4 lg:grid-cols-5">
          <div class="border-border bg-muted/30 rounded-lg border p-2.5">
            <span class="text-muted-foreground">Min Internal Temp</span>
            <p class="text-foreground font-mono text-sm font-semibold tabular-nums">-20.8°C</p>
            <span class="text-muted-foreground text-xs">At cruise altitude</span>
          </div>
          <div class="border-border bg-muted/30 rounded-lg border p-2.5">
            <span class="text-muted-foreground">Max Internal Temp</span>
            <p class="text-foreground font-mono text-sm font-semibold tabular-nums">-19.2°C</p>
            <span class="text-muted-foreground text-xs">During DXB ramp transfer</span>
          </div>
          <div class="border-border bg-muted/30 rounded-lg border p-2.5">
            <span class="text-muted-foreground">24h Mean Temp</span>
            <p class="text-foreground font-mono text-sm font-semibold tabular-nums">-19.7°C</p>
            <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Optimal Setpoint</span>
          </div>
          <div class="border-border bg-muted/30 rounded-lg border p-2.5">
            <span class="text-muted-foreground">Standard Deviation</span>
            <p class="text-foreground font-mono text-sm font-semibold tabular-nums">±0.4°C</p>
            <span class="text-muted-foreground text-xs">Tight thermal hold</span>
          </div>
          <div class="border-border bg-muted/30 col-span-2 rounded-lg border p-2.5 sm:col-span-4 lg:col-span-1">
            <span class="text-muted-foreground">Peak External Heat</span>
            <p class="font-mono text-sm font-semibold text-amber-600 tabular-nums dark:text-amber-400">+38.6°C</p>
            <span class="text-muted-foreground text-xs">DXB Tarmac 12:00 UTC</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Temperature Logging History Table & Protocol Card -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Table: 2 cols on lg -->
      <Card class="border-border bg-card text-card-foreground shadow-xs lg:col-span-2">
        <CardHeader class="pb-3">
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle class="text-base font-semibold">Temperature Logging History</CardTitle>
              <CardDescription class="text-xs">
                Calibrated multi-probe sensor telemetry pings across core pallet positions.
              </CardDescription>
            </div>
            <Badge wrap variant="outline" class="w-fit text-xs font-normal tabular-nums">
              {{ activeLogs.length }} Recent Pings
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="p-0 sm:p-6 sm:pt-0">
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="min-w-[140px]">Timestamp</TableHead>
                  <TableHead class="min-w-[110px]">Internal Temp</TableHead>
                  <TableHead class="min-w-[100px]">Ambient Air</TableHead>
                  <TableHead class="min-w-[90px]">Delta-T</TableHead>
                  <TableHead class="min-w-[150px]">Probe Location</TableHead>
                  <TableHead class="min-w-[70px]">RH %</TableHead>
                  <TableHead class="min-w-[90px] text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="log in activeLogs"
                  :key="log.id"
                  :class="log.isLatest ? 'bg-muted/30 font-medium' : ''"
                >
                  <TableCell class="text-foreground text-xs whitespace-nowrap">
                    <div class="flex items-center gap-1.5">
                      <span class="tabular-nums">{{ log.timestamp }}</span>
                      <Badge wrap v-if="log.isLatest" variant="secondary" class="h-4 px-1 text-xs font-normal"
                        >Now</Badge
                      >
                    </div>
                  </TableCell>
                  <TableCell class="text-xs whitespace-nowrap">
                    <span class="font-semibold text-sky-600 tabular-nums dark:text-sky-400">
                      {{ log.internalTemp > 0 ? `+${log.internalTemp}` : log.internalTemp }}°C
                    </span>
                  </TableCell>
                  <TableCell class="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                    {{ log.ambientTemp > 0 ? `+${log.ambientTemp}` : log.ambientTemp }}°C
                  </TableCell>
                  <TableCell class="text-foreground text-xs font-medium whitespace-nowrap tabular-nums">
                    {{ log.deltaT }}°C
                  </TableCell>
                  <TableCell class="text-xs whitespace-nowrap">
                    <span class="text-foreground">{{ log.probeLocation }}</span>
                    <span class="text-muted-foreground ml-1 font-mono text-xs">({{ log.probeId }})</span>
                  </TableCell>
                  <TableCell class="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                    {{ log.humidity }}%
                  </TableCell>
                  <TableCell class="text-right">
                    <Badge
                      :variant="log.status === 'optimal' ? 'success' : log.status === 'in-spec' ? 'outline' : 'warning'"
                      class="text-xs whitespace-normal capitalize"
                    >
                      {{ log.status }}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <!-- Critical Excursion Alert Protocol Card -->
      <Card class="border-border bg-card text-card-foreground shadow-xs lg:col-span-1">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between gap-x-2">
            <div class="flex items-center gap-2">
              <Bell class="text-primary size-4" />
              <CardTitle class="text-base font-semibold">Excursion Alert Protocol</CardTitle>
            </div>
            <Badge wrap variant="success" class="gap-1 text-xs">
              <ShieldAlert class="size-3" />
              <span>Armed</span>
            </Badge>
          </div>
          <CardDescription class="text-xs">
            Automated escalation rules and dry ice reserve endurance monitoring.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Escalation Rule 1 -->
          <div class="border-border/70 bg-muted/30 space-y-1.5 rounded-lg border p-3 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-foreground font-semibold">Urgent SMS / Pager Alert Trigger:</span>
              <Badge wrap variant="destructive" class="font-mono text-xs">&gt; -15.0°C</Badge>
            </div>
            <p class="text-muted-foreground leading-relaxed">
              Triggers priority emergency dispatch if payload core temperature rises above -15.0°C for ≥ 30 consecutive
              minutes.
            </p>
          </div>

          <!-- Cryogenic Dry Ice Reserve -->
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <div class="flex items-center gap-1.5">
                <Snowflake class="size-3.5 text-sky-500" />
                <span class="text-foreground font-medium">Dry Ice Solid CO2 Reserve</span>
              </div>
              <span class="text-foreground font-mono font-semibold tabular-nums">{{ dryIceEnduranceHours }}h hold</span>
            </div>
            <Progress :model-value="dryIceCapacityPercent" class="h-2 [&_[data-slot=progress-indicator]]:bg-sky-500" />
            <div class="text-muted-foreground flex items-center justify-between gap-x-2">
              <span>Sublimation: 0.38 kg/hr</span>
              <span>42 kg solid reserve</span>
            </div>
          </div>

          <Separator />

          <!-- Emergency Response Logistics Desk -->
          <div class="border-border bg-muted/40 space-y-2 rounded-lg border p-3 text-xs">
            <div class="flex items-center justify-between gap-x-2">
              <div class="flex items-center gap-2">
                <PhoneCall class="text-primary size-3.5" />
                <span class="text-foreground font-semibold">Rapid Intervention Desk:</span>
              </div>
              <span class="text-foreground font-medium">DXB Hub Team</span>
            </div>
            <div class="text-muted-foreground flex items-center justify-between gap-x-2">
              <span>Emergency Pager:</span>
              <span class="text-foreground font-mono font-medium">+971 4 216 4890</span>
            </div>
            <div class="text-muted-foreground flex items-center justify-between gap-x-2">
              <span>Re-Icing Intervention SLA:</span>
              <span class="font-medium text-emerald-600 dark:text-emerald-400">&lt; 20 minutes</span>
            </div>
            <div
              class="text-muted-foreground border-border/50 flex items-center justify-between gap-x-2 border-t pt-1.5"
            >
              <span>Standard Operating SOP:</span>
              <span class="text-foreground font-mono">SOP-BIO-904</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
