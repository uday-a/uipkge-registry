'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import {
  AlertCircle,
  BadgeCheck,
  Check,
  CheckCircle2,
  Download,
  FileCheck,
  Gavel,
  Lock,
  PenTool,
  Printer,
  RotateCcw,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export type AgreementType = 'mutual' | 'unilateral'
export type TermOption = '2 Years' | '3 Years' | '5 Years' | 'Perpetual for Trade Secrets'
export type JurisdictionOption = 'delaware' | 'california' | 'newyork' | 'england' | 'singapore'
export type SignatureFont = 'serif' | 'script' | 'sans'

export interface NdaAgreementGeneratorProps {
  className?: string
  initialSigned?: boolean
  initialAgreementType?: AgreementType
  initialTerm?: TermOption
  initialJurisdiction?: JurisdictionOption
}

const jurisdictionMap: Record<JurisdictionOption, { name: string; statute: string; venue: string; tag: string }> = {
  delaware: {
    name: 'State of Delaware, United States',
    statute: 'General Corporation Law of Delaware (DGCL) & Court of Chancery',
    venue: 'Wilmington, Delaware, USA',
    tag: 'US-DE',
  },
  california: {
    name: 'State of California, United States',
    statute: 'California Uniform Trade Secrets Act (Cal. Civ. Code § 3426)',
    venue: 'San Francisco, California, USA',
    tag: 'US-CA',
  },
  newyork: {
    name: 'State of New York, United States',
    statute: 'New York Commercial Division Jurisprudence & General Obligations Law',
    venue: 'New York, New York, USA',
    tag: 'US-NY',
  },
  england: {
    name: 'England & Wales, United Kingdom',
    statute: 'Laws of England and Wales & High Court of Justice (Commercial Court)',
    venue: 'London, United Kingdom',
    tag: 'UK-EW',
  },
  singapore: {
    name: 'Republic of Singapore (SIAC)',
    statute: 'International Arbitration Act & Singapore International Arbitration Centre',
    venue: 'Singapore (SIAC Rules)',
    tag: 'SG-SIAC',
  },
}

