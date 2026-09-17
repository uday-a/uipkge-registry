'use client'

import { ArrowRight, Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const included = [
  'Unlimited certified metric definitions',
  'Unlimited viewers and editors',
  'Row-level access from your identity provider',
  'Query budgets enforced per team',
  'Audit log export, 7-year retention',
  'SOC 2 report under NDA',
]

// Naming exclusions is what makes a single plan credible. A list of only
// inclusions invites the reader to assume the gap is hidden somewhere.
const excluded = [
  'On-premise deployment behind your firewall',
  'Custom SLAs below 99.9%',
  'Professional services beyond the five-week rollout',
]

export function PricingSinglePlan() {
  return (
    <section data-slot="pricing-single-plan" className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <div className="text-center">
          <Badge variant="secondary">Pricing</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">One plan, one number</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            No seat maths and no feature gates. The only thing that scales is query volume.
          </p>
        </div>

        <Card className="mt-10">
          <CardContent className="p-8">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-display text-4xl font-bold tracking-tight">£1,400</span>
              <span className="text-muted-foreground">per month, billed annually</span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              Includes 2 million queries a month. Beyond that it is £0.0004 per query, capped by your own budgets.
            </p>

            <Button size="lg" className="mt-6 w-full sm:w-auto">
              Start the 30-day trial
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>

            <Separator className="my-8" />

            <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Included</p>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Check className="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Separator className="my-6" />

            <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Not included</p>
            <ul className="mt-3 space-y-2.5">
              {excluded.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <X className="text-muted-foreground/50 mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Separator className="my-6" />

            <p className="text-muted-foreground text-sm leading-relaxed">
              Past roughly 20 million queries a month, or if any of the exclusions above are hard requirements, a
              conversation will get you a better answer than this page can.
            </p>
            <Button variant="outline" className="mt-4">
              Talk to us instead
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
