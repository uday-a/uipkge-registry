<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// One result per customer. A second number halves the weight of the first.
const results = [
  { wordmark: 'Northwind', metric: '5 days', label: 'off the monthly close' },
  { wordmark: 'Halden', metric: '71%', label: 'fewer ad-hoc requests' },
  { wordmark: 'Verity', metric: '2.4pp', label: 'tighter forecast band' },
  { wordmark: 'Calder', metric: '11 → 1', label: 'reporting spreadsheets' },
]
</script>

<template>
  <section data-slot="case-study-results-strip" class="border-border bg-card border-y">
    <div class="mx-auto max-w-6xl px-6 py-10">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <Badge variant="secondary">Proven</Badge>
        <Button variant="link" class="h-auto p-0 text-sm">
          All case studies
          <ArrowRight class="ml-1.5 size-3.5" aria-hidden="true" />
        </Button>
      </div>

      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        <div v-for="(result, index) in results" :key="result.wordmark" class="relative lg:px-6 lg:first:pl-0">
          <p class="text-sm font-semibold tracking-[0.18em] uppercase">{{ result.wordmark }}</p>
          <p class="font-display mt-3 text-3xl font-bold tracking-tight">{{ result.metric }}</p>
          <p class="text-muted-foreground mt-1 text-sm">{{ result.label }}</p>

          <Separator
            v-if="index < results.length - 1"
            orientation="vertical"
            class="absolute top-0 right-0 hidden h-full lg:block"
          />
        </div>
      </div>
    </div>
  </section>
</template>
