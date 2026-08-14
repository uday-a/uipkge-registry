<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  ArrowRightLeft,
  BatteryCharging,
  Check,
  Clock,
  Download,
  Fuel,
  Gauge,
  MapPin,
  Navigation,
  PackageCheck,
  Phone,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export type StopStatus = 'delivered' | 'in_progress' | 'pending'

export interface RouteStop {
  id: string
  sequence: number
  locationName: string
  address: string
  status: StopStatus
  deliveredTime?: string
  estimatedTime?: string
  packagesCount: number
  packageType: string
  notes?: string
  recipient?: string
}

export interface DriverRoute {
  id: string
  routeCode: string
  routeName: string
  zone: string
  driver: {
    name: string
    avatar?: string
    initials: string
    phone: string
    status: 'on_route' | 'break' | 'loading'
    radioChannel: string
  }
  vehicle: {
    name: string
    type: string
    plateNumber: string
    powerLevel: string
    powerType: 'electric' | 'diesel'
  }
  completedStops: number
  totalStops: number
  currentPayloadLbs: number
  maxPayloadLbs: number
  shiftWindow: string
  estimatedCompletion: string
  telemetry: {
    speed: string
    heading: string
    currentLocation: string
    lastPing: string
    signal: string
  }
  stops: RouteStop[]
}

const props = withDefaults(
  defineProps<{
    initialZone?: string
    initialFilter?: 'all' | 'in_transit' | 'high_load' | 'near_complete'
    class?: HTMLAttributes['class']
  }>(),
  {
    initialZone: 'Metro Los Angeles - North Zone',
    initialFilter: 'all',
  },
)

