'use client'

import { ArrowRight, Check, Minus, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// verdict drives the icon and tone, so rows stay declarative and a new row
// cannot forget to style itself.
const rows = [
  {
    area: 'Warehouse and models',
    verdict: 'keep',
    detail: 'Untouched. We read from them, nothing is rewritten.',
    effort: 'None',
  },
  {
    area: 'dbt project',
    verdict: 'keep',
    detail: 'Imported as metric sources; your DAG keeps running.',
    effort: 'Half a day',
  },
  {
    area: 'Dashboard layouts',
    verdict: 'change',
    detail: 'Rebuilt against certified metrics, usually faster than the original.',
    effort: '1–2 weeks',
  },
  {
    area: 'Metric formulas',
    verdict: 'change',
    detail: 'Moved from dashboard config into versioned files.',
    effort: '1 week',
  },
  {
    area: 'Per-dashboard permissions',
    verdict: 'retire',
    detail: 'Replaced by row-level scope from your IdP.',
    effort: 'None',
  },
  {
    area: 'Bespoke extract jobs',
    verdict: 'retire',
    detail: 'Deleted once the metrics they fed are certified.',
    effort: 'None',
  },
]

const tone = {
  keep: { icon: Check, label: 'Keep', class: 'text-success' },
  change: { icon: RefreshCw, label: 'Change', class: 'text-muted-foreground' },
  retire: { icon: Minus, label: 'Retire', class: 'text-muted-foreground/60' },
} as const

export function ComparisonMigrationPath() {
  return (
    <section data-slot="comparison-migration-path" className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Migration</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">What actually changes</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Most of the stack stays exactly where it is. The effort column is measured from real rollouts.
          </p>
        </div>

        <Card className="mt-10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Area</TableHead>
                  <TableHead className="w-28">Verdict</TableHead>
                  <TableHead>What happens</TableHead>
                  <TableHead className="w-32 text-right">Effort</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const entry = tone[row.verdict as keyof typeof tone]
                  const Icon = entry.icon
                  return (
                    <TableRow key={row.area}>
                      <TableCell className="font-medium">{row.area}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 text-xs ${entry.class}`}>
                          <Icon className="size-3.5" aria-hidden="true" />
                          {entry.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{row.detail}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{row.effort}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <Separator />
            <p className="text-muted-foreground px-6 py-4 text-xs leading-relaxed">
              Effort assumes one engineer and one analyst part-time. Teams with more than about 200 existing dashboards
              usually stage the rebuild by department rather than doing it in one pass.
            </p>
          </CardContent>
        </Card>

        <Button className="mt-6">
          Get a migration estimate
          <ArrowRight className="ml-2 size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}
