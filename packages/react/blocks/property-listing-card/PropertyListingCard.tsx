'use client'

import * as React from 'react'
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
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface PropertyItem {
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

export interface PropertyListingCardProps {
  className?: string
}

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

export function PropertyListingCard({ className }: PropertyListingCardProps) {
  const [activePhotoIndex, setActivePhotoIndex] = React.useState<Record<string, number>>({
    'prop-pasadena': 0,
    'prop-carmel': 0,
    'prop-downtown': 0,
  })
  const [wishlistedIds, setWishlistedIds] = React.useState<Set<string>>(new Set(['prop-pasadena']))
  const [scheduledTourIds, setScheduledTourIds] = React.useState<Set<string>>(new Set())
  const [contactedAgentIds, setContactedAgentIds] = React.useState<Set<string>>(new Set())
  const [copiedLinkId, setCopiedLinkId] = React.useState<string | null>(null)
  const [activeCategoryFilter, setActiveCategoryFilter] = React.useState<string>('all')
  const [activeTourModalId, setActiveTourModalId] = React.useState<string | null>(null)

  const getPhotoIndex = (id: string): number => {
    return activePhotoIndex[id] ?? 0
  }

  const prevPhoto = (id: string, total: number) => {
    const current = getPhotoIndex(id)
    setActivePhotoIndex((prev) => ({
      ...prev,
      [id]: (current - 1 + total) % total,
    }))
  }

  const nextPhoto = (id: string, total: number) => {
    const current = getPhotoIndex(id)
    setActivePhotoIndex((prev) => ({
      ...prev,
      [id]: (current + 1) % total,
    }))
  }

  const setPhoto = (id: string, index: number) => {
    setActivePhotoIndex((prev) => ({
      ...prev,
      [id]: index,
    }))
  }

  const toggleWishlist = (id: string) => {
    setWishlistedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const isWishlisted = (id: string): boolean => {
    return wishlistedIds.has(id)
  }

  const toggleScheduleTour = (id: string) => {
    setScheduledTourIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const isTourScheduled = (id: string): boolean => {
    return scheduledTourIds.has(id)
  }

  const toggleContactAgent = (id: string) => {
    setContactedAgentIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const isAgentContacted = (id: string): boolean => {
    return contactedAgentIds.has(id)
  }

  const shareListing = (id: string) => {
    const url = `https://uipkge.dev/listings/${id}`
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url)
    }
    setCopiedLinkId(id)
    setTimeout(() => {
      setCopiedLinkId((curr) => (curr === id ? null : curr))
    }, 2000)
  }

  const toggleVirtualTour = (id: string) => {
    setActiveTourModalId((curr) => (curr === id ? null : id))
  }

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredProperties = React.useMemo(() => {
    if (activeCategoryFilter === 'all') {
      return PROPERTIES
    }
    return PROPERTIES.filter((p) => p.category === activeCategoryFilter)
  }, [activeCategoryFilter])

  return (
    <section
      data-slot="property-listing-card"
      className={cn('bg-background text-foreground w-full space-y-6', className)}
    >
      {/* Header & Category Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Featured Property Listings</h2>
            <Badge wrap variant="secondary" className="text-xs font-normal tabular-nums">
              {filteredProperties.length} Active
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Browse verified real estate properties with interactive photo galleries, mortgage calculations, and 3D
            walkthroughs.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="border-border/80 bg-muted/40 flex flex-wrap items-center gap-1.5 rounded-lg border p-1">
          <button
            type="button"
            className={cn(
              'focus-visible:ring-ring min-h-6 rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              activeCategoryFilter === 'all'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setActiveCategoryFilter('all')}
          >
            All Homes
          </button>
          <button
            type="button"
            className={cn(
              'focus-visible:ring-ring min-h-6 rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              activeCategoryFilter === 'single-family'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setActiveCategoryFilter('single-family')}
          >
            Single Family
          </button>
          <button
            type="button"
            className={cn(
              'focus-visible:ring-ring min-h-6 rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              activeCategoryFilter === 'waterfront'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setActiveCategoryFilter('waterfront')}
          >
            Waterfront
          </button>
          <button
            type="button"
            className={cn(
              'focus-visible:ring-ring min-h-6 rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              activeCategoryFilter === 'penthouse'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setActiveCategoryFilter('penthouse')}
          >
            Penthouse
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((prop) => {
          const currentIndex = getPhotoIndex(prop.id)
          const wishlisted = isWishlisted(prop.id)
          const tourScheduled = isTourScheduled(prop.id)
          const agentContacted = isAgentContacted(prop.id)
          const copied = copiedLinkId === prop.id
          const tourModalActive = activeTourModalId === prop.id

          return (
            <Card
              key={prop.id}
              className="group border-border bg-card hover:border-border/80 relative flex flex-col justify-between overflow-hidden rounded-xl border shadow-xs transition-all duration-300 hover:shadow-md"
            >
              {/* 1. Image Carousel Gallery Hero (16:9 Aspect Ratio) */}
              <div className="bg-muted relative aspect-video w-full overflow-hidden">
                {/* Active Image */}
                <img
                  src={prop.images[currentIndex]}
                  alt={`${prop.title} - Photo ${currentIndex + 1}`}
                  className="size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient Overlays for High-Contrast Readable Badges */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/60" />

                {/* Top Overlay: Badges and Wishlist Button */}
                <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge wrap variant={prop.badge.variant} className="text-xs font-semibold shadow-xs">
                      {
                        {
                          default: prop.badge.label,
                          secondary: prop.badge.label,
                          outline: prop.badge.label,
                          destructive: prop.badge.label,
                        }[prop.badge.variant]
                      }
                    </Badge>
                    {prop.hasVirtualTour && (
                      <button
                        type="button"
                        className="inline-flex min-h-6 items-center gap-1 rounded-full border border-white/25 bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white shadow-xs backdrop-blur-md transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        title={tourModalActive ? 'Exit 3D Tour Mode' : 'Explore 3D Virtual Tour'}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleVirtualTour(prop.id)
                        }}
                      >
                        <Box className="size-3 text-emerald-400" />
                        <span>Virtual Tour 3D</span>
                      </button>
                    )}
                  </div>

                  {/* Wishlist Heart Button */}
                  <button
                    type="button"
                    aria-label="Save property to wishlist"
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white shadow-xs backdrop-blur-md transition-colors hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
                      wishlisted ? 'text-rose-500 hover:text-rose-400' : 'text-white',
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWishlist(prop.id)
                    }}
                  >
                    <Heart className={cn('size-4', wishlisted ? 'fill-rose-500 text-rose-500' : '')} />
                  </button>
                </div>

                {/* Chevron Carousel Controls (Appear on hover or focus) */}
                <button
                  type="button"
                  aria-label="Previous property photo"
                  className="absolute top-1/2 left-2.5 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white opacity-0 shadow-xs backdrop-blur-md transition-colors group-hover:opacity-100 hover:bg-black/80 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  onClick={(e) => {
                    e.stopPropagation()
                    prevPhoto(prop.id, prop.images.length)
                  }}
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next property photo"
                  className="absolute top-1/2 right-2.5 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white opacity-0 shadow-xs backdrop-blur-md transition-colors group-hover:opacity-100 hover:bg-black/80 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  onClick={(e) => {
                    e.stopPropagation()
                    nextPhoto(prop.id, prop.images.length)
                  }}
                >
                  <ChevronRight className="size-4" />
                </button>

                {/* Bottom Hero Overlay: Photo Counter, Dots, and Open House Tag */}
                <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-2">
                  {/* Photo Counter Pill */}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white tabular-nums backdrop-blur-md">
                    <Camera className="size-3 text-white/80" />
                    {currentIndex + 1} / {prop.totalPhotos} Photos
                  </span>

                  {/* Image Dots / Indicators */}
                  <div className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-xs">
                    {prop.images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Jump to photo ${index + 1}`}
                        className={cn(
                          'rounded-full transition-all focus-visible:ring-1 focus-visible:ring-white focus-visible:outline-none',
                          currentIndex === index ? 'h-1.5 w-3.5 bg-white' : 'size-1.5 bg-white/50 hover:bg-white/80',
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          setPhoto(prop.id, index)
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Virtual Tour Active Banner Callout */}
                {tourModalActive && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 p-4 text-center backdrop-blur-sm transition-all">
                    <Compass className="size-8 animate-spin text-emerald-400" />
                    <h4 className="mt-2 text-sm font-semibold text-white">3D Virtual Space Initialized</h4>
                    <p className="mt-1 max-w-xs text-xs text-white/80">
                      Interactive 360° LiDAR spatial model active for {prop.address.street}.
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-3 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveTourModalId(null)
                      }}
                    >
                      Close 3D View
                    </Button>
                  </div>
                )}
              </div>

              {/* 2. Card Content & Specifications */}
              <CardContent className="flex flex-1 flex-col justify-between space-y-4 p-5">
                <div className="space-y-3.5">
                  {/* Price & Mortgage Estimate Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
                          {formatPrice(prop.price)}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-normal tabular-nums">
                        <Calculator className="text-muted-foreground/80 size-3.5 shrink-0" />
                        <span>{prop.mortgageEst}</span>
                      </div>
                    </div>
                    <Badge wrap variant="secondary" className="shrink-0 text-xs font-normal">
                      {prop.propertyType}
                    </Badge>
                  </div>

                  {/* Specs Pill Grid (Beds, Baths, SqFt, $/SqFt) */}
                  <div className="grid grid-cols-4 gap-1.5 py-0.5">
                    {/* Beds */}
                    <div className="border-border/60 bg-muted/40 flex flex-col items-center justify-center rounded-lg border p-2 text-center">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <BedDouble className="size-3.5" />
                        <span className="text-foreground text-xs font-semibold tabular-nums">{prop.specs.beds}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">Beds</span>
                    </div>

                    {/* Baths */}
                    <div className="border-border/60 bg-muted/40 flex flex-col items-center justify-center rounded-lg border p-2 text-center">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Bath className="size-3.5" />
                        <span className="text-foreground text-xs font-semibold tabular-nums">{prop.specs.baths}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">Baths</span>
                    </div>

                    {/* Sq Ft */}
                    <div className="border-border/60 bg-muted/40 flex flex-col items-center justify-center rounded-lg border p-2 text-center">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Maximize2 className="size-3.5" />
                        <span className="text-foreground text-xs font-semibold tabular-nums">
                          {prop.specs.sqft.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">Sq Ft</span>
                    </div>

                    {/* Price Per Sq Ft */}
                    <div className="border-border/60 bg-muted/40 flex flex-col items-center justify-center rounded-lg border p-2 text-center">
                      <div className="text-muted-foreground flex items-center gap-0.5">
                        <span className="text-foreground text-xs font-semibold tabular-nums">
                          ${prop.specs.pricePerSqft}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">/ sqft</span>
                    </div>
                  </div>

                  {/* Address & Neighborhood */}
                  <div className="space-y-1">
                    <h3
                      className="text-foreground hover:text-primary line-clamp-1 cursor-pointer text-sm font-semibold tracking-tight transition-colors"
                      title={prop.address.street}
                    >
                      {prop.address.street}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <MapPin className="text-muted-foreground/80 size-3.5 shrink-0" />
                      <span className="truncate">{prop.address.cityStateZip}</span>
                      <span>·</span>
                      <span className="text-foreground/85 shrink-0 font-medium">{prop.address.neighborhood}</span>
                    </p>
                  </div>

                  {/* Key Features Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {prop.tags.map((tag) => (
                      <Badge
                        wrap
                        key={tag}
                        variant="outline"
                        className="border-border/70 bg-muted/30 text-muted-foreground hover:bg-muted/60 text-xs font-normal transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Footer Area: Agent Attribution & Action Buttons */}
                <div className="space-y-3.5 pt-2">
                  <Separator />

                  {/* Agent / Broker Attribution */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Avatar size="sm" className="border-border size-8 border shadow-2xs">
                        <AvatarImage src={prop.agent.avatar} alt={prop.agent.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {
                            {
                              fallback: prop.agent.initials,
                            }.fallback
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-foreground flex items-center gap-1 truncate text-xs font-semibold">
                          <span>Listed by {prop.agent.name}</span>
                          <BadgeCheck className="text-primary size-3 shrink-0" />
                        </p>
                        <p className="text-muted-foreground truncate text-xs">{prop.agent.brokerage}</p>
                      </div>
                    </div>

                    {/* Share Action Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground size-8 shrink-0 rounded-full"
                      title={copied ? 'Listing link copied!' : 'Share listing'}
                      onClick={() => shareListing(prop.id)}
                    >
                      {copied ? (
                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Share2 className="size-3.5" />
                      )}
                      <span className="sr-only">Share listing</span>
                    </Button>
                  </div>

                  {/* Action Buttons: Schedule Tour & Contact Agent */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      className="w-full gap-1.5 text-xs font-medium shadow-xs"
                      variant={tourScheduled ? 'secondary' : 'default'}
                      onClick={() => toggleScheduleTour(prop.id)}
                    >
                      {tourScheduled ? (
                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Calendar className="size-3.5" />
                      )}
                      <span>{tourScheduled ? 'Tour Booked ✓' : 'Schedule Tour'}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        'w-full gap-1.5 text-xs font-medium',
                        agentContacted
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : '',
                      )}
                      onClick={() => toggleContactAgent(prop.id)}
                    >
                      {agentContacted ? (
                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Mail className="size-3.5" />
                      )}
                      <span>{agentContacted ? 'Message Sent' : 'Contact Agent'}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export default PropertyListingCard
