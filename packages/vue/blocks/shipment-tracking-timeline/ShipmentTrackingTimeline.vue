<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Anchor,
  ArrowRight,
  Box,
  CalendarClock,
  Check,
  Compass,
  Copy,
  Download,
  FileCheck2,
  FileText,
  MapPin,
  Navigation,
  Radio,
  Search,
  Share2,
  ShieldCheck,
  Ship,
  Thermometer,
  Timer,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export type MilestoneStatus = 'completed' | 'current' | 'upcoming'
export type MilestoneFilter = 'all' | 'completed' | 'upcoming'

export interface Milestone {
  id: string
  stepNumber: number
  title: string
  location: string
  facility: string
  country: string
  date: string
  status: MilestoneStatus
  description: string
  coordinates?: string
  telemetry?: {
    speed?: string
    heading?: string
    depth?: string
  }
}

interface Props {
  initialContainerId?: string
  initialFilter?: MilestoneFilter
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialContainerId: 'MSKU-9482014',
  initialFilter: 'all',
})

const searchQuery = ref(props.initialContainerId)
const activeFilter = ref<MilestoneFilter>(props.initialFilter)
const copiedContainerId = ref(false)
const copiedBLLink = ref(false)

const milestones: Milestone[] = [
  {
    id: 'ms-1',
    stepNumber: 1,
    title: 'Cargo Loaded at Factory',
    location: 'Ningbo Depot',
    facility: 'Apex Logistics Hub South',
    country: 'CN',
    date: 'Aug 06, 2026 · 08:30 CST',
    status: 'completed',
    description: 'Container stuffed, Reefer unit pre-cooled to -18°C, bolt seal #SL-94021 applied.',
  },
  {
    id: 'ms-2',
    stepNumber: 2,
    title: 'Export Customs Cleared',
    location: 'Shanghai Port',
    facility: 'Yangshan Customs Gate 4',
    country: 'CN',
    date: 'Aug 08, 2026 · 14:15 CST',
    status: 'completed',
    description: 'Export declaration approved. Customs electronic release note #CN-SH-992 issued.',
  },
  {
    id: 'ms-3',
    stepNumber: 3,
    title: 'Vessel Departed Port',
    location: 'Shanghai Port (CNSHA)',
    facility: 'Yangshan Deepwater Terminal Berth 3',
    country: 'CN',
    date: 'Aug 10, 2026 · 22:00 CST',
    status: 'completed',
    description: 'Loaded onto vessel Ever Given (Voyage V.042W, Bay 42, Tier 04). Ocean transit started.',
  },
  {
    id: 'ms-4',
    stepNumber: 4,
    title: 'Current Position · Sea Transit',
    location: 'Red Sea International Waters',
    facility: 'Maritime Convoy Corridor 2',
    country: 'INT',
    date: 'Aug 21, 2026 · 11:20 UTC (Live)',
    status: 'current',
    description: 'Cruising in transit towards Suez Canal. High-frequency AIS beacon reporting healthy telemetry.',
    coordinates: "24°18'N, 37°42'E",
    telemetry: {
      speed: '18.4 knots',
      heading: '315° NW',
      depth: '840 m',
    },
  },
  {
    id: 'ms-5',
    stepNumber: 5,
    title: 'Suez Canal Transit',
    location: 'Port Said / Suez (EGPSD)',
    facility: 'Suez Canal Authority Convoy Hub',
    country: 'EG',
    date: 'Est. Aug 25, 2026 · 06:00 EEST',
    status: 'upcoming',
    description: 'Scheduled northbound convoy passage slot #04 with authorized maritime pilotage.',
  },
  {
    id: 'ms-6',
    stepNumber: 6,
    title: 'Port of Discharge Arrival',
    location: 'Rotterdam (NLRTM)',
    facility: 'APM Terminals Maasvlakte II',
    country: 'NL',
    date: 'Est. Sep 04, 2026 · 14:00 CEST',
    status: 'upcoming',
    description: 'Vessel berthing & container unlashing operations. Import customs clearance processing.',
  },
  {
    id: 'ms-7',
    stepNumber: 7,
    title: 'Final Destination Delivery',
    location: 'Duisburg Distribution Center',
    facility: 'EuroHub Logistics Terminal',
    country: 'DE',
    date: 'Est. Sep 07, 2026 · 09:00 CEST',
    status: 'upcoming',
    description: 'Intermodal electric rail transfer from Rotterdam to Duisburg bonded warehouse.',
  },
]

