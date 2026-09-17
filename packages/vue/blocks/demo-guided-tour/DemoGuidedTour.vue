<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

// Each step names the panel it highlights, so the copy and the mock cannot
// drift apart when someone reorders the tour.
const steps = [
  {
    target: 'catalog',
    title: 'Start from the catalogue',
    body: 'Every table we mirrored, with its freshness. Pick what the metric reads from.',
  },
  {
    target: 'definition',
    title: 'Write the definition',
    body: 'The window, the owner, and the joins. This is the file that opens a pull request.',
  },
  {
    target: 'consumers',
    title: 'See who it affects',
    body: 'Before publishing, the consumer list shows every dashboard and export that resolves it.',
  },
  {
    target: 'history',
    title: 'Check the history',
    body: 'Every prior version with its reviewer, and a one-click revert to any of them.',
  },
]

const panels = [
  { id: 'catalog', label: 'Catalogue', rows: ['warehouse.orders', 'warehouse.refunds', 'warehouse.fx_rates'] },
  {
    id: 'definition',
    label: 'revenue_net.yml',
    rows: ['window: trailing_28d', 'owner: finance-analytics', 'joins: refunds, fx'],
  },
  { id: 'consumers', label: 'Consumers', rows: ['Exec summary', 'Finance close pack', 'Partner API'] },
  {
    id: 'history',
    label: 'History',
    rows: ['v128 · 14 Feb · A. Reyes', 'v127 · 02 Jan · A. Reyes', 'v126 · 11 Dec · M. Ellery'],
  },
]

const index = ref(0)
const current = computed(() => steps[index.value])
const progress = computed(() => ((index.value + 1) / steps.length) * 100)
</script>

<template>
  <section data-slot="demo-guided-tour" class="bg-background">
    <div class="mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-xl">
          <Badge variant="secondary">Guided tour</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Four screens, ninety seconds</h2>
        </div>
        <Button variant="ghost" size="sm">Skip and just read the docs</Button>
      </div>

      <div class="mt-10 grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:gap-10">
        <div>
          <Progress :model-value="progress" class="h-1" aria-label="Tour progress" />
          <p class="text-muted-foreground mt-3 font-mono text-xs">Step {{ index + 1 }} of {{ steps.length }}</p>

          <!-- min-h holds the copy block at its tallest so the controls do not
               move between steps. -->
          <div class="min-h-[7rem]">
            <h3 class="mt-4 text-xl font-semibold tracking-tight">{{ current.title }}</h3>
            <p class="text-muted-foreground mt-2 leading-relaxed">{{ current.body }}</p>
          </div>

          <div class="mt-5 flex items-center gap-2">
            <Button variant="outline" size="sm" :disabled="index === 0" @click="index -= 1">
              <ArrowLeft class="mr-1.5 size-3.5" aria-hidden="true" />
              Back
            </Button>
            <Button size="sm" :disabled="index === steps.length - 1" @click="index += 1">
              Next
              <ArrowRight class="ml-1.5 size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <Card>
          <CardContent class="space-y-2 p-4">
            <div
              v-for="panel in panels"
              :key="panel.id"
              class="rounded-lg border p-3 transition-colors"
              :class="
                panel.id === current.target ? 'border-primary bg-muted/40' : 'border-border bg-background opacity-60'
              "
            >
              <div class="flex items-center justify-between gap-3">
                <p class="font-mono text-xs font-medium">{{ panel.label }}</p>
                <Badge v-if="panel.id === current.target" variant="secondary">This step</Badge>
              </div>
              <Separator class="my-2" />
              <ul class="space-y-1">
                <li v-for="row in panel.rows" :key="row" class="text-muted-foreground truncate font-mono text-xs">
                  {{ row }}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
