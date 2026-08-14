'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  AlertCircle,
  BadgeCheck,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Lock,
  Pen,
  PenTool,
  Printer,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface FreelanceWorkForHireContractProps {
  className?: string
  initialSigned?: boolean
  initialInitialsCompleted?: boolean
}

export function FreelanceWorkForHireContract({
  className,
  initialSigned = false,
  initialInitialsCompleted = false,
}: FreelanceWorkForHireContractProps) {
  const [initial1Completed, setInitial1Completed] = useState(initialInitialsCompleted || initialSigned)
  const [initial2Completed, setInitial2Completed] = useState(initialInitialsCompleted || initialSigned)
  const [isSigned, setIsSigned] = useState(initialSigned)
  const [signerName] = useState('Elena Rostova')
  const [signatureFont, setSignatureFont] = useState<'serif' | 'script' | 'sans'>('serif')
  const [eConsentAgreed, setEConsentAgreed] = useState(true)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const completedCount = (initial1Completed ? 1 : 0) + (initial2Completed ? 1 : 0) + (isSigned ? 1 : 0)
  const canSign = initial1Completed && initial2Completed && eConsentAgreed && !isSigned

  const toggleInitial1 = () => {
    if (isSigned) return
    setInitial1Completed((prev) => !prev)
  }

  const toggleInitial2 = () => {
    if (isSigned) return
    setInitial2Completed((prev) => !prev)
  }

  const signContract = () => {
    if (!canSign) return
    setIsSigned(true)
  }

  const resetWorkflow = () => {
    setInitial1Completed(false)
    setInitial2Completed(false)
    setIsSigned(false)
    setDownloadSuccess(false)
  }

  const handleDownload = () => {
    setDownloadSuccess(true)
    setTimeout(() => {
      setDownloadSuccess(false)
    }, 2500)
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const scrollToInitial1 = () => {
    const el = document.getElementById('react-initial-marker-ip')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const scrollToInitial2 = () => {
    const el = document.getElementById('react-initial-marker-kill-fee')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const scrollToSignaturePad = () => {
    const el = document.getElementById('react-signature-pad')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div data-slot="freelance-work-for-hire-contract" className={cn('bg-background text-foreground w-full', className)}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Top Agreement Header */}
        <header className="border-border bg-card mb-6 rounded-xl border p-5 shadow-xs sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">Contract Ref:</span>
                <span className="text-foreground font-mono text-xs font-semibold tabular-nums">#MSA-2026-4892</span>
                <span className="text-muted-foreground text-xs">&bull;</span>
                <span className="text-muted-foreground text-xs font-medium">Total Value:</span>
                <span className="text-foreground font-mono text-xs font-bold tabular-nums">$24,000.00 USD</span>
                <span className="text-muted-foreground text-xs">&bull;</span>
                {isSigned ? (
                  <Badge
                    wrap
                    className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    <BadgeCheck className="size-3.5" />
                    <span>Fully Executed &amp; Legally Binding</span>
                  </Badge>
                ) : initial1Completed && initial2Completed ? (
                  <Badge
                    wrap
                    className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
                  >
                    <PenTool className="size-3.5" />
                    <span>Ready for Signature</span>
                  </Badge>
                ) : (
                  <Badge
                    wrap
                    className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
                  >
                    <AlertCircle className="size-3.5" />
                    <span>
                      Ready for Signature &bull; {(initial1Completed ? 0 : 1) + (initial2Completed ? 0 : 1)} Checkpoints
                      Pending
                    </span>
                  </Badge>
                )}
              </div>
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                Independent Contractor Agreement &amp; Work-for-Hire Assignment
              </h1>
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <Scale className="text-primary size-3.5" />
                  <span>
                    Governing Law: <strong>State of Delaware, US</strong>
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="text-primary size-3.5" />
                  <span>
                    Effective Date: <strong>September 01, 2026</strong>
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Work-for-Hire (17 U.S.C. &sect; 101)</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs" onClick={handlePrint}>
                <Printer className="size-4" />
                <span>Print</span>
              </Button>
              <Button
                aria-label="Download attachment"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs shadow-xs"
                onClick={handleDownload}
              >
                <Download className="size-4" />
                <span>{downloadSuccess ? 'Downloading PDF...' : 'Download Draft PDF'}</span>
              </Button>
              {!isSigned ? (
                <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs" onClick={scrollToSignaturePad}>
                  <PenTool className="size-3.5" />
                  <span>Sign Contract</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-muted-foreground/30 gap-1.5 text-xs"
                  onClick={resetWorkflow}
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset Demo</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* 2-Column Agreement Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Contract Document Terms */}
          <main className="space-y-6 lg:col-span-8">
            <div className="border-border bg-card rounded-xl border p-6 shadow-xs sm:p-8">
              {/* Document Header Banner */}
              <div className="border-border border-b pb-6 text-center">
                <div className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
                  <Scale className="size-3.5" />
                  <span>MASTER SERVICES AGREEMENT (MSA) &bull; WORK-FOR-HIRE</span>
                </div>
                <h2 className="text-foreground mt-3 text-lg font-bold tracking-tight uppercase sm:text-xl">
                  Independent Contractor Master Services Agreement
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Proprietary Rights Assignment &bull; Milestone Payment Schedule &bull; Kill Fee Terms
                </p>
              </div>

              {/* Parties Comparison Matrix */}
              <div className="my-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Client Card */}
                  <div className="border-border/80 bg-muted/20 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                        The Client
                      </span>
                      <Badge wrap variant="outline" className="font-mono text-xs">
                        Principal
                      </Badge>
                    </div>
                    <div className="mt-2.5 flex items-center gap-3">
                      <Avatar className="border-border size-10 border">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">UP</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-foreground text-sm font-bold">UIPKGE Technologies Inc.</p>
                        <p className="text-muted-foreground text-xs">Delaware C-Corp &bull; File #6849201</p>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="text-muted-foreground space-y-1 font-mono text-xs">
                      <p className="flex justify-between">
                        <span>Address:</span>
                        <span className="text-foreground text-right font-sans">
                          548 Market St, Suite 29000, SF, CA 94104
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Authorized Signer:</span>
                        <span className="text-foreground font-sans font-semibold">David Chen (CTO)</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Billing Contact:</span>
                        <span className="text-foreground font-sans">legal@uipkge.dev</span>
                      </p>
                    </div>
                  </div>

                  {/* Contractor Card */}
                  <div className="border-border/80 bg-muted/20 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                        The Contractor
                      </span>
                      <Badge wrap variant="outline" className="font-mono text-xs">
                        Independent Pro
                      </Badge>
                    </div>
                    <div className="mt-2.5 flex items-center gap-3">
                      <Avatar className="border-border size-10 border">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">ER</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-foreground text-sm font-bold">Elena Rostova Design LLC</p>
                        <p className="text-muted-foreground text-xs">New York LLC &bull; EIN: XX-XXX4910</p>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="text-muted-foreground space-y-1 font-mono text-xs">
                      <p className="flex justify-between">
                        <span>Address:</span>
                        <span className="text-foreground text-right font-sans">
                          350 5th Avenue, Suite 4100, NY, NY 10118
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Principal Signer:</span>
                        <span className="text-foreground font-sans font-semibold">
                          Elena Rostova (Design Architect)
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Direct Contact:</span>
                        <span className="text-foreground font-sans">elena@rostovadesign.io</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope of Work Executive Summary Box */}
              <div className="bg-muted/30 border-border mb-8 rounded-lg border p-4 sm:p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Statement of Work (SOW-01)
                    </span>
                    <h3 className="text-foreground text-sm font-bold sm:text-base">
                      Full-Stack Design System Component Architecture &amp; Documentation
                    </h3>
                  </div>
                  <Badge wrap variant="secondary" className="self-start font-mono text-xs sm:self-auto">
                    Fixed-Price Milestone
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
                  Contractor shall architect, code, test, and document a multi-framework component registry matching
                  enterprise production craft standards, comprising OKLCH design tokens, 50 headless Vue &amp; React UI
                  primitives, 50 composed application blocks, accessibility test suites, and interactive Astro live
                  documentation.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="border-border/60 bg-card rounded-md border p-2.5">
                    <p className="text-muted-foreground text-xs font-medium">Total Consideration</p>
                    <p className="text-foreground mt-0.5 font-mono text-base font-bold tabular-nums sm:text-lg">
                      $24,000.00
                    </p>
                    <p className="text-muted-foreground text-xs">100% Milestone-based</p>
                  </div>
                  <div className="border-border/60 bg-card rounded-md border p-2.5">
                    <p className="text-muted-foreground text-xs font-medium">Payment Terms</p>
                    <p className="text-foreground mt-0.5 text-xs font-bold sm:text-sm">Net 15 Days</p>
                    <p className="text-muted-foreground text-xs">Upon acceptance</p>
                  </div>
                  <div className="border-border/60 bg-card rounded-md border p-2.5">
                    <p className="text-muted-foreground text-xs font-medium">IP Ownership</p>
                    <p className="text-foreground mt-0.5 text-xs font-bold sm:text-sm">Work-for-Hire</p>
                    <p className="text-muted-foreground text-xs">17 U.S.C. &sect; 101</p>
                  </div>
                  <div className="border-border/60 bg-card rounded-md border p-2.5">
                    <p className="text-muted-foreground text-xs font-medium">Kill Fee Baseline</p>
                    <p className="text-foreground mt-0.5 font-mono text-base font-bold text-amber-700 tabular-nums sm:text-lg dark:text-amber-400">
                      25.0%
                    </p>
                    <p className="text-muted-foreground text-xs">On uncompleted</p>
                  </div>
                </div>
              </div>

              {/* Legal Sections Stream */}
              <div className="text-foreground/90 space-y-8 text-xs leading-relaxed sm:text-sm">
                {/* Section 1: Services & Deliverables Table */}
                <section id="react-section-1" className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      01
                    </span>
                    <h3 className="text-foreground text-sm font-bold sm:text-base">
                      Services, Milestone Deliverables &amp; Acceptance
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Contractor agrees to perform the services and provide the specific deliverables set forth in the
                    milestone schedule below. Each deliverable shall undergo formal review by Client within seven (7)
                    business days of submission.
                  </p>

                  {/* Itemized Deliverables Table */}
                  <div className="border-border overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="text-xs font-bold">Milestone &amp; Scope</TableHead>
                            <TableHead className="text-xs font-bold">Target Date</TableHead>
                            <TableHead className="text-right text-xs font-bold">Consideration</TableHead>
                            <TableHead className="text-right text-xs font-bold">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">
                              <div className="space-y-0.5">
                                <p className="text-foreground font-semibold">
                                  Milestone 1: Architectural Discovery &amp; Token Spec
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  OKLCH token set, Tailwind v4 theme bindings, typography scale, and core utilities.
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground font-mono text-xs tabular-nums">
                              Sep 15, 2026
                            </TableCell>
                            <TableCell className="text-foreground text-right font-mono font-bold tabular-nums">
                              $6,000.00
                              <span className="text-muted-foreground block text-xs font-normal">25% (Deposit)</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                wrap
                                className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                              >
                                <Check className="mr-1 size-3" /> Paid &amp; Settled
                              </Badge>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className="font-medium">
                              <div className="space-y-0.5">
                                <p className="text-foreground font-semibold">
                                  Milestone 2: Core 50 UI Primitives in Vue &amp; React
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  50 accessible headless primitives (Reka UI &amp; Radix mirror), CVA variants, and unit
                                  test suites.
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground font-mono text-xs tabular-nums">
                              Oct 15, 2026
                            </TableCell>
                            <TableCell className="text-foreground text-right font-mono font-bold tabular-nums">
                              $10,000.00
                              <span className="text-muted-foreground block text-xs font-normal">41.67%</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                wrap
                                variant="outline"
                                className="border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-700 dark:text-blue-400"
                              >
                                <Clock className="mr-1 size-3" /> Pending Review
                              </Badge>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className="font-medium">
                              <div className="space-y-0.5">
                                <p className="text-foreground font-semibold">
                                  Milestone 3: 50 Composed Application Blocks &amp; Docs
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  50 production application domain blocks, Astro documentation pages, story demos, and
                                  manifests.
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground font-mono text-xs tabular-nums">
                              Nov 15, 2026
                            </TableCell>
                            <TableCell className="text-foreground text-right font-mono font-bold tabular-nums">
                              $8,000.00
                              <span className="text-muted-foreground block text-xs font-normal">33.33%</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge wrap variant="secondary" className="text-muted-foreground text-xs font-medium">
                                Scheduled
                              </Badge>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Section 2: Intellectual Property Assignment & Work-for-Hire */}
                <section id="react-section-2" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      02
                    </span>
                    <h3 className="text-foreground text-sm font-bold sm:text-base">
                      Intellectual Property Assignment &amp; Work-for-Hire Doctrine
                    </h3>
                  </div>
                  <div className="text-muted-foreground space-y-2.5">
                    <p>
                      <strong className="text-foreground">2.1 Work-for-Hire Declaration:</strong> Contractor expressly
                      acknowledges and agrees that all original works of authorship, user interface components, software
                      architecture, codebases, design tokens, documentation, graphic assets, and associated inventions
                      prepared, authored, or contributed by Contractor under this Agreement shall constitute a{' '}
                      <strong className="text-foreground">&ldquo;Work Made for Hire&rdquo;</strong> as defined under the
                      United States Copyright Act (17 U.S.C. &sect; 101) for the benefit of Client.
                    </p>
                    <p>
                      <strong className="text-foreground">2.2 Absolute Assignment:</strong> To the extent that any
                      Deliverable does not legally qualify as a work made for hire, Contractor hereby irrevocably,
                      unconditionally, and perpetually transfers, assigns, and conveys to Client all worldwide right,
                      title, and interest in and to all Intellectual Property Rights, including patents, copyrights,
                      trade secrets, trademarks, and moral rights, effective immediately upon receipt of full payment
                      for the applicable milestone.
                    </p>
                    <p>
                      <strong className="text-foreground">2.3 Pre-Existing IP &amp; Open-Source Carveout:</strong>{' '}
                      Contractor retains sole ownership of pre-existing general toolchains and standard open-source
                      libraries licensed under OSI-approved licenses (MIT/Apache-2.0) incorporated into the
                      Deliverables, granting Client an irrevocable, perpetual, royalty-free, worldwide license to
                      utilize, sub-license, and distribute such pre-existing materials.
                    </p>
                  </div>

                  {/* Initial Checkpoint Marker 1 */}
                  <div
                    id="react-initial-marker-ip"
                    className={cn(
                      'rounded-lg border p-4 transition-all duration-200',
                      initial1Completed
                        ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                        : 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/20 dark:bg-amber-950/20',
                    )}
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            Contractor Initial Checkpoint &bull; Section 2
                          </span>
                          {initial1Completed ? (
                            <Badge
                              wrap
                              className="border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                            >
                              <Check className="mr-1 size-3" /> Initialed
                            </Badge>
                          ) : (
                            <Badge
                              wrap
                              className="border-amber-500/40 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
                            >
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Contractor hereby irrevocably assigns all right, title, and interest in deliverables upon
                          receipt of full payment under 17 U.S.C. &sect; 101.
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isSigned}
                        variant={initial1Completed ? 'outline' : 'default'}
                        className={cn(
                          'shrink-0 gap-2 text-xs font-medium shadow-xs transition-all',
                          initial1Completed
                            ? 'border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300'
                            : 'bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600',
                        )}
                        onClick={toggleInitial1}
                      >
                        {initial1Completed ? (
                          <>
                            <span className="text-sm font-semibold italic">ER</span>
                            <span className="font-mono text-xs tabular-nums">&bull; Elena Rostova [Initialed]</span>
                          </>
                        ) : (
                          <>
                            <Pen className="size-3.5" />
                            <span>Click to Initial [ER]</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Section 3: Compensation & Invoicing */}
                <section id="react-section-3" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      03
                    </span>
                    <h3 className="text-foreground text-sm font-bold sm:text-base">
                      Compensation, Invoicing &amp; Net 15 Terms
                    </h3>
                  </div>
                  <div className="text-muted-foreground space-y-2.5">
                    <p>
                      <strong className="text-foreground">3.1 Aggregate Consideration:</strong> In full consideration
                      for the timely and satisfactory completion of the Deliverables, Client shall pay Contractor an
                      aggregate fixed fee of{' '}
                      <strong className="text-foreground font-mono tabular-nums">$24,000.00 USD</strong> according to
                      the milestone schedule in Section 1.
                    </p>
                    <p>
                      <strong className="text-foreground">3.2 Invoicing &amp; Net 15 Terms:</strong> Contractor shall
                      submit an electronic invoice upon delivery of each milestone. Client shall remit payment within{' '}
                      <strong className="text-foreground">fifteen (15) calendar days (Net 15)</strong> from the date of
                      formal written acceptance via ACH direct deposit or international wire. Overdue undisputed
                      balances shall accrue statutory interest at 1.5% per month.
                    </p>
                    <p>
                      <strong className="text-foreground">3.3 Taxes &amp; Independent Status:</strong> Contractor
                      operates strictly as an independent contractor. Contractor is solely responsible for reporting and
                      remitting all applicable federal, state, local, and self-employment taxes (IRS Form 1099-NEC). No
                      employment benefits, healthcare, retirement, or worker&rsquo;s compensation coverage are provided.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Section 4: Termination & Kill Fee */}
                <section id="react-section-4" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      04
                    </span>
                    <h3 className="text-foreground text-sm font-bold sm:text-base">
                      Termination &amp; 25% Kill Fee Policy
                    </h3>
                  </div>
                  <div className="text-muted-foreground space-y-2.5">
                    <p>
                      <strong className="text-foreground">4.1 Convenience Termination:</strong> Either party may
                      terminate this Agreement without cause upon providing{' '}
                      <strong className="text-foreground">fourteen (14) calendar days</strong> prior written notice to
                      the other party.
                    </p>
                    <p>
                      <strong className="text-foreground">4.2 Kill Fee Entitlement:</strong> In the event Client elects
                      to terminate this Agreement for convenience prior to final completion, Client shall promptly pay
                      Contractor for: (a) all completed and accepted milestones in full, and (b) a{' '}
                      <strong className="text-foreground font-semibold text-amber-700 dark:text-amber-400">
                        Kill Fee of twenty-five percent (25%)
                      </strong>{' '}
                      of the total remaining uncompleted milestone compensation to cover reserved contractor capacity
                      and schedule reallocation.
                    </p>
                    <p>
                      <strong className="text-foreground">4.3 Immediate Handover:</strong> Upon termination, Contractor
                      shall immediately deliver to Client all completed and partially completed work product, Git
                      branches, design system source files, and credentials up to the termination effective date.
                    </p>
                  </div>

                  {/* Initial Checkpoint Marker 2 */}
                  <div
                    id="react-initial-marker-kill-fee"
                    className={cn(
                      'rounded-lg border p-4 transition-all duration-200',
                      initial2Completed
                        ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                        : 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/20 dark:bg-amber-950/20',
                    )}
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            Contractor Initial Checkpoint &bull; Section 4
                          </span>
                          {initial2Completed ? (
                            <Badge
                              wrap
                              className="border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                            >
                              <Check className="mr-1 size-3" /> Initialed
                            </Badge>
                          ) : (
                            <Badge
                              wrap
                              className="border-amber-500/40 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
                            >
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Acknowledge the 14-day termination notice requirement and 25% kill fee clause on uncompleted
                          milestones.
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isSigned}
                        variant={initial2Completed ? 'outline' : 'default'}
                        className={cn(
                          'shrink-0 gap-2 text-xs font-medium shadow-xs transition-all',
                          initial2Completed
                            ? 'border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300'
                            : 'bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600',
                        )}
                        onClick={toggleInitial2}
                      >
                        {initial2Completed ? (
                          <>
                            <span className="text-sm font-semibold italic">ER</span>
                            <span className="font-mono text-xs tabular-nums">&bull; Elena Rostova [Initialed]</span>
                          </>
                        ) : (
                          <>
                            <Pen className="size-3.5" />
                            <span>Click to Initial [ER]</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Execution & Signatures Section */}
                <section className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-foreground text-sm font-bold sm:text-base">Execution &amp; Legal Signatures</h3>
                    <span className="text-muted-foreground font-mono text-xs">2 of 2 Parties Countersigned</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Client Signature Block */}
                    <div className="border-border bg-muted/20 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-foreground text-xs font-semibold tracking-wider uppercase">
                          Client Execution
                        </p>
                        <Badge
                          wrap
                          variant="outline"
                          className="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
                        >
                          <Check className="mr-1 size-3" /> Signed &amp; Verified
                        </Badge>
                      </div>
                      <div className="border-border/60 bg-card my-3 rounded-md border p-3 text-center">
                        <p className="text-xl font-medium tracking-wide text-emerald-800 italic dark:text-emerald-300">
                          David Chen
                        </p>
                        <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                          CTO &bull; UIPKGE Technologies Inc.
                        </p>
                      </div>
                      <div className="text-muted-foreground space-y-1 font-mono text-xs">
                        <p className="flex justify-between">
                          <span>Date Executed:</span>
                          <span className="text-foreground font-semibold tabular-nums">
                            Aug 20, 2026 &bull; 14:22 EDT
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>Digital Cert:</span>
                          <span className="text-foreground font-semibold">CERT-UIP-2026-991A</span>
                        </p>
                      </div>
                    </div>

                    {/* Contractor Signature Block */}
                    <div
                      className={cn(
                        'rounded-lg border p-4 transition-all duration-200',
                        isSigned
                          ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                          : 'border-border bg-muted/10 border-dashed',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-foreground text-xs font-semibold tracking-wider uppercase">
                          Contractor Execution
                        </p>
                        {isSigned ? (
                          <Badge
                            wrap
                            className="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400"
                          >
                            <Check className="mr-1 size-3" /> Signed
                          </Badge>
                        ) : (
                          <Badge
                            wrap
                            className="border-amber-500/40 bg-amber-500/10 font-mono text-xs font-medium text-amber-700 dark:text-amber-400"
                          >
                            Pending Signature
                          </Badge>
                        )}
                      </div>

                      <div
                        className={cn(
                          'my-3 rounded-md border p-3 text-center transition-all',
                          isSigned
                            ? 'bg-card border-emerald-500/40'
                            : 'border-muted-foreground/30 bg-muted/20 border-dashed',
                        )}
                      >
                        {isSigned ? (
                          <>
                            <p
                              className={cn(
                                'text-xl font-medium tracking-wide text-emerald-800 dark:text-emerald-300',
                                signatureFont === 'serif' && 'font-medium tracking-wide italic',
                                signatureFont === 'script' && 'font-medium tracking-widest italic',
                                signatureFont === 'sans' && 'font-semibold tracking-tight',
                              )}
                            >
                              {signerName}
                            </p>
                            <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                              Principal &bull; Elena Rostova Design LLC
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-muted-foreground text-xs italic">
                              Awaiting contractor electronic execution via sidebar
                            </p>
                            <p className="text-muted-foreground/80 mt-1 text-xs">
                              Complete both initials above to enable signing
                            </p>
                          </>
                        )}
                      </div>

                      <div className="text-muted-foreground space-y-1 font-mono text-xs">
                        <p className="flex justify-between">
                          <span>Date Signed:</span>
                          <span className="text-foreground font-semibold tabular-nums">
                            {isSigned ? 'Aug 21, 2026 • 11:15 EDT' : 'Pending'}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>Audit Hash:</span>
                          <span className="text-foreground font-semibold">
                            {isSigned ? 'SHA256:4b9a2...e781' : 'Unexecuted'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </main>

          {/* Right Column: Milestone & Payment Schedule + Signature Action Center */}
          <aside className="space-y-5 lg:sticky lg:top-6 lg:col-span-4 lg:self-start">
            {/* Contractor Signer Profile Card */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="border-border size-9 border">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">ER</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm font-semibold">{signerName}</CardTitle>
                      <CardDescription className="text-xs">Principal Design Architect</CardDescription>
                    </div>
                  </div>
                  <Badge wrap variant="outline" className="border-primary/30 text-primary font-mono text-xs">
                    Contractor
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2 p-4 pt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entity:</span>
                  <span className="text-foreground font-medium">Elena Rostova Design LLC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Status:</span>
                  <span className="text-foreground font-medium">W-9 On File (EIN Verified)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disbursement:</span>
                  <span className="text-foreground font-mono tabular-nums">ACH Direct Deposit (&bull;&bull;8842)</span>
                </div>
              </CardContent>
            </Card>

            {/* Milestone & Payout Schedule Card */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Payment Milestones</CardTitle>
                  <span className="text-foreground font-mono text-xs font-bold tabular-nums">$24,000.00 USD</span>
                </div>
                <CardDescription className="text-xs">Milestone-based disbursement on acceptance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-2 text-xs">
                {/* Milestone 1 */}
                <div className="border-border/70 bg-muted/20 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-semibold">1. Discovery &amp; Token Spec</span>
                    <Badge
                      wrap
                      className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                    >
                      Paid $6,000
                    </Badge>
                  </div>
                  <div className="text-muted-foreground mt-1.5 flex items-center justify-between">
                    <span>Target: Sep 15, 2026</span>
                    <span className="font-mono tabular-nums">25% Allocation</span>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="border-border/70 bg-muted/20 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-semibold">2. Core 50 UI Primitives</span>
                    <Badge
                      wrap
                      variant="outline"
                      className="border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-700 dark:text-blue-400"
                    >
                      Review $10,000
                    </Badge>
                  </div>
                  <div className="text-muted-foreground mt-1.5 flex items-center justify-between">
                    <span>Target: Oct 15, 2026</span>
                    <span className="font-mono tabular-nums">41.67% Allocation</span>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="border-border/70 bg-muted/20 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-semibold">3. 50 Composed Blocks</span>
                    <Badge wrap variant="secondary" className="text-muted-foreground text-xs font-medium">
                      Due $8,000
                    </Badge>
                  </div>
                  <div className="text-muted-foreground mt-1.5 flex items-center justify-between">
                    <span>Target: Nov 15, 2026</span>
                    <span className="font-mono tabular-nums">33.33% Final</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Payment Progress</span>
                    <span className="text-foreground font-mono font-medium tabular-nums">$6,000 / $24,000 (25%)</span>
                  </div>
                  <div className="bg-muted flex h-2 w-full overflow-hidden rounded-full">
                    <div className="h-full w-[25%] bg-emerald-500" title="Paid (25%)" />
                    <div className="h-full w-[41.67%] bg-blue-500/60" title="In Review (41.67%)" />
                    <div className="bg-muted-foreground/20 h-full w-[33.33%]" title="Scheduled (33.33%)" />
                  </div>
                </div>

                {/* Kill Fee Calculation Callout */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
                      <ShieldAlert className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span>25% Kill Fee Protection</span>
                    </div>
                    <span className="font-mono font-bold text-amber-800 tabular-nums dark:text-amber-300">
                      $4,500.00
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Calculated as 25% of uncompleted milestones ($18,000.00) payable upon client convenience
                    termination.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Signature Action Checklist Card */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Execution Checklist</CardTitle>
                  <Badge
                    wrap
                    variant={completedCount === 3 ? 'default' : 'secondary'}
                    className="font-mono text-xs tabular-nums"
                  >
                    {completedCount} / 3 Done
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Complete all mandatory checkpoints to finalize contract
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 p-4 pt-2">
                {/* Item 1: Initial Section 2 IP */}
                <button
                  type="button"
                  className="border-border/80 hover:bg-muted/40 flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-xs transition-colors"
                  onClick={scrollToInitial1}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'flex size-5 items-center justify-center rounded-full text-xs font-semibold',
                        initial1Completed
                          ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
                      )}
                    >
                      {initial1Completed ? <Check className="size-3" /> : <span>1</span>}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Initial Section 2 (IP Assignment)</p>
                      <p className="text-muted-foreground text-xs">17 U.S.C. &sect; 101 Work-for-Hire clause</p>
                    </div>
                  </div>
                  <Badge
                    wrap
                    variant={initial1Completed ? 'outline' : 'secondary'}
                    className={cn(
                      'text-xs',
                      initial1Completed
                        ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                        : 'text-amber-700 dark:text-amber-400',
                    )}
                  >
                    {initial1Completed ? 'Done' : 'Review'}
                  </Badge>
                </button>

                {/* Item 2: Initial Section 4 Kill Fee */}
                <button
                  type="button"
                  className="border-border/80 hover:bg-muted/40 flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-xs transition-colors"
                  onClick={scrollToInitial2}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'flex size-5 items-center justify-center rounded-full text-xs font-semibold',
                        initial2Completed
                          ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
                      )}
                    >
                      {initial2Completed ? <Check className="size-3" /> : <span>2</span>}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Initial Section 4 (25% Kill Fee)</p>
                      <p className="text-muted-foreground text-xs">Termination protocol &amp; compensation</p>
                    </div>
                  </div>
                  <Badge
                    wrap
                    variant={initial2Completed ? 'outline' : 'secondary'}
                    className={cn(
                      'text-xs',
                      initial2Completed
                        ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                        : 'text-amber-700 dark:text-amber-400',
                    )}
                  >
                    {initial2Completed ? 'Done' : 'Review'}
                  </Badge>
                </button>

                {/* Item 3: Full MSA Signature */}
                <div
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-2.5 text-xs',
                    isSigned ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border/80 bg-card',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'flex size-5 items-center justify-center rounded-full text-xs font-semibold',
                        isSigned ? 'bg-emerald-500 text-white dark:bg-emerald-600' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {isSigned ? <Check className="size-3" /> : <span>3</span>}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Execute Agreement</p>
                      <p className="text-muted-foreground text-xs">Contractor e-signature</p>
                    </div>
                  </div>
                  <Badge
                    wrap
                    variant={isSigned ? 'outline' : 'secondary'}
                    className={cn(
                      'text-xs',
                      isSigned
                        ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                        : 'text-muted-foreground',
                    )}
                  >
                    {isSigned ? 'Executed' : 'Pending'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Signature Pad Card */}
            <Card id="react-signature-pad" className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold">Contractor Signature Pad</CardTitle>
                <CardDescription className="text-xs">Adopt signature style &amp; execute contract</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 pt-2">
                {/* Style Selector */}
                <div className="bg-muted/60 grid grid-cols-3 gap-1.5 rounded-lg p-1">
                  <button
                    type="button"
                    className={cn(
                      'rounded-md py-1 text-center text-xs font-medium transition-colors',
                      signatureFont === 'serif'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setSignatureFont('serif')}
                  >
                    Formal Serif
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'rounded-md py-1 text-center text-xs font-medium transition-colors',
                      signatureFont === 'script'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setSignatureFont('script')}
                  >
                    Script Elegance
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'rounded-md py-1 text-center text-xs font-medium transition-colors',
                      signatureFont === 'sans'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setSignatureFont('sans')}
                  >
                    Modern Sans
                  </button>
                </div>

                {/* Preview Display Box */}
                <div className="border-border bg-muted/20 relative rounded-lg border p-4 text-center">
                  <p className="text-muted-foreground text-xs font-medium">Adopted Signature</p>
                  <div className="my-2 flex min-h-[48px] items-center justify-center">
                    <span
                      className={cn(
                        'text-foreground text-2xl select-none',
                        signatureFont === 'serif' && 'font-medium tracking-wide italic',
                        signatureFont === 'script' && 'font-medium tracking-widest italic',
                        signatureFont === 'sans' && 'font-semibold tracking-tight',
                      )}
                    >
                      {signerName}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center justify-center gap-1.5 font-mono text-xs">
                    <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>256-Bit eIDAS &amp; U.S. ESIGN Compliant</span>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <label className="text-muted-foreground flex cursor-pointer items-start gap-2.5 text-xs">
                  <input
                    type="checkbox"
                    checked={eConsentAgreed}
                    disabled={isSigned}
                    onChange={(e) => setEConsentAgreed(e.target.checked)}
                    className="text-primary focus:ring-ring border-border mt-0.5 size-4 rounded"
                  />
                  <span>
                    I agree to transact electronically and execute this Master Services Agreement (#MSA-2026-4892) as a
                    legally binding instrument.
                  </span>
                </label>

                {/* Main Execution Button */}
                <div className="space-y-2 pt-2">
                  {!isSigned ? (
                    <Button
                      type="button"
                      className="w-full gap-2 text-sm font-semibold shadow-xs transition-all"
                      disabled={!canSign}
                      onClick={signContract}
                    >
                      <PenTool className="size-4" />
                      <span>Sign &amp; Execute Agreement</span>
                    </Button>
                  ) : (
                    <div className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-4" />
                        <span>Contract Executed Successfully!</span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Countersigned MSA certificate dispatched to David Chen (CTO) and Elena Rostova.
                      </p>
                      <Button
                        aria-label="Download attachment"
                        size="sm"
                        className="mt-2 w-full gap-1.5 text-xs shadow-xs"
                        onClick={handleDownload}
                      >
                        <Download className="size-3.5" />
                        <span>Download Executed Contract</span>
                      </Button>
                    </div>
                  )}

                  {!isSigned && !canSign && (
                    <p className="text-muted-foreground text-center text-xs">
                      {!initial1Completed || !initial2Completed
                        ? 'Please complete both section initial checkpoints above.'
                        : 'Please check the electronic records consent box.'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Audit Ledger Mini Card */}
            <div className="border-border bg-card/60 text-muted-foreground space-y-1.5 rounded-lg border p-3 text-xs">
              <div className="text-foreground flex items-center gap-1.5 font-medium">
                <Lock className="text-primary size-3.5" />
                <span>Tamper-Proof Audit Trail Ledger</span>
              </div>
              <p className="leading-relaxed">
                Every initial checkpoint and signature event is stamped with SHA-256 integrity hash, RFC 3161 timestamp,
                and recorded in the permanent contract execution audit trail.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default FreelanceWorkForHireContract
