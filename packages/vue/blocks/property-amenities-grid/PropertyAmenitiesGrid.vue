<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Props {
  title?: string
  subtitle?: string
  badge?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  title: 'World-Class Amenities & Services',
  subtitle: 'Designed for wellness, productivity, and quiet luxury living.',
  badge: 'Building Features & Lifestyle',
})

type CategoryId = 'all' | 'wellness' | 'work' | 'services' | 'parking'

interface AmenityCategory {
  id: CategoryId
  label: string
  count: number
  icon: any
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

const activeCategory = ref<CategoryId>('all')
const searchQuery = ref('')

const isSearching = computed(() => searchQuery.value.trim().length > 0)

function matchesQuery(text: string): boolean {
  if (!isSearching.value) return true
  return text.toLowerCase().includes(searchQuery.value.toLowerCase().trim())
}

const showWellness = computed(() => {
  if (activeCategory.value !== 'all' && activeCategory.value !== 'wellness') return false
  if (!isSearching.value) return true
  return (
    matchesQuery('Heated Rooftop Infinity Pool') ||
    matchesQuery('Equinox-style Fitness Center & Yoga Studio') ||
    matchesQuery('Nordic Sauna & Cold Plunge Spa') ||
    matchesQuery('Private Tennis & Pickleball Court') ||
    matchesQuery('wellness recreation pool gym sauna')
  )
})

const showWork = computed(() => {
  if (activeCategory.value !== 'all' && activeCategory.value !== 'work') return false
  if (!isSearching.value) return true
  return (
    matchesQuery('Resident Co-Working Lounge with Private Pods') ||
    matchesQuery('Executive Conference Room with AV') ||
    matchesQuery('High-Speed 10 Gbps Fiber WiFi throughout') ||
    matchesQuery('work productivity office wifi conference')
  )
})

const showServices = computed(() => {
  if (activeCategory.value !== 'all' && activeCategory.value !== 'services') return false
  if (!isSearching.value) return true
  return (
    matchesQuery('24/7 Doorman & Concierge Desk') ||
    matchesQuery('Automated Package Lockers & Cold Storage Delivery') ||
    matchesQuery('Dry Cleaning Valet & Laundry Services') ||
    matchesQuery('convenience services concierge doorman package laundry')
  )
})

const showParking = computed(() => {
  if (activeCategory.value !== 'all' && activeCategory.value !== 'parking') return false
  if (!isSearching.value) return true
  return (
    matchesQuery('Secure Underground Parking with EV Chargers') ||
    matchesQuery('Private Rooftop Dog Park & Pet Spa Station') ||
    matchesQuery('parking ev charger pet care dog park')
  )
})
</script>

<template>
  <section
    data-slot="property-amenities-grid"
    :class="cn('bg-background text-foreground w-full py-12 sm:py-16 lg:py-20', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Top Section Header -->
      <div class="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div class="max-w-2xl space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              class="border-primary/30 bg-primary/5 text-primary gap-1.5 px-3 py-1 text-xs font-medium"
            >
              <Sparkles class="size-3.5" />
              {{ props.badge }}
            </Badge>
            <Badge variant="secondary" class="gap-1 px-2.5 py-1 text-xs font-medium">
              <Building2 class="size-3" />
              24 Total Amenities
            </Badge>
          </div>
          <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            {{ props.title }}
          </h2>
          <p class="text-muted-foreground text-base sm:text-lg">
            {{ props.subtitle }}
          </p>
        </div>

        <!-- Quick Summary Stats Bar -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div class="bg-card border-border rounded-xl border p-3 shadow-xs">
            <p class="text-foreground font-mono text-xl font-bold">24</p>
            <p class="text-muted-foreground text-xs font-medium">Curated Amenities</p>
          </div>
          <div class="bg-card border-border rounded-xl border p-3 shadow-xs">
            <p class="text-foreground font-mono text-xl font-bold">4</p>
            <p class="text-muted-foreground text-xs font-medium">Lifestyle Zones</p>
          </div>
          <div class="bg-card border-border rounded-xl border p-3 shadow-xs">
            <p class="text-foreground font-mono text-xl font-bold">24/7</p>
            <p class="text-muted-foreground text-xs font-medium">Concierge Access</p>
          </div>
          <div class="bg-card border-border rounded-xl border p-3 shadow-xs">
            <p class="text-foreground font-mono text-xl font-bold">100%</p>
            <p class="text-muted-foreground text-xs font-medium">Pet Friendly</p>
          </div>
        </div>
      </div>

