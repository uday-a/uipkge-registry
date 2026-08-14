<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

const panels = [
  {
    eyebrow: 'Modelling',
    title: 'One definition, every surface',
    body: 'Dashboards, exports, and the API all resolve the same certified metric, so the number cannot disagree with itself.',
    link: 'See the metric layer',
    kind: 'lineage',
  },
  {
    eyebrow: 'Governance',
    title: 'Permissions you can prove',
    body: 'Scope resolves per query from your identity provider, and every evaluation lands in an exportable audit trail.',
    link: 'Read the access model',
    kind: 'access',
  },
  {
    eyebrow: 'Performance',
    title: 'Budgeted, not throttled',
    body: 'Each team gets a query budget enforced at run time, with materialised aggregates carrying the frequent load.',
    link: 'See the caching rules',
    kind: 'budget',
  },
  {
    eyebrow: 'Delivery',
    title: 'Ship without a redeploy',
    body: 'Publishing a definition change rolls out to every consumer immediately, and reverting is the same one click.',
    link: 'How releases work',
    kind: 'release',
  },
]

const lineage = ['warehouse.orders', 'metrics.revenue_net', 'dashboard.exec_summary']
const access = [
  { label: 'EMEA analyst', value: 'Region-scoped' },
  { label: 'Finance lead', value: 'Full ledger' },
  { label: 'Contractor', value: 'No payroll' },
]
const budgets = [
  { team: 'Finance', used: 62 },
  { team: 'RevOps', used: 38 },
  { team: 'Product', used: 81 },
]
const releases = [
  { version: 'v128', note: 'revenue_net → trailing 28d' },
  { version: 'v127', note: 'added margin_by_channel' },
]
</script>

<template>
  <section data-slot="features-2x2-spotlight" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">Platform</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Four things it does properly</h2>
        <p class="text-muted-foreground mt-3 text-lg">
          Each panel is a mechanism, not a promise — the illustration is the real shape of the feature.
        </p>
      </div>

      <div class="mt-12 grid gap-5 md:grid-cols-2">
        <Card v-for="panel in panels" :key="panel.title" class="group overflow-hidden">
          <CardContent class="flex h-full flex-col p-0">
            <!-- Illustration slot: built from primitives so it themes with the
                 page instead of shipping a baked screenshot. -->
            <div class="bg-muted/40 border-border border-b p-6">
              <div v-if="panel.kind === 'lineage'" class="space-y-2">
                <div
                  v-for="(node, index) in lineage"
                  :key="node"
                  class="border-border bg-card rounded-md border px-3 py-2 font-mono text-xs"
                  :class="index === lineage.length - 1 ? 'ml-8' : index === 1 ? 'ml-4' : ''"
                >
                  {{ node }}
                </div>
              </div>

              <div
                v-else-if="panel.kind === 'access'"
                class="divide-border border-border bg-card divide-y rounded-md border"
              >
                <div v-for="row in access" :key="row.label" class="flex items-center justify-between gap-3 px-3 py-2">
                  <span class="text-xs font-medium">{{ row.label }}</span>
                  <span class="text-muted-foreground font-mono text-xs">{{ row.value }}</span>
                </div>
              </div>

              <div v-else-if="panel.kind === 'budget'" class="space-y-3">
                <div v-for="row in budgets" :key="row.team">
                  <div class="flex items-baseline justify-between gap-3">
                    <span class="text-xs font-medium">{{ row.team }}</span>
                    <span class="text-muted-foreground font-mono text-xs">{{ row.used }}%</span>
                  </div>
                  <Progress :model-value="row.used" class="mt-1.5 h-1.5" :aria-label="`${row.team} budget used`" />
                </div>
              </div>

              <div v-else class="space-y-3">
                <div v-for="release in releases" :key="release.version" class="flex items-baseline gap-3">
                  <span class="text-primary font-mono text-xs">{{ release.version }}</span>
                  <span class="text-muted-foreground min-w-0 truncate text-xs">{{ release.note }}</span>
                </div>
                <Separator />
                <p class="text-muted-foreground text-xs">Rolled out to 41 consumers, no redeploy.</p>
              </div>
            </div>

            <div class="flex flex-1 flex-col p-6">
              <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">{{ panel.eyebrow }}</p>
              <h3 class="mt-2 text-lg font-semibold tracking-tight">{{ panel.title }}</h3>
              <p class="text-muted-foreground mt-2 text-sm leading-relaxed">{{ panel.body }}</p>
              <Button variant="link" class="mt-auto h-auto justify-start p-0 pt-4 text-sm">
                {{ panel.link }}
                <ArrowRight
                  class="ml-1.5 size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
