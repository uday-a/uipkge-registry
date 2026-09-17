'use client'

import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const features = [
  {
    id: 'definitions',
    title: 'Versioned definitions',
    summary: 'Reviewed like code',
    body: 'Every metric is a file with an owner. Changing one opens a pull request carrying a diff, a reviewer, and a revert path — the same workflow the rest of your repo already uses.',
    points: ['Branch per change', 'Required review', 'One-click revert'],
    rows: [
      { name: 'revenue_net', detail: 'v128 · finance' },
      { name: 'margin_by_channel', detail: 'v41 · finance' },
      { name: 'pipeline_weighted', detail: 'v12 · revops' },
    ],
  },
  {
    id: 'access',
    title: 'Query-time access',
    summary: 'Scope per identity',
    body: 'Row-level scope resolves from your identity provider on every query. A dashboard link shared outside its audience renders the sender’s scope, never the recipient’s.',
    points: ['SCIM group sync', 'Per-query evaluation', 'Audited'],
    rows: [
      { name: 'EMEA analyst', detail: 'region-scoped' },
      { name: 'Finance lead', detail: 'full ledger' },
      { name: 'Contractor', detail: 'no payroll' },
    ],
  },
  {
    id: 'cost',
    title: 'Budgeted queries',
    summary: 'Capped at run time',
    body: 'Each team gets a budget the query planner enforces before execution, so warehouse spend is bounded rather than explained after the invoice arrives.',
    points: ['Per-team ceilings', 'Materialised hot paths', 'Cost per dashboard'],
    rows: [
      { name: 'Finance', detail: '62% of budget' },
      { name: 'RevOps', detail: '38% of budget' },
      { name: 'Product', detail: '81% of budget' },
    ],
  },
]

export function FeatureVerticalTabsPane() {
  return (
    <section data-slot="feature-vertical-tabs-pane" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Platform</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Three things worth the detail</h2>
        </div>

        <Tabs defaultValue="definitions" orientation="vertical" className="mt-10">
          <div className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:gap-12">
            <TabsList variant="underline" orientation="vertical" className="h-auto w-full flex-col items-stretch">
              {features.map((feature) => (
                <TabsTrigger
                  key={feature.id}
                  value={feature.id}
                  variant="underline"
                  orientation="vertical"
                  className="h-auto flex-col items-start gap-0.5 py-3 text-left"
                >
                  <span className="text-sm font-medium">{feature.title}</span>
                  <span className="text-muted-foreground text-xs">{feature.summary}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {features.map((feature) => (
              <TabsContent key={feature.id} value={feature.id} className="mt-0">
                {/* min-h holds the pane at the tallest panel so switching tabs
                    never resizes the section. */}
                <div className="grid min-h-[19rem] gap-6 sm:grid-cols-[1.2fr_1fr]">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground mt-3 leading-relaxed">{feature.body}</p>
                    <ul className="mt-5 space-y-2">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm">
                          <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="link" className="mt-5 h-auto p-0">
                      Read the reference
                    </Button>
                  </div>

                  <Card className="self-start">
                    <CardContent className="p-0">
                      <div className="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
                        {feature.summary}
                      </div>
                      <ul className="divide-border divide-y">
                        {feature.rows.map((row) => (
                          <li key={row.name} className="flex items-center justify-between gap-3 px-4 py-2.5">
                            <span className="min-w-0 truncate font-mono text-xs">{row.name}</span>
                            <span className="text-muted-foreground shrink-0 text-xs">{row.detail}</span>
                          </li>
                        ))}
                      </ul>
                      <Separator />
                      <p className="text-muted-foreground px-4 py-2.5 text-xs">Live values from your workspace.</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  )
}
