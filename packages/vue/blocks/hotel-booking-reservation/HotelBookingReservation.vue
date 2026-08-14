<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  Baby,
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
  Waves,
  Wifi,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface Props {
  class?: HTMLAttributes['class']
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

const props = withDefaults(defineProps<Props>(), {
  roomTitle: 'Deluxe Ocean View King Suite',
  hotelName: 'The Ritz-Carlton Bal Harbour, Miami',
  location: 'Bal Harbour, Miami Beach, FL',
  rating: 5.0,
  reviewsCount: 120,
  basePrice: 485,
  initialCheckIn: '2026-08-24',
  initialCheckOut: '2026-08-29',
  initialAdults: 2,
  initialChildren: 1,
  initialRooms: 1,
})

const checkInDate = ref(props.initialCheckIn)
const checkOutDate = ref(props.initialCheckOut)
const adults = ref(props.initialAdults)
const children = ref(props.initialChildren)
const rooms = ref(props.initialRooms)
const specialRequests = ref('')
const isBooked = ref(false)
const isSaved = ref(false)
const activePhotoIndex = ref(0)

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

// Upgrades state: Oceanfront balcony and Daily Breakfast are checked by default
const selectedUpgrades = ref<string[]>(['balcony', 'breakfast'])
const breakfastGuests = ref(1)

function toggleUpgrade(id: string) {
  if (selectedUpgrades.value.includes(id)) {
    selectedUpgrades.value = selectedUpgrades.value.filter((item) => item !== id)
  } else {
    selectedUpgrades.value = [...selectedUpgrades.value, id]
  }
}

// Date calculations
const nights = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 5
  const start = new Date(checkInDate.value).getTime()
  const end = new Date(checkOutDate.value).getTime()
  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 1
})

function setDuration(presetNights: number) {
  if (!checkInDate.value) return
  const start = new Date(checkInDate.value + 'T00:00:00')
  start.setDate(start.getDate() + presetNights)
  const y = start.getFullYear()
  const m = String(start.getMonth() + 1).padStart(2, '0')
  const d = String(start.getDate()).padStart(2, '0')
  checkOutDate.value = `${y}-${m}-${d}`
}

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return dateStr
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formattedRange = computed(() => {
  return `${formatDateDisplay(checkInDate.value)} → ${formatDateDisplay(checkOutDate.value)} · ${nights.value} ${nights.value === 1 ? 'Night' : 'Nights'}`
})

const cancellationDeadline = computed(() => {
  if (!checkInDate.value) return '48 hours prior to arrival'
  const start = new Date(checkInDate.value + 'T00:00:00')
  start.setDate(start.getDate() - 2)
  const y = start.getFullYear()
  const m = String(start.getMonth() + 1).padStart(2, '0')
  const d = String(start.getDate()).padStart(2, '0')
  return formatDateDisplay(`${y}-${m}-${d}`)
})

// Financial calculations
const roomSubtotal = computed(() => {
  return props.basePrice * nights.value * rooms.value
})

const balconyCost = computed(() => {
  return selectedUpgrades.value.includes('balcony') ? 50 * nights.value * rooms.value : 0
})

const breakfastCost = computed(() => {
  return selectedUpgrades.value.includes('breakfast') ? 35 * breakfastGuests.value * nights.value : 0
})

const chauffeurCost = computed(() => {
  return selectedUpgrades.value.includes('chauffeur') ? 120 : 0
})

const spaCost = computed(() => {
  return selectedUpgrades.value.includes('spa') ? 65 * adults.value : 0
})

const selectedAddonsTotal = computed(() => {
  return balconyCost.value + breakfastCost.value + chauffeurCost.value + spaCost.value
})

const resortFee = computed(() => {
  // $30 resort & hospitality fee per night per room
  return 30 * nights.value * rooms.value
})

const taxableSubtotal = computed(() => {
  return roomSubtotal.value + selectedAddonsTotal.value + resortFee.value
})

const estimatedTaxes = computed(() => {
  // 14% state & hospitality tourism tax
  return Math.round(taxableSubtotal.value * 0.14 * 100) / 100
})