      <Separator class="my-8" />

      <!-- Interactive Controls: Category Filter Tabs & Quick Search -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <!-- Category Filter Pills -->
        <div class="flex flex-wrap items-center gap-2">
          <Button
            v-for="cat in categories"
            :key="cat.id"
            size="sm"
            :variant="activeCategory === cat.id ? 'default' : 'outline'"
            class="h-8 gap-1.5 rounded-full px-3.5 text-xs font-medium transition-all"
            @click="activeCategory = cat.id"
          >
            <component :is="cat.icon" class="size-3.5" />
            <span>{{ cat.label }}</span>
            <span
              :class="
                cn(
                  'py-0.2 ml-1 rounded-full px-1.5 font-mono text-xs',
                  activeCategory === cat.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )
              "
            >
              {{ cat.count }}
            </span>
          </Button>
        </div>

        <!-- Keyword Search Input -->
        <div class="relative w-full sm:w-72">
          <Search class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search amenities..."
            class="bg-card border-border placeholder:text-muted-foreground focus-visible:ring-primary h-9 w-full min-w-0 rounded-lg border pr-8 pl-9 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
            aria-label="Clear search"
            @click="searchQuery = ''"
          >
            <X class="size-3.5" />
          </button>
        </div>
      </div>

      <!-- Search Results Indicator -->
      <div
        v-if="isSearching"
        class="bg-muted/40 border-border mt-4 flex items-center justify-between rounded-lg border px-4 py-2 text-xs"
      >
        <span class="text-muted-foreground">
          Showing matching results for <strong class="text-foreground">"{{ searchQuery }}"</strong>
        </span>
        <button
          aria-label="Clear search"
          type="button"
          class="text-primary font-medium hover:underline"
          @click="searchQuery = ''"
        >
          Reset Filter
        </button>
      </div>

      <!-- Categories Container -->
      <div class="mt-10 space-y-14">
        <!-- ================================================================= -->
        <!-- CATEGORY 1: WELLNESS & RECREATION -->
        <!-- ================================================================= -->
        <div v-if="showWellness" class="space-y-6">
          <!-- Category Header -->
          <div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <div class="flex items-center gap-3">
              <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                <HeartPulse class="size-5" />
              </div>
              <div>
                <h3 class="text-foreground text-xl font-bold tracking-tight">Wellness & Recreation</h3>
                <p class="text-muted-foreground text-xs sm:text-sm">
                  Resort-inspired spaces to rejuvenate body and mind with skyline views and recovery hydrotherapy.
                </p>
              </div>
            </div>
            <Badge variant="outline" class="border-border text-muted-foreground text-xs font-medium">
              4 Featured Amenities
            </Badge>
          </div>

          <!-- Wellness Cards Grid -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <!-- Card 1: Heated Rooftop Infinity Pool (Featured Card with Photo Thumbnail) -->
            <Card
              v-if="matchesQuery('Heated Rooftop Infinity Pool pool skyline swim cabana')"
              class="group border-border bg-card relative flex flex-col justify-between overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md md:col-span-2 lg:col-span-2"
            >
              <div class="relative h-64 w-full overflow-hidden sm:h-72">
                <img
                  src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&auto=format&fit=crop&q=80"
                  alt="Heated Rooftop Infinity Pool"
                  class="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                  <Badge class="bg-primary text-primary-foreground border-transparent text-xs font-medium shadow-xs">
                    Featured Highlight
                  </Badge>
                  <Badge
                    variant="secondary"
                    class="bg-background/80 text-foreground border-white/20 text-xs font-medium backdrop-blur-md"
                  >
                    Year-Round Heated (84°F)
                  </Badge>
                </div>
                <div class="absolute right-4 bottom-4 left-4 text-white">
                  <div class="flex items-center gap-1.5 text-xs text-zinc-300">
                    <MapPin class="size-3.5 text-zinc-300" />
                    <span>Level 42 Sky Deck</span>
                    <span class="mx-1.5">·</span>
                    <Clock class="size-3.5 text-zinc-300" />
                    <span>6:00 AM – 10:00 PM Daily</span>
                  </div>
                </div>
              </div>

              <CardContent class="flex flex-1 flex-col justify-between p-6">
                <div class="space-y-2">
                  <CardTitle class="text-foreground text-xl font-bold">Heated Rooftop Infinity Pool</CardTitle>
                  <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                    50-meter temperature-controlled infinity pool on the 42nd floor featuring private cabanas, teak
                    daybeds, outdoor sun deck, and poolside refreshment bar with 360-degree panoramic skyline views.
                  </CardDescription>
                </div>

