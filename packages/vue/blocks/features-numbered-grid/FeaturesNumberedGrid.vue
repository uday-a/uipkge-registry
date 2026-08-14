<script setup lang="ts">
import { ArrowRight, Boxes, Clock, GitBranch, Lock, Receipt, Signal } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: GitBranch,
    title: 'Definitions under review',
    body: 'Metrics live in the repo. Changing one opens a pull request with a diff, an owner, and a revert path.',
  },
  {
    icon: Lock,
    title: 'Access at query time',
    body: 'Scope resolves from your identity provider on every query, so a shared link cannot outrun permissions.',
  },
  {
    icon: Clock,
    title: 'Freshness you choose',
    body: 'Materialise the hot aggregates on a schedule; let everything else fall through to the warehouse.',
  },
  {
    icon: Receipt,
    title: 'Cost ceilings per team',
    body: 'Query budgets are enforced where the query runs, not reconciled from an invoice a month later.',
  },
  {
    icon: Signal,
    title: 'Drift alerting',
    body: 'Threshold and anomaly alerts fire against certified metrics, so nobody debates the trigger.',
  },
  {
    icon: Boxes,
    title: 'Embedding without forks',
    body: 'Signed, scoped URLs render the same dashboards inside your product with the viewer’s own permissions.',
  },
]
</script>

<template>
  <section data-slot="features-numbered-grid" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-2xl">
          <Badge variant="secondary">How it holds up</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Six decisions, in order of impact</h2>
        </div>
        <Button variant="outline">
          Read the architecture notes
          <ArrowRight class="ml-2 size-4" aria-hidden="true" />
        </Button>
      </div>

      <!-- gap-px over a border-coloured ground draws hairline rules between
           cells, so the grid reads as one table rather than six floating cards. -->
      <div
        class="bg-border border-border mt-10 grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-3"
      >
        <article v-for="(feature, index) in features" :key="feature.title" class="bg-background p-6">
          <div class="flex items-center gap-3">
            <span class="text-muted-foreground/70 font-mono text-xs">{{ String(index + 1).padStart(2, '0') }}</span>
            <component :is="feature.icon" class="text-muted-foreground size-4" aria-hidden="true" />
          </div>
          <h3 class="mt-4 text-base font-semibold">{{ feature.title }}</h3>
          <p class="text-muted-foreground mt-2 text-sm leading-relaxed">{{ feature.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
