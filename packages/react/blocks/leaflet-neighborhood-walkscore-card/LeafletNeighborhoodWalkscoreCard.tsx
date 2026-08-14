'use client'

import * as React from 'react'
import {
  Footprints,
  Bus,
  Bike,
  MapPin,
  Search,
  Navigation,
  School,
  TreePine,
  Coffee,
  GraduationCap,
  UtensilsCrossed,
  Car,
  Train,
  Clock,
  Share2,
  Bookmark,
  Check,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { LeafletCircle, LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'

export type PoiCategoryType = 'all' | 'transit' | 'dining' | 'schools' | 'parks'
export type CommuteMode = 'all' | 'transit' | 'drive'

export interface MobilityScore {
  score: number
  maxScore?: number
  label: string
  verdict: string
  description: string
  verdictClass: string
  gaugeColor: string
  subtext: string
  highlights: string[]
}

export interface PoiItem {
  id: string
  name: string
  category: 'transit' | 'dining' | 'schools' | 'parks'
  categoryLabel: string
  distance: string
  timeWalk?: string
  timeDrive?: string
  rating?: string
  badge?: string
  description: string
  address: string
  coords?: [number, number]
}

export interface CommuteDestination {
  id: string
  name: string
  region: string
  distance: string
  transitTime: number
  transitLabel: string
  transitRoute: string
  driveTime: number
  driveLabel: string
  driveRoute: string
  peakRushTime?: string
}

export interface LeafletNeighborhoodWalkscoreCardProps {
  title?: string
  address?: string
  neighborhood?: string
  city?: string
  zipCode?: string
  walkScore?: MobilityScore
  transitScore?: MobilityScore
  bikeScore?: MobilityScore
  pois?: PoiItem[]
  commutes?: CommuteDestination[]
  className?: string
}

const defaultWalkScore: MobilityScore = {
  score: 94,
  maxScore: 100,
  label: 'Walk Score®',
  verdict: "Walker's Paradise",
  description: 'Daily errands do not require a car',
  verdictClass: 'text-emerald-700 dark:text-emerald-400',
  gaugeColor: '#10b981',
  subtext: '94 out of 100 on walkable street accessibility',
  highlights: ['48 amenities within 10-min walk', '98% continuous sidewalks', 'Pedestrian safety grade: A+'],
}

const defaultTransitScore: MobilityScore = {
  score: 82,
  maxScore: 100,
  label: 'Transit Score®',
  verdict: 'Excellent Transit',
  description: '6 nearby bus & light rail routes',
  verdictClass: 'text-sky-700 dark:text-sky-400',
  gaugeColor: '#0ea5e9',
  subtext: '82 out of 100 on public transportation connectivity',
  highlights: ['Metro A Line station in 4 min', '5 frequent municipal bus routes', '18 min direct train to DTLA'],
}

const defaultBikeScore: MobilityScore = {
  score: 88,
  maxScore: 100,
  label: 'Bike Score®',
  verdict: 'Very Bikeable',
  description: 'Dedicated bike lanes and flat terrain',
  verdictClass: 'text-teal-700 dark:text-teal-400',
  gaugeColor: '#14b8a6',
  subtext: '88 out of 100 on cycling infrastructure & slope',
  highlights: ['14 miles of protected bike lanes', '<2% average street gradient', '3 bikeshare docks nearby'],
}

const defaultPois: PoiItem[] = [
  {
    id: 'poi-1',
    name: 'Metro A Line Station',
    category: 'transit',
    categoryLabel: 'Public Transit',
    distance: '0.2 mi',
    timeWalk: '4 min walk',
    badge: 'Light Rail',
    description: 'High-frequency light rail connecting Pasadena directly to Downtown LA and Long Beach.',
    address: 'Del Mar Ave & S Raymond Ave',
  },
  {
    id: 'poi-2',
    name: 'Pasadena Transit Bus Stop',
    category: 'transit',
    categoryLabel: 'Public Transit',
    distance: '0.1 mi',
    timeWalk: '2 min walk',
    badge: 'Local Transit',
    description: 'Direct routes 10 & 20 connecting South Lake District to Old Town & City Hall.',
    address: 'S Lake Ave & E Green St',
  },
  {
    id: 'poi-3',
    name: 'Memorial Park Station',
    category: 'transit',
    categoryLabel: 'Public Transit',
    distance: '0.5 mi',
    timeWalk: '10 min walk',
    badge: 'Light Rail',
    description: 'Alternative metro access with regional bus connection bays and bike lockups.',
    address: '125 E Holly St',
  },
  {
    id: 'poi-4',
    name: 'Blue Bottle Coffee',
    category: 'dining',
    categoryLabel: 'Dining & Coffee',
    distance: '0.1 mi',
    timeWalk: '2 min walk',
    rating: '4.8 ★',
    badge: 'Artisanal Cafe',
    description: 'Specialty pour-over coffee, single-origin espresso drinks, and fresh bakery pastries.',
    address: '60 S Lake Ave',
  },
  {
    id: 'poi-5',
    name: 'Whole Foods Market',
    category: 'dining',
    categoryLabel: 'Dining & Coffee',
    distance: '0.3 mi',
    timeWalk: '6 min walk',
    rating: '4.7 ★',
    badge: 'Organic Grocery',
    description: 'Full-service natural grocer with organic produce, prepared hot bar, and wellness center.',
    address: '3751 E Foothill Blvd / Arroyo Pkwy',
  },
  {
    id: 'poi-6',
    name: "Trader Joe's",
    category: 'dining',
    categoryLabel: 'Dining & Coffee',
    distance: '0.4 mi',
    timeWalk: '8 min walk',
    rating: '4.9 ★',
    badge: 'Grocery',
    description: 'Neighborhood market renowned for unique provisions, fresh bakery, and wine selection.',
    address: '610 S Lake Ave',
  },
  {
    id: 'poi-7',
    name: 'Urth Caffe Pasadena',
    category: 'dining',
    categoryLabel: 'Dining & Coffee',
    distance: '0.2 mi',
    timeWalk: '5 min walk',
    rating: '4.6 ★',
    badge: 'Organic Eatery',
    description: 'Vibrant indoor/outdoor patio serving farm-to-table organic breakfast, lunch, and matcha.',
    address: '594 E Colorado Blvd',
  },
  {
    id: 'poi-8',
    name: 'Pasadena High School',
    category: 'schools',
    categoryLabel: 'Schools & Education',
    distance: '0.6 mi',
    timeWalk: '12 min walk',
    rating: '9/10',
    badge: 'Public 9-12',
    description: 'Top-rated public high school with Law and Creative Arts academies and AP honors programs.',
    address: '2925 E Sierra Madre Blvd',
  },
  {
    id: 'poi-9',
    name: 'Caltech Campus',
    category: 'schools',
    categoryLabel: 'Schools & Education',
    distance: '0.8 mi',
    timeWalk: '15 min walk',
    rating: 'Top Tier',
    badge: 'Higher Education',
    description: 'World-renowned private science & engineering research university campus and open grounds.',
    address: '1200 E California Blvd',
  },
  {
    id: 'poi-10',
    name: 'McKinley Elementary School',
    category: 'schools',
    categoryLabel: 'Schools & Education',
    distance: '0.4 mi',
    timeWalk: '8 min walk',
    rating: '8/10',
    badge: 'Public K-8',
    description: 'STEAM-focused neighborhood magnet school with dual-language immersion track.',
    address: '325 S Oak Knoll Ave',
  },
  {
    id: 'poi-11',
    name: 'Central Park',
    category: 'parks',
    categoryLabel: 'Parks & Recreation',
    distance: '0.3 mi',
    timeWalk: '6 min walk',
    rating: '4.8 ★',
    badge: 'Public Park',
    description: 'Historic shaded park with rolling green lawns, dedicated dog park, and lawn bowling greens.',
    address: '275 S Raymond Ave',
  },
  {
    id: 'poi-12',
    name: 'Rose Bowl Aquatics Center',
    category: 'parks',
    categoryLabel: 'Parks & Recreation',
    distance: '1.4 mi',
    timeDrive: '5 min drive',
    rating: '4.9 ★',
    badge: 'Sports Complex',
    description: 'Twin Olympic 50-meter pools, fitness facilities, and adjacent Arroyo Seco running trails.',
    address: '360 N Arroyo Blvd',
  },
]

const defaultCommutes: CommuteDestination[] = [
  {
    id: 'commute-dtla',
    name: 'Downtown Los Angeles',
    region: 'Financial District & Union Station',
    distance: '10.4 mi',
    transitTime: 18,
    transitLabel: '18m by train',
    transitRoute: 'Metro A Line (Direct Express)',
    driveTime: 24,
    driveLabel: '24m by car',
    driveRoute: 'via CA-110 S Freeway',
    peakRushTime: '28-34m at 8:30 AM',
  },
  {
    id: 'commute-sm',
    name: 'Santa Monica',
    region: 'Silicon Beach & Pier',
    distance: '26.2 mi',
    transitTime: 62,
    transitLabel: '62m by train',
    transitRoute: 'Metro A Line → Metro E Line',
    driveTime: 45,
    driveLabel: '45m by car',
    driveRoute: 'via I-10 W / CA-110 S',
    peakRushTime: '55-68m at 8:30 AM',
  },
  {
    id: 'commute-burbank',
    name: 'Burbank Media District',
    region: 'Warner Bros & Disney Studios',
    distance: '12.1 mi',
    transitTime: 38,
    transitLabel: '38m by transit',
    transitRoute: 'Metro Bus 501 Rapid',
    driveTime: 22,
    driveLabel: '22m by car',
    driveRoute: 'via CA-134 W Express',
    peakRushTime: '26-32m at 8:30 AM',
  },
  {
    id: 'commute-century',
    name: 'Century City / Westwood',
    region: 'Fox Studios & UCLA Area',
    distance: '21.5 mi',
    transitTime: 54,
    transitLabel: '54m by transit',
    transitRoute: 'Commuter Express 423',
    driveTime: 38,
    driveLabel: '38m by car',
    driveRoute: 'via CA-134 W to I-405 S',
    peakRushTime: '48-58m at 8:30 AM',
  },
]

// Subject property (742 Evergreen Terrace, Pasadena) — map center, home marker,
// and the 15-minute walkshed circle all anchor here.
const HOME_CENTER: [number, number] = [-118.1445, 34.1478]
// ~15-minute pedestrian catchment (~1.2 km at typical walking speed).
const WALK_RADIUS_METERS = 1200

const defaultPoiCoords: Record<string, [number, number]> = {
  'poi-1': [-118.148, 34.141],
  'poi-2': [-118.132, 34.152],
  'poi-3': [-118.149, 34.148],
  'poi-4': [-118.133, 34.144],
  'poi-5': [-118.149, 34.135],
  'poi-6': [-118.132, 34.136],
  'poi-7': [-118.136, 34.146],
  'poi-8': [-118.125, 34.155],
  'poi-9': [-118.138, 34.138],
  'poi-10': [-118.148, 34.143],
  'poi-11': [-118.142, 34.133],
}

export function LeafletNeighborhoodWalkscoreCard({
  title = 'Neighborhood & Location Intelligence',
  address = '742 Evergreen Terrace, Pasadena, CA 91101',
  neighborhood = 'South Lake Commercial & Arts District',
  city = 'Pasadena',
  zipCode = '91101',
  walkScore = defaultWalkScore,
  transitScore = defaultTransitScore,
  bikeScore = defaultBikeScore,
  pois = defaultPois,
  commutes = defaultCommutes,
  className,
}: LeafletNeighborhoodWalkscoreCardProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<PoiCategoryType>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCommuteMode, setSelectedCommuteMode] = React.useState<CommuteMode>('all')
  const [isSaved, setIsSaved] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)

  const categoriesList = [
    { id: 'all' as const, label: 'All Places', count: pois.length },
    {
      id: 'transit' as const,
      label: 'Public Transit',
      count: pois.filter((p) => p.category === 'transit').length,
    },
    {
      id: 'dining' as const,
      label: 'Dining & Coffee',
      count: pois.filter((p) => p.category === 'dining').length,
    },
    {
      id: 'schools' as const,
      label: 'Schools & Education',
      count: pois.filter((p) => p.category === 'schools').length,
    },
    {
      id: 'parks' as const,
      label: 'Parks & Rec',
      count: pois.filter((p) => p.category === 'parks').length,
    },
  ]

  const filteredPois = React.useMemo(() => {
    return pois.filter((poi) => {
      const matchesCat = selectedCategory === 'all' || poi.category === selectedCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (poi.badge && poi.badge.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCat && matchesSearch
    })
  }, [pois, selectedCategory, searchQuery])

  const handleCopyAddress = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${address}, ${neighborhood}`)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }
  }

  // Circular gauge calculation helper (radius 38, perimeter ~238.76)
  const circumference = 2 * Math.PI * 38
  const getGaugeDashOffset = (score: number): number => {
    const clamped = Math.min(100, Math.max(0, score))
    return circumference - (clamped / 100) * circumference
  }

  const getPoiCoords = (poi: PoiItem): [number, number] => {
    if (poi.coords) return poi.coords
    return (
      defaultPoiCoords[poi.id] || [
        HOME_CENTER[0] + Math.sin(poi.name.length) * 0.008,
        HOME_CENTER[1] + Math.cos(poi.name.length) * 0.008,
      ]
    )
  }

  return (
    <div className={cn('w-full space-y-6', className)} data-slot="leaflet-neighborhood-walkscore-card">
      {/* Header Banner Card */}
      <Card className="border-border/80 bg-card text-card-foreground shadow-xs">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge wrap variant="outline" className="gap-1.5 font-medium">
                  <MapPin className="text-primary size-3.5" />
                  <span>
                    {city} · {zipCode}
                  </span>
                </Badge>
                <Badge wrap variant="success" className="gap-1 font-medium">
                  <Sparkles className="size-3.5" />
                  <span>Walker's Paradise</span>
                </Badge>
                <Badge wrap variant="secondary" className="font-medium">
                  Urban Transit Hub
                </Badge>
              </div>

              {/* Title & Address */}
              <div>
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
                <p className="text-foreground mt-1 text-sm font-semibold sm:text-base">{address}</p>
                <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                  Neighborhood: <span className="text-foreground font-medium">{neighborhood}</span>
                </p>
              </div>
            </div>

            {/* Top Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium shadow-xs"
                onClick={handleCopyAddress}
              >
                {isCopied ? (
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Share2 className="size-3.5" />
                )}
                <span>{isCopied ? 'Address Copied' : 'Share Location'}</span>
              </Button>

              <Button
                variant={isSaved ? 'default' : 'outline'}
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium shadow-xs"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark className={cn('size-3.5', isSaved && 'fill-current')} />
                <span>{isSaved ? 'Saved Neighborhood' : 'Save Area'}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Section 1: 3 Primary Mobility Score Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Card 1: Walk Score */}
        <Card className="border-border/80 bg-card text-card-foreground shadow-xs transition-colors hover:border-emerald-500/40">
          <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Footprints className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{walkScore.label}</CardTitle>
                  <CardDescription className="text-xs">Pedestrian Index</CardDescription>
                </div>
              </div>
              <Badge wrap variant="success" className="text-xs font-semibold">
                {walkScore.score}/100
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-4 pt-2 sm:p-5 sm:pt-2">
            {/* Circular Gauge & Score Verdict */}
            <div className="flex items-center gap-4 pt-1">
              <div className="relative flex size-20 shrink-0 items-center justify-center">
                <svg className="size-20 -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="7"
                    className="text-muted/40"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    fill="none"
                    stroke={walkScore.gaugeColor}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={getGaugeDashOffset(walkScore.score)}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-foreground font-mono text-xl font-bold tracking-tight tabular-nums">
                    {walkScore.score}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">/ 100</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-foreground text-sm font-bold tracking-tight">{walkScore.verdict}</div>
                <p className="text-xs leading-relaxed font-semibold text-emerald-700 dark:text-emerald-400">
                  {walkScore.description}
                </p>
              </div>
            </div>

            <Separator className="bg-border/60" />

            {/* Key Highlights */}
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Mobility Highlights</p>
              <ul className="space-y-1 text-xs">
                {walkScore.highlights.map((item, idx) => (
                  <li key={idx} className="text-foreground flex items-center gap-2">
                    <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Transit Score */}
        <Card className="border-border/80 bg-card text-card-foreground shadow-xs transition-colors hover:border-sky-500/40">
          <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Bus className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{transitScore.label}</CardTitle>
                  <CardDescription className="text-xs">Transit Connectivity</CardDescription>
                </div>
              </div>
              <Badge wrap variant="info" className="text-xs font-semibold">
                {transitScore.score}/100
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-4 pt-2 sm:p-5 sm:pt-2">
            {/* Circular Gauge & Score Verdict */}
            <div className="flex items-center gap-4 pt-1">
              <div className="relative flex size-20 shrink-0 items-center justify-center">
                <svg className="size-20 -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="7"
                    className="text-muted/40"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    fill="none"
                    stroke={transitScore.gaugeColor}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={getGaugeDashOffset(transitScore.score)}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-foreground font-mono text-xl font-bold tracking-tight tabular-nums">
                    {transitScore.score}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">/ 100</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-foreground text-sm font-bold tracking-tight">{transitScore.verdict}</div>
                <p className="text-xs leading-relaxed font-semibold text-sky-700 dark:text-sky-400">
                  {transitScore.description}
                </p>
              </div>
            </div>

            <Separator className="bg-border/60" />

            {/* Key Highlights */}
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Transit Highlights</p>
              <ul className="space-y-1 text-xs">
                {transitScore.highlights.map((item, idx) => (
                  <li key={idx} className="text-foreground flex items-center gap-2">
                    <Check className="size-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Bike Score */}
        <Card className="border-border/80 bg-card text-card-foreground shadow-xs transition-colors hover:border-teal-500/40">
          <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Bike className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{bikeScore.label}</CardTitle>
                  <CardDescription className="text-xs">Cycling Grid</CardDescription>
                </div>
              </div>
              <Badge wrap variant="outline" className="text-xs font-semibold">
                {bikeScore.score}/100
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-4 pt-2 sm:p-5 sm:pt-2">
            {/* Circular Gauge & Score Verdict */}
            <div className="flex items-center gap-4 pt-1">
              <div className="relative flex size-20 shrink-0 items-center justify-center">
                <svg className="size-20 -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="7"
                    className="text-muted/40"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    fill="none"
                    stroke={bikeScore.gaugeColor}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={getGaugeDashOffset(bikeScore.score)}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-foreground font-mono text-xl font-bold tracking-tight tabular-nums">
                    {bikeScore.score}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">/ 100</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-foreground text-sm font-bold tracking-tight">{bikeScore.verdict}</div>
                <p className="text-xs leading-relaxed font-semibold text-teal-700 dark:text-teal-400">
                  {bikeScore.description}
                </p>
              </div>
            </div>

            <Separator className="bg-border/60" />

            {/* Key Highlights */}
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Cycling Highlights</p>
              <ul className="space-y-1 text-xs">
                {bikeScore.highlights.map((item, idx) => (
                  <li key={idx} className="text-foreground flex items-center gap-2">
                    <Check className="size-3.5 shrink-0 text-teal-600 dark:text-teal-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Commute Time Estimator */}
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-foreground text-sm font-semibold tracking-tight">Commute Time Estimator</h2>
            <p className="text-muted-foreground text-xs">
              Estimated travel duration from 742 Evergreen Terrace to key employment & lifestyle hubs.
            </p>
          </div>

          {/* Mode selector filters */}
          <div className="border-border/80 bg-muted/40 flex items-center rounded-lg border p-1 text-xs">
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring rounded-md px-2.5 py-1 font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                selectedCommuteMode === 'all'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setSelectedCommuteMode('all')}
            >
              All Modes
            </button>
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                selectedCommuteMode === 'transit'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setSelectedCommuteMode('transit')}
            >
              <Train className="size-3" />
              <span>Transit</span>
            </button>
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                selectedCommuteMode === 'drive'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setSelectedCommuteMode('drive')}
            >
              <Car className="size-3" />
              <span>Driving</span>
            </button>
          </div>
        </div>

        <Card className="border-border/80 bg-card text-card-foreground overflow-hidden shadow-xs">
          <div className="divide-border/60 divide-y">
            {commutes.map((commute) => (
              <div key={commute.id} className="hover:bg-muted/15 p-4 transition-colors sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  {/* Destination Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-foreground text-sm font-semibold">{commute.name}</h3>
                      <span className="text-muted-foreground font-mono text-xs tabular-nums">· {commute.distance}</span>
                    </div>
                    <p className="text-muted-foreground text-xs">{commute.region}</p>
                  </div>

                  {/* Time Badges & Routes */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Transit Mode Pill */}
                    {(selectedCommuteMode === 'all' || selectedCommuteMode === 'transit') && (
                      <div className="flex items-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs">
                        <Train className="size-3.5 text-sky-600 dark:text-sky-400" />
                        <div>
                          <span className="text-foreground font-mono font-semibold tabular-nums">
                            {commute.transitLabel}
                          </span>
                          <span className="text-muted-foreground hidden sm:inline"> — {commute.transitRoute}</span>
                        </div>
                      </div>
                    )}

                    {/* Drive Mode Pill */}
                    {(selectedCommuteMode === 'all' || selectedCommuteMode === 'drive') && (
                      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs">
                        <Car className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <span className="text-foreground font-mono font-semibold tabular-nums">
                            {commute.driveLabel}
                          </span>
                          <span className="text-muted-foreground hidden sm:inline"> — {commute.driveRoute}</span>
                        </div>
                      </div>
                    )}

                    {/* Peak Rush Info */}
                    {commute.peakRushTime && (
                      <div className="text-muted-foreground flex items-center gap-1 font-mono text-xs tabular-nums">
                        <Clock className="text-muted-foreground size-3" />
                        <span>Rush: {commute.peakRushTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visual Progress Bar for Comparative Duration */}
                <div className="mt-3 grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                  {(selectedCommuteMode === 'all' || selectedCommuteMode === 'transit') && (
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span>Transit Duration</span>
                        <span className="font-mono tabular-nums">{commute.transitTime} min</span>
                      </div>
                      <Progress value={Math.min(100, (commute.transitTime / 70) * 100)} className="bg-muted h-1.5" />
                    </div>
                  )}

                  {(selectedCommuteMode === 'all' || selectedCommuteMode === 'drive') && (
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span>Driving Duration</span>
                        <span className="font-mono tabular-nums">{commute.driveTime} min</span>
                      </div>
                      <Progress value={Math.min(100, (commute.driveTime / 70) * 100)} className="bg-muted h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Section 3: Nearby Points of Interest Categorized List */}
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-foreground text-sm font-semibold tracking-tight">Nearby Points of Interest</h2>
            <p className="text-muted-foreground text-xs">
              Key transit hubs, dining, specialty cafes, schools, and parks located within walking distance.
            </p>
          </div>

          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Navigation className="text-primary size-3.5" />
            <span className="font-mono tabular-nums">{pois.length} verified local venues</span>
          </div>
        </div>

        {/* Controls: Category Filter Tabs & Search Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={cn(
                  'focus-visible:ring-ring rounded-md border px-3 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                  selectedCategory === cat.id
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
                <span
                  className={cn(
                    'ml-1 font-mono tabular-nums',
                    selectedCategory === cat.id ? 'opacity-80' : 'text-muted-foreground',
                  )}
                >
                  ({cat.count})
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground pointer-events-none absolute top-2.5 left-2.5 size-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search venue or street..."
              className="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border pr-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </div>

        {/* Interactive 15-Minute Walkshed & POI Map */}
        <Card className="overflow-hidden">
          <CardHeader className="border-border/70 border-b p-4 pb-3 sm:p-5 sm:pb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Navigation className="size-4 text-emerald-500" />
                  <span>15-Minute Walkshed & Amenity Locator</span>
                </CardTitle>
                <CardDescription>
                  Free OpenStreetMap/Esri basemap — no API key — with a 15-minute walk radius and categorized local
                  destinations.
                </CardDescription>
              </div>
              <Badge wrap variant="outline" className="w-fit gap-1 font-mono text-xs">
                <Footprints className="size-3 text-emerald-500" />
                <span>98 Walk Score Paradise</span>
              </Badge>
            </div>
          </CardHeader>
          <div className="relative h-72 w-full sm:h-96">
            <LeafletMap variant="light" center={HOME_CENTER} zoom={14} className="size-full">
              {/* 15-min Walk Radius Circle */}
              <LeafletCircle
                center={HOME_CENTER}
                radius={WALK_RADIUS_METERS}
                color="#10b981"
                weight={1.5}
                opacity={0.6}
                dashArray="4 4"
                fill
                fillColor="#10b981"
                fillOpacity={0.12}
              />

              {/* Home Property Marker */}
              <LeafletMarker lngLat={HOME_CENTER} anchor="center" zIndexOffset={30}>
                <div className="relative flex size-9 items-center justify-center">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-60" />
                  <div className="relative flex size-7 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-white shadow-lg">
                    <MapPin className="size-4" />
                  </div>
                </div>
              </LeafletMarker>

              {/* Filtered POI Markers */}
              {filteredPois.map((poi) => (
                <LeafletMarker key={poi.id} lngLat={getPoiCoords(poi)} anchor="center">
                  <div
                    className="border-background bg-background flex size-7 cursor-pointer items-center justify-center rounded-full border-2 shadow-md transition-transform select-none hover:scale-125"
                    title={poi.name}
                  >
                    {poi.category === 'dining' ? (
                      <Coffee className="size-3.5 text-amber-500" />
                    ) : poi.category === 'transit' ? (
                      <Train className="size-3.5 text-sky-500" />
                    ) : poi.category === 'schools' ? (
                      <School className="size-3.5 text-indigo-500" />
                    ) : (
                      <TreePine className="size-3.5 text-emerald-500" />
                    )}
                  </div>
                </LeafletMarker>
              ))}
            </LeafletMap>
          </div>
        </Card>

        {/* POIs Grid */}
        {filteredPois.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredPois.map((poi) => (
              <Card
                key={poi.id}
                className="border-border/80 bg-card text-card-foreground hover:border-border transition-all hover:shadow-xs"
              >
                <CardContent className="p-4 sm:p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon Box based on category */}
                    <div
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-lg border',
                        poi.category === 'transit'
                          ? 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          : poi.category === 'dining'
                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : poi.category === 'schools'
                              ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                      )}
                    >
                      {poi.category === 'transit' && poi.badge === 'Light Rail' ? (
                        <Train className="size-4" />
                      ) : poi.category === 'transit' ? (
                        <Bus className="size-4" />
                      ) : poi.category === 'dining' && poi.name.includes('Coffee') ? (
                        <Coffee className="size-4" />
                      ) : poi.category === 'dining' ? (
                        <UtensilsCrossed className="size-4" />
                      ) : poi.category === 'schools' && poi.name.includes('Caltech') ? (
                        <GraduationCap className="size-4" />
                      ) : poi.category === 'schools' ? (
                        <School className="size-4" />
                      ) : (
                        <TreePine className="size-4" />
                      )}
                    </div>

                    {/* Main POI Details */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-foreground truncate text-sm font-semibold">{poi.name}</h3>

                        {/* Distance / Walk Time Pill */}
                        <div className="bg-muted/70 text-foreground border-border/60 shrink-0 rounded-md border px-2 py-0.5 font-mono text-xs font-medium tabular-nums">
                          <span>{poi.distance}</span>
                          {poi.timeWalk && <span className="text-muted-foreground"> · {poi.timeWalk}</span>}
                          {poi.timeDrive && <span className="text-muted-foreground"> · {poi.timeDrive}</span>}
                        </div>
                      </div>

                      <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">{poi.description}</p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 text-xs">
                        <span className="text-muted-foreground truncate">{poi.address}</span>
                        <div className="flex items-center gap-1.5">
                          {poi.rating && (
                            <Badge wrap variant="secondary" className="font-mono text-xs font-semibold tabular-nums">
                              {poi.rating}
                            </Badge>
                          )}
                          {poi.badge && (
                            <Badge wrap variant="outline" className="text-xs">
                              {poi.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State when filter yields nothing */
          <Card className="border-border/80 bg-card text-card-foreground p-8 text-center shadow-xs">
            <div className="mx-auto flex max-w-sm flex-col items-center justify-center space-y-2">
              <Search className="text-muted-foreground size-8" />
              <p className="text-foreground text-sm font-semibold">No points of interest match "{searchQuery}"</p>
              <p className="text-muted-foreground text-xs">
                Try searching for other amenities like "coffee", "market", "school", or clear the filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Section 4: Quick Neighborhood Summary Footnote */}
      <Card className="border-border/80 bg-muted/25 text-card-foreground p-4 shadow-xs sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-foreground text-xs font-semibold">Official Location Score Intelligence Verification</p>
            </div>
            <p className="text-muted-foreground text-xs">
              Calculated based on standard 15-minute pedestrian catchment models, municipal route timetables, and GIS
              road grades.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium shadow-xs"
              onClick={handleCopyAddress}
            >
              <ArrowUpRight className="size-3.5" />
              <span>Open in Maps</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default LeafletNeighborhoodWalkscoreCard
