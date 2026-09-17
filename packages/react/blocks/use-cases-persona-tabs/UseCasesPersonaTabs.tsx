'use client'

import { ArrowRight, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const personas = [
  {
    value: 'analytics',
    role: 'Data & analytics',
    pain: 'Every request becomes a bespoke SQL ticket, and nobody trusts the number in the deck.',
    outcomes: [
      'Publish one certified metric definition per number',
      'Retire the ad-hoc query queue without losing coverage',
      'Trace any figure back to the column it came from',
    ],
    metric: { value: '71%', label: 'fewer ad-hoc data requests after one quarter' },
    cta: 'See the analyst workflow',
  },
  {
    value: 'finance',
    role: 'Finance',
    pain: 'Close depends on four spreadsheets and one person who knows how they link.',
    outcomes: [
      'Reconcile against the ledger before anything publishes',
      'Lock a period so restated figures cannot drift',
      'Hand auditors a change log instead of a folder',
    ],
    metric: { value: '5 days', label: 'cut from the average monthly close' },
    cta: 'See the close workflow',
  },
  {
    value: 'revops',
    role: 'RevOps',
    pain: 'Pipeline reporting disagrees with the CRM, so forecast reviews start with an argument.',
    outcomes: [
      'One pipeline definition shared by sales and finance',
      'Stage changes tracked with the rep and the timestamp',
      'Forecast snapshots you can diff week over week',
    ],
    metric: { value: '2.4pp', label: 'tighter forecast accuracy band' },
    cta: 'See the forecast workflow',
  },
  {
    value: 'engineering',
    role: 'Engineering',
    pain: 'The reporting layer is an undocumented service nobody wants to own.',
    outcomes: [
      'Definitions live in the repo, reviewed like any other change',
      'No bespoke ETL to babysit at 3am',
      'Warehouse cost ceilings enforced per team',
    ],
    metric: { value: '0', label: 'bespoke pipelines to maintain' },
    cta: 'See the engineering setup',
  },
]

export function UseCasesPersonaTabs() {
  return (
    <section data-slot="use-cases-persona-tabs" className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Use cases</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Pick the seat you sit in</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Same platform, four very different first weeks. Start with the one that matches your job.
          </p>
        </div>

        <Tabs defaultValue="analytics" className="mt-10">
          {/* flex-nowrap + horizontal scroll: the trigger row keeps its height
              whether there are three roles or thirty. */}
          <TabsList variant="segmented" className="flex-nowrap overflow-x-auto">
            {personas.map((persona) => (
              <TabsTrigger key={persona.value} value={persona.value} variant="segmented">
                {persona.role}
              </TabsTrigger>
            ))}
          </TabsList>

          {personas.map((persona) => (
            <TabsContent key={persona.value} value={persona.value} className="mt-8">
              {/* min-h keeps the panel from collapsing between tabs with shorter copy. */}
              <div className="grid min-h-[19rem] gap-8 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <p className="text-muted-foreground text-sm">Today</p>
                  <p className="mt-1.5 text-lg leading-snug font-medium text-balance">{persona.pain}</p>

                  <p className="text-muted-foreground mt-7 text-sm">With uipkge</p>
                  <ul className="mt-3 space-y-3">
                    {persona.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2.5 text-sm">
                        <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="mt-7">
                    {persona.cta}
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </Button>
                </div>

                <Card className="self-start">
                  <CardContent className="p-6">
                    <p className="font-display text-4xl font-bold tracking-tight">{persona.metric.value}</p>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{persona.metric.label}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
