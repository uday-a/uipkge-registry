'use client'

import * as React from 'react'
import { ArrowRight, Check, Minus, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type BillingCycle = 'monthly' | 'annual'

interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  annualPrice: number
  highlight: boolean
  badge?: string
  ctaText: string
  ctaVariant: 'default' | 'outline' | 'secondary'
}

const plans: Plan[] = [
  {
    id: 'community',
    name: 'Community OSS',
    description: 'For indie hackers and developers building open source products.',
    monthlyPrice: 0,
    annualPrice: 0,
    highlight: false,
    ctaText: 'Start Building Free',
    ctaVariant: 'outline',
  },
  {
    id: 'pro',
    name: 'Pro Team',
    description: 'For growing startup engineering teams that require high velocity.',
    monthlyPrice: 29,
    annualPrice: 24,
    highlight: true,
    badge: 'Most Popular',
    ctaText: 'Claim Pro License',
    ctaVariant: 'default',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale',
    description: 'Dedicated registry syncing, SSO, SOC2 compliance audits, and SLA.',
    monthlyPrice: 119,
    annualPrice: 99,
    highlight: false,
    ctaText: 'Talk to Sales',
    ctaVariant: 'outline',
  },
]

interface FeatureComparisonRow {
  category: string
  features: {
    name: string
    tooltip: string
    community: boolean | string
    pro: boolean | string
    enterprise: boolean | string
  }[]
}

const comparisonData: FeatureComparisonRow[] = [
  {
    category: 'Registry & Core Primitives',
    features: [
      {
        name: 'Full AST Component Source Access',
        tooltip: 'Raw SFC and TSX source files copied directly into your repository.',
        community: true,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Dual-Framework Parity (Vue + React)',
        tooltip: 'Identical DOM semantics and CVA tokens across both ecosystems.',
        community: true,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Curated Marketing & SaaS Blocks',
        tooltip: 'Access to 450+ production-grade unbundled layout blocks.',
        community: '100+ Blocks',
        pro: 'All 450+ Blocks',
        enterprise: 'All Blocks + Custom',
      },
      {
        name: 'Tailwind CSS v4 OKLCH Token System',
        tooltip: 'Hardware-calibrated color spaces and spring curves.',
        community: true,
        pro: true,
        enterprise: true,
      },
    ],
  },
  {
    category: 'Enterprise & Security Compliance',
    features: [
      {
        name: 'Private Registry Mirroring',
        tooltip: 'Host your organization’s customized internal registry behind a firewall.',
        community: false,
        pro: '1 Private Repo',
        enterprise: 'Unlimited Private Hubs',
      },
      {
        name: 'SOC2 & ISO 27001 Audit Packs',
        tooltip: 'Pre-certified security documentation and architecture proofs.',
        community: false,
        pro: false,
        enterprise: true,
      },
      {
        name: 'Guaranteed 99.99% Registry CDN SLA',
        tooltip: 'Global multi-region edge distribution uptime guarantee.',
        community: false,
        pro: '99.9% SLA',
        enterprise: '99.99% High Availability',
      },
      {
        name: 'Dedicated Design Engineering Support',
        tooltip: 'Direct Slack / Discord channel with core design system maintainers.',
        community: false,
        pro: 'Priority Email',
        enterprise: 'Dedicated Slack Channel',
      },
    ],
  },
]

export interface PricingTierComparisonMatrixProps {
  className?: string
}

