'use client'

import * as React from 'react'
import { BadgeCheck, CheckCircle2, ChevronLeft, ChevronRight, Pause, Play, Quote, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  industry: 'saas' | 'healthtech' | 'fintech' | 'devtools'
  initials: string
  avatarBg: string
  quote: string
  subquote: string
  rating: number
  verifiedBadge: string
  metrics: { label: string; value: string; trend: string }[]
  stack: string[]
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Aisha Rahman',
    role: 'VP of People & Operations',
    company: 'Northwind Global Logistics',
    industry: 'saas',
    initials: 'AR',
    avatarBg: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    quote:
      'We replaced four legacy spreadsheets and two disjointed SaaS subscriptions with UIPKGE blocks. Onboarding time dropped from 6 days to under 4 hours.',
    subquote:
      'The unbundled registry architecture gave our engineers total ownership without ever dealing with broken npm updates or rigid vendor locks.',
    rating: 5,
    verifiedBadge: 'Verified Enterprise Customer · 2,400+ Seats',
    metrics: [
      { label: 'Onboarding Velocity', value: '< 4 hours', trend: '-88% time' },
      { label: 'SaaS Tooling Spend', value: '$140k / yr', trend: 'Saved' },
      { label: 'Employee NPS', value: '+74', trend: 'Top Decile' },
    ],
    stack: ['Vue 3.5', 'Tailwind CSS v4', 'PostgreSQL', 'SCIM Okta'],
  },
  {
    id: '2',
    name: 'Marco Vidal',
    role: 'Director of Information Security',
    company: 'Helio Health Systems',
    industry: 'healthtech',
    initials: 'MV',
    avatarBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    quote:
      'SOC 2 and HIPAA evidence collection went from a grueling quarterly nightmare to a continuous, automated background audit trail.',
    subquote:
      'Our external auditors completed our Type II examination in record time because every UI state change is cryptographically verifiable.',
    rating: 5,
    verifiedBadge: 'Verified Healthcare Provider · HIPAA Tier 1',
    metrics: [
      { label: 'Audit Prep Duration', value: '1.5 days', trend: 'Down from 3 wks' },
      { label: 'Compliance Adherence', value: '100.0%', trend: '142 Controls' },
      { label: 'Zero Trust Rollout', value: '14 Days', trend: '100% Org' },
    ],
    stack: ['React 19', 'Reka UI Primitives', 'Cloudflare Workers', 'AuditLog API'],
  },
  {
    id: '3',
    name: 'Tomoko Saito',
    role: 'Staff Infrastructure Architect',
    company: 'Pixel & Co Engine Labs',
    industry: 'devtools',
    initials: 'TS',
    avatarBg: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    quote:
      'My favourite part is how blazing fast it is. Sub-20ms P99 search latencies across 50,000 workforce records without a single loading spinner.',
    subquote:
      'Keyboard shortcuts for every workflow make our engineering managers feel like they are operating a sleek CLI rather than a web dashboard.',
    rating: 5,
    verifiedBadge: 'Verified DevTools Customer · 450+ Devs',
    metrics: [
      { label: 'P99 Edge Latency', value: '18ms', trend: 'Global Edge' },
      { label: 'Daily Hotkey Actions', value: '42k / day', trend: '+310%' },
      { label: 'Memory Footprint', value: '< 12MB', trend: 'Zero bloat' },
    ],
    stack: ['Vue 3.5', 'Vite', 'Turborepo', 'WebAssembly'],
  },
  {
    id: '4',
    name: 'Julian Montgomery',
    role: 'Chief Financial Officer',
    company: 'Vanguard FinTech Matrix',
    industry: 'fintech',
    initials: 'JM',
    avatarBg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    quote:
      'Multi-currency payroll runs across 34 countries used to require 5 days of manual reconciliation. Now it settles automatically with zero FX fee slippage.',
    subquote:
      'Direct ledger sync and real-time tax calculations give our board instant visibility into gross-to-net runway.',
    rating: 5,
    verifiedBadge: 'Verified FinTech Customer · $800M+ Volume',
    metrics: [
      { label: 'Payroll Settlement', value: 'Instant', trend: 'FedNow / SEPA' },
      { label: 'FX Reconciliation', value: '0.00%', trend: 'Zero error' },
      { label: 'Tax Auto-filing', value: '34 Regs', trend: 'Statutory' },
    ],
    stack: ['React 19', 'Next.js', 'Tailwind v4', 'Stripe Treasury'],
  },
]

