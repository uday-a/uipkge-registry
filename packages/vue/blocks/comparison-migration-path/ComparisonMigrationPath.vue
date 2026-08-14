<script setup lang="ts">
import type { Component } from 'vue'
import { ArrowRight, Check, Minus, RefreshCw } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// verdict drives the icon and tone, so rows stay declarative and a new row
// cannot forget to style itself.
const rows = [
  {
    area: 'Warehouse and models',
    verdict: 'keep',
    detail: 'Untouched. We read from them, nothing is rewritten.',
    effort: 'None',
  },
  {
    area: 'dbt project',
    verdict: 'keep',
    detail: 'Imported as metric sources; your DAG keeps running.',
    effort: 'Half a day',
  },
  {
    area: 'Dashboard layouts',
    verdict: 'change',
    detail: 'Rebuilt against certified metrics, usually faster than the original.',
    effort: '1–2 weeks',
  },
  {
    area: 'Metric formulas',
    verdict: 'change',
    detail: 'Moved from dashboard config into versioned files.',
    effort: '1 week',
  },
  {
    area: 'Per-dashboard permissions',
    verdict: 'retire',
    detail: 'Replaced by row-level scope from your IdP.',
    effort: 'None',
  },
  {
    area: 'Bespoke extract jobs',
    verdict: 'retire',
    detail: 'Deleted once the metrics they fed are certified.',
    effort: 'None',
  },
]

const tone: Record<string, { icon: Component; label: string; class: string }> = {
  keep: { icon: Check, label: 'Keep', class: 'text-success' },
  change: { icon: RefreshCw, label: 'Change', class: 'text-muted-foreground' },
  retire: { icon: Minus, label: 'Retire', class: 'text-muted-foreground/60' },
}
</script>

<template>
  <section data-slot="comparison-migration-path" class="bg-background">
    <div class="mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">Migration</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">What actually changes</h2>
        <p class="text-muted-foreground mt-3 text-lg">
          Most of the stack stays exactly where it is. The effort column is measured from real rollouts.
        </p>
      </div>

      <Card class="mt-10">
        <CardContent class="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead class="w-28">Verdict</TableHead>
                <TableHead>What happens</TableHead>
                <TableHead class="w-32 text-right">Effort</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in rows" :key="row.area">
                <TableCell class="font-medium">{{ row.area }}</TableCell>
                <TableCell>
                  <span class="inline-flex items-center gap-1.5 text-xs" :class="tone[row.verdict].class">
                    <component :is="tone[row.verdict].icon" class="size-3.5" aria-hidden="true" />
                    {{ tone[row.verdict].label }}
                  </span>
                </TableCell>
                <TableCell class="text-muted-foreground text-sm">{{ row.detail }}</TableCell>
                <TableCell class="text-right font-mono text-xs">{{ row.effort }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Separator />
          <p class="text-muted-foreground px-6 py-4 text-xs leading-relaxed">
            Effort assumes one engineer and one analyst part-time. Teams with more than about 200 existing dashboards
            usually stage the rebuild by department rather than doing it in one pass.
          </p>
        </CardContent>
      </Card>

      <Button class="mt-6">
        Get a migration estimate
        <ArrowRight class="ml-2 size-4" aria-hidden="true" />
      </Button>
    </div>
  </section>
</template>
