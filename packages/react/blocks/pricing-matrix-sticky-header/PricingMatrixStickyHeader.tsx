'use client'

import { Check, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const plans = ['Team', 'Business', 'Enterprise']

// Cells are true / false / a string, so a plan can state a limit rather than
// only claiming a feature exists.
const rows: { feature: string; values: (boolean | string)[] }[] = [
  { feature: 'Certified metric definitions', values: ['50', '500', 'Unlimited'] },
  { feature: 'Connected warehouses', values: ['1', '3', 'Unlimited'] },
  { feature: 'Query budget per team', values: [false, true, true] },
  { feature: 'Row-level access control', values: [false, true, true] },
  { feature: 'SCIM provisioning', values: [false, true, true] },
  { feature: 'Audit log export', values: [false, '90 days', 'Unlimited'] },
  { feature: 'Period locking', values: [false, true, true] },
  { feature: 'Embedded dashboards', values: [false, true, true] },
  { feature: 'Data residency choice', values: [false, false, true] },
  { feature: 'Customer-managed keys', values: [false, false, true] },
  { feature: 'Private link', values: [false, false, true] },
  { feature: 'Named support engineer', values: [false, false, true] },
]

export function PricingMatrixStickyHeader() {
  return (
    <section data-slot="pricing-matrix-sticky-header" className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <Badge variant="secondary">Compare plans</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Every line, no asterisks</h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Limits differ between plans. Where a plan caps something, the cap is written in the cell.
        </p>

        <Card className="mt-8">
          <CardContent className="p-0">
            {/* The header pins with CSS alone. Thirty rows down, a checkmark is
                still attributable to a column without scrolling back up. */}
            <div className="max-h-[28rem] overflow-auto">
              <Table>
                <TableHeader className="bg-card sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="bg-card">Capability</TableHead>
                    {plans.map((plan) => (
                      <TableHead key={plan} className="bg-card text-center">
                        {plan}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.feature}>
                      <TableCell className="font-medium">{row.feature}</TableCell>
                      {row.values.map((value, index) => (
                        <TableCell key={index} className="text-center">
                          {value === true && (
                            <>
                              <Check className="text-success mx-auto size-4" aria-hidden="true" />
                              <span className="sr-only">Included</span>
                            </>
                          )}
                          {value === false && (
                            <>
                              <Minus className="text-muted-foreground/50 mx-auto size-4" aria-hidden="true" />
                              <span className="sr-only">Not included</span>
                            </>
                          )}
                          {typeof value === 'string' && <span className="font-mono text-xs">{value}</span>}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button>Start on Team</Button>
          <Button variant="outline">Talk about Enterprise</Button>
        </div>
      </div>
    </section>
  )
}
