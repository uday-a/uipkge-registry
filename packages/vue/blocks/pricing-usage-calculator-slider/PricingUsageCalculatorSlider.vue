<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Calculator, Globe, Server, Users } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Interactive Sliders
const mau = ref(100000) // 10k to 5M
const qps = ref(500) // 100 to 20k
const edgeReplicas = ref(3) // 1 to 12

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'k'
  return num.toString()
}

// Preset configurations
function applyPreset(preset: 'seed' | 'growth' | 'scale') {
  if (preset === 'seed') {
    mau.value = 25000
    qps.value = 150
    edgeReplicas.value = 2
  } else if (preset === 'growth') {
    mau.value = 350000
    qps.value = 2500
    edgeReplicas.value = 5
  } else {
    mau.value = 2500000
    qps.value = 12000
    edgeReplicas.value = 10
  }
}

// Calculations
const traditionalCost = computed(() => {
  const baseSeatFee = 350
  const perUserFee = (mau.value / 1000) * 1.8
  const qpsSurcharge = qps.value * 0.25
  return Math.round(baseSeatFee + perUserFee + qpsSurcharge)
})

const uipkgeCost = computed(() => {
  // Flat zero licensing + modest raw edge static bandwidth
  const rawBandwidth = (mau.value / 100000) * 4
  const flatProLicense = 24
  return Math.round(flatProLicense + rawBandwidth)
})

const monthlySavings = computed(() => {
  return Math.max(0, traditionalCost.value - uipkgeCost.value)
})

const annualSavings = computed(() => {
  return monthlySavings.value * 12
})
</script>

<template>
  <section
    data-slot="pricing-usage-calculator-slider"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <div class="mx-auto max-w-6xl space-y-12">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Calculator class="text-primary size-3.5" />
          Interactive Infrastructure ROI Calculator
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Calculate your annual savings with unbundled architecture.
        </h2>
        <p class="text-muted-foreground text-base">
          See how eliminating proprietary seat licenses and runtime SaaS wrappers cuts your front-end TCO.
        </p>

        <!-- Presets Bar -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button size="sm" variant="outline" class="font-mono text-xs" @click="applyPreset('seed')">
            Seed Startup (25k MAU)
          </Button>
          <Button size="sm" variant="outline" class="font-mono text-xs" @click="applyPreset('growth')">
            Growth Scale (350k MAU)
          </Button>
          <Button size="sm" variant="outline" class="font-mono text-xs" @click="applyPreset('scale')">
            Hypergrowth (2.5M MAU)
          </Button>
        </div>
      </div>

      <!-- 2-Column Split: Sliders Workbench Left (7 Cols), Savings Scorecard Right (5 Cols) -->
      <div class="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        <!-- Sliders Controls (7 Cols) -->
        <Card
          class="border-border bg-card/95 flex flex-col justify-between space-y-6 rounded-2xl p-6 text-left shadow-xl sm:p-8 lg:col-span-7"
        >
          <div class="space-y-6">
            <div class="border-border flex items-center justify-between border-b pb-4">
              <h3 class="text-foreground font-mono text-sm font-bold">Traffic &amp; Telemetry Inputs</h3>
              <span class="text-muted-foreground font-mono text-xs">Dynamic Projection</span>
            </div>

            <!-- Slider 1: MAU -->
            <div class="space-y-2">
              <div class="flex items-center justify-between font-mono text-xs">
                <span class="text-muted-foreground flex items-center gap-1.5">
                  <Users class="text-primary size-3.5" /> Monthly Active Users (MAU)
                </span>
                <span class="text-foreground text-sm font-bold">{{ formatNumber(mau) }} users</span>
              </div>
              <input
                v-model="mau"
                type="range"
                min="10000"
                max="5000000"
                step="25000"
                class="accent-primary bg-border h-2 w-full cursor-pointer rounded-lg"
              />
            </div>

            <!-- Slider 2: QPS -->
            <div class="space-y-2">
              <div class="flex items-center justify-between font-mono text-xs">
                <span class="text-muted-foreground flex items-center gap-1.5">
                  <Server class="text-primary size-3.5" /> Peak Query Throughput
                </span>
                <span class="text-foreground text-sm font-bold">{{ formatNumber(qps) }} QPS</span>
              </div>
              <input
                v-model="qps"
                type="range"
                min="100"
                max="20000"
                step="100"
                class="accent-primary bg-border h-2 w-full cursor-pointer rounded-lg"
              />
            </div>

            <!-- Slider 3: Global Replicas -->
            <div class="space-y-2">
              <div class="flex items-center justify-between font-mono text-xs">
                <span class="text-muted-foreground flex items-center gap-1.5">
                  <Globe class="text-primary size-3.5" /> Global Edge POP Replicas
                </span>
                <span class="text-foreground text-sm font-bold">{{ edgeReplicas }} Edge Regions</span>
              </div>
              <input
                v-model="edgeReplicas"
                type="range"
                min="1"
                max="12"
                step="1"
                class="accent-primary bg-border h-2 w-full cursor-pointer rounded-lg"
              />
            </div>
          </div>

          <div
            class="border-border text-muted-foreground flex items-center justify-between border-t pt-4 font-mono text-xs"
          >
            <span>Formula: Direct AST + Raw Static Hosting</span>
            <span class="font-semibold text-emerald-500">&check; Zero Seat Surcharges</span>
          </div>
        </Card>

        <!-- ROI Cost & Savings Projection Card (5 Cols) -->
        <Card
          class="border-border bg-card/95 flex flex-col justify-between space-y-6 rounded-2xl p-6 text-left shadow-sm sm:p-8 lg:col-span-5"
        >
          <div class="space-y-6">
            <Badge
              variant="outline"
              class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
            >
              Projected Annual Net Savings
            </Badge>

            <!-- Big Stat Display -->
            <div class="space-y-1">
              <div class="font-mono text-4xl font-bold tracking-tight text-emerald-500 sm:text-5xl">
                ${{ annualSavings.toLocaleString() }}
              </div>
              <p class="text-muted-foreground font-mono text-xs">
                Saved every year (${{ monthlySavings.toLocaleString() }}/month)
              </p>
            </div>

            <!-- Comparative Cost Bars -->
            <div class="space-y-3 pt-2">
              <div class="space-y-1">
                <div class="flex items-center justify-between font-mono text-xs">
                  <span class="text-destructive font-medium">Traditional Monolith Stack:</span>
                  <span class="text-foreground font-bold">${{ traditionalCost.toLocaleString() }}/mo</span>
                </div>
                <div class="bg-destructive/20 h-2 overflow-hidden rounded-full">
                  <div class="bg-destructive h-full w-full" />
                </div>
              </div>

              <div class="space-y-1">
                <div class="flex items-center justify-between font-mono text-xs">
                  <span class="font-semibold text-emerald-500">UIPKGE Unbundled Registry:</span>
                  <span class="text-foreground font-bold">${{ uipkgeCost.toLocaleString() }}/mo</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-emerald-500/20">
                  <div
                    class="h-full bg-emerald-500 transition-all duration-300"
                    :style="{ width: `${Math.max(5, (uipkgeCost / traditionalCost) * 100)}%` }"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button class="mt-4 h-10 w-full gap-1.5 font-mono text-xs shadow-md">
            <span>Lock In Pro Savings</span>
            <ArrowRight class="size-3.5" />
          </Button>
        </Card>
      </div>
    </div>
  </section>
</template>