                <div class="border-border mt-6 flex flex-wrap items-center gap-2 border-t pt-4">
                  <Badge variant="outline" class="bg-muted/30 text-xs font-normal">
                    <Check class="mr-1 size-3 text-emerald-500" />
                    Panoramic Views
                  </Badge>
                  <Badge variant="outline" class="bg-muted/30 text-xs font-normal">
                    <Check class="mr-1 size-3 text-emerald-500" />
                    Private Cabanas
                  </Badge>
                  <Badge variant="outline" class="bg-muted/30 text-xs font-normal">
                    <Check class="mr-1 size-3 text-emerald-500" />
                    Towel Valet
                  </Badge>
                  <Badge variant="outline" class="bg-muted/30 text-xs font-normal">
                    <Check class="mr-1 size-3 text-emerald-500" />
                    Poolside Bar
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <!-- Card 2: Equinox-style Fitness Center & Yoga Studio -->
            <Card
              v-if="matchesQuery('Equinox-style Fitness Center & Yoga Studio gym pilates workout')"
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <CardHeader class="space-y-3 p-6 pb-2">
                <div class="flex items-center justify-between">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Dumbbell class="size-5" />
                  </div>
                  <Badge variant="secondary" class="text-xs font-medium">24/7 Access</Badge>
                </div>
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin class="text-primary size-3" />
                    Levels 3 & 4
                  </div>
                  <CardTitle class="text-foreground text-lg font-bold">
                    Equinox-style Fitness Center & Yoga Studio
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent class="space-y-4 p-6 pt-2">
                <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                  Multi-level 4,500 sq ft strength and conditioning training facility outfitted with Woodway treadmills,
                  Peloton bikes, Olympic lifting racks, and a dedicated sunlit yoga and reformer Pilates studio.
                </CardDescription>

                <div class="flex flex-wrap gap-1.5 pt-2">
                  <Badge variant="outline" class="bg-muted/20 text-xs">Woodway & Peloton</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Reformer Pilates</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Personal Trainers</Badge>
                </div>
              </CardContent>
            </Card>

            <!-- Card 3: Nordic Sauna & Cold Plunge Spa -->
            <Card
              v-if="matchesQuery('Nordic Sauna & Cold Plunge Spa steam therapy recovery')"
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <CardHeader class="space-y-3 p-6 pb-2">
                <div class="flex items-center justify-between">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Flame class="size-5" />
                  </div>
                  <Badge variant="secondary" class="text-xs font-medium">Hydrotherapy</Badge>
                </div>
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin class="text-primary size-3" />
                    Level 3 Spa Suite
                  </div>
                  <CardTitle class="text-foreground text-lg font-bold">Nordic Sauna & Cold Plunge Spa</CardTitle>
                </div>
              </CardHeader>

              <CardContent class="space-y-4 p-6 pt-2">
                <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                  Therapeutic cedarwood dry sauna, aromatic eucalyptus steam room, and dual 48°F contrast therapy cold
                  plunge pools engineered for post-workout muscle recovery and immune resilience.
                </CardDescription>

                <div class="flex flex-wrap gap-1.5 pt-2">
                  <Badge variant="outline" class="bg-muted/20 text-xs">48°F Cold Plunge</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Cedar Dry Sauna</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Eucalyptus Steam</Badge>
                </div>
              </CardContent>
            </Card>

            <!-- Card 4: Private Tennis & Pickleball Court -->
            <Card
              v-if="matchesQuery('Private Tennis & Pickleball Court sports rooftop court')"
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md md:col-span-2 lg:col-span-2"
            >
              <CardHeader class="space-y-3 p-6 pb-2">
                <div class="flex items-center justify-between">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <CircleDot class="size-5" />
                  </div>
                  <Badge variant="secondary" class="text-xs font-medium">Rooftop Court</Badge>
                </div>
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin class="text-primary size-3" />
                    Level 43 Sports Deck
                  </div>
                  <CardTitle class="text-foreground text-lg font-bold">Private Tennis & Pickleball Court</CardTitle>
                </div>
              </CardHeader>

              <CardContent class="space-y-4 p-6 pt-2">
                <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                  Championship-grade rooftop regulation court with multi-sport cushioned acrylic surface,
                  tournament-spec LED night illumination, automated Spinshot ball machines, and resident league
                  reservations.
                </CardDescription>

