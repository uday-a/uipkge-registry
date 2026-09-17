import * as React from 'react'
import { ArrowRight, Building2, Calendar, CheckCircle2, Lock, Server } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SlaGuarantee {
  title: string
  metric: string
  description: string
  icon: string
}

export interface ComplianceCert {
  id: string
  name: string
  status: string
  badgeVariant?: 'default' | 'outline' | 'secondary'
}

export interface PricingEnterpriseSlaCardProps {
  title?: string
  description?: string
  guarantees?: SlaGuarantee[]
  certifications?: ComplianceCert[]
  className?: string
}

const DEFAULT_GUARANTEES: SlaGuarantee[] = [
  {
    title: 'High-Availability SLA',
    metric: '99.999%',
    description: 'Financial penalty-backed monthly uptime commitment across multi-region clusters.',
    icon: 'ShieldCheck',
  },
  {
    title: 'P1 Incident Response',
    metric: '< 15 mins',
    description: 'Direct paging to designated Staff Infrastructure Commanders 24/7/365.',
    icon: 'Headphones',
  },
  {
    title: 'Global Edge TTFB',
    metric: '< 12ms',
    description: 'Sub-15ms Time-To-First-Byte guaranteed via Anycast network mesh.',
    icon: 'Zap',
  },
  {
    title: 'Custom Legal & DPA',
    metric: 'Bespoke',
    description: 'Dedicated legal counsel review, redline allowances, and customized BAAs.',
    icon: 'Scale',
  },
]

const DEFAULT_CERTS: ComplianceCert[] = [
  { id: 'soc2', name: 'SOC 2 Type II Certified', status: 'Continuous Audit' },
  { id: 'hipaa', name: 'HIPAA Compliant BAA', status: 'Available' },
  { id: 'iso27001', name: 'ISO/IEC 27001:2022', status: 'Certified' },
  { id: 'gdpr', name: 'GDPR & CCPA Verified', status: 'Compliant' },
  { id: 'fedramp', name: 'FedRAMP In-Process', status: 'High Baseline' },
]

export function PricingEnterpriseSlaCard({
  title = 'Mission-critical infrastructure with contractual legal guarantees.',
  description = 'Tailored enterprise licensing, custom security reviews, isolated VPC deployments, and white-glove migration engineering.',
  guarantees = DEFAULT_GUARANTEES,
  certifications = DEFAULT_CERTS,
  className,
}: PricingEnterpriseSlaCardProps) {
  const [isMeetingRequested, setIsMeetingRequested] = React.useState(false)

  function requestMeeting() {
    setIsMeetingRequested(true)
    setTimeout(() => {
      setIsMeetingRequested(false)
    }, 3000)
  }

  return (
    <section
      data-slot="pricing-enterprise-sla-card"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#enterprise-contract"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <Building2 className="text-primary size-3.5" />
            <span>Enterprise Custom Contracting</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>
        </div>

        {/* Main Enterprise Showcase Container */}
        <div className="border-border bg-card mt-12 overflow-hidden rounded-2xl border shadow-sm">
          <div className="divide-border grid grid-cols-1 divide-y lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            {/* Left: SLA Guarantees & Contractual Commitments (7 Cols) */}
            <div className="space-y-8 p-8 lg:col-span-7">
              <div className="space-y-1">
                <div className="text-primary text-xs font-bold tracking-wider uppercase">Service Level Agreement</div>
                <h3 className="text-foreground text-xl font-bold">Penalty-Backed Contractual Metrics</h3>
                <p className="text-muted-foreground text-xs">
                  Every commitment is codified into your master service agreement with direct financial remedies.
                </p>
              </div>

              {/* Guarantees 2x2 Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {guarantees.map((item, idx) => (
                  <div key={idx} className="border-border bg-muted/20 space-y-2 rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-xs font-bold">{item.title}</span>
                      <span className="text-primary font-mono text-xs font-bold">{item.metric}</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* Compliance & Governance Strip */}
              <div className="space-y-3 pt-2">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                  <Lock className="text-primary size-3.5" />
                  <span>Security & Regulatory Attestations</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert) => (
                    <Badge
                      key={cert.id}
                      variant="outline"
                      className="border-border bg-background text-foreground gap-1.5 px-3 py-1 text-xs font-medium"
                    >
                      <CheckCircle2 className="size-3 text-emerald-500" />
                      <span>{cert.name}</span>
                      <span className="text-muted-foreground font-mono text-xs">({cert.status})</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Direct Enterprise Solution Consultation Card (5 Cols) */}
            <div className="bg-muted/30 flex flex-col justify-between space-y-6 p-8 lg:col-span-5">
              <div className="space-y-4">
                <div className="border-border flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Server className="text-primary size-4" />
                    <span className="text-foreground text-sm font-semibold">Custom Private Deployment</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-500"
                  >
                    Tailored
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  <div className="text-foreground text-xs font-bold">Included with Custom Tier:</div>
                  <ul className="text-muted-foreground space-y-2 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                      <span>Dedicated AWS / GCP VPC peering or self-hosted air-gap</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                      <span>Custom SAML 2.0 / Okta / Azure AD SCIM provisioning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                      <span>Dedicated Solution Architect & design system migration team</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                      <span>Invoiced payment via ACH, Wire Transfer, or AWS Marketplace</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Block */}
              <div className="border-border space-y-3 border-t pt-4">
                <Button className="w-full gap-2 shadow-xs" size="lg" onClick={requestMeeting}>
                  <Calendar className="size-4" />
                  <span>
                    {isMeetingRequested ? 'Direct Routing to Architect...' : 'Book Enterprise Technical Review'}
                  </span>
                </Button>
                <div className="text-muted-foreground text-center text-xs">
                  Average executive response time: <strong>under 20 minutes</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
