'use client'

import * as React from 'react'
import { Flame, Sparkles, Tag, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface TierOffer {
  id: string
  quantity: number
  discountPct: number
  label: string
  badgeText?: string
  popular?: boolean
}

export interface FlashSaleProps {
  saleTitle?: string
  endTimeIso?: string
  claimedPercent?: number
  itemsLeft?: number
  currentTier?: number
  tiers?: TierOffer[]
  onSelectTier?: (tier: TierOffer) => void
  onClaimDeal?: () => void
  className?: string
}

const defaultTiers: TierOffer[] = [
  { id: 't1', quantity: 1, discountPct: 15, label: 'Standard Pack', badgeText: 'Save $45' },
  {
    id: 't2',
    quantity: 2,
    discountPct: 25,
    label: 'Duo Studio Bundle',
    badgeText: 'Save $150 · Best Value',
    popular: true,
  },
  { id: 't3', quantity: 3, discountPct: 35, label: 'Team / Lab Triad', badgeText: 'Save $315' },
]

export function FlashSaleOfferBar({
  saleTitle = 'Lightning Deal: Limited Quantity Batch',
  endTimeIso,
  claimedPercent = 78,
  itemsLeft = 14,
  tiers = defaultTiers,
  onSelectTier,
  onClaimDeal,
  className,
}: FlashSaleProps) {
  const [selectedTierId, setSelectedTierId] = React.useState(tiers[1]?.id || tiers[0]?.id || '')

  const defaultEnd = React.useMemo(() => {
    return new Date(Date.now() + 6 * 3600 * 1000 + 42 * 60 * 1000 + 19 * 1000).toISOString()
  }, [])

  const targetTime = endTimeIso || defaultEnd

  const [timeLeft, setTimeLeft] = React.useState({
    hours: '06',
    minutes: '42',
    seconds: '19',
  })

  React.useEffect(() => {
    function updateCountdown() {
      const target = new Date(targetTime).getTime()
      const now = Date.now()
      const diff = Math.max(0, target - now)

      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      })
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [targetTime])

  function handleSelect(tier: TierOffer) {
    setSelectedTierId(tier.id)
    onSelectTier?.(tier)
  }

  return (
    <div
      data-slot="flash-sale-offer-bar"
      className={`border-border bg-card w-full overflow-hidden rounded-xl border shadow-xs ${className ?? ''}`}
    >
      {/* Deal Header Banner */}
      <div className="border-border bg-muted/40 flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="border-border bg-background flex size-8 items-center justify-center rounded-lg border shadow-2xs">
            <Flame className="size-4 fill-orange-500/20 text-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold tracking-tight">{saleTitle}</span>
              <Badge variant="destructive" className="h-5 gap-1 px-1.5 font-mono text-xs uppercase">
                <span className="bg-background size-1.5 animate-pulse rounded-full" />
                Live
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">Price locks automatically once added to cart.</p>
          </div>
        </div>

        {/* Live Clock Digits */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-muted-foreground text-xs font-medium">Ends in:</span>
          <div className="text-foreground flex items-center gap-1 font-mono text-xs font-semibold">
            <span className="border-border bg-background rounded border px-1.5 py-0.5 shadow-2xs">
              {timeLeft.hours}h
            </span>
            <span>:</span>
            <span className="border-border bg-background rounded border px-1.5 py-0.5 shadow-2xs">
              {timeLeft.minutes}m
            </span>
            <span>:</span>
            <span className="border-border bg-background text-destructive rounded border px-1.5 py-0.5 shadow-2xs">
              {timeLeft.seconds}s
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {/* Claim Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground flex items-center gap-1.5 font-medium">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>{claimedPercent}% Claimed</span>
            </span>
            <span className="text-destructive font-mono font-medium">Only {itemsLeft} units remaining in stock</span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-500"
              style={{ width: `${claimedPercent}%` }}
            />
          </div>
        </div>

        {/* Tier Multi-Buy Cards Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              type="button"
              className={`relative flex flex-col justify-between rounded-lg border p-3 text-left transition-all ${
                selectedTierId === tier.id
                  ? 'border-primary bg-primary/5 ring-primary ring-1'
                  : 'border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/30'
              }`}
              onClick={() => handleSelect(tier)}
            >
              {/* Popular ribbon */}
              {tier.popular && (
                <span className="border-border bg-primary text-primary-foreground absolute -top-2.5 right-3 rounded-full border px-2 py-0.5 text-xs font-semibold shadow-xs">
                  MOST POPULAR
                </span>
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-semibold">
                    Buy {tier.quantity} {tier.quantity > 1 ? 'Units' : 'Unit'}
                  </span>
                  <Badge
                    variant="secondary"
                    className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400"
                  >
                    -{tier.discountPct}% OFF
                  </Badge>
                </div>
                <div className="text-muted-foreground text-xs font-medium">{tier.label}</div>
              </div>

              <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
                <span className="text-muted-foreground">{tier.badgeText}</span>
                <div
                  className={`flex size-4 items-center justify-center rounded-full border text-xs font-bold ${
                    selectedTierId === tier.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/40'
                  }`}
                >
                  ✓
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Guarantee & CTA Banner */}
        <div className="border-border bg-muted/20 flex flex-col gap-2 rounded-lg border p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>30-day price-match guarantee · Free express 2-day dispatch</span>
          </div>
          <Button size="sm" className="gap-1.5 text-xs shadow-xs" onClick={onClaimDeal}>
            <Tag className="size-3.5" />
            <span>Apply Tier Discount to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
