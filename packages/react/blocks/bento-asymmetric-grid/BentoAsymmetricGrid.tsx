'use client'

import { ArrowUpRight, Quote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

const capabilities = ['Versioned definitions', 'Row-level access', 'Query budgets', 'Drift alerting', 'Audit export']

const budgets = [
  { team: 'Finance', used: 62 },
  { team: 'RevOps', used: 38 },
  { team: 'Product', used: 81 },
]

export function BentoAsymmetricGrid() {
  return (
    <section data-slot="bento-asymmetric-grid" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">The shape of it</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">One layer, five jobs</h2>
        </div>

        {/* Spans are explicit rather than auto-flowed, so rearranging the
            composition is a class change and not a reshuffle of the markup. */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-rows-2">
          <Card className="sm:row-span-2">
            <CardContent className="flex h-full flex-col p-6">
              <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Everything included</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-balance">No feature gates between plans</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                Limits differ; capabilities do not. The list below is on every plan from the first day of a trial.
              </p>

              <Separator className="my-5" />

              <ul className="space-y-2.5">
                {capabilities.map((capability) => (
                  <li key={capability} className="flex items-center gap-2.5 text-sm">
                    <span className="bg-primary size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>

              <Button variant="outline" size="sm" className="mt-auto self-start pt-0 [&]:mt-6">
                Compare plans
              </Button>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardContent className="flex h-full flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="font-display text-4xl font-bold tracking-tight">4.2 days</p>
                <p className="text-muted-foreground mt-1 text-sm">median time to close, down from 9.4</p>
              </div>
              <Badge variant="secondary" className="shrink-0">
                240 rollouts
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">Query budgets</p>
              <div className="mt-4 space-y-3">
                {budgets.map((budget) => (
                  <div key={budget.team}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-xs font-medium">{budget.team}</span>
                      <span className="text-muted-foreground font-mono text-xs">{budget.used}%</span>
                    </div>
                    <Progress value={budget.used} className="mt-1.5 h-1.5" aria-label={`${budget.team} budget used`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="group">
            <CardContent className="flex h-full flex-col p-6">
              <Quote className="text-muted-foreground/60 size-4" aria-hidden="true" />
              <blockquote className="mt-3 text-sm leading-relaxed">
                “We stopped arguing about whose number was right.”
              </blockquote>
              <p className="text-muted-foreground mt-auto pt-4 text-xs">Erin Walsh · VP Finance, Northwind</p>
              <Button variant="ghost" size="sm" className="mt-2 h-auto justify-start px-0 text-xs">
                Read the story
                <ArrowUpRight
                  className="ml-1 size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
