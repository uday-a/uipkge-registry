'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Lock,
  Printer,
  Scale,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface BoardResolutionSignoffProps {
  className?: string
}

export function BoardResolutionSignoff({ className }: BoardResolutionSignoffProps) {
  const resolutionRef = 'BOD-RES-2026-08'
  const companyName = 'UIPKGE Technologies Inc.'
  const corporateEntity = 'Delaware C-Corp • Entity File #7849201'
  const sha256Digest = 'd4e9a83f120c9103ba88e721a998c0b291ab8e0172bf42e01a88c34f9810b492'

  const [copiedRef, setCopiedRef] = useState(false)
  const [copiedDigest, setCopiedDigest] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'generating' | 'downloaded'>('idle')
  const [sharedStatus, setSharedStatus] = useState(false)

  const handleCopyRef = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`#${resolutionRef}`)
      setCopiedRef(true)
      setTimeout(() => {
        setCopiedRef(false)
      }, 2000)
    }
  }

  const handleCopyDigest = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(sha256Digest)
      setCopiedDigest(true)
      setTimeout(() => {
        setCopiedDigest(false)
      }, 2000)
    }
  }

  const handleDownloadPdf = () => {
    setDownloadStatus('generating')
    setTimeout(() => {
      setDownloadStatus('downloaded')
      setTimeout(() => {
        setDownloadStatus('idle')
      }, 3000)
    }, 1600)
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleShare = () => {
    setSharedStatus(true)
    setTimeout(() => {
      setSharedStatus(false)
    }, 2500)
  }

  const directors = [
    {
      name: 'Elena Rostova',
      title: 'Director & Chief Executive Officer',
      initials: 'ER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      signature: 'Elena Rostova',
      signedDate: 'Aug 21, 2026 · 14:32 PST',
      authMethod: 'Hardware FIDO2 Security Key',
      certId: 'SIG-BOD-2026-ER01',
      vote: 'AYE (In Favor)',
    },
    {
      name: 'Marcus Vance',
      title: 'Director & Chief Technology Officer',
      initials: 'MV',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      signature: 'Marcus Vance',
      signedDate: 'Aug 21, 2026 · 14:28 PST',
      authMethod: 'Passkey Biometric (Touch ID / PKI)',
      certId: 'SIG-BOD-2026-MV02',
      vote: 'AYE (In Favor)',
    },
    {
      name: 'Sarah Jenkins, J.D.',
      title: 'Independent Director & Audit Chair',
      initials: 'SJ',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      signature: 'Sarah Jenkins',
      signedDate: 'Aug 21, 2026 · 14:15 PST',
      authMethod: 'Enterprise SSO + FIDO2 2FA',
      certId: 'SIG-BOD-2026-SJ03',
      vote: 'AYE (In Favor)',
    },
  ]

  return (
    <div
      data-slot="board-resolution-signoff"
      className={cn('bg-background text-foreground w-full space-y-6', className)}
    >
      {/* Header Section */}
      <header className="border-border bg-card rounded-xl border p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            {/* Top Tag & Reference Row */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge wrap variant="outline" className="font-mono text-xs font-semibold">
                #{resolutionRef}
              </Badge>

              <button
                type="button"
                className="border-border hover:bg-muted focus-visible:ring-ring bg-muted/40 text-muted-foreground hover:text-foreground inline-flex min-h-6 items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                title="Copy Resolution Reference ID"
                onClick={handleCopyRef}
              >
                {copiedRef ? (
                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="size-3" />
                )}
                <span>{copiedRef ? 'Copied' : 'Copy Ref'}</span>
              </button>

              <Badge
                wrap
                className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              >
                <ShieldCheck className="size-3.5 shrink-0" />
                <span>3 of 3 Directors Signed · Unanimously Approved</span>
              </Badge>

              <Badge wrap variant="secondary" className="font-mono text-xs">
                DGCL § 141(f)
              </Badge>
            </div>

            {/* Title & Organization Info */}
            <div>
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                Unanimous Written Consent of the Board of Directors
              </h1>
              <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="text-foreground flex items-center gap-1.5 font-semibold">
                  <Building2 className="text-primary size-4 shrink-0" />
                  {companyName}
                </span>
                <span>{corporateEntity}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5 shrink-0" />
                  Action Date: August 21, 2026
                </span>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs" onClick={handlePrint}>
              <Printer className="size-3.5" />
              <span>Print Minutes</span>
            </Button>

            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs" onClick={handleShare}>
              <Share2 className="size-3.5" />
              <span>{sharedStatus ? 'Link Copied!' : 'Share Vault'}</span>
            </Button>

            <Button
              aria-label="Download attachment"
              variant="default"
              size="sm"
              className="gap-2 text-xs font-semibold shadow-xs"
              disabled={downloadStatus === 'generating'}
              onClick={handleDownloadPdf}
            >
              <Download className="size-4" />
              {downloadStatus === 'generating' && <span>Generating Certified PDF...</span>}
              {downloadStatus === 'downloaded' && <span>Certified Minutes Downloaded!</span>}
              {downloadStatus === 'idle' && <span>Download Certified Minutes PDF</span>}
            </Button>
          </div>
        </div>
      </header>

      {/* Quorum & Voting Summary Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Scale className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold sm:text-lg">Quorum &amp; Voting Certification</CardTitle>
                <CardDescription className="text-xs">
                  Official vote tally and statutory governance determination under Delaware General Corporation Law
                </CardDescription>
              </div>
            </div>

            <Badge
              wrap
              variant="outline"
              className="self-start border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-700 sm:self-auto dark:text-emerald-400"
            >
              <CheckCircle2 className="mr-1 size-3" />
              Statutory Threshold Satisfied
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5 pt-0 sm:p-6 sm:pt-0">
          {/* 4 KPI Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="border-border/70 bg-muted/20 rounded-lg border p-3.5">
              <p className="text-muted-foreground text-xs font-medium">Board Quorum</p>
              <p className="text-foreground mt-1 font-mono text-lg font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                100% Achieved
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">3 of 3 Voting Directors Present</p>
            </div>

            <div className="border-border/70 bg-muted/20 rounded-lg border p-3.5">
              <p className="text-muted-foreground text-xs font-medium">Voting Tally</p>
              <p className="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">3 In Favor · 0 Opposed</p>
              <p className="text-muted-foreground mt-0.5 text-xs">3 Ayes, 0 Nays, 0 Abstentions</p>
            </div>

            <div className="border-border/70 bg-muted/20 rounded-lg border p-3.5">
              <p className="text-muted-foreground text-xs font-medium">Action Structure</p>
              <p className="text-foreground mt-1 text-xs font-bold sm:text-sm">Unanimous Written Consent</p>
              <p className="text-muted-foreground mt-0.5 text-xs">In Lieu of Special Meeting</p>
            </div>

            <div className="border-border/70 bg-muted/20 rounded-lg border p-3.5">
              <p className="text-muted-foreground text-xs font-medium">Effective Timestamp</p>
              <p className="text-foreground mt-1 font-mono text-xs font-bold tabular-nums sm:text-sm">
                Aug 21, 2026 · 14:32 PST
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">RFC 3161 Certified Vault</p>
            </div>
          </div>

          {/* Approval Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400" />
                Unanimous Board Approval Level (3/3)
              </span>
              <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">100% Unanimous</span>
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div className="h-full w-full rounded-full bg-emerald-600 transition-all duration-500 dark:bg-emerald-500" />
            </div>
          </div>

          {/* Director Quick Vote Roster */}
          <div className="border-border/60 bg-muted/10 grid grid-cols-1 gap-2.5 rounded-lg border p-3 sm:grid-cols-3">
            {directors.map((director) => (
              <div
                key={director.name}
                className="border-border/50 bg-card flex items-center justify-between rounded-md border px-3 py-2 text-xs"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar className="size-6 shrink-0">
                    <AvatarImage src={director.avatar} alt={director.name} />
                    <AvatarFallback className="text-xs">{director.initials}</AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <p className="text-foreground truncate font-medium">{director.name}</p>
                    <p className="text-muted-foreground truncate text-xs">{director.title.split('&')[0].trim()}</p>
                  </div>
                </div>
                <Badge
                  wrap
                  className="shrink-0 border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
                >
                  {director.vote.split(' ')[0]}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Structured Resolution Document Body */}
      <article className="border-border bg-card space-y-8 rounded-xl border p-6 shadow-xs sm:p-8">
        {/* Legal Header Sub-Banner */}
        <div className="border-border space-y-2 border-b pb-6 text-center">
          <Badge wrap variant="outline" className="font-mono text-xs tracking-widest uppercase">
            Official Corporate Governance Record
          </Badge>
          <h2 className="text-foreground text-lg font-bold tracking-tight uppercase sm:text-xl md:text-2xl">
            Action by Unanimous Written Consent of the Board of Directors of {companyName}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xs">
            Pursuant to Section 141(f) of the General Corporation Law of the State of Delaware and the Amended and
            Restated Bylaws of the Corporation
          </p>
        </div>

        {/* Formal Preamble */}
        <div className="border-border/80 bg-muted/20 text-muted-foreground rounded-lg border p-4 text-xs leading-relaxed sm:p-5 sm:text-sm">
          <p>
            <strong className="text-foreground">THE UNDERSIGNED</strong>, constituting all the active members of the
            Board of Directors of <strong className="text-foreground">{companyName}</strong>, a corporation duly
            organized and existing under the laws of the State of Delaware (the &ldquo;Corporation&rdquo;), do hereby
            consent to the adoption of the following resolutions and direct that this Unanimous Written Consent be filed
            with the minutes of the proceedings of the Board of Directors:
          </p>
        </div>

        {/* Resolution 1: Equity Incentive Option Pool Expansion */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">01</span>
              <h3 className="text-foreground text-base font-bold sm:text-lg">
                Authorization and Adoption of the 2026 Equity Incentive Option Pool Expansion
              </h3>
            </div>
            <Badge wrap variant="secondary" className="font-mono text-xs">
              Capitalization &amp; Equity
            </Badge>
          </div>

          <div className="text-muted-foreground space-y-3 text-xs leading-relaxed sm:text-sm">
            <p className="italic">
              <strong className="text-foreground font-semibold not-italic">WHEREAS</strong>, the Board of Directors
              deems it to be in the best interests of the Corporation and its stockholders to expand the number of
              shares reserved under the 2026 Equity Incentive Plan in order to recruit, motivate, and retain vital
              engineering, product, and leadership talent;
            </p>
            <p>
              <strong className="text-foreground font-semibold">NOW, THEREFORE, BE IT RESOLVED</strong>, that the
              Corporation&rsquo;s 2026 Equity Incentive Plan be, and it hereby is, amended to increase the aggregate
              number of authorized shares of Common Stock reserved for issuance thereunder by an additional{' '}
              <strong className="text-foreground font-mono font-semibold">1,500,000 shares</strong> (increasing the
              overall unallocated option reserve from 10.0% to 15.0% of the Corporation&rsquo;s fully-diluted
              capitalization), effective as of the date hereof; and
            </p>
            <p>
              <strong className="text-foreground font-semibold">RESOLVED FURTHER</strong>, that the Compensation
              Committee of the Board of Directors and the executive officers of the Corporation are hereby authorized
              and empowered to grant options, stock appreciation rights, and restricted stock awards from said expanded
              pool in conformity with standard four-year vesting schedules (subject to a one-year cliff).
            </p>
          </div>

          {/* Key Terms Summary Box 1 */}
          <div className="border-border/60 bg-muted/15 grid grid-cols-2 gap-3 rounded-lg border p-3.5 text-xs sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground font-medium">Pool Addition</span>
              <p className="text-foreground mt-0.5 font-mono font-bold tabular-nums">1,500,000 Common Shares</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Reserve Ratio</span>
              <p className="text-foreground mt-0.5 font-mono font-bold tabular-nums">10.0% → 15.0% FD</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Vesting Baseline</span>
              <p className="text-foreground mt-0.5 font-bold">4-Year / 1-Year Cliff</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Committee Scope</span>
              <p className="text-foreground mt-0.5 font-bold">Full Delegation</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Resolution 2: Approval of Cloudflare Pages Infrastructure Agreement */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">02</span>
              <h3 className="text-foreground text-base font-bold sm:text-lg">
                Approval of Cloudflare Pages Infrastructure Enterprise Agreement
              </h3>
            </div>
            <Badge wrap variant="secondary" className="font-mono text-xs">
              Infrastructure &amp; Hosting
            </Badge>
          </div>

          <div className="text-muted-foreground space-y-3 text-xs leading-relaxed sm:text-sm">
            <p className="italic">
              <strong className="text-foreground font-semibold not-italic">WHEREAS</strong>, the Corporation operates a
              mission-critical global UI registry distributed across multi-region edge nodes requiring continuous uptime
              SLAs, global caching, DDoS mitigation, and sub-10ms distribution latency;
            </p>
            <p>
              <strong className="text-foreground font-semibold">NOW, THEREFORE, BE IT RESOLVED</strong>, that the 3-Year
              Enterprise Master Services Agreement with Cloudflare, Inc. for Pages Enterprise Infrastructure, Global
              Edge Caching, and Advanced Threat Defense, with an annualized commitment not to exceed{' '}
              <strong className="text-foreground font-mono font-semibold">$180,000.00 USD</strong>, be, and it hereby
              is, ratified, confirmed, and approved in all respects; and
            </p>
            <p>
              <strong className="text-foreground font-semibold">RESOLVED FURTHER</strong>, that the Chief Executive
              Officer and Chief Technology Officer be, and each of them individually hereby is, authorized, directed,
              and empowered to finalize, execute, and deliver said Enterprise Agreement on behalf of the Corporation.
            </p>
          </div>

          {/* Key Terms Summary Box 2 */}
          <div className="border-border/60 bg-muted/15 grid grid-cols-2 gap-3 rounded-lg border p-3.5 text-xs sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground font-medium">Service Provider</span>
              <p className="text-foreground mt-0.5 font-bold">Cloudflare, Inc.</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Contract Duration</span>
              <p className="text-foreground mt-0.5 font-bold">36 Months (3 Years)</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Annual Commitment Cap</span>
              <p className="text-foreground mt-0.5 font-mono font-bold tabular-nums">$180,000.00 USD / yr</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Uptime Guarantee</span>
              <p className="text-foreground mt-0.5 font-mono font-bold tabular-nums">99.99% Enterprise SLA</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Resolution 3: Appointment of Independent Legal Counsel */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">03</span>
              <h3 className="text-foreground text-base font-bold sm:text-lg">
                Appointment of Independent Legal Counsel
              </h3>
            </div>
            <Badge wrap variant="secondary" className="font-mono text-xs">
              Corporate Governance &amp; Counsel
            </Badge>
          </div>

          <div className="text-muted-foreground space-y-3 text-xs leading-relaxed sm:text-sm">
            <p className="italic">
              <strong className="text-foreground font-semibold not-italic">WHEREAS</strong>, the Corporation requires
              distinguished outside corporate and securities counsel for intellectual property licensing, SOC 2 Type II
              compliance oversight, and upcoming institutional growth financing rounds;
            </p>
            <p>
              <strong className="text-foreground font-semibold">NOW, THEREFORE, BE IT RESOLVED</strong>, that the
              engagement of <strong className="text-foreground">Wilson Sonsini Goodrich &amp; Rosati P.C.</strong> as
              Independent Legal Counsel to the Corporation be, and it hereby is, approved and ratified; and
            </p>
            <p>
              <strong className="text-foreground font-semibold">RESOLVED FURTHER</strong>, that the executive officers
              of the Corporation be, and each of them hereby is, authorized to execute customary engagement
              documentation and approve standard retainer fee schedules.
            </p>
          </div>

          {/* Key Terms Summary Box 3 */}
          <div className="border-border/60 bg-muted/15 grid grid-cols-2 gap-3 rounded-lg border p-3.5 text-xs sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground font-medium">Appointed Firm</span>
              <p className="text-foreground mt-0.5 truncate font-bold">Wilson Sonsini Goodrich &amp; Rosati</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Primary Focus</span>
              <p className="text-foreground mt-0.5 font-bold">Corp Governance &amp; IP</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Billing Model</span>
              <p className="text-foreground mt-0.5 font-bold">Standard Hourly + Retainer</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Jurisdictional Scope</span>
              <p className="text-foreground mt-0.5 font-bold">Delaware / Federal Tech</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Omnibus General Authorization Clause */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">04</span>
            <h3 className="text-foreground text-base font-bold sm:text-lg">
              Omnibus Authorization and Ratification of Prior Actions
            </h3>
          </div>

          <div className="text-muted-foreground space-y-3 text-xs leading-relaxed sm:text-sm">
            <p>
              <strong className="text-foreground font-semibold">RESOLVED</strong>, that the officers of the Corporation
              be, and each of them hereby is, authorized, directed, and empowered, in the name and on behalf of the
              Corporation, to take all such further actions, pay all fees, and execute and deliver all such further
              agreements, certificates, notices, and instruments as may be necessary, proper, or advisable to carry out
              the full purpose and intent of the foregoing resolutions; and
            </p>
            <p>
              <strong className="text-foreground font-semibold">RESOLVED FURTHER</strong>, that all actions heretofore
              taken by any officer or director of the Corporation in connection with any matter referred to in the
              foregoing resolutions are hereby ratified, confirmed, and approved in all respects as the authorized act
              and deed of the Corporation.
            </p>
          </div>
        </section>
      </article>

      {/* Director Signature Execution Blocks */}
      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-foreground text-base font-bold sm:text-lg">
              Director Signature Execution &amp; Electronic Certification
            </h2>
            <p className="text-muted-foreground text-xs">
              Executed by all directors of the Corporation pursuant to Section 141(f) of the Delaware General
              Corporation Law
            </p>
          </div>
          <Badge
            wrap
            className="self-start border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-700 sm:self-auto dark:text-emerald-400"
          >
            <CheckCircle2 className="mr-1 size-3" />3 of 3 Signatures Authenticated
          </Badge>
        </div>

        {/* 3 Director Signing Tiles Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {directors.map((director) => (
            <Card
              key={director.name}
              className="border-border/80 bg-card hover:border-border shadow-xs transition-colors"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar className="border-border size-10 shrink-0 border">
                      <AvatarImage src={director.avatar} alt={director.name} />
                      <AvatarFallback className="text-xs font-bold">{director.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="truncate text-sm font-semibold">{director.name}</CardTitle>
                      <CardDescription className="truncate text-xs">{director.title}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 p-4 pt-2 text-xs">
                {/* Digital Signature Calligraphy Box */}
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-center dark:bg-emerald-950/20">
                  <div className="text-muted-foreground mb-1 flex items-center justify-between text-xs">
                    <span className="font-mono text-xs">Digital Signature</span>
                    <Badge
                      wrap
                      variant="outline"
                      className="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
                    >
                      <Check className="mr-1 size-2.5" /> Verified
                    </Badge>
                  </div>

                  {/* Cursive signature representation */}
                  <div className="my-1.5 flex h-12 items-center justify-center">
                    <span className="text-xl font-medium tracking-wide text-emerald-800 italic dark:text-emerald-300">
                      {director.signature}
                    </span>
                  </div>

                  <div className="text-muted-foreground flex items-center justify-center gap-1 border-t border-emerald-500/20 pt-1 font-mono text-xs">
                    <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                    <span>e-Signed via FIDO2 / PKI Ledger</span>
                  </div>
                </div>

                {/* Signature Metadata List */}
                <div className="text-muted-foreground space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span>Executed:</span>
                    <span className="text-foreground font-semibold tabular-nums">{director.signedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auth Protocol:</span>
                    <span className="text-foreground max-w-[170px] truncate text-right font-semibold">
                      {director.authMethod}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Certificate Hash:</span>
                    <span className="text-foreground font-semibold">{director.certId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Corporate Seal & Cryptographic Certificate Audit Strip */}
      <Card className="border-border bg-muted/20 border shadow-xs">
        <CardContent className="flex flex-col gap-4 p-5 text-xs lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            {/* Corporate Seal Emblem SVG */}
            <div className="bg-card relative flex size-12 shrink-0 items-center justify-center rounded-full border border-amber-500/40 p-1 shadow-xs">
              <svg
                className="size-full text-amber-600 dark:text-amber-400"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M50 18 L60 38 L82 38 L64 52 L70 74 L50 60 L30 74 L36 52 L18 38 L40 38 Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="currentColor"
                  fillOpacity="0.1"
                />
                <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-bold">Official Corporate Seal &amp; Immutable Minutes Vault</span>
                <Badge
                  wrap
                  variant="outline"
                  className="border-emerald-500/30 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                >
                  Tamper-Proof
                </Badge>
              </div>
              <p className="text-muted-foreground mt-0.5">
                State of Delaware Division of Corporations • Entity File #7849201 • RFC 3161 Qualified Timestamping
              </p>
            </div>
          </div>

          {/* Cryptographic Audit Hash & Verification Action */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-muted-foreground">SHA-256 Digest:</span>
              <button
                type="button"
                className="hover:bg-muted focus-visible:ring-ring border-border bg-card text-foreground inline-flex min-h-6 items-center gap-1 rounded border px-2 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                title="Copy SHA-256 Cryptographic Digest"
                onClick={handleCopyDigest}
              >
                <span className="tabular-nums">d4e9a8...810b492</span>
                {copiedDigest ? (
                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="text-muted-foreground size-3" />
                )}
              </button>
            </div>

            <Badge wrap variant="secondary" className="gap-1 font-mono text-xs">
              <Lock className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>256-Bit Vault Sealed</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BoardResolutionSignoff
