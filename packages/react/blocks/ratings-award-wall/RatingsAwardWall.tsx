'use client'

import { Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Body, category, and period on every entry. A badge without a period is a
// badge that could be six years old.
const awards = [
  { body: 'G2', category: 'Leader — Analytics Platforms', period: 'Winter 2026' },
  { body: 'G2', category: 'Best Usability — Mid-Market', period: 'Winter 2026' },
  { body: 'Capterra', category: 'Best Value — Business Intelligence', period: '2025' },
  { body: 'TrustRadius', category: 'Top Rated — Data Governance', period: '2025' },
  { body: 'Product Hunt', category: '#1 Product of the Day', period: 'Mar 2025' },
  { body: 'SaaS Awards', category: 'Best Data Product, shortlisted', period: '2025' },
]

export function RatingsAwardWall() {
  return (
    <section data-slot="ratings-award-wall" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="secondary">Recognition</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Awarded, with the period attached
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Every entry names who gave it, for what, and when. Nothing here is older than a year unless it says so.
            </p>
          </div>
          <Button variant="outline">See the review profiles</Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award) => (
            <Card key={`${award.body}-${award.category}`}>
              <CardContent className="flex h-full flex-col p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="border-border text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border"
                    aria-hidden="true"
                  >
                    <Award className="size-4" />
                  </span>
                  <p className="text-sm font-semibold">{award.body}</p>
                </div>
                <Separator className="my-4" />
                <p className="text-sm leading-snug">{award.category}</p>
                <p className="text-muted-foreground mt-auto pt-3 font-mono text-xs">{award.period}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
