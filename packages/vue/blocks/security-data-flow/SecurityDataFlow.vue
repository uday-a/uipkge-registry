<script setup lang="ts">
import { ArrowRight, Building2, Cloud, Lock } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// The point of the diagram is the second list: naming what never crosses is
// more reassuring than any number of things that do.
const zones = [
  {
    icon: Building2,
    label: 'Your warehouse',
    detail: 'Snowflake, BigQuery, Redshift, Postgres',
    holds: ['Customer rows', 'PII and PHI', 'Raw event history'],
  },
  {
    icon: Cloud,
    label: 'Northwind',
    detail: 'Your chosen region',
    holds: ['Metric definitions', 'Query plans and timings', 'Access decisions'],
  },
  {
    icon: Lock,
    label: 'Your viewers',
    detail: 'Scoped per identity',
    holds: ['Aggregated results only', 'Nothing cached in the browser'],
  },
]

const crosses = ['Column names and types', 'Aggregate results, scoped', 'Query metadata and timings']
const neverCrosses = ['Customer rows', 'Primary keys', 'Free-text fields', 'Anything you have not modelled']
</script>

<template>
  <section data-slot="security-data-flow" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">Data flow</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">What crosses the boundary</h2>
        <p class="text-muted-foreground mt-3 text-lg">
          And, more usefully, what never does. Both lists are below the diagram.
        </p>
      </div>

      <Card class="mt-10">
        <CardContent class="p-6 lg:p-8">
          <div class="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <template v-for="(zone, index) in zones" :key="zone.label">
              <div class="border-border bg-muted/30 rounded-lg border p-5">
                <span
                  class="border-border bg-background text-muted-foreground flex size-9 items-center justify-center rounded-lg border"
                  aria-hidden="true"
                >
                  <component :is="zone.icon" class="size-4" />
                </span>
                <p class="mt-4 text-sm font-semibold">{{ zone.label }}</p>
                <p class="text-muted-foreground mt-0.5 text-xs">{{ zone.detail }}</p>
                <ul class="mt-3 space-y-1">
                  <li v-for="item in zone.holds" :key="item" class="text-muted-foreground font-mono text-[11px]">
                    {{ item }}
                  </li>
                </ul>
              </div>

              <div
                v-if="index < zones.length - 1"
                class="text-muted-foreground/50 flex items-center justify-center lg:px-2"
                aria-hidden="true"
              >
                <ArrowRight class="size-4 rotate-90 lg:rotate-0" />
              </div>
            </template>
          </div>

          <Separator class="my-8" />

          <div class="grid gap-8 sm:grid-cols-2">
            <div>
              <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Crosses the boundary</p>
              <ul class="mt-3 space-y-2">
                <li v-for="item in crosses" :key="item" class="flex items-center gap-2.5 text-sm">
                  <span class="bg-primary size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div>
              <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Never crosses</p>
              <ul class="mt-3 space-y-2">
                <li v-for="item in neverCrosses" :key="item" class="flex items-center gap-2.5 text-sm">
                  <span class="bg-muted-foreground/40 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                  <span class="text-muted-foreground">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" class="mt-6">Read the architecture note</Button>
    </div>
  </section>
</template>
