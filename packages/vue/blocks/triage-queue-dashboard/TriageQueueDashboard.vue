<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { Bed, Clock, DoorOpen, HeartPulse, MoreHorizontal, Plus, RefreshCw, Search, Zap } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type EsiLevel = 'esi-1' | 'esi-2' | 'esi-3' | 'esi-4'

export interface PatientVitals {
  bp: string
  hr: number
  spo2: number
  temp: string
  respRate: number
}

export interface Caregiver {
  name: string
  role: 'RN' | 'MD' | 'PA' | 'NP'
  initials: string
  avatar?: string
}

export interface TriagePatient {
  id: string
  mrn: string
  name: string
  age: number
  gender: 'M' | 'F' | 'Other'
  acuity: EsiLevel
  acuityCode: string
  acuityLabel: string
  chiefComplaint: string
  symptoms: string
  waitTime: string
  waitMinutes: number
  vitals: PatientVitals
  assignedRoom: string
  roomType: 'trauma' | 'acute' | 'fast_track' | 'waiting'
  primaryNurse: Caregiver
  attendingPhysician: Caregiver
  clinicalStatus: string
}

interface AcuitySummaryCard {
  level: EsiLevel
  title: string
  subtitle: string
  activeCount: number
  targetWait: string
  targetWindow: string
  badgeVariantClass: string
  indicatorDot?: string
  pulse: boolean
  description: string
}

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    unitName?: string
    facilityName?: string
  }>(),
  {
    unitName: 'Level 1 Trauma Center · Bay 4',
    facilityName: 'St. Jude Metropolitan Academic Medical Center',
  },
)

const search = ref('')
const acuityFilter = ref<string>('all')
const locationFilter = ref<string>('all')
const sortBy = ref<'wait-desc' | 'wait-asc' | 'acuity'>('acuity')

const acuityCards: AcuitySummaryCard[] = [
  {
    level: 'esi-1',
    title: 'ESI 1 · Resuscitation',
    subtitle: 'Immediate Life Threat',
    activeCount: 1,
    targetWait: 'Immediate',
    targetWindow: '0 min wait',
    badgeVariantClass: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
    indicatorDot: 'bg-red-500',
    pulse: true,
    description: 'Hemodynamic instability, active airway compromise',
  },
  {
    level: 'esi-2',
    title: 'ESI 2 · Emergent',
    subtitle: 'High Risk / Severe Pain',
    activeCount: 3,
    targetWait: '< 15m wait',
    targetWindow: 'Max 15 min',
    badgeVariantClass: 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400',
    indicatorDot: 'bg-orange-500',
    pulse: false,
    description: 'Confused, lethargic, severe respiratory distress',
  },
  {
    level: 'esi-3',
    title: 'ESI 3 · Urgent',
    subtitle: 'Multiple Resources Needed',
    activeCount: 8,
    targetWait: '< 30m wait',
    targetWindow: 'Max 30 min',
    badgeVariantClass: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    indicatorDot: 'bg-amber-500',
    pulse: false,
    description: 'Stable vitals, 2+ diagnostic or lab orders needed',
  },
  {
    level: 'esi-4',
    title: 'ESI 4/5 · Non-Urgent',
    subtitle: 'Low Resource / Fast Track',
    activeCount: 6,
    targetWait: '< 60m wait',
    targetWindow: 'Max 60 min',
    badgeVariantClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    indicatorDot: 'bg-emerald-500',
    pulse: false,
    description: 'Simple lacerations, routine medication re-eval',
  },
]

