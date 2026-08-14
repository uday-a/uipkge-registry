'use client'

import { Fragment } from 'react'
import { ArrowRight, Boxes, FileCheck, GitPullRequest, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const stages = [
  { icon: Boxes, label: 'Connect', body: 'Read-only credentials to the warehouse.', artefact: 'Schema mirror' },
  { icon: GitPullRequest, label: 'Define', body: 'Metrics authored as reviewable files.', artefact: 'Merged PR' },
  { icon: FileCheck, label: 'Certify', body: 'Reconciled against the prior quarters.', artefact: 'Sign-off' },
  { icon: Send, label: 'Publish', body: 'Rolled out to every consumer at once.', artefact: 'Live metric' },
]

export function HowItWorksArrowFlow() {
  return (
    <section data-slot="how-it-works-arrow-flow" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">The flow</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Four stages, one artefact each</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Every stage ends in something you can point at, so progress is never a status update.
          </p>
        </div>

        {/* Arrows sit between cells rather than inside cards, so they stay put
            when a card's copy runs longer. Below md the row becomes a rail. */}
        <div className="mt-12 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-0">
          {stages.map((stage, index) => (
            <Fragment key={stage.label}>
              <div className="flex items-center gap-4 md:contents">
                <Card className="flex-1 md:h-full">
                  <CardContent className="p-5">
                    <span
                      className="border-border text-muted-foreground flex size-9 items-center justify-center rounded-lg border"
                      aria-hidden="true"
                    >
                      <stage.icon className="size-4" />
                    </span>
                    <p className="mt-4 text-sm font-semibold">{stage.label}</p>
                    <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">{stage.body}</p>
                    <p className="text-muted-foreground/80 mt-3 font-mono text-[11px] tracking-wide uppercase">
                      → {stage.artefact}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {index < stages.length - 1 && (
                <div
                  className="text-muted-foreground/50 hidden items-center justify-center px-2 md:flex"
                  aria-hidden="true"
                >
                  <ArrowRight className="size-4" />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <div className="mt-10">
          <Button variant="outline">
            Walk through a real rollout
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
