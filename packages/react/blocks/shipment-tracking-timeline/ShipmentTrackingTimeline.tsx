'use client'

import React, { useState } from 'react'
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
} from 'lucide-react'
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

export interface ShipmentTrackingTimelineProps {
  initialContainerId?: string
  initialFilter?: MilestoneFilter
  className?: string
}

const defaultMilestones: Milestone[] = [
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

export function ShipmentTrackingTimeline({
  initialContainerId = 'MSKU-9482014',
  initialFilter = 'all',
  className,
}: ShipmentTrackingTimelineProps) {
  const [searchQuery, setSearchQuery] = useState(initialContainerId)
  const [activeFilter, setActiveFilter] = useState<MilestoneFilter>(initialFilter)
  const [copiedContainerId, setCopiedContainerId] = useState(false)
  const [copiedBLLink, setCopiedBLLink] = useState(false)

  const filteredMilestones = defaultMilestones.filter((m) => {
    if (activeFilter === 'completed') return m.status === 'completed'
    if (activeFilter === 'upcoming') return m.status === 'upcoming'
    return true
  })

  const copyContainerId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('MSKU-9482014')
      setCopiedContainerId(true)
      setTimeout(() => setCopiedContainerId(false), 2000)
    }
  }

  const copyTrackingLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('https://uipkge.dev/track/MSKU-9482014')
      setCopiedBLLink(true)
      setTimeout(() => setCopiedBLLink(false), 2000)
    }
  }

  return (
    <div data-slot="shipment-tracking-timeline" className={cn('w-full space-y-6', className)}>
      {/* Header Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: ID, Vessel & Route */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-foreground font-mono text-xl font-bold tracking-tight sm:text-2xl">
                    #MSKU-9482014
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-foreground size-7"
                    title="Copy Container ID"
                    onClick={copyContainerId}
                  >
                    {copiedContainerId ? (
                      <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3.5" aria-hidden="true" />
                    )}
                    <span className="sr-only">Copy container number</span>
                  </Button>
                </div>

                <Badge
                  wrap
                  variant="secondary"
                  className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <span className="relative flex size-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  In Transit · On Schedule
                </Badge>

                <Badge wrap variant="outline" className="border-border bg-muted/30 text-muted-foreground gap-1 text-xs">
                  <Ship className="text-primary size-3" aria-hidden="true" />
                  Ocean Freight · FCL 40ft High Cube
                </Badge>
              </div>

              {/* Route and Vessel meta */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                <div className="text-foreground flex items-center gap-1.5 font-medium">
                  <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">CNSHA</span>
                  <span>Shanghai</span>
                  <ArrowRight className="text-muted-foreground size-3.5" aria-hidden="true" />
                  <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">NLRTM</span>
                  <span>Rotterdam</span>
                </div>
                <Separator orientation="vertical" className="hidden h-3.5 sm:block" />
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Ship className="text-muted-foreground size-3.5" aria-hidden="true" />
                  <span>Vessel:</span>
                  <span className="text-foreground font-semibold">Ever Given / V.042W</span>
                  <span className="text-muted-foreground font-mono text-xs">(IMO 9811000)</span>
                </div>
                <Separator orientation="vertical" className="hidden h-3.5 sm:block" />
                <div className="text-muted-foreground flex items-center gap-1">
                  <span>Carrier:</span>
                  <span className="text-foreground font-medium">Maersk Line</span>
                </div>
              </div>
            </div>

            {/* Right: Container search & Quick Actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search
                  className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
                  aria-hidden="true"
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Track Container / B/L..."
                  className="h-9 pl-8 font-mono text-xs focus-visible:ring-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1.5 shadow-xs">
                  <Search className="size-3.5" aria-hidden="true" />
                  Track
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 shadow-xs" onClick={copyTrackingLink}>
                  <Share2 className="size-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{copiedBLLink ? 'Copied' : 'Share'}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* ETA Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Estimated Arrival (ETA)
                </p>
                <p className="text-foreground font-mono text-base font-bold tabular-nums sm:text-lg">Sep 04, 2026</p>
                <p className="text-muted-foreground text-xs tabular-nums">14:00 CEST · Berth 4A confirmed</p>
              </div>
              <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                <CalendarClock className="size-4.5" aria-hidden="true" />
              </div>
            </div>
            <div className="border-border/60 bg-muted/40 mt-3.5 flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs">
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">14 days left</span>
            </div>
          </CardContent>
        </Card>

        {/* Days in Transit Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Days in Transit</p>
                <p className="text-foreground font-mono text-base font-bold tabular-nums sm:text-lg">
                  18 <span className="text-muted-foreground text-sm font-normal">of 28 days</span>
                </p>
                <p className="text-muted-foreground text-xs tabular-nums">64% of voyage completed</p>
              </div>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Timer className="size-4.5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3.5 space-y-1.5">
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: '64%' }} />
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Departed: Aug 10</span>
                <span>ETA: Sep 04</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Coordinates Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Current Vessel Position
                </p>
                <p className="text-foreground font-mono text-base font-bold tabular-nums sm:text-lg">
                  24°18'N, 37°42'E
                </p>
                <p className="text-muted-foreground text-xs">
                  Red Sea · Speed <span className="text-foreground font-mono font-medium">18.4 kn</span>
                </p>
              </div>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Compass className="size-4.5" aria-hidden="true" />
              </div>
            </div>
            <div className="border-border/60 bg-muted/40 mt-3.5 flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs">
              <span className="text-muted-foreground">Heading</span>
              <span className="text-foreground font-mono font-medium">315° NW (Convoy)</span>
            </div>
          </CardContent>
        </Card>

        {/* Next Milestone Port Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Next Milestone Port</p>
                <p className="text-foreground font-mono text-base font-bold sm:text-lg">Suez Canal</p>
                <p className="text-muted-foreground text-xs tabular-nums">Aug 25 · Northbound Convoy</p>
              </div>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Anchor className="size-4.5" aria-hidden="true" />
              </div>
            </div>
            <div className="border-border/60 bg-muted/40 mt-3.5 flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs">
              <span className="text-muted-foreground">Pilotage Slot</span>
              <span className="text-foreground font-mono font-medium">Slot #04 (06:00 EEST)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multimodal Journey Milestones Stepper Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Navigation className="text-primary size-4.5" aria-hidden="true" />
              <CardTitle className="text-base font-semibold">Multimodal Journey Milestones</CardTitle>
              <Badge wrap variant="outline" className="font-mono text-xs">
                7 Milestones
              </Badge>
            </div>
            <CardDescription className="text-xs">
              End-to-end container tracking from factory loading in Ningbo to warehouse in Duisburg.
            </CardDescription>
          </div>

          {/* Filter Buttons */}
          <div className="border-border bg-muted/40 flex items-center gap-1 rounded-lg border p-0.5 text-xs">
            <button
              type="button"
              className={cn(
                'rounded-md px-2.5 py-1 font-medium transition-colors',
                activeFilter === 'all'
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveFilter('all')}
            >
              All (7)
            </button>
            <button
              type="button"
              className={cn(
                'rounded-md px-2.5 py-1 font-medium transition-colors',
                activeFilter === 'completed'
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveFilter('completed')}
            >
              Completed (3)
            </button>
            <button
              type="button"
              className={cn(
                'rounded-md px-2.5 py-1 font-medium transition-colors',
                activeFilter === 'upcoming'
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveFilter('upcoming')}
            >
              Upcoming (3)
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {/* Live AIS Telemetry Beacon Banner */}
          <div className="border-primary/30 bg-primary/5 relative overflow-hidden rounded-xl border p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary relative flex size-10 items-center justify-center rounded-lg">
                  <Radio className="size-5" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 flex size-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-foreground text-sm font-semibold">Active AIS Sea Telemetry</h4>
                    <Badge
                      wrap
                      variant="secondary"
                      className="bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                    >
                      Live Transponder
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Vessel Ever Given navigating Red Sea corridor · Last ping:{' '}
                    <span className="text-foreground font-mono font-medium">12s ago</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <div className="border-border/80 bg-background/80 rounded-md border px-2.5 py-1.5">
                  <span className="text-muted-foreground">Speed: </span>
                  <span className="text-foreground font-semibold tabular-nums">18.4 knots</span>
                </div>
                <div className="border-border/80 bg-background/80 rounded-md border px-2.5 py-1.5">
                  <span className="text-muted-foreground">Heading: </span>
                  <span className="text-foreground font-semibold">315° NW</span>
                </div>
                <div className="border-border/80 bg-background/80 rounded-md border px-2.5 py-1.5">
                  <span className="text-muted-foreground">Coords: </span>
                  <span className="text-foreground font-semibold tabular-nums">24°18'N, 37°42'E</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Timeline Stepper */}
          <div className="relative pl-6 sm:pl-8">
            {/* Vertical Track Line */}
            <div className="bg-border absolute top-3 bottom-3 left-3 w-0.5 -translate-x-1/2 sm:left-4" />

            <div className="space-y-6">
              {filteredMilestones.map((milestone) => (
                <div key={milestone.id} className="group relative flex flex-col gap-2">
                  {/* Step Node Circle */}
                  <div className="absolute -left-6 flex items-center justify-center sm:-left-8">
                    {/* Completed Icon */}
                    {milestone.status === 'completed' ? (
                      <div className="ring-background flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xs ring-4 sm:size-8 dark:bg-emerald-500 dark:text-zinc-950">
                        <Check className="size-3.5 stroke-[2.5] sm:size-4" aria-hidden="true" />
                      </div>
                    ) : milestone.status === 'current' ? (
                      /* Current Active Pulsing Node */
                      <div className="border-primary bg-background text-primary ring-background relative flex size-6 items-center justify-center rounded-full border-2 shadow-xs ring-4 sm:size-8">
                        <span className="relative flex size-2.5 sm:size-3">
                          <span className="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75" />
                          <span className="bg-primary relative inline-flex size-2.5 rounded-full sm:size-3" />
                        </span>
                      </div>
                    ) : (
                      /* Upcoming Node */
                      <div className="border-border bg-muted/60 text-muted-foreground ring-background flex size-6 items-center justify-center rounded-full border ring-4 sm:size-8">
                        <span className="font-mono text-xs font-medium">{milestone.stepNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Milestone Content Card */}
                  <div
                    className={cn(
                      'rounded-xl border p-4 transition-all',
                      milestone.status === 'current'
                        ? 'border-primary/50 bg-primary/5 ring-primary/20 shadow-xs ring-1'
                        : milestone.status === 'completed'
                          ? 'border-border/80 bg-card/60 hover:bg-muted/30'
                          : 'border-border/60 bg-muted/20 opacity-80 hover:opacity-100',
                    )}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-foreground text-sm font-semibold">{milestone.title}</span>

                          {milestone.status === 'completed' && (
                            <Badge
                              wrap
                              variant="secondary"
                              className="bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                            >
                              Completed
                            </Badge>
                          )}
                          {milestone.status === 'current' && (
                            <Badge wrap className="bg-primary text-primary-foreground text-xs font-medium">
                              Active Now
                            </Badge>
                          )}
                          {milestone.status === 'upcoming' && (
                            <Badge wrap variant="outline" className="border-border text-muted-foreground text-xs">
                              Upcoming
                            </Badge>
                          )}

                          <span className="text-muted-foreground font-mono text-xs">({milestone.facility})</span>
                        </div>

                        <p className="text-muted-foreground text-xs">{milestone.description}</p>
                      </div>

                      <div className="shrink-0 text-left sm:text-right">
                        <span className="text-foreground font-mono text-xs font-medium tabular-nums">
                          {milestone.date}
                        </span>
                        <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs sm:justify-end">
                          <MapPin className="size-3" aria-hidden="true" />
                          <span>{milestone.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Telemetry sub-box for current milestone */}
                    {milestone.telemetry && (
                      <div className="border-primary/20 bg-background/90 mt-3 grid grid-cols-2 gap-2 rounded-lg border p-2.5 font-mono text-xs sm:grid-cols-4">
                        <div>
                          <span className="text-muted-foreground">Speed: </span>
                          <span className="text-foreground font-semibold tabular-nums">
                            {milestone.telemetry.speed}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Heading: </span>
                          <span className="text-foreground font-semibold">{milestone.telemetry.heading}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Water Depth: </span>
                          <span className="text-foreground font-semibold tabular-nums">
                            {milestone.telemetry.depth}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">AIS Status: </span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Broadcasting</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2-Column Grid: Specifications & Documentation Manifest */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Container Specifications & Cold Chain Card */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box className="text-primary size-4.5" aria-hidden="true" />
                  <CardTitle className="text-base font-semibold">Container & Cold Chain Specifications</CardTitle>
                </div>
                <Badge wrap variant="outline" className="font-mono text-xs">
                  ISO 6346 Verified
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Physical parameters, high-security seal integrity, and live Reefer temperature control log.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Key Metric Chips */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="border-border bg-muted/30 rounded-lg border p-3">
                  <span className="text-muted-foreground text-xs">Gross Weight</span>
                  <p className="text-foreground mt-0.5 font-mono text-sm font-bold tabular-nums">24,500 kg</p>
                  <span className="text-muted-foreground text-xs">Max: 30,480 kg</span>
                </div>
                <div className="border-border bg-muted/30 rounded-lg border p-3">
                  <span className="text-muted-foreground text-xs">Bolt Seal #</span>
                  <p className="text-foreground mt-0.5 font-mono text-sm font-bold">SL-94021</p>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">ISO 17712 High Sec</span>
                </div>
                <div className="border-border bg-muted/30 rounded-lg border p-3">
                  <span className="text-muted-foreground text-xs">Temperature</span>
                  <p className="text-foreground mt-0.5 font-mono text-sm font-bold tabular-nums">-18.0°C</p>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Actual: -18.2°C</span>
                </div>
                <div className="border-border bg-muted/30 rounded-lg border p-3">
                  <span className="text-muted-foreground text-xs">Humidity & Vent</span>
                  <p className="text-foreground mt-0.5 font-mono text-sm font-bold tabular-nums">85% RH</p>
                  <span className="text-muted-foreground text-xs">Vent: Closed (0 cbm)</span>
                </div>
              </div>

              <Separator />

              {/* Detailed Specifications Table / List */}
              <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Equipment Size:</span>
                    <span className="text-foreground font-medium">40ft High Cube Reefer (40HR)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tare Weight:</span>
                    <span className="text-foreground font-mono font-medium tabular-nums">3,300 kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Net Cargo Weight:</span>
                    <span className="text-foreground font-mono font-medium tabular-nums">21,200 kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cargo Volume:</span>
                    <span className="text-foreground font-mono font-medium tabular-nums">67.3 CBM</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reefer Unit:</span>
                    <span className="text-foreground font-medium">Carrier Transicold PrimeLINE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Power Source:</span>
                    <span className="text-foreground font-medium">Vessel 440V 3-Phase Plug</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Defrost Cycle:</span>
                    <span className="text-foreground font-mono font-medium">Auto-Defrost (Every 12h)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cold-Chain Compliance:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">HACCP / GDP Certified</span>
                  </div>
                </div>
              </div>

              {/* Cold Chain Live Sensor Gauge Banner */}
              <div className="border-border/80 bg-muted/40 flex flex-col gap-3 rounded-lg border p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="text-primary size-4" aria-hidden="true" />
                  <span className="text-foreground font-medium">Continuous Temperature Telemetry:</span>
                  <span className="text-muted-foreground font-mono">24-hour variance ±0.3°C (Nominal)</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  <span>Zero Excursions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commercial Documents & Shipping Manifest Card */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="text-primary size-4.5" aria-hidden="true" />
                  <CardTitle className="text-base font-semibold">Shipping Documentation</CardTitle>
                </div>
                <Badge wrap variant="secondary" className="text-xs">
                  Customs Released
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Bill of Lading, invoice identifiers, and trade compliance references.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2.5 text-xs">
                <div className="border-border/60 bg-muted/30 flex items-center justify-between rounded-lg border p-2.5">
                  <span className="text-muted-foreground">Commercial Invoice #:</span>
                  <span className="text-foreground font-mono font-bold">CI-2026-849</span>
                </div>
                <div className="border-border/60 bg-muted/30 flex items-center justify-between rounded-lg border p-2.5">
                  <span className="text-muted-foreground">Master Bill of Lading (MBL):</span>
                  <span className="text-foreground font-mono font-bold">MAEU-98421094</span>
                </div>
                <div className="border-border/60 bg-muted/30 flex items-center justify-between rounded-lg border p-2.5">
                  <span className="text-muted-foreground">Booking Reference:</span>
                  <span className="text-foreground font-mono font-medium">BKG-7712093</span>
                </div>
                <div className="border-border/60 bg-muted/30 flex items-center justify-between rounded-lg border p-2.5">
                  <span className="text-muted-foreground">Incoterms 2020:</span>
                  <span className="text-foreground font-medium">FOB Shanghai Port</span>
                </div>
              </div>

              <Separator />

              {/* Parties: Shipper and Consignee */}
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-muted-foreground font-medium">Shipper / Exporter</p>
                  <p className="text-foreground font-semibold">Ningbo Apex International Marine Trade Co.</p>
                  <p className="text-muted-foreground">Beilun District, Ningbo, Zhejiang, China</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Consignee / Importer</p>
                  <p className="text-foreground font-semibold">EuroHub Logistics & Cold Storage GmbH</p>
                  <p className="text-muted-foreground">Logport I, 47226 Duisburg, Germany</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 pt-2 sm:flex-row">
                <Button
                  aria-label="Download attachment"
                  variant="outline"
                  size="sm"
                  className="min-w-0 justify-center gap-2 text-xs shadow-xs sm:flex-1"
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  Download Bill of Lading
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground min-w-0 justify-center gap-2 text-xs sm:flex-1"
                >
                  <FileCheck2 className="size-3.5" aria-hidden="true" />
                  Customs Pack (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
