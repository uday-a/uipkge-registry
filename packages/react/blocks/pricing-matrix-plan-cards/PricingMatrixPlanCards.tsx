'use client'

import { Check, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const capabilities = [
  'Certified metric definitions',
  'Connected warehouses',
  'Query budget per team',
  'Row-level access control',
  'SCIM provisioning',
  'Audit log export',
  'Embedded dashboards',
  'Data residency choice',
  'Customer-managed keys',
  'Named support engineer',
]

const plans = [
  { name: 'Team', price: '$0', cadence: 'while in beta', included: [0, 1], note: 'For one team proving it out.' },
  {
    name: 'Business',
    price: '$1,400',
    cadence: 'per month',
    included: [0, 1, 2, 3, 4, 5, 6],
    note: 'For finance and analytics running together.',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: 'annual',
    included: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    note: 'For regulated estates and multi-region.',
  },
]

export function PricingMatrixPlanCards() {
  return (
    <section data-slot="pricing-matrix-plan-cards" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Plans</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">What each plan actually includes</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            The same list on every card, with what is missing shown rather than omitted.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.featured ? 'border-primary' : undefined}>
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{plan.name}</p>
                  {plan.featured && <Badge variant="secondary">Most chosen</Badge>}
                </div>

                <p className="font-display mt-4 text-3xl font-bold tracking-tight">{plan.price}</p>
                <p className="text-muted-foreground mt-1 text-xs">{plan.cadence}</p>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{plan.note}</p>

                <Separator className="my-5" />

                <ul className="space-y-2.5">
                  {capabilities.map((capability, index) => (
                    <li
                      key={capability}
                      className={`flex items-start gap-2.5 text-sm ${
                        plan.included.includes(index) ? '' : 'text-muted-foreground/60'
                      }`}
                    >
                      {plan.included.includes(index) ? (
                        <Check className="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      ) : (
                        <Minus className="text-muted-foreground/40 mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      )}
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>

                <Button variant={plan.featured ? 'default' : 'outline'} className="mt-auto pt-0 [&]:mt-8">
                  {plan.name === 'Enterprise' ? 'Talk to us' : `Start on ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
