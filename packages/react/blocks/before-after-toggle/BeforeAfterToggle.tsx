'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const states = [
  {
    id: 'before',
    label: 'Before',
    caption: 'Three dashboards, three revenue numbers',
    changed: 'Each team maintained its own formula, and none of them agreed at close.',
    rows: [
      { source: 'Exec summary', value: '£4,182,400', tone: 'off' },
      { source: 'Finance close pack', value: '£4,140,900', tone: 'off' },
      { source: 'Board deck', value: '£4,206,150', tone: 'off' },
    ],
  },
  {
    id: 'after',
    label: 'After',
    caption: 'One certified definition',
    changed: 'All three resolve the same definition, so the reconciliation step disappeared.',
    rows: [
      { source: 'Exec summary', value: '£4,140,900', tone: 'on' },
      { source: 'Finance close pack', value: '£4,140,900', tone: 'on' },
      { source: 'Board deck', value: '£4,140,900', tone: 'on' },
    ],
  },
]

export function BeforeAfterToggle() {
  const [active, setActive] = useState('before')
  const current = states.find((state) => state.id === active) ?? states[0]

  return (
    <section data-slot="before-after-toggle" className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Badge variant="secondary">Before and after</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">One number, three places</h2>
          </div>

          {/* The control keeps its position across switches: moving it would make
              the comparison harder than just showing both. */}
          <ToggleGroup
            value={active}
            type="single"
            variant="outline"
            size="sm"
            aria-label="Show the state before or after"
            onValueChange={(value: string) => value && setActive(value)}
          >
            {states.map((state) => (
              <ToggleGroupItem key={state.id} value={state.id}>
                {state.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <Card className="mt-8">
          <CardContent className="p-0">
            <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-2.5">
              <span className="text-sm font-semibold">{current.label}</span>
              <span className="text-muted-foreground text-xs">{current.caption}</span>
            </div>

            {/* Fixed height across both states so toggling never resizes the card. */}
            <ul className="divide-border min-h-[11rem] divide-y">
              {current.rows.map((row) => (
                <li key={row.source} className="flex items-center justify-between gap-4 px-4 py-4">
                  <span className="text-sm">{row.source}</span>
                  <span
                    className={`font-mono text-sm tabular-nums ${
                      row.tone === 'on' ? 'text-success font-semibold' : 'text-muted-foreground'
                    }`}
                  >
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>

            <Separator />
            <p className="text-muted-foreground px-4 py-3 text-xs leading-relaxed">{current.changed}</p>
          </CardContent>
        </Card>

        <Button variant="ghost" className="mt-6">
          How certification works
        </Button>
      </div>
    </section>
  )
}
