<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const features = [
  {
    id: 'definitions',
    title: 'Versioned definitions',
    summary: 'Reviewed like code',
    body: 'Every metric is a file with an owner. Changing one opens a pull request carrying a diff, a reviewer, and a revert path — the same workflow the rest of your repo already uses.',
    points: ['Branch per change', 'Required review', 'One-click revert'],
    rows: [
      { name: 'revenue_net', detail: 'v128 · finance' },
      { name: 'margin_by_channel', detail: 'v41 · finance' },
      { name: 'pipeline_weighted', detail: 'v12 · revops' },
    ],
  },
  {
    id: 'access',
    title: 'Query-time access',
    summary: 'Scope per identity',
    body: 'Row-level scope resolves from your identity provider on every query. A dashboard link shared outside its audience renders the sender’s scope, never the recipient’s.',
    points: ['SCIM group sync', 'Per-query evaluation', 'Audited'],
    rows: [
      { name: 'EMEA analyst', detail: 'region-scoped' },
      { name: 'Finance lead', detail: 'full ledger' },
      { name: 'Contractor', detail: 'no payroll' },
    ],
  },
  {
    id: 'cost',
    title: 'Budgeted queries',
    summary: 'Capped at run time',
    body: 'Each team gets a budget the query planner enforces before execution, so warehouse spend is bounded rather than explained after the invoice arrives.',
    points: ['Per-team ceilings', 'Materialised hot paths', 'Cost per dashboard'],
    rows: [
      { name: 'Finance', detail: '62% of budget' },
      { name: 'RevOps', detail: '38% of budget' },
      { name: 'Product', detail: '81% of budget' },
    ],
  },
]
</script>

<template>
  <section data-slot="feature-vertical-tabs-pane" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">Platform</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Three things worth the detail</h2>
      </div>

      <Tabs default-value="definitions" orientation="vertical" class="mt-10">
        <div class="grid gap-8 lg:grid-cols-[20rem_1fr] lg:gap-12">
          <TabsList variant="underline" orientation="vertical" class="h-auto w-full flex-col items-stretch">
            <TabsTrigger
              v-for="feature in features"
              :key="feature.id"
              :value="feature.id"
              variant="underline"
              orientation="vertical"
              class="h-auto flex-col items-start gap-0.5 py-3 text-left"
            >
              <span class="text-sm font-medium">{{ feature.title }}</span>
              <span class="text-muted-foreground text-xs">{{ feature.summary }}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent v-for="feature in features" :key="feature.id" :value="feature.id" class="mt-0">
            <!-- min-h holds the pane at the tallest panel so switching tabs
                 never resizes the section. -->
            <div class="grid min-h-[19rem] gap-6 sm:grid-cols-[1.2fr_1fr]">
              <div>
                <h3 class="text-xl font-semibold tracking-tight">{{ feature.title }}</h3>
                <p class="text-muted-foreground mt-3 leading-relaxed">{{ feature.body }}</p>
                <ul class="mt-5 space-y-2">
                  <li v-for="point in feature.points" :key="point" class="flex items-start gap-2.5 text-sm">
                    <Check class="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{{ point }}</span>
                  </li>
                </ul>
                <Button variant="link" class="mt-5 h-auto p-0">Read the reference</Button>
              </div>

              <Card class="self-start">
                <CardContent class="p-0">
                  <div class="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
                    {{ feature.summary }}
                  </div>
                  <ul class="divide-border divide-y">
                    <li
                      v-for="row in feature.rows"
                      :key="row.name"
                      class="flex items-center justify-between gap-3 px-4 py-2.5"
                    >
                      <span class="min-w-0 truncate font-mono text-xs">{{ row.name }}</span>
                      <span class="text-muted-foreground shrink-0 text-xs">{{ row.detail }}</span>
                    </li>
                  </ul>
                  <Separator />
                  <p class="text-muted-foreground px-4 py-2.5 text-xs">Live values from your workspace.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  </section>
</template>
