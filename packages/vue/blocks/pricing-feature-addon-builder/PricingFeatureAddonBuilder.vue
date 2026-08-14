<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Calculator, Check, CreditCard } from 'lucide-vue-next'
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
  class?: string
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

const props = withDefaults(defineProps<PricingFeatureAddonBuilderProps>(), {
  title: 'Build your custom plan with transparent, zero-surprise pricing.',
  description:
    'Select your base tier, adjust seat allocations, and toggle modular enterprise add-ons with real-time invoice calculations.',
})

const activePlans = computed(() => props.plans ?? DEFAULT_PLANS)
const activeAddons = computed(() => props.addons ?? DEFAULT_ADDONS)

const selectedPlanId = ref('growth')
const selectedAddonIds = ref<string[]>(['dedicated-ip', 'audit-logs'])
const seatCount = ref(8)
const isAnnual = ref(true)

const selectedPlan = computed(() => {
  return activePlans.value.find((p) => p.id === selectedPlanId.value) || activePlans.value[0]
})

const extraSeats = computed(() => {
  return Math.max(0, seatCount.value - selectedPlan.value.includedSeats)
})

const extraSeatCost = computed(() => extraSeats.value * 15)

const totalAddonsCost = computed(() => {
  return activeAddons.value
    .filter((a) => selectedAddonIds.value.includes(a.id))
    .reduce((sum, a) => sum + a.monthlyPrice, 0)
})

const monthlySubtotal = computed(() => {
  return selectedPlan.value.monthlyPrice + extraSeatCost.value + totalAddonsCost.value
})

const finalMonthlyRate = computed(() => {
  if (isAnnual.value) {
    return Math.round(monthlySubtotal.value * 0.8)
  }
  return monthlySubtotal.value
})

const annualSavings = computed(() => {
  return (monthlySubtotal.value - Math.round(monthlySubtotal.value * 0.8)) * 12
})

function toggleAddon(addonId: string) {
  if (selectedAddonIds.value.includes(addonId)) {
    selectedAddonIds.value = selectedAddonIds.value.filter((id) => id !== addonId)
  } else {
    selectedAddonIds.value.push(addonId)
  }
}
</script>

