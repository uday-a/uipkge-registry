<script setup lang="ts">
import { ArrowRight, Check, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Rows are paired, not two independent lists — the saving only reads when the
// old and new step for the same stage sit on one line.
const rows = [
  {
    stage: 'Collect',
    before: 'Analyst exports four CSVs from three systems and reconciles them by hand.',
    after: 'Metrics resolve against the warehouse at query time. Nothing is exported.',
    saving: '~6 h per close',
  },
  {
    stage: 'Define',
    before: 'Each team keeps its own revenue formula in a spreadsheet nobody reviews.',
    after: 'One certified definition, versioned, with an owner and a review step.',
    saving: '11 → 1 definition',
  },
  {
    stage: 'Publish',
    before: 'Dashboards are rebuilt by hand and drift from the deck within a week.',
    after: 'Publishing a definition updates every consumer at once, revertible.',
    saving: 'No rebuild',
  },
  {
    stage: 'Audit',
    before: 'Restatements are reconstructed from email threads at year end.',
    after: 'The change history is the audit trail; the pack exports from it.',
    saving: '~3 days saved',
  },
]
</script>

<template>
  <section data-slot="how-it-works-before-after" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">Before and after</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">The same four stages, minus the relay</h2>
        <p class="text-muted-foreground mt-3 text-lg">
          Nothing here is new work. It is the existing close, with the manual steps removed.
        </p>
      </div>

      <div class="mt-12 space-y-4">
        <div v-for="row in rows" :key="row.stage">
          <div class="flex items-baseline gap-3">
            <span class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">{{ row.stage }}</span>
            <Separator class="flex-1" />
            <span class="text-muted-foreground shrink-0 font-mono text-xs">{{ row.saving }}</span>
          </div>

          <!-- items-stretch so both cards in a row share a height and the
               comparison stays line-for-line. -->
          <div class="mt-3 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
            <Card class="bg-muted/30">
              <CardContent class="flex h-full items-start gap-3 p-4">
                <X class="text-destructive mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p class="text-muted-foreground text-sm leading-relaxed">{{ row.before }}</p>
              </CardContent>
            </Card>

            <div class="hidden items-center justify-center md:flex">
              <ArrowRight class="text-muted-foreground/50 size-4" aria-hidden="true" />
            </div>

            <Card>
              <CardContent class="flex h-full items-start gap-3 p-4">
                <Check class="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p class="text-sm leading-relaxed">{{ row.after }}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div class="border-border mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
        <p class="text-muted-foreground text-sm">Measured against Northwind's own close, the quarter before rollout.</p>
        <Button>
          See the rollout plan
          <ArrowRight class="ml-2 size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </section>
</template>
