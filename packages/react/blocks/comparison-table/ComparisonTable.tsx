'use client'

import * as React from 'react'
import { Check, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type Cycle = 'monthly' | 'yearly'
type Cell = boolean | string | number

interface Plan {
  name: string
  monthly: number
  yearly: number
  cta: string
  popular?: boolean
}

interface Feature {
  label: string
  cells: [Cell, Cell, Cell]
}

interface Group {
  label: string
  features: Feature[]
}

const plans: Plan[] = [
  { name: 'Starter', monthly: 9, yearly: 7, cta: 'Start free' },
  { name: 'Pro', monthly: 29, yearly: 24, cta: 'Start 14-day trial', popular: true },
  { name: 'Enterprise', monthly: 79, yearly: 65, cta: 'Talk to sales' },
]

const groups: Group[] = [
  {
    label: 'Core',
    features: [
      { label: 'Projects', cells: [3, 'Unlimited', 'Unlimited'] },
      { label: 'Team seats', cells: ['5 seats', '20 seats', 'Custom'] },
      { label: 'API access', cells: [false, true, true] },
    ],
  },
  {
    label: 'Collaboration',
    features: [
      { label: 'Shared workspaces', cells: [false, true, true] },
      { label: 'Guest reviewers', cells: [false, '5 guests', 'Unlimited'] },
      { label: 'Roles & permissions', cells: [true, true, true] },
      { label: 'Audit log', cells: [false, false, true] },
    ],
  },
  {
    label: 'Support',
    features: [
      { label: 'Support channel', cells: ['Email', 'Priority email', 'Dedicated CSM'] },
      { label: 'Guided onboarding', cells: [false, true, true] },
      { label: 'Uptime SLA', cells: [false, false, '99.9%'] },
    ],
  },
]

export function ComparisonTable() {
  const [cycle, setCycle] = React.useState<Cycle>('monthly')

  return (
    <section data-slot="comparison-table" className="bg-background w-full">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Compare plans</h2>
          <ToggleGroup type="single" value={cycle} onValueChange={(v) => v && setCycle(v as Cycle)}>
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">
              Yearly
              <Badge variant="secondary" className="ml-2">
                −20%
              </Badge>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full max-w-[640px] min-w-full border-separate border-spacing-0 text-sm">
            <caption className="sr-only">Feature comparison across Starter, Pro, and Enterprise plans</caption>

            <thead>
              <tr>
                <th
                  scope="col"
                  className="bg-background/95 supports-[backdrop-filter]:bg-background/80 text-muted-foreground sticky top-0 left-0 z-10 w-1/4 border-b p-4 text-left font-medium backdrop-blur"
                >
                  <span className="sr-only">Feature</span>
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    scope="col"
                    className={`sticky top-0 z-10 border-b p-4 text-center align-bottom ${
                      plan.popular
                        ? 'bg-primary/10 supports-[backdrop-filter]:bg-primary/10 backdrop-blur'
                        : 'bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      {plan.popular && <Badge>Popular</Badge>}
                      <span className="text-base font-semibold tracking-tight">{plan.name}</span>
                      <span className="tabular-nums">
                        <span className="text-2xl font-semibold">
                          ${cycle === 'monthly' ? plan.monthly : plan.yearly}
                        </span>
                        <span className="text-muted-foreground text-xs"> /mo</span>
                      </span>
                      <Button size="sm" variant={plan.popular ? 'default' : 'outline'} className="mt-1 w-full">
                        {plan.cta}
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {groups.map((group) => (
              <tbody key={group.label}>
                <tr>
                  <th
                    colSpan={4}
                    scope="colgroup"
                    className="bg-muted/50 text-muted-foreground border-b p-3 text-left text-xs font-semibold tracking-widest uppercase"
                  >
                    {group.label}
                  </th>
                </tr>
                {group.features.map((feature) => (
                  <tr key={feature.label} className="hover:bg-muted/30">
                    <th scope="row" className="border-b p-4 text-left align-middle font-normal">
                      {feature.label}
                    </th>
                    {feature.cells.map((cell, i) => (
                      <td
                        key={i}
                        className={`border-b p-4 text-center align-middle ${plans[i].popular ? 'bg-primary/5' : ''}`}
                      >
                        {cell === true ? (
                          <Check className="text-foreground mx-auto size-4" aria-label="Included" />
                        ) : cell === false ? (
                          <Minus className="text-muted-foreground/50 mx-auto size-4" aria-label="Not included" />
                        ) : (
                          <span className="text-xs font-medium">{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  )
}
