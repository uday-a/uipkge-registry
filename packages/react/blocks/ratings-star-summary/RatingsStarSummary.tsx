'use client'

import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

const score = 4.7
const total = 2117

const distribution = [
  { stars: 5, count: 1587 },
  { stars: 4, count: 381 },
  { stars: 3, count: 97 },
  { stars: 2, count: 31 },
  { stars: 1, count: 21 },
]

const STAR_SLOTS = [1, 2, 3, 4, 5]
/** Fill percentage for one slot, so 4.7 draws a real partial star. */
function fillFor(slot: number) {
  return `${Math.min(Math.max(score - (slot - 1), 0), 1) * 100}%`
}

export function RatingsStarSummary() {
  return (
    <section data-slot="ratings-star-summary" className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <Badge variant="secondary">Reviews</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          What {total.toLocaleString()} people say
        </h2>

        <Card className="mt-8">
          <CardContent className="grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:gap-12 sm:p-8">
            <div className="text-center sm:text-left">
              <p className="font-display text-5xl font-bold tracking-tight">{score.toFixed(1)}</p>
              <div
                className="mt-2 flex items-center justify-center gap-0.5 sm:justify-start"
                role="img"
                aria-label={`${score} out of 5`}
              >
                {STAR_SLOTS.map((slot) => (
                  <span key={slot} className="relative inline-flex">
                    <Star className="text-muted-foreground/30 size-4" aria-hidden="true" />
                    <span
                      className="absolute inset-y-0 left-0 overflow-hidden"
                      style={{ width: fillFor(slot) }}
                      aria-hidden="true"
                    >
                      <Star className="fill-primary text-primary size-4" />
                    </span>
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground mt-2 text-xs">{total.toLocaleString()} verified reviews</p>
            </div>

            <Separator orientation="vertical" className="hidden h-auto sm:block" />

            <dl className="space-y-2.5">
              {distribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-4">
                  <dt className="text-muted-foreground w-12 shrink-0 font-mono text-xs">{row.stars} star</dt>
                  <dd className="flex min-w-0 grow items-center gap-4">
                    <Progress
                      value={Math.round((row.count / total) * 100)}
                      className="h-1.5"
                      aria-label={`${row.stars} star reviews`}
                    />
                    <span className="text-muted-foreground w-12 shrink-0 text-right font-mono text-xs">
                      {row.count.toLocaleString()}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button variant="outline">Read the one-star reviews</Button>
          <p className="text-muted-foreground text-sm">They are the useful ones, and we have not hidden them.</p>
        </div>
      </div>
    </section>
  )
}