const patients: TriagePatient[] = [
  {
    id: 'pt-1',
    mrn: 'MRN-94021',
    name: 'James Wilson',
    age: 62,
    gender: 'M',
    acuity: 'esi-1',
    acuityCode: 'ESI 1',
    acuityLabel: 'ESI 1 - Resuscitation',
    chiefComplaint: 'Severe Crushing Chest Pain',
    symptoms: 'Diaphoresis, radiating left jaw pain, dyspnea. STAT STEMI protocol initiated.',
    waitTime: '2 min',
    waitMinutes: 2,
    vitals: {
      bp: '88/54',
      hr: 124,
      spo2: 91,
      temp: '98.4°F',
      respRate: 28,
    },
    assignedRoom: 'Trauma Bay 2',
    roomType: 'trauma',
    primaryNurse: {
      name: 'Sarah Jenkins, RN',
      role: 'RN',
      initials: 'SJ',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
    },
    attendingPhysician: {
      name: 'Dr. Marcus Chen, MD',
      role: 'MD',
      initials: 'MC',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
    },
    clinicalStatus: 'Cath Lab Alert · In Bay',
  },
  {
    id: 'pt-2',
    mrn: 'MRN-88319',
    name: 'Maria Garcia',
    age: 34,
    gender: 'F',
    acuity: 'esi-2',
    acuityCode: 'ESI 2',
    acuityLabel: 'ESI 2 - Emergent',
    chiefComplaint: 'Compound Tibia Fracture',
    symptoms: 'Post-motorcycle collision, visible bone deformity, uncontrolled bleeding controlled by tourniquet.',
    waitTime: '9 min',
    waitMinutes: 9,
    vitals: {
      bp: '138/86',
      hr: 106,
      spo2: 97,
      temp: '99.1°F',
      respRate: 22,
    },
    assignedRoom: 'Trauma Bay 4',
    roomType: 'trauma',
    primaryNurse: {
      name: 'Kevin Vance, RN',
      role: 'RN',
      initials: 'KV',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
    },
    attendingPhysician: {
      name: 'Dr. Lisa Thorne, MD',
      role: 'MD',
      initials: 'LT',
      avatar: 'https://images.unsplash.com/photo-1594824813637-e54e44e26210?w=120&auto=format&fit=crop&q=80',
    },
    clinicalStatus: 'Ortho Paged · IV Analgesia',
  },
  {
    id: 'pt-3',
    mrn: 'MRN-72915',
    name: 'Noah Miller',
    age: 8,
    gender: 'M',
    acuity: 'esi-2',
    acuityCode: 'ESI 2',
    acuityLabel: 'ESI 2 - Emergent',
    chiefComplaint: 'Acute Asthma Exacerbation',
    symptoms: 'Inspiratory and expiratory stridor, intercostal retractions, refractory to home albuterol.',
    waitTime: '14 min',
    waitMinutes: 14,
    vitals: {
      bp: '104/68',
      hr: 132,
      spo2: 92,
      temp: '99.8°F',
      respRate: 34,
    },
    assignedRoom: 'Bed 06 (Peds Acute)',
    roomType: 'acute',
    primaryNurse: {
      name: 'Angela Ray, RN',
      role: 'RN',
      initials: 'AR',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&auto=format&fit=crop&q=80',
    },
    attendingPhysician: {
      name: 'Dr. Marcus Chen, MD',
      role: 'MD',
      initials: 'MC',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
    },
    clinicalStatus: 'Duoneb #2 · Continuous O2',
  },
  {
    id: 'pt-4',
    mrn: 'MRN-51829',
    name: 'Sarah Lee',
    age: 45,
    gender: 'F',
    acuity: 'esi-3',
    acuityCode: 'ESI 3',
    acuityLabel: 'ESI 3 - Urgent',
    chiefComplaint: 'Right Lower Quadrant Abdominal Pain',
    symptoms: 'Severe pain x 14h, focal McBurney point tenderness, nausea, low-grade fever.',
    waitTime: '28 min',
    waitMinutes: 28,
    vitals: {
      bp: '126/82',
      hr: 92,
      spo2: 98,
      temp: '101.4°F',
      respRate: 18,
    },
    assignedRoom: 'Bed 14',
    roomType: 'acute',
    primaryNurse: {
      name: 'David Park, RN',
      role: 'RN',
      initials: 'DP',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&auto=format&fit=crop&q=80',
    },
    attendingPhysician: {
      name: 'Dr. Sophia Adams, MD',
      role: 'MD',
      initials: 'SA',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
    },
    clinicalStatus: 'CT Scan Queued · NPO',
  },
  {
    id: 'pt-5',
    mrn: 'MRN-63910',
    name: 'Robert Chen',
    age: 58,
    gender: 'M',
    acuity: 'esi-3',
    acuityCode: 'ESI 3',
    acuityLabel: 'ESI 3 - Urgent',
    chiefComplaint: 'Suspected Renal Colic & Flank Pain',
    symptoms: 'Sudden onset severe right flank pain radiating to groin, gross hematuria, pain score 8/10.',
    waitTime: '42 min',
    waitMinutes: 42,
    vitals: {
      bp: '146/94',
      hr: 88,
      spo2: 99,
      temp: '98.4°F',
      respRate: 16,
    },
    assignedRoom: 'Bed 18',
    roomType: 'acute',
    primaryNurse: {
      name: 'Rachel Torres, RN',
      role: 'RN',
      initials: 'RT',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    attendingPhysician: {
      name: 'Dr. Sophia Adams, MD',
      role: 'MD',
      initials: 'SA',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
    },
    clinicalStatus: 'Ultrasound Ordered · IV Fluids',
  },
  {
    id: 'pt-6',
    mrn: 'MRN-90423',
    name: 'Marcus Vance',
    age: 22,
    gender: 'M',
    acuity: 'esi-4',
    acuityCode: 'ESI 4',
    acuityLabel: 'ESI 4 - Non-Urgent',
    chiefComplaint: 'Forearm Deep Glass Laceration',
    symptoms: '4cm clean linear laceration, hemostasis achieved, neurovascular sensation intact distally.',
    waitTime: '54 min',
    waitMinutes: 54,
    vitals: {
      bp: '120/78',
      hr: 74,
      spo2: 100,
      temp: '98.6°F',
      respRate: 14,
    },
    assignedRoom: 'Fast Track 02',
    roomType: 'fast_track',
    primaryNurse: {
      name: 'Kevin Vance, RN',
      role: 'RN',
      initials: 'KV',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
    },
    attendingPhysician: {
      name: 'Dr. Emily Watson, MD',
      role: 'MD',
      initials: 'EW',
      avatar: 'https://images.unsplash.com/photo-1594824813637-e54e44e26210?w=120&auto=format&fit=crop&q=80',
    },
    clinicalStatus: 'Wound Irrigated · Suture Tray Ready',
  },
]

const filteredPatients = computed(() => {
  return patients
    .filter((pt) => {
      // Search filter
      if (search.value.trim()) {
        const query = search.value.toLowerCase()
        const matchesName = pt.name.toLowerCase().includes(query)
        const matchesMrn = pt.mrn.toLowerCase().includes(query)
        const matchesComplaint = pt.chiefComplaint.toLowerCase().includes(query)
        const matchesRoom = pt.assignedRoom.toLowerCase().includes(query)
        if (!matchesName && !matchesMrn && !matchesComplaint && !matchesRoom) return false
      }

      // Acuity filter
      if (acuityFilter.value !== 'all') {
        if (pt.acuity !== acuityFilter.value) return false
      }

      // Location filter
      if (locationFilter.value !== 'all') {
        if (pt.roomType !== locationFilter.value) return false
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy.value === 'wait-desc') return b.waitMinutes - a.waitMinutes
      if (sortBy.value === 'wait-asc') return a.waitMinutes - b.waitMinutes
      // Acuity default sorting: ESI 1 -> ESI 2 -> ESI 3 -> ESI 4
      const order: Record<EsiLevel, number> = { 'esi-1': 1, 'esi-2': 2, 'esi-3': 3, 'esi-4': 4 }
      return order[a.acuity] - order[b.acuity]
    })
})

function handleAcuityCardClick(level: EsiLevel) {
  if (acuityFilter.value === level) {
    acuityFilter.value = 'all'
  } else {
    acuityFilter.value = level
  }
}

function resetFilters() {
  search.value = ''
  acuityFilter.value = 'all'
  locationFilter.value = 'all'
  sortBy.value = 'acuity'
}
</script>

<template>
  <div
    data-slot="triage-queue-dashboard"
    :class="cn('bg-background text-foreground flex w-full flex-col gap-6 font-sans', props.class)"
  >
    <!-- Live ED Header -->
    <header class="bg-card border-border rounded-xl border p-5 shadow-xs sm:p-6">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <!-- Title & Operational Meta -->
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2.5">
            <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
              <HeartPulse class="size-5" />
            </div>
            <div>
              <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                Emergency Department Triage Queue
              </h1>
              <p class="text-muted-foreground text-xs font-medium sm:text-sm">
                {{ props.facilityName }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <Badge variant="outline" class="border-border bg-muted/50 text-foreground gap-1.5 font-medium">
              <Bed class="text-primary size-3.5" />
              {{ props.unitName }}
            </Badge>

            <Badge
              variant="outline"
              class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-700 dark:text-emerald-400"
            >
              <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              18 In Unit · 4 Awaiting Triage
            </Badge>

            <span class="text-muted-foreground hidden items-center gap-1 sm:inline-flex">
              <Clock class="size-3" />
              Live Sync · Updated seconds ago
            </span>
          </div>
        </div>

        <!-- Primary Actions -->
        <div class="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium">
            <RefreshCw class="text-muted-foreground size-3.5" />
            Refresh Queue
          </Button>

          <Button size="sm" class="gap-1.5 text-xs font-semibold shadow-xs">
            <Plus class="size-4" />
            Admit New Patient
          </Button>
        </div>
      </div>
    </header>

    <!-- 4 Acuity Overview Cards (ESI 1 to ESI 4/5) -->
    <section aria-label="Acuity Overview Cards" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        v-for="card in acuityCards"
        :key="card.level"
        :class="
          cn(
            'border-border relative cursor-pointer transition-all duration-150 select-none hover:shadow-sm',
            acuityFilter === card.level && 'ring-primary/40 bg-accent/40 ring-2',
          )
        "
        @click="handleAcuityCardClick(card.level)"
      >
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-start justify-between gap-2">
            <div class="space-y-1">
              <div class="flex items-center gap-1.5">
                <span :class="cn('size-2 shrink-0 rounded-full', card.indicatorDot, card.pulse && 'animate-pulse')" />
                <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  {{ card.subtitle }}
                </span>
              </div>
              <h2 class="text-foreground text-sm font-semibold sm:text-base">
                {{ card.title }}
              </h2>
            </div>

            <Badge variant="outline" :class="cn('gap-1 px-2 py-0.5 text-xs font-semibold', card.badgeVariantClass)">
              <span v-if="card.pulse" class="size-1.5 animate-pulse rounded-full bg-red-500" />
              {{ card.targetWait }}
            </Badge>
          </div>

          <div class="mt-4 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                {{ card.activeCount }}
              </span>
              <span class="text-muted-foreground text-xs font-medium">active in queue</span>
            </div>

            <span class="text-muted-foreground text-xs tabular-nums">
              {{ card.targetWindow }}
            </span>
          </div>

          <p class="text-muted-foreground mt-2 text-xs leading-relaxed">
            {{ card.description }}
          </p>
        </CardContent>
      </Card>
    </section>

    <!-- Patient Queue Table Card -->
    <Card class="border-border shadow-xs">
      <CardHeader class="border-border border-b p-4 sm:p-5">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <!-- Title & Active Filter Summary -->
          <div>
            <div class="flex items-center gap-2">
              <CardTitle class="text-foreground text-base font-semibold sm:text-lg">
                Patient Triage & Allocation Board
              </CardTitle>
              <Badge variant="secondary" class="font-mono text-xs tabular-nums">
                {{ filteredPatients.length }} Patients
              </Badge>
            </div>
            <CardDescription class="text-muted-foreground mt-0.5 text-xs">
              Continuous monitoring of emergency severity index, vital signs, and room throughput.
            </CardDescription>
          </div>

          <!-- Controls: Search & Filters -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Search Field -->
            <div class="relative w-full min-w-[200px] sm:w-60">
              <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                v-model="search"
                type="text"
                placeholder="Search patient, MRN, bay..."
                class="h-8 pl-8 text-xs sm:text-sm"
              />
            </div>

            <!-- Acuity Level Filter -->
            <div class="w-36 sm:w-40">
              <Select v-model="acuityFilter">
                <SelectTrigger class="h-8 text-xs">
                  <SelectValue placeholder="All Acuities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Acuities</SelectItem>
                  <SelectItem value="esi-1">ESI 1 - Resuscitation</SelectItem>
                  <SelectItem value="esi-2">ESI 2 - Emergent</SelectItem>
                  <SelectItem value="esi-3">ESI 3 - Urgent</SelectItem>
                  <SelectItem value="esi-4">ESI 4/5 - Non-Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Location Filter -->
            <div class="w-32 sm:w-36">
              <Select v-model="locationFilter">
                <SelectTrigger class="h-8 text-xs">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="trauma">Trauma Bays</SelectItem>
                  <SelectItem value="acute">Acute Beds</SelectItem>
                  <SelectItem value="fast_track">Fast Track</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Reset Button -->
            <Button
              v-if="search || acuityFilter !== 'all' || locationFilter !== 'all'"
              variant="ghost"
              size="sm"
              class="h-8 px-2 text-xs"
              @click="resetFilters"
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent">
                <TableHead class="w-[140px] text-xs font-semibold">Acuity (ESI)</TableHead>
                <TableHead class="min-w-[200px] text-xs font-semibold">Patient Demographics</TableHead>
                <TableHead class="min-w-[240px] text-xs font-semibold">Chief Complaint & Symptoms</TableHead>
                <TableHead class="w-[110px] text-xs font-semibold">Wait Time</TableHead>
                <TableHead class="min-w-[190px] text-xs font-semibold">Vitals Snapshot</TableHead>
                <TableHead class="w-[150px] text-xs font-semibold">Bed / Room</TableHead>
                <TableHead class="min-w-[160px] text-xs font-semibold">Attending Staff</TableHead>
                <TableHead class="w-[60px] text-right text-xs font-semibold">
                  <span class="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <!-- Empty State -->
              <TableRow v-if="filteredPatients.length === 0">
                <TableCell colspan="8" class="h-48 text-center">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <div class="bg-muted flex size-10 items-center justify-center rounded-full">
                      <Search class="text-muted-foreground size-5" />
                    </div>
                    <p class="text-foreground text-sm font-semibold">No patients match current filters</p>
                    <p class="text-muted-foreground text-xs">
                      Try clearing your search query or selecting "All Acuities".
                    </p>
                    <Button variant="outline" size="sm" class="mt-2 text-xs" @click="resetFilters">
                      Reset Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Patient Queue Rows -->
              <TableRow
                v-for="pt in filteredPatients"
                :key="pt.id"
                :class="cn('transition-colors', pt.acuity === 'esi-1' && 'bg-red-500/[0.03] dark:bg-red-950/[0.15]')"
              >
                <!-- Acuity ESI Badge -->
                <TableCell class="align-top font-medium">
                  <div class="flex flex-col items-start gap-1">
                    <Badge
                      variant="outline"
                      :class="
                        cn(
                          'gap-1.5 px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                          pt.acuity === 'esi-1' && 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
                          pt.acuity === 'esi-2' &&
                            'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400',
                          pt.acuity === 'esi-3' &&
                            'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
                          pt.acuity === 'esi-4' &&
                            'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                        )
                      "
                    >
                      <span v-if="pt.acuity === 'esi-1'" class="size-1.5 animate-pulse rounded-full bg-red-500" />
                      {{ pt.acuityCode }}
                    </Badge>
                    <span class="text-muted-foreground text-xs font-medium">
                      {{
                        pt.acuity === 'esi-1'
                          ? 'Resuscitation'
                          : pt.acuity === 'esi-2'
                            ? 'Emergent'
                            : pt.acuity === 'esi-3'
                              ? 'Urgent'
                              : 'Non-Urgent'
                      }}
                    </span>
                  </div>
                </TableCell>

                <!-- Patient Demographics -->
                <TableCell class="align-top">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-foreground text-sm font-semibold tracking-tight">
                        {{ pt.name }}
                      </span>
                      <span class="text-muted-foreground text-xs font-medium"> ({{ pt.age }}{{ pt.gender }}) </span>
                    </div>
                    <div class="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                      <span>{{ pt.mrn }}</span>
                    </div>
                  </div>
                </TableCell>

                <!-- Chief Complaint & Symptoms -->
                <TableCell class="align-top">
                  <div class="space-y-1">
                    <p class="text-foreground text-xs font-semibold">
                      {{ pt.chiefComplaint }}
                    </p>
                    <p class="text-muted-foreground text-xs leading-relaxed">
                      {{ pt.symptoms }}
                    </p>
                  </div>
                </TableCell>

                <!-- Wait Time Counter -->
                <TableCell class="align-top">
                  <div class="flex items-center gap-1.5 pt-0.5">
                    <Clock
                      :class="cn('size-3.5 shrink-0', pt.waitMinutes > 30 ? 'text-amber-500' : 'text-muted-foreground')"
                    />
                    <span
                      :class="
                        cn(
                          'text-xs font-semibold tabular-nums',
                          pt.waitMinutes > 40 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground',
                        )
                      "
                    >
                      {{ pt.waitTime }}
                    </span>
                  </div>
                </TableCell>

                <!-- Vitals Snapshot -->
                <TableCell class="align-top">
                  <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <div class="flex items-center justify-between gap-1 font-mono">
                      <span class="text-muted-foreground">BP:</span>
                      <span
                        :class="
                          cn(
                            'font-semibold tabular-nums',
                            pt.acuity === 'esi-1' ? 'text-red-600 dark:text-red-400' : 'text-foreground',
                          )
                        "
                      >
                        {{ pt.vitals.bp }}
                      </span>
                    </div>

                    <div class="flex items-center justify-between gap-1 font-mono">
                      <span class="text-muted-foreground">HR:</span>
                      <span
                        :class="
                          cn(
                            'font-semibold tabular-nums',
                            pt.vitals.hr > 110 ? 'text-red-600 dark:text-red-400' : 'text-foreground',
                          )
                        "
                      >
                        {{ pt.vitals.hr }} bpm
                      </span>
                    </div>

                    <div class="flex items-center justify-between gap-1 font-mono">
                      <span class="text-muted-foreground">SpO2:</span>
                      <span
                        :class="
                          cn(
                            'font-semibold tabular-nums',
                            pt.vitals.spo2 < 95 ? 'text-red-600 dark:text-red-400' : 'text-foreground',
                          )
                        "
                      >
                        {{ pt.vitals.spo2 }}%
                      </span>
                    </div>

                    <div class="flex items-center justify-between gap-1 font-mono">
                      <span class="text-muted-foreground">Temp:</span>
                      <span class="text-foreground font-semibold tabular-nums">
                        {{ pt.vitals.temp }}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <!-- Assigned Bed / Room -->
                <TableCell class="align-top">
                  <div class="space-y-1">
                    <Badge
                      variant="outline"
                      class="border-border bg-muted/40 text-foreground gap-1 text-xs font-medium"
                    >
                      <Bed class="text-primary size-3" />
                      {{ pt.assignedRoom }}
                    </Badge>
                    <p class="text-muted-foreground text-xs">
                      {{ pt.clinicalStatus }}
                    </p>
                  </div>
                </TableCell>

                <!-- Attending Staff -->
                <TableCell class="align-top">
                  <div class="space-y-1.5">
                    <div class="flex items-center gap-2">
                      <Avatar class="size-6">
                        <AvatarImage :src="pt.primaryNurse.avatar" :alt="pt.primaryNurse.name" />
                        <AvatarFallback class="bg-primary/10 text-primary text-xs font-medium">
                          {{ pt.primaryNurse.initials }}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        class="text-foreground max-w-[130px] truncate text-xs leading-none font-medium"
                        :title="pt.primaryNurse.name"
                      >
                        {{ pt.primaryNurse.name }}
                      </span>
                    </div>

                    <div class="flex items-center gap-2">
                      <Avatar class="size-6">
                        <AvatarImage :src="pt.attendingPhysician.avatar" :alt="pt.attendingPhysician.name" />
                        <AvatarFallback class="bg-secondary text-secondary-foreground text-xs font-medium">
                          {{ pt.attendingPhysician.initials }}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        class="text-muted-foreground max-w-[130px] truncate text-xs leading-none"
                        :title="pt.attendingPhysician.name"
                      >
                        {{ pt.attendingPhysician.name }}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <!-- Actions Menu -->
                <TableCell class="text-right align-top">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon-sm" class="size-8">
                        <MoreHorizontal class="size-4" />
                        <span class="sr-only">Patient actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-48">
                      <DropdownMenuLabel>Triage Actions</DropdownMenuLabel>
                      <DropdownMenuItem class="cursor-pointer gap-2">
                        <Bed class="size-4" />
                        Assign Room
                      </DropdownMenuItem>
                      <DropdownMenuItem class="cursor-pointer gap-2">
                        <HeartPulse class="size-4" />
                        Re-triage Acuity
                      </DropdownMenuItem>
                      <DropdownMenuItem class="cursor-pointer gap-2">
                        <Zap class="size-4" />
                        Order STAT Labs
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="cursor-pointer gap-2">
                        <DoorOpen class="size-4" />
                        Discharge / Transfer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Table Footer / Status Summary -->
        <div
          class="border-border bg-muted/20 text-muted-foreground flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-xs"
        >
          <div class="flex items-center gap-3 font-medium">
            <span>Level 1 Trauma Alert Protocol Active</span>
            <Separator orientation="vertical" class="h-3.5" />
            <span class="tabular-nums">Average Door-to-Triage: 4.2 min</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-foreground font-medium">ED Occupancy:</span>
            <span class="text-foreground font-semibold tabular-nums">88% (22/25 Beds)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
