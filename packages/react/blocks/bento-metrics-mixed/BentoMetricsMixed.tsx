'use client'

import { ArrowUpRight, CircleCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const series = [4, 9, 7, 14, 11, 18, 16, 23, 21, 28, 26, 33]

const definitions = [
  { name: 'revenue_net', owner: 'finance' },
  { name: 'margin_by_channel', owner: 'finance' },
  { name: 'pipeline_weighted', owner: 'revops' },
]
// Inline SVG polyline: a sparkline does not justify a charting dependency.
function points(values: number[]) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 30 - ((value - min) / span) * 26
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

export function BentoMetricsMixed() {
  return (
    <section data-slot="bento-metrics-mixed" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Badge variant="secondary">At a glance</Badge>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">Days to close</p>
              <p className="font-display mt-2 text-3xl font-bold tracking-tight">4.2</p>
              <p className="text-success mt-1 text-xs">down from 9.4</p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardContent className="p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-muted-foreground text-xs tracking-wide uppercase">Certified metrics published</p>
                <p className="font-mono text-xs">12 months</p>
              </div>
              <p className="font-display mt-2 text-3xl font-bold tracking-tight">340</p>
              <svg
                className="text-primary/70 mt-2 h-8 w-full"
                viewBox="0 0 100 32"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polyline points={points(series)} fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex h-full flex-col p-5">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">Status</p>
              <div className="mt-3 flex items-center gap-2">
                <CircleCheck className="text-success size-4" aria-hidden="true" />
                <p className="text-sm font-medium">All systems operational</p>
              </div>
              <p className="text-muted-foreground mt-auto pt-3 font-mono text-xs">99.98% · rolling 90 days</p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardContent className="p-5">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">Most-read definitions</p>
              <ul className="mt-3 space-y-2">
                {definitions.map((definition) => (
                  <li key={definition.name} className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate font-mono text-xs">{definition.name}</span>
                    <span className="text-muted-foreground shrink-0 text-xs">{definition.owner}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardContent className="flex h-full flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <p className="text-sm font-medium">See the whole workspace</p>
                <p className="text-muted-foreground mt-1 text-xs">Live demo, no signup, real definitions.</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                Open the demo
                <ArrowUpRight className="ml-1.5 size-3.5" aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Separator className="mt-6" />
        <p className="text-muted-foreground mt-4 text-xs">Figures from the Northwind workspace, refreshed hourly.</p>
      </div>
    </section>
  )
}
