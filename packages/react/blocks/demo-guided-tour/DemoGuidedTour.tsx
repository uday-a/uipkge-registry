'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

// Each step names the panel it highlights, so the copy and the mock cannot
// drift apart when someone reorders the tour.
const steps = [
  {
    target: 'catalog',
    title: 'Start from the catalogue',
    body: 'Every table we mirrored, with its freshness. Pick what the metric reads from.',
  },
  {
    target: 'definition',
    title: 'Write the definition',
    body: 'The window, the owner, and the joins. This is the file that opens a pull request.',
  },
  {
    target: 'consumers',
    title: 'See who it affects',
    body: 'Before publishing, the consumer list shows every dashboard and export that resolves it.',
  },
  {
    target: 'history',
    title: 'Check the history',
    body: 'Every prior version with its reviewer, and a one-click revert to any of them.',
  },
]

const panels = [
  { id: 'catalog', label: 'Catalogue', rows: ['warehouse.orders', 'warehouse.refunds', 'warehouse.fx_rates'] },
  {
    id: 'definition',
    label: 'revenue_net.yml',
    rows: ['window: trailing_28d', 'owner: finance-analytics', 'joins: refunds, fx'],
  },
  { id: 'consumers', label: 'Consumers', rows: ['Exec summary', 'Finance close pack', 'Partner API'] },
  {
    id: 'history',
    label: 'History',
    rows: ['v128 · 14 Feb · A. Reyes', 'v127 · 02 Jan · A. Reyes', 'v126 · 11 Dec · M. Ellery'],
  },
]

export function DemoGuidedTour() {
  const [index, setIndex] = useState(0)
  const current = steps[index]
  const progress = ((index + 1) / steps.length) * 100

  return (
    <section data-slot="demo-guided-tour" className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Badge variant="secondary">Guided tour</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Four screens, ninety seconds</h2>
          </div>
          <Button variant="ghost" size="sm">
            Skip and just read the docs
          </Button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:gap-10">
          <div>
            <Progress value={progress} className="h-1" aria-label="Tour progress" />
            <p className="text-muted-foreground mt-3 font-mono text-xs">
              Step {index + 1} of {steps.length}
            </p>

            {/* min-h holds the copy block at its tallest so the controls do not
                move between steps. */}
            <div className="min-h-[7rem]">
              <h3 className="mt-4 text-xl font-semibold tracking-tight">{current.title}</h3>
              <p className="text-muted-foreground mt-2 leading-relaxed">{current.body}</p>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={index === 0} onClick={() => setIndex(index - 1)}>
                <ArrowLeft className="mr-1.5 size-3.5" aria-hidden="true" />
                Back
              </Button>
              <Button size="sm" disabled={index === steps.length - 1} onClick={() => setIndex(index + 1)}>
                Next
                <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="space-y-2 p-4">
              {panels.map((panel) => (
                <div
                  key={panel.id}
                  className={`rounded-lg border p-3 transition-colors ${
                    panel.id === current.target
                      ? 'border-primary bg-muted/40'
                      : 'border-border bg-background opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-xs font-medium">{panel.label}</p>
                    {panel.id === current.target && <Badge variant="secondary">This step</Badge>}
                  </div>
                  <Separator className="my-2" />
                  <ul className="space-y-1">
                    {panel.rows.map((row) => (
                      <li key={row} className="text-muted-foreground truncate font-mono text-xs">
                        {row}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
