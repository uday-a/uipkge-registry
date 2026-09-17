'use client'

import type { ComponentType, SVGProps } from 'react'
import { ArrowRight, Check, GitBranch, ShieldCheck, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Explicit shape: the three preview panels are structurally different, so the
// optional keys keep the union from collapsing when the JSX narrows.
interface FeatureRow {
  eyebrow: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  body: string
  points: string[]
  link: string
  reverse: boolean
  preview: {
    label: string
    lines?: { text: string; tone: 'add' | 'remove' | 'same' }[]
    rules?: { scope: string; value: string; allowed: boolean }[]
    stats?: { name: string; detail: string }[]
  }
}

const rows: FeatureRow[] = [
  {
    eyebrow: 'Versioning',
    icon: GitBranch,
    title: 'Every change is a reviewable diff',
    body: 'Dashboards, metrics, and permissions are stored as plain files. Changes open a pull request instead of silently overwriting production.',
    points: ['Branch per change', 'Review before publish', 'One-click revert'],
    link: 'How version control works',
    reverse: false,
    preview: {
      label: 'metrics/revenue.yml',
      lines: [
        { text: '+ window: trailing_28d', tone: 'add' },
        { text: '- window: trailing_30d', tone: 'remove' },
        { text: '  owner: finance-analytics', tone: 'same' },
      ],
    },
  },
  {
    eyebrow: 'Access',
    icon: ShieldCheck,
    title: 'Permissions that follow the row, not the dashboard',
    body: 'Scope is evaluated at query time from your identity provider, so a shared link never leaks a region or account the viewer cannot see.',
    points: ['Row-level filters', 'SCIM group sync', 'Audited every query'],
    link: 'Read the access model',
    reverse: true,
    preview: {
      label: 'Effective access — EMEA analyst',
      rules: [
        { scope: 'region', value: 'EMEA only', allowed: true },
        { scope: 'revenue.net', value: 'Visible', allowed: true },
        { scope: 'payroll.*', value: 'Blocked', allowed: false },
      ],
    },
  },
  {
    eyebrow: 'Performance',
    icon: Zap,
    title: 'Cached where it matters, fresh where it counts',
    body: 'Hot aggregates are materialised on a schedule you control. Everything else falls through to the warehouse so the number is never stale by accident.',
    points: ['Per-metric freshness', 'Warehouse pass-through', 'Cost ceiling per team'],
    link: 'See the caching rules',
    reverse: false,
    preview: {
      label: 'Freshness',
      stats: [
        { name: 'Revenue rollup', detail: 'materialised · 5 min' },
        { name: 'Pipeline by stage', detail: 'materialised · 1 hr' },
        { name: 'Raw event search', detail: 'live query' },
      ],
    },
  },
]

export function FeatureAlternatingRows() {
  return (
    <section data-slot="feature-alternating-rows" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Platform</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built like infrastructure, not a widget
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Three decisions that stop a reporting layer from rotting after the first quarter.
          </p>
        </div>

        <div className="mt-16 space-y-16 lg:space-y-24">
          {rows.map((row) => (
            <div key={row.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={row.reverse ? 'lg:order-2' : undefined}>
                <div className="text-muted-foreground flex items-center gap-2">
                  <row.icon className="size-4" aria-hidden="true" />
                  <span className="font-mono text-xs tracking-[0.14em] uppercase">{row.eyebrow}</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">{row.title}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">{row.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {row.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm">
                      <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="link" className="mt-5 h-auto p-0">
                  {row.link}
                  <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
                </Button>
              </div>

              <Card className={row.reverse ? 'lg:order-1' : undefined}>
                <CardContent className="p-0">
                  <div className="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
                    {row.preview.label}
                  </div>

                  {/* Diff preview */}
                  {row.preview.lines && (
                    <div className="space-y-1 p-4 font-mono text-xs">
                      {row.preview.lines.map((line) => (
                        <p
                          key={line.text}
                          className={
                            line.tone === 'add'
                              ? 'text-success'
                              : line.tone === 'remove'
                                ? 'text-destructive'
                                : 'text-muted-foreground'
                          }
                        >
                          {line.text}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Access preview */}
                  {row.preview.rules && (
                    <div className="divide-border divide-y">
                      {row.preview.rules.map((rule) => (
                        <div key={rule.scope} className="flex items-center justify-between gap-4 px-4 py-3">
                          <span className="font-mono text-xs">{rule.scope}</span>
                          <Badge variant={rule.allowed ? 'secondary' : 'outline'}>{rule.value}</Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Freshness preview */}
                  {row.preview.stats && (
                    <div className="p-4">
                      <ul className="space-y-3">
                        {row.preview.stats.map((stat) => (
                          <li key={stat.name}>
                            <div className="flex items-baseline justify-between gap-4">
                              <span className="text-sm font-medium">{stat.name}</span>
                              <span className="text-muted-foreground font-mono text-xs">{stat.detail}</span>
                            </div>
                            <Separator className="mt-3" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
