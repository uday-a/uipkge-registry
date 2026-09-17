'use client'

import { Fragment } from 'react'
import { ArrowRight, Building2, Cloud, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const zones = [
  {
    icon: Building2,
    label: 'Your warehouse',
    detail: 'Snowflake, BigQuery, Redshift, Postgres',
    holds: ['Customer rows', 'PII and PHI', 'Raw event history'],
  },
  {
    icon: Cloud,
    label: 'Northwind',
    detail: 'Your chosen region',
    holds: ['Metric definitions', 'Query plans and timings', 'Access decisions'],
  },
  {
    icon: Lock,
    label: 'Your viewers',
    detail: 'Scoped per identity',
    holds: ['Aggregated results only', 'Nothing cached in the browser'],
  },
]

const crosses = ['Column names and types', 'Aggregate results, scoped', 'Query metadata and timings']
const neverCrosses = ['Customer rows', 'Primary keys', 'Free-text fields', 'Anything you have not modelled']

export function SecurityDataFlow() {
  return (
    <section data-slot="security-data-flow" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Data flow</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">What crosses the boundary</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            And, more usefully, what never does. Both lists are below the diagram.
          </p>
        </div>

        <Card className="mt-10">
          <CardContent className="p-6 lg:p-8">
            <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
              {zones.map((zone, index) => (
                <Fragment key={zone.label}>
                  <div className="border-border bg-muted/30 rounded-lg border p-5">
                    <span
                      className="border-border bg-background text-muted-foreground flex size-9 items-center justify-center rounded-lg border"
                      aria-hidden="true"
                    >
                      <zone.icon className="size-4" />
                    </span>
                    <p className="mt-4 text-sm font-semibold">{zone.label}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">{zone.detail}</p>
                    <ul className="mt-3 space-y-1">
                      {zone.holds.map((item) => (
                        <li key={item} className="text-muted-foreground font-mono text-[11px]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {index < zones.length - 1 && (
                    <div
                      className="text-muted-foreground/50 flex items-center justify-center lg:px-2"
                      aria-hidden="true"
                    >
                      <ArrowRight className="size-4 rotate-90 lg:rotate-0" />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>

            <Separator className="my-8" />

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                  Crosses the boundary
                </p>
                <ul className="mt-3 space-y-2">
                  {crosses.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <span className="bg-primary size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Never crosses</p>
                <ul className="mt-3 space-y-2">
                  {neverCrosses.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <span className="bg-muted-foreground/40 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" className="mt-6">
          Read the architecture note
        </Button>
      </div>
    </section>
  )
}
