<script setup lang="ts">
import { ArrowUpRight, BookOpen, FileText, GraduationCap, Wrench } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const categories = [
  {
    icon: BookOpen,
    label: 'Guides',
    blurb: 'Step-by-step for the work you do once.',
    entries: [
      { title: 'A reconciliation checklist for your first close', kind: 'Guide', read: '6 min' },
      { title: 'Connecting Snowflake with a read-only role', kind: 'Guide', read: '4 min' },
      { title: 'Mapping SCIM groups to row-level scope', kind: 'Guide', read: '8 min' },
    ],
  },
  {
    icon: FileText,
    label: 'Engineering',
    blurb: 'How it is built and why it is built that way.',
    entries: [
      { title: 'Why we version definitions, not dashboards', kind: 'Essay', read: '9 min' },
      { title: 'Query planning against three warehouses', kind: 'Deep dive', read: '14 min' },
      { title: 'What our audit log actually records', kind: 'Reference', read: '5 min' },
    ],
  },
  {
    icon: GraduationCap,
    label: 'Benchmarks',
    blurb: 'Numbers from real rollouts, not projections.',
    entries: [
      { title: 'Close speed across 240 finance teams', kind: 'Benchmark', read: '11 min' },
      { title: 'Where self-serve analytics actually fails', kind: 'Research', read: '7 min' },
      { title: 'Warehouse cost before and after budgets', kind: 'Benchmark', read: '9 min' },
    ],
  },
  {
    icon: Wrench,
    label: 'Operations',
    blurb: 'Running it after the rollout finishes.',
    entries: [
      { title: 'Handling a restatement mid-quarter', kind: 'Runbook', read: '6 min' },
      { title: 'Alert routing that people do not mute', kind: 'Runbook', read: '5 min' },
      { title: 'Quarterly access review in 20 minutes', kind: 'Runbook', read: '4 min' },
    ],
  },
]
</script>

<template>
  <section data-slot="resources-category-grid" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-2xl">
          <Badge variant="secondary">Library</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Everything we have written down</h2>
        </div>
        <Button variant="outline">Browse the archive</Button>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-2">
        <Card v-for="category in categories" :key="category.label">
          <CardContent class="p-6">
            <div class="flex items-center gap-3">
              <span
                class="border-border text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border"
                aria-hidden="true"
              >
                <component :is="category.icon" class="size-4" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-semibold">{{ category.label }}</p>
                <p class="text-muted-foreground truncate text-xs">{{ category.blurb }}</p>
              </div>
            </div>

            <Separator class="my-4" />

            <ul class="space-y-1">
              <li v-for="entry in category.entries" :key="entry.title">
                <a
                  href="#"
                  class="hover:bg-muted focus-visible:ring-ring group flex items-start gap-3 rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span class="min-w-0 flex-1">
                    <span class="block text-sm leading-snug">{{ entry.title }}</span>
                    <span class="text-muted-foreground mt-0.5 block font-mono text-xs">
                      {{ entry.kind }} · {{ entry.read }}
                    </span>
                  </span>
                  <ArrowUpRight
                    class="text-muted-foreground mt-0.5 size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
