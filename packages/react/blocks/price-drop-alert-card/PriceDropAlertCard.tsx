'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export function PriceDropAlertCard({ className }: { className?: string }) {
  const currentPrice = 299.0
  const msrpPrice = 349.0
  const lowest90dPrice = 279.0

  const [alertMethod, setAlertMethod] = React.useState<'email' | 'sms'>('email')
  const [targetPrice, setTargetPrice] = React.useState<number>(280)
  const [inStockNotification, setInStockNotification] = React.useState<boolean>(true)
  const [alertSaved, setAlertSaved] = React.useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false)

  const [trackedProducts, setTrackedProducts] = React.useState<TrackedProduct[]>([
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
  const additionalSavings = Math.max(0, currentPrice - targetPrice)
  const additionalSavingsPercent = currentPrice > 0 ? ((additionalSavings / currentPrice) * 100).toFixed(1) : '0.0'

  // Dynamic SVG Chart Target Line Calculation
  // Y range: $240 (y=150) to $360 (y=20), height=130, span=120
  const clampedTarget = Math.max(240, Math.min(360, targetPrice))
  const targetY = 150 - ((clampedTarget - 240) / 120) * 130

  const handleSetAlert = () => {
    setAlertSaved(true)
  }

  const handlePresetClick = (price: number) => {
    setTargetPrice(price)
  }

  const handleRemoveProduct = (id: string) => {
    setTrackedProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const triggerRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 600)
  }

  return (
    <div data-slot="price-drop-alert-card" className={cn('mx-auto w-full max-w-5xl space-y-6', className)}>
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">Price Drop Tracker</h2>
            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live Sync
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Monitor historical market fluctuations, set custom discount thresholds, and receive real-time notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            disabled={isRefreshing}
            onClick={triggerRefresh}
          >
            <RefreshCw className={cn('size-3.5', isRefreshing && 'text-primary animate-spin')} />
            <span>{isRefreshing ? 'Checking prices…' : 'Check All Prices'}</span>
          </Button>
        </div>
      </div>

      {/* 1. Product Wishlist Hero */}
      <Card className="border-border bg-card overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:gap-8">
          {/* Thumbnail column */}
          <div className="relative flex flex-col items-center justify-center lg:col-span-4">
            <div className="border-border/80 bg-muted/30 relative aspect-square w-full max-w-72 overflow-hidden rounded-xl border">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Pro Studio Wireless Headphones - Space Black"
                className="size-full object-cover object-center transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <Badge
                  variant="secondary"
                  className="bg-background/90 text-foreground border-border/40 border text-xs font-medium backdrop-blur-xs"
                >
                  Audio · SKU-8842
                </Badge>
              </div>
              <div className="absolute right-3 bottom-3">
                <Badge className="bg-emerald-600 text-xs font-semibold text-white shadow-xs dark:bg-emerald-500">
                  Lowest in 90 Days
                </Badge>
              </div>
            </div>
          </div>

          {/* Product detail column */}
          <div className="flex flex-col justify-between space-y-4 lg:col-span-8">
            <div className="space-y-2">
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                <span className="text-foreground font-medium">Sony Acoustic Systems</span>
                <span>•</span>
                <span>Model WH-1000XM-Pro</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-medium text-amber-500">
                  ★ 4.8 <span className="text-muted-foreground">(1,420 reviews)</span>
                </span>
              </div>

              <h3 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
                Pro Studio Wireless Headphones - Space Black
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed">
                Flagship hybrid active noise cancelling with beryllium dynamic drivers, 38-hour battery longevity,
                lossless LDAC codec support, and ultra-plush memory foam acoustic isolation cushions.
              </p>
            </div>

            {/* Price breakdown strip */}
            <div className="border-border/60 bg-muted/20 rounded-xl border p-4">
              <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                    ${currentPrice.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground text-sm tabular-nums line-through">
                    ${msrpPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingDown className="size-3.5" />
                    Save $50.00 (-14.3%)
                  </span>

                  <span className="border-border bg-background text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium">
                    <Sparkles className="size-3 text-amber-500" />
                    90-Day Low:{' '}
                    <span className="text-foreground font-semibold tabular-nums">${lowest90dPrice.toFixed(2)}</span>
                  </span>
                </div>
              </div>

              <div className="text-muted-foreground border-border/40 mt-3 flex flex-wrap items-center gap-4 border-t pt-3 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3.5" /> In Stock (14 left)
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="text-muted-foreground size-3.5" /> 30-Day Price Match Guarantee
                </span>
                <span>•</span>
                <span>Free 2-Day Priority Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. 90-Day Price History SVG Trend Chart */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                <History className="text-primary size-4" />
                90-Day Price History & Target Threshold
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Retail price trajectory from May through August with real-time target price alert line.
              </CardDescription>
            </div>

            {/* Quick trend stats pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="border-border/80 bg-muted/40 rounded-md border px-2.5 py-1">
                <span className="text-muted-foreground">High: </span>
                <span className="text-foreground font-semibold tabular-nums">$349.00</span>
              </div>
              <div className="border-border/80 bg-muted/40 rounded-md border px-2.5 py-1">
                <span className="text-muted-foreground">Avg: </span>
                <span className="text-foreground font-semibold tabular-nums">$324.50</span>
              </div>
              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-600 dark:text-emerald-400">
                <span className="opacity-80">90d Low: </span>
                <span className="font-bold tabular-nums">$279.00</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="border-border/60 bg-muted/10 relative w-full overflow-x-auto rounded-lg border p-2 sm:p-4">
            <svg
              viewBox="0 0 600 180"
              className="h-auto w-full max-w-[560px] min-w-full overflow-visible select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="react-price-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines & Labels */}
              <line x1="50" y1="20" x2="575" y2="20" className="stroke-border/40 stroke-1" strokeDasharray="3 3" />
              <text x="42" y="24" textAnchor="end" className="fill-muted-foreground font-mono text-xs tabular-nums">
                $360
              </text>

              <line x1="50" y1="63.3" x2="575" y2="63.3" className="stroke-border/40 stroke-1" strokeDasharray="3 3" />
              <text x="42" y="67" textAnchor="end" className="fill-muted-foreground font-mono text-xs tabular-nums">
                $320
              </text>

              <line
                x1="50"
                y1="106.6"
                x2="575"
                y2="106.6"
                className="stroke-border/40 stroke-1"
                strokeDasharray="3 3"
              />
              <text x="42" y="110" textAnchor="end" className="fill-muted-foreground font-mono text-xs tabular-nums">
                $280
              </text>

              <line x1="50" y1="150" x2="575" y2="150" className="stroke-border/40 stroke-1" />
              <text x="42" y="154" textAnchor="end" className="fill-muted-foreground font-mono text-xs tabular-nums">
                $240
              </text>

              {/* Price Area Fill */}
              <path
                d="M 60,31.9 C 105,31.9 105,53.6 150,53.6 C 200,53.6 200,31.9 250,31.9 C 300,31.9 300,107.8 350,107.8 C 405,107.8 405,64.4 460,64.4 C 510,64.4 510,86.1 560,86.1 L 560,150 L 60,150 Z"
                fill="url(#react-price-gradient)"
              />

              {/* Price Trajectory Line */}
              <path
                d="M 60,31.9 C 105,31.9 105,53.6 150,53.6 C 200,53.6 200,31.9 250,31.9 C 300,31.9 300,107.8 350,107.8 C 405,107.8 405,64.4 460,64.4 C 510,64.4 510,86.1 560,86.1"
                fill="none"
                className="stroke-primary stroke-2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Target Price Dynamic Threshold Line (Amber Dashed) */}
              <line
                x1="50"
                y1={targetY}
                x2="575"
                y2={targetY}
                className="stroke-amber-500 stroke-2 transition-all duration-150 ease-out"
                strokeDasharray="4 4"
              />

              {/* Dynamic Target Label Tag */}
              <g transform={`translate(565, ${targetY})`} className="transition-all duration-150 ease-out">
                <rect x="-96" y="-18" width="96" height="18" rx="4" className="fill-amber-500 dark:fill-amber-600" />
                <text
                  x="-48"
                  y="-5"
                  textAnchor="middle"
                  className="fill-white font-mono text-xs font-bold tracking-tight"
                >
                  Alert: ${targetPrice.toFixed(0)}.00
                </text>
              </g>

              {/* Historical Data Points & Annotations */}
              <circle cx="60" cy="31.9" r="3.5" className="fill-background stroke-primary stroke-2" />
              <circle cx="150" cy="53.6" r="3.5" className="fill-background stroke-primary stroke-2" />
              <circle cx="250" cy="31.9" r="3.5" className="fill-background stroke-primary stroke-2" />

              {/* Pt 4: Jul 26 ($279 - 90d Low) */}
              <circle cx="350" cy="107.8" r="5" className="stroke-background fill-emerald-500 stroke-2" />
              <rect
                x="306"
                y="117"
                width="88"
                height="18"
                rx="4"
                className="fill-emerald-500/10 stroke-emerald-500/30 stroke-1"
              />
              <text
                x="350"
                y="130"
                textAnchor="middle"
                className="fill-emerald-600 font-mono text-xs font-bold dark:fill-emerald-400"
              >
                90d Low · $279
              </text>

              <circle cx="460" cy="64.4" r="3.5" className="fill-background stroke-primary stroke-2" />

              {/* Pt 6: Aug 21 (Current $299) */}
              <circle cx="560" cy="86.1" r="5" className="fill-primary stroke-background stroke-2" />
              <rect
                x="508"
                y="58"
                width="80"
                height="18"
                rx="4"
                className="fill-primary/10 stroke-primary/30 stroke-1"
              />
              <text x="548" y="71" textAnchor="middle" className="fill-primary font-mono text-xs font-bold">
                Now · $299.00
              </text>

              {/* X-Axis Timeline Milestones */}
              <text x="60" y="168" textAnchor="middle" className="fill-muted-foreground font-mono text-xs">
                May 22
              </text>
              <text x="150" y="168" textAnchor="middle" className="fill-muted-foreground font-mono text-xs">
                Jun 15
              </text>
              <text x="250" y="168" textAnchor="middle" className="fill-muted-foreground font-mono text-xs">
                Jul 05
              </text>
              <text x="350" y="168" textAnchor="middle" className="fill-muted-foreground font-mono text-xs">
                Jul 26
              </text>
              <text x="460" y="168" textAnchor="middle" className="fill-muted-foreground font-mono text-xs">
                Aug 10
              </text>
              <text x="560" y="168" textAnchor="middle" className="fill-foreground font-mono text-xs font-semibold">
                Today
              </text>
            </svg>
          </div>

          <div className="text-muted-foreground mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>Amber dashed threshold line updates automatically as you move the target slider below.</span>
            </div>
            <span className="font-mono text-xs">Updated 4m ago</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Configure Price Drop Alert Form */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
            <BellRing className="text-primary size-4" />
            Configure Price Drop Alert
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Set your notification channel and custom trigger price. We check pricing every 15 minutes across verified
            retailers.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Alert Delivery Method Radio */}
          <div className="space-y-3">
            <label className="text-foreground text-sm font-semibold">1. Alert Delivery Channel</label>
            <RadioGroup
              value={alertMethod}
              onValueChange={(val) => setAlertMethod(val as 'email' | 'sms')}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <label
                htmlFor="react-method-email"
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-all',
                  alertMethod === 'email'
                    ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                    : 'border-border bg-card hover:bg-muted/40',
                )}
              >
                <RadioGroupItem id="react-method-email" value="email" />
                <div className="space-y-0.5">
                  <div className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                    <Mail className="text-muted-foreground size-3.5" />
                    Email Notification
                  </div>
                  <p className="text-muted-foreground font-mono text-xs">customer@example.com</p>
                </div>
              </label>

              <label
                htmlFor="react-method-sms"
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-all',
                  alertMethod === 'sms'
                    ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                    : 'border-border bg-card hover:bg-muted/40',
                )}
              >
                <RadioGroupItem id="react-method-sms" value="sms" />
                <div className="space-y-0.5">
                  <div className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                    <Smartphone className="text-muted-foreground size-3.5" />
                    SMS Push Notification
                  </div>
                  <p className="text-muted-foreground font-mono text-xs">+1 (555) 019-2834</p>
                </div>
              </label>
            </RadioGroup>
          </div>

          <Separator />

          {/* Step 2: Target Price Slider & Input */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <label className="text-foreground text-sm font-semibold">2. Target Price Alert Threshold</label>
                <p className="text-muted-foreground text-xs">
                  Trigger an alert when the item price drops to or below this amount.
                </p>
              </div>

              {/* Target Price Display */}
              <div className="flex items-center gap-2">
                <div className="border-border bg-muted/40 flex items-center rounded-lg border px-3 py-1.5">
                  <span className="text-muted-foreground mr-1.5 text-xs font-medium">Target:</span>
                  <span className="text-foreground font-mono text-lg font-semibold tabular-nums">
                    ${targetPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Slider component */}
            <div className="space-y-2 pt-2">
              <Slider
                value={[targetPrice]}
                onValueChange={(val) => setTargetPrice(val[0])}
                min={200}
                max={349}
                step={1}
                className="w-full"
              />

              {/* Min/Max labels */}
              <div className="text-muted-foreground flex justify-between font-mono text-xs">
                <span>$200.00 (Deep Deal)</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  Target: ${targetPrice.toFixed(2)}
                </span>
                <span>$349.00 (MSRP)</span>
              </div>
            </div>

            {/* Savings calculation box & quick presets */}
            <div className="border-border/80 bg-muted/20 flex flex-col gap-3 rounded-lg border p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Tag className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div className="text-xs">
                  {targetPrice < currentPrice ? (
                    <>
                      <span className="text-foreground font-medium">Notify when price drops below </span>
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        ${targetPrice.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground"> — saves an extra </span>
                      <span className="text-foreground font-mono font-semibold">${additionalSavings.toFixed(2)}</span>
                      <span className="text-muted-foreground"> ({additionalSavingsPercent}% additional drop)</span>
                    </>
                  ) : targetPrice === currentPrice ? (
                    <>
                      <span className="text-foreground font-medium">Matches current price </span>
                      <span className="text-primary font-mono font-semibold">${currentPrice.toFixed(2)}</span>
                      <span className="text-muted-foreground"> — triggers on any new price movement</span>
                    </>
                  ) : (
                    <span className="text-foreground font-medium">
                      Target is set above current price (${currentPrice.toFixed(2)}). Alert triggers immediately.
                    </span>
                  )}
                </div>
              </div>

              {/* Quick preset buttons */}
              <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 font-mono text-xs"
                  onClick={() => handlePresetClick(289)}
                >
                  $289 (-$10)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 border-emerald-500/40 px-2 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  onClick={() => handlePresetClick(279)}
                >
                  $279 (Low)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 font-mono text-xs"
                  onClick={() => handlePresetClick(249)}
                >
                  $249 (-$50)
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Step 3: In-Stock Notification Switch */}
          <div className="border-border/80 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-amber-500" />
                <label htmlFor="react-stock-switch" className="text-foreground cursor-pointer text-sm font-semibold">
                  In-Stock & Lightning Flash Deal Notification
                </label>
              </div>
              <p className="text-muted-foreground text-xs">
                Send instant high-priority alert if available stock falls below 5 units or if a limited lightning coupon
                goes live.
              </p>
            </div>

            <Switch id="react-stock-switch" checked={inStockNotification} onCheckedChange={setInStockNotification} />
          </div>

          {/* Alert confirmation banner (shown if saved) */}
          {alertSaved && (
            <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300">
              <div className="mt-0.5 shrink-0 rounded-full bg-emerald-500 p-1 text-white">
                <Check className="size-3.5" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                  Price Drop Alert Configured Successfully!
                </p>
                <p>
                  We'll monitor <span className="font-semibold">Pro Studio Wireless Headphones</span> every 15 minutes
                  and dispatch an alert to{' '}
                  <span className="font-mono font-semibold">
                    {alertMethod === 'email' ? 'customer@example.com' : '+1 (555) 019-2834'}
                  </span>{' '}
                  the moment the price reaches{' '}
                  <span className="font-mono font-semibold">${targetPrice.toFixed(2)}</span> or lower.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-border/60 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Zero spam guarantee. You can pause or cancel alert subscriptions anytime.</span>
          </div>

          <Button className="w-full gap-2 font-semibold sm:w-auto" onClick={handleSetAlert}>
            <BellRing className="size-4" />
            <span>{alertSaved ? 'Update Price Drop Alert' : 'Set Price Drop Alert'}</span>
          </Button>
        </CardFooter>
      </Card>

      {/* 4. Active Tracked Products Mini Table */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold sm:text-lg">Active Tracked Wishlist Items</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Real-time monitoring list currently linked to your notification profile.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="w-fit font-mono text-xs">
              {trackedProducts.length} items active
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border-border/60 overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs font-semibold">Product</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Current Price</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Target Alert</TableHead>
                  <TableHead className="text-right text-xs font-semibold">90-Day Low</TableHead>
                  <TableHead className="text-xs font-semibold">Channel</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trackedProducts.map((item) => (
                  <TableRow key={item.id} className="transition-colors">
                    {/* Product name & image */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="border-border/60 size-10 shrink-0 rounded-md border object-cover"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-foreground max-w-56 truncate text-xs font-semibold sm:max-w-xs">
                            {item.name}
                          </p>
                          <p className="text-muted-foreground truncate text-xs">
                            {item.variant} · <span className="font-mono">{item.sku}</span>
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Current Price */}
                    <TableCell className="text-foreground py-3 text-right font-mono text-xs font-semibold tabular-nums">
                      ${item.currentPrice.toFixed(2)}
                    </TableCell>

                    {/* Target Price */}
                    <TableCell className="py-3 text-right font-mono text-xs font-semibold text-amber-600 tabular-nums dark:text-amber-400">
                      ${item.targetPrice.toFixed(2)}
                    </TableCell>

                    {/* 90-Day Low */}
                    <TableCell className="text-muted-foreground py-3 text-right font-mono text-xs tabular-nums">
                      ${item.lowest90d.toFixed(2)}
                    </TableCell>

                    {/* Alert Channel */}
                    <TableCell className="py-3">
                      <Badge variant="outline" className="gap-1 text-xs font-normal capitalize">
                        {item.channel === 'email' ? (
                          <Mail className="text-muted-foreground size-3" />
                        ) : (
                          <Smartphone className="text-muted-foreground size-3" />
                        )}
                        {item.channel}
                      </Badge>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3">
                      {item.status === 'reached' ? (
                        <Badge
                          className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                          variant="outline"
                        >
                          <Check className="size-3" /> Target Reached!
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-muted-foreground gap-1 text-xs font-medium">
                          <TrendingDown className="size-3 text-amber-500" /> Monitoring (-$
                          {(item.currentPrice - item.targetPrice).toFixed(0)})
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive size-8 p-0"
                          title="Remove Tracker"
                          onClick={() => handleRemoveProduct(item.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PriceDropAlertCard
