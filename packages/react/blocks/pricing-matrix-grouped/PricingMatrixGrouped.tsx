'use client'

import { useState } from 'react'
import { Check, ChevronDown, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

const plans = ['Team', 'Business', 'Enterprise']

const groups: {
  id: string
  label: string
  summary: string
  rows: { feature: string; values: (boolean | string)[] }[]
}[] = [
  {
    id: 'modelling',
    label: 'Modelling',
    summary: 'Definitions, versioning, and review',
    rows: [
      { feature: 'Certified definitions', values: ['50', '500', 'Unlimited'] },
      { feature: 'Version history', values: ['30 days', 'Unlimited', 'Unlimited'] },
      { feature: 'Required review', values: [false, true, true] },
      { feature: 'Period locking', values: [false, true, true] },
    ],
  },
  {
    id: 'access',
    label: 'Access & identity',
    summary: 'Who sees which rows',
    rows: [
      { feature: 'SSO (SAML)', values: [true, true, true] },
      { feature: 'SCIM provisioning', values: [false, true, true] },
      { feature: 'Row-level scope', values: [false, true, true] },
      { feature: 'Customer-managed keys', values: [false, false, true] },
    ],
  },
  {
    id: 'ops',
    label: 'Operations',
    summary: 'Cost, alerting, and support',
    rows: [
      { feature: 'Query budgets', values: [false, true, true] },
      { feature: 'Drift alerting', values: [false, true, true] },
      { feature: 'Audit log export', values: [false, '90 days', 'Unlimited'] },
      { feature: 'Named support engineer', values: [false, false, true] },
    ],
  },
]

export function PricingMatrixGrouped() {
  // Opens on the first group only: a fully expanded matrix is the thing readers
  // bounce off, and every group is one click from open.
  const [open, setOpen] = useState<string[]>([groups[0].id])

  const toggle = (id: string) =>
    setOpen((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]))

  return (
    <section data-slot="pricing-matrix-grouped" className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <Badge variant="secondary">Compare plans</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Grouped, so it stays readable</h2>

        <Card className="mt-8">
          <CardContent className="p-0">
            <div className="text-muted-foreground grid grid-cols-[1fr_repeat(3,5rem)] gap-2 px-4 py-3 text-xs font-medium sm:grid-cols-[1fr_repeat(3,7rem)]">
              <span>Capability</span>
              {plans.map((plan) => (
                <span key={plan} className="text-center">
                  {plan}
                </span>
              ))}
            </div>
            <Separator />

            {groups.map((group) => (
              <div key={group.id}>
                <button
                  type="button"
                  className="hover:bg-muted focus-visible:ring-ring flex w-full items-center gap-3 px-4 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  aria-expanded={open.includes(group.id)}
                  aria-controls={`group-${group.id}`}
                  onClick={() => toggle(group.id)}
                >
                  <ChevronDown
                    className={`text-muted-foreground size-4 shrink-0 transition-transform ${
                      open.includes(group.id) ? '' : '-rotate-90'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{group.label}</span>
                    <span className="text-muted-foreground block text-xs">{group.summary}</span>
                  </span>
                  <span className="text-muted-foreground ml-auto shrink-0 font-mono text-xs">{group.rows.length}</span>
                </button>

                {open.includes(group.id) && (
                  <div id={`group-${group.id}`}>
                    <Table>
                      <TableBody>
                        {group.rows.map((row) => (
                          <TableRow key={row.feature}>
                            <TableCell className="pl-11 text-sm">{row.feature}</TableCell>
                            {row.values.map((value, index) => (
                              <TableCell key={index} className="w-20 text-center sm:w-28">
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
                )}
                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button className="mt-6">Start on Business</Button>
      </div>
    </section>
  )
}