const DRIVER_ROUTES_DATA: DriverRoute[] = [
  {
    id: 'route-01',
    routeCode: 'Route #01',
    routeName: 'Downtown Metro',
    zone: 'Metro Los Angeles - North Zone',
    driver: {
      name: 'Elena Rostova',
      initials: 'ER',
      phone: '+1 (213) 555-0182',
      status: 'on_route',
      radioChannel: 'Ch 4 · North Dispatch',
    },
    vehicle: {
      name: 'Ford Transit #204',
      type: 'EV Cargo Van',
      plateNumber: 'CA-8KDX92',
      powerLevel: '74% Battery',
      powerType: 'electric',
    },
    completedStops: 18,
    totalStops: 24,
    currentPayloadLbs: 1850,
    maxPayloadLbs: 2200,
    shiftWindow: '07:30 AM – 16:30 PM',
    estimatedCompletion: '15:45 PM',
    telemetry: {
      speed: '32 mph',
      heading: 'NW 315°',
      currentLocation: 'Grand Ave & 5th St, Los Angeles, CA 90071',
      lastPing: '12s ago',
      signal: '5G Active',
    },
    stops: [
      {
        id: 'r1-s1',
        sequence: 1,
        locationName: 'Acme Industrial Hub',
        address: '1240 S Santa Fe Ave',
        status: 'delivered',
        deliveredTime: '09:15 AM',
        packagesCount: 12,
        packageType: 'Cartons',
        recipient: 'Signed by J. Miller',
      },
      {
        id: 'r1-s2',
        sequence: 2,
        locationName: 'Apex Tech Campus',
        address: '800 Wilshire Blvd, Ste 400',
        status: 'delivered',
        deliveredTime: '10:45 AM',
        packagesCount: 8,
        packageType: 'Parcels',
        recipient: 'Dock 4B Security',
      },
      {
        id: 'r1-s3',
        sequence: 3,
        locationName: 'Metro Distribution Center',
        address: '1950 E 7th St',
        status: 'in_progress',
        estimatedTime: '14:15 PM',
        packagesCount: 15,
        packageType: 'Heavy Boxes',
        notes: 'Priority Rush · Forklift offload requested',
      },
      {
        id: 'r1-s4',
        sequence: 4,
        locationName: 'Pasadena Hospital Supply',
        address: '650 S Raymond Ave',
        status: 'pending',
        packagesCount: 2,
        packageType: 'Medical Coolers',
        notes: 'Cold-Chain · Temperature Log Required',
      },
    ],
  },
  {
    id: 'route-02',
    routeCode: 'Route #02',
    routeName: 'Westside & Santa Monica',
    zone: 'Metro Los Angeles - North Zone',
    driver: {
      name: 'Marcus Vance',
      initials: 'MV',
      phone: '+1 (310) 555-0194',
      status: 'on_route',
      radioChannel: 'Ch 2 · West Dispatch',
    },
    vehicle: {
      name: 'Mercedes Sprinter #118',
      type: 'High-Roof Van',
      plateNumber: 'CA-9TMR44',
      powerLevel: '68% Fuel',
      powerType: 'diesel',
    },
    completedStops: 22,
    totalStops: 26,
    currentPayloadLbs: 2450,
    maxPayloadLbs: 3000,
    shiftWindow: '08:00 AM – 17:00 PM',
    estimatedCompletion: '16:15 PM',
    telemetry: {
      speed: '28 mph',
      heading: 'W 270°',
      currentLocation: 'Ocean Ave & Colorado Ave, Santa Monica, CA',
      lastPing: '8s ago',
      signal: '5G Active',
    },
    stops: [
      {
        id: 'r2-s1',
        sequence: 1,
        locationName: 'Pacific Design Center',
        address: '8687 Melrose Ave',
        status: 'delivered',
        deliveredTime: '09:40 AM',
        packagesCount: 6,
        packageType: 'Crates',
        recipient: 'Direct Receipt · Bay 2',
      },
      {
        id: 'r2-s2',
        sequence: 2,
        locationName: 'Oceanview Medical Plaza',
        address: '1301 20th St, Floor 3',
        status: 'delivered',
        deliveredTime: '11:20 AM',
        packagesCount: 14,
        packageType: 'Packages',
        recipient: 'Receptionist Amy K.',
      },
      {
        id: 'r2-s3',
        sequence: 3,
        locationName: 'Santa Monica Pier Logistics',
        address: '200 Santa Monica Pier',
        status: 'in_progress',
        estimatedTime: '14:40 PM',
        packagesCount: 4,
        packageType: 'Cartons',
        notes: 'Dock Bay 2 · Access Gate Code #4491',
      },
      {
        id: 'r2-s4',
        sequence: 4,
        locationName: 'Silicon Beach Incubator',
        address: '12020 Ocean Park Blvd',
        status: 'pending',
        packagesCount: 5,
        packageType: 'Parcels',
        notes: 'Signature Required · 5th Floor Suite 500',
      },
    ],
  },
  {
    id: 'route-03',
    routeCode: 'Route #03',
    routeName: 'Pasadena & Glendale',
    zone: 'San Fernando Valley Hub',
    driver: {
      name: 'Sofia Chen',
      initials: 'SC',
      phone: '+1 (626) 555-0147',
      status: 'on_route',
      radioChannel: 'Ch 5 · Valley Dispatch',
    },
    vehicle: {
      name: 'Ram ProMaster #309',
      type: 'Electric Courier',
      plateNumber: 'CA-7KPL55',
      powerLevel: '82% Battery',
      powerType: 'electric',
    },
    completedStops: 14,
    totalStops: 20,
    currentPayloadLbs: 1620,
    maxPayloadLbs: 2100,
    shiftWindow: '08:15 AM – 16:45 PM',
    estimatedCompletion: '16:30 PM',
    telemetry: {
      speed: '38 mph',
      heading: 'E 090°',
      currentLocation: 'Colorado Blvd & Lake Ave, Pasadena, CA',
      lastPing: '18s ago',
      signal: '5G Active',
    },
    stops: [
      {
        id: 'r3-s1',
        sequence: 1,
        locationName: 'Glendale Aerospace Labs',
        address: '4300 San Fernando Rd',
        status: 'delivered',
        deliveredTime: '10:05 AM',
        packagesCount: 3,
        packageType: 'Heavy Units',
        recipient: 'Forklift Bay Delivery',
      },
      {
        id: 'r3-s2',
        sequence: 2,
        locationName: 'Foothill Commercial Park',
        address: '2210 Foothill Blvd',
        status: 'delivered',
        deliveredTime: '11:50 AM',
        packagesCount: 9,
        packageType: 'Boxes',
        recipient: 'Suite 200 Mailroom',
      },
      {
        id: 'r3-s3',
        sequence: 3,
        locationName: 'Huntington Research Institute',
        address: '1151 Oxford Rd',
        status: 'in_progress',
        estimatedTime: '14:25 PM',
        packagesCount: 6,
        packageType: 'Lab Samples',
        notes: 'Fragile · Bio-Sample Insulated Crate',
      },
      {
        id: 'r3-s4',
        sequence: 4,
        locationName: 'Old Town Commerce Plaza',
        address: '300 E Colorado Blvd',
        status: 'pending',
        packagesCount: 4,
        packageType: 'Packages',
        notes: 'Front Desk Drop · Notify Concierge',
      },
    ],
  },
  {
    id: 'route-04',
    routeCode: 'Route #04',
    routeName: 'South Bay Logistics',
    zone: 'Metro Los Angeles - South Zone',
    driver: {
      name: 'Tariq Mansour',
      initials: 'TM',
      phone: '+1 (424) 555-0133',
      status: 'on_route',
      radioChannel: 'Ch 3 · South Dispatch',
    },
    vehicle: {
      name: 'Freightliner Custom #412',
      type: 'Box Truck',
      plateNumber: 'CA-5WXZ91',
      powerLevel: '88% Fuel',
      powerType: 'diesel',
    },
    completedStops: 19,
    totalStops: 22,
    currentPayloadLbs: 3100,
    maxPayloadLbs: 3800,
    shiftWindow: '07:00 AM – 16:00 PM',
    estimatedCompletion: '15:20 PM',
    telemetry: {
      speed: '45 mph',
      heading: 'S 180°',
      currentLocation: 'I-405 Southbound at Carson St, CA',
      lastPing: '5s ago',
      signal: '5G Active',
    },
    stops: [
      {
        id: 'r4-s1',
        sequence: 1,
        locationName: 'Port of LA Cargo Terminal',
        address: '425 S Palos Verdes St',
        status: 'delivered',
        deliveredTime: '08:30 AM',
        packagesCount: 18,
        packageType: 'Pallets',
        recipient: 'Customs Manifest #882',
      },
      {
        id: 'r4-s2',
        sequence: 2,
        locationName: 'Torrance Industrial Park',
        address: '190th St & Western Ave',
        status: 'delivered',
        deliveredTime: '10:15 AM',
        packagesCount: 11,
        packageType: 'Crates',
        recipient: 'Security Gate 5',
      },
      {
        id: 'r4-s3',
        sequence: 3,
        locationName: 'Long Beach Tech Hub',
        address: '100 W Ocean Blvd',
        status: 'in_progress',
        estimatedTime: '14:50 PM',
        packagesCount: 8,
        packageType: 'Hardware Cases',
        notes: 'Server Equipment · Handle with Care',
      },
      {
        id: 'r4-s4',
        sequence: 4,
        locationName: 'Manhattan Beach Retail Depot',
        address: '3200 Sepulveda Blvd',
        status: 'pending',
        packagesCount: 6,
        packageType: 'Store Parcels',
        notes: 'Store Receiving · Rear Loading Dock',
      },
    ],
  },
]

