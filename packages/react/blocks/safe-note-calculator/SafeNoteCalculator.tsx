'use client'

import * as React from 'react'
import {
  BadgePercent,
  Check,
  CheckCircle2,
  Copy,
  DollarSign,
  FileSpreadsheet,
  Layers,
  Percent,
  PieChart,
  Scale,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type RoundPreset = 'seed-standard' | 'preseed-safe' | 'uncapped-discount' | 'bridge-round'

interface PresetConfig {
  id: RoundPreset
  label: string
  investment: number
  valuationCap: number
  hasDiscount: boolean
  discountRate: number
  shares: number
  seriesAPreMoney: number
  description: string
}

const PRESETS: Record<RoundPreset, PresetConfig> = {
  'seed-standard': {
    id: 'seed-standard',
    label: 'Standard Seed ($1M @ $15M)',
    investment: 1_000_000,
    valuationCap: 15_000_000,
    hasDiscount: true,
    discountRate: 20,
    shares: 10_000_000,
    seriesAPreMoney: 25_000_000,
    description: 'Standard YC Post-Money SAFE with $15M valuation cap and optional 20% discount clause.',
  },
  'preseed-safe': {
    id: 'preseed-safe',
    label: 'Pre-Seed ($500K @ $8M)',
    investment: 500_000,
    valuationCap: 8_000_000,
    hasDiscount: true,
    discountRate: 20,
    shares: 10_000_000,
    seriesAPreMoney: 18_000_000,
    description: 'Early-stage angel or accelerator round with $8M valuation cap.',
  },
  'uncapped-discount': {
    id: 'uncapped-discount',
    label: 'Uncapped (25% Disc)',
    investment: 750_000,
    valuationCap: 60_000_000,
    hasDiscount: true,
    discountRate: 25,
    shares: 10_000_000,
    seriesAPreMoney: 20_000_000,
    description: 'High valuation cap structure where the 25% discount governs share conversion price.',
  },
  'bridge-round': {
    id: 'bridge-round',
    label: 'Growth Bridge ($2M @ $25M)',
    investment: 2_000_000,
    valuationCap: 25_000_000,
    hasDiscount: true,
    discountRate: 15,
    shares: 10_000_000,
    seriesAPreMoney: 45_000_000,
    description: 'Late seed extension bridging into a larger institutional Series A equity round.',
  },
}

const INVESTMENT_MARKS = {
  100000: '$100K',
  1000000: '$1M',
  2500000: '$2.5M',
  5000000: '$5M',
}

const VALUATION_CAP_MARKS = {
  2000000: '$2M',
  15000000: '$15M',
  30000000: '$30M',
  50000000: '$50M',
}

const DISCOUNT_RATE_MARKS = {
  10: '10%',
  15: '15%',
  20: '20%',
  25: '25%',
  30: '30%',
}

const SERIES_A_MARKS = {
  5000000: '$5M',
  25000000: '$25M',
  50000000: '$50M',
  80000000: '$80M',
}

const SCENARIO_VALUATIONS = [10_000_000, 15_000_000, 20_000_000, 25_000_000, 40_000_000, 60_000_000]

// Number & Currency Formatters
const fmtCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0)
}

const fmtCurrencyWhole = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val || 0)
}

const fmtPercent = (val: number, decimals = 2) => {
  return `${(val || 0).toFixed(decimals)}%`
}

const fmtNumber = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(val || 0)
}

