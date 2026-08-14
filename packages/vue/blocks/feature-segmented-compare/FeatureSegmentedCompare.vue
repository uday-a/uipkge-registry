<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, TriangleAlert } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// Each mode states its constraints as plainly as its capabilities. A comparison
// that only lists upsides makes the reader do the work of distrusting it.
const modes = [
  {
    id: 'live',
    label: 'Live query',
    summary: 'Every read hits the warehouse at request time.',
    capabilities: [
      'Always current, to the second',
      'No storage footprint on our side',
      'Row-level scope applied per query',
    ],
    constraints: ['Latency follows your warehouse', 'Each read is billable compute'],
    recommendation: 'Use for exploratory analysis and anything finance signs off on.',
  },
  {
    id: 'materialised',
    label: 'Materialised',
    summary: 'Aggregates are computed on a schedule you set.',
    capabilities: [
      'Sub-100ms reads at any concurrency',
      'Warehouse cost bounded by the schedule',
      'Freshness stamp shown with every figure',
    ],
    constraints: ['Stale between runs, by design', 'Backfills reprocess the window'],
    recommendation: 'Use for dashboards opened dozens of times an hour.',
  },
]

const active = ref(modes[0].id)
const current = computed(() => modes.find((mode) => mode.id === active.value) ?? modes[0])

function onChange(value: unknown) {
  if (typeof value === 'string' && value) active.value = value
}
</script>

<template>
  <section data-slot="feature-segmented-compare" class="bg-background">
    <div class="mx-auto max-w-4xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-xl">
          <Badge variant="secondary">Execution modes</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Pick per metric, not per platform</h2>
        </div>

        <ToggleGroup
          :model-value="active"
          type="single"
          variant="outline"
          size="sm"
          aria-label="Choose an execution mode"
          @update:model-value="onChange"
        >
          <ToggleGroupItem v-for="mode in modes" :key="mode.id" :value="mode.id">{{ mode.label }}</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <!-- min-h keeps the card from resizing between modes with different list
           lengths, which would otherwise shift the page on every toggle. -->
      <Card class="mt-8">
        <CardContent class="min-h-[22rem] p-6">
          <p class="text-lg leading-snug font-medium text-balance">{{ current.summary }}</p>

          <Separator class="my-6" />

          <div class="grid gap-8 sm:grid-cols-2">
            <div>
              <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">What you get</p>
              <ul class="mt-3 space-y-2.5">
                <li
                  v-for="capability in current.capabilities"
                  :key="capability"
                  class="flex items-start gap-2.5 text-sm"
                >
                  <Check class="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{{ capability }}</span>
                </li>
              </ul>
            </div>

            <div>
              <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">What it costs you</p>
              <ul class="mt-3 space-y-2.5">
                <li
                  v-for="constraint in current.constraints"
                  :key="constraint"
                  class="flex items-start gap-2.5 text-sm"
                >
                  <TriangleAlert class="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span class="text-muted-foreground">{{ constraint }}</span>
                </li>
              </ul>
            </div>
          </div>

          <Separator class="my-6" />

          <p class="text-sm">
            <span class="font-medium">Recommendation. </span>
            <span class="text-muted-foreground">{{ current.recommendation }}</span>
          </p>
        </CardContent>
      </Card>

      <Button variant="ghost" class="mt-6">Read how the planner chooses</Button>
    </div>
  </section>
</template>
