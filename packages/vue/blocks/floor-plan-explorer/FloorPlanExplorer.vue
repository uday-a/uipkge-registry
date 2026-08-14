<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Bath,
  Bed,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Home,
  Layers,
  MapPin,
  Ruler,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface RoomSpec {
  id: string
  name: string
  shortLabel: string
  dimensionsImperial: string
  dimensionsMetric: string
  areaSqFt: number
  areaSqM: number
  flooring: string
  features: string[]
  pinX: number
  pinY: number
  rect: {
    x: number
    y: number
    w: number
    h: number
  }
}

export interface AvailableUnit {
  unitNumber: string
  floor: number
  view: string
  monthlyRent: number
  sqFt: number
  status: 'available-now' | 'available-soon' | 'leased' | 'under-contract'
  statusLabel: string
  moveInDate: string
  exposure: string
}

export interface FloorPlanData {
  id: string
  tabKey: string
  tabLabel: string
  marketingName: string
  tier: string
  beds: number
  baths: number
  totalAreaSqFt: number
  totalAreaSqM: number
  interiorSqFt: number
  exteriorSqFt: number
  ceilingHeight: string
  exposure: string
  startingRent: number
  description: string
  highlights: string[]
  rooms: RoomSpec[]
  availableUnits: AvailableUnit[]
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const activeTab = ref('plan-b')
const selectedRoomId = ref<string | null>('living')
const hoveredRoomId = ref<string | null>(null)
const selectedUnitNumber = ref<string>('402')
const showDimensions = ref(true)
const showFurniture = ref(true)
const showPins = ref(true)
const unitSystem = ref<'imperial' | 'metric'>('imperial')
const isDownloadingPdf = ref(false)
const downloadSuccess = ref(false)
const showTourSuccess = ref(false)

const floorPlans: Record<string, FloorPlanData> = {
  'plan-a': {
    id: 'plan-a',
    tabKey: 'plan-a',
    tabLabel: 'Plan A - 1 Bed / 1 Bath',
    marketingName: 'Plan A - The Urban Haven',
    tier: 'Urban Gallery Residence',
    beds: 1,
    baths: 1,
    totalAreaSqFt: 780,
    totalAreaSqM: 72.5,
    interiorSqFt: 735,
    exteriorSqFt: 45,
    ceilingHeight: `10' 0" Finished`,
    exposure: 'East · Garden & Sunrise',
    startingRent: 3450,
    description:
      'Artfully designed open-concept layout featuring oversized east-facing windows, gourmet galley kitchen with quartz surfaces, secluded bedroom suite with walk-in closet, and a private sunrise terrace.',
    highlights: [
      'Floor-to-ceiling glass wall',
      'European quartz kitchen island',
      'Deep soaking tub & frameless shower',
      'Private sunrise terrace',
    ],
    rooms: [
      {
        id: 'living',
        name: 'Living & Dining Room',
        shortLabel: 'Living / Dining',
        dimensionsImperial: `16' × 12'`,
        dimensionsMetric: '4.9m × 3.7m',
        areaSqFt: 192,
        areaSqM: 17.8,
        flooring: 'Wide Plank Natural White Oak',
        features: ['East Sunrise Exposure', '9-Foot Glazing Wall', 'Concealed Media Wiring'],
        pinX: 280,
        pinY: 175,
        rect: { x: 170, y: 90, w: 230, h: 170 },
      },
      {
        id: 'master-bed',
        name: 'Master Bedroom',
        shortLabel: 'Master Bed',
        dimensionsImperial: `13' × 11'`,
        dimensionsMetric: '4.0m × 3.4m',
        areaSqFt: 143,
        areaSqM: 13.3,
        flooring: 'Plush Organic Wool Loop',
        features: ['Acoustic Insulation', 'Custom Closet Built-ins', 'Blackout Shade Pocket'],
        pinX: 505,
        pinY: 175,
        rect: { x: 410, y: 90, w: 190, h: 170 },
      },
      {
        id: 'kitchen',
        name: 'Gourmet Galley Kitchen',
        shortLabel: 'Kitchen',
        dimensionsImperial: `11' × 9'`,
        dimensionsMetric: '3.4m × 2.7m',
        areaSqFt: 99,
        areaSqM: 9.2,
        flooring: 'Calacatta Honed Quartzite',
        features: ['Integrated Bosch Appliances', 'Undermount LED Lights', 'Soft-Close Walnut Joinery'],
        pinX: 280,
        pinY: 330,
        rect: { x: 170, y: 270, w: 230, h: 120 },
      },
      {
        id: 'master-bath',
        name: 'Primary Full Bath',
        shortLabel: 'Full Bath',
        dimensionsImperial: `9' × 6'`,
        dimensionsMetric: '2.7m × 1.8m',
        areaSqFt: 54,
        areaSqM: 5.0,
        flooring: 'Matte Slate & Terrazzo',
        features: ['Kohler Undermount Sink', 'Frameless Glass Shower', 'Backlit Anti-Fog Vanity'],
        pinX: 505,
        pinY: 330,
        rect: { x: 410, y: 270, w: 190, h: 120 },
      },
      {
        id: 'balcony',
        name: 'Private Terrace',
        shortLabel: 'Terrace',
        dimensionsImperial: `9' × 5'`,
        dimensionsMetric: '2.7m × 1.5m',
        areaSqFt: 45,
        areaSqM: 4.2,
        flooring: 'Weathered Teak Decking',
        features: ['Architectural Steel Railing', 'Exterior Power Outlet', 'Garden Courtyard Vistas'],
        pinX: 105,
        pinY: 175,
        rect: { x: 50, y: 90, w: 110, h: 170 },
      },
    ],
    availableUnits: [
      {
        unitNumber: '304',
        floor: 3,
        view: 'Courtyard & Garden',
        monthlyRent: 3450,
        sqFt: 780,
        status: 'available-now',
        statusLabel: 'Available Now',
        moveInDate: 'Immediate',
        exposure: 'East',
      },
      {
        unitNumber: '604',
        floor: 6,
        view: 'Skyline Sunrise View',
        monthlyRent: 3650,
        sqFt: 780,
        status: 'available-soon',
        statusLabel: 'Available Oct 15',
        moveInDate: 'Oct 15, 2026',
        exposure: 'East / North',
      },
      {
        unitNumber: '904',
        floor: 9,
        view: 'High-Floor Park View',
        monthlyRent: 3800,
        sqFt: 780,
        status: 'leased',
        statusLabel: 'Leased',
        moveInDate: 'Occupied',
        exposure: 'East',
      },
    ],
  },
  'plan-b': {
    id: 'plan-b',
    tabKey: 'plan-b',
    tabLabel: 'Plan B - 2 Bed / 2 Bath',
    marketingName: 'Plan B - The Skyline Suite',
    tier: 'Signature Corner Residence',
    beds: 2,
    baths: 2,
    totalAreaSqFt: 1420,
    totalAreaSqM: 132.0,
    interiorSqFt: 1360,
    exteriorSqFt: 60,
    ceilingHeight: `10' 6" Finished`,
    exposure: 'Southwest · Bay & City Skyline',
    startingRent: 4850,
    description:
      'Expansive dual-exposure residence centered around a dramatic living and entertaining salon with floor-to-ceiling panoramic glass, chef-grade kitchen island, split master and guest wings, and a sheltered private terrace.',
    highlights: [
      'Dual-aspect corner positioning with 270° light',
      'Chef island with 10-foot marble waterfall',
      'Primary wing with dual walk-in closets',
      'Dedicated foyer vestibule & utility pantry',
    ],
    rooms: [
      {
        id: 'living',
        name: 'Living Room',
        shortLabel: 'Living Room',
        dimensionsImperial: `18' × 14'`,
        dimensionsMetric: '5.5m × 4.3m',
        areaSqFt: 252,
        areaSqM: 23.4,
        flooring: 'Wide Plank European White Oak',
        features: ['Floor-to-Ceiling Corner Glazing', 'Motorized Solar Shades', 'Recessed Architectural Lighting'],
        pinX: 255,
        pinY: 160,
        rect: { x: 150, y: 75, w: 220, h: 175 },
      },
      {
        id: 'master-bed',
        name: 'Master Bedroom',
        shortLabel: 'Master Bed',
        dimensionsImperial: `15' × 12'`,
        dimensionsMetric: '4.6m × 3.7m',
        areaSqFt: 180,
        areaSqM: 16.7,
        flooring: 'New Zealand Wool Weave',
        features: ['South Bay Views', 'Direct En-Suite Access', 'Custom Millwork Wardrobe'],
        pinX: 455,
        pinY: 145,
        rect: { x: 380, y: 75, w: 155, h: 150 },
      },
      {
        id: 'kitchen',
        name: 'Chef Kitchen & Dining',
        shortLabel: 'Kitchen',
        dimensionsImperial: `12' × 10'`,
        dimensionsMetric: '3.7m × 3.0m',
        areaSqFt: 120,
        areaSqM: 11.1,
        flooring: 'Calacatta Honed Quartzite',
        features: ['Waterfall Marble Island', 'Sub-Zero & Wolf Appliances', 'Pantry Cabinetry'],
        pinX: 255,
        pinY: 325,
        rect: { x: 150, y: 260, w: 220, h: 135 },
      },
      {
        id: 'master-bath',
        name: 'Master Bath',
        shortLabel: 'Master Bath',
        dimensionsImperial: `10' × 8'`,
        dimensionsMetric: '3.0m × 2.4m',
        areaSqFt: 80,
        areaSqM: 7.4,
        flooring: 'Bianco Carrara Marble',
        features: ['Dual Floating Vanities', 'Walk-in Rain Shower', 'Acoustic Privacy Door'],
        pinX: 590,
        pinY: 145,
        rect: { x: 545, y: 75, w: 90, h: 150 },
      },
      {
        id: 'guest-bed',
        name: 'Guest Bedroom / Study',
        shortLabel: 'Guest Bed',
        dimensionsImperial: `13' × 11'`,
        dimensionsMetric: '4.0m × 3.4m',
        areaSqFt: 143,
        areaSqM: 13.3,
        flooring: 'Wide Plank European White Oak',
        features: ['Multi-Function Home Office', 'South Window Exposure', 'Built-in Closet System'],
        pinX: 565,
        pinY: 320,
        rect: { x: 490, y: 245, w: 145, h: 150 },
      },
      {
        id: 'guest-bath',
        name: 'Guest Full Bath',
        shortLabel: 'Guest Bath',
        dimensionsImperial: `8' × 6'`,
        dimensionsMetric: '2.4m × 1.8m',
        areaSqFt: 48,
        areaSqM: 4.5,
        flooring: 'Smoked Gray Terrazzo',
        features: ['Full Soaking Tub', 'Modern Matte Black Fixtures', 'Linen Storage'],
        pinX: 430,
        pinY: 320,
        rect: { x: 380, y: 245, w: 100, h: 150 },
      },
      {
        id: 'balcony',
        name: 'Private Terrace',
        shortLabel: 'Terrace',
        dimensionsImperial: `10' × 6'`,
        dimensionsMetric: '3.0m × 1.8m',
        areaSqFt: 60,
        areaSqM: 5.6,
        flooring: 'Architectural Ipe Wood',
        features: ['Panoramic Bay Overlook', 'Weatherproof Recessed Sconces', 'Glass Wind Guard'],
        pinX: 90,
        pinY: 160,
        rect: { x: 40, y: 75, w: 100, h: 175 },
      },
    ],
    availableUnits: [
      {
        unitNumber: '402',
        floor: 4,
        view: 'South City View',
        monthlyRent: 4850,
        sqFt: 1420,
        status: 'available-now',
        statusLabel: 'Available Now',
        moveInDate: 'Immediate',
        exposure: 'South / West',
      },
      {
        unitNumber: '708',
        floor: 7,
        view: 'Bay & Marina View',
        monthlyRent: 5200,
        sqFt: 1420,
        status: 'available-soon',
        statusLabel: 'Available Sep 1',
        moveInDate: 'Sep 1, 2026',
        exposure: 'Bay View / South',
      },
      {
        unitNumber: '1102',
        floor: 11,
        view: 'Penthouse Level Panoramic',
        monthlyRent: 5600,
        sqFt: 1420,
        status: 'leased',
        statusLabel: 'Leased',
        moveInDate: 'Occupied',
        exposure: 'Panoramic South',
      },
    ],
  },
  'plan-c': {
    id: 'plan-c',
    tabKey: 'plan-c',
    tabLabel: 'Plan C - 3 Bed Penthouse',
    marketingName: 'Plan C - The Grandview Penthouse',
    tier: 'Crown Estate Penthouse',
    beds: 3,
    baths: 3.5,
    totalAreaSqFt: 2250,
    totalAreaSqM: 209.0,
    interiorSqFt: 2090,
    exteriorSqFt: 160,
    ceilingHeight: `11' 8" Finished`,
    exposure: '360° Panoramic · Harbor, Bay & Bridges',
    startingRent: 9400,
    description:
      'A true architectural masterpiece occupying the top levels of the tower. Direct key-lock private elevator access opens into a sweeping grand salon with 11.5-foot ceilings, full culinary kitchen with butler pantry, spa sanctuary primary suite, and wraparound sky terrace.',
    highlights: [
      'Private elevator vestibule with secure biometric access',
      'Wraparound sky terrace with built-in gas fire table',
      'Primary retreat with double walk-in dressing galleries',
      'Butler service pantry with climate-controlled wine vault',
    ],
    rooms: [
      {
        id: 'grand-salon',
        name: 'Grand Salon & Living',
        shortLabel: 'Grand Salon',
        dimensionsImperial: `24' × 16'`,
        dimensionsMetric: '7.3m × 4.9m',
        areaSqFt: 384,
        areaSqM: 35.7,
        flooring: 'Herringbone European Oak',
        features: ['360° Bay Vista Glazing', 'Gas Linear Fireplace', 'Custom Architectural Coving'],
        pinX: 275,
        pinY: 155,
        rect: { x: 160, y: 85, w: 240, h: 150 },
      },
      {
        id: 'primary-suite',
        name: 'Primary Penthouse Suite',
        shortLabel: 'Primary Suite',
        dimensionsImperial: `18' × 14'`,
        dimensionsMetric: '5.5m × 4.3m',
        areaSqFt: 252,
        areaSqM: 23.4,
        flooring: 'Custom Silk-Wool Blend Weave',
        features: ['Harbor Sunrise Exposure', 'Sitting Lounge Area', 'Dual Walk-in Closets'],
        pinX: 480,
        pinY: 155,
        rect: { x: 410, y: 85, w: 140, h: 150 },
      },
      {
        id: 'spa-bath',
        name: 'Spa Sanctuary Primary Bath',
        shortLabel: 'Spa Bath',
        dimensionsImperial: `12' × 9'`,
        dimensionsMetric: '3.7m × 2.7m',
        areaSqFt: 108,
        areaSqM: 10.0,
        flooring: 'Bookmatched Calacatta Marble',
        features: ['Freestanding Oval Soaking Tub', 'Dual Steam Shower', 'Radiant Heated Flooring'],
        pinX: 595,
        pinY: 155,
        rect: { x: 560, y: 85, w: 80, h: 150 },
      },
      {
        id: 'dining',
        name: 'Formal Dining Gallery',
        shortLabel: 'Dining Room',
        dimensionsImperial: `15' × 12'`,
        dimensionsMetric: '4.6m × 3.7m',
        areaSqFt: 180,
        areaSqM: 16.7,
        flooring: 'Herringbone European Oak',
        features: ['Seating for 10-12 Guests', 'Integrated Bar Cabinetry', 'Designer Chandelier Anchor'],
        pinX: 235,
        pinY: 315,
        rect: { x: 160, y: 245, w: 150, h: 145 },
      },
      {
        id: 'kitchen',
        name: 'Culinary Kitchen & Pantry',
        shortLabel: 'Kitchen',
        dimensionsImperial: `16' × 11'`,
        dimensionsMetric: '4.9m × 3.4m',
        areaSqFt: 176,
        areaSqM: 16.3,
        flooring: 'Taj Mahal Quartzite',
        features: ['12-Foot Monolithic Island', 'Gaggenau 400 Series Suite', 'Butler Prep Scullery'],
        pinX: 95,
        pinY: 315,
        rect: { x: 40, y: 245, w: 110, h: 145 },
      },
      {
        id: 'bed-2',
        name: 'Bedroom Suite 2',
        shortLabel: 'Bed 2 Suite',
        dimensionsImperial: `14' × 12'`,
        dimensionsMetric: '4.3m × 3.7m',
        areaSqFt: 168,
        areaSqM: 15.6,
        flooring: 'Wide Plank European Oak',
        features: ['En-Suite Private Bath', 'South Window Bank', 'Deep Built-in Wardrobe'],
        pinX: 395,
        pinY: 315,
        rect: { x: 320, y: 245, w: 150, h: 145 },
      },
      {
        id: 'bed-3',
        name: 'Bedroom 3 / Executive Study',
        shortLabel: 'Bed 3 / Study',
        dimensionsImperial: `13' × 11'`,
        dimensionsMetric: '4.0m × 3.4m',
        areaSqFt: 143,
        areaSqM: 13.3,
        flooring: 'Custom Walnut Parquetry',
        features: ['Integrated Library Shelving', 'Acoustic Pocket Doors', 'Corner View Light'],
        pinX: 560,
        pinY: 315,
        rect: { x: 480, y: 245, w: 160, h: 145 },
      },
      {
        id: 'sky-terrace',
        name: 'Wraparound Sky Terrace',
        shortLabel: 'Sky Terrace',
        dimensionsImperial: `20' × 8'`,
        dimensionsMetric: '6.1m × 2.4m',
        areaSqFt: 160,
        areaSqM: 14.9,
        flooring: 'Porcelain Pavers & Teak',
        features: ['Integrated Linear Gas Hearth', 'Outdoor Audio Pre-Wire', 'Frameless Wind Barrier'],
        pinX: 340,
        pinY: 45,
        rect: { x: 160, y: 25, w: 360, h: 50 },
      },
    ],
    availableUnits: [
      {
        unitNumber: 'PH-01',
        floor: 14,
        view: '360° Bay & City Skyline',
        monthlyRent: 9400,
        sqFt: 2250,
        status: 'available-now',
        statusLabel: 'Available Now',
        moveInDate: 'Immediate',
        exposure: '360° Panoramic',
      },
      {
        unitNumber: 'PH-02',
        floor: 14,
        view: 'Harbor Sunrise & Marina',
        monthlyRent: 9100,
        sqFt: 2250,
        status: 'under-contract',
        statusLabel: 'Under Contract',
        moveInDate: 'Pending',
        exposure: 'East / South',
      },
      {
        unitNumber: 'PH-03',
        floor: 15,
        view: 'Crown Sky Penthouse with Spa',
        monthlyRent: 10500,
        sqFt: 2250,
        status: 'available-soon',
        statusLabel: 'Available Nov 1',
        moveInDate: 'Nov 1, 2026',
        exposure: 'Crown Panoramic',
      },
    ],
  },
}

const currentPlan = computed(() => floorPlans[activeTab.value] || floorPlans['plan-b'])

const activeRoom = computed(() => {
  if (hoveredRoomId.value) {
    return currentPlan.value.rooms.find((r) => r.id === hoveredRoomId.value) || null
  }
  if (selectedRoomId.value) {
    return currentPlan.value.rooms.find((r) => r.id === selectedRoomId.value) || null
  }
  return currentPlan.value.rooms[0] || null
})

function handleSelectTab(key: string) {
  activeTab.value = key
  const plan = floorPlans[key]
  if (plan) {
    selectedRoomId.value = plan.rooms[0]?.id || null
    hoveredRoomId.value = null
    selectedUnitNumber.value = plan.availableUnits[0]?.unitNumber || ''
  }
}

function handleSelectRoom(roomId: string) {
  selectedRoomId.value = roomId === selectedRoomId.value ? null : roomId
}

function handleHoverRoom(roomId: string | null) {
  hoveredRoomId.value = roomId
}

function handleSelectUnit(unitNo: string) {
  selectedUnitNumber.value = unitNo
}

function handleDownloadPdf() {
  isDownloadingPdf.value = true
  downloadSuccess.value = false
  setTimeout(() => {
    isDownloadingPdf.value = false
    downloadSuccess.value = true
    setTimeout(() => {
      downloadSuccess.value = false
    }, 4000)
  }, 900)
}

function handleScheduleTour() {
  showTourSuccess.value = true
  setTimeout(() => {
    showTourSuccess.value = false
  }, 4500)
}
</script>

<template>
  <div data-slot="floor-plan-explorer" :class="cn('bg-background text-foreground w-full space-y-6', props.class)">
    <!-- Header: Building Title, Plan Switcher Tabs, Action Button -->
    <header class="border-border flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <Badge variant="outline" class="text-muted-foreground gap-1 px-2 py-0.5 font-mono text-xs">
            <Building2 class="text-primary size-3" />
            The Grandview Collection
          </Badge>
          <span class="text-muted-foreground text-xs">Tower West · Residences</span>
        </div>
        <h1 class="text-xl font-semibold tracking-tight sm:text-2xl">
          The Grandview Penthouse Collection · Floor Plan Explorer
        </h1>
        <p class="text-muted-foreground text-xs sm:text-sm">
          Interactive architectural layout inspector, dimensional specifications, and real-time residential unit
          availability.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <Button
          aria-label="Download attachment"
          variant="outline"
          size="sm"
          class="h-9 gap-2 text-xs"
          :disabled="isDownloadingPdf"
          @click="handleDownloadPdf"
        >
          <Download v-if="!downloadSuccess" class="text-muted-foreground size-3.5" />
          <Check v-else class="size-3.5 text-emerald-500" />
          <span>{{
            isDownloadingPdf ? 'Generating PDF...' : downloadSuccess ? 'PDF Downloaded' : 'Download PDF Floor Plan'
          }}</span>
        </Button>
      </div>
    </header>

