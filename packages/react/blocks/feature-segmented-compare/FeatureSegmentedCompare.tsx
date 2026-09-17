'use client'

import { useState } from 'react'
import { Check, TriangleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const modes = [
  {
    id: 'live',
    label: 'Live query',
    summary: 'Every read hits the warehouse at request time.',
    capabilities: [
      'Always current, to the second',
      'No storage footprint on our side',
      'Row-level scope applied per query',
    ],
    constraints: ['Latency follows your warehouse', 'Each read is billable compute'],
    recommendation: 'Use for exploratory analysis and anything finance signs off on.',
  },
  {
    id: 'materialised',
    label: 'Materialised',
    summary: 'Aggregates are computed on a schedule you set.',
    capabilities: [
      'Sub-100ms reads at any concurrency',
      'Warehouse cost bounded by the schedule',
      'Freshness stamp shown with every figure',
    ],
    constraints: ['Stale between runs, by design', 'Backfills reprocess the window'],
    recommendation: 'Use for dashboards opened dozens of times an hour.',
  },
]

export function FeatureSegmentedCompare() {
  const [active, setActive] = useState(modes[0].id)
  const current = modes.find((mode) => mode.id === active) ?? modes[0]

  return (
    <section data-slot="feature-segmented-compare" className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Badge variant="secondary">Execution modes</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Pick per metric, not per platform
            </h2>
          </div>

          <ToggleGroup
            value={active}
            type="single"
            variant="outline"
            size="sm"
            aria-label="Choose an execution mode"
            onValueChange={(value: string) => value && setActive(value)}
          >
            {modes.map((mode) => (
              <ToggleGroupItem key={mode.id} value={mode.id}>
                {mode.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* min-h keeps the card from resizing between modes with different list
            lengths, which would otherwise shift the page on every toggle. */}
        <Card className="mt-8">
          <CardContent className="min-h-[22rem] p-6">
            <p className="text-lg leading-snug font-medium text-balance">{current.summary}</p>

            <Separator className="my-6" />

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">What you get</p>
                <ul className="mt-3 space-y-2.5">
                  {current.capabilities.map((capability) => (
                    <li key={capability} className="flex items-start gap-2.5 text-sm">
                      <Check className="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">What it costs you</p>
                <ul className="mt-3 space-y-2.5">
                  {current.constraints.map((constraint) => (
                    <li key={constraint} className="flex items-start gap-2.5 text-sm">
                      <TriangleAlert className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <span className="text-muted-foreground">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Separator className="my-6" />

            <p className="text-sm">
              <span className="font-medium">Recommendation. </span>
              <span className="text-muted-foreground">{current.recommendation}</span>
            </p>
          </CardContent>
        </Card>

        <Button variant="ghost" className="mt-6">
          Read how the planner chooses
        </Button>
      </div>
    </section>
  )
}
