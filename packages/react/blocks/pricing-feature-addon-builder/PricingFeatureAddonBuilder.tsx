import * as React from 'react'
import { ArrowRight, Calculator, Check, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface PricingPlan {
  id: string
  name: string
  monthlyPrice: number
  description: string
  includedSeats: number
}

export interface PricingAddon {
  id: string
  name: string
  monthlyPrice: number
  description: string
  category: string
}

export interface PricingFeatureAddonBuilderProps {
  title?: string
  description?: string
  plans?: PricingPlan[]
  addons?: PricingAddon[]
  className?: string
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Tier',
    monthlyPrice: 29,
    description: 'For indie developers and early-stage prototypes needing unbundled speed.',
    includedSeats: 2,
  },
  {
    id: 'growth',
    name: 'Growth Core',
    monthlyPrice: 99,
    description: 'For scaling product engineering teams building high-conversion platforms.',
    includedSeats: 5,
  },
  {
    id: 'scale',
    name: 'Scale Enterprise',
    monthlyPrice: 299,
    description: 'For mission-critical production clusters requiring sub-10ms global edge delivery.',
    includedSeats: 15,
  },
]

const DEFAULT_ADDONS: PricingAddon[] = [
  {
    id: 'dedicated-ip',
    name: 'Dedicated Static Edge IP',
    monthlyPrice: 49,
    description: 'Static IPv4/IPv6 address allocations with zero-reputation penalty.',
    category: 'Network',
  },
  {
    id: 'audit-logs',
    name: 'Immutable SOC2 Audit Logs',
    monthlyPrice: 79,
    description: 'Cryptographically signed telemetry logs with 365-day cold storage retention.',
    category: 'Security',
  },
  {
    id: 'multi-region',
    name: 'Multi-Region Active-Active Mesh',
    monthlyPrice: 129,
    description: 'Synchronized cross-continental database replicas and automatic DNS failover.',
    category: 'Reliability',
  },
  {
    id: 'priority-sla',
    name: '1-Hour Enterprise Response SLA',
    monthlyPrice: 199,
    description: 'Direct Slack / Discord hotline with senior design engineering staff.',
    category: 'Support',
  },
]

