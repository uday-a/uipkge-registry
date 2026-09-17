<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import { ArrowRight, Check, HardDrive, Headphones, KeyRound, ShieldCheck, Sparkles, Users, Zap } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

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

const isAnnual = ref(true)
const seats = ref(12)
const requestIndex = ref(2)
const storageIndex = ref(2)
const addonSupport = ref(false)
const addonSla = ref(false)
const addonSso = ref(true)

const currentRequestTier = computed(() => REQUEST_TIERS[requestIndex.value] ?? REQUEST_TIERS[0])
const currentStorageTier = computed(() => STORAGE_TIERS[storageIndex.value] ?? STORAGE_TIERS[0])

const seatTier = computed(() => {
  if (seats.value <= 5) return { label: 'Starter Team', variant: 'secondary' as const }
  if (seats.value <= 25) return { label: 'Growth Team', variant: 'outline' as const }
  return { label: 'Scale Team', variant: 'default' as const }
})

const recommendedPlan = computed(() => {
  if (addonSla.value || requestIndex.value >= 6 || storageIndex.value >= 5 || seats.value >= 30) {
    return { name: 'Enterprise', badge: 'Enterprise Plan', baseFee: 199, variant: 'default' as const }
  }
  if (seats.value >= 8 || requestIndex.value >= 3 || storageIndex.value >= 3 || addonSupport.value) {
    return { name: 'Growth', badge: 'Growth Plan', baseFee: 79, variant: 'default' as const }
  }
  return { name: 'Starter', badge: 'Starter Plan', baseFee: 29, variant: 'secondary' as const }
})

const baseCost = computed(() => recommendedPlan.value.baseFee)
const seatsCost = computed(() => seats.value * SEAT_PRICE)
const requestsCost = computed(() => currentRequestTier.value.cost)
const storageCost = computed(() => currentStorageTier.value.cost)
const addonsCost = computed(() => {
  let cost = 0
  if (addonSupport.value) cost += SUPPORT_MANAGER_PRICE
  if (addonSla.value) cost += CUSTOM_SLA_PRICE
  if (addonSso.value) cost += SSO_PRICE
  return cost
})

const activeAddonsCount = computed(() => {
  let count = 0
  if (addonSupport.value) count++
  if (addonSla.value) count++
  if (addonSso.value) count++
  return count
})

const subtotalMonthly = computed(
  () => baseCost.value + seatsCost.value + requestsCost.value + storageCost.value + addonsCost.value,
)

const discountMultiplier = computed(() => (isAnnual.value ? 0.8 : 1.0))
const totalMonthly = computed(() => Math.round(subtotalMonthly.value * discountMultiplier.value))
const totalAnnual = computed(() => totalMonthly.value * 12)
const annualSavings = computed(() => Math.round(subtotalMonthly.value * 0.2 * 12))
</script>