export function PricingTierComparisonMatrix({ className }: PricingTierComparisonMatrixProps) {
  const [billing, setBilling] = React.useState<BillingCycle>('annual')

  return (
    <section
      data-slot="pricing-tier-comparison-matrix"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <Sparkles className="text-primary size-3.5" />
            Predictable Pricing
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Zero seat taxes. Own your source code forever.
          </h2>
          <p className="text-muted-foreground text-base">
            Choose the tier that fits your engineering team's delivery scale and compliance needs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span
              className={cn(
                'font-mono text-xs',
                billing === 'monthly' ? 'text-foreground font-bold' : 'text-muted-foreground',
              )}
            >
              Monthly
            </span>
            <div className="border-border bg-card relative flex items-center rounded-full border p-1">
              <button
                type="button"
                className={cn(
                  'relative z-10 rounded-full px-3 py-1 font-mono text-xs transition-all',
                  billing === 'monthly'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground',
                )}
                onClick={() => setBilling('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={cn(
                  'relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs transition-all',
                  billing === 'annual'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground',
                )}
                onClick={() => setBilling('annual')}
              >
                <span>Annual</span>
                <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-xs font-bold text-white">Save 20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Plan Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                'border-border bg-card relative flex flex-col justify-between space-y-6 rounded-2xl p-6 text-left shadow-xl transition-all sm:p-8',
                plan.highlight
                  ? 'border-primary/80 ring-primary/20 scale-[1.02] shadow-sm ring-2'
                  : 'hover:border-border/80',
              )}
            >
              {/* Top Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-3 py-0.5 font-mono text-xs tracking-wider uppercase shadow-md">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-mono text-xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground mt-1 min-h-[36px] text-xs">{plan.description}</p>
                </div>

                {/* Price display */}
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-foreground text-4xl font-bold">
                    ${billing === 'annual' ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground text-xs">/ month</span>
                </div>
                <p className="text-muted-foreground font-mono text-xs">
                  {billing === 'annual' && plan.annualPrice > 0
                    ? `Billed annually ($${plan.annualPrice * 12}/yr)`
                    : 'Billed monthly'}
                </p>
              </div>

              <Button variant={plan.ctaVariant} className="h-10 w-full gap-1.5 font-mono text-xs shadow-xs">
                <span>{plan.ctaText}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Deep Feature Comparison Matrix Table */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-foreground font-mono text-xl font-bold">Detailed Feature Comparison</h3>
            <p className="text-muted-foreground mt-1 text-xs">Full granular matrix of capabilities and entitlements.</p>
          </div>

          <Card className="border-border bg-card overflow-hidden rounded-2xl text-left shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-border bg-muted/40 text-muted-foreground border-b font-mono">
                    <th className="w-1/2 p-4 font-semibold">Capability</th>
                    <th className="p-4 text-center font-semibold">Community</th>
                    <th className="text-primary p-4 text-center font-bold font-semibold">Pro Team</th>
                    <th className="p-4 text-center font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((section, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <tr className="bg-muted/20 border-border/80 border-b">
                        <td
                          colSpan={4}
                          className="text-muted-foreground p-3 px-4 font-mono text-xs font-bold tracking-wider uppercase"
                        >
                          {section.category}
                        </td>
                      </tr>
                      {section.features.map((row, rIdx) => (
                        <tr key={rIdx} className="border-border/60 hover:bg-muted/10 border-b transition-colors">
                          <td className="p-4">
                            <div className="text-foreground font-medium">{row.name}</div>
                            <div className="text-muted-foreground mt-0.5 text-xs">{row.tooltip}</div>
                          </td>
                          <td className="p-4 text-center font-mono">
                            {typeof row.community === 'boolean' ? (
                              row.community ? (
                                <Check className="mx-auto size-4 text-emerald-500" />
                              ) : (
                                <Minus className="text-muted-foreground/40 mx-auto size-4" />
                              )
                            ) : (
                              <span className="text-muted-foreground">{row.community}</span>
                            )}
                          </td>
                          <td className="p-4 text-center font-mono font-semibold">
                            {typeof row.pro === 'boolean' ? (
                              row.pro ? (
                                <Check className="mx-auto size-4 text-emerald-500" />
                              ) : (
                                <Minus className="text-muted-foreground/40 mx-auto size-4" />
                              )
                            ) : (
                              <span className="text-primary">{row.pro}</span>
                            )}
                          </td>
                          <td className="p-4 text-center font-mono">
                            {typeof row.enterprise === 'boolean' ? (
                              row.enterprise ? (
                                <Check className="mx-auto size-4 text-emerald-500" />
                              ) : (
                                <Minus className="text-muted-foreground/40 mx-auto size-4" />
                              )
                            ) : (
                              <span className="text-foreground font-semibold">{row.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
export default PricingTierComparisonMatrix
