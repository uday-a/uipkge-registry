<script lang="ts">
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
</script>

<script setup lang="ts">
import { ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Props {
  customerName?: string
  tierName?: string
  currentPoints?: number
  targetPoints?: number
  pointValueDollars?: number
  multiplier?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  customerName: 'Elena Rostova',
  tierName: 'VIP Platinum Member',
  currentPoints: 2450,
  targetPoints: 3000,
  pointValueDollars: 24.5,
  multiplier: '2x Points Multiplier',
})

const redeemedMap = ref<Record<string, boolean>>({})

function handleRedeem(rewardId: string) {
  redeemedMap.value[rewardId] = true
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
</script>

<template>
  <div data-slot="loyalty-rewards-tier-hub" :class="cn('mx-auto w-full max-w-5xl space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <Badge wrap variant="secondary" class="gap-1.5 font-medium">
            <Sparkles class="size-3.5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            VIP Rewards Club
          </Badge>
        </div>
        <h1 class="text-foreground mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Loyalty &amp; Rewards Hub</h1>
        <p class="text-muted-foreground mt-1 max-w-2xl text-sm sm:text-base">
          Track VIP tier progress, redeem points for luxury perks, and review your member transaction ledger.
        </p>
      </div>
    </div>

    <!-- Customer Loyalty Hero Card -->
    <Card class="border-border/80 shadow-xs">
      <CardContent class="space-y-6 p-6">
        <!-- Profile Header & Tier Status -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4">
            <Avatar class="size-14 border-2 border-purple-500/25 shadow-xs">
              <AvatarFallback class="bg-purple-500/10 text-base font-semibold text-purple-700 dark:text-purple-300">
                ER
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 class="text-foreground text-lg font-bold tracking-tight sm:text-xl">
                {{ props.customerName }}
              </h2>
              <p class="text-muted-foreground text-xs font-medium sm:text-sm">
                {{ props.tierName }} · Member since 2022
              </p>
            </div>
          </div>

          <Badge
            wrap
            variant="outline"
            class="gap-1.5 border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300"
          >
            <Crown class="size-3.5 shrink-0 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            <span>Platinum Tier · 2x Points Multiplier</span>
          </Badge>
        </div>

        <Separator />

        <!-- Points Balance & Multiplier Display -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Balance Stat -->
          <div class="border-border/60 bg-muted/30 flex flex-col justify-between rounded-xl border p-4">
            <div>
              <p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Available Points Balance
              </p>
              <div class="mt-1 flex items-baseline gap-2">
                <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums sm:text-4xl"> 2,450 </span>
                <span class="text-muted-foreground text-sm font-medium">Points</span>
              </div>
            </div>
            <p class="text-muted-foreground mt-3 text-xs font-medium">
              Estimated reward cash value:
              <span class="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">$24.50 reward value</span>
            </p>
          </div>

          <!-- Tier Multiplier Stat -->
          <div class="border-border/60 bg-muted/30 flex flex-col justify-between rounded-xl border p-4">
            <div>
              <p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Current Multiplier</p>
              <div class="mt-1 flex items-center gap-2">
                <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums sm:text-4xl"> 2x </span>
                <Badge wrap variant="success" class="gap-1 text-xs">
                  <Zap class="size-3" aria-hidden="true" />
                  Active
                </Badge>
              </div>
            </div>
            <p class="text-muted-foreground mt-3 text-xs font-medium">
              Earn 2 points per $1 spent on all boutique catalog orders.
            </p>
          </div>

          <!-- Next Reward Threshold -->
          <div
            class="border-border/60 bg-muted/30 flex flex-col justify-between rounded-xl border p-4 sm:col-span-2 lg:col-span-1"
          >
            <div>
              <p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Next Tier Goal</p>
              <div class="mt-1 flex items-baseline gap-2">
                <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                  550 pts
                </span>
                <span class="text-muted-foreground text-xs font-medium">to Diamond VIP</span>
              </div>
            </div>
            <p class="text-muted-foreground mt-3 text-xs font-medium">
              Unlocks 3x points multiplier and annual exclusive gift.
            </p>
          </div>
        </div>

        <!-- Next Tier Progress Bar Section -->
        <div class="border-border/80 bg-muted/40 space-y-2.5 rounded-xl border p-4">
          <div class="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
            <div class="flex items-center gap-2">
              <Sparkles class="size-4 shrink-0 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              <span class="text-foreground font-semibold">Next Tier Progress: Diamond VIP</span>
            </div>
            <span class="text-foreground font-semibold tabular-nums">2,450 / 3,000 Points</span>
          </div>

          <Progress :model-value="81.6" class="h-2.5" />

          <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span class="font-medium text-purple-700 tabular-nums dark:text-purple-300">
              81.6% to Diamond VIP · 550 points to upgrade
            </span>
            <span class="text-muted-foreground"> Target qualification date: Dec 31, 2024 </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 4 VIP Tier Privilege Perks Summary -->
    <div class="space-y-3">
      <div class="flex items-center justify-between gap-2">
        <div>
          <h3 class="text-foreground text-base font-semibold">VIP Tier Privilege Perks</h3>
          <p class="text-muted-foreground text-xs">
            Active benefits unlocked with your Platinum status and next-tier Diamond previews.
          </p>
        </div>
        <Badge wrap variant="outline" class="shrink-0 text-xs font-medium tabular-nums"> 3 of 4 Perks Active </Badge>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="perk in perks"
          :key="perk.id"
          :class="
            cn(
              'flex flex-col justify-between rounded-xl border p-4 transition-colors',
              perk.status === 'active'
                ? 'border-border/80 bg-card shadow-xs'
                : 'border-border/60 bg-muted/20 opacity-85',
            )
          "
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <div
                :class="
                  cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg border',
                    perk.id === 'perk-shipping' &&
                      'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                    perk.id === 'perk-archive' &&
                      'border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400',
                    perk.id === 'perk-stylist' && 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
                    perk.id === 'perk-annual-gift' && 'border-border/60 bg-muted text-muted-foreground',
                  )
                "
              >
                <Truck v-if="perk.id === 'perk-shipping'" class="size-4" aria-hidden="true" />
                <Sparkles v-else-if="perk.id === 'perk-archive'" class="size-4" aria-hidden="true" />
                <Headphones v-else-if="perk.id === 'perk-stylist'" class="size-4" aria-hidden="true" />
                <Gift v-else class="size-4" aria-hidden="true" />
              </div>

              <Badge v-if="perk.status === 'active'" variant="success" class="gap-1 text-xs whitespace-normal">
                <Check class="size-3" aria-hidden="true" />
                Active
              </Badge>
              <Badge wrap v-else variant="secondary" class="text-muted-foreground gap-1 text-xs">
                <Lock class="size-3" aria-hidden="true" />
                Unlocks at 3,000 pts
              </Badge>
            </div>

            <div>
              <p class="text-foreground text-sm font-semibold">{{ perk.title }}</p>
              <p class="text-muted-foreground mt-0.5 text-xs font-medium">{{ perk.subtitle }}</p>
              <p class="text-muted-foreground mt-2 text-xs leading-relaxed">
                {{ perk.description }}
              </p>
            </div>
          </div>

          <div class="border-border/50 mt-4 border-t pt-3">
            <span class="text-muted-foreground text-xs">
              {{ perk.status === 'active' ? 'Included in Platinum VIP' : 'Requires Diamond Tier' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Rewards Catalog Grid (3 unlockable rewards) -->
    <div class="space-y-3">
      <div class="flex items-center justify-between gap-2">
        <div>
          <h3 class="text-foreground text-base font-semibold">Rewards Catalog</h3>
          <p class="text-muted-foreground text-xs">
            Redeem your points balance for instant discount vouchers and complimentary luxury items.
          </p>
        </div>
        <Badge wrap variant="outline" class="shrink-0 text-xs font-medium tabular-nums"> 2 Available to Redeem </Badge>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          v-for="reward in rewards"
          :key="reward.id"
          :class="
            cn(
              'border-border/80 flex flex-col justify-between shadow-xs transition-colors',
              !reward.unlocked && 'bg-muted/20 opacity-90',
            )
          "
        >
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between gap-2">
              <Badge wrap variant="secondary" class="min-w-0 shrink text-xs font-medium">
                {{ reward.category }}
              </Badge>
              <div class="shrink-0 text-right">
                <span class="text-foreground text-sm font-bold tabular-nums">
                  {{ reward.pointsCost.toLocaleString() }} pts
                </span>
              </div>
            </div>
            <CardTitle class="mt-2 text-base font-semibold">
              {{ reward.title }}
            </CardTitle>
            <CardDescription class="text-xs leading-relaxed">
              {{ reward.description }}
            </CardDescription>
          </CardHeader>

          <CardContent class="pb-3">
            <!-- When locked, show points shortfall -->
            <div v-if="!reward.unlocked" class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Progress to unlock</span>
                <span class="text-foreground font-semibold tabular-nums">2,450 / 3,000 pts</span>
              </div>
              <Progress :model-value="81.6" class="h-1.5" />
            </div>

            <!-- When redeemed, show code -->
            <div
              v-else-if="redeemedMap[reward.id]"
              class="border-success/30 bg-success/10 text-success rounded-md border p-2.5 text-center text-xs font-medium"
            >
              <div class="flex items-center justify-center gap-1">
                <Check class="size-3.5" aria-hidden="true" />
                <span>Redeemed! Code:</span>
                <span class="font-mono font-bold">{{ reward.code }}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter class="pt-0">
            <Button
              v-if="reward.unlocked && !redeemedMap[reward.id]"
              type="button"
              class="w-full gap-1.5 text-xs font-medium"
              @click="handleRedeem(reward.id)"
            >
              <Tag class="size-3.5" aria-hidden="true" />
              <span>Redeem Reward</span>
            </Button>

            <Button
              v-else-if="reward.unlocked && redeemedMap[reward.id]"
              type="button"
              variant="outline"
              class="border-success/40 text-success w-full gap-1.5 text-xs font-medium"
              disabled
            >
              <Check class="size-3.5" aria-hidden="true" />
              <span>Voucher Claimed</span>
            </Button>

            <Button v-else type="button" variant="outline" disabled class="w-full gap-1.5 text-xs font-medium">
              <Lock class="size-3.5" aria-hidden="true" />
              <span>Locked · Need {{ reward.pointsNeeded }} pts</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>

    <!-- Points History Ledger -->
    <Card class="border-border/80 shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <History class="size-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              <CardTitle class="text-base font-semibold">Points History Ledger</CardTitle>
            </div>
            <CardDescription> Recent earnings and redemption transactions on your VIP account. </CardDescription>
          </div>
          <Badge wrap variant="outline" class="shrink-0 text-xs font-medium tabular-nums">
            Recent 4 Transactions
          </Badge>
        </div>
      </CardHeader>

      <CardContent class="p-0 sm:p-6 sm:pt-0">
        <div class="overflow-x-auto">
          <Table density="cozy">
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Details</TableHead>
                <TableHead>Type &amp; Multiplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead class="text-right">Points Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="tx in ledgerTransactions" :key="tx.id">
                <TableCell>
                  <div class="flex items-center gap-3">
                    <div
                      :class="
                        cn(
                          'flex size-8 shrink-0 items-center justify-center rounded-lg border',
                          tx.isPositive
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'border-border/60 bg-muted text-muted-foreground',
                        )
                      "
                    >
                      <ShoppingBag v-if="tx.isPositive && tx.pointsChange < 500" class="size-4" aria-hidden="true" />
                      <Crown v-else-if="tx.isPositive && tx.pointsChange >= 500" class="size-4" aria-hidden="true" />
                      <Ticket v-else class="size-4" aria-hidden="true" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-foreground truncate text-sm font-medium">
                        {{ tx.title }}
                      </p>
                      <p class="text-muted-foreground truncate text-xs">
                        {{ tx.subtitle }}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    v-if="tx.type.includes('Multiplier')"
                    variant="outline"
                    class="gap-1 text-xs font-medium whitespace-normal"
                  >
                    <Zap class="size-3 text-amber-500" aria-hidden="true" />
                    {{ tx.type }}
                  </Badge>
                  <Badge
                    v-else-if="tx.type.includes('Milestone')"
                    variant="outline"
                    class="gap-1 border-purple-500/30 bg-purple-500/10 text-xs font-medium whitespace-normal text-purple-700 dark:text-purple-300"
                  >
                    <Crown class="size-3 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                    {{ tx.type }}
                  </Badge>
                  <Badge wrap v-else variant="secondary" class="text-muted-foreground gap-1 text-xs font-medium">
                    <Ticket class="size-3" aria-hidden="true" />
                    {{ tx.type }}
                  </Badge>
                </TableCell>
                <TableCell class="text-muted-foreground text-xs whitespace-nowrap sm:text-sm">
                  {{ tx.date }}
                </TableCell>
                <TableCell class="text-right text-xs font-medium tabular-nums sm:text-sm">
                  <span
                    :class="
                      tx.isPositive
                        ? 'font-bold text-emerald-600 dark:text-emerald-400'
                        : 'text-muted-foreground font-semibold'
                    "
                  >
                    {{
                      tx.isPositive
                        ? `+${tx.pointsChange.toLocaleString()} pts`
                        : `${tx.pointsChange.toLocaleString()} pts`
                    }}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
