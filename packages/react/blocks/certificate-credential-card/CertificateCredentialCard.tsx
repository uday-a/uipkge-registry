'use client'

import * as React from 'react'
import { Award, Check, Copy, Download, ExternalLink, Share2, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface CertificateCredentialCardProps {
  className?: string
}

const credentialData = {
  certId: 'CERT-2026-984210',
  institution: 'UIPKGE Engineering Academy',
  motto: 'EXCELLENTIA IN ARCHITECTURA',
  type: 'Professional Certificate of Mastery in Full-Stack UI Engineering',
  recipientName: 'Elena Rostova',
  achievementDescription:
    'For demonstrating advanced mastery in headless component architecture, OKLCH token systems, accessibility compliance, and dual-framework engineering.',
  issueDate: 'August 21, 2026',
  expiration: 'No Expiration · Lifetime Validity',
  skills: ['Vue 3.5', 'React 19', 'TypeScript', 'Tailwind v4', 'Reka UI', 'WCAG AA A11y'],
  leadInstructor: {
    name: 'Dr. Marcus Vance',
    title: 'Lead Instructor & Distinguished Architect',
  },
  academicDean: {
    name: 'Sarah Jenkins, Ph.D.',
    title: 'Academic Dean of Engineering',
  },
  sha256Digest: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  verifyUrl: 'https://uipkge.dev/verify/CERT-2026-984210',
  blockLedger: 'Block #19,482,019 (OpenAttestation v3)',
}

export function CertificateCredentialCard({ className }: CertificateCredentialCardProps) {
  const [copiedCertId, setCopiedCertId] = React.useState(false)
  const [copiedVerifyUrl, setCopiedVerifyUrl] = React.useState(false)
  const [copiedDigest, setCopiedDigest] = React.useState(false)
  const [sharedLinkedIn, setSharedLinkedIn] = React.useState(false)
  const [downloadingPdf, setDownloadingPdf] = React.useState(false)

  const copyCertId = () => {
    navigator.clipboard?.writeText(credentialData.certId)
    setCopiedCertId(true)
    setTimeout(() => {
      setCopiedCertId(false)
    }, 2000)
  }

  const copyVerifyUrl = () => {
    navigator.clipboard?.writeText(credentialData.verifyUrl)
    setCopiedVerifyUrl(true)
    setTimeout(() => {
      setCopiedVerifyUrl(false)
    }, 2000)
  }

  const copyDigest = () => {
    navigator.clipboard?.writeText(credentialData.sha256Digest)
    setCopiedDigest(true)
    setTimeout(() => {
      setCopiedDigest(false)
    }, 2000)
  }

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(credentialData.verifyUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setSharedLinkedIn(true)
    setTimeout(() => {
      setSharedLinkedIn(false)
    }, 2500)
  }

  const handleDownloadPdf = () => {
    setDownloadingPdf(true)
    setTimeout(() => {
      setDownloadingPdf(false)
    }, 2000)
  }

  return (
    <div data-slot="certificate-credential-card" className={cn('w-full space-y-6', className)}>
      {/* Header Card */}
      <Card className="border shadow-xs">
        <CardHeader className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge wrap variant="outline" className="gap-1.5 font-mono text-xs">
                <Award className="size-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                Verified Credential
              </Badge>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                Authentic · Cryptographically Signed
              </div>
            </div>

            <div>
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                Verified Credential &amp; Certificate of Mastery
              </h1>
              <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span>Credential ID:</span>
                <button
                  type="button"
                  onClick={copyCertId}
                  className="hover:bg-muted focus-visible:ring-ring border-border bg-muted/40 text-foreground inline-flex min-h-6 items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  title="Click to copy credential ID"
                >
                  #{credentialData.certId}
                  {copiedCertId ? (
                    <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Copy className="text-muted-foreground size-3" aria-hidden="true" />
                  )}
                </button>
                <span className="text-muted-foreground tabular-nums">Issued {credentialData.issueDate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Button variant="default" onClick={handleLinkedInShare} className="gap-2 shadow-xs">
              <Share2 className="size-4" aria-hidden="true" />
              {sharedLinkedIn ? 'Shared!' : 'Share on LinkedIn'}
            </Button>
            <Button
              aria-label="Download attachment"
              variant="outline"
              onClick={handleDownloadPdf}
              className="gap-2 shadow-xs"
            >
              <Download className="size-4" aria-hidden="true" />
              {downloadingPdf ? 'Generating PDF...' : 'Download High-Res PDF'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Certificate Visual Diploma Frame */}
      <Card className="border-border from-card via-card/95 to-card/90 relative overflow-hidden rounded-2xl border bg-gradient-to-b shadow-sm">
        {/* Watermark Background Graphic */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.03] select-none dark:opacity-[0.05]"
          aria-hidden="true"
        >
          <svg
            className="h-[680px] w-full max-w-[680px]"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Concentric Guilloché Circles */}
            <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="250" cy="250" r="210" stroke="currentColor" strokeWidth="2" />
            <circle cx="250" cy="250" r="185" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="250" cy="250" r="150" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="120" stroke="currentColor" strokeWidth="1" />
            <circle cx="250" cy="250" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3" />
            <circle cx="250" cy="250" r="60" stroke="currentColor" strokeWidth="1" />
            {/* Radial Radiating Lines */}
            <g stroke="currentColor" strokeWidth="0.75" opacity="0.6">
              <line x1="250" y1="20" x2="250" y2="480" />
              <line x1="20" y1="250" x2="480" y2="250" />
              <line x1="87" y1="87" x2="413" y2="413" />
              <line x1="87" y1="413" x2="413" y2="87" />
              <line x1="135" y1="51" x2="365" y2="449" />
              <line x1="365" y1="51" x2="135" y2="449" />
              <line x1="51" y1="135" x2="449" y2="365" />
              <line x1="51" y1="365" x2="449" y2="135" />
            </g>
            {/* Center Emblem Symbol */}
            <polygon
              points="250,170 275,220 330,225 290,265 300,320 250,290 200,320 210,265 170,225 225,220"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>

        <CardContent className="relative z-10 p-6 sm:p-10 lg:p-12">
          {/* Certificate Inner Ornamental Border Container */}
          <div className="border-border/80 bg-background/50 relative rounded-xl border p-6 backdrop-blur-xs sm:p-10 lg:p-12">
            {/* Inner Double Inset Border with Corner Filigree Accents */}
            <div className="border-border/70 pointer-events-none absolute inset-3 rounded-lg border border-dashed sm:inset-4">
              {/* Top-Left Corner Rosette */}
              <div className="absolute -top-2.5 -left-2.5 flex size-5 items-center justify-center text-amber-500/70">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
                </svg>
              </div>
              {/* Top-Right Corner Rosette */}
              <div className="absolute -top-2.5 -right-2.5 flex size-5 items-center justify-center text-amber-500/70">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
                </svg>
              </div>
              {/* Bottom-Left Corner Rosette */}
              <div className="absolute -bottom-2.5 -left-2.5 flex size-5 items-center justify-center text-amber-500/70">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
                </svg>
              </div>
              {/* Bottom-Right Corner Rosette */}
              <div className="absolute -right-2.5 -bottom-2.5 flex size-5 items-center justify-center text-amber-500/70">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
                </svg>
              </div>
            </div>

            <div className="relative space-y-8 text-center sm:space-y-10">
              {/* 1. Issuing Institution Crest & Header */}
              <div className="flex flex-col items-center space-y-3">
                {/* Academy Crest Emblem SVG */}
                <div className="relative flex size-20 items-center justify-center sm:size-24">
                  <div className="to-primary/20 absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 blur-md" />
                  <div className="bg-card relative flex size-18 items-center justify-center rounded-full border-2 border-amber-500/40 p-3 shadow-md sm:size-20">
                    <svg
                      className="text-foreground size-full"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label="UIPKGE Engineering Academy Crest"
                    >
                      {/* Outer Shield */}
                      <path
                        d="M50 8 L84 20 V50 C84 72 50 92 50 92 C50 92 16 72 16 50 V20 Z"
                        fill="currentColor"
                        fillOpacity="0.06"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                      {/* Inner Shield Contour */}
                      <path
                        d="M50 16 L76 26 V48 C76 66 50 82 50 82 C50 82 24 66 24 48 V26 Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                      />
                      {/* Dual-Framework Atom Rings */}
                      <ellipse
                        cx="50"
                        cy="48"
                        rx="20"
                        ry="8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        transform="rotate(-30 50 48)"
                      />
                      <ellipse
                        cx="50"
                        cy="48"
                        rx="20"
                        ry="8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        transform="rotate(30 50 48)"
                      />
                      {/* Center Core Star & Graduation Cap Symbol */}
                      <circle cx="50" cy="48" r="4" fill="currentColor" />
                      <polygon
                        points="50,30 54,38 63,39 56,45 58,54 50,49 42,54 44,45 37,39 46,38"
                        fill="currentColor"
                        fillOpacity="0.8"
                      />
                    </svg>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-bold tracking-[0.25em] uppercase">
                    {credentialData.institution}
                  </p>
                  <p className="font-mono text-xs font-semibold tracking-widest text-emerald-600 dark:text-emerald-400">
                    {credentialData.motto}
                  </p>
                </div>

                <div className="text-muted-foreground/60 flex items-center justify-center gap-3 pt-1">
                  <span className="bg-border h-px w-12 sm:w-20" />
                  <Sparkles className="size-3.5 text-amber-500/80" aria-hidden="true" />
                  <span className="font-mono text-xs tracking-wider uppercase">Accredited Diploma</span>
                  <Sparkles className="size-3.5 text-amber-500/80" aria-hidden="true" />
                  <span className="bg-border h-px w-12 sm:w-20" />
                </div>
              </div>

              {/* 2. Recipient Presentation & Certificate Title */}
              <div className="space-y-4">
                <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
                  This is to certify that
                </p>

                {/* Recipient Name in Elegant / Prominent Display */}
                <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {credentialData.recipientName}
                </h2>

                <p className="text-muted-foreground text-xs italic sm:text-sm">
                  has successfully fulfilled all rigorous requirements and demonstrated distinguished mastery in
                </p>

                {/* Certificate Specialization Heading */}
                <div className="border-primary/20 bg-primary/5 mx-auto max-w-2xl rounded-lg border px-4 py-3 sm:px-6">
                  <h3 className="text-foreground text-base font-semibold tracking-tight sm:text-xl md:text-2xl">
                    {credentialData.type}
                  </h3>
                </div>

                {/* Achievement Description */}
                <p className="text-muted-foreground mx-auto max-w-2xl text-xs leading-relaxed sm:text-sm">
                  {credentialData.achievementDescription}
                </p>

                {/* Distinction Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                  <Award className="size-3.5" aria-hidden="true" />
                  <span>Conferred with Highest Distinction · Top 1% Cohort · 480 CEU Hours</span>
                </div>
              </div>

              {/* 3. Validated Skills Pills */}
              <div className="space-y-3 pt-2">
                <p className="text-muted-foreground text-xs font-medium">
                  Validated Competencies &amp; Technical Proficiencies
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {credentialData.skills.map((skill) => (
                    <Badge
                      wrap
                      key={skill}
                      variant="secondary"
                      className="border-border/80 bg-muted/60 hover:bg-muted gap-1.5 border px-3 py-1 text-xs font-medium transition-colors"
                    >
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 4. Issue Date & Validity Bar */}
              <div className="border-border/60 bg-muted/20 mx-auto grid max-w-xl grid-cols-1 gap-3 rounded-lg border p-3 text-xs sm:grid-cols-3">
                <div>
                  <span className="text-muted-foreground">Issue Date</span>
                  <p className="text-foreground mt-0.5 font-semibold">{credentialData.issueDate}</p>
                </div>
                <div className="border-border/60 border-t pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3">
                  <span className="text-muted-foreground">Validity</span>
                  <p className="mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    {credentialData.expiration}
                  </p>
                </div>
                <div className="border-border/60 border-t pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3">
                  <span className="text-muted-foreground">Credential Status</span>
                  <p className="text-foreground mt-0.5 font-mono font-semibold">Active · Verified</p>
                </div>
              </div>

              {/* 5. Signatures & Verification Seal / QR Code Grid */}
              <div className="grid grid-cols-1 items-end gap-8 pt-4 sm:grid-cols-3 sm:gap-6">
                {/* Lead Instructor Signature */}
                <div className="flex flex-col items-center space-y-2 text-center">
                  {/* Handwritten Signature SVG */}
                  <div className="flex h-14 w-44 items-center justify-center">
                    <svg
                      className="text-foreground h-full w-full opacity-90"
                      viewBox="0 0 200 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label="Signature of Dr. Marcus Vance"
                    >
                      {/* Cursive handwritten stroke: M. Vance */}
                      <path
                        d="M 15,45 C 18,20 28,12 36,25 C 44,38 48,15 56,22 C 64,29 68,48 76,42 C 84,36 92,30 102,32 C 114,34 122,46 134,36 C 144,28 152,18 162,26 C 172,34 180,42 188,40"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 30,52 C 70,50 140,53 180,48"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeDasharray="4 2"
                        opacity="0.6"
                      />
                    </svg>
                  </div>
                  <div className="border-border w-full max-w-[200px] border-t pt-1.5">
                    <p className="text-foreground text-xs font-bold">{credentialData.leadInstructor.name}</p>
                    <p className="text-muted-foreground text-xs">{credentialData.leadInstructor.title}</p>
                  </div>
                </div>

                {/* Center Gold/Emerald Cryptographic Seal & SVG QR Code */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative flex flex-col items-center">
                    {/* Medallion Seal Badge Outer */}
                    <div className="via-background relative flex size-28 flex-col items-center justify-center rounded-full border-2 border-amber-500/60 bg-gradient-to-br from-amber-500/10 to-emerald-500/10 p-2 shadow-md">
                      {/* QR Code SVG with finder blocks */}
                      <svg
                        className="text-foreground size-16"
                        viewBox="0 0 21 21"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="QR code for online credential verification"
                      >
                        {/* Top-Left Finder Pattern (7x7) */}
                        <rect x="0" y="0" width="7" height="7" rx="0.5" />
                        <rect x="1" y="1" width="5" height="5" fill="var(--color-card, #fff)" />
                        <rect x="2" y="2" width="3" height="3" />

                        {/* Top-Right Finder Pattern (7x7) */}
                        <rect x="14" y="0" width="7" height="7" rx="0.5" />
                        <rect x="15" y="1" width="5" height="5" fill="var(--color-card, #fff)" />
                        <rect x="16" y="2" width="3" height="3" />

                        {/* Bottom-Left Finder Pattern (7x7) */}
                        <rect x="0" y="14" width="7" height="7" rx="0.5" />
                        <rect x="1" y="15" width="5" height="5" fill="var(--color-card, #fff)" />
                        <rect x="2" y="16" width="3" height="3" />

                        {/* Timing Patterns (Row 6 & Col 6) */}
                        <rect x="8" y="6" width="1" height="1" />
                        <rect x="10" y="6" width="1" height="1" />
                        <rect x="12" y="6" width="1" height="1" />
                        <rect x="6" y="8" width="1" height="1" />
                        <rect x="6" y="10" width="1" height="1" />
                        <rect x="6" y="12" width="1" height="1" />

                        {/* Data Modules */}
                        <rect x="8" y="0" width="1" height="1" />
                        <rect x="10" y="1" width="1" height="1" />
                        <rect x="12" y="2" width="1" height="1" />
                        <rect x="9" y="3" width="1" height="1" />
                        <rect x="11" y="4" width="1" height="1" />

                        <rect x="0" y="8" width="1" height="1" />
                        <rect x="2" y="9" width="1" height="1" />
                        <rect x="4" y="10" width="1" height="1" />
                        <rect x="1" y="12" width="1" height="1" />

                        <rect x="8" y="8" width="2" height="2" />
                        <rect x="11" y="8" width="1" height="1" />
                        <rect x="13" y="9" width="2" height="1" />
                        <rect x="8" y="11" width="1" height="2" />
                        <rect x="10" y="11" width="2" height="1" />
                        <rect x="13" y="12" width="1" height="1" />

                        <rect x="14" y="8" width="1" height="1" />
                        <rect x="16" y="9" width="1" height="1" />
                        <rect x="19" y="10" width="1" height="1" />
                        <rect x="15" y="11" width="2" height="1" />
                        <rect x="18" y="12" width="1" height="1" />

                        <rect x="8" y="14" width="1" height="1" />
                        <rect x="10" y="15" width="2" height="1" />
                        <rect x="8" y="17" width="1" height="2" />
                        <rect x="10" y="18" width="1" height="1" />
                        <rect x="12" y="16" width="1" height="2" />
                        <rect x="12" y="19" width="1" height="1" />

                        <rect x="14" y="14" width="2" height="1" />
                        <rect x="17" y="15" width="1" height="1" />
                        <rect x="19" y="14" width="2" height="1" />
                        <rect x="15" y="17" width="1" height="2" />
                        <rect x="17" y="18" width="2" height="1" />
                        <rect x="20" y="19" width="1" height="1" />
                      </svg>

                      {/* Cryptographic Seal Label */}
                      <div className="mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="size-3" aria-hidden="true" />
                        <span className="font-mono text-xs font-semibold">VERIFIED</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-xs font-medium">Scan to Verify Authenticity</p>
                </div>

                {/* Academic Dean Signature */}
                <div className="flex flex-col items-center space-y-2 text-center">
                  {/* Handwritten Signature SVG */}
                  <div className="flex h-14 w-44 items-center justify-center">
                    <svg
                      className="text-foreground h-full w-full opacity-90"
                      viewBox="0 0 200 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label="Signature of Dr. Sarah Jenkins"
                    >
                      {/* Cursive handwritten stroke: S. Jenkins */}
                      <path
                        d="M 20,25 C 24,14 34,12 40,20 C 46,28 32,48 42,48 C 52,48 60,30 70,30 C 80,30 84,42 94,40 C 104,38 112,24 122,24 C 132,24 136,44 148,42 C 158,40 166,28 176,32 C 182,35 186,40 190,38"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 25,54 C 65,52 130,50 175,48"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeDasharray="4 2"
                        opacity="0.6"
                      />
                    </svg>
                  </div>
                  <div className="border-border w-full max-w-[200px] border-t pt-1.5">
                    <p className="text-foreground text-xs font-bold">{credentialData.academicDean.name}</p>
                    <p className="text-muted-foreground text-xs">{credentialData.academicDean.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cryptographic Verification & Blockchain Ledger Audit Strip */}
      <Card className="border-border bg-muted/20 border shadow-xs">
        <CardContent className="flex flex-col gap-4 p-4 text-xs lg:flex-row lg:items-center lg:justify-between">
          <div className="text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>
              Tamper-Proof Credential · W3C Verifiable Credentials &amp;{' '}
              <span className="text-foreground font-mono font-medium">{credentialData.blockLedger}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* SHA-256 Digest Copy Button */}
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-muted-foreground">SHA-256:</span>
              <button
                type="button"
                onClick={copyDigest}
                className="hover:bg-muted focus-visible:ring-ring border-border bg-muted/60 text-foreground inline-flex min-h-6 items-center gap-1 rounded border px-2 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                title="Click to copy SHA-256 cryptographic digest"
              >
                <span className="tabular-nums">7f83b1...126d9069</span>
                {copiedDigest ? (
                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Direct Verification URL Button */}
            <button
              type="button"
              onClick={copyVerifyUrl}
              className="hover:bg-muted focus-visible:ring-ring text-primary hover:text-primary/80 inline-flex min-h-6 items-center gap-1 rounded px-1.5 py-0.5 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
              title="Click to copy public verification URL"
            >
              <span>{copiedVerifyUrl ? 'URL Copied' : 'Copy Verification URL'}</span>
              {copiedVerifyUrl ? (
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              ) : (
                <ExternalLink className="size-3" aria-hidden="true" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CertificateCredentialCard
