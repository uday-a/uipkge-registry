'use client'

import * as React from 'react'
import { Bed, Clock, DoorOpen, HeartPulse, MoreHorizontal, Plus, RefreshCw, Search, Zap } from 'lucide-react'
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

export interface AcuitySummaryCard {
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

export interface TriageQueueDashboardProps {
  className?: string
  unitName?: string
  facilityName?: string
}

const defaultAcuityCards: AcuitySummaryCard[] = [
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

const initialPatients: TriagePatient[] = [
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

export function TriageQueueDashboard({
  className,
  unitName = 'Level 1 Trauma Center · Bay 4',
  facilityName = 'St. Jude Metropolitan Academic Medical Center',
}: TriageQueueDashboardProps) {
  const [search, setSearch] = React.useState('')
  const [acuityFilter, setAcuityFilter] = React.useState('all')
  const [locationFilter, setLocationFilter] = React.useState('all')
  const [sortBy] = React.useState<'wait-desc' | 'wait-asc' | 'acuity'>('acuity')

  const filteredPatients = React.useMemo(() => {
    return initialPatients
      .filter((pt) => {
        // Search filter
        if (search.trim()) {
          const query = search.toLowerCase()
          const matchesName = pt.name.toLowerCase().includes(query)
          const matchesMrn = pt.mrn.toLowerCase().includes(query)
          const matchesComplaint = pt.chiefComplaint.toLowerCase().includes(query)
          const matchesRoom = pt.assignedRoom.toLowerCase().includes(query)
          if (!matchesName && !matchesMrn && !matchesComplaint && !matchesRoom) return false
        }

        // Acuity filter
        if (acuityFilter !== 'all') {
          if (pt.acuity !== acuityFilter) return false
        }

        // Location filter
        if (locationFilter !== 'all') {
          if (pt.roomType !== locationFilter) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'wait-desc') return b.waitMinutes - a.waitMinutes
        if (sortBy === 'wait-asc') return a.waitMinutes - b.waitMinutes
        const order: Record<EsiLevel, number> = { 'esi-1': 1, 'esi-2': 2, 'esi-3': 3, 'esi-4': 4 }
        return order[a.acuity] - order[b.acuity]
      })
  }, [search, acuityFilter, locationFilter, sortBy])

  const handleAcuityCardClick = (level: EsiLevel) => {
    if (acuityFilter === level) {
      setAcuityFilter('all')
    } else {
      setAcuityFilter(level)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setAcuityFilter('all')
    setLocationFilter('all')
  }

  return (
    <div
      data-slot="triage-queue-dashboard"
      className={cn('bg-background text-foreground flex w-full flex-col gap-6 font-sans', className)}
    >
      {/* Live ED Header */}
      <header className="bg-card border-border rounded-xl border p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Title & Operational Meta */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                <HeartPulse className="size-5" />
              </div>
              <div>
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Emergency Department Triage Queue
                </h1>
                <p className="text-muted-foreground text-xs font-medium sm:text-sm">{facilityName}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <Badge variant="outline" className="border-border bg-muted/50 text-foreground gap-1.5 font-medium">
                <Bed className="text-primary size-3.5" />
                {unitName}
              </Badge>

              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-700 dark:text-emerald-400"
              >
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                18 In Unit · 4 Awaiting Triage
              </Badge>

              <span className="text-muted-foreground hidden items-center gap-1 sm:inline-flex">
                <Clock className="size-3" />
                Live Sync · Updated seconds ago
              </span>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
              <RefreshCw className="text-muted-foreground size-3.5" />
              Refresh Queue
            </Button>

            <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
              <Plus className="size-4" />
              Admit New Patient
            </Button>
          </div>
        </div>
      </header>

      {/* 4 Acuity Overview Cards (ESI 1 to ESI 4/5) */}
      <section aria-label="Acuity Overview Cards" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {defaultAcuityCards.map((card) => {
          const isSelected = acuityFilter === card.level
          return (
            <Card
              key={card.level}
              className={cn(
                'border-border relative cursor-pointer transition-all duration-150 select-none hover:shadow-sm',
                isSelected && 'ring-primary/40 bg-accent/40 ring-2',
              )}
              onClick={() => handleAcuityCardClick(card.level)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn('size-2 shrink-0 rounded-full', card.indicatorDot, card.pulse && 'animate-pulse')}
                      />
                      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                        {card.subtitle}
                      </span>
                    </div>
                    <h2 className="text-foreground text-sm font-semibold sm:text-base">{card.title}</h2>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn('gap-1 px-2 py-0.5 text-xs font-semibold', card.badgeVariantClass)}
                  >
                    {card.pulse && <span className="size-1.5 animate-pulse rounded-full bg-red-500" />}
                    {card.targetWait}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                      {card.activeCount}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">active in queue</span>
                  </div>

                  <span className="text-muted-foreground text-xs tabular-nums">{card.targetWindow}</span>
                </div>

                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{card.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Patient Queue Table Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-border border-b p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Title & Active Filter Summary */}
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-foreground text-base font-semibold sm:text-lg">
                  Patient Triage & Allocation Board
                </CardTitle>
                <Badge variant="secondary" className="font-mono text-xs tabular-nums">
                  {filteredPatients.length} Patients
                </Badge>
              </div>
              <CardDescription className="text-muted-foreground mt-0.5 text-xs">
                Continuous monitoring of emergency severity index, vital signs, and room throughput.
              </CardDescription>
            </div>

            {/* Controls: Search & Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Field */}
              <div className="relative w-full min-w-[200px] sm:w-60">
                <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search patient, MRN, bay..."
                  className="h-8 pl-8 text-xs sm:text-sm"
                />
              </div>

              {/* Acuity Level Filter */}
              <div className="w-36 sm:w-40">
                <Select value={acuityFilter} onValueChange={setAcuityFilter}>
                  <SelectTrigger className="h-8 text-xs">
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

              {/* Location Filter */}
              <div className="w-32 sm:w-36">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="h-8 text-xs">
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

              {/* Reset Button */}
              {(search || acuityFilter !== 'all' || locationFilter !== 'all') && (
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={resetFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[140px] text-xs font-semibold">Acuity (ESI)</TableHead>
                  <TableHead className="min-w-[200px] text-xs font-semibold">Patient Demographics</TableHead>
                  <TableHead className="min-w-[240px] text-xs font-semibold">Chief Complaint & Symptoms</TableHead>
                  <TableHead className="w-[110px] text-xs font-semibold">Wait Time</TableHead>
                  <TableHead className="min-w-[190px] text-xs font-semibold">Vitals Snapshot</TableHead>
                  <TableHead className="w-[150px] text-xs font-semibold">Bed / Room</TableHead>
                  <TableHead className="min-w-[160px] text-xs font-semibold">Attending Staff</TableHead>
                  <TableHead className="w-[60px] text-right text-xs font-semibold">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Empty State */}
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                          <Search className="text-muted-foreground size-5" />
                        </div>
                        <p className="text-foreground text-sm font-semibold">No patients match current filters</p>
                        <p className="text-muted-foreground text-xs">
                          Try clearing your search query or selecting "All Acuities".
                        </p>
                        <Button variant="outline" size="sm" className="mt-2 text-xs" onClick={resetFilters}>
                          Reset Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((pt) => {
                    const isEsi1 = pt.acuity === 'esi-1'
                    const isEsi2 = pt.acuity === 'esi-2'
                    const isEsi3 = pt.acuity === 'esi-3'
                    const isEsi4 = pt.acuity === 'esi-4'

                    return (
                      <TableRow
                        key={pt.id}
                        className={cn('transition-colors', isEsi1 && 'bg-red-500/[0.03] dark:bg-red-950/[0.15]')}
                      >
                        {/* Acuity ESI Badge */}
                        <TableCell className="align-top font-medium">
                          <div className="flex flex-col items-start gap-1">
                            <Badge
                              variant="outline"
                              className={cn(
                                'gap-1.5 px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                                isEsi1 && 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
                                isEsi2 && 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400',
                                isEsi3 && 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
                                isEsi4 &&
                                  'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                              )}
                            >
                              {isEsi1 && <span className="size-1.5 animate-pulse rounded-full bg-red-500" />}
                              {pt.acuityCode}
                            </Badge>
                            <span className="text-muted-foreground text-xs font-medium">
                              {isEsi1 ? 'Resuscitation' : isEsi2 ? 'Emergent' : isEsi3 ? 'Urgent' : 'Non-Urgent'}
                            </span>
                          </div>
                        </TableCell>

                        {/* Patient Demographics */}
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-foreground text-sm font-semibold tracking-tight">{pt.name}</span>
                              <span className="text-muted-foreground text-xs font-medium">
                                ({pt.age}
                                {pt.gender})
                              </span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                              <span>{pt.mrn}</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Chief Complaint & Symptoms */}
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="text-foreground text-xs font-semibold">{pt.chiefComplaint}</p>
                            <p className="text-muted-foreground text-xs leading-relaxed">{pt.symptoms}</p>
                          </div>
                        </TableCell>

                        {/* Wait Time Counter */}
                        <TableCell className="align-top">
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <Clock
                              className={cn(
                                'size-3.5 shrink-0',
                                pt.waitMinutes > 30 ? 'text-amber-500' : 'text-muted-foreground',
                              )}
                            />
                            <span
                              className={cn(
                                'text-xs font-semibold tabular-nums',
                                pt.waitMinutes > 40 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground',
                              )}
                            >
                              {pt.waitTime}
                            </span>
                          </div>
                        </TableCell>

                        {/* Vitals Snapshot */}
                        <TableCell className="align-top">
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                            <div className="flex items-center justify-between gap-1 font-mono">
                              <span className="text-muted-foreground">BP:</span>
                              <span
                                className={cn(
                                  'font-semibold tabular-nums',
                                  isEsi1 ? 'text-red-600 dark:text-red-400' : 'text-foreground',
                                )}
                              >
                                {pt.vitals.bp}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-1 font-mono">
                              <span className="text-muted-foreground">HR:</span>
                              <span
                                className={cn(
                                  'font-semibold tabular-nums',
                                  pt.vitals.hr > 110 ? 'text-red-600 dark:text-red-400' : 'text-foreground',
                                )}
                              >
                                {pt.vitals.hr} bpm
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-1 font-mono">
                              <span className="text-muted-foreground">SpO2:</span>
                              <span
                                className={cn(
                                  'font-semibold tabular-nums',
                                  pt.vitals.spo2 < 95 ? 'text-red-600 dark:text-red-400' : 'text-foreground',
                                )}
                              >
                                {pt.vitals.spo2}%
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-1 font-mono">
                              <span className="text-muted-foreground">Temp:</span>
                              <span className="text-foreground font-semibold tabular-nums">{pt.vitals.temp}</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Assigned Bed / Room */}
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <Badge
                              variant="outline"
                              className="border-border bg-muted/40 text-foreground gap-1 text-xs font-medium"
                            >
                              <Bed className="text-primary size-3" />
                              {pt.assignedRoom}
                            </Badge>
                            <p className="text-muted-foreground text-xs">{pt.clinicalStatus}</p>
                          </div>
                        </TableCell>

                        {/* Attending Staff */}
                        <TableCell className="align-top">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Avatar className="size-6">
                                <AvatarImage src={pt.primaryNurse.avatar} alt={pt.primaryNurse.name} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                  {pt.primaryNurse.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className="text-foreground max-w-[130px] truncate text-xs leading-none font-medium"
                                title={pt.primaryNurse.name}
                              >
                                {pt.primaryNurse.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Avatar className="size-6">
                                <AvatarImage src={pt.attendingPhysician.avatar} alt={pt.attendingPhysician.name} />
                                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                                  {pt.attendingPhysician.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className="text-muted-foreground max-w-[130px] truncate text-xs leading-none"
                                title={pt.attendingPhysician.name}
                              >
                                {pt.attendingPhysician.name}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Actions Menu */}
                        <TableCell className="text-right align-top">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm" className="size-8">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Patient actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Triage Actions</DropdownMenuLabel>
                              <DropdownMenuItem className="cursor-pointer gap-2">
                                <Bed className="size-4" />
                                Assign Room
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer gap-2">
                                <HeartPulse className="size-4" />
                                Re-triage Acuity
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer gap-2">
                                <Zap className="size-4" />
                                Order STAT Labs
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer gap-2">
                                <DoorOpen className="size-4" />
                                Discharge / Transfer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer / Status Summary */}
          <div className="border-border bg-muted/20 text-muted-foreground flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-xs">
            <div className="flex items-center gap-3 font-medium">
              <span>Level 1 Trauma Alert Protocol Active</span>
              <Separator orientation="vertical" className="h-3.5" />
              <span className="tabular-nums">Average Door-to-Triage: 4.2 min</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium">ED Occupancy:</span>
              <span className="text-foreground font-semibold tabular-nums">88% (22/25 Beds)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TriageQueueDashboard