const filteredMilestones = computed(() => {
  if (activeFilter.value === 'completed') {
    return milestones.filter((m) => m.status === 'completed')
  }
  if (activeFilter.value === 'upcoming') {
    return milestones.filter((m) => m.status === 'upcoming')
  }
  return milestones
})

function copyContainerId() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText('MSKU-9482014')
    copiedContainerId.value = true
    setTimeout(() => {
      copiedContainerId.value = false
    }, 2000)
  }
}

function copyTrackingLink() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText('https://uipkge.dev/track/MSKU-9482014')
    copiedBLLink.value = true
    setTimeout(() => {
      copiedBLLink.value = false
    }, 2000)
  }
}
</script>

<template>
  <div data-slot="shipment-tracking-timeline" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardContent class="p-4 sm:p-6">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <!-- Left: ID, Vessel & Route -->
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
              <div class="flex items-center gap-1.5">
                <span class="text-foreground font-mono text-xl font-bold tracking-tight sm:text-2xl">
                  #MSKU-9482014
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  class="text-muted-foreground hover:text-foreground size-7"
                  title="Copy Container ID"
                  @click="copyContainerId"
                >
                  <Check v-if="copiedContainerId" class="size-3.5 text-emerald-500" aria-hidden="true" />
                  <Copy v-else class="size-3.5" aria-hidden="true" />
                  <span class="sr-only">Copy container number</span>
                </Button>
              </div>

              <Badge
                wrap
                variant="secondary"
                class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <span class="relative flex size-2 shrink-0">
                  <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                In Transit · On Schedule
              </Badge>

              <Badge wrap variant="outline" class="border-border bg-muted/30 text-muted-foreground gap-1 text-xs">
                <Ship class="text-primary size-3" aria-hidden="true" />
                Ocean Freight · FCL 40ft High Cube
              </Badge>
            </div>

            <!-- Route and Vessel meta -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <div class="text-foreground flex items-center gap-1.5 font-medium">
                <span class="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">CNSHA</span>
                <span>Shanghai</span>
                <ArrowRight class="text-muted-foreground size-3.5" aria-hidden="true" />
                <span class="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">NLRTM</span>
                <span>Rotterdam</span>
              </div>
              <Separator orientation="vertical" class="hidden h-3.5 sm:block" />
              <div class="text-muted-foreground flex items-center gap-1.5">
                <Ship class="text-muted-foreground size-3.5" aria-hidden="true" />
                <span>Vessel:</span>
                <span class="text-foreground font-semibold">Ever Given / V.042W</span>
                <span class="text-muted-foreground font-mono text-xs">(IMO 9811000)</span>
              </div>
              <Separator orientation="vertical" class="hidden h-3.5 sm:block" />
              <div class="text-muted-foreground flex items-center gap-1">
                <span>Carrier:</span>
                <span class="text-foreground font-medium">Maersk Line</span>
              </div>
            </div>
          </div>

          <!-- Right: Container search & Quick Actions -->
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div class="relative w-full sm:w-64">
              <Search
                class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                v-model="searchQuery"
                placeholder="Track Container / B/L..."
                class="h-9 pl-8 font-mono text-xs focus-visible:ring-2"
              />
            </div>
            <div class="flex items-center gap-2">
              <Button size="sm" class="gap-1.5 shadow-xs">
                <Search class="size-3.5" aria-hidden="true" />
                Track
              </Button>
              <Button variant="outline" size="sm" class="gap-1.5 shadow-xs" @click="copyTrackingLink">
                <Share2 class="size-3.5" aria-hidden="true" />
                <span class="hidden sm:inline">{{ copiedBLLink ? 'Copied' : 'Share' }}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 4 Summary Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- ETA Card -->
      <Card class="border-border bg-card shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estimated Arrival (ETA)</p>
              <p class="text-foreground font-mono text-base font-bold tabular-nums sm:text-lg">Sep 04, 2026</p>
              <p class="text-muted-foreground text-xs tabular-nums">14:00 CEST · Berth 4A confirmed</p>
            </div>
            <div class="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
              <CalendarClock class="size-4.5" aria-hidden="true" />
            </div>
          </div>
          <div
            class="border-border/60 bg-muted/40 mt-3.5 flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs"
          >
            <span class="text-muted-foreground">Remaining</span>
            <span class="font-medium text-emerald-600 dark:text-emerald-400">14 days left</span>
          </div>
        </CardContent>
      </Card>

      <!-- Days in Transit Card -->
      <Card class="border-border bg-card shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Days in Transit</p>
              <p class="text-foreground font-mono text-base font-bold tabular-nums sm:text-lg">
                18 <span class="text-muted-foreground text-sm font-normal">of 28 days</span>
              </p>
              <p class="text-muted-foreground text-xs tabular-nums">64% of voyage completed</p>
            </div>
            <div
              class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <Timer class="size-4.5" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3.5 space-y-1.5">
            <div class="bg-muted h-1.5 w-full overflow-hidden rounded-full">
              <div class="h-full rounded-full bg-emerald-500 transition-all" style="width: 64%" />
            </div>
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span>Departed: Aug 10</span>
              <span>ETA: Sep 04</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Current Coordinates Card -->
      <Card class="border-border bg-card shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Current Vessel Position</p>
              <p class="text-foreground font-mono text-base font-bold tabular-nums sm:text-lg">24°18'N, 37°42'E</p>
              <p class="text-muted-foreground text-xs">
                Red Sea · Speed <span class="text-foreground font-mono font-medium">18.4 kn</span>
              </p>
            </div>
            <div
              class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400"
            >
              <Compass class="size-4.5" aria-hidden="true" />
            </div>
          </div>
          <div
            class="border-border/60 bg-muted/40 mt-3.5 flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs"
          >
            <span class="text-muted-foreground">Heading</span>
            <span class="text-foreground font-mono font-medium">315° NW (Convoy)</span>
          </div>
        </CardContent>
      </Card>

      <!-- Next Milestone Port Card -->
      <Card class="border-border bg-card shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Next Milestone Port</p>
              <p class="text-foreground font-mono text-base font-bold sm:text-lg">Suez Canal</p>
              <p class="text-muted-foreground text-xs tabular-nums">Aug 25 · Northbound Convoy</p>
            </div>
            <div
              class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <Anchor class="size-4.5" aria-hidden="true" />
            </div>
          </div>
          <div
            class="border-border/60 bg-muted/40 mt-3.5 flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs"
          >
            <span class="text-muted-foreground">Pilotage Slot</span>
            <span class="text-foreground font-mono font-medium">Slot #04 (06:00 EEST)</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Multimodal Journey Milestones Stepper Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <Navigation class="text-primary size-4.5" aria-hidden="true" />
            <CardTitle class="text-base font-semibold">Multimodal Journey Milestones</CardTitle>
            <Badge wrap variant="outline" class="font-mono text-xs">7 Milestones</Badge>
          </div>
          <CardDescription class="text-xs">
            End-to-end container tracking from factory loading in Ningbo to warehouse in Duisburg.
          </CardDescription>
        </div>

        <!-- Filter Buttons -->
        <div class="border-border bg-muted/40 flex items-center gap-1 rounded-lg border p-0.5 text-xs">
          <button
            type="button"
            class="rounded-md px-2.5 py-1 font-medium transition-colors"
            :class="
              activeFilter === 'all'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="activeFilter = 'all'"
          >
            All (7)
          </button>
          <button
            type="button"
            class="rounded-md px-2.5 py-1 font-medium transition-colors"
            :class="
              activeFilter === 'completed'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="activeFilter = 'completed'"
          >
            Completed (3)
          </button>
          <button
            type="button"
            class="rounded-md px-2.5 py-1 font-medium transition-colors"
            :class="
              activeFilter === 'upcoming'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="activeFilter = 'upcoming'"
          >
            Upcoming (3)
          </button>
        </div>
      </CardHeader>

      <CardContent class="space-y-6 pt-2">
        <!-- Live AIS Telemetry Beacon Banner -->
        <div class="border-primary/30 bg-primary/5 relative overflow-hidden rounded-xl border p-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-primary/10 text-primary relative flex size-10 items-center justify-center rounded-lg">
                <Radio class="size-5" aria-hidden="true" />
                <span class="absolute -top-1 -right-1 flex size-3">
                  <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span class="relative inline-flex size-3 rounded-full bg-emerald-500" />
                </span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="text-foreground text-sm font-semibold">Active AIS Sea Telemetry</h4>
                  <Badge
                    wrap
                    variant="secondary"
                    class="bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    Live Transponder
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs">
                  Vessel Ever Given navigating Red Sea corridor · Last ping:
                  <span class="text-foreground font-mono font-medium">12s ago</span>
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 font-mono text-xs">
              <div class="border-border/80 bg-background/80 rounded-md border px-2.5 py-1.5">
                <span class="text-muted-foreground">Speed: </span>
                <span class="text-foreground font-semibold tabular-nums">18.4 knots</span>
              </div>
              <div class="border-border/80 bg-background/80 rounded-md border px-2.5 py-1.5">
                <span class="text-muted-foreground">Heading: </span>
                <span class="text-foreground font-semibold">315° NW</span>
              </div>
              <div class="border-border/80 bg-background/80 rounded-md border px-2.5 py-1.5">
                <span class="text-muted-foreground">Coords: </span>
                <span class="text-foreground font-semibold tabular-nums">24°18'N, 37°42'E</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Connected Timeline Stepper -->
        <div class="relative pl-6 sm:pl-8">
          <!-- Vertical Track Line -->
          <div class="bg-border absolute top-3 bottom-3 left-3 w-0.5 -translate-x-1/2 sm:left-4" />

          <div class="space-y-6">
            <div v-for="milestone in filteredMilestones" :key="milestone.id" class="group relative flex flex-col gap-2">
              <!-- Step Node Circle -->
              <div class="absolute -left-6 flex items-center justify-center sm:-left-8">
                <!-- Completed Icon -->
                <div
                  v-if="milestone.status === 'completed'"
                  class="ring-background flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xs ring-4 sm:size-8 dark:bg-emerald-500 dark:text-zinc-950"
                >
                  <Check class="size-3.5 stroke-[2.5] sm:size-4" aria-hidden="true" />
                </div>

                <!-- Current Active Pulsing Node -->
                <div
                  v-else-if="milestone.status === 'current'"
                  class="border-primary bg-background text-primary ring-background relative flex size-6 items-center justify-center rounded-full border-2 shadow-xs ring-4 sm:size-8"
                >
                  <span class="relative flex size-2.5 sm:size-3">
                    <span class="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75" />
                    <span class="bg-primary relative inline-flex size-2.5 rounded-full sm:size-3" />
                  </span>
                </div>

                <!-- Upcoming Node -->
                <div
                  v-else
                  class="border-border bg-muted/60 text-muted-foreground ring-background flex size-6 items-center justify-center rounded-full border ring-4 sm:size-8"
                >
                  <span class="font-mono text-xs font-medium">{{ milestone.stepNumber }}</span>
                </div>
              </div>

              <!-- Milestone Content Card -->
              <div
                class="rounded-xl border p-4 transition-all"
                :class="
                  milestone.status === 'current'
                    ? 'border-primary/50 bg-primary/5 ring-primary/20 shadow-xs ring-1'
                    : milestone.status === 'completed'
                      ? 'border-border/80 bg-card/60 hover:bg-muted/30'
                      : 'border-border/60 bg-muted/20 opacity-80 hover:opacity-100'
                "
              >
                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-foreground text-sm font-semibold">
                        {{ milestone.title }}
                      </span>

                      <Badge
                        v-if="milestone.status === 'completed'"
                        variant="secondary"
                        class="bg-emerald-500/10 text-xs font-medium whitespace-normal text-emerald-600 dark:text-emerald-400"
                      >
                        Completed
                      </Badge>
                      <Badge
                        v-else-if="milestone.status === 'current'"
                        class="bg-primary text-primary-foreground text-xs font-medium whitespace-normal"
                      >
                        Active Now
                      </Badge>
                      <Badge wrap v-else variant="outline" class="border-border text-muted-foreground text-xs">
                        Upcoming
                      </Badge>

                      <span class="text-muted-foreground font-mono text-xs"> ({{ milestone.facility }}) </span>
                    </div>

                    <p class="text-muted-foreground text-xs">
                      {{ milestone.description }}
                    </p>
                  </div>

                  <div class="shrink-0 text-left sm:text-right">
                    <span class="text-foreground font-mono text-xs font-medium tabular-nums">
                      {{ milestone.date }}
                    </span>
                    <div class="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs sm:justify-end">
                      <MapPin class="size-3" aria-hidden="true" />
                      <span>{{ milestone.location }}</span>
                    </div>
                  </div>
                </div>

                <!-- Telemetry sub-box for current milestone -->
                <div
                  v-if="milestone.telemetry"
                  class="border-primary/20 bg-background/90 mt-3 grid grid-cols-2 gap-2 rounded-lg border p-2.5 font-mono text-xs sm:grid-cols-4"
                >
                  <div>
                    <span class="text-muted-foreground">Speed: </span>
                    <span class="text-foreground font-semibold tabular-nums">{{ milestone.telemetry.speed }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground">Heading: </span>
                    <span class="text-foreground font-semibold">{{ milestone.telemetry.heading }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground">Water Depth: </span>
                    <span class="text-foreground font-semibold tabular-nums">{{ milestone.telemetry.depth }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground">AIS Status: </span>
                    <span class="font-semibold text-emerald-600 dark:text-emerald-400">Broadcasting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 2-Column Grid: Specifications & Documentation Manifest -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Container Specifications & Cold Chain Card -->
      <div class="space-y-6 lg:col-span-7">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Box class="text-primary size-4.5" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Container & Cold Chain Specifications</CardTitle>
              </div>
              <Badge wrap variant="outline" class="font-mono text-xs">ISO 6346 Verified</Badge>
            </div>
            <CardDescription class="text-xs">
              Physical parameters, high-security seal integrity, and live Reefer temperature control log.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-5">
            <!-- Key Metric Chips -->
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div class="border-border bg-muted/30 rounded-lg border p-3">
                <span class="text-muted-foreground text-xs">Gross Weight</span>
                <p class="text-foreground mt-0.5 font-mono text-sm font-bold tabular-nums">24,500 kg</p>
                <span class="text-muted-foreground text-xs">Max: 30,480 kg</span>
              </div>
              <div class="border-border bg-muted/30 rounded-lg border p-3">
                <span class="text-muted-foreground text-xs">Bolt Seal #</span>
                <p class="text-foreground mt-0.5 font-mono text-sm font-bold">SL-94021</p>
                <span class="text-xs text-emerald-600 dark:text-emerald-400">ISO 17712 High Sec</span>
              </div>
              <div class="border-border bg-muted/30 rounded-lg border p-3">
                <span class="text-muted-foreground text-xs">Temperature</span>
                <p class="text-foreground mt-0.5 font-mono text-sm font-bold tabular-nums">-18.0°C</p>
                <span class="text-xs text-emerald-600 dark:text-emerald-400">Actual: -18.2°C</span>
              </div>
              <div class="border-border bg-muted/30 rounded-lg border p-3">
                <span class="text-muted-foreground text-xs">Humidity & Vent</span>
                <p class="text-foreground mt-0.5 font-mono text-sm font-bold tabular-nums">85% RH</p>
                <span class="text-muted-foreground text-xs">Vent: Closed (0 cbm)</span>
              </div>
            </div>

            <Separator />

            <!-- Detailed Specifications Table / List -->
            <div class="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Equipment Size:</span>
                  <span class="text-foreground font-medium">40ft High Cube Reefer (40HR)</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Tare Weight:</span>
                  <span class="text-foreground font-mono font-medium tabular-nums">3,300 kg</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Net Cargo Weight:</span>
                  <span class="text-foreground font-mono font-medium tabular-nums">21,200 kg</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Cargo Volume:</span>
                  <span class="text-foreground font-mono font-medium tabular-nums">67.3 CBM</span>
                </div>
              </div>

              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Reefer Unit:</span>
                  <span class="text-foreground font-medium">Carrier Transicold PrimeLINE</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Power Source:</span>
                  <span class="text-foreground font-medium">Vessel 440V 3-Phase Plug</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Defrost Cycle:</span>
                  <span class="text-foreground font-mono font-medium">Auto-Defrost (Every 12h)</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Cold-Chain Compliance:</span>
                  <span class="font-semibold text-emerald-600 dark:text-emerald-400">HACCP / GDP Certified</span>
                </div>
              </div>
            </div>

            <!-- Cold Chain Live Sensor Gauge Banner -->
            <div
              class="border-border/80 bg-muted/40 flex flex-col gap-3 rounded-lg border p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-center gap-2">
                <Thermometer class="text-primary size-4" aria-hidden="true" />
                <span class="text-foreground font-medium">Continuous Temperature Telemetry:</span>
                <span class="text-muted-foreground font-mono">24-hour variance ±0.3°C (Nominal)</span>
              </div>
              <div class="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck class="size-3.5" aria-hidden="true" />
                <span>Zero Excursions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Commercial Documents & Shipping Manifest Card -->
      <div class="space-y-6 lg:col-span-5">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <FileText class="text-primary size-4.5" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Shipping Documentation</CardTitle>
              </div>
              <Badge wrap variant="secondary" class="text-xs">Customs Released</Badge>
            </div>
            <CardDescription class="text-xs">
              Bill of Lading, invoice identifiers, and trade compliance references.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2.5 text-xs">
              <div class="border-border/60 bg-muted/30 flex items-center justify-between rounded-lg border p-2.5">
                <span class="text-muted-foreground">Commercial Invoice #:</span>
                <span class="text-foreground font-mono font-bold">CI-2026-849</span>
              </div>
              <div class="border-border/60 bg-muted/30 flex items-center justify-between rounded-lg border p-2.5">
                <span class="text-muted-foreground">Master Bill of Lading (MBL):</span>
                <span class="text-foreground font-mono font-bold">MAEU-98421094</span>
              </div>
              <div class="border-border/60 bg-muted/30 flex items-center justify-between rounded-lg border p-2.5">
                <span class="text-muted-foreground">Booking Reference:</span>
                <span class="text-foreground font-mono font-medium">BKG-7712093</span>
              </div>
              <div class="border-border/60 bg-muted/30 flex items-center justify-between rounded-lg border p-2.5">
                <span class="text-muted-foreground">Incoterms 2020:</span>
                <span class="text-foreground font-medium">FOB Shanghai Port</span>
              </div>
            </div>

            <Separator />

            <!-- Parties: Shipper and Consignee -->
            <div class="space-y-3 text-xs">
              <div>
                <p class="text-muted-foreground font-medium">Shipper / Exporter</p>
                <p class="text-foreground font-semibold">Ningbo Apex International Marine Trade Co.</p>
                <p class="text-muted-foreground">Beilun District, Ningbo, Zhejiang, China</p>
              </div>
              <div>
                <p class="text-muted-foreground font-medium">Consignee / Importer</p>
                <p class="text-foreground font-semibold">EuroHub Logistics & Cold Storage GmbH</p>
                <p class="text-muted-foreground">Logport I, 47226 Duisburg, Germany</p>
              </div>
            </div>

            <div class="flex flex-col items-center gap-2 pt-2 sm:flex-row">
              <Button
                aria-label="Download attachment"
                variant="outline"
                size="sm"
                class="min-w-0 justify-center gap-2 text-xs shadow-xs sm:flex-1"
              >
                <Download class="size-3.5" aria-hidden="true" />
                Download Bill of Lading
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-foreground min-w-0 justify-center gap-2 text-xs sm:flex-1"
              >
                <FileCheck2 class="size-3.5" aria-hidden="true" />
                Customs Pack (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
