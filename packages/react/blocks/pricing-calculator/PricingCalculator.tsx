'use client'

import * as React from 'react'
import { ArrowRight, Check, HardDrive, Headphones, KeyRound, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

interface RequestTier {
  label: string
  requests: number
  cost: number
}

interface StorageTier {
  label: string
  gb: number
  cost: number
}

const REQUEST_TIERS: RequestTier[] = [
  { label: '10K requests', requests: 10_000, cost: 0 },
  { label: '50K requests', requests: 50_000, cost: 25 },
  { label: '100K requests', requests: 100_000, cost: 60 },
  { label: '250K requests', requests: 250_000, cost: 120 },
  { label: '500K requests', requests: 500_000, cost: 220 },
  { label: '1M requests', requests: 1_000_000, cost: 400 },
  { label: '2.5M requests', requests: 2_500_000, cost: 750 },
  { label: '5M requests', requests: 5_000_000, cost: 1200 },
]

const STORAGE_TIERS: StorageTier[] = [
  { label: '100 GB', gb: 100, cost: 10 },
  { label: '250 GB', gb: 250, cost: 25 },
  { label: '500 GB', gb: 500, cost: 45 },
  { label: '1 TB', gb: 1_000, cost: 80 },
  { label: '2 TB', gb: 2_000, cost: 150 },
  { label: '5 TB', gb: 5_000, cost: 320 },
  { label: '10 TB', gb: 10_000, cost: 580 },
]

const SEAT_PRICE = 15
const SUPPORT_MANAGER_PRICE = 200
const CUSTOM_SLA_PRICE = 500
const SSO_PRICE = 100

const SEAT_MARKS = {
  1: '1',
  25: '25',
  50: '50',
  75: '75',
  100: '100',
}

const REQUEST_MARKS = {
  0: '10K',
  2: '100K',
  4: '500K',
  7: '5M',
}

const STORAGE_MARKS = {
  0: '100 GB',
  2: '500 GB',
  4: '2 TB',
  6: '10 TB',
}

export function PricingCalculator({ className }: { className?: string }) {
  const [isAnnual, setIsAnnual] = React.useState(true)
  const [seats, setSeats] = React.useState(12)
  const [requestIndex, setRequestIndex] = React.useState(2)
  const [storageIndex, setStorageIndex] = React.useState(2)
  const [addonSupport, setAddonSupport] = React.useState(false)
  const [addonSla, setAddonSla] = React.useState(false)
  const [addonSso, setAddonSso] = React.useState(true)

  const currentRequestTier = REQUEST_TIERS[requestIndex] ?? REQUEST_TIERS[0]
  const currentStorageTier = STORAGE_TIERS[storageIndex] ?? STORAGE_TIERS[0]

  const seatTier = React.useMemo(() => {
    if (seats <= 5) return { label: 'Starter Team', variant: 'secondary' as const }
    if (seats <= 25) return { label: 'Growth Team', variant: 'outline' as const }
    return { label: 'Scale Team', variant: 'default' as const }
  }, [seats])

  const recommendedPlan = React.useMemo(() => {
    if (addonSla || requestIndex >= 6 || storageIndex >= 5 || seats >= 30) {
      return { name: 'Enterprise', badge: 'Enterprise Plan', baseFee: 199, variant: 'default' as const }
    }
    if (seats >= 8 || requestIndex >= 3 || storageIndex >= 3 || addonSupport) {
      return { name: 'Growth', badge: 'Growth Plan', baseFee: 79, variant: 'default' as const }
    }
    return { name: 'Starter', badge: 'Starter Plan', baseFee: 29, variant: 'secondary' as const }
  }, [addonSla, requestIndex, storageIndex, seats, addonSupport])

  const baseCost = recommendedPlan.baseFee
  const seatsCost = seats * SEAT_PRICE
  const requestsCost = currentRequestTier.cost
  const storageCost = currentStorageTier.cost
  const addonsCost =
    (addonSupport ? SUPPORT_MANAGER_PRICE : 0) + (addonSla ? CUSTOM_SLA_PRICE : 0) + (addonSso ? SSO_PRICE : 0)

  const activeAddonsCount = (addonSupport ? 1 : 0) + (addonSla ? 1 : 0) + (addonSso ? 1 : 0)

  const subtotalMonthly = baseCost + seatsCost + requestsCost + storageCost + addonsCost
  const discountMultiplier = isAnnual ? 0.8 : 1.0
  const totalMonthly = Math.round(subtotalMonthly * discountMultiplier)
  const totalAnnual = totalMonthly * 12
  const annualSavings = Math.round(subtotalMonthly * 0.2 * 12)

  return (
    <div
      data-slot="pricing-calculator"
      className={cn('mx-auto w-full max-w-6xl space-y-10 p-4 sm:p-6 lg:p-8', className)}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs font-medium tracking-wider uppercase">
          <Sparkles className="text-primary size-3.5" />
          Pricing Calculator
        </Badge>
        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Interactive Pricing Calculator
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-base">
            Calculate your exact monthly or annual investment based on usage.
          </p>
        </div>

        <div className="border-border bg-card mt-2 inline-flex items-center gap-3 rounded-full border px-4 py-2 shadow-xs">
          <span
            className={cn(
              'text-xs font-medium transition-colors',
              !isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground',
            )}
          >
            Monthly
          </span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span
            className={cn(
              'text-xs font-medium transition-colors',
              isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground',
            )}
          >
            Pay Annually
          </span>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
            Save 20%
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Capacity &amp; Scale</CardTitle>
              <CardDescription>Configure team seats, API request throughput, and dedicated storage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary/10 text-primary border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-md border">
                      <Users className="size-4" />
                    </div>
                    <div>
                      <span className="text-foreground text-sm font-medium">Team Seats</span>
                      <Badge variant={seatTier.variant} className="ml-2 text-xs font-normal">
                        {seatTier.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-foreground text-base font-semibold tabular-nums">{seats}</span>
                    <span className="text-muted-foreground text-xs"> seats (${seats * SEAT_PRICE}/mo)</span>
                  </div>
                </div>
                <div className="pb-6">
                  <Slider
                    value={[seats]}
                    min={1}
                    max={100}
                    step={1}
                    marks={SEAT_MARKS}
                    tooltip={(val) => `${val} seats`}
                    onValueChange={(val) => setSeats(val[0])}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Full workspace access, fine-grained permission controls, and audit log tracking for each member.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary/10 text-primary border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-md border">
                      <Zap className="size-4" />
                    </div>
                    <div>
                      <span className="text-foreground text-sm font-medium">Monthly API Requests</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-foreground text-base font-semibold tabular-nums">
                      {currentRequestTier.label}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {' '}
                      ({currentRequestTier.cost === 0 ? 'Included' : `+$${currentRequestTier.cost}/mo`})
                    </span>
                  </div>
                </div>
                <div className="pb-6">
                  <Slider
                    value={[requestIndex]}
                    min={0}
                    max={REQUEST_TIERS.length - 1}
                    step={1}
                    marks={REQUEST_MARKS}
                    tooltip={(idx) => REQUEST_TIERS[idx]?.label ?? ''}
                    onValueChange={(val) => setRequestIndex(val[0])}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Globally distributed edge endpoints, automatic rate limiting, and sub-50ms p99 latency SLA.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary/10 text-primary border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-md border">
                      <HardDrive className="size-4" />
                    </div>
                    <div>
                      <span className="text-foreground text-sm font-medium">Dedicated Cloud Storage</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-foreground text-base font-semibold tabular-nums">
                      {currentStorageTier.label}
                    </span>
                    <span className="text-muted-foreground text-xs"> (+${currentStorageTier.cost}/mo)</span>
                  </div>
                </div>
                <div className="pb-6">
                  <Slider
                    value={[storageIndex]}
                    min={0}
                    max={STORAGE_TIERS.length - 1}
                    step={1}
                    marks={STORAGE_MARKS}
                    tooltip={(idx) => STORAGE_TIERS[idx]?.label ?? ''}
                    onValueChange={(val) => setStorageIndex(val[0])}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Encrypted at rest (AES-256) with multi-region automated replication and daily disaster backups.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise Add-ons</CardTitle>
              <CardDescription>
                Enhance your infrastructure with enterprise compliance, reliability, and support.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-border bg-card hover:border-primary/30 flex flex-col justify-between gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border">
                    <Headphones className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-medium">Dedicated Support Manager</span>
                      <Badge variant="outline" className="text-xs font-normal">
                        +$200/mo
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Direct Slack channel, named technical account manager &amp; 1-hour response SLA.
                    </p>
                  </div>
                </div>
                <div className="flex sm:justify-end">
                  <Switch checked={addonSupport} onCheckedChange={setAddonSupport} />
                </div>
              </div>

              <div className="border-border bg-card hover:border-primary/30 flex flex-col justify-between gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-medium">Custom SLA Guarantee</span>
                      <Badge variant="outline" className="text-xs font-normal">
                        +$500/mo
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      99.99% uptime guarantee with financial commitments and priority disaster recovery.
                    </p>
                  </div>
                </div>
                <div className="flex sm:justify-end">
                  <Switch checked={addonSla} onCheckedChange={setAddonSla} />
                </div>
              </div>

              <div className="border-border bg-card hover:border-primary/30 flex flex-col justify-between gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border">
                    <KeyRound className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-medium">Single Sign-On (SSO / SAML)</span>
                      <Badge variant="outline" className="text-xs font-normal">
                        +$100/mo
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Okta, Azure AD, Google Workspace, and SAML 2.0 enterprise identity integration.
                    </p>
                  </div>
                </div>
                <div className="flex sm:justify-end">
                  <Switch checked={addonSso} onCheckedChange={setAddonSso} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-8 lg:col-span-5">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Estimated Investment
                </span>
                <Badge variant={recommendedPlan.variant} className="gap-1 shadow-xs">
                  {recommendedPlan.name === 'Enterprise' && <Sparkles className="size-3" />}
                  {recommendedPlan.badge}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                    ${totalMonthly}
                  </span>
                  <span className="text-muted-foreground text-sm font-normal"> / month</span>
                </div>
                {isAnnual ? (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Billed annually (${totalAnnual.toLocaleString('en-US')}/yr) ·
                    <span className="text-success font-semibold">
                      {' '}
                      Save ${annualSavings.toLocaleString('en-US')}/yr
                    </span>
                  </p>
                ) : (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Billed monthly · Switch to annual to save 20% (${annualSavings.toLocaleString('en-US')}/yr)
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Base platform ({recommendedPlan.name})</span>
                  <span className="font-medium tabular-nums">
                    ${isAnnual ? Math.round(baseCost * 0.8) : baseCost}/mo
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Team seats ({seats} × ${SEAT_PRICE})
                  </span>
                  <span className="font-medium tabular-nums">
                    ${isAnnual ? Math.round(seatsCost * 0.8) : seatsCost}/mo
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">API throughput ({currentRequestTier.label})</span>
                  <span className="font-medium tabular-nums">
                    {requestsCost === 0
                      ? 'Included'
                      : `$${isAnnual ? Math.round(requestsCost * 0.8) : requestsCost}/mo`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cloud storage ({currentStorageTier.label})</span>
                  <span className="font-medium tabular-nums">
                    ${isAnnual ? Math.round(storageCost * 0.8) : storageCost}/mo
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Add-ons ({activeAddonsCount} active)</span>
                  <span className="font-medium tabular-nums">
                    {addonsCost === 0 ? '$0/mo' : `$${isAnnual ? Math.round(addonsCost * 0.8) : addonsCost}/mo`}
                  </span>
                </div>
                {isAnnual && (
                  <div className="bg-success/10 text-success flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium">
                    <span>Annual discount applied</span>
                    <span className="font-semibold tabular-nums">20% off</span>
                  </div>
                )}
              </div>
              <Separator />
              <ul className="text-muted-foreground space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <Check className="text-primary size-3.5 shrink-0" />
                  <span>14-day fully featured free trial</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary size-3.5 shrink-0" />
                  <span>No credit card required upfront</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary size-3.5 shrink-0" />
                  <span>Zero-downtime migration assistance</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-2.5 pt-2">
              <Button className="w-full gap-2 font-semibold shadow-xs" size="lg">
                Start 14-Day Free Trial
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" className="w-full" size="default">
                Request Custom Quote
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