<template>
  <div data-slot="pricing-calculator" :class="cn('mx-auto w-full max-w-6xl space-y-10 p-4 sm:p-6 lg:p-8', props.class)">
    <div class="flex flex-col items-center gap-4 text-center">
      <Badge variant="outline" class="gap-1.5 px-3 py-1 text-xs font-medium tracking-wider uppercase">
        <Sparkles class="text-primary size-3.5" />
        Pricing Calculator
      </Badge>
      <div class="space-y-2">
        <h2 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Interactive Pricing Calculator
        </h2>
        <p class="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-base">
          Calculate your exact monthly or annual investment based on usage.
        </p>
      </div>

      <div class="border-border bg-card mt-2 inline-flex items-center gap-3 rounded-full border px-4 py-2 shadow-xs">
        <span
          :class="
            cn(
              'text-xs font-medium transition-colors',
              !isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground',
            )
          "
        >
          Monthly
        </span>
        <Switch :model-value="isAnnual" @update:model-value="(val) => (isAnnual = val)" />
        <span
          :class="
            cn(
              'text-xs font-medium transition-colors',
              isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground',
            )
          "
        >
          Pay Annually
        </span>
        <Badge variant="secondary" class="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
          Save 20%
        </Badge>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      <div class="space-y-6 lg:col-span-7">
        <Card>
          <CardHeader>
            <CardTitle>Capacity &amp; Scale</CardTitle>
            <CardDescription>Configure team seats, API request throughput, and dedicated storage.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-8">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div
                    class="bg-primary/10 text-primary border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-md border"
                  >
                    <Users class="size-4" />
                  </div>
                  <div>
                    <span class="text-foreground text-sm font-medium">Team Seats</span>
                    <Badge :variant="seatTier.variant" class="ml-2 text-xs font-normal">
                      {{ seatTier.label }}
                    </Badge>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-foreground text-base font-semibold tabular-nums">{{ seats }}</span>
                  <span class="text-muted-foreground text-xs"> seats (${{ seats * SEAT_PRICE }}/mo)</span>
                </div>
              </div>
              <div class="pb-6">
                <Slider
                  :model-value="seats"
                  :min="1"
                  :max="100"
                  :step="1"
                  :marks="SEAT_MARKS"
                  :tooltip="(val) => `${val} seats`"
                  @update:model-value="(val) => (seats = typeof val === 'number' ? val : val[0])"
                />
              </div>
              <p class="text-muted-foreground text-xs">
                Full workspace access, fine-grained permission controls, and audit log tracking for each member.
              </p>
            </div>

            <Separator />

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div
                    class="bg-primary/10 text-primary border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-md border"
                  >
                    <Zap class="size-4" />
                  </div>
                  <div>
                    <span class="text-foreground text-sm font-medium">Monthly API Requests</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-foreground text-base font-semibold tabular-nums">
                    {{ currentRequestTier.label }}
                  </span>
                  <span class="text-muted-foreground text-xs">
                    ({{ currentRequestTier.cost === 0 ? 'Included' : `+$${currentRequestTier.cost}/mo` }})
                  </span>
                </div>
              </div>
              <div class="pb-6">
                <Slider
                  :model-value="requestIndex"
                  :min="0"
                  :max="REQUEST_TIERS.length - 1"
                  :step="1"
                  :marks="REQUEST_MARKS"
                  :tooltip="(idx) => REQUEST_TIERS[idx]?.label ?? ''"
                  @update:model-value="(val) => (requestIndex = typeof val === 'number' ? val : val[0])"
                />
              </div>
              <p class="text-muted-foreground text-xs">
                Globally distributed edge endpoints, automatic rate limiting, and sub-50ms p99 latency SLA.
              </p>
            </div>

            <Separator />

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div
                    class="bg-primary/10 text-primary border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-md border"
                  >
                    <HardDrive class="size-4" />
                  </div>
                  <div>
                    <span class="text-foreground text-sm font-medium">Dedicated Cloud Storage</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-foreground text-base font-semibold tabular-nums">
                    {{ currentStorageTier.label }}
                  </span>
                  <span class="text-muted-foreground text-xs"> (+${{ currentStorageTier.cost }}/mo)</span>
                </div>
              </div>
              <div class="pb-6">
                <Slider
                  :model-value="storageIndex"
                  :min="0"
                  :max="STORAGE_TIERS.length - 1"
                  :step="1"
                  :marks="STORAGE_MARKS"
                  :tooltip="(idx) => STORAGE_TIERS[idx]?.label ?? ''"
                  @update:model-value="(val) => (storageIndex = typeof val === 'number' ? val : val[0])"
                />
              </div>
              <p class="text-muted-foreground text-xs">
                Encrypted at rest (AES-256) with multi-region automated replication and daily disaster backups.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enterprise Add-ons</CardTitle>
            <CardDescription
              >Enhance your infrastructure with enterprise compliance, reliability, and support.</CardDescription
            >
          </CardHeader>
          <CardContent class="space-y-3">
            <div
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center"
            >
              <div class="flex items-start gap-3">
                <div
                  class="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border"
                >
                  <Headphones class="size-4" />
                </div>
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-foreground text-sm font-medium">Dedicated Support Manager</span>
                    <Badge variant="outline" class="text-xs font-normal">+$200/mo</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Direct Slack channel, named technical account manager &amp; 1-hour response SLA.
                  </p>
                </div>
              </div>
              <div class="flex sm:justify-end">
                <Switch :model-value="addonSupport" @update:model-value="(val) => (addonSupport = val)" />
              </div>
            </div>

            <div
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center"
            >
              <div class="flex items-start gap-3">
                <div
                  class="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border"
                >
                  <ShieldCheck class="size-4" />
                </div>
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-foreground text-sm font-medium">Custom SLA Guarantee</span>
                    <Badge variant="outline" class="text-xs font-normal">+$500/mo</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    99.99% uptime guarantee with financial commitments and priority disaster recovery.
                  </p>
                </div>
              </div>
              <div class="flex sm:justify-end">
                <Switch :model-value="addonSla" @update:model-value="(val) => (addonSla = val)" />
              </div>
            </div>

            <div
              class="border-border bg-card hover:border-primary/30 flex flex-col justify-between gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center"
            >
              <div class="flex items-start gap-3">
                <div
                  class="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border"
                >
                  <KeyRound class="size-4" />
                </div>
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-foreground text-sm font-medium">Single Sign-On (SSO / SAML)</span>
                    <Badge variant="outline" class="text-xs font-normal">+$100/mo</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Okta, Azure AD, Google Workspace, and SAML 2.0 enterprise identity integration.
                  </p>
                </div>
              </div>
              <div class="flex sm:justify-end">
                <Switch :model-value="addonSso" @update:model-value="(val) => (addonSso = val)" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="lg:sticky lg:top-8 lg:col-span-5">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Estimated Investment
              </span>
              <Badge :variant="recommendedPlan.variant" class="gap-1 shadow-xs">
                <Sparkles v-if="recommendedPlan.name === 'Enterprise'" class="size-3" />
                {{ recommendedPlan.badge }}
              </Badge>
            </div>
            <div class="mt-4">
              <div class="flex items-baseline gap-1.5">
                <span class="text-foreground text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                  ${{ totalMonthly }}
                </span>
                <span class="text-muted-foreground text-sm font-normal"> / month</span>
              </div>
              <p v-if="isAnnual" class="text-muted-foreground mt-2 text-xs">
                Billed annually (${{ totalAnnual.toLocaleString('en-US') }}/yr) ·
                <span class="text-success font-semibold">Save ${{ annualSavings.toLocaleString('en-US') }}/yr</span>
              </p>
              <p v-else class="text-muted-foreground mt-2 text-xs">
                Billed monthly · Switch to annual to save 20% (${{ annualSavings.toLocaleString('en-US') }}/yr)
              </p>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <Separator />
            <div class="space-y-2.5">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Base platform ({{ recommendedPlan.name }})</span>
                <span class="font-medium tabular-nums">${{ isAnnual ? Math.round(baseCost * 0.8) : baseCost }}/mo</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Team seats ({{ seats }} × ${{ SEAT_PRICE }})</span>
                <span class="font-medium tabular-nums"
                  >${{ isAnnual ? Math.round(seatsCost * 0.8) : seatsCost }}/mo</span
                >
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">API throughput ({{ currentRequestTier.label }})</span>
                <span class="font-medium tabular-nums">
                  {{
                    requestsCost === 0 ? 'Included' : `$${isAnnual ? Math.round(requestsCost * 0.8) : requestsCost}/mo`
                  }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Cloud storage ({{ currentStorageTier.label }})</span>
                <span class="font-medium tabular-nums">
                  ${{ isAnnual ? Math.round(storageCost * 0.8) : storageCost }}/mo
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Add-ons ({{ activeAddonsCount }} active)</span>
                <span class="font-medium tabular-nums">
                  {{ addonsCost === 0 ? '$0/mo' : `$${isAnnual ? Math.round(addonsCost * 0.8) : addonsCost}/mo` }}
                </span>
              </div>
              <div
                v-if="isAnnual"
                class="bg-success/10 text-success flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium"
              >
                <span>Annual discount applied</span>
                <span class="font-semibold tabular-nums">20% off</span>
              </div>
            </div>
            <Separator />
            <ul class="text-muted-foreground space-y-2 text-xs">
              <li class="flex items-center gap-2">
                <Check class="text-primary size-3.5 shrink-0" />
                <span>14-day fully featured free trial</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="text-primary size-3.5 shrink-0" />
                <span>No credit card required upfront</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="text-primary size-3.5 shrink-0" />
                <span>Zero-downtime migration assistance</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter class="flex flex-col gap-2.5 pt-2">
            <Button class="w-full gap-2 font-semibold shadow-xs" size="lg">
              Start 14-Day Free Trial
              <ArrowRight class="size-4" />
            </Button>
            <Button variant="outline" class="w-full" size="default"> Request Custom Quote </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
