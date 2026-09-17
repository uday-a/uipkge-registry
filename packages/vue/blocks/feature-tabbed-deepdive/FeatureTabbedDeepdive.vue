<script setup lang="ts">
import { TriangleAlert } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Each angle names its own constraint. A deep-dive that only lists strengths
// reads as marketing; the constraint is what makes the rest credible.
const angles = [
  {
    id: 'authoring',
    label: 'Authoring',
    headline: 'A metric is a file, not a setting',
    body: 'Definitions are YAML in your repository. They are reviewed, branched, and reverted with the tools your team already runs, and the history is yours if you leave.',
    constraint: 'Requires someone comfortable opening a pull request. There is no drag-and-drop builder.',
    rows: [
      { name: 'metrics/revenue_net.yml', detail: 'v128' },
      { name: 'metrics/margin.yml', detail: 'v41' },
      { name: 'metrics/pipeline.yml', detail: 'v12' },
    ],
  },
  {
    id: 'execution',
    label: 'Execution',
    headline: 'The planner decides where a query runs',
    body: 'Hot aggregates resolve from materialised tables; everything else falls through to the warehouse. Each result carries the freshness it was served at.',
    constraint: 'Materialised paths are stale between runs by design, and the stamp says so rather than hiding it.',
    rows: [
      { name: 'revenue rollup', detail: 'materialised · 5 min' },
      { name: 'pipeline by stage', detail: 'materialised · 1 hr' },
      { name: 'raw event search', detail: 'live query' },
    ],
  },
  {
    id: 'governance',
    label: 'Governance',
    headline: 'Access is decided at query time',
    body: 'Scope resolves from your identity provider on every request, and each evaluation is written to an append-only log you can export.',
    constraint: 'Group changes propagate on your directory’s sync interval, not instantly.',
    rows: [
      { name: 'EMEA analyst', detail: 'region-scoped' },
      { name: 'Finance lead', detail: 'full ledger' },
      { name: 'Contractor', detail: 'no payroll' },
    ],
  },
]
</script>

<template>
  <section data-slot="feature-tabbed-deepdive" class="bg-background">
    <div class="mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">In depth</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">The metric layer, from three angles</h2>
      </div>

      <Tabs default-value="authoring" class="mt-10">
        <TabsList variant="segmented" class="flex-nowrap overflow-x-auto">
          <TabsTrigger v-for="angle in angles" :key="angle.id" :value="angle.id" variant="segmented">
            {{ angle.label }}
          </TabsTrigger>
        </TabsList>

        <TabsContent v-for="angle in angles" :key="angle.id" :value="angle.id" class="mt-6">
          <div class="grid min-h-[18rem] gap-6 sm:grid-cols-[1.3fr_1fr]">
            <div>
              <h3 class="text-xl font-semibold tracking-tight text-balance">{{ angle.headline }}</h3>
              <p class="text-muted-foreground mt-3 leading-relaxed">{{ angle.body }}</p>

              <Separator class="my-5" />

              <p class="flex items-start gap-2.5 text-sm">
                <TriangleAlert class="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span class="text-muted-foreground">{{ angle.constraint }}</span>
              </p>
            </div>

            <Card class="self-start">
              <CardContent class="p-0">
                <div class="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
                  {{ angle.label }}
                </div>
                <ul class="divide-border divide-y">
                  <li
                    v-for="row in angle.rows"
                    :key="row.name"
                    class="flex items-center justify-between gap-3 px-4 py-2.5"
                  >
                    <span class="min-w-0 truncate font-mono text-xs">{{ row.name }}</span>
                    <span class="text-muted-foreground shrink-0 text-xs">{{ row.detail }}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Button variant="outline" class="mt-8">Read the full reference</Button>
    </div>
  </section>
</template>
