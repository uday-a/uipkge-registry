<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Monitor, Moon, Smartphone, Sparkles, Sun, Tablet } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface HeroSplitDeviceMockupProps {
  title?: string
  description?: string
  class?: string
}

const props = withDefaults(defineProps<HeroSplitDeviceMockupProps>(), {
  title: 'Responsive components with identical fidelity on every device.',
  description:
    'Every primitive and block is engineered with fluid container queries and zero layout shift across desktop, tablet, and mobile displays.',
})

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

const activeMode = ref<DeviceMode>('desktop')
const isDarkMode = ref(true)
const activeTab = ref<'overview' | 'analytics' | 'activity'>('overview')
const isMetricStreaming = ref(true)

const mockKpis = [
  { label: 'Active Sessions', value: '24,892', change: '+14.2%', status: 'up' },
  { label: 'Conversion Rate', value: '4.82%', change: '+0.6%', status: 'up' },
  { label: 'Avg TTFB', value: '18ms', change: '-4ms', status: 'optimal' },
]

const viewportWidthClass = computed(() => {
  if (activeMode.value === 'desktop') return 'w-full max-w-2xl'
  if (activeMode.value === 'tablet') return 'w-full max-w-md'
  return 'w-full max-w-[320px]'
})
</script>

<template>
  <section
    data-slot="hero-split-device-mockup"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24 lg:py-28', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Top Title & Badge Area -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <a
          href="#device-preview"
          class="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
        >
          <Sparkles class="text-primary size-3.5" />
          <span>Fluid Container Queries &bull; Tailwind v4 Ready</span>
          <ArrowRight class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h1 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {{ title }}
        </h1>

        <p class="text-muted-foreground text-base sm:text-lg">
          {{ description }}
        </p>

        <!-- Viewport Controls & Interactive Triggers -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
          <div class="border-border bg-muted/50 inline-flex rounded-lg border p-1 shadow-2xs">
            <button
              type="button"
              :class="
                cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  activeMode === 'desktop'
                    ? 'bg-background text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="activeMode = 'desktop'"
            >
              <Monitor class="size-3.5" />
              <span>Desktop (1440px)</span>
            </button>

            <button
              type="button"
              :class="
                cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  activeMode === 'tablet'
                    ? 'bg-background text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="activeMode = 'tablet'"
            >
              <Tablet class="size-3.5" />
              <span>Tablet (768px)</span>
            </button>

            <button
              type="button"
              :class="
                cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  activeMode === 'mobile'
                    ? 'bg-background text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="activeMode = 'mobile'"
            >
              <Smartphone class="size-3.5" />
              <span>Mobile (375px)</span>
            </button>
          </div>

          <Button variant="outline" size="sm" class="border-border gap-1.5 text-xs" @click="isDarkMode = !isDarkMode">
            <Sun v-if="isDarkMode" class="size-3.5" />
            <Moon v-else class="size-3.5" />
            <span>{{ isDarkMode ? 'Dark Frame' : 'Light Frame' }}</span>
          </Button>
        </div>
      </div>

      <!-- Split Device Mockup Canvas -->
      <div class="mt-12 flex justify-center">
        <div
          :class="
            cn(
              'border-border bg-card rounded-xl border p-2 shadow-md transition-all duration-300 ease-out sm:p-3',
              viewportWidthClass,
              isDarkMode ? 'dark' : '',
            )
          "
        >
          <!-- Browser / Device Chrome Header -->
          <div class="border-border/80 flex items-center justify-between border-b px-2 pt-1 pb-2.5">
            <div class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-full bg-rose-500/80" />
              <span class="size-2.5 rounded-full bg-amber-500/80" />
              <span class="size-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <!-- URL Bar -->
            <div
              class="border-border/60 bg-muted/60 text-muted-foreground mx-auto flex h-6 w-1/2 items-center justify-center truncate rounded-md border px-2 font-mono text-xs"
            >
              https://uipkge.dev/demo/dashboard-kpis
            </div>

            <div class="text-muted-foreground flex items-center gap-1">
              <span class="size-2 rounded-full bg-emerald-500" />
              <span class="font-mono text-xs">LIVE</span>
            </div>
          </div>

          <!-- Inside Interactive Device Application -->
          <div class="bg-background space-y-4 rounded-lg p-4 pt-4">
            <!-- App Header Inside Frame -->
            <div class="border-border flex items-center justify-between border-b pb-3">
              <div class="flex items-center gap-2">
                <div
                  class="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-bold"
                >
                  UI
                </div>
                <div>
                  <div class="text-foreground text-xs font-semibold">Platform Metrics</div>
                  <div class="text-muted-foreground text-xs">Production Cluster (us-east-1)</div>
                </div>
              </div>

              <!-- Inner App Tabs -->
              <div class="border-border bg-muted/40 flex gap-1 rounded-md border p-0.5">
                <button
                  type="button"
                  :class="
                    cn(
                      'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                      activeTab === 'overview'
                        ? 'bg-background text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="activeTab = 'overview'"
                >
                  Overview
                </button>
                <button
                  type="button"
                  :class="
                    cn(
                      'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                      activeTab === 'analytics'
                        ? 'bg-background text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="activeTab = 'analytics'"
                >
                  Analytics
                </button>
              </div>
            </div>

            <!-- KPI Metric Grid in Frame -->
            <div :class="cn('grid gap-2.5', activeMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-3')">
              <Card v-for="(kpi, idx) in mockKpis" :key="idx" class="border-border bg-card/60 shadow-2xs">
                <CardContent class="space-y-1 p-3">
                  <div class="text-muted-foreground text-xs font-medium">{{ kpi.label }}</div>
                  <div class="text-foreground text-lg font-bold tracking-tight">{{ kpi.value }}</div>
                  <div class="flex items-center gap-1 text-xs font-medium text-emerald-500">
                    <span>{{ kpi.change }}</span>
                    <span class="text-muted-foreground">&bull; vs last week</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Interactive Wave / Chart Preview -->
            <div class="border-border/80 bg-muted/20 space-y-2 rounded-lg border p-3">
              <div class="flex items-center justify-between text-xs">
                <span class="text-foreground font-medium">Real-time Telemetry Stream</span>
                <Badge variant="outline" class="border-border font-mono text-xs text-emerald-500">
                  Synced: 0.2ms
                </Badge>
              </div>

              <!-- SVG Mock Sparkline Chart -->
              <svg class="stroke-primary fill-primary/10 h-16 w-full" viewBox="0 0 300 60" preserveAspectRatio="none">
                <path d="M0 45 Q 25 20, 50 35 T 100 25 T 150 15 T 200 30 T 250 10 T 300 20 L 300 60 L 0 60 Z" />
                <path
                  d="M0 45 Q 25 20, 50 35 T 100 25 T 150 15 T 200 30 T 250 10 T 300 20"
                  fill="none"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