export function NdaAgreementGenerator({
  className,
  initialSigned = false,
  initialAgreementType = 'mutual',
  initialTerm = '3 Years',
  initialJurisdiction = 'delaware',
}: NdaAgreementGeneratorProps) {
  // Generator State
  const [agreementType, setAgreementType] = useState<AgreementType>(initialAgreementType)
  const [jurisdiction, setJurisdiction] = useState<JurisdictionOption>(initialJurisdiction)
  const [confidentialityTerm, setConfidentialityTerm] = useState<TermOption>(initialTerm)

  // Parties State
  const [disclosingCompany, setDisclosingCompany] = useState('UIPKGE Technologies Inc.')
  const [disclosingSignatory, setDisclosingSignatory] = useState('Sarah Jenkins')
  const [disclosingTitle, setDisclosingTitle] = useState('VP of Architecture & Ecosystem')
  const [disclosingEmail] = useState('s.jenkins@uipkge.dev')

  const [receivingCompany, setReceivingCompany] = useState('Vertex Solutions Corp.')
  const [receivingSignatory, setReceivingSignatory] = useState('Marcus Vance')
  const [receivingTitle, setReceivingTitle] = useState('Chief Technology Officer')
  const [receivingEmail] = useState('marcus.vance@vertexsolutions.io')

  const [purposeOfDisclosure, setPurposeOfDisclosure] = useState(
    'Evaluation of potential architectural partnership, proprietary registry protocols, and API integration.',
  )

  // Protective Clauses Toggles
  const [clauseNonSolicit, setClauseNonSolicit] = useState(true)
  const [clauseInjunctiveRelief, setClauseInjunctiveRelief] = useState(true)
  const [clauseReturnMaterials, setClauseReturnMaterials] = useState(true)
  const [clausePermittedDisclosures, setClausePermittedDisclosures] = useState(true)

  // Signature State
  const [isSigned, setIsSigned] = useState(initialSigned)
  const [signatureFont, setSignatureFont] = useState<SignatureFont>('serif')
  const [signerName, setSignerName] = useState('Marcus Vance')
  const [eConsentAgreed, setEConsentAgreed] = useState(true)
  const [downloadStatus, setDownloadStatus] = useState(false)
  const [draftSavedStatus, setDraftSavedStatus] = useState(false)

  const currentJurisdiction = jurisdictionMap[jurisdiction]

  const termText = useMemo(() => {
    switch (confidentialityTerm) {
      case '2 Years':
        return 'two (2) years from the Effective Date'
      case '3 Years':
        return 'three (3) years from the Effective Date'
      case '5 Years':
        return 'five (5) years from the Effective Date'
      case 'Perpetual for Trade Secrets':
        return 'five (5) years for general Confidential Information, and perpetually for all source code, cryptographic primitives, and core trade secrets'
      default:
        return 'three (3) years from the Effective Date'
    }
  }, [confidentialityTerm])

  const activeClausesCount =
    (clauseNonSolicit ? 1 : 0) +
    (clauseInjunctiveRelief ? 1 : 0) +
    (clauseReturnMaterials ? 1 : 0) +
    (clausePermittedDisclosures ? 1 : 0)

  const canSign = eConsentAgreed && signerName.trim().length > 0 && !isSigned

  const signAgreement = () => {
    if (!canSign) return
    setIsSigned(true)
  }

  const resetWorkflow = () => {
    setIsSigned(false)
    setDownloadStatus(false)
    setDraftSavedStatus(false)
  }

  const handleSaveDraft = () => {
    setDraftSavedStatus(true)
    setTimeout(() => {
      setDraftSavedStatus(false)
    }, 2200)
  }

  const handleExportPdf = () => {
    setDownloadStatus(true)
    setTimeout(() => {
      setDownloadStatus(false)
    }, 2500)
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div data-slot="nda-agreement-generator" className={cn('bg-background text-foreground w-full', className)}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Main Header Bar */}
        <header className="border-border bg-card mb-6 rounded-xl border p-5 shadow-xs sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">Instrument:</span>
                <span className="text-foreground font-mono text-xs font-semibold tabular-nums">#NDA-2026-88F</span>
                <span className="text-muted-foreground text-xs">&bull;</span>
                <Badge variant="outline" className="border-primary/30 text-primary font-mono text-xs">
                  {agreementType === 'mutual' ? 'Mutual / Bilateral' : 'Unilateral'}
                </Badge>
                <span className="text-muted-foreground text-xs">&bull;</span>
                {isSigned ? (
                  <Badge className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <BadgeCheck className="size-3.5" />
                    <span>Fully Executed &amp; Legally Binding</span>
                  </Badge>
                ) : (
                  <Badge className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <AlertCircle className="size-3.5" />
                    <span>Ready for E-Signature</span>
                  </Badge>
                )}
              </div>
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                Non-Disclosure Agreement (NDA) Generator
              </h1>
              <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <Scale className="size-4 shrink-0" />
                <span>Governing Jurisdiction: {currentJurisdiction.name} &bull; Effective Aug 21, 2026</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePrint}>
                <Printer className="size-4" />
                <span>Print</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleSaveDraft}>
                <FileCheck className="size-4" />
                <span>{draftSavedStatus ? 'Draft Saved ✓' : 'Save Draft'}</span>
              </Button>
              <Button
                aria-label="Download attachment"
                size="sm"
                className="gap-1.5 text-xs font-semibold shadow-xs"
                variant={isSigned ? 'default' : 'outline'}
                onClick={handleExportPdf}
              >
                <Download className="size-4" />
                <span>
                  {downloadStatus ? 'Exporting PDF...' : isSigned ? 'Export Signed PDF' : 'Download Draft PDF'}
                </span>
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

          <Separator className="my-4" />

          {/* Quick Parameter Switches in Header */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Agreement Type Toggle */}
            <div className="bg-muted/40 border-border rounded-lg border p-3">
              <label className="text-muted-foreground block text-xs font-medium">Agreement Type</label>
              <div className="bg-muted/60 mt-2 grid grid-cols-2 gap-1 rounded-md p-0.5">
                <button
                  type="button"
                  className={cn(
                    'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                    agreementType === 'mutual'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setAgreementType('mutual')}
                >
                  Mutual (Bilateral)
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                    agreementType === 'unilateral'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setAgreementType('unilateral')}
                >
                  Unilateral
                </button>
              </div>
            </div>

            {/* Jurisdiction Selector */}
            <div className="bg-muted/40 border-border rounded-lg border p-3">
              <label className="text-muted-foreground block text-xs font-medium">Governing Jurisdiction</label>
              <div className="mt-2">
                <Select value={jurisdiction} onValueChange={(val) => setJurisdiction(val as JurisdictionOption)}>
                  <SelectTrigger size="sm" className="bg-card h-8 text-xs font-medium">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delaware">Delaware, USA</SelectItem>
                    <SelectItem value="california">California, USA</SelectItem>
                    <SelectItem value="newyork">New York, USA</SelectItem>
                    <SelectItem value="england">England &amp; Wales, UK</SelectItem>
                    <SelectItem value="singapore">Singapore (SIAC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Term of Protection */}
            <div className="bg-muted/40 border-border rounded-lg border p-3">
              <label className="text-muted-foreground block text-xs font-medium">Protection Term</label>
              <div className="mt-2">
                <Select value={confidentialityTerm} onValueChange={(val) => setConfidentialityTerm(val as TermOption)}>
                  <SelectTrigger size="sm" className="bg-card h-8 text-xs font-medium">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2 Years">2 Years</SelectItem>
                    <SelectItem value="3 Years">3 Years (Standard)</SelectItem>
                    <SelectItem value="5 Years">5 Years</SelectItem>
                    <SelectItem value="Perpetual for Trade Secrets">Perpetual (Trade Secrets)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Protective Clauses Summary */}
            <div className="bg-muted/40 border-border rounded-lg border p-3">
              <label className="text-muted-foreground block text-xs font-medium">Active Protective Covenants</label>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-foreground text-xs font-semibold">{activeClausesCount} of 4 Clauses Active</span>
                <Badge variant="secondary" className="font-mono text-xs tabular-nums">
                  {Math.round((activeClausesCount / 4) * 100)}% Coverage
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* 2-Column Document Builder & Live Parchment Canvas */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Builder, Clauses, Parties Form (40%) */}
          <aside className="space-y-6 lg:col-span-5">
            {/* Contracting Parties Card */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md font-bold">
                      <Users className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">Contracting Parties</CardTitle>
                      <CardDescription className="text-xs">
                        Entities bound under this confidentiality covenants
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    2 Legal Entities
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 pt-2 sm:p-5 sm:pt-2">
                {/* Disclosing Party */}
                <div className="border-border/80 bg-muted/20 space-y-2.5 rounded-lg border p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground text-xs font-medium">Party A &bull; Disclosing Entity</span>
                    <Badge variant="secondary" className="text-xs">
                      Original Licensor
                    </Badge>
                  </div>
                  <div>
                    <label className="text-muted-foreground block text-xs font-medium">Company Legal Name</label>
                    <Input
                      value={disclosingCompany}
                      onChange={(e) => setDisclosingCompany(e.target.value)}
                      size="small"
                      className="mt-1"
                      placeholder="e.g. UIPKGE Technologies Inc."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-muted-foreground block text-xs font-medium">Authorized Signatory</label>
                      <Input
                        value={disclosingSignatory}
                        onChange={(e) => setDisclosingSignatory(e.target.value)}
                        size="small"
                        className="mt-1"
                        placeholder="e.g. Sarah Jenkins"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground block text-xs font-medium">Corporate Title</label>
                      <Input
                        value={disclosingTitle}
                        onChange={(e) => setDisclosingTitle(e.target.value)}
                        size="small"
                        className="mt-1"
                        placeholder="e.g. VP of Architecture"
                      />
                    </div>
                  </div>
                </div>

                {/* Receiving Party */}
                <div className="border-border/80 bg-muted/20 space-y-2.5 rounded-lg border p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground text-xs font-medium">Party B &bull; Receiving Entity</span>
                    <Badge variant="secondary" className="text-xs">
                      Counterparty
                    </Badge>
                  </div>
                  <div>
                    <label className="text-muted-foreground block text-xs font-medium">Recipient Company Name</label>
                    <Input
                      value={receivingCompany}
                      onChange={(e) => setReceivingCompany(e.target.value)}
                      size="small"
                      className="mt-1"
                      placeholder="e.g. Vertex Solutions Corp."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-muted-foreground block text-xs font-medium">Recipient Signatory</label>
                      <Input
                        value={receivingSignatory}
                        onChange={(e) => setReceivingSignatory(e.target.value)}
                        size="small"
                        className="mt-1"
                        placeholder="e.g. Marcus Vance"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground block text-xs font-medium">Corporate Title</label>
                      <Input
                        value={receivingTitle}
                        onChange={(e) => setReceivingTitle(e.target.value)}
                        size="small"
                        className="mt-1"
                        placeholder="e.g. Chief Technology Officer"
                      />
                    </div>
                  </div>
                </div>

                {/* Purpose Statement */}
                <div>
                  <label className="text-foreground block text-xs font-semibold">
                    Authorized Purpose of Disclosure
                  </label>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Defines the strict commercial boundary for information exchange
                  </p>
                  <Input
                    value={purposeOfDisclosure}
                    onChange={(e) => setPurposeOfDisclosure(e.target.value)}
                    size="middle"
                    className="mt-1.5 font-mono text-xs"
                    placeholder="e.g. Evaluation of architectural partnership..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Standard Clauses Customizer */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md font-bold">
                      <Gavel className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold">Standard Legal Covenants</CardTitle>
                      <CardDescription className="text-xs">
                        Toggle and enforce protective clauses in real time
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    Custom Covenants
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3.5 p-4 pt-2 sm:p-5 sm:pt-2">
                {/* Clause 1: Non-Solicitation */}
                <div className="border-border/80 bg-card hover:bg-muted/20 flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-foreground text-xs font-semibold">1. Non-Solicitation of Employees</p>
                      <Badge variant="secondary" className="text-xs">
                        12 Months
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Restricts either party from directly soliciting, recruiting, or hiring key technical personnel and
                      architects.
                    </p>
                  </div>
                  <Switch
                    checked={clauseNonSolicit}
                    onCheckedChange={setClauseNonSolicit}
                    aria-label="Toggle Non-Solicitation Clause"
                  />
                </div>

                {/* Clause 2: Injunctive Relief */}
                <div className="border-border/80 bg-card hover:bg-muted/20 flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-foreground text-xs font-semibold">2. Injunctive &amp; Equitable Relief</p>
                      <Badge variant="secondary" className="text-xs">
                        No Bond Required
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Stipulates that breach causes irreparable harm, entitling Disclosing Party to emergency
                      restraining orders without posting a bond.
                    </p>
                  </div>
                  <Switch
                    checked={clauseInjunctiveRelief}
                    onCheckedChange={setClauseInjunctiveRelief}
                    aria-label="Toggle Injunctive Relief Clause"
                  />
                </div>

                {/* Clause 3: Return of Materials */}
                <div className="border-border/80 bg-card hover:bg-muted/20 flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-foreground text-xs font-semibold">3. Return &amp; Certified Destruction</p>
                      <Badge variant="secondary" className="text-xs">
                        14 Calendar Days
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Mandates formal return or certified cryptographic shredding of all confidential technical assets
                      within 14 days of request.
                    </p>
                  </div>
                  <Switch
                    checked={clauseReturnMaterials}
                    onCheckedChange={setClauseReturnMaterials}
                    aria-label="Toggle Return of Materials Clause"
                  />
                </div>

                {/* Clause 4: Permitted Disclosures */}
                <div className="border-border/80 bg-card hover:bg-muted/20 flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-foreground text-xs font-semibold">4. Permitted Compelled Disclosures</p>
                      <Badge variant="secondary" className="text-xs">
                        Subpoena Carve-Out
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Carves out court order / statutory subpoena compliance with mandatory prompt written notification
                      to the other party.
                    </p>
                  </div>
                  <Switch
                    checked={clausePermittedDisclosures}
                    onCheckedChange={setClausePermittedDisclosures}
                    aria-label="Toggle Permitted Disclosures Clause"
                  />
                </div>
              </CardContent>
            </Card>

            {/* E-Signature Pad Execution Card */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md font-bold">
                      <PenTool className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold">Electronic Signature Pad</CardTitle>
                      <CardDescription className="text-xs">
                        Adopt official digital signature style for execution
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={isSigned ? 'default' : 'outline'} className="font-mono text-xs">
                    {isSigned ? 'Executed' : 'Signer 2/2'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 pt-2 sm:p-5 sm:pt-2">
                {/* Signer Name Input */}
                <div>
                  <label className="text-foreground block text-xs font-medium">Recipient Signatory Full Name</label>
                  <Input
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    disabled={isSigned}
                    size="middle"
                    className="mt-1"
                    placeholder="e.g. Marcus Vance"
                  />
                </div>

                {/* Signature Style Picker */}
                <div>
                  <label className="text-muted-foreground block text-xs font-medium">Adopted Typography Style</label>
                  <div className="bg-muted/60 mt-1.5 grid grid-cols-3 gap-1 rounded-lg p-1">
                    <button
                      type="button"
                      disabled={isSigned}
                      className={cn(
                        'rounded-md py-1.5 text-center text-xs font-medium transition-colors',
                        signatureFont === 'serif'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                        isSigned && 'cursor-not-allowed opacity-60',
                      )}
                      onClick={() => setSignatureFont('serif')}
                    >
                      Formal Serif
                    </button>
                    <button
                      type="button"
                      disabled={isSigned}
                      className={cn(
                        'rounded-md py-1.5 text-center text-xs font-medium transition-colors',
                        signatureFont === 'script'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                        isSigned && 'cursor-not-allowed opacity-60',
                      )}
                      onClick={() => setSignatureFont('script')}
                    >
                      Script Elegance
                    </button>
                    <button
                      type="button"
                      disabled={isSigned}
                      className={cn(
                        'rounded-md py-1.5 text-center text-xs font-medium transition-colors',
                        signatureFont === 'sans'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                        isSigned && 'cursor-not-allowed opacity-60',
                      )}
                      onClick={() => setSignatureFont('sans')}
                    >
                      Modern Sans
                    </button>
                  </div>
                </div>

                {/* Visual Preview Box */}
                <div className="border-border bg-muted/20 relative rounded-lg border p-4 text-center">
                  <p className="text-muted-foreground text-xs font-medium">Adopted Signature Preview</p>
                  <div className="my-3 flex min-h-[52px] items-center justify-center">
                    <span
                      className={cn(
                        'text-foreground text-2xl transition-all select-none',
                        signatureFont === 'serif' && 'font-medium tracking-wide italic',
                        signatureFont === 'script' && 'font-medium tracking-widest italic',
                        signatureFont === 'sans' && 'font-semibold tracking-tight',
                      )}
                    >
                      {signerName || 'Marcus Vance'}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center justify-center gap-1.5 font-mono text-xs">
                    <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>256-Bit eIDAS / ESIGN Act Compliant</span>
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
                  <span className="leading-relaxed">
                    I agree to execute this Non-Disclosure Agreement electronically and confirm my electronic signature
                    legally binds <strong>{receivingCompany}</strong> under the U.S. ESIGN Act and{' '}
                    {currentJurisdiction.name}.
                  </span>
                </label>

                {/* Main Execution Action Button */}
                <div className="space-y-2 pt-1">
                  {!isSigned ? (
                    <Button
                      type="button"
                      className="w-full gap-2 text-sm font-semibold shadow-xs"
                      disabled={!canSign}
                      onClick={signAgreement}
                    >
                      <PenTool className="size-4" />
                      <span>Sign &amp; Execute Agreement</span>
                    </Button>
                  ) : (
                    <div className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-4" />
                        <span>Agreement Digitally Executed!</span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Both parties have countersigned this NDA. Cryptographic SHA-256 certificate has been logged in
                        the audit trail.
                      </p>
                      <Button
                        aria-label="Download attachment"
                        size="sm"
                        className="mt-2 w-full gap-1.5 text-xs"
                        onClick={handleExportPdf}
                      >
                        <Download className="size-3.5" />
                        <span>Export Countersigned PDF</span>
                      </Button>
                    </div>
                  )}

                  {!isSigned && !canSign && (
                    <p className="text-muted-foreground text-center text-xs">
                      {!eConsentAgreed
                        ? 'Please check the legal electronic consent box to proceed.'
                        : 'Please provide a valid signatory name.'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Audit Log Miniature Card */}
            <div className="border-border bg-card/60 text-muted-foreground space-y-1.5 rounded-lg border p-3.5 text-xs shadow-xs">
              <div className="text-foreground flex items-center gap-1.5 font-semibold">
                <Lock className="text-primary size-3.5" />
                <span>Immutable Legal Audit Ledger</span>
              </div>
              <p className="leading-relaxed">
                Every clause configuration and signature execution generates a tamper-evident SHA-256 cryptographic
                digest with RFC 3161 trusted timestamping.
              </p>
            </div>
          </aside>

          {/* Right Column: Live Document Parchment Canvas (60%) */}
          <main className="space-y-6 lg:col-span-7">
            <div className="border-border bg-card rounded-xl border p-6 shadow-xs sm:p-8 lg:p-10">
              {/* Document Title Bar */}
              <div className="border-border border-b pb-6 text-center">
                <Badge variant="outline" className="font-mono text-xs tracking-widest uppercase">
                  Official Legal Instrument &bull; {currentJurisdiction.tag}
                </Badge>
                <h2 className="text-foreground mt-3 text-lg font-semibold tracking-tight sm:text-xl lg:text-2xl">
                  {agreementType === 'mutual'
                    ? 'Mutual Non-Disclosure Agreement'
                    : 'Unilateral Non-Disclosure Agreement'}
                </h2>
                <p className="text-muted-foreground mt-1.5 font-mono text-xs">
                  Governing Law: {currentJurisdiction.name} &bull; Ref: #NDA-2026-88F
                </p>
              </div>

              {/* Agreement Key Terms Summary Box */}
              <div className="my-6">
                <div className="bg-muted/40 border-border rounded-lg border p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-foreground text-xs font-semibold">Contract Terms &amp; Scope Summary</h3>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {agreementType === 'mutual' ? 'Bilateral Protection' : 'Unilateral Protection'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="border-border/60 bg-card rounded-md border p-3">
                      <p className="text-muted-foreground text-xs font-medium">Disclosing Party</p>
                      <p className="text-foreground mt-1 truncate text-xs font-bold">{disclosingCompany}</p>
                      <p className="text-muted-foreground mt-0.5 truncate text-xs">{disclosingSignatory}</p>
                    </div>
                    <div className="border-border/60 bg-card rounded-md border p-3">
                      <p className="text-muted-foreground text-xs font-medium">Receiving Party</p>
                      <p className="text-foreground mt-1 truncate text-xs font-bold">{receivingCompany}</p>
                      <p className="text-muted-foreground mt-0.5 truncate text-xs">{receivingSignatory}</p>
                    </div>
                    <div className="border-border/60 bg-card rounded-md border p-3">
                      <p className="text-muted-foreground text-xs font-medium">Protection Term</p>
                      <p className="text-foreground mt-1 text-xs font-bold">{confidentialityTerm}</p>
                      <p className="text-muted-foreground mt-0.5 font-mono text-xs">From Effective Date</p>
                    </div>
                    <div className="border-border/60 bg-card rounded-md border p-3">
                      <p className="text-muted-foreground text-xs font-medium">Exclusive Venue</p>
                      <p className="text-foreground mt-1 truncate text-xs font-bold">
                        {currentJurisdiction.venue.split(',')[0]}
                      </p>
                      <p className="text-muted-foreground mt-0.5 font-mono text-xs">{currentJurisdiction.tag}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Sections Content */}
              <div className="text-foreground/90 space-y-7 text-xs leading-relaxed sm:text-sm">
                {/* Preamble & Recitals */}
                <section className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    This Non-Disclosure Agreement (this &ldquo;Agreement&rdquo;), effective as of the{' '}
                    <strong className="text-foreground">21st day of August, 2026</strong> (&ldquo;Effective
                    Date&rdquo;), is entered into by and between:
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="border-border bg-muted/20 rounded-lg border p-3.5">
                      <p className="text-foreground text-xs font-medium">Disclosing Party (&ldquo;Party A&rdquo;)</p>
                      <p className="text-foreground mt-1 font-bold">{disclosingCompany}</p>
                      <p className="text-muted-foreground text-xs">
                        {disclosingSignatory} &bull; {disclosingTitle}
                      </p>
                      <p className="text-muted-foreground font-mono text-xs">{disclosingEmail}</p>
                    </div>
                    <div className="border-border bg-muted/20 rounded-lg border p-3.5">
                      <p className="text-foreground text-xs font-medium">Receiving Party (&ldquo;Party B&rdquo;)</p>
                      <p className="text-foreground mt-1 font-bold">{receivingCompany}</p>
                      <p className="text-muted-foreground text-xs">
                        {receivingSignatory} &bull; {receivingTitle}
                      </p>
                      <p className="text-muted-foreground font-mono text-xs">{receivingEmail}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    <strong>RECITALS:</strong> WHEREAS, Disclosing Party possesses certain non-public proprietary
                    technology, software architectures, and business data, and Receiving Party desires to receive such
                    information strictly for the purpose of{' '}
                    <strong className="text-foreground not-italic">&ldquo;{purposeOfDisclosure}&rdquo;</strong> (the
                    &ldquo;Authorized Purpose&rdquo;).{' '}
                    {agreementType === 'mutual'
                      ? 'Each party may act as both a Disclosing Party and a Receiving Party under this Agreement.'
                      : ''}
                  </p>
                </section>

                <Separator />

                {/* Section 1: Definition of Confidential Information */}
                <section className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      01
                    </span>
                    <h3 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                      Definition of Confidential Information
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    &ldquo;Confidential Information&rdquo; refers to all non-public, proprietary, or confidential
                    technical and business data disclosed by Disclosing Party to Receiving Party, whether orally,
                    electronically, in writing, or by inspection of tangible objects, including but not limited to:
                    source code, software algorithms, API specifications, component registries, cryptographic tokens,
                    database schemas, product roadmaps, financial forecasts, customer records, and trade secrets.
                  </p>
                </section>

                <Separator />

                {/* Section 2: Non-Disclosure & Duty of Care */}
                <section className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      02
                    </span>
                    <h3 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                      Obligations of Non-Disclosure &amp; Standard of Care
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Receiving Party agrees to maintain the strict confidentiality of all Confidential Information with
                    at least the same degree of care that it uses to protect its own confidential assets of similar
                    nature, but in no event less than a reasonable degree of care. Receiving Party shall:
                  </p>
                  <ul className="text-muted-foreground list-disc space-y-1.5 pl-4">
                    <li>
                      Use Confidential Information solely and exclusively for the Authorized Purpose defined herein.
                    </li>
                    <li>
                      Restrict disclosure strictly to its authorized officers, directors, employees, and legal counsel
                      who have a clear need-to-know and are bound by confidentiality covenants no less stringent than
                      this Agreement.
                    </li>
                    <li>
                      Refrain from reverse engineering, decompiling, or disassembling any software or architectural
                      artifacts provided.
                    </li>
                  </ul>
                </section>

                <Separator />

                {/* Section 3: Exclusions from Confidentiality */}
                <section className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      03
                    </span>
                    <h3 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                      Exclusions from Confidential Treatment
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Confidential Information does not encompass information that: (a) is or becomes publicly available
                    through no act or omission of Receiving Party; (b) was rightfully in Receiving Party&rsquo;s
                    possession prior to disclosure without restriction; (c) is independently developed by Receiving
                    Party without reference to or reliance upon Disclosing Party&rsquo;s Confidential Information; or
                    (d) is lawfully obtained from a third party free of any confidentiality obligations.
                  </p>
                </section>

                <Separator />

                {/* Section 4: Term & Expiration */}
                <section className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      04
                    </span>
                    <h3 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                      Term of Confidentiality Obligations
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    The obligations of confidentiality and non-use established under this Agreement shall commence on
                    the Effective Date and continue in full force and effect for a period of{' '}
                    <strong className="text-foreground">{termText}</strong>.
                  </p>
                </section>

                {/* Dynamic Section: Non-Solicitation */}
                {clauseNonSolicit && (
                  <>
                    <Separator />
                    <section className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                          05
                        </span>
                        <h3 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                          Non-Solicitation of Technical Personnel
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        During the term of this Agreement and for a period of{' '}
                        <strong className="text-foreground">twelve (12) calendar months</strong> immediately following
                        its expiration or termination, neither party shall directly or indirectly solicit, recruit, or
                        entice any software engineer, systems architect, or executive officer of the other party
                        involved in this collaboration to terminate their employment relationship.
                      </p>
                    </section>
                  </>
                )}

                {/* Dynamic Section: Injunctive Relief */}
                {clauseInjunctiveRelief && (
                  <>
                    <Separator />
                    <section className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                          {clauseNonSolicit ? '06' : '05'}
                        </span>
                        <h3 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                          Injunctive &amp; Equitable Remedies
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        The parties acknowledge that unauthorized disclosure or use of Confidential Information will
                        cause irreparable injury for which monetary damages alone would be inadequate. Consequently,
                        Disclosing Party shall be entitled to seek immediate injunctive relief, specific performance,
                        and other equitable remedies in any court of competent jurisdiction without the requirement of
                        posting a bond or proving monetary damages.
                      </p>
                    </section>
                  </>
                )}

                {/* Dynamic Section: Return & Certified Destruction */}
                {clauseReturnMaterials && (
                  <>
                    <Separator />
                    <section className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                          {(clauseNonSolicit ? 1 : 0) + (clauseInjunctiveRelief ? 1 : 0) + 5}
                        </span>
                        <h3 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                          Return &amp; Certified Destruction of Materials
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        Upon written request by Disclosing Party or upon termination of discussions, Receiving Party
                        shall within <strong className="text-foreground">fourteen (14) calendar days</strong>: (a)
                        return all tangible materials containing Confidential Information; and (b) permanently erase and
                        cryptographically shred all digital records, backups, and derivative works, providing a formal
                        officer Certificate of Destruction.
                      </p>
                    </section>
                  </>
                )}

                {/* Dynamic Section: Permitted Compelled Disclosures */}
                {clausePermittedDisclosures && (
                  <>
                    <Separator />
                    <section className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                          {(clauseNonSolicit ? 1 : 0) +
                            (clauseInjunctiveRelief ? 1 : 0) +
                            (clauseReturnMaterials ? 1 : 0) +
                            5}
                        </span>
                        <h3 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                          Permitted Compelled Disclosures &amp; Subpoenas
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        Receiving Party may disclose Confidential Information pursuant to a valid judicial order or
                        statutory subpoena; provided that Receiving Party delivers prompt written notice (within 48
                        hours) to Disclosing Party prior to disclosure, enabling Disclosing Party an opportunity to seek
                        an appropriate protective order.
                      </p>
                    </section>
                  </>
                )}

                <Separator />

                {/* Governing Law Section */}
                <section className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      {activeClausesCount + 5}
                    </span>
                    <h3 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                      Governing Law &amp; Dispute Jurisdiction
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    This Agreement shall be governed by, construed, and enforced in accordance with the substantive laws
                    of <strong className="text-foreground">{currentJurisdiction.name}</strong> (
                    {currentJurisdiction.statute}). The parties consent to the exclusive jurisdiction and venue of the
                    courts situated in <strong className="text-foreground">{currentJurisdiction.venue}</strong>.
                  </p>
                </section>

                <Separator />

                {/* Dual Signature Execution Block */}
                <section className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                      In Witness Whereof &bull; Execution Signatures
                    </h3>
                    <span className="text-muted-foreground font-mono text-xs">2 of 2 Parties Bound</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Disclosing Party Signature Block */}
                    <div className="border-border bg-muted/20 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-foreground text-xs font-medium">Disclosing Party Signature</p>
                        <Badge
                          variant="outline"
                          className="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
                        >
                          <Check className="mr-1 size-3" /> Signed &amp; Verified
                        </Badge>
                      </div>
                      <div className="border-border/60 bg-card my-3 rounded-md border p-3 text-center">
                        <p className="text-xl font-medium tracking-wide text-emerald-800 italic dark:text-emerald-300">
                          {disclosingSignatory}
                        </p>
                        <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                          {disclosingTitle} &bull; {disclosingCompany}
                        </p>
                      </div>
                      <div className="text-muted-foreground space-y-1 font-mono text-xs">
                        <p className="flex justify-between">
                          <span>Date Countersigned:</span>
                          <span className="text-foreground font-semibold tabular-nums">
                            Aug 21, 2026 &bull; 09:30 EDT
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>Certificate ID:</span>
                          <span className="text-foreground font-semibold">DS-CERT-UIPKGE-9941</span>
                        </p>
                      </div>
                    </div>

                    {/* Receiving Party Signature Block */}
                    <div
                      className={cn(
                        'rounded-lg border p-4 transition-all duration-200',
                        isSigned
                          ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                          : 'border-border bg-muted/10 border-dashed',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-foreground text-xs font-medium">Receiving Party Signature</p>
                        {isSigned ? (
                          <Badge className="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            <Check className="mr-1 size-3" /> Signed &amp; Bound
                          </Badge>
                        ) : (
                          <Badge className="border-amber-500/40 bg-amber-500/10 font-mono text-xs font-medium text-amber-700 dark:text-amber-400">
                            Awaiting Signature
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
                              {signerName || receivingSignatory}
                            </p>
                            <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                              {receivingTitle} &bull; {receivingCompany}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-muted-foreground text-xs italic">
                              Awaiting signature execution via left panel
                            </p>
                            <p className="text-muted-foreground/80 mt-1 text-xs">
                              Click &ldquo;Sign &amp; Execute Agreement&rdquo; to bind {receivingCompany}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="text-muted-foreground space-y-1 font-mono text-xs">
                        <p className="flex justify-between">
                          <span>Date Executed:</span>
                          <span className="text-foreground font-semibold tabular-nums">
                            {isSigned ? 'Aug 21, 2026 • 11:20 EDT' : 'Pending'}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>Digital Audit Hash:</span>
                          <span className="text-foreground font-semibold">
                            {isSigned ? 'SHA256:d91c7a...77a1' : 'Unsigned'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Parchment Footer Seal */}
                <div className="border-border/60 bg-muted/20 flex flex-col items-center justify-between gap-2 rounded-lg border p-3 text-xs sm:flex-row">
                  <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                    <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span>256-Bit Cryptographic Ledger Seal &bull; RFC 3161 Authenticated</span>
                  </div>
                  <span className="text-muted-foreground font-mono text-xs">
                    Doc ID: #NDA-2026-88F-{currentJurisdiction.tag}
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
