'use client'

import { TriangleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const angles = [
  {
    id: 'authoring',
    label: 'Authoring',
    headline: 'A metric is a file, not a setting',
    body: 'Definitions are YAML in your repository. They are reviewed, branched, and reverted with the tools your team already runs, and the history is yours if you leave.',
    constraint: 'Requires someone comfortable opening a pull request. There is no drag-and-drop builder.',
    rows: [
      { name: 'metrics/revenue_net.yml', detail: 'v128' },
      { name: 'metrics/margin.yml', detail: 'v41' },
      { name: 'metrics/pipeline.yml', detail: 'v12' },
    ],
  },
  {
    id: 'execution',
    label: 'Execution',
    headline: 'The planner decides where a query runs',
    body: 'Hot aggregates resolve from materialised tables; everything else falls through to the warehouse. Each result carries the freshness it was served at.',
    constraint: 'Materialised paths are stale between runs by design, and the stamp says so rather than hiding it.',
    rows: [
      { name: 'revenue rollup', detail: 'materialised · 5 min' },
      { name: 'pipeline by stage', detail: 'materialised · 1 hr' },
      { name: 'raw event search', detail: 'live query' },
    ],
  },
  {
    id: 'governance',
    label: 'Governance',
    headline: 'Access is decided at query time',
    body: 'Scope resolves from your identity provider on every request, and each evaluation is written to an append-only log you can export.',
    constraint: 'Group changes propagate on your directory’s sync interval, not instantly.',
    rows: [
      { name: 'EMEA analyst', detail: 'region-scoped' },
      { name: 'Finance lead', detail: 'full ledger' },
      { name: 'Contractor', detail: 'no payroll' },
    ],
  },
]

export function FeatureTabbedDeepdive() {
  return (
    <section data-slot="feature-tabbed-deepdive" className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">In depth</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            The metric layer, from three angles
          </h2>
        </div>

        <Tabs defaultValue="authoring" className="mt-10">
          <TabsList variant="segmented" className="flex-nowrap overflow-x-auto">
            {angles.map((angle) => (
              <TabsTrigger key={angle.id} value={angle.id} variant="segmented">
                {angle.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {angles.map((angle) => (
            <TabsContent key={angle.id} value={angle.id} className="mt-6">
              <div className="grid min-h-[18rem] gap-6 sm:grid-cols-[1.3fr_1fr]">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-balance">{angle.headline}</h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{angle.body}</p>

                  <Separator className="my-5" />

                  <p className="flex items-start gap-2.5 text-sm">
                    <TriangleAlert className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span className="text-muted-foreground">{angle.constraint}</span>
                  </p>
                </div>

                <Card className="self-start">
                  <CardContent className="p-0">
                    <div className="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
                      {angle.label}
                    </div>
                    <ul className="divide-border divide-y">
                      {angle.rows.map((row) => (
                        <li key={row.name} className="flex items-center justify-between gap-3 px-4 py-2.5">
                          <span className="min-w-0 truncate font-mono text-xs">{row.name}</span>
                          <span className="text-muted-foreground shrink-0 text-xs">{row.detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Button variant="outline" className="mt-8">
          Read the full reference
        </Button>
      </div>
    </section>
  )
}