const selectedZone = ref(props.initialZone)
const filterType = ref<'all' | 'in_transit' | 'high_load' | 'near_complete'>(props.initialFilter)
const searchQuery = ref('')
const isOptimizing = ref(false)
const notificationBanner = ref<{ title: string; message: string; type: 'success' | 'info' } | null>(null)
const activeModal = ref<{
  type: 'gps' | 'call' | 'reassign'
  route: DriverRoute
  targetRouteId?: string
} | null>(null)

const filteredRoutes = computed(() => {
  return DRIVER_ROUTES_DATA.filter((route) => {
    // Zone filter
    if (selectedZone.value !== 'all' && route.zone !== selectedZone.value) {
      return false
    }

    // Category / Quick filter
    if (filterType.value === 'in_transit' && route.driver.status !== 'on_route') {
      return false
    }
    if (filterType.value === 'high_load' && route.currentPayloadLbs / route.maxPayloadLbs < 0.8) {
      return false
    }
    if (filterType.value === 'near_complete' && route.completedStops / route.totalStops < 0.75) {
      return false
    }

    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchRoute = route.routeCode.toLowerCase().includes(q) || route.routeName.toLowerCase().includes(q)
      const matchDriver = route.driver.name.toLowerCase().includes(q)
      const matchVehicle =
        route.vehicle.name.toLowerCase().includes(q) || route.vehicle.plateNumber.toLowerCase().includes(q)
      const matchStop = route.stops.some(
        (s) => s.locationName.toLowerCase().includes(q) || s.address.toLowerCase().includes(q),
      )
      if (!matchRoute && !matchDriver && !matchVehicle && !matchStop) {
        return false
      }
    }

    return true
  })
})

function handleAutoOptimize() {
  isOptimizing.value = true
  notificationBanner.value = null

  setTimeout(() => {
    isOptimizing.value = false
    notificationBanner.value = {
      title: 'AI Route Optimization Complete',
      message: 'Re-sequenced 4 active routes · Saved 18.4 road miles · Estimated 22 min overall transit reduction.',
      type: 'success',
    }
  }, 750)
}

function handleExportManifests() {
  notificationBanner.value = {
    title: 'Dispatch Manifests Exported',
    message: 'Generated PDF loading manifests and CSV stop sequences for 4 routes (180 total stops).',
    type: 'info',
  }
}

function openModal(type: 'gps' | 'call' | 'reassign', route: DriverRoute) {
  activeModal.value = {
    type,
    route,
    targetRouteId: DRIVER_ROUTES_DATA.find((r) => r.id !== route.id)?.id,
  }
}

function closeModal() {
  activeModal.value = null
}

function resetFilters() {
  selectedZone.value = 'all'
  searchQuery.value = ''
  filterType.value = 'all'
}

function handleConfirmReassign() {
  if (activeModal.value) {
    const route = activeModal.value.route
    notificationBanner.value = {
      title: 'Stops Successfully Reassigned',
      message: `Pending stop from ${route.routeCode} transferred. Driver GPS routes and manifest synced.`,
      type: 'success',
    }
    closeModal()
  }
}
</script>

