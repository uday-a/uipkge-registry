'use client'

import * as React from 'react'
import {
  Check,
  Crown,
  Gift,
  Headphones,
  History,
  Lock,
  ShoppingBag,
  Sparkles,
  Tag,
  Ticket,
  Truck,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface LoyaltyPerk {
  id: string
  title: string
  subtitle: string
  description: string
  status: 'active' | 'locked'
  tierBadge: string
  unlockPoints?: number
}

export interface LoyaltyReward {
  id: string
  title: string
  category: string
  pointsCost: number
  description: string
  unlocked: boolean
  pointsNeeded?: number
  code?: string
}

export interface LoyaltyLedgerEntry {
  id: string
  title: string
  subtitle: string
  type: string
  date: string
  pointsChange: number
  isPositive: boolean
}

export interface LoyaltyRewardsTierHubProps {
  customerName?: string
  tierName?: string
  currentPoints?: number
  targetPoints?: number
  pointValueDollars?: number
  multiplier?: string
  className?: string
}

const perks: LoyaltyPerk[] = [
  {
    id: 'perk-shipping',
    title: 'Free Express Shipping on All Orders',
    subtitle: 'All Orders',
    description: 'Complimentary 2-day express shipping on every online order with zero minimum spend.',
    status: 'active',
    tierBadge: 'Active',
  },
  {
    id: 'perk-archive',
    title: 'Early Access to Private Archive Sales',
    subtitle: '48h Early Access',
    description: 'Shop seasonal private archives and limited capsule releases 48 hours before public launch.',
    status: 'active',
    tierBadge: 'Active',
  },
  {
    id: 'perk-stylist',
    title: 'Dedicated VIP Concierge & Personal Stylist',
    subtitle: '1-on-1 Stylist Line',
    description: 'Direct priority chat with our senior stylists for bespoke fashion curation and concierge care.',
    status: 'active',
    tierBadge: 'Active',
  },
  {
    id: 'perk-annual-gift',
    title: 'Diamond Exclusive Annual Gift',
    subtitle: 'Bespoke Curated Box',
    description: 'Curated luxury anniversary gift box ($120+ retail value) delivered automatically each winter.',
    status: 'locked',
    tierBadge: 'Unlocks at 3,000 pts',
    unlockPoints: 3000,
  },
]

const rewards: LoyaltyReward[] = [
  {
    id: 'reward-15-off',
    title: '$15 Off Any Order',
    category: 'Store Credit Voucher',
    pointsCost: 1500,
    description: 'Instant digital coupon applied at checkout on any order above $50.',
    unlocked: true,
    code: 'VIP-SAVE15',
  },
  {
    id: 'reward-leather-pouch',
    title: 'Free Travel Leather Pouch',
    category: 'Exclusive Merchandise',
    pointsCost: 2000,
    description: 'Handcrafted Italian pebbled leather travel accessory pouch in signature Midnight Noir.',
    unlocked: true,
    code: 'CLAIM-POUCH24',
  },
  {
    id: 'reward-audio-30',
    title: '$30 Off Premium Audio',
    category: 'Partner Exclusive',
    pointsCost: 3000,
    description: 'Exclusive member markdown on noise-cancelling headphones and studio sound gear.',
    unlocked: false,
    pointsNeeded: 550,
  },
]

const ledgerTransactions: LoyaltyLedgerEntry[] = [
  {
    id: 'tx-1',
    title: 'Order #ORD-9428 - Studio Silk Blouse',
    subtitle: 'Online Purchase · $190.00 subtotal',
    type: 'Earned · 2x Platinum Multiplier',
    date: 'Oct 18, 2024',
    pointsChange: 380,
    isPositive: true,
  },
  {
    id: 'tx-2',
    title: 'Redeemed: $10 Voucher Code #VIP-10OFF',
    subtitle: 'Rewards Catalog · Checkout Redemption',
    type: 'Reward Redemption',
    date: 'Oct 10, 2024',
    pointsChange: -1000,
    isPositive: false,
  },
  {
    id: 'tx-3',
    title: 'Order #ORD-9104 - Cashmere Wrap',
    subtitle: 'Online Purchase · $320.00 subtotal',
    type: 'Earned · 2x Platinum Multiplier',
    date: 'Sep 29, 2024',
    pointsChange: 640,
    isPositive: true,
  },
  {
    id: 'tx-4',
    title: 'Tier Upgrade Bonus - Platinum Milestone',
    subtitle: 'Milestone Threshold · 2,000 pts Achieved',
    type: 'Milestone Tier Reward',
    date: 'Sep 15, 2024',
    pointsChange: 500,
    isPositive: true,
  },
]

export function LoyaltyRewardsTierHub({
  customerName = 'Elena Rostova',
  tierName = 'VIP Platinum Member',
  currentPoints = 2450,
  targetPoints = 3000,
  pointValueDollars = 24.5,
  multiplier = '2x Points Multiplier',
  className,
}: LoyaltyRewardsTierHubProps) {
  const [redeemedMap, setRedeemedMap] = React.useState<Record<string, boolean>>({})

  const handleRedeem = (rewardId: string) => {
    setRedeemedMap((prev) => ({ ...prev, [rewardId]: true }))
  }

  return (
    <div data-slot="loyalty-rewards-tier-hub" className={cn('mx-auto w-full max-w-5xl space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge wrap variant="secondary" className="gap-1.5 font-medium">
              <Sparkles className="size-3.5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              VIP Rewards Club
            </Badge>
          </div>
          <h1 className="text-foreground mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Loyalty &amp; Rewards Hub
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm sm:text-base">
            Track VIP tier progress, redeem points for luxury perks, and review your member transaction ledger.
          </p>
        </div>
      </div>

      {/* Customer Loyalty Hero Card */}
      <Card className="border-border/80 shadow-xs">
        <CardContent className="space-y-6 p-6">
          {/* Profile Header & Tier Status */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 border-2 border-purple-500/25 shadow-xs">
                <AvatarFallback className="bg-purple-500/10 text-base font-semibold text-purple-700 dark:text-purple-300">
                  ER
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">{customerName}</h2>
                <p className="text-muted-foreground text-xs font-medium sm:text-sm">{tierName} · Member since 2022</p>
              </div>
            </div>

            <Badge
              wrap
              variant="outline"
              className="gap-1.5 border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300"
            >
              <Crown className="size-3.5 shrink-0 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              <span>Platinum Tier · 2x Points Multiplier</span>
            </Badge>
          </div>

          <Separator />

          {/* Points Balance & Multiplier Display */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Balance Stat */}
            <div className="border-border/60 bg-muted/30 flex flex-col justify-between rounded-xl border p-4">
              <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Available Points Balance
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-foreground text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                    2,450
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">Points</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-3 text-xs font-medium">
                Estimated reward cash value:{' '}
                <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  $24.50 reward value
                </span>
              </p>
            </div>

            {/* Tier Multiplier Stat */}
            <div className="border-border/60 bg-muted/30 flex flex-col justify-between rounded-xl border p-4">
              <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Current Multiplier
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-foreground text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">2x</span>
                  <Badge wrap variant="success" className="gap-1 text-xs">
                    <Zap className="size-3" aria-hidden="true" />
                    Active
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground mt-3 text-xs font-medium">
                Earn 2 points per $1 spent on all boutique catalog orders.
              </p>
            </div>

            {/* Next Reward Threshold */}
            <div className="border-border/60 bg-muted/30 flex flex-col justify-between rounded-xl border p-4 sm:col-span-2 lg:col-span-1">
              <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Next Tier Goal</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                    550 pts
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">to Diamond VIP</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-3 text-xs font-medium">
                Unlocks 3x points multiplier and annual exclusive gift.
              </p>
            </div>
          </div>

          {/* Next Tier Progress Bar Section */}
          <div className="border-border/80 bg-muted/40 space-y-2.5 rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 shrink-0 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <span className="text-foreground font-semibold">Next Tier Progress: Diamond VIP</span>
              </div>
              <span className="text-foreground font-semibold tabular-nums">2,450 / 3,000 Points</span>
            </div>

            <Progress value={81.6} className="h-2.5" />

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-medium text-purple-700 tabular-nums dark:text-purple-300">
                81.6% to Diamond VIP · 550 points to upgrade
              </span>
              <span className="text-muted-foreground">Target qualification date: Dec 31, 2024</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 VIP Tier Privilege Perks Summary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-foreground text-base font-semibold">VIP Tier Privilege Perks</h3>
            <p className="text-muted-foreground text-xs">
              Active benefits unlocked with your Platinum status and next-tier Diamond previews.
            </p>
          </div>
          <Badge wrap variant="outline" className="shrink-0 text-xs font-medium tabular-nums">
            3 of 4 Perks Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk) => (
            <div
              key={perk.id}
              className={cn(
                'flex flex-col justify-between rounded-xl border p-4 transition-colors',
                perk.status === 'active'
                  ? 'border-border/80 bg-card shadow-xs'
                  : 'border-border/60 bg-muted/20 opacity-85',
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-lg border',
                      perk.id === 'perk-shipping' &&
                        'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                      perk.id === 'perk-archive' &&
                        'border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400',
                      perk.id === 'perk-stylist' &&
                        'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
                      perk.id === 'perk-annual-gift' && 'border-border/60 bg-muted text-muted-foreground',
                    )}
                  >
                    {perk.id === 'perk-shipping' && <Truck className="size-4" aria-hidden="true" />}
                    {perk.id === 'perk-archive' && <Sparkles className="size-4" aria-hidden="true" />}
                    {perk.id === 'perk-stylist' && <Headphones className="size-4" aria-hidden="true" />}
                    {perk.id === 'perk-annual-gift' && <Gift className="size-4" aria-hidden="true" />}
                  </div>

                  {perk.status === 'active' ? (
                    <Badge wrap variant="success" className="gap-1 text-xs">
                      <Check className="size-3" aria-hidden="true" />
                      Active
                    </Badge>
                  ) : (
                    <Badge wrap variant="secondary" className="text-muted-foreground gap-1 text-xs">
                      <Lock className="size-3" aria-hidden="true" />
                      Unlocks at 3,000 pts
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-foreground text-sm font-semibold">{perk.title}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs font-medium">{perk.subtitle}</p>
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{perk.description}</p>
                </div>
              </div>

              <div className="border-border/50 mt-4 border-t pt-3">
                <span className="text-muted-foreground text-xs">
                  {perk.status === 'active' ? 'Included in Platinum VIP' : 'Requires Diamond Tier'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Catalog Grid (3 unlockable rewards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-foreground text-base font-semibold">Rewards Catalog</h3>
            <p className="text-muted-foreground text-xs">
              Redeem your points balance for instant discount vouchers and complimentary luxury items.
            </p>
          </div>
          <Badge wrap variant="outline" className="shrink-0 text-xs font-medium tabular-nums">
            2 Available to Redeem
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {rewards.map((reward) => (
            <Card
              key={reward.id}
              className={cn(
                'border-border/80 flex flex-col justify-between shadow-xs transition-colors',
                !reward.unlocked && 'bg-muted/20 opacity-90',
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge wrap variant="secondary" className="min-w-0 shrink text-xs font-medium">
                    {reward.category}
                  </Badge>
                  <div className="shrink-0 text-right">
                    <span className="text-foreground text-sm font-bold tabular-nums">
                      {reward.pointsCost.toLocaleString()} pts
                    </span>
                  </div>
                </div>
                <CardTitle className="mt-2 text-base font-semibold">{reward.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">{reward.description}</CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                {/* When locked, show points shortfall */}
                {!reward.unlocked ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress to unlock</span>
                      <span className="text-foreground font-semibold tabular-nums">2,450 / 3,000 pts</span>
                    </div>
                    <Progress value={81.6} className="h-1.5" />
                  </div>
                ) : redeemedMap[reward.id] ? (
                  <div className="border-success/30 bg-success/10 text-success rounded-md border p-2.5 text-center text-xs font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <Check className="size-3.5" aria-hidden="true" />
                      <span>Redeemed! Code:</span>
                      <span className="font-mono font-bold">{reward.code}</span>
                    </div>
                  </div>
                ) : null}
              </CardContent>

              <CardFooter className="pt-0">
                {reward.unlocked && !redeemedMap[reward.id] && (
                  <Button
                    type="button"
                    className="w-full gap-1.5 text-xs font-medium"
                    onClick={() => handleRedeem(reward.id)}
                  >
                    <Tag className="size-3.5" aria-hidden="true" />
                    <span>Redeem Reward</span>
                  </Button>
                )}

                {reward.unlocked && redeemedMap[reward.id] && (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-success/40 text-success w-full gap-1.5 text-xs font-medium"
                    disabled
                  >
                    <Check className="size-3.5" aria-hidden="true" />
                    <span>Voucher Claimed</span>
                  </Button>
                )}

                {!reward.unlocked && (
                  <Button type="button" variant="outline" disabled className="w-full gap-1.5 text-xs font-medium">
                    <Lock className="size-3.5" aria-hidden="true" />
                    <span>Locked · Need {reward.pointsNeeded} pts</span>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Points History Ledger */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <History className="size-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <CardTitle className="text-base font-semibold">Points History Ledger</CardTitle>
              </div>
              <CardDescription>Recent earnings and redemption transactions on your VIP account.</CardDescription>
            </div>
            <Badge wrap variant="outline" className="shrink-0 text-xs font-medium tabular-nums">
              Recent 4 Transactions
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto">
            <Table density="cozy">
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Details</TableHead>
                  <TableHead>Type &amp; Multiplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Points Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-lg border',
                            tx.isPositive
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'border-border/60 bg-muted text-muted-foreground',
                          )}
                        >
                          {tx.isPositive && tx.pointsChange < 500 && (
                            <ShoppingBag className="size-4" aria-hidden="true" />
                          )}
                          {tx.isPositive && tx.pointsChange >= 500 && <Crown className="size-4" aria-hidden="true" />}
                          {!tx.isPositive && <Ticket className="size-4" aria-hidden="true" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground truncate text-sm font-medium">{tx.title}</p>
                          <p className="text-muted-foreground truncate text-xs">{tx.subtitle}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tx.type.includes('Multiplier') ? (
                        <Badge wrap variant="outline" className="gap-1 text-xs font-medium">
                          <Zap className="size-3 text-amber-500" aria-hidden="true" />
                          {tx.type}
                        </Badge>
                      ) : tx.type.includes('Milestone') ? (
                        <Badge
                          wrap
                          variant="outline"
                          className="gap-1 border-purple-500/30 bg-purple-500/10 text-xs font-medium text-purple-700 dark:text-purple-300"
                        >
                          <Crown className="size-3 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                          {tx.type}
                        </Badge>
                      ) : (
                        <Badge wrap variant="secondary" className="text-muted-foreground gap-1 text-xs font-medium">
                          <Ticket className="size-3" aria-hidden="true" />
                          {tx.type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap sm:text-sm">
                      {tx.date}
                    </TableCell>
                    <TableCell className="text-right text-xs font-medium tabular-nums sm:text-sm">
                      <span
                        className={
                          tx.isPositive
                            ? 'font-bold text-emerald-600 dark:text-emerald-400'
                            : 'text-muted-foreground font-semibold'
                        }
                      >
                        {tx.isPositive
                          ? `+${tx.pointsChange.toLocaleString()} pts`
                          : `${tx.pointsChange.toLocaleString()} pts`}
                      </span>
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