export function PricingFeatureAddonBuilder({
  title = 'Build your custom plan with transparent, zero-surprise pricing.',
  description = 'Select your base tier, adjust seat allocations, and toggle modular enterprise add-ons with real-time invoice calculations.',
  plans = DEFAULT_PLANS,
  addons = DEFAULT_ADDONS,
  className,
}: PricingFeatureAddonBuilderProps) {
  const [selectedPlanId, setSelectedPlanId] = React.useState('growth')
  const [selectedAddonIds, setSelectedAddonIds] = React.useState<string[]>(['dedicated-ip', 'audit-logs'])
  const [seatCount, setSeatCount] = React.useState(8)
  const [isAnnual, setIsAnnual] = React.useState(true)

  const selectedPlan = React.useMemo(() => {
    return plans.find((p) => p.id === selectedPlanId) || plans[0]
  }, [plans, selectedPlanId])

  const extraSeats = React.useMemo(() => {
    return Math.max(0, seatCount - selectedPlan.includedSeats)
  }, [seatCount, selectedPlan])

  const extraSeatCost = React.useMemo(() => extraSeats * 15, [extraSeats])

  const totalAddonsCost = React.useMemo(() => {
    return addons.filter((a) => selectedAddonIds.includes(a.id)).reduce((sum, a) => sum + a.monthlyPrice, 0)
  }, [addons, selectedAddonIds])

  const monthlySubtotal = React.useMemo(() => {
    return selectedPlan.monthlyPrice + extraSeatCost + totalAddonsCost
  }, [selectedPlan, extraSeatCost, totalAddonsCost])

  const finalMonthlyRate = React.useMemo(() => {
    if (isAnnual) {
      return Math.round(monthlySubtotal * 0.8)
    }
    return monthlySubtotal
  }, [isAnnual, monthlySubtotal])

  const annualSavings = React.useMemo(() => {
    return (monthlySubtotal - Math.round(monthlySubtotal * 0.8)) * 12
  }, [monthlySubtotal])

  function toggleAddon(addonId: string) {
    if (selectedAddonIds.includes(addonId)) {
      setSelectedAddonIds(selectedAddonIds.filter((id) => id !== addonId))
    } else {
      setSelectedAddonIds([...selectedAddonIds, addonId])
    }
  }

  return (
    <section
      data-slot="pricing-feature-addon-builder"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#pricing-calculator"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <Calculator className="text-primary size-3.5" />
            <span>Real-time Add-on Cost Synthesizer</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>

          {/* Billing Cadence Toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span
              className={cn(
                'text-xs font-medium',
                !isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground',
              )}
            >
              Monthly Billing
            </span>
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:outline-none',
                isAnnual ? 'bg-primary' : 'bg-muted',
              )}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <span
                className={cn(
                  'bg-background pointer-events-none inline-block size-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out',
                  isAnnual ? 'translate-x-5' : 'translate-x-0',
                )}
              />
            </button>
            <span
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium',
                isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground',
              )}
            >
              <span>Annual Billing</span>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-500">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Add-on Builder Workbench */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Plan Selection & Addon Toggles (7 Cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Step 1: Base Tier Cards */}
            <div className="space-y-3">
              <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Step 1: Choose Base Core Tier
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    className={cn(
                      'flex flex-col justify-between rounded-xl border p-4 text-left transition-all',
                      selectedPlanId === plan.id
                        ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                        : 'border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    <div>
                      <div className="text-foreground text-xs font-bold">{plan.name}</div>
                      <div className="text-foreground mt-1 font-mono text-lg font-bold">
                        ${plan.monthlyPrice}
                        <span className="text-muted-foreground text-xs font-normal">/mo</span>
                      </div>
                    </div>
                    <div className="text-muted-foreground mt-2 text-xs">
                      Includes {plan.includedSeats} engineer seats
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Seat Allocation Slider */}
            <Card className="border-border bg-card/60 shadow-2xs">
              <CardContent className="space-y-2.5 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-bold">Engineer Team Seats</span>
                  <span className="text-foreground font-mono text-sm font-bold">
                    {seatCount} seats (${extraSeatCost}/mo extra)
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={seatCount}
                  onChange={(e) => setSeatCount(parseInt(e.target.value))}
                  className="accent-primary w-full cursor-pointer"
                />
                <div className="text-muted-foreground flex justify-between font-mono text-xs">
                  <span>2 seats</span>
                  <span>50 seats</span>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Enterprise Add-ons Checklist */}
            <div className="space-y-3">
              <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Step 3: Select Modular Capabilities
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {addons.map((addon) => (
                  <button
                    key={addon.id}
                    type="button"
                    className={cn(
                      'flex items-center justify-between rounded-xl border p-3.5 text-left transition-all',
                      selectedAddonIds.includes(addon.id)
                        ? 'border-primary/60 bg-primary/5 shadow-2xs'
                        : 'border-border bg-card hover:bg-muted/30 text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded border transition-colors',
                          selectedAddonIds.includes(addon.id)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background',
                        )}
                      >
                        {selectedAddonIds.includes(addon.id) ? <Check className="size-3.5" /> : null}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground text-xs font-bold">{addon.name}</span>
                          <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                            {addon.category}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground truncate text-xs">{addon.description}</div>
                      </div>
                    </div>

                    <div className="text-foreground shrink-0 pl-2 font-mono text-xs font-bold">
                      +${addon.monthlyPrice}
                      <span className="text-muted-foreground text-xs font-normal">/mo</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Real-time Invoice Estimate Card (5 Cols) */}
          <div className="lg:col-span-5">
            <Card className="border-border bg-card/90 sticky top-8 shadow-md backdrop-blur-xs">
              <CardContent className="space-y-6 p-6">
                <div className="border-border flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-primary size-4" />
                    <span className="text-foreground text-sm font-semibold">Estimated Monthly Invoice</span>
                  </div>
                  <Badge variant="outline" className="border-border text-primary font-mono text-xs">
                    {isAnnual ? 'Annualized' : 'Monthly'}
                  </Badge>
                </div>

                {/* Price Breakdown List */}
                <div className="space-y-3 text-xs">
                  <div className="text-muted-foreground flex justify-between">
                    <span>{selectedPlan.name}</span>
                    <span className="text-foreground font-mono">${selectedPlan.monthlyPrice}.00</span>
                  </div>

                  {extraSeats > 0 ? (
                    <div className="text-muted-foreground flex justify-between">
                      <span>Extra Seats ({extraSeats} &times; $15)</span>
                      <span className="text-foreground font-mono">${extraSeatCost}.00</span>
                    </div>
                  ) : null}

                  {addons
                    .filter((a) => selectedAddonIds.includes(a.id))
                    .map((addon) => (
                      <div key={addon.id} className="text-muted-foreground flex justify-between">
                        <span className="truncate pr-2">{addon.name}</span>
                        <span className="text-foreground font-mono">${addon.monthlyPrice}.00</span>
                      </div>
                    ))}

                  {isAnnual ? (
                    <div className="border-border/60 flex justify-between border-t pt-2 font-medium text-emerald-500">
                      <span>Annual Billing Discount (20%)</span>
                      <span className="font-mono">&minus;${monthlySubtotal - finalMonthlyRate}.00</span>
                    </div>
                  ) : null}
                </div>

                {/* Total Sum Band */}
                <div className="border-border bg-muted/40 space-y-1 rounded-lg border p-4">
                  <div className="text-muted-foreground text-xs font-medium">Net Monthly Investment</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-foreground font-mono text-3xl font-bold tracking-tight">
                      ${finalMonthlyRate}
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">/ month</span>
                  </div>
                  {isAnnual ? (
                    <div className="text-xs font-medium text-emerald-500">
                      Billed annually (${finalMonthlyRate * 12}/yr &bull; Save ${annualSavings}/yr)
                    </div>
                  ) : null}
                </div>

                <Button className="w-full gap-2 shadow-xs" size="lg">
                  <span>Start 14-Day Free Evaluation</span>
                  <ArrowRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