export function SafeNoteCalculator({ className }: { className?: string }) {
  const [selectedPreset, setSelectedPreset] = React.useState<RoundPreset>('seed-standard')
  const [investmentAmount, setInvestmentAmount] = React.useState(1_000_000)
  const [valuationCap, setValuationCap] = React.useState(15_000_000)
  const [hasDiscount, setHasDiscount] = React.useState(true)
  const [discountRate, setDiscountRate] = React.useState(20)
  const [companyCapitalization, setCompanyCapitalization] = React.useState(10_000_000)
  const [seriesAPreMoney, setSeriesAPreMoney] = React.useState(25_000_000)
  const [copied, setCopied] = React.useState(false)

  const handlePresetChange = React.useCallback((value: string) => {
    const presetId = value as RoundPreset
    setSelectedPreset(presetId)
    const preset = PRESETS[presetId]
    if (preset) {
      setInvestmentAmount(preset.investment)
      setValuationCap(preset.valuationCap)
      setHasDiscount(preset.hasDiscount)
      setDiscountRate(preset.discountRate)
      setCompanyCapitalization(preset.shares)
      setSeriesAPreMoney(preset.seriesAPreMoney)
    }
  }, [])

  // Core SAFE conversion economics
  const calculations = React.useMemo(() => {
    const inv = Math.max(1, investmentAmount)
    const cap = Math.max(1, valuationCap)
    const shares = Math.max(1, companyCapitalization)
    const seriesA = Math.max(1, seriesAPreMoney)
    const disc = hasDiscount ? Math.max(0, Math.min(99, discountRate)) : 0

    // Series A unqualified price per share
    const seriesAPricePerShare = seriesA / shares

    // Cap conversion price per share
    const capPricePerShare = cap / shares

    // Discount conversion price per share
    const discountPricePerShare = hasDiscount ? seriesAPricePerShare * (1 - disc / 100) : seriesAPricePerShare

    // In YC Post-Money SAFE, investor converts at the lower of Cap Price or Discount Price
    let conversionPrice = capPricePerShare
    let governingMechanism: 'cap' | 'discount' = 'cap'

    if (hasDiscount && discountPricePerShare < capPricePerShare) {
      conversionPrice = discountPricePerShare
      governingMechanism = 'discount'
    } else {
      conversionPrice = capPricePerShare
      governingMechanism = 'cap'
    }

    // Converted shares issued
    const safeShares = conversionPrice > 0 ? Math.round(inv / conversionPrice) : 0

    // Equity percentage calculation
    const safeOwnershipPct = Math.min(100, Math.max(0, (safeShares / shares) * 100))
    const founderShares = Math.max(0, shares - safeShares)
    const founderOwnershipPct = Math.max(0, 100 - safeOwnershipPct)

    // Effective discount achieved vs Series A price
    const effectiveDiscountPct =
      seriesAPricePerShare > 0
        ? Math.max(0, ((seriesAPricePerShare - conversionPrice) / seriesAPricePerShare) * 100)
        : 0

    // Implied Value of SAFE stake at Series A price
    const impliedSeriesAValue = safeShares * seriesAPricePerShare
    const valueGain = Math.max(0, impliedSeriesAValue - inv)
    const paperRoiMultiple = inv > 0 ? impliedSeriesAValue / inv : 1

    return {
      seriesAPricePerShare,
      capPricePerShare,
      discountPricePerShare,
      conversionPrice,
      governingMechanism,
      safeShares,
      founderShares,
      totalShares: shares,
      safeOwnershipPct,
      founderOwnershipPct,
      effectiveDiscountPct,
      impliedSeriesAValue,
      valueGain,
      paperRoiMultiple,
    }
  }, [investmentAmount, valuationCap, companyCapitalization, seriesAPreMoney, hasDiscount, discountRate])

  // Sensitivity scenarios across different Series A pre-money valuations
  const scenarioResults = React.useMemo(() => {
    const inv = Math.max(1, investmentAmount)
    const cap = Math.max(1, valuationCap)
    const shares = Math.max(1, companyCapitalization)
    const disc = hasDiscount ? Math.max(0, Math.min(99, discountRate)) : 0

    return SCENARIO_VALUATIONS.map((scenarioValuation) => {
      const seriesAPrice = scenarioValuation / shares
      const capPrice = cap / shares
      const discountPrice = hasDiscount ? seriesAPrice * (1 - disc / 100) : seriesAPrice

      let convPrice = capPrice
      let mechanism = 'Valuation Cap'
      if (hasDiscount && discountPrice < capPrice) {
        convPrice = discountPrice
        mechanism = `Discount (${disc}%)`
      }

      const issuedShares = convPrice > 0 ? Math.round(inv / convPrice) : 0
      const ownershipPct = (issuedShares / shares) * 100
      const effectiveDiscount = seriesAPrice > 0 ? Math.max(0, ((seriesAPrice - convPrice) / seriesAPrice) * 100) : 0
      const impliedValue = issuedShares * seriesAPrice
      const isCurrentTarget = scenarioValuation === seriesAPreMoney

      return {
        valuation: scenarioValuation,
        seriesAPrice,
        convPrice,
        mechanism,
        issuedShares,
        ownershipPct,
        effectiveDiscount,
        impliedValue,
        isCurrentTarget,
      }
    })
  }, [investmentAmount, valuationCap, companyCapitalization, hasDiscount, discountRate, seriesAPreMoney])

  const copySummary = React.useCallback(() => {
    const c = calculations
    const text = `YC Post-Money SAFE Conversion Summary:
- Investment Amount: ${fmtCurrency(investmentAmount)}
- Valuation Cap: ${fmtCurrency(valuationCap)}
- Series A Target: ${fmtCurrency(seriesAPreMoney)} Pre-Money
- Investor Ownership: ${fmtPercent(c.safeOwnershipPct)} (${fmtNumber(c.safeShares)} shares)
- Conversion Price: ${fmtCurrency(c.conversionPrice)} / share (vs Series A ${fmtCurrency(c.seriesAPricePerShare)})
- Effective Discount: ${fmtPercent(c.effectiveDiscountPct)}
- Governing Term: ${c.governingMechanism === 'cap' ? 'Valuation Cap' : 'Discount Rate'}`

    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }, [calculations, investmentAmount, valuationCap, seriesAPreMoney])

  return (
    <div
      data-slot="safe-note-calculator"
      className={cn('mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8', className)}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <Badge wrap variant="outline" className="gap-1.5 px-3 py-1 text-xs font-medium tracking-wider uppercase">
          <Scale className="text-primary size-3.5" />
          YC Post-Money SAFE v1.1 · Valuation Cap + Discount
        </Badge>
        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Y Combinator Post-Money SAFE Calculator
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-base">
            Model founder dilution, investor ownership percentages, and conversion price per share.
          </p>
        </div>

        {/* Preset Tabs */}
        <div className="mt-2 flex w-full justify-center">
          <Tabs value={selectedPreset} onValueChange={handlePresetChange} className="w-full sm:w-auto">
            <TabsList variant="segmented" className="grid w-full grid-cols-2 sm:flex sm:w-auto">
              <TabsTrigger value="seed-standard" className="gap-1.5">
                <ShieldCheck className="size-3.5" />
                Standard Seed
              </TabsTrigger>
              <TabsTrigger value="preseed-safe" className="gap-1.5">
                <TrendingUp className="size-3.5" />
                Pre-Seed SAFE
              </TabsTrigger>
              <TabsTrigger value="uncapped-discount" className="gap-1.5">
                <BadgePercent className="size-3.5" />
                Uncapped Disc
              </TabsTrigger>
              <TabsTrigger value="bridge-round" className="gap-1.5">
                <Layers className="size-3.5" />
                Growth Bridge
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 2-Column Calculator Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Input Card */}
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="text-primary size-5" />
                SAFE Terms & Round Inputs
              </CardTitle>
              <CardDescription>
                Configure investment size, valuation cap, optional discount rate, capitalization, and Series A targets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-7">
              {/* 1. Investment Amount */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-foreground text-sm font-medium">Investment Amount</span>
                    <p className="text-muted-foreground text-xs">Total cash invested into the SAFE.</p>
                  </div>
                  <div className="w-36 sm:w-44">
                    <Input
                      id="safe-investment-input"
                      type="number"
                      size="small"
                      min={25000}
                      max={10000000}
                      step={25000}
                      prefix="$"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="pb-5">
                  <Slider
                    value={[investmentAmount]}
                    min={100000}
                    max={5000000}
                    step={25000}
                    marks={INVESTMENT_MARKS}
                    tooltip={(val) => `$${val.toLocaleString('en-US')}`}
                    onValueChange={(val) => setInvestmentAmount(val[0] ?? 0)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground text-xs">Quick select:</span>
                  {[250000, 500000, 1000000, 1500000, 2000000, 3000000].map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setInvestmentAmount(amt)}
                    >
                      ${amt >= 1000000 ? `${(amt / 1000000).toFixed(amt % 1000000 === 0 ? 0 : 1)}M` : `${amt / 1000}K`}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 2. Post-Money Valuation Cap */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-foreground text-sm font-medium">Post-Money Valuation Cap</span>
                    <p className="text-muted-foreground text-xs">Maximum valuation ceiling for conversion.</p>
                  </div>
                  <div className="w-36 sm:w-44">
                    <Input
                      id="safe-cap-input"
                      type="number"
                      size="small"
                      min={500000}
                      max={100000000}
                      step={500000}
                      prefix="$"
                      value={valuationCap}
                      onChange={(e) => setValuationCap(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="pb-5">
                  <Slider
                    value={[valuationCap]}
                    min={2000000}
                    max={50000000}
                    step={500000}
                    marks={VALUATION_CAP_MARKS}
                    tooltip={(val) => `$${val.toLocaleString('en-US')}`}
                    onValueChange={(val) => setValuationCap(val[0] ?? 0)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground text-xs">Cap benchmarks:</span>
                  {[5000000, 8000000, 12000000, 15000000, 20000000, 30000000].map((cap) => (
                    <Button
                      key={cap}
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setValuationCap(cap)}
                    >
                      ${(cap / 1000000).toFixed(0)}M
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 3. Discount Rate Input & Toggle */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-medium">Discount Rate Clause</span>
                      {hasDiscount ? (
                        <Badge
                          wrap
                          variant="outline"
                          className="border-emerald-500/20 bg-emerald-500/10 text-xs font-normal text-emerald-600 dark:text-emerald-400"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge wrap variant="outline" className="text-muted-foreground text-xs font-normal">
                          Cap Only
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Percentage discount on Series A price if cap is not exceeded.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Switch
                      checked={hasDiscount}
                      onCheckedChange={setHasDiscount}
                      aria-label="Toggle discount clause"
                    />
                    {hasDiscount && (
                      <div className="w-24 sm:w-28">
                        <Input
                          id="safe-discount-input"
                          type="number"
                          size="small"
                          min={0}
                          max={50}
                          step={1}
                          suffix="%"
                          value={discountRate}
                          onChange={(e) => setDiscountRate(Number(e.target.value) || 0)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {hasDiscount && (
                  <div className="space-y-3 pt-1">
                    <div className="pb-5">
                      <Slider
                        value={[discountRate]}
                        min={5}
                        max={35}
                        step={1}
                        marks={DISCOUNT_RATE_MARKS}
                        tooltip={(val) => `${val}% Discount`}
                        onValueChange={(val) => setDiscountRate(val[0] ?? 0)}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-muted-foreground text-xs">Standard rates:</span>
                      {[10, 15, 20, 25, 30].map((rate) => (
                        <Button
                          key={rate}
                          variant={discountRate === rate ? 'default' : 'outline'}
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setDiscountRate(rate)}
                        >
                          {rate}%
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 4. Company Existing Capitalization */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-foreground text-sm font-medium">Company Existing Capitalization</span>
                    <p className="text-muted-foreground text-xs">Total pre-conversion issued shares and option pool.</p>
                  </div>
                  <div className="w-36 sm:w-44">
                    <Input
                      id="safe-shares-input"
                      type="number"
                      size="small"
                      min={1000000}
                      max={100000000}
                      step={500000}
                      suffix="Shares"
                      value={companyCapitalization}
                      onChange={(e) => setCompanyCapitalization(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground text-xs">Common share counts:</span>
                  {[5000000, 8000000, 10000000, 12000000, 15000000].map((count) => (
                    <Button
                      key={count}
                      variant={companyCapitalization === count ? 'default' : 'outline'}
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setCompanyCapitalization(count)}
                    >
                      {(count / 1000000).toFixed(0)}M Shares
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 5. Series A Pre-Money Target */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-foreground text-sm font-medium">Series A Pre-Money Target</span>
                    <p className="text-muted-foreground text-xs">Target qualified financing equity valuation.</p>
                  </div>
                  <div className="w-36 sm:w-44">
                    <Input
                      id="safe-series-a-input"
                      type="number"
                      size="small"
                      min={1000000}
                      max={200000000}
                      step={1000000}
                      prefix="$"
                      value={seriesAPreMoney}
                      onChange={(e) => setSeriesAPreMoney(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="pb-5">
                  <Slider
                    value={[seriesAPreMoney]}
                    min={5000000}
                    max={80000000}
                    step={1000000}
                    marks={SERIES_A_MARKS}
                    tooltip={(val) => `$${val.toLocaleString('en-US')}`}
                    onValueChange={(val) => setSeriesAPreMoney(val[0] ?? 0)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground text-xs">Series A benchmarks:</span>
                  {[15000000, 20000000, 25000000, 35000000, 50000000, 75000000].map((target) => (
                    <Button
                      key={target}
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setSeriesAPreMoney(target)}
                    >
                      ${(target / 1000000).toFixed(0)}M
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Results Card (Sticky on desktop) */}
        <div className="lg:sticky lg:top-8 lg:col-span-5">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Investor Ownership Stake
                </span>
                <Badge
                  variant="secondary"
                  className={
                    calculations.governingMechanism === 'cap'
                      ? 'bg-primary/10 text-primary border-primary/20 text-xs font-semibold'
                      : 'border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400'
                  }
                >
                  {calculations.governingMechanism === 'cap' ? 'Cap Governs' : 'Discount Governs'}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                    {fmtPercent(calculations.safeOwnershipPct)}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">Post-SAFE Ownership</span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  SAFE investor receives{' '}
                  <span className="text-foreground font-semibold tabular-nums">
                    {fmtNumber(calculations.safeShares)}
                  </span>{' '}
                  shares at conversion.
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <Separator />

              {/* Key Economics Metrics Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="bg-muted/40 rounded-lg border p-3">
                  <span className="text-muted-foreground block text-xs">SAFE Conversion Price</span>
                  <span className="text-foreground text-base font-bold tabular-nums">
                    {fmtCurrency(calculations.conversionPrice)}
                  </span>
                  <span className="text-muted-foreground block text-xs tabular-nums">
                    vs Series A {fmtCurrency(calculations.seriesAPricePerShare)}
                  </span>
                </div>

                <div className="bg-muted/40 rounded-lg border p-3">
                  <span className="text-muted-foreground block text-xs">Converted Shares Issued</span>
                  <span className="text-foreground text-base font-bold tabular-nums">
                    {fmtNumber(calculations.safeShares)}
                  </span>
                  <span className="text-muted-foreground block text-xs">Equity units</span>
                </div>

                <div className="bg-muted/40 rounded-lg border p-3">
                  <span className="text-muted-foreground block text-xs">Effective Discount</span>
                  <span className="text-base font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                    {fmtPercent(calculations.effectiveDiscountPct)}
                  </span>
                  <span className="text-muted-foreground block text-xs">Savings vs Series A</span>
                </div>

                <div className="bg-muted/40 rounded-lg border p-3">
                  <span className="text-muted-foreground block text-xs">Implied Series A Value</span>
                  <span className="text-foreground text-base font-bold tabular-nums">
                    {fmtCurrencyWhole(calculations.impliedSeriesAValue)}
                  </span>
                  <span className="block text-xs text-emerald-600 tabular-nums dark:text-emerald-400">
                    +{fmtCurrencyWhole(calculations.valueGain)} ({calculations.paperRoiMultiple.toFixed(2)}x)
                  </span>
                </div>
              </div>

              <Separator />

              {/* Visual Equity Distribution Bar */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground">Founders vs. SAFE Investor</span>
                  <span className="text-muted-foreground tabular-nums">
                    {fmtPercent(calculations.founderOwnershipPct)} / {fmtPercent(calculations.safeOwnershipPct)}
                  </span>
                </div>
                <div className="bg-muted relative flex h-3 w-full overflow-hidden rounded-full shadow-inner">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${calculations.founderOwnershipPct}%` }}
                  />
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${calculations.safeOwnershipPct}%` }}
                  />
                </div>
                <div className="text-muted-foreground flex flex-col gap-1.5 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-primary size-2 shrink-0 rounded-full" />
                    <span>
                      Founders: {fmtPercent(calculations.founderOwnershipPct)} ({fmtNumber(calculations.founderShares)}{' '}
                      sh)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                    <span>
                      SAFE: {fmtPercent(calculations.safeOwnershipPct)} ({fmtNumber(calculations.safeShares)} sh)
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Post-Conversion Dilution Breakdown Table */}
              <div className="space-y-2">
                <span className="text-foreground text-xs font-semibold tracking-wider uppercase">
                  Post-Conversion Dilution Breakdown
                </span>
                <div className="overflow-hidden rounded-lg border">
                  <div className="overflow-x-auto">
                    <Table density="compact">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Stakeholder</TableHead>
                          <TableHead className="text-right text-xs">Ownership</TableHead>
                          <TableHead className="text-right text-xs">Shares</TableHead>
                          <TableHead className="text-right text-xs">Implied Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-xs font-medium">Founders & Existing</TableCell>
                          <TableCell className="text-right text-xs font-medium tabular-nums">
                            {fmtPercent(calculations.founderOwnershipPct)}
                          </TableCell>
                          <TableCell className="text-right text-xs tabular-nums">
                            {fmtNumber(calculations.founderShares)}
                          </TableCell>
                          <TableCell className="text-right text-xs tabular-nums">
                            {fmtCurrencyWhole(calculations.founderShares * calculations.seriesAPricePerShare)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            SAFE Seed Investors
                          </TableCell>
                          <TableCell className="text-right text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                            {fmtPercent(calculations.safeOwnershipPct)}
                          </TableCell>
                          <TableCell className="text-right text-xs font-semibold tabular-nums">
                            {fmtNumber(calculations.safeShares)}
                          </TableCell>
                          <TableCell className="text-right text-xs font-semibold tabular-nums">
                            {fmtCurrencyWhole(calculations.impliedSeriesAValue)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell className="text-xs font-bold">Total Post-SAFE</TableCell>
                          <TableCell className="text-right text-xs font-bold tabular-nums">100.00%</TableCell>
                          <TableCell className="text-right text-xs font-bold tabular-nums">
                            {fmtNumber(calculations.totalShares)}
                          </TableCell>
                          <TableCell className="text-right text-xs font-bold tabular-nums">
                            {fmtCurrencyWhole(seriesAPreMoney)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Key SAFE Takeaways Checklist */}
              <ul className="text-muted-foreground space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary size-3.5 shrink-0" />
                  <span>Post-money cap fixes ownership before Series A round</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary size-3.5 shrink-0" />
                  <span>Converts to Preferred Stock with investor liquidation preference</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary size-3.5 shrink-0" />
                  <span>No debt maturity dates, no interest accrual compounding</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter className="flex flex-col gap-2.5 pt-2">
              <Button className="w-full gap-2 font-semibold shadow-xs" size="lg" onClick={copySummary}>
                {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                {copied ? 'Copied Summary to Clipboard!' : 'Copy Valuation Breakdown'}
              </Button>
              <Button variant="outline" className="w-full gap-2" size="default">
                <FileSpreadsheet className="size-4" />
                Export Cap Table Summary
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Series A Valuation Sensitivity Table */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary size-5" />
              Series A Qualified Financing Sensitivity Matrix
            </CardTitle>
            <CardDescription>
              Simulate how SAFE investor ownership percentage, share price, and conversion mechanism respond across
              different next-round valuations.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table density="cozy">
              <TableHeader>
                <TableRow>
                  <TableHead>Series A Valuation</TableHead>
                  <TableHead className="text-right">Series A Price</TableHead>
                  <TableHead className="text-right">SAFE Conversion Price</TableHead>
                  <TableHead>Governing Term</TableHead>
                  <TableHead className="text-right">Shares Issued</TableHead>
                  <TableHead className="text-right">SAFE Ownership</TableHead>
                  <TableHead className="text-right">Effective Savings</TableHead>
                  <TableHead className="text-right">Implied Stake Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarioResults.map((row) => (
                  <TableRow key={row.valuation} className={row.isCurrentTarget ? 'bg-primary/5 font-medium' : ''}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums">{fmtCurrencyWhole(row.valuation)}</span>
                        {row.isCurrentTarget && (
                          <Badge wrap variant="default" className="h-5 px-1.5 text-xs">
                            Current Target
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{fmtCurrency(row.seriesAPrice)}</TableCell>
                    <TableCell className="text-foreground text-right font-semibold tabular-nums">
                      {fmtCurrency(row.convPrice)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          row.mechanism === 'Valuation Cap'
                            ? 'border-primary/20 bg-primary/10 text-primary text-xs'
                            : 'border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400'
                        }
                      >
                        {row.mechanism}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{fmtNumber(row.issuedShares)}</TableCell>
                    <TableCell className="text-foreground text-right font-bold tabular-nums">
                      {fmtPercent(row.ownershipPct)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                      {fmtPercent(row.effectiveDiscount)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {fmtCurrencyWhole(row.impliedValue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Post-Money SAFE Legal & Governance Guide */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary mt-0.5 rounded-md p-2">
              <ShieldCheck className="size-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-foreground text-sm font-semibold">Post-Money Cap Protection</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Acts as an ownership percentage guarantee for seed investors prior to the priced round, regardless of
                subsequent SAFE issuances.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <Percent className="size-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-foreground text-sm font-semibold">Discount Rate Safety Net</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Protects investors if Series A prices below the valuation cap, guaranteeing a 15%–25% discount off the
                institutional share price.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <PieChart className="size-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-foreground text-sm font-semibold">Founder Dilution Transparency</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                YC v1.1 post-money SAFEs dilute only founders and common shareholders, eliminating pre-money SAFE
                circular dilution surprises.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SafeNoteCalculator
