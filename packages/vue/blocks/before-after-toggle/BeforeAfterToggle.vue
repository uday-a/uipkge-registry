<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const states = [
  {
    id: 'before',
    label: 'Before',
    caption: 'Three dashboards, three revenue numbers',
    changed: 'Each team maintained its own formula, and none of them agreed at close.',
    rows: [
      { source: 'Exec summary', value: '£4,182,400', tone: 'off' },
      { source: 'Finance close pack', value: '£4,140,900', tone: 'off' },
      { source: 'Board deck', value: '£4,206,150', tone: 'off' },
    ],
  },
  {
    id: 'after',
    label: 'After',
    caption: 'One certified definition',
    changed: 'All three resolve the same definition, so the reconciliation step disappeared.',
    rows: [
      { source: 'Exec summary', value: '£4,140,900', tone: 'on' },
      { source: 'Finance close pack', value: '£4,140,900', tone: 'on' },
      { source: 'Board deck', value: '£4,140,900', tone: 'on' },
    ],
  },
]

const active = ref('before')
const current = computed(() => states.find((state) => state.id === active.value) ?? states[0])

function onChange(value: unknown) {
  if (typeof value === 'string' && value) active.value = value
}
</script>

<template>
  <section data-slot="before-after-toggle" class="bg-background">
    <div class="mx-auto max-w-3xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Badge variant="secondary">Before and after</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">One number, three places</h2>
        </div>

        <!-- The control keeps its position across switches: moving it would make
             the comparison harder than just showing both. -->
        <ToggleGroup
          :model-value="active"
          type="single"
          variant="outline"
          size="sm"
          aria-label="Show the state before or after"
          @update:model-value="onChange"
        >
          <ToggleGroupItem v-for="state in states" :key="state.id" :value="state.id">{{ state.label }}</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Card class="mt-8">
        <CardContent class="p-0">
          <div class="border-border flex items-center justify-between gap-3 border-b px-4 py-2.5">
            <span class="text-sm font-semibold">{{ current.label }}</span>
            <span class="text-muted-foreground text-xs">{{ current.caption }}</span>
          </div>

          <!-- Fixed height across both states so toggling never resizes the card. -->
          <ul class="divide-border min-h-[11rem] divide-y">
            <li v-for="row in current.rows" :key="row.source" class="flex items-center justify-between gap-4 px-4 py-4">
              <span class="text-sm">{{ row.source }}</span>
              <span
                class="font-mono text-sm tabular-nums"
                :class="row.tone === 'on' ? 'text-success font-semibold' : 'text-muted-foreground'"
              >
                {{ row.value }}
              </span>
            </li>
          </ul>

          <Separator />
          <p class="text-muted-foreground px-4 py-3 text-xs leading-relaxed">{{ current.changed }}</p>
        </CardContent>
      </Card>

      <Button variant="ghost" class="mt-6">How certification works</Button>
    </div>
  </section>
</template>
