<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight, Banknote, Factory, HeartPulse, ShoppingCart, Ship, Truck } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const useCases = [
  {
    icon: Banknote,
    segment: 'Financial services',
    title: 'Close the books without a spreadsheet relay',
    body: 'Ledger-reconciled metrics that lock on period close, with an auditable trail for every restatement.',
    metric: '5 days off close',
  },
  {
    icon: HeartPulse,
    segment: 'Healthcare',
    title: 'Report on care quality without exposing PHI',
    body: 'Row-level scoping evaluated per query, so a shared dashboard never leaks a chart the viewer cannot open.',
    metric: 'HIPAA-scoped by default',
  },
  {
    icon: ShoppingCart,
    segment: 'Retail',
    title: 'One margin definition across every channel',
    body: 'Store, marketplace, and wholesale roll up to the same certified metric instead of three competing exports.',
    metric: '3 channels, 1 number',
  },
  {
    icon: Truck,
    segment: 'Logistics',
    title: 'Track service levels against the contract',
    body: 'On-time thresholds encoded per customer contract, so breach reporting stops being a manual comparison.',
    metric: '98.2% SLA visibility',
  },
  {
    icon: Factory,
    segment: 'Manufacturing',
    title: 'Yield reporting that survives a line change',
    body: 'Definitions version with the production line, so last quarter’s numbers stay comparable after a retool.',
    metric: '12 lines reconciled',
  },
  {
    icon: Ship,
    segment: 'Logistics',
    title: 'Landed cost per shipment, not per guess',
    body: 'Freight, duty, and demurrage join at query time against the booking rather than a monthly allocation.',
    metric: 'Per-shipment costing',
  },
]

const ALL = 'All'
const segments = computed(() => [ALL, ...new Set(useCases.map((useCase) => useCase.segment))])
const active = ref(ALL)
const visible = computed(() =>
  active.value === ALL ? useCases : useCases.filter((useCase) => useCase.segment === active.value),
)

// ToggleGroup single-select emits '' when the active item is pressed again;
// fall back to ALL so the grid can never end up empty.
function onSegmentChange(value: unknown) {
  active.value = typeof value === 'string' && value ? value : ALL
}
</script>

<template>
  <section data-slot="use-cases-industry-grid" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-2xl">
          <Badge variant="secondary">By industry</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Where teams start</h2>
          <p class="text-muted-foreground mt-3 text-lg">
            Six rollouts we run often enough to have opinions about. Filter to yours.
          </p>
        </div>

        <ToggleGroup
          :model-value="active"
          type="single"
          variant="outline"
          size="sm"
          class="flex-nowrap overflow-x-auto"
          aria-label="Filter use cases by industry"
          @update:model-value="onSegmentChange"
        >
          <ToggleGroupItem v-for="segment in segments" :key="segment" :value="segment">
            {{ segment }}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="useCase in visible" :key="useCase.title" class="group">
          <CardContent class="flex h-full flex-col p-6">
            <component :is="useCase.icon" class="text-muted-foreground size-5" aria-hidden="true" />
            <p class="text-muted-foreground mt-4 font-mono text-xs tracking-[0.14em] uppercase">
              {{ useCase.segment }}
            </p>
            <h3 class="mt-2 text-base leading-snug font-semibold">{{ useCase.title }}</h3>
            <p class="text-muted-foreground mt-2 text-sm leading-relaxed">{{ useCase.body }}</p>

            <div class="border-border mt-auto flex items-center justify-between gap-3 border-t pt-4">
              <span class="text-sm font-medium">{{ useCase.metric }}</span>
              <Button variant="ghost" size="sm" class="h-auto px-2 py-1">
                Read
                <ArrowUpRight
                  class="ml-1 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
