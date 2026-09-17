'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  AlertCircle,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Download,
  Lock,
  Pen,
  PenTool,
  Printer,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface LeaseAgreementSignProps {
  className?: string
  initialSigned?: boolean
  initialInitialsCompleted?: boolean
}

export function LeaseAgreementSign({
  className,
  initialSigned = false,
  initialInitialsCompleted = false,
}: LeaseAgreementSignProps) {
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

  const signAgreement = () => {
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
    const el = document.getElementById('react-initial-marker-1')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const scrollToInitial2 = () => {
    const el = document.getElementById('react-initial-marker-2')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div data-slot="lease-agreement-sign" className={cn('bg-background text-foreground w-full', className)}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Top Header */}
        <header className="border-border bg-card mb-6 rounded-xl border p-5 shadow-xs sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">Agreement Ref:</span>
                <span className="text-foreground font-mono text-xs font-semibold tabular-nums">#LSA-2026-44B</span>
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
                    className="gap-1.5 border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-700 dark:text-blue-400"
                  >
                    <PenTool className="size-3.5" />
                    <span>Ready for Tenant Signature</span>
                  </Badge>
                ) : (
                  <Badge
                    wrap
                    className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
                  >
                    <AlertCircle className="size-3.5" />
                    <span>
                      Action Required &bull; {(initial1Completed ? 0 : 1) + (initial2Completed ? 0 : 1)} Signatures
                      Needed
                    </span>
                  </Badge>
                )}
              </div>
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                Residential Lease Agreement &bull; 12-Month Term
              </h1>
              <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <Building2 className="size-4 shrink-0" />
                <span>Unit 4B &bull; 742 Evergreen Terrace, Springfield, OR 97477</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePrint}>
                <Printer className="size-4" />
                <span>Print</span>
              </Button>
              <Button
                aria-label="Download attachment"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={handleDownload}
              >
                <Download className="size-4" />
                <span>{downloadSuccess ? 'Downloading PDF...' : 'Download Draft PDF'}</span>
              </Button>
              {isSigned && (
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

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Legal Lease Document */}
          <main className="space-y-6 lg:col-span-8">
            <div className="border-border bg-card rounded-xl border p-6 shadow-xs sm:p-8">
              {/* Document Title Bar */}
              <div className="border-border border-b pb-6 text-center">
                <Badge wrap variant="outline" className="font-mono text-xs tracking-widest uppercase">
                  Official Real Estate Contract
                </Badge>
                <h2 className="text-foreground mt-3 text-lg font-bold tracking-tight uppercase sm:text-xl">
                  Standard Residential Lease Agreement
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  State of Oregon &bull; Multnomah County &bull; Governing Statute: ORS Chapter 90
                </p>
              </div>

              {/* Lease Summary Terms Box */}
              <div className="my-6">
                <div className="bg-muted/40 border-border rounded-lg border p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-foreground text-xs font-semibold tracking-wider uppercase">
                      Key Financial &amp; Term Summary
                    </h3>
                    <Badge wrap variant="secondary" className="font-mono text-xs">
                      Fixed-Term
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="border-border/60 bg-card rounded-md border p-3">
                      <p className="text-muted-foreground text-xs font-medium">Monthly Rent</p>
                      <p className="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">$3,450.00</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">Due 1st of month</p>
                    </div>
                    <div className="border-border/60 bg-card rounded-md border p-3">
                      <p className="text-muted-foreground text-xs font-medium">Lease Duration</p>
                      <p className="text-foreground mt-1 text-xs font-bold sm:text-sm">12 Months</p>
                      <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                        Sep 01, 2026 – Aug 31, 2027
                      </p>
                    </div>
                    <div className="border-border/60 bg-card rounded-md border p-3">
                      <p className="text-muted-foreground text-xs font-medium">Security Deposit</p>
                      <p className="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">$3,450.00</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">Escrow Trust Acct</p>
                    </div>
                    <div className="border-border/60 bg-card rounded-md border p-3">
                      <p className="text-muted-foreground text-xs font-medium">Pet Policy</p>
                      <p className="text-foreground mt-1 text-xs font-bold sm:text-sm">Approved - 1 Dog</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">$50/mo pet rent</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Sections */}
              <div className="text-foreground/90 space-y-8 text-xs leading-relaxed sm:text-sm">
                {/* Section 1: Parties & Premises */}
                <section id="section-1" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      01
                    </span>
                    <h3 className="text-foreground text-sm font-bold sm:text-base">
                      Parties, Premises &amp; Occupancy
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    This Residential Lease Agreement (the &ldquo;Agreement&rdquo;) is entered into on this 21st day of
                    August, 2026, by and between:
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="border-border bg-muted/20 rounded-lg border p-3.5">
                      <p className="text-foreground text-xs font-semibold tracking-wider uppercase">
                        Landlord / Lessor
                      </p>
                      <p className="text-foreground mt-1 font-medium">Evergreen Heritage Holdings LLC</p>
                      <p className="text-muted-foreground text-xs">Managing Agent: Marcus Vance, CPM</p>
                      <p className="text-muted-foreground font-mono text-xs">
                        Lic #OR-994201 &bull; info@evergreenhh.com
                      </p>
                    </div>
                    <div className="border-border bg-muted/20 rounded-lg border p-3.5">
                      <p className="text-foreground text-xs font-semibold tracking-wider uppercase">Tenant / Lessee</p>
                      <p className="text-foreground mt-1 font-medium">Elena Rostova</p>
                      <p className="text-muted-foreground text-xs">Primary Occupant</p>
                      <p className="text-muted-foreground text-xs">elena.rostova@example.com &bull; (555) 234-5678</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    <strong>Premises Description:</strong> Landlord hereby leases to Tenant the residential real
                    property situated at <strong>Unit 4B, 742 Evergreen Terrace, Springfield, OR 97477</strong>,
                    comprising 2 Bedrooms, 2 Full Bathrooms (approx. 1,120 sq ft), together with designated covered
                    parking stall #42 and storage locker #S-14.
                  </p>
                </section>

                <Separator />

                {/* Section 2: Rent Payment & Late Fees */}
                <section id="section-2" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      02
                    </span>
                    <h3 className="text-foreground text-sm font-bold sm:text-base">
                      Rent Payment Schedule &amp; Late Fees
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Tenant agrees to pay Landlord the base monthly rent of{' '}
                    <strong className="text-foreground font-mono tabular-nums">$3,450.00 USD</strong> plus{' '}
                    <strong className="text-foreground font-mono tabular-nums">$50.00 USD</strong> monthly pet rent, for
                    an aggregate monthly payment of{' '}
                    <strong className="text-foreground font-mono tabular-nums">$3,500.00 USD</strong>, due on or before
                    the first (1st) day of each calendar month.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Grace Period &amp; Penalties:</strong> A grace period is provided through 11:59 PM PST on
                    the fifth (5th) day of the month. If rent is not received in full by 12:00 AM on the sixth (6th)
                    calendar day, a statutory late fee of{' '}
                    <strong className="text-foreground font-mono tabular-nums">$75.00 USD</strong> shall immediately
                    apply, plus an additional charge of{' '}
                    <strong className="text-foreground font-mono tabular-nums">$10.00 USD per day</strong> until the
                    delinquent balance is satisfied in full.
                  </p>

                  {/* Initial Marker 1 */}
                  <div
                    id="react-initial-marker-1"
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
                            Tenant Initial Requirement &bull; Section 2
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
                          Acknowledge and agree to the $3,450.00 rent schedule, ACH delivery, and $75.00 late assessment
                          clauses.
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isSigned}
                        variant={initial1Completed ? 'outline' : 'default'}
                        className={cn(
                          'shrink-0 gap-2 text-xs font-medium transition-all',
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

                {/* Section 3: Maintenance & Occupancy Rules */}
                <section id="section-3" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      03
                    </span>
                    <h3 className="text-foreground text-sm font-bold sm:text-base">
                      Maintenance, Utilities &amp; Occupancy Rules
                    </h3>
                  </div>
                  <ul className="text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                      <span>
                        <strong className="text-foreground">Quiet Hours:</strong> Community quiet hours are strictly
                        enforced between 10:00 PM and 7:00 AM daily.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                      <span>
                        <strong className="text-foreground">HVAC Maintenance:</strong> Tenant shall replace HVAC air
                        filters every 90 calendar days. Replacement filters are provided free of charge at property
                        management.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                      <span>
                        <strong className="text-foreground">Guest Policy:</strong> Guests staying exceeding 14
                        consecutive calendar days require written authorization from property management.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                      <span>
                        <strong className="text-foreground">Utilities Allocation:</strong> Landlord pays municipal
                        water, sewer, and storm drainage. Tenant is responsible for electricity (PGE), gas (NW Natural),
                        and high-speed internet.
                      </span>
                    </li>
                  </ul>
                </section>

                <Separator />

                {/* Section 4: Termination & Move-out Notice */}
                <section id="section-4" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      04
                    </span>
                    <h3 className="text-foreground text-sm font-bold sm:text-base">
                      Termination, Renewal &amp; Move-Out Notice
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Either party may terminate or request non-renewal of this lease by delivering a formal written
                    notice at least <strong>sixty (60) calendar days</strong> prior to the lease expiration date of
                    August 31, 2027.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Move-Out &amp; Carpet Certification:</strong> Upon vacating the premises, Tenant shall
                    return all building keys (2 unit keys, 1 mailbox key, 1 garage fob) and furnish a paid receipt from
                    a licensed professional carpet cleaning service. A joint walk-through inspection will be conducted
                    within 72 hours of key surrender.
                  </p>

                  {/* Initial Marker 2 */}
                  <div
                    id="react-initial-marker-2"
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
                            Tenant Initial Requirement &bull; Section 4
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
                          Acknowledge the 60-day written move-out notice requirement and professional carpet cleaning
                          obligation.
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isSigned}
                        variant={initial2Completed ? 'outline' : 'default'}
                        className={cn(
                          'shrink-0 gap-2 text-xs font-medium transition-all',
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

                {/* Document Signatures Execution Box */}
                <section className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-foreground text-sm font-bold sm:text-base">Execution &amp; Legal Signatures</h3>
                    <span className="text-muted-foreground font-mono text-xs">2 of 2 Parties</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Landlord Signature Block */}
                    <div className="border-border bg-muted/20 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-foreground text-xs font-semibold tracking-wider uppercase">
                          Landlord Signature
                        </p>
                        <Badge
                          wrap
                          variant="outline"
                          className="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
                        >
                          <Check className="mr-1 size-3" /> Signed
                        </Badge>
                      </div>
                      <div className="border-border/60 bg-card my-3 rounded-md border p-3 text-center">
                        <p className="text-xl font-medium tracking-wide text-emerald-800 italic dark:text-emerald-300">
                          Marcus Vance
                        </p>
                        <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                          Agent for Evergreen Holdings LLC
                        </p>
                      </div>
                      <div className="text-muted-foreground space-y-1 font-mono text-xs">
                        <p className="flex justify-between">
                          <span>Date Signed:</span>
                          <span className="text-foreground font-semibold tabular-nums">
                            Aug 20, 2026 &bull; 09:15 PDT
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>Certificate ID:</span>
                          <span className="text-foreground font-semibold">DS-EHG-8842-MV</span>
                        </p>
                      </div>
                    </div>

                    {/* Tenant Signature Block */}
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
                          Tenant Signature
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
                              e-Signed via DocuSign / UIPKGE Registry
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-muted-foreground text-xs italic">
                              Awaiting signature execution via right sidebar
                            </p>
                            <p className="text-muted-foreground/80 mt-1 text-xs">
                              Complete 2 initials above to enable signing
                            </p>
                          </>
                        )}
                      </div>

                      <div className="text-muted-foreground space-y-1 font-mono text-xs">
                        <p className="flex justify-between">
                          <span>Date Signed:</span>
                          <span className="text-foreground font-semibold tabular-nums">
                            {isSigned ? 'Aug 21, 2026 • 10:44 PDT' : 'Pending'}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>Digital Audit Hash:</span>
                          <span className="text-foreground font-semibold">
                            {isSigned ? 'SHA256:7f83b1...9069' : 'Unsigned'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </main>

          {/* Right Column: Sticky Signature Action Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-6 lg:col-span-4 lg:self-start">
            {/* Signer Identity Card */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full font-bold">
                      ER
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{signerName}</CardTitle>
                      <CardDescription className="text-xs">Primary Lessee &bull; Tenant</CardDescription>
                    </div>
                  </div>
                  <Badge wrap variant="outline" className="border-primary/30 text-primary font-mono text-xs">
                    Signer 1/1
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2 p-4 pt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground font-medium">elena.rostova@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auth Level:</span>
                  <span className="text-foreground font-medium">SMS 2FA Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IP Session:</span>
                  <span className="text-foreground font-mono tabular-nums">198.51.100.42 (TLS 1.3)</span>
                </div>
              </CardContent>
            </Card>

            {/* Signature Required Checklist */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Required Action Checklist</CardTitle>
                  <Badge
                    wrap
                    variant={completedCount === 3 ? 'default' : 'secondary'}
                    className="font-mono text-xs tabular-nums"
                  >
                    {completedCount} / 3 Done
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  All initial markers must be completed prior to signing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 p-4 pt-2">
                {/* Item 1 */}
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
                      <p className="text-foreground font-medium">Initial Section 2 (Rent &amp; Fees)</p>
                      <p className="text-muted-foreground text-xs">Acknowledges $3,450 rent &amp; late charges</p>
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
                    {initial1Completed ? 'Done' : 'Click to jump'}
                  </Badge>
                </button>

                {/* Item 2 */}
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
                      <p className="text-foreground font-medium">Initial Section 4 (Move-Out)</p>
                      <p className="text-muted-foreground text-xs">Acknowledges 60-day notice &amp; cleaning</p>
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
                    {initial2Completed ? 'Done' : 'Click to jump'}
                  </Badge>
                </button>

                {/* Item 3 */}
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
                      <p className="text-foreground font-medium">Sign Full Agreement</p>
                      <p className="text-muted-foreground text-xs">Execute legal lease contract</p>
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

            {/* Signature Pad / Typography Box */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold">Electronic Signature Preview</CardTitle>
                <CardDescription className="text-xs">Adopt your legal signature typography</CardDescription>
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
                    <span>256-Bit eIDAS / ESIGN Certified</span>
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
                    I agree to transact electronically and confirm this electronic signature legally binds me under U.S.
                    ESIGN Act and ORS Chapter 90.
                  </span>
                </label>

                {/* Main Execution Button */}
                <div className="space-y-2 pt-2">
                  {!isSigned ? (
                    <Button
                      type="button"
                      className="w-full gap-2 text-sm font-semibold shadow-xs transition-all"
                      disabled={!canSign}
                      onClick={signAgreement}
                    >
                      <PenTool className="size-4" />
                      <span>Sign &amp; Finalize Agreement</span>
                    </Button>
                  ) : (
                    <div className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-4" />
                        <span>Lease Executed Successfully!</span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        A copy of the countersigned PDF has been securely dispatched to your verified email.
                      </p>
                      <Button
                        aria-label="Download attachment"
                        size="sm"
                        className="mt-2 w-full gap-1.5 text-xs"
                        onClick={handleDownload}
                      >
                        <Download className="size-3.5" />
                        <span>Download Signed PDF</span>
                      </Button>
                    </div>
                  )}

                  {!isSigned && !canSign && (
                    <p className="text-muted-foreground text-center text-xs">
                      {!initial1Completed || !initial2Completed
                        ? 'Please complete all initial checkpoints above before signing.'
                        : 'Please check the electronic consent box.'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Audit Log Mini Card */}
            <div className="border-border bg-card/60 text-muted-foreground space-y-1.5 rounded-lg border p-3 text-xs">
              <div className="text-foreground flex items-center gap-1.5 font-medium">
                <Lock className="text-primary size-3.5" />
                <span>Cryptographic Tamper-Proof Audit Trail</span>
              </div>
              <p className="leading-relaxed">
                Every initial and signature event is stamped with SHA-256 integrity hash, RFC 3161 trusted timestamp,
                and logged in the immutable lease registry ledger.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