    <!-- Plan Selection Tabs Bar -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Tabs :model-value="activeTab" class="w-full sm:w-auto" @update:model-value="handleSelectTab(String($event))">
        <TabsList class="bg-muted/60 grid h-10 w-full grid-cols-3 gap-1 p-1 sm:w-auto">
          <TabsTrigger
            value="plan-a"
            class="data-[state=active]:bg-background px-3 text-xs font-medium data-[state=active]:shadow-xs sm:px-4 sm:text-sm"
          >
            Plan A - 1 Bed / 1 Bath
          </TabsTrigger>
          <TabsTrigger
            value="plan-b"
            class="data-[state=active]:bg-background px-3 text-xs font-medium data-[state=active]:shadow-xs sm:px-4 sm:text-sm"
          >
            Plan B - 2 Bed / 2 Bath
          </TabsTrigger>
          <TabsTrigger
            value="plan-c"
            class="data-[state=active]:bg-background px-3 text-xs font-medium data-[state=active]:shadow-xs sm:px-4 sm:text-sm"
          >
            Plan C - 3 Bed Penthouse
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div class="flex items-center gap-2">
        <span class="text-muted-foreground text-xs">Units:</span>
        <div class="border-border bg-muted/30 inline-flex rounded-md border p-0.5">
          <button
            type="button"
            :class="
              cn(
                'focus-visible:ring-ring rounded px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                unitSystem === 'imperial'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )
            "
            @click="unitSystem = 'imperial'"
          >
            Sq Ft / ft
          </button>
          <button
            type="button"
            :class="
              cn(
                'focus-visible:ring-ring rounded px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                unitSystem === 'metric'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )
            "
            @click="unitSystem = 'metric'"
          >
            m² / m
          </button>
        </div>
      </div>
    </div>

    <!-- 2-Column Inspector: Left 2D CAD Blueprint Canvas, Right Specs & Availability -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: 2D Architectural Layout Canvas (7 cols) -->
      <div class="space-y-4 lg:col-span-7">
        <Card class="border-border bg-card overflow-hidden shadow-xs">
          <!-- Canvas Toolbar Header -->
          <div class="border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
            <div class="flex items-center gap-2.5">
              <span class="relative flex size-2">
                <span class="bg-primary/60 absolute inline-flex size-full rounded-full opacity-75"></span>
                <span class="bg-primary relative inline-flex size-2 rounded-full"></span>
              </span>
              <div>
                <p class="text-foreground text-xs font-medium">2D Architectural CAD Schematic</p>
                <p class="text-muted-foreground text-xs">Interactive room layout & dimensional spans</p>
              </div>
            </div>

            <!-- Canvas View Options -->
            <div class="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                :class="cn('h-7 gap-1 px-2 text-xs', showDimensions && 'bg-muted text-foreground')"
                @click="showDimensions = !showDimensions"
              >
                <Ruler class="text-muted-foreground size-3" />
                <span>Dimensions</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="cn('h-7 gap-1 px-2 text-xs', showFurniture && 'bg-muted text-foreground')"
                @click="showFurniture = !showFurniture"
              >
                <Layers class="text-muted-foreground size-3" />
                <span>Fixtures</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="cn('h-7 gap-1 px-2 text-xs', showPins && 'bg-muted text-foreground')"
                @click="showPins = !showPins"
              >
                <MapPin class="text-muted-foreground size-3" />
                <span>Pins</span>
              </Button>
            </div>
          </div>

          <!-- Canvas Drawing Surface -->
          <div class="bg-card/95 relative p-3 sm:p-5">
            <svg
              viewBox="0 0 680 430"
              class="border-border/70 bg-card w-full rounded border select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <!-- Blueprint Architectural Grid Pattern -->
                <pattern id="cad-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" class="stroke-muted-foreground/10" stroke-width="0.75" />
                </pattern>
                <pattern id="cad-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#cad-grid-pattern)" />
                  <path d="M 100 0 L 0 0 0 100" fill="none" class="stroke-muted-foreground/20" stroke-width="1.25" />
                </pattern>
                <!-- Balcony / Terrace Wood Decking Pattern -->
                <pattern
                  id="deck-slats"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="8" class="stroke-muted-foreground/25" stroke-width="1.5" />
                </pattern>
              </defs>

              <!-- Blueprint Grid Background -->
              <rect width="680" height="430" fill="url(#cad-grid-major)" />

              <!-- North Arrow Compass Widget -->
              <g transform="translate(635, 38)" class="text-muted-foreground">
                <circle cx="0" cy="0" r="18" fill="none" class="stroke-border" stroke-width="1.2" />
                <path d="M 0 -13 L 4 4 L 0 1 L -4 4 Z" class="fill-primary" />
                <path d="M 0 1 L 4 4 L 0 13 L -4 4 Z" class="fill-muted-foreground/30" />
                <text x="0" y="-15" text-anchor="middle" class="fill-foreground font-mono text-xs font-bold">N</text>
              </g>

              <!-- Scale Indicator Bar -->
              <g transform="translate(25, 412)" class="text-muted-foreground">
                <line x1="0" y1="0" x2="100" y2="0" class="stroke-foreground" stroke-width="2" />
                <line x1="0" y1="-4" x2="0" y2="4" class="stroke-foreground" stroke-width="2" />
                <line x1="50" y1="-3" x2="50" y2="3" class="stroke-foreground" stroke-width="1.5" />
                <line x1="100" y1="-4" x2="100" y2="4" class="stroke-foreground" stroke-width="2" />
                <text x="0" y="-7" class="fill-muted-foreground font-mono text-xs">0</text>
                <text x="46" y="-7" class="fill-muted-foreground font-mono text-xs">10'</text>
                <text x="94" y="-7" class="fill-muted-foreground font-mono text-xs">20'</text>
                <text x="115" y="3" class="fill-muted-foreground font-mono text-xs">Scale 1/4" = 1'0"</text>
              </g>

              <!-- Architectural Rooms Layout Polygons -->
              <g>
                <template v-for="room in currentPlan.rooms" :key="room.id">
                  <g
                    class="cursor-pointer transition-all duration-200"
                    @mouseenter="handleHoverRoom(room.id)"
                    @mouseleave="handleHoverRoom(null)"
                    @click="handleSelectRoom(room.id)"
                  >
                    <!-- Room Floor Fill -->
                    <rect
                      :x="room.rect.x"
                      :y="room.rect.y"
                      :width="room.rect.w"
                      :height="room.rect.h"
                      :fill="room.id === 'balcony' || room.id === 'sky-terrace' ? 'url(#deck-slats)' : 'currentColor'"
                      :class="
                        cn(
                          'transition-colors duration-150',
                          selectedRoomId === room.id || hoveredRoomId === room.id
                            ? 'text-primary/15'
                            : room.id === 'balcony' || room.id === 'sky-terrace'
                              ? 'text-muted/60'
                              : 'text-card',
                        )
                      "
                    />

                    <!-- Room Border Perimeter -->
                    <rect
                      :x="room.rect.x"
                      :y="room.rect.y"
                      :width="room.rect.w"
                      :height="room.rect.h"
                      fill="none"
                      :class="
                        cn(
                          'transition-all duration-150',
                          selectedRoomId === room.id
                            ? 'stroke-primary stroke-[2.5]'
                            : hoveredRoomId === room.id
                              ? 'stroke-primary/70 stroke-[2]'
                              : 'stroke-border/90 stroke-[1.5]',
                        )
                      "
                    />

                    <!-- Architectural Fixtures Silhouette Layer -->
                    <g
                      v-if="showFurniture"
                      class="stroke-muted-foreground/35 text-muted-foreground/20 pointer-events-none fill-none"
                    >
                      <!-- Living Room: Sofa & Coffee Table -->
                      <template v-if="room.id === 'living' || room.id === 'grand-salon'">
                        <rect
                          :x="room.rect.x + 24"
                          :y="room.rect.y + 24"
                          width="75"
                          height="40"
                          rx="4"
                          stroke-width="1.2"
                          class="stroke-muted-foreground/40"
                        />
                        <rect
                          :x="room.rect.x + 38"
                          :y="room.rect.y + 72"
                          width="46"
                          height="24"
                          rx="2"
                          stroke-width="1.2"
                          class="stroke-muted-foreground/30"
                        />
                        <line
                          :x1="room.rect.x + 130"
                          :y1="room.rect.y + 20"
                          :x2="room.rect.x + 130"
                          :y2="room.rect.y + 110"
                          stroke-dasharray="3 3"
                          stroke-width="1"
                          class="stroke-muted-foreground/20"
                        />
                      </template>

                      <!-- Bedroom: Bed Silhouette & Pillows -->
                      <template
                        v-if="
                          room.id === 'master-bed' ||
                          room.id === 'guest-bed' ||
                          room.id === 'primary-suite' ||
                          room.id === 'bed-2'
                        "
                      >
                        <rect
                          :x="room.rect.x + 20"
                          :y="room.rect.y + 25"
                          width="60"
                          height="75"
                          rx="3"
                          stroke-width="1.2"
                          class="stroke-muted-foreground/40"
                        />
                        <rect
                          :x="room.rect.x + 26"
                          :y="room.rect.y + 30"
                          width="20"
                          height="14"
                          rx="2"
                          stroke-width="1"
                          class="stroke-muted-foreground/30"
                        />
                        <rect
                          :x="room.rect.x + 54"
                          :y="room.rect.y + 30"
                          width="20"
                          height="14"
                          rx="2"
                          stroke-width="1"
                          class="stroke-muted-foreground/30"
                        />
                        <line
                          :x1="room.rect.x + 20"
                          :y1="room.rect.y + 55"
                          :x2="room.rect.x + 80"
                          :y2="room.rect.y + 55"
                          stroke-width="1"
                          class="stroke-muted-foreground/20"
                        />
                      </template>

                      <!-- Kitchen: Island & Cooktop / Prep Sink -->
                      <template v-if="room.id === 'kitchen'">
                        <rect
                          :x="room.rect.x + 18"
                          :y="room.rect.y + 20"
                          width="85"
                          height="36"
                          rx="2"
                          stroke-width="1.2"
                          class="stroke-muted-foreground/40"
                        />
                        <circle
                          :cx="room.rect.x + 38"
                          :cy="room.rect.y + 38"
                          r="6"
                          stroke-width="1"
                          class="stroke-muted-foreground/40"
                        />
                        <circle
                          :cx="room.rect.x + 56"
                          :cy="room.rect.y + 38"
                          r="6"
                          stroke-width="1"
                          class="stroke-muted-foreground/40"
                        />
                        <rect
                          :x="room.rect.x + 72"
                          :y="room.rect.y + 30"
                          width="18"
                          height="16"
                          rx="1"
                          stroke-width="1"
                          class="stroke-muted-foreground/30"
                        />
                      </template>

                      <!-- Bathrooms: Tub / Shower & Vanity -->
                      <template v-if="room.id === 'master-bath' || room.id === 'guest-bath' || room.id === 'spa-bath'">
                        <rect
                          :x="room.rect.x + 12"
                          :y="room.rect.y + 15"
                          width="38"
                          height="50"
                          rx="6"
                          stroke-width="1.2"
                          class="stroke-muted-foreground/40"
                        />
                        <circle
                          :cx="room.rect.x + 31"
                          :cy="room.rect.y + 40"
                          r="3"
                          stroke-width="1"
                          class="stroke-muted-foreground/40"
                        />
                      </template>

                      <!-- Balcony: Railing Post Accents -->
                      <template v-if="room.id === 'balcony' || room.id === 'sky-terrace'">
                        <line
                          :x1="room.rect.x"
                          :y1="room.rect.y"
                          :x2="room.rect.x"
                          :y2="room.rect.y + room.rect.h"
                          stroke-width="3"
                          class="stroke-primary/50"
                        />
                      </template>
                    </g>

                    <!-- Dimension Leader Line Callouts -->
                    <g v-if="showDimensions" class="pointer-events-none select-none">
                      <!-- Room Dimension Text -->
                      <text
                        :x="room.pinX"
                        :y="room.pinY + 16"
                        text-anchor="middle"
                        class="fill-muted-foreground font-mono text-xs font-medium"
                      >
                        {{ unitSystem === 'imperial' ? room.dimensionsImperial : room.dimensionsMetric }}
                      </text>
                    </g>
                  </g>
                </template>
              </g>

              <!-- Outer Perimeter Heavy Structural Walls -->
              <g class="pointer-events-none">
                <!-- Windows with Glass Double Thin Lines -->
                <line x1="160" y1="75" x2="380" y2="75" class="stroke-sky-400 dark:stroke-sky-300" stroke-width="2.5" />
                <line x1="390" y1="75" x2="540" y2="75" class="stroke-sky-400 dark:stroke-sky-300" stroke-width="2.5" />
                <line x1="550" y1="75" x2="635" y2="75" class="stroke-sky-400 dark:stroke-sky-300" stroke-width="2.5" />
              </g>

              <!-- Interactive Room Highlight Pins -->
              <g v-if="showPins">
                <template v-for="room in currentPlan.rooms" :key="`pin-${room.id}`">
                  <g
                    :transform="`translate(${room.pinX}, ${room.pinY - 8})`"
                    class="cursor-pointer transition-transform duration-150"
                    @mouseenter="handleHoverRoom(room.id)"
                    @mouseleave="handleHoverRoom(null)"
                    @click="handleSelectRoom(room.id)"
                  >
                    <!-- Pulsing Halo on Selected -->
                    <circle
                      v-if="selectedRoomId === room.id || hoveredRoomId === room.id"
                      cx="0"
                      cy="0"
                      r="16"
                      class="fill-primary/30"
                    />

                    <!-- Pin Badge Background Pill -->
                    <rect
                      x="-48"
                      y="-12"
                      width="96"
                      height="24"
                      rx="12"
                      :class="
                        cn(
                          'transition-all duration-150',
                          selectedRoomId === room.id
                            ? 'fill-primary stroke-primary-foreground stroke-1 shadow-md'
                            : hoveredRoomId === room.id
                              ? 'fill-foreground stroke-background stroke-1'
                              : 'fill-card/90 stroke-border stroke-1 shadow-xs backdrop-blur-xs',
                        )
                      "
                    />

                    <!-- Pin Label Text -->
                    <text
                      x="0"
                      y="4"
                      text-anchor="middle"
                      :class="
                        cn(
                          'font-mono text-xs font-semibold select-none',
                          selectedRoomId === room.id
                            ? 'fill-primary-foreground'
                            : hoveredRoomId === room.id
                              ? 'fill-background'
                              : 'fill-foreground',
                        )
                      "
                    >
                      {{ room.shortLabel }}
                    </text>
                  </g>
                </template>
              </g>
            </svg>
          </div>

          <!-- Canvas Footer Status / Active Room Info -->
          <div class="border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
            <div class="flex items-center gap-2">
              <Badge variant="outline" class="gap-1 font-mono text-xs font-normal">
                <Home class="text-primary size-3" />
                Active Focus: {{ activeRoom?.name || 'Overview' }}
              </Badge>
              <span class="text-muted-foreground text-xs">
                {{ unitSystem === 'imperial' ? activeRoom?.dimensionsImperial : activeRoom?.dimensionsMetric }} ·
                <span class="text-foreground font-mono font-medium tabular-nums">
                  {{ unitSystem === 'imperial' ? `${activeRoom?.areaSqFt} Sq Ft` : `${activeRoom?.areaSqM} m²` }}
                </span>
              </span>
            </div>

            <div class="text-muted-foreground flex items-center gap-2 text-xs">
              <span class="hidden sm:inline">Finish:</span>
              <span class="text-foreground font-medium">{{ activeRoom?.flooring }}</span>
            </div>
          </div>
        </Card>

        <!-- Floor Plan Features / Highlights Strip -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          <div class="border-border bg-card rounded-lg border p-3 shadow-xs">
            <p class="text-muted-foreground text-xs">Ceiling Height</p>
            <p class="text-foreground mt-0.5 font-mono text-sm font-semibold tabular-nums">
              {{ currentPlan.ceilingHeight }}
            </p>
          </div>
          <div class="border-border bg-card rounded-lg border p-3 shadow-xs">
            <p class="text-muted-foreground text-xs">Outdoor Space</p>
            <p class="text-foreground mt-0.5 font-mono text-sm font-semibold tabular-nums">
              {{
                unitSystem === 'imperial'
                  ? `${currentPlan.exteriorSqFt} Sq Ft`
                  : `${(currentPlan.exteriorSqFt * 0.0929).toFixed(1)} m²`
              }}
            </p>
          </div>
          <div class="border-border bg-card rounded-lg border p-3 shadow-xs">
            <p class="text-muted-foreground text-xs">Exposure</p>
            <p class="text-foreground mt-0.5 text-xs font-medium">{{ currentPlan.exposure }}</p>
          </div>
          <div class="border-border bg-card rounded-lg border p-3 shadow-xs">
            <p class="text-muted-foreground text-xs">Starting Rent</p>
            <p class="text-foreground mt-0.5 font-mono text-sm font-semibold tabular-nums">
              ${{ currentPlan.startingRent.toLocaleString()
              }}<span class="text-muted-foreground text-xs font-normal">/mo</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Unit Specs, Room Breakdown & Available Units Table (5 cols) -->
      <div class="space-y-6 lg:col-span-5">
        <!-- Selected Plan Header Card with Total Area -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <Badge variant="secondary" class="font-mono text-xs">
                {{ currentPlan.tier }}
              </Badge>
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Bed class="size-3.5" />
                <span>{{ currentPlan.beds }} Bed</span>
                <span>·</span>
                <Bath class="size-3.5" />
                <span>{{ currentPlan.baths }} Bath</span>
              </div>
            </div>
            <CardTitle class="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
              {{ currentPlan.marketingName }}
            </CardTitle>
            <CardDescription class="text-xs leading-relaxed sm:text-sm">
              {{ currentPlan.description }}
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Total Area Hero Metric Box -->
            <div class="border-border bg-muted/40 rounded-lg border p-4">
              <p class="text-muted-foreground text-xs font-medium">Total Architectural Living Area</p>
              <div class="mt-1 flex items-baseline gap-2">
                <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                  {{ currentPlan.totalAreaSqFt.toLocaleString() }}
                </span>
                <span class="text-muted-foreground text-sm font-medium">Sq Ft</span>
                <span class="text-muted-foreground/60">/</span>
                <span class="text-muted-foreground font-mono text-lg font-semibold tabular-nums">
                  {{ currentPlan.totalAreaSqM.toFixed(1) }}
                </span>
                <span class="text-muted-foreground text-xs font-medium">m²</span>
              </div>
              <div
                class="border-border/60 text-muted-foreground mt-2 flex flex-wrap items-center justify-between border-t pt-2 text-xs"
              >
                <span
                  >Interior:
                  <strong class="text-foreground font-mono tabular-nums"
                    >{{ currentPlan.interiorSqFt }} sq ft</strong
                  ></span
                >
                <span
                  >Terrace:
                  <strong class="text-foreground font-mono tabular-nums"
                    >{{ currentPlan.exteriorSqFt }} sq ft</strong
                  ></span
                >
              </div>
            </div>

            <!-- Room Breakdown List with Interactive Highlights -->
            <div>
              <div class="mb-2 flex flex-wrap items-center justify-between">
                <h4 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Room Breakdown & Dimensions
                </h4>
                <span class="text-muted-foreground text-xs">{{ currentPlan.rooms.length }} Spaces</span>
              </div>

              <div class="space-y-1.5">
                <div
                  v-for="room in currentPlan.rooms"
                  :key="room.id"
                  :class="
                    cn(
                      'flex cursor-pointer items-center justify-between rounded-md border p-2.5 transition-all duration-150',
                      selectedRoomId === room.id
                        ? 'border-primary bg-primary/5 shadow-xs'
                        : hoveredRoomId === room.id
                          ? 'border-border bg-muted/60'
                          : 'border-border/60 bg-card hover:bg-muted/30',
                    )
                  "
                  @mouseenter="handleHoverRoom(room.id)"
                  @mouseleave="handleHoverRoom(null)"
                  @click="handleSelectRoom(room.id)"
                >
                  <div class="flex min-w-0 items-center gap-2">
                    <span
                      :class="
                        cn(
                          'size-2 rounded-full transition-colors',
                          selectedRoomId === room.id
                            ? 'bg-primary'
                            : hoveredRoomId === room.id
                              ? 'bg-primary/70'
                              : 'bg-muted-foreground/40',
                        )
                      "
                    ></span>
                    <div>
                      <p class="text-foreground text-xs font-medium">{{ room.name }}</p>
                      <p class="text-muted-foreground text-xs">{{ room.flooring }}</p>
                    </div>
                  </div>

                  <div class="shrink-0 text-right">
                    <p class="text-foreground font-mono text-xs font-semibold tabular-nums">
                      {{ unitSystem === 'imperial' ? room.dimensionsImperial : room.dimensionsMetric }}
                    </p>
                    <p class="text-muted-foreground font-mono text-xs tabular-nums">
                      {{ unitSystem === 'imperial' ? `${room.areaSqFt} sq ft` : `${room.areaSqM} m²` }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Available Units in Building Table -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div>
                <CardTitle class="text-sm font-semibold tracking-tight sm:text-base">
                  Available Units in Building
                </CardTitle>
                <CardDescription class="text-xs">
                  Real-time occupancy and lease rates for {{ currentPlan.tabLabel }}
                </CardDescription>
              </div>
              <Badge variant="outline" class="font-mono text-xs">
                {{ currentPlan.availableUnits.filter((u) => u.status !== 'leased').length }} Available
              </Badge>
            </div>
          </CardHeader>

          <CardContent class="p-0">
            <div class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow class="hover:bg-transparent">
                    <TableHead class="w-[80px] text-xs font-medium">Unit</TableHead>
                    <TableHead class="text-xs font-medium">Floor & View</TableHead>
                    <TableHead class="text-right text-xs font-medium">Monthly Rent</TableHead>
                    <TableHead class="text-right text-xs font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="unit in currentPlan.availableUnits"
                    :key="unit.unitNumber"
                    :class="
                      cn(
                        'cursor-pointer text-xs transition-colors',
                        selectedUnitNumber === unit.unitNumber ? 'bg-muted/80 font-medium' : 'hover:bg-muted/40',
                      )
                    "
                    @click="handleSelectUnit(unit.unitNumber)"
                  >
                    <TableCell class="text-foreground font-mono font-semibold tabular-nums">
                      Unit {{ unit.unitNumber }}
                    </TableCell>
                    <TableCell>
                      <div class="text-foreground text-xs">{{ unit.view }}</div>
                      <div class="text-muted-foreground text-xs">Floor {{ unit.floor }} · {{ unit.exposure }}</div>
                    </TableCell>
                    <TableCell class="text-foreground text-right font-mono font-semibold tabular-nums">
                      ${{ unit.monthlyRent.toLocaleString() }}
                      <span class="text-muted-foreground font-normal">/mo</span>
                    </TableCell>
                    <TableCell class="text-right">
                      <Badge
                        v-if="unit.status === 'available-now'"
                        class="border-emerald-500/20 bg-emerald-500/10 text-xs font-normal text-emerald-600 dark:text-emerald-400"
                      >
                        {{ unit.statusLabel }}
                      </Badge>
                      <Badge
                        v-else-if="unit.status === 'available-soon'"
                        class="border-sky-500/20 bg-sky-500/10 text-xs font-normal text-sky-600 dark:text-sky-400"
                      >
                        {{ unit.statusLabel }}
                      </Badge>
                      <Badge
                        v-else-if="unit.status === 'under-contract'"
                        class="border-amber-500/20 bg-amber-500/10 text-xs font-normal text-amber-600 dark:text-amber-400"
                      >
                        {{ unit.statusLabel }}
                      </Badge>
                      <Badge v-else variant="secondary" class="text-muted-foreground text-xs font-normal">
                        {{ unit.statusLabel }}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <CardFooter class="border-border flex flex-col gap-2.5 border-t pt-4">
            <div class="flex w-full flex-col gap-2 sm:flex-row">
              <Button class="w-full gap-2 text-xs sm:flex-1" @click="handleScheduleTour">
                <Calendar class="size-3.5" />
                <span>Schedule Private Showing</span>
              </Button>
              <Button variant="outline" class="w-full gap-2 text-xs sm:flex-1" @click="handleScheduleTour">
                <FileText class="size-3.5" />
                <span>Apply for Unit</span>
              </Button>
            </div>

            <div
              v-if="showTourSuccess"
              class="flex w-full items-center gap-2 rounded-md bg-emerald-500/10 p-2.5 text-xs text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 class="size-4 shrink-0" />
              <span
                >Tour request received for Unit {{ selectedUnitNumber }}. Leasing agent will contact you within 15
                minutes.</span
              >
            </div>

            <p class="text-muted-foreground text-center text-xs">
              Self-guided tours and agent-accompanied showings available daily 9:00 AM – 7:00 PM.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
