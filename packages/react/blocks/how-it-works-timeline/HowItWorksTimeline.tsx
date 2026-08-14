'use client'

import { Check, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const stages = [
  {
    title: 'Kickoff & access',
    status: 'Week 1',
    done: true,
    body: 'A shared channel, a named engineer, and read-only credentials. Nothing is provisioned until scope is signed off.',
    outcomes: ['Workspace provisioned', 'SSO connected', 'Data contract agreed'],
  },
  {
    title: 'Model your data',
    status: 'Week 2',
    done: true,
    body: 'We mirror your warehouse schema and reconcile it against last quarter’s numbers before anything is published.',
    outcomes: ['Schema mirrored', 'Historical backfill', 'Reconciliation signed off'],
  },
  {
    title: 'Pilot with one team',
    status: 'Week 3–4',
    done: false,
    body: 'A single team runs their real reporting cycle on it. We fix what they hit before anyone else sees it.',
    outcomes: ['Pilot cohort live', 'Feedback loop open', 'Runbook drafted'],
  },
  {
    title: 'Roll out & hand over',
    status: 'Week 5',
    done: false,
    body: 'Permissions, alerting, and the runbook move to your team. Support stays on call through the first close.',
    outcomes: ['Org-wide access', 'Alerting configured', 'Ownership transferred'],
  },
]

export function HowItWorksTimeline() {
  return (
    <section data-slot="how-it-works-timeline" className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Implementation</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            From kickoff to hand-over in five weeks
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            The same plan we run for every rollout. No phase starts before the one above it is signed off.
          </p>
        </div>

        <ol className="mt-14 space-y-0">
          {stages.map((stage, index) => (
            <li key={stage.title} className="relative grid grid-cols-[auto_1fr] gap-x-6">
              {/* Rail column: marker plus the connector that links it to the next stage. */}
              <div className="flex flex-col items-center">
                <span
                  className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold ${
                    stage.done
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  {stage.done ? <Check className="size-4" aria-hidden="true" /> : String(index + 1).padStart(2, '0')}
                </span>
                {index < stages.length - 1 && <span className="bg-border w-px grow" aria-hidden="true" />}
              </div>

              <div className="pb-10">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-semibold">{stage.title}</h3>
                  <Badge variant={stage.done ? 'secondary' : 'outline'} className="gap-1.5">
                    <Clock className="size-3" aria-hidden="true" />
                    {stage.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2 max-w-prose text-sm leading-relaxed">{stage.body}</p>

                <Card className="mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      What you have at the end
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2 sm:grid-cols-3">
                      {stage.outcomes.map((outcome) => (
                        <li key={outcome} className="text-foreground flex items-start gap-2 text-sm">
                          <Check className="text-primary mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </li>
          ))}
        </ol>

        <Separator />
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button>Book an implementation call</Button>
          <Button variant="ghost">Download the rollout plan</Button>
        </div>
      </div>
    </section>
  )
}
