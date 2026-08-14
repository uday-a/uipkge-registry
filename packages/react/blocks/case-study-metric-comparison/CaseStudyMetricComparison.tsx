'use client'

import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// `better` records which direction is good, so the delta colour never has to be
// hard-coded per row — a falling close time is good, falling accuracy is not.
const metrics = [
  { name: 'Days to close', before: '9.4', after: '4.2', delta: '−55%', better: 'down' },
  { name: 'Ad-hoc data requests / month', before: '212', after: '61', delta: '−71%', better: 'down' },
  { name: 'Certified metrics published', before: '0', after: '340', delta: '+340', better: 'up' },
  { name: 'Forecast accuracy band', before: '±6.1pp', after: '±3.7pp', delta: '−2.4pp', better: 'down' },
]

export function CaseStudyMetricComparison() {
  return (
    <section data-slot="case-study-metric-comparison" className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <Badge variant="secondary">Northwind Logistics</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Two quarters either side of the rollout
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Their numbers, their definitions, measured the same way before and after. Nothing normalised.
        </p>

        <Card className="mt-8">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Q4 2025</TableHead>
                  <TableHead className="text-right">Q2 2026</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((metric) => {
                  const Trend = metric.better === 'down' ? TrendingDown : TrendingUp
                  return (
                    <TableRow key={metric.name}>
                      <TableCell className="font-medium">{metric.name}</TableCell>
                      <TableCell className="text-muted-foreground text-right font-mono text-sm">
                        {metric.before}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">{metric.after}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-success inline-flex items-center gap-1.5 font-mono text-sm">
                          <Trend className="size-3.5" aria-hidden="true" />
                          {metric.delta}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <Separator />

            <p className="text-muted-foreground px-6 py-4 text-xs leading-relaxed">
              Measured from their own close calendar and ticket queue. The rollout completed between the two quarters;
              no headcount was added or removed in finance during the period.
            </p>
          </CardContent>
        </Card>

        <Button className="mt-8">
          Read how they did it
          <ArrowRight className="ml-2 size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}
