<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  BadgeCheck,
  Bath,
  BedDouble,
  Box,
  Calculator,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Heart,
  Mail,
  MapPin,
  Maximize2,
  Share2,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface PropertyItem {
  id: string
  title: string
  propertyType: string
  category: 'all' | 'single-family' | 'waterfront' | 'penthouse'
  price: number
  mortgageEst: string
  address: {
    street: string
    cityStateZip: string
    neighborhood: string
  }
  specs: {
    beds: number
    baths: number
    sqft: number
    pricePerSqft: number
    yearBuilt: number
    lotSize: string
  }
  badge: {
    label: string
    variant: 'default' | 'secondary' | 'outline' | 'destructive'
  }
  hasVirtualTour: boolean
  openHouse: string
  totalPhotos: number
  images: string[]
  tags: string[]
  agent: {
    name: string
    brokerage: string
    avatar: string
    initials: string
    badge: string
  }
}

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const PROPERTIES: PropertyItem[] = [
  {
    id: 'prop-pasadena',
    title: 'Mid-Century Modern Architectural Sanctuary',
    propertyType: 'Single Family Residence',
    category: 'single-family',
    price: 1245000,
    mortgageEst: 'Est. $6,420 / mo',
    address: {
      street: '742 Evergreen Terrace',
      cityStateZip: 'Pasadena, CA 91101',
      neighborhood: 'San Rafael Hills',
    },
    specs: {
      beds: 4,
      baths: 3.5,
      sqft: 2850,
      pricePerSqft: 437,
      yearBuilt: 1962,
      lotSize: '0.34 Acres',
    },
    badge: {
      label: 'New Listing',
      variant: 'default',
    },
    hasVirtualTour: true,
    openHouse: 'Open Sun 1:00 – 4:00 PM',
    totalPhotos: 18,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&auto=format&fit=crop&q=80',
    ],
    tags: ['Swimming Pool', 'Solar Panels', '2-Car Garage', 'Modern Kitchen', 'Mountain View'],
    agent: {
      name: 'Elena Rostova',
      brokerage: "Sotheby's International Realty",
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      initials: 'ER',
      badge: 'Top 1% Producer',
    },
  },
  {
    id: 'prop-carmel',
    title: 'Coastal Craftsman Villa with Ocean Vista',
    propertyType: 'Luxury Waterfront Estate',
    category: 'waterfront',
    price: 2890000,
    mortgageEst: 'Est. $14,850 / mo',
    address: {
      street: '1840 Ocean View Avenue',
      cityStateZip: 'Carmel-by-the-Sea, CA 93921',
      neighborhood: 'Point Lobos Highlands',
    },
    specs: {
      beds: 5,
      baths: 4.5,
      sqft: 4120,
      pricePerSqft: 701,
      yearBuilt: 2021,
      lotSize: '0.52 Acres',
    },
    badge: {
      label: 'Price Drop $100k',
      variant: 'secondary',
    },
    hasVirtualTour: true,
    openHouse: 'Private Viewings Only',
    totalPhotos: 24,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&auto=format&fit=crop&q=80',
    ],
    tags: ['Ocean Frontage', 'Wine Cellar', 'Infinity Pool', 'Smart Automation', 'Chef Kitchen'],
    agent: {
      name: 'Marcus Vance',
      brokerage: 'Compass Premier Collection',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
      initials: 'MV',
      badge: 'Luxury Director',
    },
  },
  {
    id: 'prop-downtown',
    title: 'Skyline Glass Penthouse & Private Terrace',
    propertyType: 'High-Rise Penthouse Condo',
    category: 'penthouse',
    price: 895000,
    mortgageEst: 'Est. $4,680 / mo',
    address: {
      street: '450 S Grand Avenue, Unit 38B',
      cityStateZip: 'Los Angeles, CA 90071',
      neighborhood: 'Bunker Hill Downtown',
    },
    specs: {
      beds: 2,
      baths: 2.0,
      sqft: 1640,
      pricePerSqft: 545,
      yearBuilt: 2019,
      lotSize: 'HOA $620 / mo',
    },
    badge: {
      label: 'Just Listed',
      variant: 'default',
    },
    hasVirtualTour: true,
    openHouse: 'Open Sat 2:00 – 5:00 PM',
    totalPhotos: 14,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
    ],
    tags: ['Private Terrace', '24/7 Concierge', 'Floor-to-Ceiling Windows', 'EV Parking', 'Fitness Center'],
    agent: {
      name: 'Aria Chen',
      brokerage: 'Coldwell Banker Global Luxury',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      initials: 'AC',
      badge: 'Downtown Specialist',
    },
  },
]

