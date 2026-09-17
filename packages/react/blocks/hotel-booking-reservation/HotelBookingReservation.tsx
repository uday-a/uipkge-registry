'use client'

import * as React from 'react'
import {
  Bath,
  BedDouble,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  Coffee,
  CreditCard,
  Heart,
  Info,
  Lock,
  MapPin,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Baby,
  Waves,
  Wifi,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export interface HotelBookingReservationProps {
  className?: string
  roomTitle?: string
  hotelName?: string
  location?: string
  rating?: number
  reviewsCount?: number
  basePrice?: number
  initialCheckIn?: string
  initialCheckOut?: string
  initialAdults?: number
  initialChildren?: number
  initialRooms?: number
}

const roomPhotos = [
  {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
    title: 'King Master Suite & Ocean Balcony',
  },
  {
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
    title: 'Atlantic Ocean Sunrise Balcony',
  },
  {
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    title: 'Italian Marble Spa Bathroom',
  },
  {
    url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80',
    title: 'Private Beach Club & Ocean Cabanas',
  },
]

export function HotelBookingReservation({
  className,
  roomTitle = 'Deluxe Ocean View King Suite',
  hotelName = 'The Ritz-Carlton Bal Harbour, Miami',
  location = 'Bal Harbour, Miami Beach, FL',
  rating = 5.0,
  reviewsCount = 120,
  basePrice = 485,
  initialCheckIn = '2026-08-24',
  initialCheckOut = '2026-08-29',
  initialAdults = 2,
  initialChildren = 1,
  initialRooms = 1,
}: HotelBookingReservationProps) {
  const [checkInDate, setCheckInDate] = React.useState(initialCheckIn)
  const [checkOutDate, setCheckOutDate] = React.useState(initialCheckOut)
  const [adults, setAdults] = React.useState(initialAdults)
  const [children, setChildren] = React.useState(initialChildren)
  const [rooms, setRooms] = React.useState(initialRooms)
  const [specialRequests, setSpecialRequests] = React.useState('')
  const [isBooked, setIsBooked] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const [activePhotoIndex, setActivePhotoIndex] = React.useState(0)

  // Upgrades state: Oceanfront balcony and Daily Breakfast are checked by default
  const [selectedUpgrades, setSelectedUpgrades] = React.useState<string[]>(['balcony', 'breakfast'])
  const [breakfastGuests, setBreakfastGuests] = React.useState(1)

  function toggleUpgrade(id: string) {
    setSelectedUpgrades((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Date calculations
  const nights = React.useMemo(() => {
    if (!checkInDate || !checkOutDate) return 5
    const start = new Date(checkInDate).getTime()
    const end = new Date(checkOutDate).getTime()
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 1
  }, [checkInDate, checkOutDate])

  function setDuration(presetNights: number) {
    if (!checkInDate) return
    const start = new Date(checkInDate + 'T00:00:00')
    start.setDate(start.getDate() + presetNights)
    const y = start.getFullYear()
    const m = String(start.getMonth() + 1).padStart(2, '0')
    const d = String(start.getDate()).padStart(2, '0')
    setCheckOutDate(`${y}-${m}-${d}`)
  }

  function formatDateDisplay(dateStr: string) {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-').map(Number)
    if (!year || !month || !day) return dateStr
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formattedRange = React.useMemo(() => {
    return `${formatDateDisplay(checkInDate)} → ${formatDateDisplay(checkOutDate)} · ${nights} ${nights === 1 ? 'Night' : 'Nights'}`
  }, [checkInDate, checkOutDate, nights])

  const cancellationDeadline = React.useMemo(() => {
    if (!checkInDate) return '48 hours prior to arrival'
    const start = new Date(checkInDate + 'T00:00:00')
    start.setDate(start.getDate() - 2)
    const y = start.getFullYear()
    const m = String(start.getMonth() + 1).padStart(2, '0')
    const d = String(start.getDate()).padStart(2, '0')
    return formatDateDisplay(`${y}-${m}-${d}`)
  }, [checkInDate])

  // Financial calculations
  const roomSubtotal = basePrice * nights * rooms
  const balconyCost = selectedUpgrades.includes('balcony') ? 50 * nights * rooms : 0
  const breakfastCost = selectedUpgrades.includes('breakfast') ? 35 * breakfastGuests * nights : 0
  const chauffeurCost = selectedUpgrades.includes('chauffeur') ? 120 : 0
  const spaCost = selectedUpgrades.includes('spa') ? 65 * adults : 0
  const selectedAddonsTotal = balconyCost + breakfastCost + chauffeurCost + spaCost
  const resortFee = 30 * nights * rooms
  const taxableSubtotal = roomSubtotal + selectedAddonsTotal + resortFee
  const estimatedTaxes = Math.round(taxableSubtotal * 0.14 * 100) / 100
  const totalStayPrice = taxableSubtotal + estimatedTaxes

  function formatCurrency(val: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val)
  }

  // Stepper modifiers
  function updateAdults(delta: number) {
    setAdults((prev) => {
      const next = prev + delta
      if (next >= 1 && next <= 8) {
        if (breakfastGuests > next) {
          setBreakfastGuests(next)
        }
        return next
      }
      return prev
    })
  }

  function updateChildren(delta: number) {
    setChildren((prev) => {
      const next = prev + delta
      if (next >= 0 && next <= 6) return next
      return prev
    })
  }

  function updateRooms(delta: number) {
    setRooms((prev) => {
      const next = prev + delta
      if (next >= 1 && next <= 4) return next
      return prev
    })
  }

  return (
    <div
      data-slot="hotel-booking-reservation"
      className={cn('mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8', className)}
    >
      {/* Confirmation Banner (Visible when booked) */}
      {isBooked && (
        <div className="relative flex flex-col gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 sm:flex-row sm:items-center sm:justify-between dark:bg-emerald-500/15">
          <div className="flex flex-wrap items-start gap-3.5">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-foreground text-base font-semibold">
                  Reservation Confirmed · Reference #RC-884920
                </h3>
                <Badge
                  wrap
                  variant="outline"
                  className="border-emerald-500/40 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  Guaranteed Direct
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                A confirmation voucher and check-in barcode have been sent to your registered email. No cancellation
                penalty applies before {cancellationDeadline}.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 font-medium" onClick={() => setIsBooked(false)}>
            <RotateCcw className="size-3.5" />
            Modify Reservation
          </Button>
        </div>
      )}

      {/* Room Hero Header Card */}
      <Card className="border-border overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-12 lg:gap-8">
          {/* Room Photo Showcase */}
          <div className="space-y-3 lg:col-span-6">
            <div className="border-border bg-muted/40 relative aspect-16/10 w-full overflow-hidden rounded-xl border">
              <img
                src={roomPhotos[activePhotoIndex]?.url}
                alt={roomPhotos[activePhotoIndex]?.title}
                className="size-full object-cover transition-all duration-300"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <Badge
                  wrap
                  variant="secondary"
                  className="bg-background/90 text-foreground text-xs font-medium backdrop-blur-xs"
                >
                  Oceanfront View
                </Badge>
                <Badge
                  wrap
                  variant="outline"
                  className="bg-background/80 text-foreground border-white/20 text-xs backdrop-blur-xs"
                >
                  Floor 16
                </Badge>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Save to favorites"
                  className="bg-background/80 hover:bg-background text-foreground flex size-8 items-center justify-center rounded-full backdrop-blur-xs transition-colors"
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Heart
                    className={cn(
                      'size-4 transition-colors',
                      isSaved ? 'fill-red-500 text-red-500' : 'text-foreground',
                    )}
                  />
                </button>
                <button
                  type="button"
                  aria-label="Share suite"
                  className="bg-background/80 hover:bg-background text-foreground flex size-8 items-center justify-center rounded-full backdrop-blur-xs transition-colors"
                >
                  <Share2 className="size-4" />
                </button>
              </div>
              <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between text-xs text-white">
                <span className="font-medium drop-shadow-xs">{roomPhotos[activePhotoIndex]?.title}</span>
                <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-xs backdrop-blur-xs">
                  {activePhotoIndex + 1} / {roomPhotos.length}
                </span>
              </div>
            </div>

            {/* Mini Thumbnail Selector */}
            <div className="grid grid-cols-4 gap-2">
              {roomPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={photo.title}
                  className={cn(
                    'border-border relative aspect-16/10 overflow-hidden rounded-lg border transition-all',
                    activePhotoIndex === idx ? 'ring-primary border-primary ring-2' : 'opacity-70 hover:opacity-100',
                  )}
                  onClick={() => setActivePhotoIndex(idx)}
                >
                  <img src={photo.url} alt={photo.title} className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Room Meta & Overview Information */}
          <div className="flex flex-col justify-between space-y-4 lg:col-span-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                  <Star className="size-4 fill-amber-500 text-amber-500" />
                  <span className="font-bold tabular-nums">{rating.toFixed(1)}</span>
                  <span className="text-muted-foreground underline underline-offset-2">
                    {reviewsCount} verified guest reviews
                  </span>
                </div>
                <Badge
                  wrap
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-primary text-xs font-medium"
                >
                  Official Best Rate Guarantee
                </Badge>
              </div>

              <div className="space-y-1">
                <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{roomTitle}</h1>
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm">
                  <Building2 className="text-primary size-4 shrink-0" />
                  <span className="text-foreground font-medium">{hotelName}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <MapPin className="size-3.5 shrink-0" />
                  <span>{location}</span>
                </div>
              </div>

              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Expansive oceanfront sanctuary featuring custom King pillowtop bedding, floor-to-ceiling glass doors
                opening onto an oversized private balcony with sweeping Atlantic panoramas, freestanding soaking tub,
                and bespoke in-room dining.
              </p>

              {/* Room Key Amenities Grid */}
              <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2 md:grid-cols-3">
                <div className="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                  <Maximize2 className="text-muted-foreground size-3.5 shrink-0" />
                  <span className="text-foreground font-medium">680 sq ft / 63 m²</span>
                </div>
                <div className="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                  <BedDouble className="text-muted-foreground size-3.5 shrink-0" />
                  <span className="text-foreground font-medium">1 King Bed</span>
                </div>
                <div className="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                  <Waves className="text-muted-foreground size-3.5 shrink-0" />
                  <span className="text-foreground font-medium">Ocean Balcony</span>
                </div>
                <div className="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                  <Bath className="text-muted-foreground size-3.5 shrink-0" />
                  <span className="text-foreground font-medium">Marble Soaking Tub</span>
                </div>
                <div className="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                  <Wifi className="text-muted-foreground size-3.5 shrink-0" />
                  <span className="text-foreground font-medium">Fast Fiber WiFi</span>
                </div>
                <div className="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                  <Coffee className="text-muted-foreground size-3.5 shrink-0" />
                  <span className="text-foreground font-medium">Nespresso Machine</span>
                </div>
              </div>
            </div>

            <div className="border-border/80 bg-muted/30 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5 sm:p-4">
              <div>
                <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                  Direct Member Rate
                </span>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                    {formatCurrency(basePrice)}
                  </span>
                  <span className="text-muted-foreground text-xs font-normal sm:text-sm">/ night</span>
                  <span className="text-muted-foreground text-xs tabular-nums line-through sm:text-sm">$560.00</span>
                </div>
              </div>
              <Badge
                wrap
                variant="secondary"
                className="border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                Save 13% Direct
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive 2-Column Booking Configuration & Price Breakdown Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Reservation Inputs, Guests & Upgrades */}
        <div className="space-y-6 lg:col-span-7">
          {/* Stay Dates Selection */}
          <Card className="shadow-xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <CardTitle className="text-lg">Stay Dates &amp; Duration</CardTitle>
                  <CardDescription>
                    Select your check-in and check-out dates to calculate live availability.
                  </CardDescription>
                </div>
                <Badge wrap variant="outline" className="gap-1 text-xs font-medium">
                  <CalendarDays className="text-primary size-3.5" />
                  {nights} {nights === 1 ? 'Night' : 'Nights'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Date Inputs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="check-in-date"
                    className="text-foreground flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Calendar className="text-primary size-3.5" />
                    Check-in Date (3:00 PM)
                  </label>
                  <Input
                    id="check-in-date"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="check-out-date"
                    className="text-foreground flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Calendar className="text-primary size-3.5" />
                    Check-out Date (12:00 PM)
                  </label>
                  <Input
                    id="check-out-date"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Stay Summary Highlight & Quick Length Presets */}
              <div className="border-border/60 bg-muted/30 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-foreground text-xs font-medium">
                  <span className="text-muted-foreground">Selected Stay: </span>
                  <span className="font-semibold">{formattedRange}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-muted-foreground mr-1 text-xs">Quick:</span>
                  {[3, 5, 7, 10].map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="xs"
                      className={
                        nights === preset ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' : ''
                      }
                      onClick={() => setDuration(preset)}
                    >
                      {preset}N
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guests & Rooms Steppers */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg">Guests &amp; Rooms</CardTitle>
              <CardDescription>Configure the number of adults, children, and suites requested.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Adults Stepper */}
              <div className="border-border/60 flex flex-wrap items-center justify-between rounded-lg border p-3.5">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary border-primary/20 flex size-9 shrink-0 items-center justify-center rounded-lg border">
                    <Users className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-foreground text-sm font-medium">Adults</span>
                    <p className="text-muted-foreground text-xs">Ages 13 and above</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={adults <= 1}
                    aria-label="Decrease adults"
                    onClick={() => updateAdults(-1)}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="text-foreground w-6 text-center text-sm font-bold tabular-nums">{adults}</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={adults >= 8}
                    aria-label="Increase adults"
                    onClick={() => updateAdults(1)}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Children Stepper */}
              <div className="border-border/60 flex flex-wrap items-center justify-between rounded-lg border p-3.5">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary border-primary/20 flex size-9 shrink-0 items-center justify-center rounded-lg border">
                    <Baby className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-foreground text-sm font-medium">Children</span>
                    <p className="text-muted-foreground text-xs">Ages 0 to 12 years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={children <= 0}
                    aria-label="Decrease children"
                    onClick={() => updateChildren(-1)}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="text-foreground w-6 text-center text-sm font-bold tabular-nums">{children}</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={children >= 6}
                    aria-label="Increase children"
                    onClick={() => updateChildren(1)}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Rooms Stepper */}
              <div className="border-border/60 flex flex-wrap items-center justify-between rounded-lg border p-3.5">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary border-primary/20 flex size-9 shrink-0 items-center justify-center rounded-lg border">
                    <BedDouble className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-foreground text-sm font-medium">Suites / Rooms</span>
                    <p className="text-muted-foreground text-xs">Max 4 guests per suite</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={rooms <= 1}
                    aria-label="Decrease rooms"
                    onClick={() => updateRooms(-1)}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="text-foreground w-6 text-center text-sm font-bold tabular-nums">{rooms}</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={rooms >= 4}
                    aria-label="Increase rooms"
                    onClick={() => updateRooms(1)}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Upgrades & Add-ons */}
          <Card className="shadow-xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <CardTitle className="text-lg">Room Upgrades &amp; Exclusive Services</CardTitle>
                  <CardDescription>
                    Tailor your stay with luxury amenities and curated hotel enhancements.
                  </CardDescription>
                </div>
                <Badge wrap variant="secondary" className="text-xs">
                  {selectedUpgrades.length} Selected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Upgrade 1: Oceanfront Balcony */}
              <div
                role="button"
                tabIndex={0}
                className={cn(
                  'border-border focus-visible:ring-ring flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition-all select-none focus-visible:ring-2 focus-visible:outline-none',
                  selectedUpgrades.includes('balcony')
                    ? 'border-primary/40 bg-primary/5 shadow-xs'
                    : 'bg-card hover:border-border/80 opacity-80 hover:opacity-100',
                )}
                onClick={() => toggleUpgrade('balcony')}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault()
                    toggleUpgrade('balcony')
                  }
                }}
              >
                <div className="flex flex-wrap items-start gap-3.5">
                  <Checkbox
                    id="upgrade-balcony"
                    checked={selectedUpgrades.includes('balcony')}
                    className="pointer-events-none mt-1"
                    tabIndex={-1}
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-foreground text-sm font-semibold">Oceanfront High-Floor Balcony</span>
                      <Badge wrap variant="outline" className="text-xs font-medium">
                        +$50 / night
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Guaranteed unobstructed 180° Atlantic Ocean sunrise view on floors 15+ with premium teak deck
                      loungers.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-foreground text-sm font-bold tabular-nums">
                    +{formatCurrency(50 * nights * rooms)}
                  </span>
                  <span className="text-muted-foreground block text-xs">for {nights} nights</span>
                </div>
              </div>

              {/* Upgrade 2: Gourmet Breakfast */}
              <div
                role="button"
                tabIndex={0}
                className={cn(
                  'border-border focus-visible:ring-ring flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition-all select-none focus-visible:ring-2 focus-visible:outline-none',
                  selectedUpgrades.includes('breakfast')
                    ? 'border-primary/40 bg-primary/5 shadow-xs'
                    : 'bg-card hover:border-border/80 opacity-80 hover:opacity-100',
                )}
                onClick={() => toggleUpgrade('breakfast')}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault()
                    toggleUpgrade('breakfast')
                  }
                }}
              >
                <div className="flex flex-wrap items-start gap-3.5">
                  <Checkbox
                    id="upgrade-breakfast"
                    checked={selectedUpgrades.includes('breakfast')}
                    className="pointer-events-none mt-1"
                    tabIndex={-1}
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-foreground text-sm font-semibold">Daily Gourmet Breakfast</span>
                      <Badge wrap variant="outline" className="text-xs font-medium">
                        +$35 / person / day
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Artisanal morning buffet at Artisan Beach House or private veranda in-room breakfast with fresh
                      juices.
                    </p>
                    {/* Guest selection when active */}
                    {selectedUpgrades.includes('breakfast') && (
                      <div
                        className="flex flex-wrap items-center gap-2 pt-1.5 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-muted-foreground">Breakfast plan for:</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[1, 2].map((count) => (
                            <Button
                              key={count}
                              variant="outline"
                              size="xs"
                              className={
                                breakfastGuests === count ? 'bg-primary text-primary-foreground border-primary' : ''
                              }
                              onClick={() => setBreakfastGuests(count)}
                            >
                              {count} {count === 1 ? 'Guest' : 'Guests'}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-foreground text-sm font-bold tabular-nums">
                    +{formatCurrency(35 * breakfastGuests * nights)}
                  </span>
                  <span className="text-muted-foreground block text-xs">
                    {breakfastGuests} {breakfastGuests === 1 ? 'guest' : 'guests'} · {nights}d
                  </span>
                </div>
              </div>

              {/* Upgrade 3: Airport Chauffeur */}
              <div
                role="button"
                tabIndex={0}
                className={cn(
                  'border-border focus-visible:ring-ring flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition-all select-none focus-visible:ring-2 focus-visible:outline-none',
                  selectedUpgrades.includes('chauffeur')
                    ? 'border-primary/40 bg-primary/5 shadow-xs'
                    : 'bg-card hover:border-border/80 opacity-80 hover:opacity-100',
                )}
                onClick={() => toggleUpgrade('chauffeur')}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault()
                    toggleUpgrade('chauffeur')
                  }
                }}
              >
                <div className="flex flex-wrap items-start gap-3.5">
                  <Checkbox
                    id="upgrade-chauffeur"
                    checked={selectedUpgrades.includes('chauffeur')}
                    className="pointer-events-none mt-1"
                    tabIndex={-1}
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-foreground text-sm font-semibold">Private Airport Luxury Chauffeur</span>
                      <Badge wrap variant="outline" className="text-xs font-medium">
                        +$120 one-time
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Curbside meet-and-greet with dedicated Cadillac Escalade or Mercedes S-Class transfer from MIA or
                      FLL.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-foreground text-sm font-bold tabular-nums">+$120.00</span>
                  <span className="text-muted-foreground block text-xs">flat one-time</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Requests Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Special Requests &amp; Arrival Notes</CardTitle>
              <CardDescription>
                Let us know if you are celebrating a special occasion or require early check-in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                id="special-requests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g., Honeymoon celebration, feather-free bedding, quiet high floor..."
                maxLength={200}
                showCount
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Total Price Breakdown & Checkout Card (Sticky) */}
        <div className="lg:sticky lg:top-8 lg:col-span-5">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Stay Price Breakdown
                </span>
                <Badge
                  wrap
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 gap-1 text-xs font-medium"
                >
                  <Sparkles className="size-3" />
                  Instant Confirmation
                </Badge>
              </div>

              <div className="mt-3 space-y-1">
                <div className="text-muted-foreground text-xs">Total Stay Price (USD)</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                    {formatCurrency(totalStayPrice)}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Total for <span className="text-foreground font-medium">{nights} nights</span> · {rooms} suite ·{' '}
                  {adults + children} guests
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              {/* Itemized Pricing Breakdown */}
              <div className="space-y-2.5">
                {/* Base Room Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Room subtotal ({formatCurrency(basePrice)} × {nights} {nights === 1 ? 'night' : 'nights'}
                    {rooms > 1 ? ` × ${rooms} rooms` : ''})
                  </span>
                  <span className="text-foreground font-semibold tabular-nums">{formatCurrency(roomSubtotal)}</span>
                </div>

                {/* Selected Add-ons summary / itemized */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Selected Add-ons ({selectedUpgrades.length} active)</span>
                    <span className="text-foreground font-semibold tabular-nums">
                      {formatCurrency(selectedAddonsTotal)}
                    </span>
                  </div>

                  {/* Addon sub-items */}
                  {selectedUpgrades.length > 0 && (
                    <div className="border-border/60 bg-muted/20 space-y-1 rounded-md border p-2.5 text-xs">
                      {selectedUpgrades.includes('balcony') && (
                        <div className="text-muted-foreground flex items-center justify-between">
                          <span>
                            • Oceanfront Balcony ({formatCurrency(50)} × {nights}n)
                          </span>
                          <span className="text-foreground font-medium tabular-nums">
                            {formatCurrency(balconyCost)}
                          </span>
                        </div>
                      )}
                      {selectedUpgrades.includes('breakfast') && (
                        <div className="text-muted-foreground flex items-center justify-between">
                          <span>
                            • Gourmet Breakfast ({formatCurrency(35)} × {breakfastGuests}g × {nights}d)
                          </span>
                          <span className="text-foreground font-medium tabular-nums">
                            {formatCurrency(breakfastCost)}
                          </span>
                        </div>
                      )}
                      {selectedUpgrades.includes('chauffeur') && (
                        <div className="text-muted-foreground flex items-center justify-between">
                          <span>• Luxury Airport Chauffeur (one-time)</span>
                          <span className="text-foreground font-medium tabular-nums">
                            {formatCurrency(chauffeurCost)}
                          </span>
                        </div>
                      )}
                      {selectedUpgrades.includes('spa') && (
                        <div className="text-muted-foreground flex items-center justify-between">
                          <span>
                            • Thermal Spa Pass ({formatCurrency(65)} × {adults} guests)
                          </span>
                          <span className="text-foreground font-medium tabular-nums">{formatCurrency(spaCost)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Resort Fee */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Resort &amp; Hospitality Fee</span>
                    <Info className="text-muted-foreground/70 size-3.5 cursor-help" />
                  </div>
                  <span className="text-foreground font-semibold tabular-nums">{formatCurrency(resortFee)}</span>
                </div>
                <div className="text-muted-foreground pl-0.5 text-xs">
                  $30.00 / night · Beach loungers, high-speed WiFi, welcome champagne
                </div>

                {/* Estimated Taxes */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Taxes &amp; Tourism Surcharge (14%)</span>
                  <span className="text-foreground font-semibold tabular-nums">{formatCurrency(estimatedTaxes)}</span>
                </div>
              </div>

              <Separator />

              {/* Cancellation Policy Banner */}
              <div className="space-y-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 dark:bg-emerald-500/15">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-foreground text-xs font-semibold">
                    Free cancellation until 48 hours before check-in
                  </span>
                </div>
                <p className="text-muted-foreground pl-6 text-xs leading-normal">
                  Cancel before <span className="text-foreground font-medium">{cancellationDeadline}</span> for a 100%
                  full refund with zero fees.
                </p>
              </div>

              {/* Trust Bullet Points */}
              <ul className="text-muted-foreground space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <Check className="text-primary size-3.5 shrink-0" />
                  <span>No upfront booking fees or surprise service surcharges</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary size-3.5 shrink-0" />
                  <span>Official Ritz-Carlton direct member rewards applied</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="text-primary size-3.5 shrink-0" />
                  <span>256-bit encrypted secure bank checkout</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter className="flex flex-col gap-2.5 pt-2">
              <Button className="w-full gap-2 font-semibold shadow-xs" size="lg" onClick={() => setIsBooked(true)}>
                <CreditCard className="size-4" />
                <span>Reserve &amp; Pay Now ({formatCurrency(totalStayPrice)})</span>
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs font-medium"
                size="default"
                onClick={() => setIsBooked(true)}
              >
                Hold Room · Pay at Check-in
              </Button>
              <p className="text-muted-foreground text-center text-xs">
                You won't be charged yet. Final confirmation is sent instantly.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
