<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Inline SVG rather than a chart dependency: a sparkline is a polyline, and
// pulling in a charting library for twelve points is not a trade worth making.
const metrics = [
  {
    value: '4.2',
    unit: 'days',
    label: 'Median time to close',
    period: 'last 12 months',
    series: [9.4, 9.1, 8.7, 8.2, 7.4, 6.8, 6.1, 5.6, 5.1, 4.8, 4.4, 4.2],
  },
  {
    value: '61',
    unit: '/mo',
    label: 'Ad-hoc data requests',
    period: 'last 12 months',
    series: [212, 198, 184, 160, 141, 122, 108, 96, 84, 74, 66, 61],
  },
  {
    value: '340',
    unit: '',
    label: 'Certified metrics live',
    period: 'since launch',
    series: [0, 12, 38, 74, 112, 148, 181, 214, 248, 281, 312, 340],
  },
  {
    value: '99.98',
    unit: '%',
    label: 'Query availability',
    period: 'rolling 90 days',
    series: [99.9, 99.95, 99.92, 99.97, 99.99, 99.96, 99.98, 99.99, 99.97, 99.98, 99.99, 99.98],
  },
]

// Normalise a series into a 100x28 viewBox so every sparkline shares a baseline.
function points(series: number[]) {
  const min = Math.min(...series)
  const max = Math.max(...series)
  const span = max - min || 1
  return series
    .map((value, index) => {
      const x = (index / (series.length - 1)) * 100
      const y = 26 - ((value - min) / span) * 24
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}
</script>

<template>
  <section data-slot="stats-band-sparklines" class="border-border bg-card border-y">
    <div class="mx-auto max-w-6xl px-6 py-12">
      <Badge variant="secondary">Measured</Badge>

      <dl class="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        <div v-for="(metric, index) in metrics" :key="metric.label" class="relative lg:px-6 lg:first:pl-0">
          <dd class="font-display text-3xl font-bold tracking-tight">
            {{ metric.value }}<span class="text-muted-foreground text-lg font-semibold">{{ metric.unit }}</span>
          </dd>
          <dt class="mt-1 text-sm font-medium">{{ metric.label }}</dt>

          <svg
            class="text-primary/70 mt-3 h-7 w-full"
            viewBox="0 0 100 28"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polyline :points="points(metric.series)" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>

          <p class="text-muted-foreground mt-1 font-mono text-xs">{{ metric.period }}</p>

          <Separator
            v-if="index < metrics.length - 1"
            orientation="vertical"
            class="absolute top-0 right-0 hidden h-full lg:block"
          />
        </div>
      </dl>
    </div>
  </section>
</template>