const activePhotoIndex = ref<Record<string, number>>({
  'prop-pasadena': 0,
  'prop-carmel': 0,
  'prop-downtown': 0,
})

const wishlistedIds = ref<Set<string>>(new Set(['prop-pasadena']))
const scheduledTourIds = ref<Set<string>>(new Set())
const contactedAgentIds = ref<Set<string>>(new Set())
const copiedLinkId = ref<string | null>(null)
const activeCategoryFilter = ref<string>('all')
const activeTourModalId = ref<string | null>(null)

function getPhotoIndex(id: string): number {
  return activePhotoIndex.value[id] ?? 0
}

function prevPhoto(id: string, total: number) {
  const current = getPhotoIndex(id)
  activePhotoIndex.value = {
    ...activePhotoIndex.value,
    [id]: (current - 1 + total) % total,
  }
}

function nextPhoto(id: string, total: number) {
  const current = getPhotoIndex(id)
  activePhotoIndex.value = {
    ...activePhotoIndex.value,
    [id]: (current + 1) % total,
  }
}

function setPhoto(id: string, index: number) {
  activePhotoIndex.value = {
    ...activePhotoIndex.value,
    [id]: index,
  }
}

function toggleWishlist(id: string) {
  const next = new Set(wishlistedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  wishlistedIds.value = next
}

function isWishlisted(id: string): boolean {
  return wishlistedIds.value.has(id)
}

function toggleScheduleTour(id: string) {
  const next = new Set(scheduledTourIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  scheduledTourIds.value = next
}

function isTourScheduled(id: string): boolean {
  return scheduledTourIds.value.has(id)
}

function toggleContactAgent(id: string) {
  const next = new Set(contactedAgentIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  contactedAgentIds.value = next
}

function isAgentContacted(id: string): boolean {
  return contactedAgentIds.value.has(id)
}

function shareListing(id: string, street: string) {
  const url = `https://uipkge.dev/listings/${id}`
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(url)
  }
  copiedLinkId.value = id
  setTimeout(() => {
    if (copiedLinkId.value === id) {
      copiedLinkId.value = null
    }
  }, 2000)
}

function toggleVirtualTour(id: string) {
  if (activeTourModalId.value === id) {
    activeTourModalId.value = null
  } else {
    activeTourModalId.value = id
  }
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

const filteredProperties = computed(() => {
  if (activeCategoryFilter.value === 'all') {
    return PROPERTIES
  }
  return PROPERTIES.filter((p) => p.category === activeCategoryFilter.value)
})
</script>

<template>
  <section data-slot="property-listing-card" :class="cn('bg-background text-foreground w-full space-y-6', props.class)">
    <!-- Header & Category Switcher -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2.5">
          <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Featured Property Listings</h2>
          <Badge wrap variant="secondary" class="text-xs font-normal tabular-nums">
            {{ filteredProperties.length }} Active
          </Badge>
        </div>
        <p class="text-muted-foreground text-xs sm:text-sm">
          Browse verified real estate properties with interactive photo galleries, mortgage calculations, and 3D
          walkthroughs.
        </p>
      </div>

      <!-- Category Filter Pills -->
      <div class="border-border/80 bg-muted/40 flex flex-wrap items-center gap-1.5 rounded-lg border p-1">
        <button
          type="button"
          class="focus-visible:ring-ring min-h-6 rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          :class="
            activeCategoryFilter === 'all'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="activeCategoryFilter = 'all'"
        >
          All Homes
        </button>
        <button
          type="button"
          class="focus-visible:ring-ring min-h-6 rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          :class="
            activeCategoryFilter === 'single-family'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="activeCategoryFilter = 'single-family'"
        >
          Single Family
        </button>
        <button
          type="button"
          class="focus-visible:ring-ring min-h-6 rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          :class="
            activeCategoryFilter === 'waterfront'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="activeCategoryFilter = 'waterfront'"
        >
          Waterfront
        </button>
        <button
          type="button"
          class="focus-visible:ring-ring min-h-6 rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          :class="
            activeCategoryFilter === 'penthouse'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="activeCategoryFilter = 'penthouse'"
        >
          Penthouse
        </button>
      </div>
    </div>

    <!-- Properties Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="prop in filteredProperties"
        :key="prop.id"
        class="group border-border bg-card hover:border-border/80 relative flex flex-col justify-between overflow-hidden rounded-xl border shadow-xs transition-all duration-300 hover:shadow-md"
      >
        <!-- 1. Image Carousel Gallery Hero (16:9 Aspect Ratio) -->
        <div class="bg-muted relative aspect-video w-full overflow-hidden">
          <!-- Active Image -->
          <img
            :src="prop.images[getPhotoIndex(prop.id)]"
            :alt="`${prop.title} - Photo ${getPhotoIndex(prop.id) + 1}`"
            class="size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          <!-- Gradient Overlays for High-Contrast Readable Badges -->
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/60" />

          <!-- Top Overlay: Badges and Wishlist Button -->
          <div class="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
            <div class="flex flex-wrap items-center gap-1.5">
              <Badge wrap :variant="prop.badge.variant" class="text-xs font-semibold shadow-xs">
                {{ prop.badge.label }}
              </Badge>
              <button
                v-if="prop.hasVirtualTour"
                type="button"
                class="inline-flex min-h-6 items-center gap-1 rounded-full border border-white/25 bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white shadow-xs backdrop-blur-md transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                :title="activeTourModalId === prop.id ? 'Exit 3D Tour Mode' : 'Explore 3D Virtual Tour'"
                @click.stop="toggleVirtualTour(prop.id)"
              >
                <Box class="size-3 text-emerald-400" />
                <span>Virtual Tour 3D</span>
              </button>
            </div>

            <!-- Wishlist Heart Button -->
            <button
              type="button"
              aria-label="Save property to wishlist"
              class="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white shadow-xs backdrop-blur-md transition-colors hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              :class="isWishlisted(prop.id) ? 'text-rose-500 hover:text-rose-400' : 'text-white'"
              @click.stop="toggleWishlist(prop.id)"
            >
              <Heart class="size-4" :class="isWishlisted(prop.id) ? 'fill-rose-500 text-rose-500' : ''" />
            </button>
          </div>

          <!-- Chevron Carousel Controls (Appear on hover or focus) -->
          <button
            type="button"
            aria-label="Previous property photo"
            class="absolute top-1/2 left-2.5 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white opacity-0 shadow-xs backdrop-blur-md transition-colors group-hover:opacity-100 hover:bg-black/80 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            @click.stop="prevPhoto(prop.id, prop.images.length)"
          >
            <ChevronLeft class="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next property photo"
            class="absolute top-1/2 right-2.5 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white opacity-0 shadow-xs backdrop-blur-md transition-colors group-hover:opacity-100 hover:bg-black/80 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            @click.stop="nextPhoto(prop.id, prop.images.length)"
          >
            <ChevronRight class="size-4" />
          </button>

          <!-- Bottom Hero Overlay: Photo Counter, Dots, and Open House Tag -->
          <div class="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-2">
            <!-- Photo Counter Pill -->
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white tabular-nums backdrop-blur-md"
            >
              <Camera class="size-3 text-white/80" />
              {{ getPhotoIndex(prop.id) + 1 }} / {{ prop.totalPhotos }} Photos
            </span>

            <!-- Image Dots / Indicators -->
            <div class="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-xs">
              <button
                v-for="(_, index) in prop.images"
                :key="index"
                type="button"
                :aria-label="`Jump to photo ${index + 1}`"
                class="rounded-full transition-all focus-visible:ring-1 focus-visible:ring-white focus-visible:outline-none"
                :class="
                  getPhotoIndex(prop.id) === index ? 'h-1.5 w-3.5 bg-white' : 'size-1.5 bg-white/50 hover:bg-white/80'
                "
                @click.stop="setPhoto(prop.id, index)"
              />
            </div>
          </div>

          <!-- Virtual Tour Active Banner Callout -->
          <div
            v-if="activeTourModalId === prop.id"
            class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 p-4 text-center backdrop-blur-sm transition-all"
          >
            <Compass class="size-8 animate-spin text-emerald-400" />
            <h4 class="mt-2 text-sm font-semibold text-white">3D Virtual Space Initialized</h4>
            <p class="mt-1 max-w-xs text-xs text-white/80">
              Interactive 360° LiDAR spatial model active for {{ prop.address.street }}.
            </p>
            <Button size="sm" variant="secondary" class="mt-3 text-xs" @click.stop="activeTourModalId = null">
              Close 3D View
            </Button>
          </div>
        </div>

        <!-- 2. Card Content & Specifications -->
        <CardContent class="flex flex-1 flex-col justify-between space-y-4 p-5">
          <div class="space-y-3.5">
            <!-- Price & Mortgage Estimate Row -->
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-baseline gap-2">
                  <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">
                    {{ formatPrice(prop.price) }}
                  </span>
                </div>
                <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-normal tabular-nums">
                  <Calculator class="text-muted-foreground/80 size-3.5 shrink-0" />
                  <span>{{ prop.mortgageEst }}</span>
                </div>
              </div>
              <Badge wrap variant="secondary" class="shrink-0 text-xs font-normal">
                {{ prop.propertyType }}
              </Badge>
            </div>

            <!-- Specs Pill Grid (Beds, Baths, SqFt, $/SqFt) -->
            <div class="grid grid-cols-4 gap-1.5 py-0.5">
              <!-- Beds -->
              <div
                class="border-border/60 bg-muted/40 flex flex-col items-center justify-center rounded-lg border p-2 text-center"
              >
                <div class="text-muted-foreground flex items-center gap-1">
                  <BedDouble class="size-3.5" />
                  <span class="text-foreground text-xs font-semibold tabular-nums">{{ prop.specs.beds }}</span>
                </div>
                <span class="text-muted-foreground text-xs">Beds</span>
              </div>

              <!-- Baths -->
              <div
                class="border-border/60 bg-muted/40 flex flex-col items-center justify-center rounded-lg border p-2 text-center"
              >
                <div class="text-muted-foreground flex items-center gap-1">
                  <Bath class="size-3.5" />
                  <span class="text-foreground text-xs font-semibold tabular-nums">{{ prop.specs.baths }}</span>
                </div>
                <span class="text-muted-foreground text-xs">Baths</span>
              </div>

              <!-- Sq Ft -->
              <div
                class="border-border/60 bg-muted/40 flex flex-col items-center justify-center rounded-lg border p-2 text-center"
              >
                <div class="text-muted-foreground flex items-center gap-1">
                  <Maximize2 class="size-3.5" />
                  <span class="text-foreground text-xs font-semibold tabular-nums">
                    {{ prop.specs.sqft.toLocaleString() }}
                  </span>
                </div>
                <span class="text-muted-foreground text-xs">Sq Ft</span>
              </div>

              <!-- Price Per Sq Ft -->
              <div
                class="border-border/60 bg-muted/40 flex flex-col items-center justify-center rounded-lg border p-2 text-center"
              >
                <div class="text-muted-foreground flex items-center gap-0.5">
                  <span class="text-foreground text-xs font-semibold tabular-nums">${{ prop.specs.pricePerSqft }}</span>
                </div>
                <span class="text-muted-foreground text-xs">/ sqft</span>
              </div>
            </div>

            <!-- Address & Neighborhood -->
            <div class="space-y-1">
              <h3
                class="text-foreground hover:text-primary line-clamp-1 cursor-pointer text-sm font-semibold tracking-tight transition-colors"
                :title="prop.address.street"
              >
                {{ prop.address.street }}
              </h3>
              <p class="text-muted-foreground flex items-center gap-1.5 text-xs">
                <MapPin class="text-muted-foreground/80 size-3.5 shrink-0" />
                <span class="truncate">{{ prop.address.cityStateZip }}</span>
                <span>·</span>
                <span class="text-foreground/85 shrink-0 font-medium">{{ prop.address.neighborhood }}</span>
              </p>
            </div>

            <!-- Key Features Tags -->
            <div class="flex flex-wrap gap-1.5 pt-0.5">
              <Badge
                wrap
                v-for="tag in prop.tags"
                :key="tag"
                variant="outline"
                class="border-border/70 bg-muted/30 text-muted-foreground hover:bg-muted/60 text-xs font-normal transition-colors"
              >
                {{ tag }}
              </Badge>
            </div>
          </div>

          <!-- Footer Area: Agent Attribution & Action Buttons -->
          <div class="space-y-3.5 pt-2">
            <Separator />

            <!-- Agent / Broker Attribution -->
            <div class="flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-2.5">
                <Avatar size="sm" class="border-border size-8 border shadow-2xs">
                  <AvatarImage :src="prop.agent.avatar" :alt="prop.agent.name" />
                  <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">
                    {{ prop.agent.initials }}
                  </AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <p class="text-foreground flex items-center gap-1 truncate text-xs font-semibold">
                    <span>Listed by {{ prop.agent.name }}</span>
                    <BadgeCheck class="text-primary size-3 shrink-0" />
                  </p>
                  <p class="text-muted-foreground truncate text-xs">{{ prop.agent.brokerage }}</p>
                </div>
              </div>

              <!-- Share Action Button -->
              <Button
                variant="ghost"
                size="icon"
                class="text-muted-foreground hover:text-foreground size-8 shrink-0 rounded-full"
                :title="copiedLinkId === prop.id ? 'Listing link copied!' : 'Share listing'"
                @click="shareListing(prop.id, prop.address.street)"
              >
                <Check v-if="copiedLinkId === prop.id" class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <Share2 v-else class="size-3.5" />
                <span class="sr-only">Share listing</span>
              </Button>
            </div>

            <!-- Action Buttons: Schedule Tour & Contact Agent -->
            <div class="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                class="w-full gap-1.5 text-xs font-medium shadow-xs"
                :variant="isTourScheduled(prop.id) ? 'secondary' : 'default'"
                @click="toggleScheduleTour(prop.id)"
              >
                <Check v-if="isTourScheduled(prop.id)" class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <Calendar v-else class="size-3.5" />
                <span>{{ isTourScheduled(prop.id) ? 'Tour Booked ✓' : 'Schedule Tour' }}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                class="w-full gap-1.5 text-xs font-medium"
                :class="
                  isAgentContacted(prop.id)
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : ''
                "
                @click="toggleContactAgent(prop.id)"
              >
                <Check v-if="isAgentContacted(prop.id)" class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <Mail v-else class="size-3.5" />
                <span>{{ isAgentContacted(prop.id) ? 'Message Sent' : 'Contact Agent' }}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