                <div class="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" class="bg-muted/20 text-xs">Tournament LEDs</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Ball Machine Loan</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">App Reservation</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Skyline Backdrop</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- ================================================================= -->
        <!-- CATEGORY 2: WORK & PRODUCTIVITY -->
        <!-- ================================================================= -->
        <div v-if="showWork" class="space-y-6">
          <!-- Category Header -->
          <div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <div class="flex items-center gap-3">
              <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                <Laptop class="size-5" />
              </div>
              <div>
                <h3 class="text-foreground text-xl font-bold tracking-tight">Work & Productivity</h3>
                <p class="text-muted-foreground text-xs sm:text-sm">
                  Executive business facilities, private acoustic pods, and ultra-high-speed fiber network.
                </p>
              </div>
            </div>
            <Badge variant="outline" class="border-border text-muted-foreground text-xs font-medium">
              3 Featured Amenities
            </Badge>
          </div>

          <!-- Work Cards Grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Card 1: Resident Co-Working Lounge with Private Pods -->
            <Card
              v-if="matchesQuery('Resident Co-Working Lounge with Private Pods workspace zoom office')"
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <CardHeader class="space-y-3 p-6 pb-2">
                <div class="flex items-center justify-between">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Laptop class="size-5" />
                  </div>
                  <Badge variant="secondary" class="text-xs font-medium">Quiet Focus</Badge>
                </div>
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin class="text-primary size-3" />
                    Level 2 Mezzanine
                  </div>
                  <CardTitle class="text-foreground text-lg font-bold">
                    Resident Co-Working Lounge with Private Pods
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent class="space-y-4 p-6 pt-2">
                <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                  Spacious communal workspace with Herman Miller ergonomic seating, acoustic focus booths, private
                  soundproof Zoom phone pods, and complimentary artisan espresso and nitro cold brew bar.
                </CardDescription>

                <div class="flex flex-wrap gap-1.5 pt-2">
                  <Badge variant="outline" class="bg-muted/20 text-xs">Soundproof Pods</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Herman Miller Chairs</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Espresso Bar</Badge>
                </div>
              </CardContent>
            </Card>

            <!-- Card 2: Executive Conference Room with AV -->
            <Card
              v-if="matchesQuery('Executive Conference Room with AV boardroom meeting video presentation')"
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <CardHeader class="space-y-3 p-6 pb-2">
                <div class="flex items-center justify-between">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Video class="size-5" />
                  </div>
                  <Badge variant="secondary" class="text-xs font-medium">App Booking</Badge>
                </div>
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin class="text-primary size-3" />
                    Level 2 North Wing
                  </div>
                  <CardTitle class="text-foreground text-lg font-bold"> Executive Conference Room with AV </CardTitle>
                </div>
              </CardHeader>

              <CardContent class="space-y-4 p-6 pt-2">
                <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                  16-person board room equipped with 85-inch 4K HDR video conferencing displays, spatial beamforming
                  microphone arrays, digital whiteboard, and integrated presentation hub.
                </CardDescription>

                <div class="flex flex-wrap gap-1.5 pt-2">
                  <Badge variant="outline" class="bg-muted/20 text-xs">16-Seat Capacity</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">4K Video Suite</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Digital Whiteboard</Badge>
                </div>
              </CardContent>
            </Card>

            <!-- Card 3: High-Speed 10 Gbps Fiber WiFi throughout -->
            <Card
              v-if="matchesQuery('High-Speed 10 Gbps Fiber WiFi throughout wifi internet mesh')"
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md sm:col-span-2 lg:col-span-1"
            >
              <CardHeader class="space-y-3 p-6 pb-2">
                <div class="flex items-center justify-between">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Wifi class="size-5" />
                  </div>
                  <Badge variant="secondary" class="text-xs font-medium">Ultra-Fast</Badge>
                </div>
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin class="text-primary size-3" />
                    Building-wide Coverage
                  </div>
                  <CardTitle class="text-foreground text-lg font-bold">
                    High-Speed 10 Gbps Fiber WiFi throughout
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent class="space-y-4 p-6 pt-2">
                <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                  Enterprise-grade symmetrical 10 Gbps redundant fiber backbone with Wi-Fi 7 access points delivering
                  uninterrupted zero-drop roaming across all indoor lounges and outdoor terraces.
                </CardDescription>