const totalStayPrice = computed(() => {
  return taxableSubtotal.value + estimatedTaxes.value
})

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
  const next = adults.value + delta
  if (next >= 1 && next <= 8) {
    adults.value = next
    if (breakfastGuests.value > next) {
      breakfastGuests.value = next
    }
  }
}

function updateChildren(delta: number) {
  const next = children.value + delta
  if (next >= 0 && next <= 6) {
    children.value = next
  }
}

function updateRooms(delta: number) {
  const next = rooms.value + delta
  if (next >= 1 && next <= 4) {
    rooms.value = next
  }
}

function handleReserve() {
  isBooked.value = true
}

function resetBooking() {
  isBooked.value = false
}
</script>

<template>
  <div
    data-slot="hotel-booking-reservation"
    :class="cn('mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8', props.class)"
  >
    <!-- Confirmation Banner (Visible when booked) -->
    <div
      v-if="isBooked"
      class="relative flex flex-col gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 sm:flex-row sm:items-center sm:justify-between dark:bg-emerald-500/15"
    >
      <div class="flex flex-wrap items-start gap-3.5">
        <div
          class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 class="size-5" />
        </div>
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-foreground text-base font-semibold">Reservation Confirmed · Reference #RC-884920</h3>
            <Badge
              wrap
              variant="outline"
              class="border-emerald-500/40 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
            >
              Guaranteed Direct
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs sm:text-sm">
            A confirmation voucher and check-in barcode have been sent to your registered email. No cancellation penalty
            applies before {{ cancellationDeadline }}.
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" class="shrink-0 font-medium" @click="resetBooking">
        <RotateCcw class="size-3.5" />
        Modify Reservation
      </Button>
    </div>

    <!-- Room Hero Header Card -->
    <Card class="border-border overflow-hidden shadow-xs">
      <div class="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-12 lg:gap-8">
        <!-- Room Photo Showcase -->
        <div class="space-y-3 lg:col-span-6">
          <div class="border-border bg-muted/40 relative aspect-16/10 w-full overflow-hidden rounded-xl border">
            <img
              :src="roomPhotos[activePhotoIndex]?.url"
              :alt="roomPhotos[activePhotoIndex]?.title"
              class="size-full object-cover transition-all duration-300"
            />
            <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"
            />
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <Badge
                wrap
                variant="secondary"
                class="bg-background/90 text-foreground text-xs font-medium backdrop-blur-xs"
              >
                Oceanfront View
              </Badge>
              <Badge
                wrap
                variant="outline"
                class="bg-background/80 text-foreground border-white/20 text-xs backdrop-blur-xs"
              >
                Floor 16
              </Badge>
            </div>
            <div class="absolute top-3 right-3 flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Save to favorites"
                class="bg-background/80 hover:bg-background text-foreground flex size-8 items-center justify-center rounded-full backdrop-blur-xs transition-colors"
                @click="isSaved = !isSaved"
              >
                <Heart
                  :class="cn('size-4 transition-colors', isSaved ? 'fill-red-500 text-red-500' : 'text-foreground')"
                />
              </button>
              <button
                type="button"
                aria-label="Share suite"
                class="bg-background/80 hover:bg-background text-foreground flex size-8 items-center justify-center rounded-full backdrop-blur-xs transition-colors"
              >
                <Share2 class="size-4" />
              </button>
            </div>
            <div class="absolute right-3 bottom-3 left-3 flex items-center justify-between text-xs text-white">
              <span class="font-medium drop-shadow-xs">{{ roomPhotos[activePhotoIndex]?.title }}</span>
              <span class="rounded bg-black/60 px-2 py-0.5 font-mono text-xs backdrop-blur-xs">
                {{ activePhotoIndex + 1 }} / {{ roomPhotos.length }}
              </span>
            </div>
          </div>

          <!-- Mini Thumbnail Selector -->
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="(photo, idx) in roomPhotos"
              :key="idx"
              type="button"
              :aria-label="photo.title"
              :class="
                cn(
                  'border-border relative aspect-16/10 overflow-hidden rounded-lg border transition-all',
                  activePhotoIndex === idx ? 'ring-primary border-primary ring-2' : 'opacity-70 hover:opacity-100',
                )
              "
              @click="activePhotoIndex = idx"
            >
              <img :src="photo.url" :alt="photo.title" class="size-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Room Meta & Overview Information -->
        <div class="flex flex-col justify-between space-y-4 lg:col-span-6">
          <div class="space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Star class="size-4 fill-amber-500 text-amber-500" />
                <span class="font-bold tabular-nums">{{ rating.toFixed(1) }}</span>
                <span class="text-muted-foreground underline underline-offset-2"
                  >{{ reviewsCount }} verified guest reviews</span
                >
              </div>
              <Badge wrap variant="outline" class="border-primary/30 bg-primary/5 text-primary text-xs font-medium">
                Official Best Rate Guarantee
              </Badge>
            </div>

            <div class="space-y-1">
              <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                {{ roomTitle }}
              </h1>
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm">
                <Building2 class="text-primary size-4 shrink-0" />
                <span class="text-foreground font-medium">{{ hotelName }}</span>
              </div>
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                <MapPin class="size-3.5 shrink-0" />
                <span>{{ location }}</span>
              </div>
            </div>

            <p class="text-muted-foreground text-xs leading-relaxed sm:text-sm">
              Expansive oceanfront sanctuary featuring custom King pillowtop bedding, floor-to-ceiling glass doors
              opening onto an oversized private balcony with sweeping Atlantic panoramas, freestanding soaking tub, and
              bespoke in-room dining.
            </p>

            <!-- Room Key Amenities Grid -->
            <div class="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2 md:grid-cols-3">
              <div class="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                <Maximize2 class="text-muted-foreground size-3.5 shrink-0" />
                <span class="text-foreground font-medium">680 sq ft / 63 m²</span>
              </div>
              <div class="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                <BedDouble class="text-muted-foreground size-3.5 shrink-0" />
                <span class="text-foreground font-medium">1 King Bed</span>
              </div>
              <div class="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                <Waves class="text-muted-foreground size-3.5 shrink-0" />
                <span class="text-foreground font-medium">Ocean Balcony</span>
              </div>
              <div class="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                <Bath class="text-muted-foreground size-3.5 shrink-0" />
                <span class="text-foreground font-medium">Marble Soaking Tub</span>
              </div>
              <div class="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                <Wifi class="text-muted-foreground size-3.5 shrink-0" />
                <span class="text-foreground font-medium">Fast Fiber WiFi</span>
              </div>
              <div class="border-border/60 bg-muted/20 flex items-center gap-2 rounded-md border p-2 text-xs">
                <Coffee class="text-muted-foreground size-3.5 shrink-0" />
                <span class="text-foreground font-medium">Nespresso Machine</span>
              </div>
            </div>
          </div>

          <div
            class="border-border/80 bg-muted/30 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5 sm:p-4"
          >
            <div>
              <span class="text-muted-foreground block text-xs font-medium tracking-wider uppercase"
                >Direct Member Rate</span
              >
              <div class="flex flex-wrap items-baseline gap-2">
                <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                  {{ formatCurrency(basePrice) }}
                </span>
                <span class="text-muted-foreground text-xs font-normal sm:text-sm">/ night</span>
                <span class="text-muted-foreground text-xs tabular-nums line-through sm:text-sm">$560.00</span>
              </div>
            </div>
            <Badge
              wrap
              variant="secondary"
              class="border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
            >
              Save 13% Direct
            </Badge>
          </div>
        </div>
      </div>
    </Card>

    <!-- Interactive 2-Column Booking Configuration & Price Breakdown Grid -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      <!-- Left Column: Reservation Inputs, Guests & Upgrades -->
      <div class="space-y-6 lg:col-span-7">
        <!-- Stay Dates Selection -->
        <Card class="shadow-xs">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <CardTitle class="text-lg">Stay Dates &amp; Duration</CardTitle>
                <CardDescription
                  >Select your check-in and check-out dates to calculate live availability.</CardDescription
                >
              </div>
              <Badge wrap variant="outline" class="gap-1 text-xs font-medium">
                <CalendarDays class="text-primary size-3.5" />
                {{ nights }} {{ nights === 1 ? 'Night' : 'Nights' }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-5">
            <!-- Date Inputs -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label for="check-in-date" class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <Calendar class="text-primary size-3.5" />
                  Check-in Date (3:00 PM)
                </label>
                <Input
                  id="check-in-date"
                  type="date"
                  :model-value="checkInDate"
                  @update:model-value="(val) => (checkInDate = String(val))"
                />
              </div>

              <div class="space-y-2">
                <label for="check-out-date" class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <Calendar class="text-primary size-3.5" />
                  Check-out Date (12:00 PM)
                </label>
                <Input
                  id="check-out-date"
                  type="date"
                  :model-value="checkOutDate"
                  @update:model-value="(val) => (checkOutDate = String(val))"
                />
              </div>
            </div>

            <!-- Stay Summary Highlight & Quick Length Presets -->
            <div
              class="border-border/60 bg-muted/30 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="text-foreground text-xs font-medium">
                <span class="text-muted-foreground">Selected Stay: </span>
                <span class="font-semibold">{{ formattedRange }}</span>
              </div>
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="text-muted-foreground mr-1 text-xs">Quick:</span>
                <Button
                  v-for="preset in [3, 5, 7, 10]"
                  :key="preset"
                  variant="outline"
                  size="xs"
                  :class="
                    nights === preset ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' : ''
                  "
                  @click="setDuration(preset)"
                >
                  {{ preset }}N
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Guests & Rooms Steppers -->
        <Card class="shadow-xs">
          <CardHeader>
            <CardTitle class="text-lg">Guests &amp; Rooms</CardTitle>
            <CardDescription>Configure the number of adults, children, and suites requested.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Adults Stepper -->
            <div class="border-border/60 flex flex-wrap items-center justify-between rounded-lg border p-3.5">
              <div class="flex items-center gap-3">
                <div
                  class="bg-primary/10 text-primary border-primary/20 flex size-9 shrink-0 items-center justify-center rounded-lg border"
                >
                  <Users class="size-4" />
                </div>
                <div class="space-y-0.5">
                  <span class="text-foreground text-sm font-medium">Adults</span>
                  <p class="text-muted-foreground text-xs">Ages 13 and above</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon-sm"
                  :disabled="adults <= 1"
                  aria-label="Decrease adults"
                  @click="updateAdults(-1)"
                >
                  <Minus class="size-3.5" />
                </Button>
                <span class="text-foreground w-6 text-center text-sm font-bold tabular-nums">{{ adults }}</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  :disabled="adults >= 8"
                  aria-label="Increase adults"
                  @click="updateAdults(1)"
                >
                  <Plus class="size-3.5" />
                </Button>
              </div>
            </div>

            <!-- Children Stepper -->
            <div class="border-border/60 flex flex-wrap items-center justify-between rounded-lg border p-3.5">
              <div class="flex items-center gap-3">
                <div
                  class="bg-primary/10 text-primary border-primary/20 flex size-9 shrink-0 items-center justify-center rounded-lg border"
                >
                  <Baby class="size-4" />
                </div>
                <div class="space-y-0.5">
                  <span class="text-foreground text-sm font-medium">Children</span>
                  <p class="text-muted-foreground text-xs">Ages 0 to 12 years</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon-sm"
                  :disabled="children <= 0"
                  aria-label="Decrease children"
                  @click="updateChildren(-1)"
                >
                  <Minus class="size-3.5" />
                </Button>
                <span class="text-foreground w-6 text-center text-sm font-bold tabular-nums">{{ children }}</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  :disabled="children >= 6"
                  aria-label="Increase children"
                  @click="updateChildren(1)"
                >
                  <Plus class="size-3.5" />
                </Button>
              </div>
            </div>

            <!-- Rooms Stepper -->
            <div class="border-border/60 flex flex-wrap items-center justify-between rounded-lg border p-3.5">
              <div class="flex items-center gap-3">
                <div
                  class="bg-primary/10 text-primary border-primary/20 flex size-9 shrink-0 items-center justify-center rounded-lg border"
                >
                  <BedDouble class="size-4" />
                </div>
                <div class="space-y-0.5">
                  <span class="text-foreground text-sm font-medium">Suites / Rooms</span>
                  <p class="text-muted-foreground text-xs">Max 4 guests per suite</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon-sm"
                  :disabled="rooms <= 1"
                  aria-label="Decrease rooms"
                  @click="updateRooms(-1)"
                >
                  <Minus class="size-3.5" />
                </Button>
                <span class="text-foreground w-6 text-center text-sm font-bold tabular-nums">{{ rooms }}</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  :disabled="rooms >= 4"
                  aria-label="Increase rooms"
                  @click="updateRooms(1)"
                >
                  <Plus class="size-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Room Upgrades & Add-ons -->
        <Card class="shadow-xs">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <CardTitle class="text-lg">Room Upgrades &amp; Exclusive Services</CardTitle>
                <CardDescription
                  >Tailor your stay with luxury amenities and curated hotel enhancements.</CardDescription
                >
              </div>
              <Badge wrap variant="secondary" class="text-xs"> {{ selectedUpgrades.length }} Selected </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-3">
            <!-- Upgrade 1: Oceanfront Balcony -->
            <div
              role="button"
              tabindex="0"
              :class="
                cn(
                  'border-border focus-visible:ring-ring flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition-all select-none focus-visible:ring-2 focus-visible:outline-none',
                  selectedUpgrades.includes('balcony')
                    ? 'border-primary/40 bg-primary/5 shadow-xs'
                    : 'bg-card hover:border-border/80 opacity-80 hover:opacity-100',
                )
              "
              @click="toggleUpgrade('balcony')"
              @keydown.space.prevent="toggleUpgrade('balcony')"
              @keydown.enter.prevent="toggleUpgrade('balcony')"
            >
              <div class="flex flex-wrap items-start gap-3.5">
                <Checkbox
                  id="upgrade-balcony"
                  :model-value="selectedUpgrades.includes('balcony')"
                  class="pointer-events-none mt-1"
                  tabindex="-1"
                />
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-foreground text-sm font-semibold">Oceanfront High-Floor Balcony</span>
                    <Badge wrap variant="outline" class="text-xs font-medium">+$50 / night</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Guaranteed unobstructed 180° Atlantic Ocean sunrise view on floors 15+ with premium teak deck
                    loungers.
                  </p>
                </div>
              </div>
              <div class="shrink-0 text-right">
                <span class="text-foreground text-sm font-bold tabular-nums">
                  +{{ formatCurrency(50 * nights * rooms) }}
                </span>
                <span class="text-muted-foreground block text-xs">for {{ nights }} nights</span>
              </div>
            </div>

            <!-- Upgrade 2: Gourmet Breakfast -->
            <div
              role="button"
              tabindex="0"
              :class="
                cn(
                  'border-border focus-visible:ring-ring flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition-all select-none focus-visible:ring-2 focus-visible:outline-none',
                  selectedUpgrades.includes('breakfast')
                    ? 'border-primary/40 bg-primary/5 shadow-xs'
                    : 'bg-card hover:border-border/80 opacity-80 hover:opacity-100',
                )
              "
              @click="toggleUpgrade('breakfast')"
              @keydown.space.prevent="toggleUpgrade('breakfast')"
              @keydown.enter.prevent="toggleUpgrade('breakfast')"
            >
              <div class="flex flex-wrap items-start gap-3.5">
                <Checkbox
                  id="upgrade-breakfast"
                  :model-value="selectedUpgrades.includes('breakfast')"
                  class="pointer-events-none mt-1"
                  tabindex="-1"
                />
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-foreground text-sm font-semibold">Daily Gourmet Breakfast</span>
                    <Badge wrap variant="outline" class="text-xs font-medium">+$35 / person / day</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Artisanal morning buffet at Artisan Beach House or private veranda in-room breakfast with fresh
                    juices.
                  </p>
                  <!-- Guest selection when active -->
                  <div
                    v-if="selectedUpgrades.includes('breakfast')"
                    class="flex flex-wrap items-center gap-2 pt-1.5 text-xs"
                    @click.stop
                  >
                    <span class="text-muted-foreground">Breakfast plan for:</span>
                    <div class="flex flex-wrap items-center gap-1.5">
                      <Button
                        v-for="count in [1, 2]"
                        :key="count"
                        variant="outline"
                        size="xs"
                        :class="breakfastGuests === count ? 'bg-primary text-primary-foreground border-primary' : ''"
                        @click="breakfastGuests = count"
                      >
                        {{ count }} {{ count === 1 ? 'Guest' : 'Guests' }}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="shrink-0 text-right">
                <span class="text-foreground text-sm font-bold tabular-nums">
                  +{{ formatCurrency(35 * breakfastGuests * nights) }}
                </span>
                <span class="text-muted-foreground block text-xs">
                  {{ breakfastGuests }} {{ breakfastGuests === 1 ? 'guest' : 'guests' }} · {{ nights }}d
                </span>
              </div>
            </div>

            <!-- Upgrade 3: Airport Chauffeur -->
            <div
              role="button"
              tabindex="0"
              :class="
                cn(
                  'border-border focus-visible:ring-ring flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition-all select-none focus-visible:ring-2 focus-visible:outline-none',
                  selectedUpgrades.includes('chauffeur')
                    ? 'border-primary/40 bg-primary/5 shadow-xs'
                    : 'bg-card hover:border-border/80 opacity-80 hover:opacity-100',
                )
              "
              @click="toggleUpgrade('chauffeur')"
              @keydown.space.prevent="toggleUpgrade('chauffeur')"
              @keydown.enter.prevent="toggleUpgrade('chauffeur')"
            >
              <div class="flex flex-wrap items-start gap-3.5">
                <Checkbox
                  id="upgrade-chauffeur"
                  :model-value="selectedUpgrades.includes('chauffeur')"
                  class="pointer-events-none mt-1"
                  tabindex="-1"
                />
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-foreground text-sm font-semibold">Private Airport Luxury Chauffeur</span>
                    <Badge wrap variant="outline" class="text-xs font-medium">+$120 one-time</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Curbside meet-and-greet with dedicated Cadillac Escalade or Mercedes S-Class transfer from MIA or
                    FLL.
                  </p>
                </div>
              </div>
              <div class="shrink-0 text-right">
                <span class="text-foreground text-sm font-bold tabular-nums">+$120.00</span>
                <span class="text-muted-foreground block text-xs">flat one-time</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Special Requests Card -->
        <Card class="shadow-xs">
          <CardHeader class="pb-3">
            <CardTitle class="text-base">Special Requests &amp; Arrival Notes</CardTitle>
            <CardDescription
              >Let us know if you are celebrating a special occasion or require early check-in.</CardDescription
            >
          </CardHeader>
          <CardContent>
            <Input
              id="special-requests"
              v-model="specialRequests"
              placeholder="e.g., Honeymoon celebration, feather-free bedding, quiet high floor..."
              maxlength="200"
              show-count
            />
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Total Price Breakdown & Checkout Card (Sticky) -->
      <div class="lg:sticky lg:top-8 lg:col-span-5">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Stay Price Breakdown
              </span>
              <Badge
                wrap
                variant="secondary"
                class="bg-primary/10 text-primary border-primary/20 gap-1 text-xs font-medium"
              >
                <Sparkles class="size-3" />
                Instant Confirmation
              </Badge>
            </div>

            <div class="mt-3 space-y-1">
              <div class="text-muted-foreground text-xs">Total Stay Price (USD)</div>
              <div class="flex items-baseline gap-2">
                <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                  {{ formatCurrency(totalStayPrice) }}
                </span>
              </div>
              <p class="text-muted-foreground text-xs">
                Total for <span class="text-foreground font-medium">{{ nights }} nights</span> · {{ rooms }} suite ·
                {{ adults + children }} guests
              </p>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <Separator />

            <!-- Itemized Pricing Breakdown -->
            <div class="space-y-2.5">
              <!-- Base Room Subtotal -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">
                  Room subtotal ({{ formatCurrency(basePrice) }} × {{ nights }} {{ nights === 1 ? 'night' : 'nights'
                  }}{{ rooms > 1 ? ` × ${rooms} rooms` : '' }})
                </span>
                <span class="text-foreground font-semibold tabular-nums">{{ formatCurrency(roomSubtotal) }}</span>
              </div>

              <!-- Selected Add-ons summary / itemized -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-muted-foreground"> Selected Add-ons ({{ selectedUpgrades.length }} active) </span>
                  <span class="text-foreground font-semibold tabular-nums">{{
                    formatCurrency(selectedAddonsTotal)
                  }}</span>
                </div>

                <!-- Addon sub-items -->
                <div
                  v-if="selectedUpgrades.length > 0"
                  class="border-border/60 bg-muted/20 space-y-1 rounded-md border p-2.5 text-xs"
                >
                  <div
                    v-if="selectedUpgrades.includes('balcony')"
                    class="text-muted-foreground flex items-center justify-between"
                  >
                    <span>• Oceanfront Balcony ({{ formatCurrency(50) }} × {{ nights }}n)</span>
                    <span class="text-foreground font-medium tabular-nums">{{ formatCurrency(balconyCost) }}</span>
                  </div>
                  <div
                    v-if="selectedUpgrades.includes('breakfast')"
                    class="text-muted-foreground flex items-center justify-between"
                  >
                    <span>• Gourmet Breakfast ({{ formatCurrency(35) }} × {{ breakfastGuests }}g × {{ nights }}d)</span>
                    <span class="text-foreground font-medium tabular-nums">{{ formatCurrency(breakfastCost) }}</span>
                  </div>
                  <div
                    v-if="selectedUpgrades.includes('chauffeur')"
                    class="text-muted-foreground flex items-center justify-between"
                  >
                    <span>• Luxury Airport Chauffeur (one-time)</span>
                    <span class="text-foreground font-medium tabular-nums">{{ formatCurrency(chauffeurCost) }}</span>
                  </div>
                  <div
                    v-if="selectedUpgrades.includes('spa')"
                    class="text-muted-foreground flex items-center justify-between"
                  >
                    <span>• Thermal Spa Pass ({{ formatCurrency(65) }} × {{ adults }} guests)</span>
                    <span class="text-foreground font-medium tabular-nums">{{ formatCurrency(spaCost) }}</span>
                  </div>
                </div>
              </div>

              <!-- Resort Fee -->
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-1">
                  <span class="text-muted-foreground">Resort &amp; Hospitality Fee</span>
                  <Info class="text-muted-foreground/70 size-3.5 cursor-help" />
                </div>
                <span class="text-foreground font-semibold tabular-nums">{{ formatCurrency(resortFee) }}</span>
              </div>
              <div class="text-muted-foreground pl-0.5 text-xs">
                $30.00 / night · Beach loungers, high-speed WiFi, welcome champagne
              </div>

              <!-- Estimated Taxes -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Estimated Taxes &amp; Tourism Surcharge (14%)</span>
                <span class="text-foreground font-semibold tabular-nums">{{ formatCurrency(estimatedTaxes) }}</span>
              </div>
            </div>

            <Separator />

            <!-- Cancellation Policy Banner -->
            <div
              class="space-y-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 dark:bg-emerald-500/15"
            >
              <div class="flex items-center gap-2">
                <ShieldCheck class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span class="text-foreground text-xs font-semibold"
                  >Free cancellation until 48 hours before check-in</span
                >
              </div>
              <p class="text-muted-foreground pl-6 text-xs leading-normal">
                Cancel before <span class="text-foreground font-medium">{{ cancellationDeadline }}</span> for a 100%
                full refund with zero fees.
              </p>
            </div>

            <!-- Trust Bullet Points -->
            <ul class="text-muted-foreground space-y-2 text-xs">
              <li class="flex items-center gap-2">
                <Check class="text-primary size-3.5 shrink-0" />
                <span>No upfront booking fees or surprise service surcharges</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="text-primary size-3.5 shrink-0" />
                <span>Official Ritz-Carlton direct member rewards applied</span>
              </li>
              <li class="flex items-center gap-2">
                <Lock class="text-primary size-3.5 shrink-0" />
                <span>256-bit encrypted secure bank checkout</span>
              </li>
            </ul>
          </CardContent>

          <CardFooter class="flex flex-col gap-2.5 pt-2">
            <Button class="w-full gap-2 font-semibold shadow-xs" size="lg" @click="handleReserve">
              <CreditCard class="size-4" />
              <span>Reserve &amp; Pay Now ({{ formatCurrency(totalStayPrice) }})</span>
            </Button>
            <Button variant="outline" class="w-full text-xs font-medium" size="default" @click="handleReserve">
              Hold Room · Pay at Check-in
            </Button>
            <p class="text-muted-foreground text-center text-xs">
              You won't be charged yet. Final confirmation is sent instantly.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
