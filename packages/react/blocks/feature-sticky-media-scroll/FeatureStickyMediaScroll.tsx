'use client'

import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const sections = [
  {
    id: 'connect',
    title: 'Point at the warehouse',
    body: 'A read-only role is the whole integration. We mirror the schema, record freshness per table, and flag anything that looks abandoned before you model against it.',
    rows: [
      { name: 'warehouse.orders', detail: 'fresh · 2 min' },
      { name: 'warehouse.refunds', detail: 'fresh · 2 min' },
      { name: 'legacy.orders_v1', detail: 'stale · 41 days' },
    ],
  },
  {
    id: 'model',
    title: 'Write the definition once',
    body: 'Revenue, margin, and pipeline become files with owners. Every consumer resolves the same definition, so the exec summary and the close pack cannot disagree.',
    rows: [
      { name: 'revenue_net', detail: 'v128 · finance' },
      { name: 'margin_by_channel', detail: 'v41 · finance' },
      { name: 'pipeline_weighted', detail: 'v12 · revops' },
    ],
  },
  {
    id: 'serve',
    title: 'Serve it everywhere',
    body: 'Dashboards, scheduled exports, and the API read the same certified metric with the caller’s own scope applied, and each result carries the freshness it was served at.',
    rows: [
      { name: 'Exec summary', detail: 'live' },
      { name: 'Finance close pack', detail: 'live' },
      { name: 'Partner API', detail: 'live' },
    ],
  },
]

export function FeatureStickyMediaScroll() {
  const [active, setActive] = useState(0)
  const root = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Without IntersectionObserver the pinned pane simply stays on the first
    // section and the page reads as stacked copy-and-visual pairs.
    if (typeof IntersectionObserver === 'undefined' || !root.current) return
    const targets = root.current.querySelectorAll<HTMLElement>('[data-section]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = Number((entry.target as HTMLElement).dataset.section)
          if (!Number.isNaN(index)) setActive(index)
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={root} data-slot="feature-sticky-media-scroll" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">How it fits together</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Three moves, in order</h2>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-20 lg:space-y-32">
            {sections.map((section, index) => (
              <div key={section.id} data-section={index} className="scroll-mt-32">
                <p className="text-muted-foreground font-mono text-xs">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-balance">{section.title}</h3>
                <p className="text-muted-foreground mt-3 max-w-prose leading-relaxed">{section.body}</p>

                {/* Inline card below the breakpoint, where nothing can pin usefully. */}
                <Card className="mt-5 lg:hidden">
                  <CardContent className="p-0">
                    <ul className="divide-border divide-y">
                      {section.rows.map((row) => (
                        <li key={row.name} className="flex items-center justify-between gap-3 px-4 py-2.5">
                          <span className="min-w-0 truncate font-mono text-xs">{row.name}</span>
                          <span className="text-muted-foreground shrink-0 text-xs">{row.detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
            <Card>
              <CardContent className="p-0">
                <div className="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
                  {sections[active].title}
                </div>
                <ul className="divide-border min-h-[9rem] divide-y">
                  {sections[active].rows.map((row) => (
                    <li key={row.name} className="flex items-center justify-between gap-3 px-4 py-3">
                      <span className="min-w-0 truncate font-mono text-xs">{row.name}</span>
                      <span className="text-muted-foreground shrink-0 text-xs">{row.detail}</span>
                    </li>
                  ))}
                </ul>
                <Separator />
                <p className="text-muted-foreground px-4 py-2.5 text-xs">
                  Step {active + 1} of {sections.length}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Button variant="outline" className="mt-12">
          Start the walkthrough
        </Button>
      </div>
    </section>
  )
}
