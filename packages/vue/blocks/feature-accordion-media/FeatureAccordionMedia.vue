<script setup lang="ts">
import { computed, ref } from 'vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    id: 'catalog',
    title: 'Catalogue what exists',
    body: 'The schema mirror lists every table and column with its freshness, so modelling starts from what is actually there rather than what the docs claim.',
    rows: [
      { name: 'warehouse.orders', detail: 'fresh · 2 min' },
      { name: 'warehouse.refunds', detail: 'fresh · 2 min' },
      { name: 'legacy.orders_v1', detail: 'stale · 41 days' },
    ],
  },
  {
    id: 'review',
    title: 'Review before it ships',
    body: 'Definition changes open a pull request. Reviewers see the diff, the consumers affected, and the reconciliation result against prior quarters.',
    rows: [
      { name: '+ window: trailing_28d', detail: 'added' },
      { name: '- window: trailing_30d', detail: 'removed' },
      { name: '41 consumers affected', detail: 'checked' },
    ],
  },
  {
    id: 'observe',
    title: 'Watch it after it ships',
    body: 'Freshness and drift alerts fire against certified metrics and route to the owner named in the definition, not a shared inbox.',
    rows: [
      { name: 'revenue_net', detail: 'within threshold' },
      { name: 'margin_by_channel', detail: 'within threshold' },
      { name: 'pipeline_weighted', detail: 'drift · owner paged' },
    ],
  },
]

const open = ref(features[0].id)
// The pane follows the open item; falling back to the first keeps the pane
// populated when everything is collapsed.
const active = computed(() => features.find((feature) => feature.id === open.value) ?? features[0])
</script>

<template>
  <section data-slot="feature-accordion-media" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">Workflow</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Three habits, one loop</h2>
      </div>

      <div class="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Accordion v-model="open" type="single" collapsible class="w-full">
          <AccordionItem v-for="feature in features" :key="feature.id" :value="feature.id">
            <AccordionTrigger class="text-left font-medium">{{ feature.title }}</AccordionTrigger>
            <AccordionContent class="text-muted-foreground leading-relaxed">
              {{ feature.body }}
              <!-- Inline pane below the breakpoint, where a side pane would be
                   too narrow to read. -->
              <Card class="mt-4 lg:hidden">
                <CardContent class="p-0">
                  <ul class="divide-border divide-y">
                    <li
                      v-for="row in feature.rows"
                      :key="row.name"
                      class="flex items-center justify-between gap-3 px-4 py-2.5"
                    >
                      <span class="text-foreground min-w-0 truncate font-mono text-xs">{{ row.name }}</span>
                      <span class="shrink-0 text-xs">{{ row.detail }}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Card class="hidden self-start lg:block">
          <CardContent class="p-0">
            <div class="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
              {{ active.title }}
            </div>
            <ul class="divide-border divide-y">
              <li v-for="row in active.rows" :key="row.name" class="flex items-center justify-between gap-3 px-4 py-3">
                <span class="min-w-0 truncate font-mono text-xs">{{ row.name }}</span>
                <span class="text-muted-foreground shrink-0 text-xs">{{ row.detail }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Button variant="ghost" class="mt-8">See the full workflow</Button>
    </div>
  </section>
</template>
