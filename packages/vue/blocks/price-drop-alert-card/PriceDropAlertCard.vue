<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  BellRing,
  Check,
  History,
  Mail,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tag,
  Trash2,
  TrendingDown,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface TrackedProduct {
  id: string
  name: string
  variant: string
  category: string
  sku: string
  image: string
  currentPrice: number
  targetPrice: number
  lowest90d: number
  channel: 'email' | 'sms'
  status: 'monitoring' | 'reached'
  active: boolean
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const currentPrice = 299.0
const msrpPrice = 349.0
const lowest90dPrice = 279.0

const alertMethod = ref<'email' | 'sms'>('email')
const targetPrice = ref<number>(280)
const inStockNotification = ref<boolean>(true)
const alertSaved = ref<boolean>(false)
const isRefreshing = ref<boolean>(false)

const trackedProducts = ref<TrackedProduct[]>([
  {
    id: 'prod-1',
    name: 'Pro Studio Wireless Headphones',
    variant: 'Space Black',
    category: 'Audio',
    sku: 'SKU-8842',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    currentPrice: 299.0,
    targetPrice: 280.0,
    lowest90d: 279.0,
    channel: 'email',
    status: 'monitoring',
    active: true,
  },
  {
    id: 'prod-2',
    name: 'Ergonomic Mechanical Keyboard',
    variant: 'RGB / Cherry MX Brown',
    category: 'Peripherals',
    sku: 'SKU-4109',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80',
    currentPrice: 119.0,
    targetPrice: 120.0,
    lowest90d: 119.0,
    channel: 'sms',
    status: 'reached',
    active: true,
  },
  {
    id: 'prod-3',
    name: 'Ultra-Wide Curved Monitor 34"',
    variant: 'WQHD 144Hz IPS',
    category: 'Displays',
    sku: 'SKU-9011',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80',
    currentPrice: 679.0,
    targetPrice: 599.0,
    lowest90d: 629.0,
    channel: 'email',
    status: 'monitoring',
    active: true,
  },
])

// Dynamic savings calculations
const additionalSavings = computed(() => Math.max(0, currentPrice - targetPrice.value))
const additionalSavingsPercent = computed(() => {
  if (currentPrice <= 0) return '0.0'
  return ((additionalSavings.value / currentPrice) * 100).toFixed(1)
})
const totalSavingsFromMsrp = computed(() => Math.max(0, msrpPrice - targetPrice.value))
const totalSavingsPercent = computed(() => {
  if (msrpPrice <= 0) return '0.0'
  return ((totalSavingsFromMsrp.value / msrpPrice) * 100).toFixed(1)
})

// Dynamic SVG Chart Target Line Calculation
// Y range: $240 (y=150) to $360 (y=20), height=130, span=120
const targetY = computed(() => {
  const clamped = Math.max(240, Math.min(360, targetPrice.value))
  return 150 - ((clamped - 240) / 120) * 130
})

function handleSetAlert() {
  alertSaved.value = true
}

function handlePresetClick(price: number) {
  targetPrice.value = price
}

function handleRemoveProduct(id: string) {
  trackedProducts.value = trackedProducts.value.filter((p) => p.id !== id)
}

function handleToggleProductActive(id: string) {
  const item = trackedProducts.value.find((p) => p.id === id)
  if (item) {
    item.active = !item.active
  }
}

function triggerRefresh() {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

<template>
  <div data-slot="price-drop-alert-card" :class="cn('mx-auto w-full max-w-5xl space-y-6', props.class)">
    <!-- Header bar -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h2 class="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">Price Drop Tracker</h2>
          <Badge
            variant="outline"
            class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live Sync
          </Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          Monitor historical market fluctuations, set custom discount thresholds, and receive real-time notifications.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="gap-1.5 text-xs" :disabled="isRefreshing" @click="triggerRefresh">
          <RefreshCw :class="cn('size-3.5', isRefreshing && 'text-primary animate-spin')" />
          <span>{{ isRefreshing ? 'Checking prices…' : 'Check All Prices' }}</span>
        </Button>
      </div>
    </div>

    <!-- 1. Product Wishlist Hero -->
    <Card class="border-border bg-card overflow-hidden shadow-xs">
      <div class="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:gap-8">
        <!-- Thumbnail column -->
        <div class="relative flex flex-col items-center justify-center lg:col-span-4">
          <div
            class="border-border/80 bg-muted/30 relative aspect-square w-full max-w-72 overflow-hidden rounded-xl border"
          >
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
              alt="Pro Studio Wireless Headphones - Space Black"
              class="size-full object-cover object-center transition-transform duration-300 hover:scale-105"
            />
            <div class="absolute top-3 left-3 flex flex-col gap-1.5">
              <Badge
                variant="secondary"
                class="bg-background/90 text-foreground border-border/40 border text-xs font-medium backdrop-blur-xs"
              >
                Audio · SKU-8842
              </Badge>
            </div>
            <div class="absolute right-3 bottom-3">
              <Badge class="bg-emerald-600 text-xs font-semibold text-white shadow-xs dark:bg-emerald-500">
                Lowest in 90 Days
              </Badge>
            </div>
          </div>
        </div>

        <!-- Product detail column -->
        <div class="flex flex-col justify-between space-y-4 lg:col-span-8">
          <div class="space-y-2">
            <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
              <span class="text-foreground font-medium">Sony Acoustic Systems</span>
              <span>•</span>
              <span>Model WH-1000XM-Pro</span>
              <span>•</span>
              <span class="inline-flex items-center gap-1 font-medium text-amber-500">
                ★ 4.8 <span class="text-muted-foreground">(1,420 reviews)</span>
              </span>
            </div>

            <h3 class="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
              Pro Studio Wireless Headphones - Space Black
            </h3>

            <p class="text-muted-foreground text-sm leading-relaxed">
              Flagship hybrid active noise cancelling with beryllium dynamic drivers, 38-hour battery longevity,
              lossless LDAC codec support, and ultra-plush memory foam acoustic isolation cushions.
            </p>
          </div>

          <!-- Price breakdown strip -->
          <div class="border-border/60 bg-muted/20 rounded-xl border p-4">
            <div class="flex flex-wrap items-baseline gap-3 sm:gap-4">
              <div class="flex items-baseline gap-1.5">
                <span class="text-foreground text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                  ${{ currentPrice.toFixed(2) }}
                </span>
                <span class="text-muted-foreground text-sm tabular-nums line-through">
                  ${{ msrpPrice.toFixed(2) }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  <TrendingDown class="size-3.5" />
                  Save $50.00 (-14.3%)
                </span>

                <span
                  class="border-border bg-background text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium"
                >
                  <Sparkles class="size-3 text-amber-500" />
                  90-Day Low:
                  <span class="text-foreground font-semibold tabular-nums">${{ lowest90dPrice.toFixed(2) }}</span>
                </span>
              </div>
            </div>

            <div
              class="text-muted-foreground border-border/40 mt-3 flex flex-wrap items-center gap-4 border-t pt-3 text-xs"
            >
              <span class="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <Check class="size-3.5" /> In Stock (14 left)
              </span>
              <span>•</span>
              <span class="inline-flex items-center gap-1.5">
                <ShieldCheck class="text-muted-foreground size-3.5" /> 30-Day Price Match Guarantee
              </span>
              <span>•</span>
              <span>Free 2-Day Priority Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- 2. 90-Day Price History SVG Trend Chart -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <CardTitle class="flex items-center gap-2 text-base font-semibold sm:text-lg">
              <History class="text-primary size-4" />
              90-Day Price History & Target Threshold
            </CardTitle>
            <CardDescription class="text-xs sm:text-sm">
              Retail price trajectory from May through August with real-time target price alert line.
            </CardDescription>
          </div>

          <!-- Quick trend stats pills -->
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <div class="border-border/80 bg-muted/40 rounded-md border px-2.5 py-1">
              <span class="text-muted-foreground">High: </span>
              <span class="text-foreground font-semibold tabular-nums">$349.00</span>
            </div>
            <div class="border-border/80 bg-muted/40 rounded-md border px-2.5 py-1">
              <span class="text-muted-foreground">Avg: </span>
              <span class="text-foreground font-semibold tabular-nums">$324.50</span>
            </div>
            <div
              class="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-600 dark:text-emerald-400"
            >
              <span class="opacity-80">90d Low: </span>
              <span class="font-bold tabular-nums">$279.00</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent class="pt-2">
        <div class="border-border/60 bg-muted/10 relative w-full overflow-x-auto rounded-lg border p-2 sm:p-4">
          <svg
            viewBox="0 0 600 180"
            class="h-auto w-full max-w-[560px] min-w-full overflow-visible select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <!-- Gradient for price line area -->
              <linearGradient id="vue-price-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.28" />
                <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Y-Axis Grid Lines & Labels -->
            <!-- $360 Line (y=20) -->
            <line x1="50" y1="20" x2="575" y2="20" class="stroke-border/40 stroke-1" stroke-dasharray="3 3" />
            <text x="42" y="24" text-anchor="end" class="fill-muted-foreground font-mono text-xs tabular-nums">
              $360
            </text>

            <!-- $320 Line (y=63.3) -->
            <line x1="50" y1="63.3" x2="575" y2="63.3" class="stroke-border/40 stroke-1" stroke-dasharray="3 3" />
            <text x="42" y="67" text-anchor="end" class="fill-muted-foreground font-mono text-xs tabular-nums">
              $320
            </text>

            <!-- $280 Line (y=106.6) -->
            <line x1="50" y1="106.6" x2="575" y2="106.6" class="stroke-border/40 stroke-1" stroke-dasharray="3 3" />
            <text x="42" y="110" text-anchor="end" class="fill-muted-foreground font-mono text-xs tabular-nums">
              $280
            </text>

            <!-- $240 Line (y=150) -->
            <line x1="50" y1="150" x2="575" y2="150" class="stroke-border/40 stroke-1" />
            <text x="42" y="154" text-anchor="end" class="fill-muted-foreground font-mono text-xs tabular-nums">
              $240
            </text>

            <!-- Price Area Fill -->
            <path
              d="M 60,31.9 C 105,31.9 105,53.6 150,53.6 C 200,53.6 200,31.9 250,31.9 C 300,31.9 300,107.8 350,107.8 C 405,107.8 405,64.4 460,64.4 C 510,64.4 510,86.1 560,86.1 L 560,150 L 60,150 Z"
              fill="url(#vue-price-gradient)"
            />

            <!-- Price Trajectory Line -->
            <path
              d="M 60,31.9 C 105,31.9 105,53.6 150,53.6 C 200,53.6 200,31.9 250,31.9 C 300,31.9 300,107.8 350,107.8 C 405,107.8 405,64.4 460,64.4 C 510,64.4 510,86.1 560,86.1"
              fill="none"
              class="stroke-primary stroke-2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Target Price Dynamic Threshold Line (Amber Dashed) -->
            <line
              x1="50"
              :y1="targetY"
              x2="575"
              :y2="targetY"
              class="stroke-amber-500 stroke-2 transition-all duration-150 ease-out"
              stroke-dasharray="4 4"
            />

            <!-- Dynamic Target Label Tag -->
            <g :transform="`translate(565, ${targetY})`" class="transition-all duration-150 ease-out">
              <rect x="-96" y="-18" width="96" height="18" rx="4" class="fill-amber-500 dark:fill-amber-600" />
              <text x="-48" y="-5" text-anchor="middle" class="fill-white font-mono text-xs font-bold tracking-tight">
                Alert: ${{ targetPrice.toFixed(0) }}.00
              </text>
            </g>

            <!-- Historical Data Points & Annotations -->
            <!-- Pt 1: May 22 ($349) -->
            <circle cx="60" cy="31.9" r="3.5" class="fill-background stroke-primary stroke-2" />

            <!-- Pt 2: Jun 15 ($329) -->
            <circle cx="150" cy="53.6" r="3.5" class="fill-background stroke-primary stroke-2" />

            <!-- Pt 3: Jul 05 ($349) -->
            <circle cx="250" cy="31.9" r="3.5" class="fill-background stroke-primary stroke-2" />

            <!-- Pt 4: Jul 26 ($279 - 90d Low) -->
            <circle cx="350" cy="107.8" r="5" class="stroke-background fill-emerald-500 stroke-2" />
            <rect
              x="306"
              y="117"
              width="88"
              height="18"
              rx="4"
              class="fill-emerald-500/10 stroke-emerald-500/30 stroke-1"
            />
            <text
              x="350"
              y="130"
              text-anchor="middle"
              class="fill-emerald-600 font-mono text-xs font-bold dark:fill-emerald-400"
            >
              90d Low · $279
            </text>

            <!-- Pt 5: Aug 10 ($319) -->
            <circle cx="460" cy="64.4" r="3.5" class="fill-background stroke-primary stroke-2" />

            <!-- Pt 6: Aug 21 (Current $299) -->
            <circle cx="560" cy="86.1" r="5" class="fill-primary stroke-background stroke-2" />
            <rect x="508" y="58" width="80" height="18" rx="4" class="fill-primary/10 stroke-primary/30 stroke-1" />
            <text x="548" y="71" text-anchor="middle" class="fill-primary font-mono text-xs font-bold">
              Now · $299.00
            </text>

            <!-- X-Axis Timeline Milestones -->
            <text x="60" y="168" text-anchor="middle" class="fill-muted-foreground font-mono text-xs">May 22</text>
            <text x="150" y="168" text-anchor="middle" class="fill-muted-foreground font-mono text-xs">Jun 15</text>
            <text x="250" y="168" text-anchor="middle" class="fill-muted-foreground font-mono text-xs">Jul 05</text>
            <text x="350" y="168" text-anchor="middle" class="fill-muted-foreground font-mono text-xs">Jul 26</text>
            <text x="460" y="168" text-anchor="middle" class="fill-muted-foreground font-mono text-xs">Aug 10</text>
            <text x="560" y="168" text-anchor="middle" class="fill-foreground font-mono text-xs font-semibold">
              Today
            </text>
          </svg>
        </div>

        <div class="text-muted-foreground mt-3 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full bg-amber-500" />
            <span>Amber dashed threshold line updates automatically as you move the target slider below.</span>
          </div>
          <span class="font-mono text-xs">Updated 4m ago</span>
        </div>
      </CardContent>
    </Card>

    <!-- 3. Configure Price Drop Alert Form -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-base font-semibold sm:text-lg">
          <BellRing class="text-primary size-4" />
          Configure Price Drop Alert
        </CardTitle>
        <CardDescription class="text-xs sm:text-sm">
          Set your notification channel and custom trigger price. We check pricing every 15 minutes across verified
          retailers.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <!-- Step 1: Alert Delivery Method Radio -->
        <div class="space-y-3">
          <label class="text-foreground text-sm font-semibold">1. Alert Delivery Channel</label>
          <RadioGroup v-model="alertMethod" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label
              for="vue-method-email"
              :class="
                cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-all',
                  alertMethod === 'email'
                    ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                    : 'border-border bg-card hover:bg-muted/40',
                )
              "
            >
              <RadioGroupItem id="vue-method-email" value="email" />
              <div class="space-y-0.5">
                <div class="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                  <Mail class="text-muted-foreground size-3.5" />
                  Email Notification
                </div>
                <p class="text-muted-foreground font-mono text-xs">customer@example.com</p>
              </div>
            </label>

            <label
              for="vue-method-sms"
              :class="
                cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-all',
                  alertMethod === 'sms'
                    ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                    : 'border-border bg-card hover:bg-muted/40',
                )
              "
            >
              <RadioGroupItem id="vue-method-sms" value="sms" />
              <div class="space-y-0.5">
                <div class="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                  <Smartphone class="text-muted-foreground size-3.5" />
                  SMS Push Notification
                </div>
                <p class="text-muted-foreground font-mono text-xs">+1 (555) 019-2834</p>
              </div>
            </label>
          </RadioGroup>
        </div>

        <Separator />

        <!-- Step 2: Target Price Slider & Input -->
        <div class="space-y-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-0.5">
              <label class="text-foreground text-sm font-semibold">2. Target Price Alert Threshold</label>
              <p class="text-muted-foreground text-xs">
                Trigger an alert when the item price drops to or below this amount.
              </p>
            </div>

            <!-- Target Price Display / Input Badge -->
            <div class="flex items-center gap-2">
              <div class="border-border bg-muted/40 flex items-center rounded-lg border px-3 py-1.5">
                <span class="text-muted-foreground mr-1.5 text-xs font-medium">Target:</span>
                <span class="text-foreground font-mono text-lg font-semibold tabular-nums"
                  >${{ targetPrice.toFixed(2) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Slider component -->
          <div class="space-y-2 pt-2">
            <Slider v-model="targetPrice" :min="200" :max="349" :step="1" class="w-full" />

            <!-- Min/Max labels -->
            <div class="text-muted-foreground flex justify-between font-mono text-xs">
              <span>$200.00 (Deep Deal)</span>
              <span class="font-semibold text-amber-600 dark:text-amber-400"
                >Target: ${{ targetPrice.toFixed(2) }}</span
              >
              <span>$349.00 (MSRP)</span>
            </div>
          </div>

          <!-- Savings calculation box & quick presets -->
          <div
            class="border-border/80 bg-muted/20 flex flex-col gap-3 rounded-lg border p-3.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-center gap-2">
              <Tag class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div class="text-xs">
                <template v-if="targetPrice < currentPrice">
                  <span class="text-foreground font-medium">Notify when price drops below </span>
                  <span class="font-mono font-semibold text-emerald-600 dark:text-emerald-400"
                    >${{ targetPrice.toFixed(2) }}</span
                  >
                  <span class="text-muted-foreground"> — saves an extra </span>
                  <span class="text-foreground font-mono font-semibold">${{ additionalSavings.toFixed(2) }}</span>
                  <span class="text-muted-foreground"> ({{ additionalSavingsPercent }}% additional drop)</span>
                </template>
                <template v-else-if="targetPrice === currentPrice">
                  <span class="text-foreground font-medium">Matches current price </span>
                  <span class="text-primary font-mono font-semibold">${{ currentPrice.toFixed(2) }}</span>
                  <span class="text-muted-foreground"> — triggers on any new price movement</span>
                </template>
                <template v-else>
                  <span class="text-foreground font-medium"
                    >Target is set above current price (${{ currentPrice.toFixed(2) }}). Alert triggers
                    immediately.</span
                  >
                </template>
              </div>
            </div>

            <!-- Quick preset buttons -->
            <div class="flex shrink-0 flex-wrap items-center gap-1.5">
              <Button variant="outline" size="sm" class="h-7 px-2 font-mono text-xs" @click="handlePresetClick(289)">
                $289 (-$10)
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="h-7 border-emerald-500/40 px-2 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                @click="handlePresetClick(279)"
              >
                $279 (Low)
              </Button>
              <Button variant="outline" size="sm" class="h-7 px-2 font-mono text-xs" @click="handlePresetClick(249)">
                $249 (-$50)
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Step 3: In-Stock Notification Switch -->
        <div
          class="border-border/80 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <Zap class="size-4 text-amber-500" />
              <label for="vue-stock-switch" class="text-foreground cursor-pointer text-sm font-semibold">
                In-Stock & Lightning Flash Deal Notification
              </label>
            </div>
            <p class="text-muted-foreground text-xs">
              Send instant high-priority alert if available stock falls below 5 units or if a limited lightning coupon
              goes live.
            </p>
          </div>

          <Switch id="vue-stock-switch" v-model="inStockNotification" />
        </div>

        <!-- Alert confirmation banner (shown if saved) -->
        <div
          v-if="alertSaved"
          class="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300"
        >
          <div class="mt-0.5 shrink-0 rounded-full bg-emerald-500 p-1 text-white">
            <Check class="size-3.5" />
          </div>
          <div class="space-y-1 text-xs">
            <p class="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              Price Drop Alert Configured Successfully!
            </p>
            <p>
              We'll monitor <span class="font-semibold">Pro Studio Wireless Headphones</span> every 15 minutes and
              dispatch an alert to
              <span class="font-mono font-semibold">{{
                alertMethod === 'email' ? 'customer@example.com' : '+1 (555) 019-2834'
              }}</span>
              the moment the price reaches <span class="font-mono font-semibold">${{ targetPrice.toFixed(2) }}</span> or
              lower.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter
        class="border-border/60 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
          <ShieldCheck class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Zero spam guarantee. You can pause or cancel alert subscriptions anytime.</span>
        </div>

        <Button class="w-full gap-2 font-semibold sm:w-auto" @click="handleSetAlert">
          <BellRing class="size-4" />
          <span>{{ alertSaved ? 'Update Price Drop Alert' : 'Set Price Drop Alert' }}</span>
        </Button>
      </CardFooter>
    </Card>

    <!-- 4. Active Tracked Products Mini Table -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-base font-semibold sm:text-lg">Active Tracked Wishlist Items</CardTitle>
            <CardDescription class="text-xs sm:text-sm">
              Real-time monitoring list currently linked to your notification profile.
            </CardDescription>
          </div>
          <Badge variant="secondary" class="w-fit font-mono text-xs"> {{ trackedProducts.length }} items active </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div class="border-border/60 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/40 hover:bg-muted/40">
                <TableHead class="text-xs font-semibold">Product</TableHead>
                <TableHead class="text-right text-xs font-semibold">Current Price</TableHead>
                <TableHead class="text-right text-xs font-semibold">Target Alert</TableHead>
                <TableHead class="text-right text-xs font-semibold">90-Day Low</TableHead>
                <TableHead class="text-xs font-semibold">Channel</TableHead>
                <TableHead class="text-xs font-semibold">Status</TableHead>
                <TableHead class="text-right text-xs font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in trackedProducts" :key="item.id" class="transition-colors">
                <!-- Product name & image -->
                <TableCell class="py-3">
                  <div class="flex items-center gap-3">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="border-border/60 size-10 shrink-0 rounded-md border object-cover"
                    />
                    <div class="min-w-0 space-y-0.5">
                      <p class="text-foreground max-w-56 truncate text-xs font-semibold sm:max-w-xs">
                        {{ item.name }}
                      </p>
                      <p class="text-muted-foreground truncate text-xs">
                        {{ item.variant }} · <span class="font-mono">{{ item.sku }}</span>
                      </p>
                    </div>
                  </div>
                </TableCell>

                <!-- Current Price -->
                <TableCell class="text-foreground py-3 text-right font-mono text-xs font-semibold tabular-nums">
                  ${{ item.currentPrice.toFixed(2) }}
                </TableCell>

                <!-- Target Price -->
                <TableCell
                  class="py-3 text-right font-mono text-xs font-semibold text-amber-600 tabular-nums dark:text-amber-400"
                >
                  ${{ item.targetPrice.toFixed(2) }}
                </TableCell>

                <!-- 90-Day Low -->
                <TableCell class="text-muted-foreground py-3 text-right font-mono text-xs tabular-nums">
                  ${{ item.lowest90d.toFixed(2) }}
                </TableCell>

                <!-- Alert Channel -->
                <TableCell class="py-3">
                  <Badge variant="outline" class="gap-1 text-xs font-normal capitalize">
                    <Mail v-if="item.channel === 'email'" class="text-muted-foreground size-3" />
                    <Smartphone v-else class="text-muted-foreground size-3" />
                    {{ item.channel }}
                  </Badge>
                </TableCell>

                <!-- Status Badge -->
                <TableCell class="py-3">
                  <Badge
                    v-if="item.status === 'reached'"
                    class="gap-1 border-emerald-500/30 bg-emerald-500/15 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                    variant="outline"
                  >
                    <Check class="size-3" /> Target Reached!
                  </Badge>
                  <Badge v-else variant="secondary" class="text-muted-foreground gap-1 text-xs font-medium">
                    <TrendingDown class="size-3 text-amber-500" /> Monitoring (-${{
                      (item.currentPrice - item.targetPrice).toFixed(0)
                    }})
                  </Badge>
                </TableCell>

                <!-- Actions -->
                <TableCell class="py-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-muted-foreground hover:text-destructive size-8 p-0"
                      title="Remove Tracker"
                      @click="handleRemoveProduct(item.id)"
                    >
                      <Trash2 class="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