<template>
  <div :class="cn('text-foreground w-full space-y-6', props.class)" data-slot="dispatch-assignment-board">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <div
            class="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Live Dispatch Operations</span>
          </div>
          <div class="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock class="h-3.5 w-3.5" />
            <span class="font-mono tabular-nums">Today · Aug 21, 2026</span>
          </div>
        </div>
        <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          Delivery Dispatch & Route Optimization
        </h1>
        <p class="text-muted-foreground text-xs sm:text-sm">
          Last-mile route sequencing, real-time stop execution, and vehicle payload load balancing.
        </p>
      </div>

      <!-- Header Controls -->
      <div class="flex flex-wrap items-center gap-2.5">
        <div class="w-full sm:w-64">
          <Select v-model="selectedZone">
            <SelectTrigger class="h-9 w-full text-xs font-medium" aria-label="Select Dispatch Zone">
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel class="text-xs">Dispatch Zones</SelectLabel>
                <SelectItem value="all" class="text-xs">All Dispatch Zones</SelectItem>
                <SelectItem value="Metro Los Angeles - North Zone" class="text-xs">
                  Metro Los Angeles - North Zone
                </SelectItem>
                <SelectItem value="Metro Los Angeles - South Zone" class="text-xs">
                  Metro Los Angeles - South Zone
                </SelectItem>
                <SelectItem value="San Fernando Valley Hub" class="text-xs"> San Fernando Valley Hub </SelectItem>
                <SelectItem value="Orange County Central" class="text-xs"> Orange County Central </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          aria-label="Download attachment"
          variant="outline"
          size="sm"
          class="h-9 gap-1.5 text-xs font-medium"
          @click="handleExportManifests"
        >
          <Download class="h-3.5 w-3.5" />
          <span>Export Manifests</span>
        </Button>

        <Button
          size="sm"
          class="h-9 gap-1.5 text-xs font-medium shadow-xs"
          :disabled="isOptimizing"
          @click="handleAutoOptimize"
        >
          <Sparkles :class="cn('h-3.5 w-3.5', isOptimizing && 'text-primary-foreground animate-spin')" />
          <span>{{ isOptimizing ? 'Optimizing AI Routes...' : 'Auto-Optimize Routes' }}</span>
        </Button>
      </div>
    </div>

    <!-- Notification Banner -->
    <div
      v-if="notificationBanner"
      :class="
        cn(
          'animate-in fade-in-50 flex items-start justify-between rounded-lg border p-3.5 text-xs transition-all duration-200',
          notificationBanner.type === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200'
            : 'border-primary/30 bg-primary/10 text-foreground',
        )
      "
    >
      <div class="flex items-start gap-2.5">
        <Sparkles
          v-if="notificationBanner.type === 'success'"
          class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
        />
        <PackageCheck v-else class="text-primary mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <span class="font-semibold">{{ notificationBanner.title }}:</span>
          <span class="text-muted-foreground ml-1 dark:text-emerald-200/80">{{ notificationBanner.message }}</span>
        </div>
      </div>
      <button
        aria-label="Dismiss notification"
        type="button"
        class="text-muted-foreground hover:text-foreground transition-colors"
        @click="notificationBanner = null"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Dispatch Overview KPI Cards (4 Cards) -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- KPI 1: Active Routes -->
      <Card class="border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Total Routes Active</CardTitle>
          <div class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-md">
            <Truck class="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1.5">
          <div class="flex items-baseline gap-2">
            <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">8</span>
            <span class="text-muted-foreground text-xs font-medium">routes dispatched</span>
          </div>
          <div class="text-muted-foreground flex items-center gap-2 text-xs">
            <Badge
              variant="outline"
              class="h-5 border-emerald-500/20 bg-emerald-500/10 px-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              6 In Transit
            </Badge>
            <span>2 loading at hub</span>
          </div>
        </CardContent>
      </Card>

      <!-- KPI 2: Stops Remaining & Progress -->
      <Card class="border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Total Stops Remaining</CardTitle>
          <div class="flex h-8 w-8 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <PackageCheck class="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="flex items-baseline gap-1">
              <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">142</span>
              <span class="text-muted-foreground font-mono text-xs tabular-nums">/ 180 stops</span>
            </div>
            <span class="font-mono text-xs font-semibold text-sky-600 tabular-nums dark:text-sky-400">78.8%</span>
          </div>
          <Progress :model-value="78.8" class="h-1.5" />
          <p class="text-muted-foreground text-xs">
            <span class="text-foreground font-mono font-semibold tabular-nums">38</span> stops pending completion
          </p>
        </CardContent>
      </Card>

      <!-- KPI 3: On-Time Rate -->
      <Card class="border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">On-Time Delivery Rate</CardTitle>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <ShieldCheck class="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1.5">
          <div class="flex items-baseline gap-2">
            <span
              class="font-mono text-2xl font-bold tracking-tight text-emerald-600 tabular-nums dark:text-emerald-400"
              >97.4%</span
            >
            <Badge
              variant="outline"
              class="h-5 border-emerald-500/20 bg-emerald-500/10 px-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              +1.8% vs SLA
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs">
            Target: <span class="text-foreground font-mono font-medium tabular-nums">≥95.0%</span> · 0 SLA breaches
          </p>
        </CardContent>
      </Card>

      <!-- KPI 4: Cargo Weight Dispatched -->
      <Card class="border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Total Cargo Weight Dispatched</CardTitle>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400"
          >
            <Gauge class="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="flex items-baseline gap-1">
              <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">14,280</span>
              <span class="text-muted-foreground text-xs">lbs</span>
            </div>
            <Badge
              variant="outline"
              class="h-5 border-amber-500/20 bg-amber-500/10 px-1.5 text-xs font-medium text-amber-600 dark:text-amber-400"
            >
              82% capacity
            </Badge>
          </div>
          <div class="bg-muted relative h-1.5 w-full overflow-hidden rounded-full">
            <div class="h-full rounded-full bg-amber-500 transition-all duration-500" style="width: 82%" />
          </div>
          <p class="text-muted-foreground text-xs">
            Payload limit: <span class="text-foreground font-mono font-medium tabular-nums">17,400 lbs</span> · Well
            balanced
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-wrap items-center gap-1.5">
        <Button
          size="sm"
          :variant="filterType === 'all' ? 'default' : 'outline'"
          class="h-8 text-xs font-medium"
          @click="filterType = 'all'"
        >
          All Routes ({{ DRIVER_ROUTES_DATA.length }})
        </Button>
        <Button
          size="sm"
          :variant="filterType === 'in_transit' ? 'default' : 'outline'"
          class="h-8 text-xs font-medium"
          @click="filterType = 'in_transit'"
        >
          In Transit (4)
        </Button>
        <Button
          size="sm"
          :variant="filterType === 'high_load' ? 'default' : 'outline'"
          class="h-8 text-xs font-medium"
          @click="filterType = 'high_load'"
        >
          High Load (>80%)
        </Button>
        <Button
          size="sm"
          :variant="filterType === 'near_complete' ? 'default' : 'outline'"
          class="h-8 text-xs font-medium"
          @click="filterType = 'near_complete'"
        >
          Near Completion (>70%)
        </Button>
      </div>

      <div class="relative w-full sm:w-72">
        <Search class="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter driver, route, or stop..."
          class="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border pr-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-hidden"
        />
        <button
          aria-label="Clear search"
          v-if="searchQuery"
          type="button"
          class="text-muted-foreground hover:text-foreground absolute top-2 right-2"
          @click="searchQuery = ''"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    <!-- Empty State when filtered out -->
    <div
      v-if="filteredRoutes.length === 0"
      class="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center"
    >
      <Truck class="text-muted-foreground/50 mb-3 h-10 w-10" />
      <h3 class="text-foreground text-sm font-semibold">No matching dispatch routes found</h3>
      <p class="text-muted-foreground mt-1 max-w-sm text-xs">
        Try resetting your zone selector or search query to see active drivers and vehicle assignments.
      </p>
      <Button variant="outline" size="sm" class="mt-4 h-8 text-xs" @click="resetFilters"> Reset Filters </Button>
    </div>

    <!-- Driver Routes Grid / Multi-Card Board (4 Driver Route Cards) -->
    <div v-else class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card
        v-for="route in filteredRoutes"
        :key="route.id"
        class="border-border flex flex-col shadow-xs transition-shadow hover:shadow-sm"
      >
        <!-- Card Header: Route ID, Status, Driver and Vehicle snapshot -->
        <CardHeader class="space-y-3 pb-3">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="space-y-0.5">
              <div class="flex items-center gap-2">
                <span class="text-primary font-mono text-xs font-semibold">{{ route.routeCode }}</span>
                <CardTitle class="text-foreground text-sm font-bold sm:text-base">
                  {{ route.routeName }}
                </CardTitle>
              </div>
              <p class="text-muted-foreground text-xs">{{ route.zone }}</p>
            </div>

            <div class="flex items-center gap-1.5">
              <Badge
                variant="outline"
                class="h-5 border-emerald-500/20 bg-emerald-500/10 px-2 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                In Transit · On Schedule
              </Badge>
            </div>
          </div>

          <Separator />

          <!-- Driver Profile & Vehicle Metadata -->
          <div class="bg-muted/40 flex flex-col gap-3 rounded-lg p-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <Avatar class="border-border h-9 w-9 border">
                <AvatarFallback class="bg-primary/10 text-primary text-xs font-bold">
                  {{ route.driver.initials }}
                </AvatarFallback>
              </Avatar>
              <div class="space-y-0.5">
                <div class="flex items-center gap-1.5">
                  <span class="text-foreground text-xs font-semibold">{{ route.driver.name }}</span>
                  <span class="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" title="Active" />
                </div>
                <div class="text-muted-foreground flex items-center gap-2 text-xs">
                  <span class="font-mono tabular-nums">{{ route.driver.phone }}</span>
                  <span>·</span>
                  <span>{{ route.driver.radioChannel }}</span>
                </div>
              </div>
            </div>

            <div
              class="border-border flex items-center justify-between gap-x-2 border-t pt-2 sm:border-t-0 sm:pt-0 sm:text-right"
            >
              <div class="space-y-0.5">
                <div class="flex items-center gap-1.5 sm:justify-end">
                  <Truck class="text-muted-foreground h-3.5 w-3.5" />
                  <span class="text-foreground text-xs font-medium">{{ route.vehicle.name }}</span>
                </div>
                <div class="text-muted-foreground flex items-center gap-1.5 text-xs sm:justify-end">
                  <span class="font-mono text-xs">{{ route.vehicle.plateNumber }}</span>
                  <span>·</span>
                  <span class="flex items-center gap-1 font-mono text-xs tabular-nums">
                    <BatteryCharging v-if="route.vehicle.powerType === 'electric'" class="h-3 w-3 text-emerald-500" />
                    <Fuel v-else class="h-3 w-3 text-sky-500" />
                    {{ route.vehicle.powerLevel }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent class="flex-1 space-y-4">
          <!-- Route Progress & Payload Load Balance Overview -->
          <div class="border-border bg-card grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-2">
            <!-- Stops Progress -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-x-2 text-xs">
                <span class="text-muted-foreground">Stops Completion</span>
                <span class="text-foreground font-mono font-semibold tabular-nums">
                  {{ route.completedStops }} / {{ route.totalStops }}
                  <span class="text-muted-foreground font-normal"
                    >({{ Math.round((route.completedStops / route.totalStops) * 100) }}%)</span
                  >
                </span>
              </div>
              <Progress :model-value="(route.completedStops / route.totalStops) * 100" class="h-1.5" />
              <div
                class="text-muted-foreground flex items-center justify-between gap-x-2 font-mono text-xs tabular-nums"
              >
                <span>Shift: {{ route.shiftWindow }}</span>
                <span>ETA: {{ route.estimatedCompletion }}</span>
              </div>
            </div>

            <!-- Payload Weight Utilization -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-x-2 text-xs">
                <span class="text-muted-foreground">Payload Load Balance</span>
                <span class="text-foreground font-mono font-semibold tabular-nums">
                  {{ route.currentPayloadLbs.toLocaleString() }} / {{ route.maxPayloadLbs.toLocaleString() }} lbs
                </span>
              </div>
              <div class="bg-muted relative h-1.5 w-full overflow-hidden rounded-full">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="route.currentPayloadLbs / route.maxPayloadLbs > 0.85 ? 'bg-amber-500' : 'bg-primary'"
                  :style="`width: ${(route.currentPayloadLbs / route.maxPayloadLbs) * 100}%`"
                />
              </div>
              <div
                class="text-muted-foreground flex items-center justify-between gap-x-2 font-mono text-xs tabular-nums"
              >
                <span>{{ Math.round((route.currentPayloadLbs / route.maxPayloadLbs) * 100) }}% capacity</span>
                <span
                  :class="
                    route.currentPayloadLbs / route.maxPayloadLbs > 0.85
                      ? 'font-medium text-amber-600 dark:text-amber-400'
                      : 'text-muted-foreground'
                  "
                >
                  {{ route.maxPayloadLbs - route.currentPayloadLbs }} lbs available
                </span>
              </div>
            </div>
          </div>

          <!-- Stops Timeline Section -->
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-x-2">
              <h4 class="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Stop Sequence & Delivery Execution
              </h4>
              <span class="text-muted-foreground font-mono text-xs tabular-nums">
                {{ route.stops.filter((s) => s.status === 'delivered').length }} done ·
                {{ route.stops.filter((s) => s.status === 'in_progress').length }} active ·
                {{ route.stops.filter((s) => s.status === 'pending').length }} pending
              </span>
            </div>

            <!-- Timeline List -->
            <div
              class="before:bg-border relative space-y-3 pl-2 before:absolute before:top-3 before:bottom-3 before:left-5 before:w-px"
            >
              <div
                v-for="stop in route.stops"
                :key="stop.id"
                class="hover:border-border hover:bg-muted/30 relative flex items-start gap-3 rounded-lg border border-transparent p-2 transition-colors"
                :class="stop.status === 'in_progress' && 'border-primary/30 bg-primary/5 dark:bg-primary/10'"
              >
                <!-- Status Icon Node -->
                <div class="relative z-10 flex shrink-0 items-center justify-center">
                  <!-- Delivered Check Icon -->
                  <div
                    v-if="stop.status === 'delivered'"
                    class="ring-background flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 ring-2 dark:text-emerald-400"
                  >
                    <Check class="h-3.5 w-3.5 stroke-3" />
                  </div>

                  <!-- In Progress Pulsing Map Pin -->
                  <div
                    v-else-if="stop.status === 'in_progress'"
                    class="bg-primary text-primary-foreground ring-primary/20 relative flex h-6 w-6 items-center justify-center rounded-full shadow-xs ring-4"
                  >
                    <MapPin class="h-3.5 w-3.5 animate-bounce" />
                  </div>

                  <!-- Pending Clock / Circle Node -->
                  <div
                    v-else
                    class="border-border bg-muted text-muted-foreground ring-background flex h-6 w-6 items-center justify-center rounded-full border ring-2"
                  >
                    <Clock class="h-3 w-3" />
                  </div>
                </div>

                <!-- Stop Details -->
                <div class="min-w-0 flex-1 space-y-0.5">
                  <div class="flex flex-wrap items-center justify-between gap-1">
                    <div class="flex items-center gap-1.5 truncate">
                      <span class="text-muted-foreground font-mono text-xs font-semibold">#{{ stop.sequence }}</span>
                      <span class="text-foreground truncate text-xs font-semibold">{{ stop.locationName }}</span>
                    </div>

                    <!-- Stop Status Timestamp / ETA -->
                    <div class="flex items-center gap-1">
                      <Badge
                        v-if="stop.status === 'delivered'"
                        variant="outline"
                        class="h-4.5 border-emerald-500/20 bg-emerald-500/10 px-1.5 font-mono text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
                      >
                        Delivered {{ stop.deliveredTime }}
                      </Badge>
                      <Badge
                        v-else-if="stop.status === 'in_progress'"
                        class="bg-primary text-primary-foreground h-4.5 px-1.5 font-mono text-xs font-medium tabular-nums"
                      >
                        In Progress · ETA {{ stop.estimatedTime }}
                      </Badge>
                      <Badge
                        v-else
                        variant="secondary"
                        class="text-muted-foreground h-4.5 px-1.5 font-mono text-xs font-medium tabular-nums"
                      >
                        Pending
                      </Badge>
                    </div>
                  </div>

                  <p class="text-muted-foreground truncate text-xs">{{ stop.address }}</p>

                  <div class="text-muted-foreground flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                    <span class="text-foreground font-mono font-medium tabular-nums">
                      {{ stop.packagesCount }} {{ stop.packageType }}
                    </span>
                    <span v-if="stop.recipient" class="text-muted-foreground">· {{ stop.recipient }}</span>
                    <span v-if="stop.notes" class="font-medium text-amber-600 dark:text-amber-400"
                      >· {{ stop.notes }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <!-- Card Footer: Quick Action Buttons -->
        <CardFooter class="border-border border-t pt-3">
          <div class="flex w-full flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                class="h-8 gap-1.5 text-xs font-medium"
                @click="openModal('reassign', route)"
              >
                <ArrowRightLeft class="h-3.5 w-3.5" />
                <span>Reassign Stops</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                class="h-8 gap-1.5 text-xs font-medium"
                @click="openModal('call', route)"
              >
                <Phone class="h-3.5 w-3.5" />
                <span>Call Driver</span>
              </Button>
            </div>

            <Button
              variant="default"
              size="sm"
              class="h-8 gap-1.5 text-xs font-medium shadow-xs"
              @click="openModal('gps', route)"
            >
              <Navigation class="h-3.5 w-3.5" />
              <span>View Live GPS</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>

    <!-- Modals / Drawers for Board Actions -->
    <div
      v-if="activeModal"
      class="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-150"
      @click.self="closeModal"
    >
      <!-- GPS Telemetry Modal -->
      <div
        v-if="activeModal.type === 'gps'"
        class="border-border bg-card w-full max-w-lg space-y-4 rounded-xl border p-6 shadow-xl"
      >
        <div class="flex items-center justify-between gap-x-2">
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-md">
              <Navigation class="h-4 w-4" />
            </div>
            <div>
              <h3 class="text-foreground text-sm font-bold">Live Telemetry & GPS Tracking</h3>
              <p class="text-muted-foreground text-xs">
                {{ activeModal.route.routeCode }} · {{ activeModal.route.driver.name }}
              </p>
            </div>
          </div>
          <button
            aria-label="Close modal"
            type="button"
            class="text-muted-foreground hover:text-foreground rounded-md p-1"
            @click="closeModal"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <Separator />

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
            <span class="text-muted-foreground text-xs">Current Speed</span>
            <p class="text-foreground font-mono text-sm font-bold">{{ activeModal.route.telemetry.speed }}</p>
          </div>
          <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
            <span class="text-muted-foreground text-xs">Heading</span>
            <p class="text-foreground font-mono text-sm font-bold">{{ activeModal.route.telemetry.heading }}</p>
          </div>
          <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
            <span class="text-muted-foreground text-xs">Power / Fuel</span>
            <p class="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {{ activeModal.route.vehicle.powerLevel }}
            </p>
          </div>
          <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
            <span class="text-muted-foreground text-xs">GPS Ping</span>
            <p class="text-foreground font-mono text-sm font-bold">{{ activeModal.route.telemetry.lastPing }}</p>
          </div>
        </div>

        <div class="border-border bg-muted/20 space-y-1.5 rounded-lg border p-3">
          <div class="flex items-center justify-between gap-x-2 text-xs">
            <span class="text-muted-foreground">Current Coordinates & Street</span>
            <span class="font-mono font-medium text-emerald-600 dark:text-emerald-400"
              >Signal: {{ activeModal.route.telemetry.signal }}</span
            >
          </div>
          <div class="flex items-start gap-2">
            <MapPin class="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <p class="text-foreground text-xs font-semibold">{{ activeModal.route.telemetry.currentLocation }}</p>
          </div>
        </div>

        <!-- Next Stop Snapshot -->
        <div class="border-primary/20 bg-primary/5 space-y-1 rounded-lg border p-3">
          <span class="text-primary text-xs font-semibold tracking-wide uppercase">Next Stop In Sequence</span>
          <p class="text-foreground text-xs font-bold">
            {{ activeModal.route.stops.find((s) => s.status === 'in_progress')?.locationName || 'Hub Return' }}
          </p>
          <p class="text-muted-foreground text-xs">
            {{ activeModal.route.stops.find((s) => s.status === 'in_progress')?.address }}
          </p>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <Button aria-label="Close modal" variant="outline" size="sm" class="h-8 text-xs" @click="closeModal"
            >Close</Button
          >
          <Button size="sm" class="h-8 text-xs font-medium" @click="openModal('call', activeModal.route)">
            <Phone class="mr-1.5 h-3.5 w-3.5" /> Call Driver
          </Button>
        </div>
      </div>

      <!-- Call Driver Modal -->
      <div
        v-else-if="activeModal.type === 'call'"
        class="border-border bg-card w-full max-w-md space-y-4 rounded-xl border p-6 shadow-xl"
      >
        <div class="flex items-center justify-between gap-x-2">
          <div class="flex items-center gap-2">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <PhoneCall class="h-4 w-4" />
            </div>
            <div>
              <h3 class="text-foreground text-sm font-bold">Dispatch Driver Communications</h3>
              <p class="text-muted-foreground text-xs">{{ activeModal.route.routeCode }} Direct Link</p>
            </div>
          </div>
          <button
            aria-label="Close modal"
            type="button"
            class="text-muted-foreground hover:text-foreground rounded-md p-1"
            @click="closeModal"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <Separator />

        <div class="border-border bg-muted/40 flex items-center gap-3 rounded-lg border p-3">
          <Avatar class="border-border h-11 w-11 border">
            <AvatarFallback class="bg-primary/10 text-primary text-sm font-bold">
              {{ activeModal.route.driver.initials }}
            </AvatarFallback>
          </Avatar>
          <div class="space-y-0.5">
            <h4 class="text-foreground text-sm font-semibold">{{ activeModal.route.driver.name }}</h4>
            <p class="text-muted-foreground font-mono text-xs tabular-nums">{{ activeModal.route.driver.phone }}</p>
            <p class="text-muted-foreground text-xs">{{ activeModal.route.driver.radioChannel }} · Hands-Free Active</p>
          </div>
        </div>

        <div class="space-y-2 text-xs">
          <span class="text-muted-foreground font-medium">Quick Broadcast Dispatch Presets:</span>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="border-border bg-background hover:border-primary/40 hover:bg-accent rounded-md border p-2 text-left transition-colors"
              @click="handleConfirmReassign"
            >
              <span class="text-foreground block font-semibold">Traffic Alert</span>
              <span class="text-muted-foreground text-xs">Reroute around I-10 slowdown</span>
            </button>
            <button
              type="button"
              class="border-border bg-background hover:border-primary/40 hover:bg-accent rounded-md border p-2 text-left transition-colors"
              @click="handleConfirmReassign"
            >
              <span class="text-foreground block font-semibold">Priority Stop</span>
              <span class="text-muted-foreground text-xs">Bump hospital drop to next</span>
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <Button aria-label="Close modal" variant="outline" size="sm" class="h-8 text-xs" @click="closeModal"
            >Cancel</Button
          >
          <Button
            size="sm"
            class="h-8 bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-700"
            @click="handleConfirmReassign"
          >
            <Phone class="mr-1.5 h-3.5 w-3.5" /> Start Direct Call
          </Button>
        </div>
      </div>

      <!-- Reassign Stops Modal -->
      <div
        v-else-if="activeModal.type === 'reassign'"
        class="border-border bg-card w-full max-w-lg space-y-4 rounded-xl border p-6 shadow-xl"
      >
        <div class="flex items-center justify-between gap-x-2">
          <div class="flex items-center gap-2">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <ArrowRightLeft class="h-4 w-4" />
            </div>
            <div>
              <h3 class="text-foreground text-sm font-bold">Reassign Pending Stops</h3>
              <p class="text-muted-foreground text-xs">
                Transfer workload from {{ activeModal.route.routeCode }} ({{ activeModal.route.driver.name }})
              </p>
            </div>
          </div>
          <button
            aria-label="Close modal"
            type="button"
            class="text-muted-foreground hover:text-foreground rounded-md p-1"
            @click="closeModal"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <Separator />

        <div class="space-y-3 text-xs">
          <div>
            <label class="text-foreground mb-1 block font-semibold">Pending Stop to Transfer:</label>
            <div class="border-border bg-muted/40 rounded-lg border p-3">
              <div class="flex items-center justify-between gap-x-2">
                <span class="text-foreground font-semibold">
                  {{
                    activeModal.route.stops.find((s) => s.status === 'pending')?.locationName ||
                    'Stop #4 - Delivery Destination'
                  }}
                </span>
                <Badge variant="outline" class="text-xs">
                  {{ activeModal.route.stops.find((s) => s.status === 'pending')?.packagesCount || 2 }} packages
                </Badge>
              </div>
              <p class="text-muted-foreground mt-0.5 text-xs">
                {{ activeModal.route.stops.find((s) => s.status === 'pending')?.address }}
              </p>
            </div>
          </div>

          <div>
            <label class="text-foreground mb-1 block font-semibold">Target Available Route / Driver:</label>
            <div class="space-y-2">
              <div
                v-for="target in DRIVER_ROUTES_DATA.filter((r) => r.id !== activeModal?.route.id)"
                :key="target.id"
                class="flex cursor-pointer items-center justify-between rounded-lg border p-2.5 transition-colors"
                :class="
                  activeModal.targetRouteId === target.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/30'
                "
                @click="activeModal.targetRouteId = target.id"
              >
                <div class="space-y-0.5">
                  <div class="flex items-center gap-1.5">
                    <span class="text-foreground font-semibold">{{ target.routeCode }} · {{ target.routeName }}</span>
                    <span class="text-muted-foreground text-xs">({{ target.driver.name }})</span>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Current Load: {{ target.currentPayloadLbs }} lbs ({{
                      Math.round((target.currentPayloadLbs / target.maxPayloadLbs) * 100)
                    }}%) · {{ target.totalStops - target.completedStops }} stops left
                  </p>
                </div>
                <div
                  class="border-border flex h-5 w-5 items-center justify-center rounded-full border"
                  :class="
                    activeModal.targetRouteId === target.id && 'border-primary bg-primary text-primary-foreground'
                  "
                >
                  <Check v-if="activeModal.targetRouteId === target.id" class="h-3 w-3 stroke-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <Button aria-label="Close modal" variant="outline" size="sm" class="h-8 text-xs" @click="closeModal"
            >Cancel</Button
          >
          <Button size="sm" class="h-8 text-xs font-medium" @click="handleConfirmReassign">
            <Check class="mr-1.5 h-3.5 w-3.5" /> Confirm Stop Reassignment
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
