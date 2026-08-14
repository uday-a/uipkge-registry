'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const steps = [
  {
    id: 'connect',
    title: 'Connect the warehouse',
    body: 'A read-only role and the account URL. We mirror the schema and catalogue what is there — no agent, no extract, no copy of your data leaving the account.',
  },
  {
    id: 'define',
    title: 'Define the metrics that matter',
    body: 'Start with the numbers that already appear in the board deck. Each becomes a versioned definition with an owner, reviewed like any other change in the repo.',
  },
  {
    id: 'certify',
    title: 'Certify against history',
    body: 'Every definition is reconciled against the prior four quarters before it can be published. Mismatches surface as a diff, not as a surprise in the close.',
  },
  {
    id: 'publish',
    title: 'Publish once, everywhere',
    body: 'Dashboards, scheduled exports, and the API all resolve the same definition. Changing it updates every consumer, and reverting is the same one click.',
  },
]

export function HowItWorksScrollStepper() {
  const [active, setActive] = useState(0)
  const root = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Without IntersectionObserver the rail simply stays on the first step and
    // the copy reads as a plain ordered list.
    if (typeof IntersectionObserver === 'undefined' || !root.current) return
    const targets = root.current.querySelectorAll<HTMLElement>('[data-step]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = Number((entry.target as HTMLElement).dataset.step)
          if (!Number.isNaN(index)) setActive(index)
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={root} data-slot="how-it-works-scroll-stepper" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Walkthrough</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Scroll through the first week</h2>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
          {/* Sticky rail tracks whichever step is nearest the viewport middle. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardContent className="p-5">
                <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Progress</p>
                <Progress
                  value={((active + 1) / steps.length) * 100}
                  className="mt-3 h-1.5"
                  aria-label="Walkthrough progress"
                />
                <ol className="mt-5 space-y-3">
                  {steps.map((step, index) => (
                    <li
                      key={step.id}
                      className={`flex items-start gap-3 text-sm transition-colors ${
                        index === active ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <span
                        className={`mt-1 size-1.5 shrink-0 rounded-full transition-colors ${
                          index === active ? 'bg-primary' : 'bg-muted-foreground/40'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="font-medium">{step.title}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          <ol className="space-y-16 lg:space-y-28">
            {steps.map((step, index) => (
              <li key={step.id} data-step={index} className="scroll-mt-32">
                <p className="text-muted-foreground font-mono text-xs">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-balance">{step.title}</h3>
                <p className="text-muted-foreground mt-3 max-w-prose leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12">
          <Button>
            Start the walkthrough
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
