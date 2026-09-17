'use client'

import * as React from 'react'
import { Check, CheckCircle2, Copy, Download, RefreshCw, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CompliancePillar {
  id: string
  name: string
  standard: string
  status: string
  auditor: string
  lastAudit: string
  sha256: string
  highlights: string[]
}

const pillars: CompliancePillar[] = [
  {
    id: 'soc2',
    name: 'SOC2 Type II Certified',
    standard: 'AICPA Trust Services Criteria (Security, Availability, Confidentiality)',
    status: 'Clean Opinion (Zero Exceptions)',
    auditor: 'Schellman & Company, LLC',
    lastAudit: 'Q4 2025 Audit Period',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    highlights: [
      'Continuous 24/7 automated control monitoring via Drata',
      'Annual independent black-box & white-box penetration testing',
      'Mandatory hardware key 2FA (WebAuthn / FIDO2) across all staff',
      'Immutable tamper-evident centralized audit logs with 365-day retention',
    ],
  },
  {
    id: 'iso27001',
    name: 'ISO/IEC 27001:2022',
    standard: 'Information Security Management System (ISMS)',
    status: 'Globally Certified',
    auditor: 'BSI Group Global',
    lastAudit: 'Continuous Surveillance',
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    highlights: [
      'Strict cryptographic key management with automated rotation',
      'Zero vendor data sharing or telemetry monetization guarantees',
      'Comprehensive disaster recovery with RPO < 1 min, RTO < 15 mins',
      'Physical security auditing of all tier-4 sovereign edge hosting locations',
    ],
  },
  {
    id: 'gdpr',
    name: 'GDPR & CCPA Compliant',
    standard: 'EU 2016/679 & California Consumer Privacy Act',
    status: 'Strict Privacy Tier',
    auditor: 'Internal Privacy Council + DPO',
    lastAudit: 'Live Continuous Compliance',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    highlights: [
      'Zero third-party tracking cookies or marketing beacons in registry AST',
      'Automated self-serve data portability & deletion API endpoints',
      'EU Standard Contractual Clauses (SCCs) baked into standard DPA',
      'Encrypted localized edge caches with sovereign residency enforcement',
    ],
  },
  {
    id: 'hipaa',
    name: 'HIPAA & HITECH Ready',
    standard: 'Health Insurance Portability and Accountability Act',
    status: 'BAA Eligible',
    auditor: 'Coalfire Systems',
    lastAudit: 'Annual Attestation',
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    highlights: [
      'AES-256 encryption for data at rest and TLS 1.3 in transit',
      'Automated Business Associate Agreement (BAA) execution for enterprise tiers',
      'Strict role-based access control (RBAC) with just-in-time privilege escalation',
      'PHI isolation architecture with zero persistent client-side caching',
    ],
  },
]

export interface SecurityComplianceBadgesProps {
  className?: string
}

export function SecurityComplianceBadges({ className }: SecurityComplianceBadgesProps) {
  const [activeTab, setActiveTab] = React.useState<string>('soc2')
  const [copiedHash, setCopiedHash] = React.useState(false)
  const [isDownloadingReport, setIsDownloadingReport] = React.useState(false)

  const currentPillar = pillars.find((p) => p.id === activeTab)!

  const copyHash = () => {
    navigator.clipboard.writeText(currentPillar.sha256)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const mockDownload = () => {
    setIsDownloadingReport(true)
    setTimeout(() => {
      setIsDownloadingReport(false)
    }, 1200)
  }

  return (
    <section
      data-slot="security-compliance-badges"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      {/* Ambient Radial Glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-80 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-xl" />

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            Enterprise Trust &amp; Cryptographic Security
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Built for the most compliance-sensitive architectures.
          </h2>
          <p className="text-muted-foreground text-base">
            Zero runtime bloat, zero tracking beacons, and independent third-party verified attestations for your SecOps
            team.
          </p>
        </div>

        {/* Compliance Badges 4-Tile Preview Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {pillars.map((p) => (
            <button
              key={p.id}
              type="button"
              className={cn(
                'group relative overflow-hidden rounded-2xl border p-4 text-left transition-all',
                activeTab === p.id
                  ? 'border-emerald-500/80 bg-emerald-500/5 shadow-md ring-1 ring-emerald-500/30'
                  : 'border-border bg-card/70 hover:border-border hover:bg-card',
              )}
              onClick={() => setActiveTab(p.id)}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-4" />
                </div>
                <span
                  className={cn(
                    'size-2 rounded-full',
                    activeTab === p.id ? 'animate-pulse bg-emerald-500' : 'bg-muted',
                  )}
                />
              </div>

              <h3 className="text-foreground truncate font-mono text-xs font-bold">{p.name.split(' ')[0]}</h3>
              <p className="text-muted-foreground mt-0.5 truncate text-xs">{p.status}</p>
            </button>
          ))}
        </div>

        {/* Interactive Attestation & Security Workbench Card */}
        <Card className="border-border bg-card/95 space-y-6 overflow-hidden rounded-2xl p-6 shadow-sm backdrop-blur-md sm:p-8">
          {/* Workbench Top Details */}
          <div className="border-border/80 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-foreground font-mono text-xl font-bold">{currentPillar.name}</h3>
                <Badge
                  variant="outline"
                  className="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                >
                  Verified
                </Badge>
              </div>
              <p className="text-muted-foreground font-mono text-xs">{currentPillar.standard}</p>
            </div>

            <Button size="sm" variant="outline" className="shrink-0 gap-2 font-mono text-xs" onClick={mockDownload}>
              {isDownloadingReport ? (
                <RefreshCw className="text-primary size-3.5 animate-spin" />
              ) : (
                <Download className="text-muted-foreground size-3.5" />
              )}
              <span>{isDownloadingReport ? 'Preparing DPA Bundle...' : 'Download Security Whitepaper'}</span>
            </Button>
          </div>

          {/* Audit Details Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left: Key Controls & Technical Enforcements */}
            <div className="space-y-3">
              <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">Key Technical Controls</p>
              <ul className="space-y-2.5">
                {currentPillar.highlights.map((item, idx) => (
                  <li key={idx} className="text-foreground/90 flex items-start gap-2.5 text-xs leading-relaxed">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Auditor & Cryptographic SHA-256 Fingerprint */}
            <div className="border-border bg-muted/20 flex flex-col justify-between space-y-4 rounded-xl border p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground">Independent Auditor:</span>
                  <span className="text-foreground font-semibold">{currentPillar.auditor}</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground">Audit Cycle:</span>
                  <span className="text-foreground">{currentPillar.lastAudit}</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground">CVE Vulnerability Scan:</span>
                  <span className="font-bold text-emerald-500">0 High &bull; 0 Critical</span>
                </div>
              </div>

              {/* SHA-256 Hash Box */}
              <div className="border-border/60 space-y-1.5 border-t pt-3">
                <div className="text-muted-foreground flex items-center justify-between font-mono text-xs">
                  <span>Attestation PDF SHA-256 Fingerprint:</span>
                  <button
                    type="button"
                    className="text-primary flex items-center gap-1 hover:underline"
                    onClick={copyHash}
                  >
                    {copiedHash ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <p className="text-muted-foreground bg-background/80 border-border rounded border p-2 font-mono text-xs break-all select-all">
                  {currentPillar.sha256}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
export default SecurityComplianceBadges
