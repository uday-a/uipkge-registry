'use client'

import { Fragment } from 'react'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const rows = [
  {
    topic: 'Where the definition lives',
    them: 'Inside each dashboard, duplicated per team',
    us: 'One file in your repository, with an owner',
  },
  {
    topic: 'How a change is reviewed',
    them: 'Saved in place; the previous version is gone',
    us: 'Pull request with a diff, reviewers, and a revert',
  },
  {
    topic: 'Where access is decided',
    them: 'Per dashboard, re-applied by hand on each new one',
    us: 'Per query, resolved from your identity provider',
  },
  {
    topic: 'What a shared link exposes',
    them: 'Whatever the sender could see',
    us: 'Whatever the recipient is scoped to see',
  },
  {
    topic: 'How cost is controlled',
    them: 'Reconciled from the warehouse invoice, monthly',
    us: 'Budget enforced by the planner, before execution',
  },
  {
    topic: 'What happens if you leave',
    them: 'Definitions stay in the vendor’s format',
    us: 'Definitions and history are already in your repo',
  },
]

export function ComparisonVsAlternatives() {
  return (
    <section data-slot="comparison-vs-alternatives" className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">How it differs</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Against the way it is usually done</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Both columns describe a mechanism. Neither is a score, because you can check a mechanism.
          </p>
        </div>

        <Card className="mt-10">
          <CardContent className="p-0">
            <div className="text-muted-foreground grid grid-cols-1 gap-4 px-6 py-3 text-xs font-medium sm:grid-cols-[1fr_1fr_1fr]">
              <span>Topic</span>
              <span className="hidden sm:block">Typical BI stack</span>
              <span className="hidden sm:block">This approach</span>
            </div>
            <Separator />

            {rows.map((row, index) => (
              <Fragment key={row.topic}>
                <div className="grid gap-3 px-6 py-4 sm:grid-cols-[1fr_1fr_1fr] sm:gap-4">
                  <p className="text-sm font-medium">{row.topic}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <span className="text-muted-foreground/70 mr-1.5 text-xs sm:hidden">Typical:</span>
                    {row.them}
                  </p>
                  <p className="text-sm leading-relaxed">
                    <span className="text-muted-foreground/70 mr-1.5 text-xs sm:hidden">Here:</span>
                    {row.us}
                  </p>
                </div>
                {index < rows.length - 1 && <Separator />}
              </Fragment>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button>
            See it on your own data
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Button>
          <p className="text-muted-foreground text-sm">No comparison page survives contact with your warehouse.</p>
        </div>
      </div>
    </section>
  )
}
