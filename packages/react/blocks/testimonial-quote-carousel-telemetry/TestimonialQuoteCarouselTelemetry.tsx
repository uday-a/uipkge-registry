'use client'

import * as React from 'react'
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, TrendingUp, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CaseStudy {
  id: string
  company: string
  industry: string
  quote: string
  authorName: string
  authorRole: string
  avatar: string
  kpis: {
    label: string
    value: string
    delta: string
  }[]
  architectureSummary: string
}

const caseStudies: CaseStudy[] = [
  {
    id: 'scale-ai',
    company: 'HyperScale AI Platform',
    industry: 'Enterprise Developer Cloud',
    quote:
      'We replaced an unwieldy 800MB npm design system package with UIPKGE unbundled registry primitives. Our developers can now inspect, customize, and refactor any component directly in our codebase without waiting for semver releases.',
    authorName: 'Dr. Evelyn Ward',
    authorRole: 'VP of Product Engineering',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    kpis: [
      { label: 'Bundle Footprint', value: '42 kB', delta: '-87% JS overhead' },
      { label: 'Ship Velocity', value: '3.4x', delta: 'Release cycle speedup' },
      { label: 'Interaction INP', value: '18 ms', delta: 'P99 render latency' },
    ],
    architectureSummary: 'Migrated from monolithic NPM design system to raw unbundled Vue 3.5 SFCs.',
  },
  {
    id: 'fintech-apex',
    company: 'Apex Clearinghouse',
    industry: 'Institutional Fintech',
    quote:
      'Strict SOC2 Type II and HIPAA compliance required zero runtime telemetry from third-party vendor npm packages. UIPKGE’s own-your-code distribution model satisfied our security audits immediately.',
    authorName: 'Vikram Mehta',
    authorRole: 'Chief Information Security Officer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    kpis: [
      { label: 'Security Audit', value: '100%', delta: 'Zero third-party CVEs' },
      { label: 'Uptime Reliability', value: '99.999%', delta: 'Edge static distribution' },
      { label: 'Annual TCO', value: '$140,000', delta: 'Saved in seat licenses' },
    ],
    architectureSummary: 'Full source code ownership inside air-gapped GitHub enterprise monorepo.',
  },
  {
    id: 'pulse-health',
    company: 'Vitalis Health Systems',
    industry: 'Clinical Medical Intelligence',
    quote:
      'Our clinical dashboard has both a Vue 3 Nuxt clinician portal and a React Next.js patient mobile app. UIPKGE is the only registry providing 1:1 identical tokens and DOM accessibility across both.',
    authorName: 'Camila Rodriguez',
    authorRole: 'Director of Frontend Architecture',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    kpis: [
      { label: 'Design Parity', value: '1:1', delta: '100% CVA class sync' },
      { label: 'Accessibility', value: 'WCAG AAA', delta: 'Keyboard & screen reader' },
      { label: 'Sync Overhead', value: '0 hrs', delta: 'Dual framework AST registry' },
    ],
    architectureSummary: 'Cross-framework design system synchronized via single `@theme inline` Tailwind file.',
  },
]

export interface TestimonialQuoteCarouselTelemetryProps {
  className?: string
}

export function TestimonialQuoteCarouselTelemetry({ className }: TestimonialQuoteCarouselTelemetryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % caseStudies.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length)
  }

  const currentStudy = caseStudies[activeIndex]

  return (
    <section
      data-slot="testimonial-quote-carousel-telemetry"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <TrendingUp className="text-primary size-3.5" />
            Enterprise Customer Impact
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Quantifiable ROI and architectural case studies.
          </h2>
          <p className="text-muted-foreground text-base">
            See how leading engineering teams transformed their frontend velocity with unbundled code.
          </p>

          {/* Company Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {caseStudies.map((study, idx) => (
              <button
                key={study.id}
                type="button"
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 font-mono text-xs transition-all',
                  activeIndex === idx
                    ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveIndex(idx)}
              >
                <Building2 className="size-3.5" />
                <span>{study.company}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Spotlight Workbench Card (Split-Pane) */}
        <Card className="border-border bg-card/95 relative overflow-hidden rounded-3xl p-6 text-left shadow-sm sm:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left Column: Quote & Executive Info (7 Cols) */}
            <div className="space-y-6 lg:col-span-7">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary bg-primary/10 border-primary/20 font-mono text-xs">
                  {currentStudy.industry}
                </Badge>
              </div>

              {/* Quote */}
              <blockquote className="text-foreground text-lg leading-relaxed font-medium sm:text-xl">
                &ldquo;{currentStudy.quote}&rdquo;
              </blockquote>

              {/* Author info */}
              <div className="flex items-center gap-4 pt-2">
                <img
                  src={currentStudy.avatar}
                  alt={currentStudy.authorName}
                  className="border-border size-12 shrink-0 rounded-full border object-cover shadow-sm"
                />
                <div>
                  <h4 className="text-foreground font-mono text-sm font-bold">{currentStudy.authorName}</h4>
                  <p className="text-muted-foreground text-xs">
                    {currentStudy.authorRole} &bull; {currentStudy.company}
                  </p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="border-border/60 flex items-center gap-2 border-t pt-4">
                <Button size="sm" variant="outline" className="size-9 rounded-lg p-0" onClick={prevSlide}>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button size="sm" variant="outline" className="size-9 rounded-lg p-0" onClick={nextSlide}>
                  <ChevronRight className="size-4" />
                </Button>
                <span className="text-muted-foreground ml-2 font-mono text-xs">
                  Case Study {activeIndex + 1} of {caseStudies.length}
                </span>
              </div>
            </div>

            {/* Right Column: Quantitative Telemetry KPIs & Architecture Diff (5 Cols) */}
            <div className="bg-muted/40 border-border space-y-6 rounded-2xl border p-6 lg:col-span-5">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <h4 className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold">
                  <Zap className="size-3.5 text-amber-500" />
                  Verified Impact Telemetry
                </h4>
                <Badge variant="outline" className="border-emerald-500/20 font-mono text-xs text-emerald-500">
                  Post-Audit
                </Badge>
              </div>

              {/* 3 KPI Cards */}
              <div className="grid grid-cols-1 gap-3">
                {currentStudy.kpis.map((kpi, kIdx) => (
                  <div
                    key={kIdx}
                    className="border-border/80 bg-card flex items-center justify-between rounded-xl border p-3.5 font-mono"
                  >
                    <div>
                      <div className="text-muted-foreground text-xs">{kpi.label}</div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{kpi.delta}</div>
                    </div>
                    <div className="text-foreground text-xl font-bold">{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Architecture summary */}
              <div className="text-muted-foreground flex items-start gap-2 pt-2 font-mono text-xs">
                <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                <span>{currentStudy.architectureSummary}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
export default TestimonialQuoteCarouselTelemetry