                <div class="flex flex-wrap gap-1.5 pt-2">
                  <Badge variant="outline" class="bg-muted/20 text-xs">Wi-Fi 7 Mesh</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">10 Gbps Symmetrical</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Zero Roam Handoff</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- ================================================================= -->
        <!-- CATEGORY 3: CONVENIENCE & SERVICES -->
        <!-- ================================================================= -->
        <div v-if="showServices" class="space-y-6">
          <!-- Category Header -->
          <div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <div class="flex items-center gap-3">
              <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                <ConciergeBell class="size-5" />
              </div>
              <div>
                <h3 class="text-foreground text-xl font-bold tracking-tight">Convenience & Services</h3>
                <p class="text-muted-foreground text-xs sm:text-sm">
                  White-glove hospitality, smart package handling, and premium garment care at your fingertips.
                </p>
              </div>
            </div>
            <Badge variant="outline" class="border-border text-muted-foreground text-xs font-medium">
              3 Featured Amenities
            </Badge>
          </div>

          <!-- Convenience Cards Grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Card 1: 24/7 Doorman & Concierge Desk -->
            <Card
              v-if="matchesQuery('24/7 Doorman & Concierge Desk doorman front desk hospitality security')"
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <CardHeader class="space-y-3 p-6 pb-2">
                <div class="flex items-center justify-between">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <ConciergeBell class="size-5" />
                  </div>
                  <Badge variant="secondary" class="text-xs font-medium">24/7 Attended</Badge>
                </div>
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin class="text-primary size-3" />
                    Main Lobby Entrance
                  </div>
                  <CardTitle class="text-foreground text-lg font-bold"> 24/7 Doorman & Concierge Desk </CardTitle>
                </div>
              </CardHeader>

              <CardContent class="space-y-4 p-6 pt-2">
                <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                  Round-the-clock uniform concierge team providing white-glove resident hospitality, verified visitor
                  check-in, key holding, luggage assistance, taxi dispatch, and dining reservations.
                </CardDescription>

                <div class="flex flex-wrap gap-1.5 pt-2">
                  <Badge variant="outline" class="bg-muted/20 text-xs">White-Glove Staff</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Key Holding</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Guest Escort</Badge>
                </div>
              </CardContent>
            </Card>

            <!-- Card 2: Automated Package Lockers & Cold Storage Delivery -->
            <Card
              v-if="matchesQuery('Automated Package Lockers & Cold Storage Delivery parcel grocery refrigerated')"
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <CardHeader class="space-y-3 p-6 pb-2">
                <div class="flex items-center justify-between">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Package class="size-5" />
                  </div>
                  <Badge variant="secondary" class="text-xs font-medium">Smart Storage</Badge>
                </div>
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin class="text-primary size-3" />
                    Lobby Concourse
                  </div>
                  <CardTitle class="text-foreground text-lg font-bold">
                    Automated Package Lockers & Cold Storage Delivery
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent class="space-y-4 p-6 pt-2">
                <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                  Contactless Luxer One smart package room with digital PIN and barcode pickup alerts, secure oversized
                  parcel rooms, and commercial-grade refrigerated storage for fresh grocery deliveries.
                </CardDescription>

                <div class="flex flex-wrap gap-1.5 pt-2">
                  <Badge variant="outline" class="bg-muted/20 text-xs">Cold Grocery Lockers</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">24/7 App QR Pickup</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Oversized Item Vault</Badge>
                </div>
              </CardContent>
            </Card>

            <!-- Card 3: Dry Cleaning Valet & Laundry Services -->
            <Card
              v-if="matchesQuery('Dry Cleaning Valet & Laundry Services garment tailoring wash')"
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md sm:col-span-2 lg:col-span-1"
            >
              <CardHeader class="space-y-3 p-6 pb-2">
                <div class="flex items-center justify-between">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Shirt class="size-5" />
                  </div>
                  <Badge variant="secondary" class="text-xs font-medium">Valet Care</Badge>
                </div>
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin class="text-primary size-3" />
                    Service Concourse B1
                  </div>
                  <CardTitle class="text-foreground text-lg font-bold">
                    Dry Cleaning Valet & Laundry Services
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent class="space-y-4 p-6 pt-2">
                <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                  On-demand eco-friendly dry cleaning drop-off lockers with 24-hour turnaround, garment pressing, shoe
                  shining, tailored alterations, and in-locker contactless delivery return.
                </CardDescription>

