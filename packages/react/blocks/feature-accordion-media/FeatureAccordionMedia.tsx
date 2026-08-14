'use client'

import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    id: 'catalog',
    title: 'Catalogue what exists',
    body: 'The schema mirror lists every table and column with its freshness, so modelling starts from what is actually there rather than what the docs claim.',
    rows: [
      { name: 'warehouse.orders', detail: 'fresh · 2 min' },
      { name: 'warehouse.refunds', detail: 'fresh · 2 min' },
      { name: 'legacy.orders_v1', detail: 'stale · 41 days' },
    ],
  },
  {
    id: 'review',
    title: 'Review before it ships',
    body: 'Definition changes open a pull request. Reviewers see the diff, the consumers affected, and the reconciliation result against prior quarters.',
    rows: [
      { name: '+ window: trailing_28d', detail: 'added' },
      { name: '- window: trailing_30d', detail: 'removed' },
      { name: '41 consumers affected', detail: 'checked' },
    ],
  },
  {
    id: 'observe',
    title: 'Watch it after it ships',
    body: 'Freshness and drift alerts fire against certified metrics and route to the owner named in the definition, not a shared inbox.',
    rows: [
      { name: 'revenue_net', detail: 'within threshold' },
      { name: 'margin_by_channel', detail: 'within threshold' },
      { name: 'pipeline_weighted', detail: 'drift · owner paged' },
    ],
  },
]

export function FeatureAccordionMedia() {
  const [open, setOpen] = useState(features[0].id)
  // The pane follows the open item; falling back to the first keeps the pane
  // populated when everything is collapsed.
  const active = features.find((feature) => feature.id === open) ?? features[0]

  return (
    <section data-slot="feature-accordion-media" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Workflow</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Three habits, one loop</h2>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Accordion value={open} onValueChange={setOpen} type="single" collapsible className="w-full">
            {features.map((feature) => (
              <AccordionItem key={feature.id} value={feature.id}>
                <AccordionTrigger className="text-left font-medium">{feature.title}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {feature.body}
                  {/* Inline pane below the breakpoint, where a side pane would be
                      too narrow to read. */}
                  <Card className="mt-4 lg:hidden">
                    <CardContent className="p-0">
                      <ul className="divide-border divide-y">
                        {feature.rows.map((row) => (
                          <li key={row.name} className="flex items-center justify-between gap-3 px-4 py-2.5">
                            <span className="text-foreground min-w-0 truncate font-mono text-xs">{row.name}</span>
                            <span className="shrink-0 text-xs">{row.detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Card className="hidden self-start lg:block">
            <CardContent className="p-0">
              <div className="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
                {active.title}
              </div>
              <ul className="divide-border divide-y">
                {active.rows.map((row) => (
                  <li key={row.name} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="min-w-0 truncate font-mono text-xs">{row.name}</span>
                    <span className="text-muted-foreground shrink-0 text-xs">{row.detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Button variant="ghost" className="mt-8">
          See the full workflow
        </Button>
      </div>
    </section>
  )
}
