'use client'

import * as React from 'react'
import {
  ArrowRight,
  Building2,
  Calendar,
  Car,
  Check,
  CircleDot,
  Clock,
  ConciergeBell,
  Dumbbell,
  FileText,
  Flame,
  HeartPulse,
  Laptop,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Shirt,
  Sparkles,
  Video,
  Wifi,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface PropertyAmenitiesGridProps {
  title?: string
  subtitle?: string
  badge?: string
  className?: string
}

type CategoryId = 'all' | 'wellness' | 'work' | 'services' | 'parking'

interface AmenityCategory {
  id: CategoryId
  label: string
  count: number
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const categories: AmenityCategory[] = [
  {
    id: 'all',
    label: 'All Amenities',
    count: 24,
    icon: Building2,
    description: 'Explore the full suite of resident services, wellness facilities, and private lounges.',
  },
  {
    id: 'wellness',
    label: 'Wellness & Recreation',
    count: 4,
    icon: HeartPulse,
    description: 'Resort-inspired spaces to rejuvenate body and mind, featuring sky-high fitness and hydrotherapy.',
  },
  {
    id: 'work',
    label: 'Work & Productivity',
    count: 3,
    icon: Laptop,
    description: 'High-speed professional environments for focused execution, remote meetings, and collaboration.',
  },
  {
    id: 'services',
    label: 'Convenience & Services',
    count: 3,
    icon: ConciergeBell,
    description: 'White-glove 24/7 concierge, contactless cold storage lockers, and on-demand valet care.',
  },
  {
    id: 'parking',
    label: 'Parking & Pet Care',
    count: 2,
    icon: Car,
    description: 'Subterranean EV charging and a dedicated pet-care suite.',
  },
]

export function PropertyAmenitiesGrid({
  title = 'World-Class Amenities & Services',
  subtitle = 'Designed for wellness, productivity, and quiet luxury living.',
  badge = 'Building Features & Lifestyle',
  className,
}: PropertyAmenitiesGridProps) {
  const [activeCategory, setActiveCategory] = React.useState<CategoryId>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const isSearching = searchQuery.trim().length > 0

  const matchesQuery = React.useCallback(
    (text: string) => {
      if (!isSearching) return true
      return text.toLowerCase().includes(searchQuery.toLowerCase().trim())
    },
    [isSearching, searchQuery],
  )

  const showWellness =
    (activeCategory === 'all' || activeCategory === 'wellness') &&
    (!isSearching ||
      matchesQuery('Heated Rooftop Infinity Pool') ||
      matchesQuery('Equinox-style Fitness Center & Yoga Studio') ||
      matchesQuery('Nordic Sauna & Cold Plunge Spa') ||
      matchesQuery('Private Tennis & Pickleball Court') ||
      matchesQuery('wellness recreation pool gym sauna'))

  const showWork =
    (activeCategory === 'all' || activeCategory === 'work') &&
    (!isSearching ||
      matchesQuery('Resident Co-Working Lounge with Private Pods') ||
      matchesQuery('Executive Conference Room with AV') ||
      matchesQuery('High-Speed 10 Gbps Fiber WiFi throughout') ||
      matchesQuery('work productivity office wifi conference'))

  const showServices =
    (activeCategory === 'all' || activeCategory === 'services') &&
    (!isSearching ||
      matchesQuery('24/7 Doorman & Concierge Desk') ||
      matchesQuery('Automated Package Lockers & Cold Storage Delivery') ||
      matchesQuery('Dry Cleaning Valet & Laundry Services') ||
      matchesQuery('convenience services concierge doorman package laundry'))

  const showParking =
    (activeCategory === 'all' || activeCategory === 'parking') &&
    (!isSearching ||
      matchesQuery('Secure Underground Parking with EV Chargers') ||
      matchesQuery('Private Rooftop Dog Park & Pet Spa Station') ||
      matchesQuery('parking ev charger pet care dog park'))

  return (
    <section
      data-slot="property-amenities-grid"
      className={cn('bg-background text-foreground w-full py-12 sm:py-16 lg:py-20', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/5 text-primary gap-1.5 px-3 py-1 text-xs font-medium"
              >
                <Sparkles className="size-3.5" />
                {badge}
              </Badge>
              <Badge variant="secondary" className="gap-1 px-2.5 py-1 text-xs font-medium">
                <Building2 className="size-3" />
                24 Total Amenities
              </Badge>
            </div>
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            <p className="text-muted-foreground text-base sm:text-lg">{subtitle}</p>
          </div>

          {/* Quick Summary Stats Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="bg-card border-border rounded-xl border p-3 shadow-xs">
              <p className="text-foreground font-mono text-xl font-bold">24</p>
              <p className="text-muted-foreground text-xs font-medium">Curated Amenities</p>
            </div>
            <div className="bg-card border-border rounded-xl border p-3 shadow-xs">
              <p className="text-foreground font-mono text-xl font-bold">4</p>
              <p className="text-muted-foreground text-xs font-medium">Lifestyle Zones</p>
            </div>
            <div className="bg-card border-border rounded-xl border p-3 shadow-xs">
              <p className="text-foreground font-mono text-xl font-bold">24/7</p>
              <p className="text-muted-foreground text-xs font-medium">Concierge Access</p>
            </div>
            <div className="bg-card border-border rounded-xl border p-3 shadow-xs">
              <p className="text-foreground font-mono text-xl font-bold">100%</p>
              <p className="text-muted-foreground text-xs font-medium">Pet Friendly</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Interactive Controls: Category Filter Tabs & Quick Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={isActive ? 'default' : 'outline'}
                  className="h-8 gap-1.5 rounded-full px-3.5 text-xs font-medium transition-all"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon className="size-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      'py-0.2 ml-1 rounded-full px-1.5 font-mono text-xs',
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {cat.count}
                  </span>
                </Button>
              )
            })}
          </div>

          {/* Keyword Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search amenities..."
              className="bg-card border-border placeholder:text-muted-foreground focus-visible:ring-primary h-9 w-full min-w-0 rounded-lg border pr-8 pl-9 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Search Results Indicator */}
        {isSearching && (
          <div className="bg-muted/40 border-border mt-4 flex items-center justify-between rounded-lg border px-4 py-2 text-xs">
            <span className="text-muted-foreground">
              Showing matching results for <strong className="text-foreground">&quot;{searchQuery}&quot;</strong>
            </span>
            <button
              type="button"
              className="text-primary font-medium hover:underline"
              onClick={() => setSearchQuery('')}
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Categories Container */}
        <div className="mt-10 space-y-14">
          {/* ================================================================= */}
          {/* CATEGORY 1: WELLNESS & RECREATION */}
          {/* ================================================================= */}
          {showWellness && (
            <div className="space-y-6">
              {/* Category Header */}
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <HeartPulse className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-xl font-bold tracking-tight">Wellness & Recreation</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Resort-inspired spaces to rejuvenate body and mind with skyline views and recovery hydrotherapy.
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-border text-muted-foreground text-xs font-medium">
                  4 Featured Amenities
                </Badge>
              </div>

              {/* Wellness Cards Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Card 1: Heated Rooftop Infinity Pool (Featured Card with Photo Thumbnail) */}
                {matchesQuery('Heated Rooftop Infinity Pool pool skyline swim cabana') && (
                  <Card className="group border-border bg-card relative flex flex-col justify-between overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md md:col-span-2 lg:col-span-2">
                    <div className="relative h-64 w-full overflow-hidden sm:h-72">
                      <img
                        src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&auto=format&fit=crop&q=80"
                        alt="Heated Rooftop Infinity Pool"
                        className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <Badge className="bg-primary text-primary-foreground border-transparent text-xs font-medium shadow-xs">
                          Featured Highlight
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-background/80 text-foreground border-white/20 text-xs font-medium backdrop-blur-md"
                        >
                          Year-Round Heated (84°F)
                        </Badge>
                      </div>
                      <div className="absolute right-4 bottom-4 left-4 text-white">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                          <MapPin className="size-3.5 text-zinc-300" />
                          <span>Level 42 Sky Deck</span>
                          <span className="mx-1.5">·</span>
                          <Clock className="size-3.5 text-zinc-300" />
                          <span>6:00 AM – 10:00 PM Daily</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="flex flex-1 flex-col justify-between p-6">
                      <div className="space-y-2">
                        <CardTitle className="text-foreground text-xl font-bold">
                          Heated Rooftop Infinity Pool
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                          50-meter temperature-controlled infinity pool on the 42nd floor featuring private cabanas,
                          teak daybeds, outdoor sun deck, and poolside refreshment bar with 360-degree panoramic skyline
                          views.
                        </CardDescription>
                      </div>

                      <div className="border-border mt-6 flex flex-wrap items-center gap-2 border-t pt-4">
                        <Badge variant="outline" className="bg-muted/30 text-xs font-normal">
                          <Check className="mr-1 size-3 text-emerald-500" />
                          Panoramic Views
                        </Badge>
                        <Badge variant="outline" className="bg-muted/30 text-xs font-normal">
                          <Check className="mr-1 size-3 text-emerald-500" />
                          Private Cabanas
                        </Badge>
                        <Badge variant="outline" className="bg-muted/30 text-xs font-normal">
                          <Check className="mr-1 size-3 text-emerald-500" />
                          Towel Valet
                        </Badge>
                        <Badge variant="outline" className="bg-muted/30 text-xs font-normal">
                          <Check className="mr-1 size-3 text-emerald-500" />
                          Poolside Bar
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card 2: Equinox-style Fitness Center & Yoga Studio */}
                {matchesQuery('Equinox-style Fitness Center & Yoga Studio gym pilates workout') && (
                  <Card className="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md">
                    <CardHeader className="space-y-3 p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <Dumbbell className="size-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          24/7 Access
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="text-primary size-3" />
                          Levels 3 & 4
                        </div>
                        <CardTitle className="text-foreground text-lg font-bold">
                          Equinox-style Fitness Center & Yoga Studio
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-2">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                        Multi-level 4,500 sq ft strength and conditioning training facility outfitted with Woodway
                        treadmills, Peloton bikes, Olympic lifting racks, and a dedicated sunlit yoga and reformer
                        Pilates studio.
                      </CardDescription>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Woodway & Peloton
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Reformer Pilates
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Personal Trainers
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card 3: Nordic Sauna & Cold Plunge Spa */}
                {matchesQuery('Nordic Sauna & Cold Plunge Spa steam therapy recovery') && (
                  <Card className="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md">
                    <CardHeader className="space-y-3 p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <Flame className="size-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          Hydrotherapy
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="text-primary size-3" />
                          Level 3 Spa Suite
                        </div>
                        <CardTitle className="text-foreground text-lg font-bold">
                          Nordic Sauna & Cold Plunge Spa
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-2">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                        Therapeutic cedarwood dry sauna, aromatic eucalyptus steam room, and dual 48°F contrast therapy
                        cold plunge pools engineered for post-workout muscle recovery and immune resilience.
                      </CardDescription>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          48°F Cold Plunge
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Cedar Dry Sauna
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Eucalyptus Steam
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card 4: Private Tennis & Pickleball Court */}
                {matchesQuery('Private Tennis & Pickleball Court sports rooftop court') && (
                  <Card className="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md md:col-span-2 lg:col-span-2">
                    <CardHeader className="space-y-3 p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <CircleDot className="size-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          Rooftop Court
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="text-primary size-3" />
                          Level 43 Sports Deck
                        </div>
                        <CardTitle className="text-foreground text-lg font-bold">
                          Private Tennis & Pickleball Court
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-2">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                        Championship-grade rooftop regulation court with multi-sport cushioned acrylic surface,
                        tournament-spec LED night illumination, automated Spinshot ball machines, and resident league
                        reservations.
                      </CardDescription>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Tournament LEDs
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Ball Machine Loan
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          App Reservation
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Skyline Backdrop
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* CATEGORY 2: WORK & PRODUCTIVITY */}
          {/* ================================================================= */}
          {showWork && (
            <div className="space-y-6">
              {/* Category Header */}
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Laptop className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-xl font-bold tracking-tight">Work & Productivity</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Executive business facilities, private acoustic pods, and ultra-high-speed fiber network.
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-border text-muted-foreground text-xs font-medium">
                  3 Featured Amenities
                </Badge>
              </div>

              {/* Work Cards Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card 1: Resident Co-Working Lounge with Private Pods */}
                {matchesQuery('Resident Co-Working Lounge with Private Pods workspace zoom office') && (
                  <Card className="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md">
                    <CardHeader className="space-y-3 p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <Laptop className="size-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          Quiet Focus
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="text-primary size-3" />
                          Level 2 Mezzanine
                        </div>
                        <CardTitle className="text-foreground text-lg font-bold">
                          Resident Co-Working Lounge with Private Pods
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-2">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                        Spacious communal workspace with Herman Miller ergonomic seating, acoustic focus booths, private
                        soundproof Zoom phone pods, and complimentary artisan espresso and nitro cold brew bar.
                      </CardDescription>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Soundproof Pods
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Herman Miller Chairs
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Espresso Bar
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card 2: Executive Conference Room with AV */}
                {matchesQuery('Executive Conference Room with AV boardroom meeting video presentation') && (
                  <Card className="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md">
                    <CardHeader className="space-y-3 p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <Video className="size-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          App Booking
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="text-primary size-3" />
                          Level 2 North Wing
                        </div>
                        <CardTitle className="text-foreground text-lg font-bold">
                          Executive Conference Room with AV
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-2">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                        16-person board room equipped with 85-inch 4K HDR video conferencing displays, spatial
                        beamforming microphone arrays, digital whiteboard, and integrated presentation hub.
                      </CardDescription>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          16-Seat Capacity
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          4K Video Suite
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Digital Whiteboard
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card 3: High-Speed 10 Gbps Fiber WiFi throughout */}
                {matchesQuery('High-Speed 10 Gbps Fiber WiFi throughout wifi internet mesh') && (
                  <Card className="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md sm:col-span-2 lg:col-span-1">
                    <CardHeader className="space-y-3 p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <Wifi className="size-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          Ultra-Fast
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="text-primary size-3" />
                          Building-wide Coverage
                        </div>
                        <CardTitle className="text-foreground text-lg font-bold">
                          High-Speed 10 Gbps Fiber WiFi throughout
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-2">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                        Enterprise-grade symmetrical 10 Gbps redundant fiber backbone with Wi-Fi 7 access points
                        delivering uninterrupted zero-drop roaming across all indoor lounges and outdoor terraces.
                      </CardDescription>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Wi-Fi 7 Mesh
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          10 Gbps Symmetrical
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Zero Roam Handoff
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* CATEGORY 3: CONVENIENCE & SERVICES */}
          {/* ================================================================= */}
          {showServices && (
            <div className="space-y-6">
              {/* Category Header */}
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <ConciergeBell className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-xl font-bold tracking-tight">Convenience & Services</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      White-glove hospitality, smart package handling, and premium garment care at your fingertips.
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-border text-muted-foreground text-xs font-medium">
                  3 Featured Amenities
                </Badge>
              </div>

              {/* Convenience Cards Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card 1: 24/7 Doorman & Concierge Desk */}
                {matchesQuery('24/7 Doorman & Concierge Desk doorman front desk hospitality security') && (
                  <Card className="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md">
                    <CardHeader className="space-y-3 p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <ConciergeBell className="size-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          24/7 Attended
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="text-primary size-3" />
                          Main Lobby Entrance
                        </div>
                        <CardTitle className="text-foreground text-lg font-bold">
                          24/7 Doorman & Concierge Desk
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-2">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                        Round-the-clock uniform concierge team providing white-glove resident hospitality, verified
                        visitor check-in, key holding, luggage assistance, taxi dispatch, and dining reservations.
                      </CardDescription>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          White-Glove Staff
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Key Holding
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Guest Escort
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card 2: Automated Package Lockers & Cold Storage Delivery */}
                {matchesQuery('Automated Package Lockers & Cold Storage Delivery parcel grocery refrigerated') && (
                  <Card className="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md">
                    <CardHeader className="space-y-3 p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <Package className="size-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          Smart Storage
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="text-primary size-3" />
                          Lobby Concourse
                        </div>
                        <CardTitle className="text-foreground text-lg font-bold">
                          Automated Package Lockers & Cold Storage Delivery
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-2">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                        Contactless Luxer One smart package room with digital PIN and barcode pickup alerts, secure
                        oversized parcel rooms, and commercial-grade refrigerated storage for fresh grocery deliveries.
                      </CardDescription>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Cold Grocery Lockers
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          24/7 App QR Pickup
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Oversized Item Vault
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card 3: Dry Cleaning Valet & Laundry Services */}
                {matchesQuery('Dry Cleaning Valet & Laundry Services garment tailoring wash') && (
                  <Card className="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md sm:col-span-2 lg:col-span-1">
                    <CardHeader className="space-y-3 p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <Shirt className="size-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          Valet Care
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="text-primary size-3" />
                          Service Concourse B1
                        </div>
                        <CardTitle className="text-foreground text-lg font-bold">
                          Dry Cleaning Valet & Laundry Services
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-2">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                        On-demand eco-friendly dry cleaning drop-off lockers with 24-hour turnaround, garment pressing,
                        shoe shining, tailored alterations, and in-locker contactless delivery return.
                      </CardDescription>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          24h Turnaround
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Eco-Friendly Cleaning
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Tailored Alterations
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* CATEGORY 4: PARKING & PET CARE */}
          {/* ================================================================= */}
          {showParking && (
            <div className="space-y-6">
              {/* Category Header */}
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Car className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-xl font-bold tracking-tight">Parking & Pet Care</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Subterranean EV charging bays and private rooftop pet facilities for four-legged residents.
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-border text-muted-foreground text-xs font-medium">
                  2 Featured Amenities
                </Badge>
              </div>

              {/* Parking & Pet Care Cards Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Card 1: Secure Underground Parking with EV Chargers */}
                {matchesQuery('Secure Underground Parking with EV Chargers electric vehicle garage stall') && (
                  <Card className="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md">
                    <CardHeader className="space-y-3 p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <Car className="size-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          EV Ready
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="text-primary size-3" />
                          Levels P1 – P3 Subterranean
                        </div>
                        <CardTitle className="text-foreground text-lg font-bold">
                          Secure Underground Parking with EV Chargers
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-2">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                        Gated subterranean multi-level garage featuring automated license plate recognition entry gates,
                        assigned private stalls, 48 universal Level 2 EV charging stations, and dedicated bike storage.
                      </CardDescription>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          48 EV Charging Ports
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          LPR Auto-Gate
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Covered Bike Vault
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card 2: Private Rooftop Dog Park & Pet Spa Station */}
                {matchesQuery('Private Rooftop Dog Park & Pet Spa Station canine grooming wash animal') && (
                  <Card className="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md">
                    <CardHeader className="space-y-3 p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <Sparkles className="size-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">
                          Pet Friendly
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="text-primary size-3" />
                          Level 44 Sky Deck
                        </div>
                        <CardTitle className="text-foreground text-lg font-bold">
                          Private Rooftop Dog Park & Pet Spa Station
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-2">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                        Enclosed rooftop canine park with anti-microbial synthetic turf and agility obstacles, paired
                        with an indoor heated pet wash spa featuring stainless steel wash tubs and pro blow dry station.
                      </CardDescription>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Anti-Microbial Turf
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Heated Wash Tubs
                        </Badge>
                        <Badge variant="outline" className="bg-muted/20 text-xs">
                          Pro Blow Dryers
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Callout Card: Resident Keycard App & Tour Booking */}
        <Card className="bg-muted/30 border-border mt-16 overflow-hidden border shadow-xs">
          <CardContent className="flex flex-col items-start justify-between gap-6 p-6 sm:p-8 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl">
                <ShieldCheck className="size-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-foreground text-base font-semibold sm:text-lg">
                  Keyless Resident Access & Mobile App Integration
                </h4>
                <p className="text-muted-foreground max-w-2xl text-xs sm:text-sm">
                  All 24 building amenities are digitally accessible via NFC mobile key, offering instant cabana and
                  conference room reservations, real-time fitness occupancy, and automated guest passes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <FileText className="size-3.5" />
                Amenity Guide PDF
              </Button>
              <Button size="sm" className="gap-1.5 text-xs">
                <Calendar className="size-3.5" />
                Schedule a Tour
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