                <div class="flex flex-wrap gap-1.5 pt-2">
                  <Badge variant="outline" class="bg-muted/20 text-xs">24h Turnaround</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Eco-Friendly Cleaning</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Tailored Alterations</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- ================================================================= -->
        <!-- CATEGORY 4: PARKING & PET CARE -->
        <!-- ================================================================= -->
        <div v-if="showParking" class="space-y-6">
          <!-- Category Header -->
          <div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <div class="flex items-center gap-3">
              <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                <Car class="size-5" />
              </div>
              <div>
                <h3 class="text-foreground text-xl font-bold tracking-tight">Parking & Pet Care</h3>
                <p class="text-muted-foreground text-xs sm:text-sm">
                  Subterranean EV charging bays and private rooftop pet facilities for four-legged residents.
                </p>
              </div>
            </div>
            <Badge variant="outline" class="border-border text-muted-foreground text-xs font-medium">
              2 Featured Amenities
            </Badge>
          </div>

          <!-- Parking & Pet Care Cards Grid -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Card 1: Secure Underground Parking with EV Chargers -->
            <Card
              v-if="matchesQuery('Secure Underground Parking with EV Chargers electric vehicle garage stall')"
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <CardHeader class="space-y-3 p-6 pb-2">
                <div class="flex items-center justify-between">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Car class="size-5" />
                  </div>
                  <Badge variant="secondary" class="text-xs font-medium">EV Ready</Badge>
                </div>
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin class="text-primary size-3" />
                    Levels P1 – P3 Subterranean
                  </div>
                  <CardTitle class="text-foreground text-lg font-bold">
                    Secure Underground Parking with EV Chargers
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent class="space-y-4 p-6 pt-2">
                <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                  Gated subterranean multi-level garage featuring automated license plate recognition entry gates,
                  assigned private stalls, 48 universal Level 2 EV charging stations, and dedicated bike storage.
                </CardDescription>

                <div class="flex flex-wrap gap-1.5 pt-2">
                  <Badge variant="outline" class="bg-muted/20 text-xs">48 EV Charging Ports</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">LPR Auto-Gate</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Covered Bike Vault</Badge>
                </div>
              </CardContent>
            </Card>

            <!-- Card 2: Private Rooftop Dog Park & Pet Spa Station -->
            <Card
              v-if="matchesQuery('Private Rooftop Dog Park & Pet Spa Station canine grooming wash animal')"
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <CardHeader class="space-y-3 p-6 pb-2">
                <div class="flex items-center justify-between">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Sparkles class="size-5" />
                  </div>
                  <Badge variant="secondary" class="text-xs font-medium">Pet Friendly</Badge>
                </div>
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin class="text-primary size-3" />
                    Level 44 Sky Deck
                  </div>
                  <CardTitle class="text-foreground text-lg font-bold">
                    Private Rooftop Dog Park & Pet Spa Station
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent class="space-y-4 p-6 pt-2">
                <CardDescription class="text-muted-foreground text-sm leading-relaxed">
                  Enclosed rooftop canine park with anti-microbial synthetic turf and agility obstacles, paired with an
                  indoor heated pet wash spa featuring stainless steel wash tubs and pro blow dry station.
                </CardDescription>

                <div class="flex flex-wrap gap-1.5 pt-2">
                  <Badge variant="outline" class="bg-muted/20 text-xs">Anti-Microbial Turf</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Heated Wash Tubs</Badge>
                  <Badge variant="outline" class="bg-muted/20 text-xs">Pro Blow Dryers</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <!-- Bottom Callout Card: Resident Keycard App & Tour Booking -->
      <Card class="bg-muted/30 border-border mt-16 overflow-hidden border shadow-xs">
        <CardContent class="flex flex-col items-start justify-between gap-6 p-6 sm:p-8 md:flex-row md:items-center">
          <div class="flex items-start gap-4">
            <div class="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl">
              <ShieldCheck class="size-6" />
            </div>
            <div class="space-y-1">
              <h4 class="text-foreground text-base font-semibold sm:text-lg">
                Keyless Resident Access & Mobile App Integration
              </h4>
              <p class="text-muted-foreground max-w-2xl text-xs sm:text-sm">
                All 24 building amenities are digitally accessible via NFC mobile key, offering instant cabana and
                conference room reservations, real-time fitness occupancy, and automated guest passes.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" class="gap-1.5 text-xs">
              <FileText class="size-3.5" />
              Amenity Guide PDF
            </Button>
            <Button size="sm" class="gap-1.5 text-xs">
              <Calendar class="size-3.5" />
              Schedule a Tour
              <ArrowRight class="size-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
