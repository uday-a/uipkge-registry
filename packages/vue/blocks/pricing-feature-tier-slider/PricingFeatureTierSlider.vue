<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, CheckCircle2, Sliders } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface PricingFeatureTierSliderProps {
  title?: string
  description?: string
  class?: string
}

const props = withDefaults(defineProps<PricingFeatureTierSliderProps>(), {
  title: 'Predictable usage pricing with dynamic linear scale.',
  description:
    'Slide to your estimated monthly active users or edge invocations to calculate your exact monthly investment.',
})

// Slider value from 0 to 100
const sliderIndex = ref(2)
const isAnnual = ref(true)

const TIERS = [
  {
    label: '10K MAU',
    mauCount: '10,000',
    basePriceMonthly: 19,
    tierName: 'Starter Hobbyist',
    features: [
      '10,000 Monthly Users',
      '2 Dedicated Edge Locations',
      'Community Discord SLA',
      'Standard 1-Day Log Retention',
    ],
  },
  {
    label: '50K MAU',
    mauCount: '50,000',
    basePriceMonthly: 49,
    tierName: 'Pro Creator',
    features: [
      '50,000 Monthly Users',
      '12 Global Anycast Edges',
      'Next-Business-Day Support SLA',
      '7-Day Immutable Log Retention',
    ],
  },
  {
    label: '250K MAU',
    mauCount: '250,000',
    basePriceMonthly: 149,
    tierName: 'Growth Scale',
    features: [
      '250,000 Monthly Users',
      'All 36 Global Edge Regions',
      '4-Hour Priority Engineering SLA',
      '30-Day SOC2 Audit Logs',
    ],
  },
  {
    label: '1M MAU',
    mauCount: '1,000,000',
    basePriceMonthly: 399,
    tierName: 'Enterprise Core',
    features: [
      '1,000,000 Monthly Users',
      'Dedicated VPC & Multi-Region Mesh',
      '15-Minute Critical Incident SLA',
      '365-Day Cold Storage Logs',
    ],
  },
  {
    label: '5M+ MAU',
    mauCount: '5,000,000+',
    basePriceMonthly: 899,
    tierName: 'Hyperscale Cluster',
    features: [
      '5,000,000+ Monthly Users',
      'Custom Bare-Metal Cloud Partitions',
      'Dedicated Solutions Architect',
      'Custom Security Review & BAA',
    ],
  },
]

const currentTier = computed(() => TIERS[sliderIndex.value])

const effectivePrice = computed(() => {
  const base = currentTier.value.basePriceMonthly
  return isAnnual.value ? Math.round(base * 0.8) : base
})

const annualSavings = computed(() => {
  return (currentTier.value.basePriceMonthly - effectivePrice.value) * 12
})
</script>

<template>
  <section
    data-slot="pricing-feature-tier-slider"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <a
          href="#scale-pricing"
          class="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
        >
          <Sliders class="text-primary size-3.5" />
          <span>Continuous Scale Synthesizer</span>
          <ArrowRight class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {{ title }}
        </h2>

        <p class="text-muted-foreground text-base sm:text-lg">
          {{ description }}
        </p>

        <!-- Cadence Switcher -->
        <div class="flex items-center justify-center gap-3 pt-2">
          <span
            :class="cn('text-xs font-medium', !isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground')"
          >
            Monthly
          </span>
          <button
            type="button"
            :class="
              cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                isAnnual ? 'bg-primary' : 'bg-muted',
              )
            "
            @click="isAnnual = !isAnnual"
          >
            <span
              :class="
                cn(
                  'bg-background pointer-events-none inline-block size-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out',
                  isAnnual ? 'translate-x-5' : 'translate-x-0',
                )
              "
            />
          </button>
          <span
            :class="
              cn(
                'flex items-center gap-1.5 text-xs font-medium',
                isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground',
              )
            "
          >
            <span>Annual Billing</span>
            <Badge variant="outline" class="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-500">
              Save 20%
            </Badge>
          </span>
        </div>
      </div>

      <!-- Pricing Slider Main Card -->
      <div class="mx-auto mt-12 max-w-4xl">
        <Card class="border-border bg-card overflow-hidden shadow-sm">
          <CardContent class="space-y-8 p-8">
            <!-- Scale Indicator Bar -->
            <div class="border-border flex flex-wrap items-center justify-between gap-4 border-b pb-6">
              <div class="space-y-1">
                <span class="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                  >Calculated Tier Plan</span
                >
                <h3 class="text-foreground text-2xl font-bold">{{ currentTier.tierName }}</h3>
                <div class="text-muted-foreground text-xs">
                  Engineered for {{ currentTier.mauCount }} active user sessions
                </div>
              </div>

              <!-- Price Box -->
              <div class="text-right">
                <div class="flex items-baseline justify-end gap-1">
                  <span class="text-foreground font-mono text-4xl font-bold">${{ effectivePrice }}</span>
                  <span class="text-muted-foreground font-mono text-xs">/ month</span>
                </div>
                <div v-if="isAnnual" class="font-mono text-xs font-medium text-emerald-500">
                  Save ${{ annualSavings }}/yr on annual
                </div>
              </div>
            </div>

            <!-- Interactive Stepped Range Slider -->
            <div class="space-y-3">
              <div class="text-foreground flex items-center justify-between text-xs font-bold">
                <span>Monthly Traffic Volume</span>
                <span class="text-primary font-mono font-bold">{{ currentTier.mauCount }} Users</span>
              </div>

              <input
                v-model.number="sliderIndex"
                type="range"
                min="0"
                max="4"
                step="1"
                class="accent-primary h-2 w-full cursor-pointer"
              />

              <!-- Slider Step Labels -->
              <div class="text-muted-foreground flex justify-between font-mono text-xs">
                <span
                  v-for="(t, idx) in TIERS"
                  :key="idx"
                  :class="
                    cn(
                      'hover:text-foreground cursor-pointer transition-colors',
                      sliderIndex === idx ? 'text-primary font-bold' : '',
                    )
                  "
                  @click="sliderIndex = idx"
                >
                  {{ t.label }}
                </span>
              </div>
            </div>

            <!-- Features Checklist Grid for Current Tier -->
            <div class="border-border space-y-3 border-t pt-4">
              <span class="text-muted-foreground text-xs font-bold tracking-wider uppercase"
                >Guaranteed Tier Deliverables</span
              >
              <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div
                  v-for="(feat, fIdx) in currentTier.features"
                  :key="fIdx"
                  class="text-foreground flex items-center gap-2 text-xs"
                >
                  <CheckCircle2 class="size-4 shrink-0 text-emerald-500" />
                  <span>{{ feat }}</span>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <div class="pt-2">
              <Button size="lg" class="w-full gap-2 shadow-xs">
                <span>Deploy with {{ currentTier.tierName }}</span>
                <ArrowRight class="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