export function Testimonials01() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [activeIndustry, setActiveIndustry] = React.useState<'all' | 'saas' | 'healthtech' | 'fintech' | 'devtools'>(
    'all',
  )
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true)

  const filteredTestimonials = React.useMemo(() => {
    if (activeIndustry === 'all') return testimonials
    return testimonials.filter((t) => t.industry === activeIndustry)
  }, [activeIndustry])

  const next = React.useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % filteredTestimonials.length)
  }, [filteredTestimonials.length])

  const prev = React.useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length)
  }, [filteredTestimonials.length])

  React.useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      next()
    }, 6500)
    return () => clearInterval(timer)
  }, [isAutoPlaying, next])

  const activeTestimonial = filteredTestimonials[activeIndex] ?? filteredTestimonials[0]

  return (
    <section
      data-slot="testimonials-01"
      className="bg-background border-border relative w-full overflow-hidden border-y py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/30 text-primary bg-primary/5 gap-1.5 px-2.5 py-1 font-mono text-xs tracking-wide uppercase"
              >
                <BadgeCheck className="size-3.5" />
                Verified Case Studies
              </Badge>
              <span className="text-muted-foreground font-mono text-xs">Real-World Customer Telemetry</span>
            </div>
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by the Teams Building the Future.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
              See how high-growth scaleups and enterprise leaders accelerate engineering velocity and operational
              clarity.
            </p>
          </div>

          {/* Industry Filter Switcher */}
          <div className="bg-muted/60 border-border flex flex-wrap items-center gap-1.5 rounded-lg border p-1">
            {[
              { id: 'all', label: 'All Industries' },
              { id: 'saas', label: 'Enterprise SaaS' },
              { id: 'healthtech', label: 'HealthTech' },
              { id: 'devtools', label: 'Developer DX' },
              { id: 'fintech', label: 'FinTech' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  activeIndustry === cat.id
                    ? 'bg-background text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => {
                  setActiveIndustry(cat.id as any)
                  setActiveIndex(0)
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Testimonial Canvas */}
        <Card className="bg-card border-border overflow-hidden shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Main Quote Area (7 cols) */}
            <div className="flex flex-col justify-between space-y-8 p-6 sm:p-10 lg:col-span-7">
              <div className="space-y-6">
                {/* Rating & Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: activeTestimonial.rating }).map((_, s) => (
                      <Star key={s} className="size-4 fill-amber-500" />
                    ))}
                  </div>
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="size-3" />
                    {activeTestimonial.verifiedBadge}
                  </Badge>
                </div>

                {/* Quote Content */}
                <div className="relative space-y-3">
                  <Quote className="text-primary/20 absolute -top-4 -left-3 -z-10 size-8" />
                  <p className="text-foreground text-xl leading-relaxed font-medium tracking-tight sm:text-2xl">
                    &ldquo;{activeTestimonial.quote}&rdquo;
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{activeTestimonial.subquote}</p>
                </div>
              </div>

              {/* Author Info & Controls */}
              <div className="border-border flex flex-col justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3.5">
                  <div
                    className={cn(
                      'flex size-11 items-center justify-center rounded-full border text-sm font-bold',
                      activeTestimonial.avatarBg,
                    )}
                  >
                    {activeTestimonial.initials}
                  </div>
                  <div>
                    <h4 className="text-foreground text-sm font-semibold">{activeTestimonial.name}</h4>
                    <p className="text-muted-foreground text-xs">
                      {activeTestimonial.role} ·{' '}
                      <span className="text-foreground font-medium">{activeTestimonial.company}</span>
                    </p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg"
                    aria-label="Previous customer story"
                    onClick={prev}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg"
                    aria-label={isAutoPlaying ? 'Pause rotation' : 'Resume rotation'}
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  >
                    {isAutoPlaying ? <Pause className="text-primary size-3.5" /> : <Play className="size-3.5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg"
                    aria-label="Next customer story"
                    onClick={next}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Telemetry & Metrics Sidebar (5 cols) */}
            <div className="bg-muted/20 border-border flex flex-col justify-between space-y-6 border-t p-6 sm:p-8 lg:col-span-5 lg:border-t-0 lg:border-l">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                    Impact Telemetry
                  </span>
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">Production Validated</span>
                </div>

                {/* Metrics Grid */}
                <div className="space-y-3">
                  {activeTestimonial.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="border-border bg-card/80 flex items-center justify-between rounded-lg border p-3.5 shadow-xs"
                    >
                      <div>
                        <p className="text-muted-foreground text-xs">{m.label}</p>
                        <p className="text-foreground mt-0.5 text-lg font-bold tracking-tight">{m.value}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                      >
                        {m.trend}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Stack Tags */}
                <div className="space-y-2 pt-2">
                  <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                    Tech Stack Architecture
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTestimonial.stack.map((tech) => (
                      <Badge key={tech} variant="outline" className="bg-background font-mono text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Story Navigation Dots */}
              <div className="border-border/60 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-1.5">
                  {filteredTestimonials.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-label={`Jump to testimonial ${i + 1}`}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        i === activeIndex
                          ? 'bg-primary w-6'
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/60 w-2',
                      )}
                      onClick={() => setActiveIndex(i)}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground font-mono text-xs">
                  {activeIndex + 1} of {filteredTestimonials.length} Stories
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
export default Testimonials01
