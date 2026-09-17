'use client'

import { ArrowRight, Headphones, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const paths = [
  {
    icon: Zap,
    label: 'Start it yourself',
    suits: 'One team, an existing warehouse, and someone comfortable opening a pull request.',
    next: ['Connect a read-only role', 'Publish one certified metric', 'Invite the rest of the team'],
    cta: 'Start free',
    variant: 'default' as const,
    note: 'No card. Cancel from the dashboard.',
  },
  {
    icon: Headphones,
    label: 'Have us run it',
    suits: 'Multiple teams, a regulated estate, or a close that cannot slip during migration.',
    next: ['Scoping call with an engineer', 'Five-week guided rollout', 'Hand-over to your team'],
    cta: 'Book a scoping call',
    variant: 'outline' as const,
    note: 'Median first reply: 3 h 40 m.',
  },
]

export function CtaSplitPanel() {
  return (
    <section data-slot="cta-split-panel" className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary">Two ways in</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Pick the one that matches your situation
          </h2>
        </div>

        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-2">
          {paths.map((path) => (
            <Card key={path.label}>
              <CardContent className="flex h-full flex-col p-6">
                <span
                  className="border-border text-muted-foreground flex size-10 items-center justify-center rounded-lg border"
                  aria-hidden="true"
                >
                  <path.icon className="size-4" />
                </span>

                <h3 className="mt-4 text-lg font-semibold tracking-tight">{path.label}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{path.suits}</p>

                <Separator className="my-5" />

                <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">What happens next</p>
                <ol className="mt-3 space-y-2">
                  {path.next.map((step, index) => (
                    <li key={step} className="flex items-start gap-2.5 text-sm">
                      <span className="text-muted-foreground/70 mt-px font-mono text-xs">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-auto pt-6">
                  <Button variant={path.variant} className="w-full">
                    {path.cta}
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </Button>
                  <p className="text-muted-foreground mt-2 text-center text-xs">{path.note}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
