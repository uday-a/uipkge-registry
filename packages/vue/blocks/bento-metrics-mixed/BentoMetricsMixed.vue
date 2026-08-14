<script setup lang="ts">
import { ArrowUpRight, CircleCheck } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const series = [4, 9, 7, 14, 11, 18, 16, 23, 21, 28, 26, 33]

const definitions = [
  { name: 'revenue_net', owner: 'finance' },
  { name: 'margin_by_channel', owner: 'finance' },
  { name: 'pipeline_weighted', owner: 'revops' },
]

// Inline SVG polyline: a sparkline does not justify a charting dependency.
function points(values: number[]) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 30 - ((value - min) / span) * 26
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}
</script>

<template>
  <section data-slot="bento-metrics-mixed" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-16">
      <Badge variant="secondary">At a glance</Badge>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent class="p-5">
            <p class="text-muted-foreground text-xs tracking-wide uppercase">Days to close</p>
            <p class="font-display mt-2 text-3xl font-bold tracking-tight">4.2</p>
            <p class="text-success mt-1 text-xs">down from 9.4</p>
          </CardContent>
        </Card>

        <Card class="sm:col-span-2">
          <CardContent class="p-5">
            <div class="flex items-baseline justify-between gap-3">
              <p class="text-muted-foreground text-xs tracking-wide uppercase">Certified metrics published</p>
              <p class="font-mono text-xs">12 months</p>
            </div>
            <p class="font-display mt-2 text-3xl font-bold tracking-tight">340</p>
            <svg
              class="text-primary/70 mt-2 h-8 w-full"
              viewBox="0 0 100 32"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline :points="points(series)" fill="none" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="flex h-full flex-col p-5">
            <p class="text-muted-foreground text-xs tracking-wide uppercase">Status</p>
            <div class="mt-3 flex items-center gap-2">
              <CircleCheck class="text-success size-4" aria-hidden="true" />
              <p class="text-sm font-medium">All systems operational</p>
            </div>
            <p class="text-muted-foreground mt-auto pt-3 font-mono text-xs">99.98% · rolling 90 days</p>
          </CardContent>
        </Card>

        <Card class="sm:col-span-2">
          <CardContent class="p-5">
            <p class="text-muted-foreground text-xs tracking-wide uppercase">Most-read definitions</p>
            <ul class="mt-3 space-y-2">
              <li
                v-for="definition in definitions"
                :key="definition.name"
                class="flex items-center justify-between gap-3"
              >
                <span class="min-w-0 truncate font-mono text-xs">{{ definition.name }}</span>
                <span class="text-muted-foreground shrink-0 text-xs">{{ definition.owner }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card class="sm:col-span-2">
          <CardContent class="flex h-full flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div class="min-w-0">
              <p class="text-sm font-medium">See the whole workspace</p>
              <p class="text-muted-foreground mt-1 text-xs">Live demo, no signup, real definitions.</p>
            </div>
            <Button variant="outline" size="sm" class="shrink-0">
              Open the demo
              <ArrowUpRight class="ml-1.5 size-3.5" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator class="mt-6" />
      <p class="text-muted-foreground mt-4 text-xs">Figures from the Northwind workspace, refreshed hourly.</p>
    </div>
  </section>
</template>
