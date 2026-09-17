<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Annotations are numbered and referenced from both panels, which is what makes
// a side-by-side legible where a drag slider hides half the evidence.
const panels = [
  {
    label: 'Before',
    caption: 'Four exports reconciled by hand',
    rows: [
      { text: 'revenue_q1_final_v3.xlsx', note: '1' },
      { text: 'revenue_q1_FINAL_v3b.xlsx', note: '1' },
      { text: 'refunds_manual_adj.csv', note: '2' },
      { text: 'fx_rates_pasted.csv', note: '3' },
    ],
  },
  {
    label: 'After',
    caption: 'One certified definition',
    rows: [
      { text: 'metrics/revenue_net.yml', note: '1' },
      { text: '  joins: refunds, fx_rates', note: '2' },
      { text: '  owner: finance-analytics', note: '3' },
      { text: '  reconciled: 4 quarters', note: '' },
    ],
  },
]

const annotations = [
  { id: '1', text: 'Two files claiming to be final, differing by 40k in net revenue.' },
  { id: '2', text: 'Refund adjustments applied by hand, with no record of who applied them.' },
  { id: '3', text: 'FX rates pasted from a second system on a date nobody logged.' },
]
</script>

<template>
  <section data-slot="before-after-side-by-side" class="bg-background">
    <div class="mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <Badge variant="secondary">Before and after</Badge>
      <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">The same close, two quarters apart</h2>

      <!-- items-stretch so both panels share a height; a slider would hide one
           side at a time and make the annotations unreadable. -->
      <div class="mt-10 grid items-stretch gap-4 md:grid-cols-2">
        <Card v-for="panel in panels" :key="panel.label">
          <CardContent class="flex h-full flex-col p-0">
            <div class="border-border flex items-center justify-between gap-3 border-b px-4 py-2.5">
              <span class="text-sm font-semibold">{{ panel.label }}</span>
              <span class="text-muted-foreground text-xs">{{ panel.caption }}</span>
            </div>
            <ul class="flex-1 space-y-2 p-4">
              <li v-for="row in panel.rows" :key="row.text" class="flex items-start gap-2">
                <span
                  v-if="row.note"
                  class="border-border text-muted-foreground mt-px flex size-4 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]"
                >
                  {{ row.note }}
                </span>
                <span v-else class="size-4 shrink-0" aria-hidden="true" />
                <span class="min-w-0 font-mono text-xs break-all">{{ row.text }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator class="my-8" />

      <ol class="space-y-3">
        <li v-for="annotation in annotations" :key="annotation.id" class="flex items-start gap-3 text-sm">
          <span
            class="border-border text-muted-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]"
          >
            {{ annotation.id }}
          </span>
          <span class="text-muted-foreground leading-relaxed">{{ annotation.text }}</span>
        </li>
      </ol>

      <Button class="mt-8">Read the full case study</Button>
    </div>
  </section>
</template>