<template>
  <section
    data-slot="pricing-feature-addon-builder"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <a
          href="#pricing-calculator"
          class="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
        >
          <Calculator class="text-primary size-3.5" />
          <span>Real-time Add-on Cost Synthesizer</span>
          <ArrowRight class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {{ title }}
        </h2>

        <p class="text-muted-foreground text-base sm:text-lg">
          {{ description }}
        </p>

        <!-- Billing Cadence Toggle -->
        <div class="flex items-center justify-center gap-3 pt-2">
          <span
            class="text-xs font-medium"
            :class="!isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'"
          >
            Monthly Billing
          </span>
          <button
            type="button"
            class="bg-muted focus-visible:ring-ring relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:outline-none"
            :class="isAnnual ? 'bg-primary' : 'bg-muted'"
            @click="isAnnual = !isAnnual"
          >
            <span
              class="bg-background pointer-events-none inline-block size-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out"
              :class="isAnnual ? 'translate-x-5' : 'translate-x-0'"
            />
          </button>
          <span
            class="flex items-center gap-1.5 text-xs font-medium"
            :class="isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'"
          >
            <span>Annual Billing</span>
            <Badge variant="outline" class="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-500">
              Save 20%
            </Badge>
          </span>
        </div>
      </div>

      <!-- Add-on Builder Workbench -->
      <div class="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Left: Plan Selection & Addon Toggles (7 Cols) -->
        <div class="space-y-6 lg:col-span-7">
          <!-- Step 1: Base Tier Cards -->
          <div class="space-y-3">
            <div class="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Step 1: Choose Base Core Tier
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                v-for="plan in activePlans"
                :key="plan.id"
                type="button"
                :class="
                  cn(
                    'flex flex-col justify-between rounded-xl border p-4 text-left transition-all',
                    selectedPlanId === plan.id
                      ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                      : 'border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedPlanId = plan.id"
              >
                <div>
                  <div class="text-foreground text-xs font-bold">{{ plan.name }}</div>
                  <div class="text-foreground mt-1 font-mono text-lg font-bold">
                    ${{ plan.monthlyPrice }}<span class="text-muted-foreground text-xs font-normal">/mo</span>
                  </div>
                </div>
                <div class="text-muted-foreground mt-2 text-xs">Includes {{ plan.includedSeats }} engineer seats</div>
              </button>
            </div>
          </div>

          <!-- Step 2: Seat Allocation Slider -->
          <Card class="border-border bg-card/60 shadow-2xs">
            <CardContent class="space-y-2.5 p-4">
              <div class="flex items-center justify-between text-xs">
                <span class="text-foreground font-bold">Engineer Team Seats</span>
                <span class="text-foreground font-mono text-sm font-bold"
                  >{{ seatCount }} seats (${{ extraSeatCost }}/mo extra)</span
                >
              </div>
              <input
                v-model.number="seatCount"
                type="range"
                min="2"
                max="50"
                step="1"
                class="accent-primary w-full cursor-pointer"
              />
              <div class="text-muted-foreground flex justify-between font-mono text-xs">
                <span>2 seats</span>
                <span>50 seats</span>
              </div>
            </CardContent>
          </Card>

          <!-- Step 3: Enterprise Add-ons Checklist -->
          <div class="space-y-3">
            <div class="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Step 3: Select Modular Capabilities
            </div>
            <div class="grid grid-cols-1 gap-2.5">
              <button
                v-for="addon in activeAddons"
                :key="addon.id"
                type="button"
                :class="
                  cn(
                    'flex items-center justify-between rounded-xl border p-3.5 text-left transition-all',
                    selectedAddonIds.includes(addon.id)
                      ? 'border-primary/60 bg-primary/5 shadow-2xs'
                      : 'border-border bg-card hover:bg-muted/30 text-muted-foreground hover:text-foreground',
                  )
                "
                @click="toggleAddon(addon.id)"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    :class="
                      cn(
                        'flex size-5 shrink-0 items-center justify-center rounded border transition-colors',
                        selectedAddonIds.includes(addon.id)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background',
                      )
                    "
                  >
                    <Check v-if="selectedAddonIds.includes(addon.id)" class="size-3.5" />
                  </div>
                  <div class="min-w-0 space-y-0.5">
                    <div class="flex items-center gap-2">
                      <span class="text-foreground text-xs font-bold">{{ addon.name }}</span>
                      <Badge variant="outline" class="border-border text-muted-foreground text-xs">
                        {{ addon.category }}
                      </Badge>
                    </div>
                    <div class="text-muted-foreground truncate text-xs">{{ addon.description }}</div>
                  </div>
                </div>

                <div class="text-foreground shrink-0 pl-2 font-mono text-xs font-bold">
                  +${{ addon.monthlyPrice }}<span class="text-muted-foreground text-xs font-normal">/mo</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Real-time Invoice Estimate Card (5 Cols) -->
        <div class="lg:col-span-5">
          <Card class="border-border bg-card/90 sticky top-8 shadow-md backdrop-blur-xs">
            <CardContent class="space-y-6 p-6">
              <div class="border-border flex items-center justify-between border-b pb-3">
                <div class="flex items-center gap-2">
                  <CreditCard class="text-primary size-4" />
                  <span class="text-foreground text-sm font-semibold">Estimated Monthly Invoice</span>
                </div>
                <Badge variant="outline" class="border-border text-primary font-mono text-xs">
                  {{ isAnnual ? 'Annualized' : 'Monthly' }}
                </Badge>
              </div>

              <!-- Price Breakdown List -->
              <div class="space-y-3 text-xs">
                <div class="text-muted-foreground flex justify-between">
                  <span>{{ selectedPlan.name }}</span>
                  <span class="text-foreground font-mono">${{ selectedPlan.monthlyPrice }}.00</span>
                </div>

                <div v-if="extraSeats > 0" class="text-muted-foreground flex justify-between">
                  <span>Extra Seats ({{ extraSeats }} &times; $15)</span>
                  <span class="text-foreground font-mono">${{ extraSeatCost }}.00</span>
                </div>

                <div
                  v-for="addon in activeAddons.filter((a) => selectedAddonIds.includes(a.id))"
                  :key="addon.id"
                  class="text-muted-foreground flex justify-between"
                >
                  <span class="truncate pr-2">{{ addon.name }}</span>
                  <span class="text-foreground font-mono">${{ addon.monthlyPrice }}.00</span>
                </div>

                <div
                  v-if="isAnnual"
                  class="border-border/60 flex justify-between border-t pt-2 font-medium text-emerald-500"
                >
                  <span>Annual Billing Discount (20%)</span>
                  <span class="font-mono">&minus;${{ monthlySubtotal - finalMonthlyRate }}.00</span>
                </div>
              </div>

              <!-- Total Sum Band -->
              <div class="border-border bg-muted/40 space-y-1 rounded-lg border p-4">
                <div class="text-muted-foreground text-xs font-medium">Net Monthly Investment</div>
                <div class="flex items-baseline gap-1.5">
                  <span class="text-foreground font-mono text-3xl font-bold tracking-tight">
                    ${{ finalMonthlyRate }}
                  </span>
                  <span class="text-muted-foreground font-mono text-xs">/ month</span>
                </div>
                <div v-if="isAnnual" class="text-xs font-medium text-emerald-500">
                  Billed annually (${{ finalMonthlyRate * 12 }}/yr &bull; Save ${{ annualSavings }}/yr)
                </div>
              </div>

              <Button class="w-full gap-2 shadow-xs" size="lg">
                <span>Start 14-Day Free Evaluation</span>
                <ArrowRight class="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
