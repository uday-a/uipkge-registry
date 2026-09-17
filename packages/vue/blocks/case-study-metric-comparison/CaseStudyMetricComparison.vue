<script setup lang="ts">
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// `better` records which direction is good, so the delta colour never has to be
// hard-coded per row — a falling close time is good, falling accuracy is not.
const metrics = [
  { name: 'Days to close', before: '9.4', after: '4.2', delta: '−55%', better: 'down' },
  { name: 'Ad-hoc data requests / month', before: '212', after: '61', delta: '−71%', better: 'down' },
  { name: 'Certified metrics published', before: '0', after: '340', delta: '+340', better: 'up' },
  { name: 'Forecast accuracy band', before: '±6.1pp', after: '±3.7pp', delta: '−2.4pp', better: 'down' },
]
</script>

<template>
  <section data-slot="case-study-metric-comparison" class="bg-background">
    <div class="mx-auto max-w-4xl px-6 py-20 lg:py-28">
      <Badge variant="secondary">Northwind Logistics</Badge>
      <h2 class="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Two quarters either side of the rollout
      </h2>
      <p class="text-muted-foreground mt-3 text-lg">
        Their numbers, their definitions, measured the same way before and after. Nothing normalised.
      </p>

      <Card class="mt-8">
        <CardContent class="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead class="text-right">Q4 2025</TableHead>
                <TableHead class="text-right">Q2 2026</TableHead>
                <TableHead class="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="metric in metrics" :key="metric.name">
                <TableCell class="font-medium">{{ metric.name }}</TableCell>
                <TableCell class="text-muted-foreground text-right font-mono text-sm">{{ metric.before }}</TableCell>
                <TableCell class="text-right font-mono text-sm font-semibold">{{ metric.after }}</TableCell>
                <TableCell class="text-right">
                  <span class="text-success inline-flex items-center gap-1.5 font-mono text-sm">
                    <component
                      :is="metric.better === 'down' ? TrendingDown : TrendingUp"
                      class="size-3.5"
                      aria-hidden="true"
                    />
                    {{ metric.delta }}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Separator />

          <p class="text-muted-foreground px-6 py-4 text-xs leading-relaxed">
            Measured from their own close calendar and ticket queue. The rollout completed between the two quarters; no
            headcount was added or removed in finance during the period.
          </p>
        </CardContent>
      </Card>

      <Button class="mt-8">
        Read how they did it
        <ArrowRight class="ml-2 size-4" aria-hidden="true" />
      </Button>
    </div>
  </section>
</template>
