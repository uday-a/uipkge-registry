'use client'

import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const steps = [
  {
    id: 'connect',
    label: 'Connect',
    action: 'Point us at the warehouse with a read-only role.',
    result: 'Schema mirrored, 412 tables catalogued, nothing copied out.',
    rows: [
      { name: 'warehouse.orders', detail: '2.4M rows' },
      { name: 'warehouse.refunds', detail: '88k rows' },
      { name: 'warehouse.fx_rates', detail: 'daily' },
    ],
  },
  {
    id: 'define',
    label: 'Define',
    action: 'Author the metric as a file and open a pull request.',
    result: 'Reviewed by its owner, with a diff and a revert path.',
    rows: [
      { name: 'revenue_net', detail: 'finance-analytics' },
      { name: 'margin_by_channel', detail: 'finance-analytics' },
      { name: 'pipeline_weighted', detail: 'revops' },
    ],
  },
  {
    id: 'certify',
    label: 'Certify',
    action: 'Reconcile the definition against the prior four quarters.',
    result: 'Sign-off recorded; the metric can now be published.',
    rows: [
      { name: 'Q4 2025', detail: 'matched' },
      { name: 'Q3 2025', detail: 'matched' },
      { name: 'Q2 2025', detail: 'matched' },
    ],
  },
  {
    id: 'publish',
    label: 'Publish',
    action: 'Release to every consumer at once.',
    result: 'Dashboards, exports, and the API resolve the same number.',
    rows: [
      { name: 'Exec summary', detail: 'live' },
      { name: 'Finance close pack', detail: 'live' },
      { name: 'Partner API', detail: 'live' },
    ],
  },
]

export function HowItWorksTabbedSteps() {
  return (
    <section data-slot="how-it-works-tabbed-steps" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">How it works</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Pick a stage to see what it produces
          </h2>
        </div>

        <Tabs defaultValue="connect" orientation="vertical" className="mt-10">
          <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
            {/* Vertical tab rail: orientation is set on both list and triggers so
                arrow keys move up and down rather than left and right. */}
            <TabsList variant="underline" orientation="vertical" className="h-auto w-full flex-col items-stretch">
              {steps.map((step, index) => (
                <TabsTrigger
                  key={step.id}
                  value={step.id}
                  variant="underline"
                  orientation="vertical"
                  className="justify-start gap-3"
                >
                  <span className="text-muted-foreground font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
                  {step.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {steps.map((step) => (
              <TabsContent key={step.id} value={step.id} className="mt-0">
                {/* min-h keeps the panel from collapsing between stages. */}
                <div className="grid min-h-[20rem] gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-sm">You do</p>
                    <p className="mt-1.5 text-lg leading-snug font-medium text-balance">{step.action}</p>

                    <Separator className="my-5" />

                    <p className="text-muted-foreground text-sm">You get</p>
                    <p className="mt-1.5 flex items-start gap-2 text-sm leading-relaxed">
                      <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <span>{step.result}</span>
                    </p>

                    <Button variant="link" className="mt-5 h-auto p-0">
                      Read this step in the docs
                    </Button>
                  </div>

                  <Card className="self-start">
                    <CardContent className="p-0">
                      <div className="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
                        {step.label}
                      </div>
                      <ul className="divide-border divide-y">
                        {step.rows.map((row) => (
                          <li key={row.name} className="flex items-center justify-between gap-4 px-4 py-2.5">
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
          </div>
        </Tabs>
      </div>
    </section>
  )
}
