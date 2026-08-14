'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import {
  Check,
  CheckCircle2,
  Clock,
  FileMinus2,
  FilePlus2,
  FileText,
  History,
  MessageSquare,
  MessageSquareReply,
  Scale,
  Send,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export interface CommentItem {
  id: string
  clauseId: string
  clauseTitle: string
  authorName: string
  authorRole: string
  authorInitials: string
  timestamp: string
  commentText: string
  proposedChange: string
  status: 'pending' | 'resolved'
  severity?: 'critical' | 'moderate' | 'standard'
}

export interface RedlineStats {
  additions: string
  additionsSub: string
  deletions: string
  deletionsSub: string
  openComments: number
  resolvedComments: number
  liabilityCap: string
  liabilityCapSub: string
}

export interface ContractRedlineDiffProps {
  contractTitle?: string
  counterparty?: string
  counselFirm?: string
  versionComparison?: string
  initialStats?: RedlineStats
  initialComments?: CommentItem[]
  className?: string
}

const defaultComments: CommentItem[] = [
  {
    id: 'c-1',
    clauseId: 'clause-4-2',
    clauseTitle: 'Section 4.2 · Service Level Agreement Credits',
    authorName: 'Sarah Lin',
    authorRole: 'Senior Counsel, Davis Polk & Wardwell LLP',
    authorInitials: 'SL',
    timestamp: '2 hours ago',
    commentText:
      'Acme enterprise infrastructure requires a 25% credit for downtime exceeding 4 hours given Tier-1 mission-critical workload dependency. We also propose extending the scheduled maintenance notice window to 7 business days.',
    proposedChange: '25% monthly fee credit (was 10%) · 7 business days notice (was 48 hours)',
    status: 'pending',
    severity: 'critical',
  },
  {
    id: 'c-2',
    clauseId: 'clause-8-1',
    clauseTitle: 'Section 8.1 · Limitation of Liability & Super-Cap',
    authorName: 'Marcus Vance',
    authorRole: 'VP Legal & AGC, Acme Enterprise Corp',
    authorInitials: 'MV',
    timestamp: '4 hours ago',
    commentText:
      'We cannot agree to a standard 12-month trailing fee liability cap due to GDPR Article 82 joint-controller exposure and confidential IP storage. A $2.5M aggregate super-cap is our committee floor for cloud vendor onboarding.',
    proposedChange: 'Super-cap of $2,500,000 or 2.5x total contract value for data protection breaches',
    status: 'pending',
    severity: 'critical',
  },
  {
    id: 'c-3',
    clauseId: 'clause-12-3',
    clauseTitle: 'Section 12.3 · Governing Law & Commercial Arbitration',
    authorName: 'Elena Rostova',
    authorRole: 'Partner, Technology Transactions Counsel',
    authorInitials: 'ER',
    timestamp: 'Yesterday at 17:45',
    commentText:
      'Replaced Delaware Chancery court litigation with AAA expedited commercial arbitration seated in New York to contain cross-border litigation exposure, expedite timeline, and guarantee reciprocal fee shifting.',
    proposedChange: 'AAA Commercial Arbitration (New York, NY) + Prevailing party attorney fee shifting',
    status: 'pending',
    severity: 'moderate',
  },
  {
    id: 'c-4',
    clauseId: 'clause-2-4',
    clauseTitle: 'Section 2.4 · Customer Data & AI Model Training',
    authorName: 'David Kim',
    authorRole: 'Lead In-House Commercial Counsel',
    authorInitials: 'DK',
    timestamp: 'Resolved 5 hours ago',
    commentText:
      'Provider confirmed in writing that customer telemetry is strictly quarantined and excluded from foundation LLM model training. Mutually agreed language inserted.',
    proposedChange: 'Explicit carve-out prohibiting Customer Data ingestion into generative AI training sets',
    status: 'resolved',
    severity: 'standard',
  },
]

export function ContractRedlineDiff({
  contractTitle = 'Master Services Agreement · Redline Review v3.2 vs v3.1',
  counterparty = 'Acme Enterprise Corp',
  counselFirm = 'Davis Polk & Wardwell LLP',
  versionComparison = 'v3.2 (Counterparty Redlines) vs v3.1 (Baseline Executed)',
  initialComments,
  className,
}: ContractRedlineDiffProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments ? [...initialComments] : [...defaultComments])
  const [activeCommentId, setActiveCommentId] = useState<string>('c-1')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'resolved'>('all')
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null)
  const [replyDraftText, setReplyDraftText] = useState<string>('')
  const [actionBannerMessage, setActionBannerMessage] = useState<string | null>(null)

  const pendingCount = useMemo(() => comments.filter((c) => c.status === 'pending').length, [comments])
  const resolvedCount = useMemo(() => comments.filter((c) => c.status === 'resolved').length, [comments])

  const filteredComments = useMemo(() => {
    if (selectedFilter === 'pending') {
      return comments.filter((c) => c.status === 'pending')
    }
    if (selectedFilter === 'resolved') {
      return comments.filter((c) => c.status === 'resolved')
    }
    return comments
  }, [comments, selectedFilter])

  const selectComment = (id: string, clauseId?: string) => {
    setActiveCommentId(id)
    if (clauseId && typeof document !== 'undefined') {
      const el = document.getElementById(clauseId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const toggleAcceptTweak = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'pending' ? 'resolved' : 'pending'
          if (nextStatus === 'resolved') {
            setActionBannerMessage(`Accepted proposed language for "${c.clauseTitle}"`)
          } else {
            setActionBannerMessage(`Reopened review for "${c.clauseTitle}"`)
          }
          return { ...c, status: nextStatus }
        }
        return c
      }),
    )
  }

  const handleAcceptAll = () => {
    setComments((prev) => prev.map((c) => ({ ...c, status: 'resolved' })))
    setActionBannerMessage('All 3 pending redlines and attorney comments have been accepted into draft v3.3')
  }

  const handleRejectAll = () => {
    setComments((prev) => prev.map((c) => ({ ...c, status: 'pending' })))
    setActionBannerMessage('Redline proposals flagged for revision. Counterparty notified of rejection.')
  }

  const toggleReply = (id: string) => {
    if (replyingCommentId === id) {
      setReplyingCommentId(null)
      setReplyDraftText('')
    } else {
      setReplyingCommentId(id)
      setReplyDraftText('')
    }
  }

  const submitReply = (id: string) => {
    if (!replyDraftText.trim()) return
    const target = comments.find((c) => c.id === id)
    setActionBannerMessage(`Reply posted to counsel thread on ${target?.clauseTitle}`)
    setReplyingCommentId(null)
    setReplyDraftText('')
  }

  return (
    <div data-slot="contract-redline-diff" className={cn('bg-background text-foreground w-full space-y-6', className)}>
      {/* Header Section */}
      <header className="border-border bg-card rounded-xl border p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                CLM Contract Workspace &bull; MSA-2026-0882
              </span>
              {pendingCount > 0 ? (
                <Badge
                  wrap
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 font-mono text-xs font-semibold text-amber-700 dark:text-amber-400"
                >
                  <span className="mr-1.5 size-1.5 rounded-full bg-amber-500" />
                  {pendingCount} Pending Redlines &bull; {resolvedCount} Resolved
                </Badge>
              ) : (
                <Badge
                  wrap
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                >
                  <CheckCircle2 className="mr-1 size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  All Changes Accepted &bull; Ready for Execution
                </Badge>
              )}
            </div>

            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{contractTitle}</h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <span className="text-foreground font-medium">Counterparty:</span>
                <span>{counterparty}</span>
              </div>
              <span className="text-muted-foreground/40 hidden sm:inline">&bull;</span>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <span className="text-foreground font-medium">Outside Counsel:</span>
                <span>{counselFirm}</span>
              </div>
              <span className="text-muted-foreground/40 hidden sm:inline">&bull;</span>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <History className="size-3.5" aria-hidden="true" />
                <span>{versionComparison}</span>
              </div>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium" onClick={handleRejectAll}>
              <XCircle className="text-muted-foreground size-4" aria-hidden="true" />
              <span>Reject Changes</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="gap-1.5 text-xs font-semibold shadow-xs"
              onClick={handleAcceptAll}
            >
              <Check className="size-4" aria-hidden="true" />
              <span>Accept All Changes</span>
            </Button>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionBannerMessage && (
          <div className="border-primary/20 bg-primary/5 mt-4 flex items-center justify-between rounded-lg border px-4 py-2.5 text-xs">
            <div className="text-foreground flex items-center gap-2 font-medium">
              <Sparkles className="text-primary size-4 shrink-0" aria-hidden="true" />
              <span>{actionBannerMessage}</span>
            </div>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded p-1 focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => setActionBannerMessage(null)}
              aria-label="Dismiss notification"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
      </header>

      {/* 4 Redline Summary Metric Cards */}
      <section aria-label="Redline metrics overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Additions / Insertions */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Additions / Insertions
              </CardTitle>
              <div className="rounded-md bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
                <FilePlus2 className="size-4" aria-hidden="true" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-0">
            <p className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              +14 Clauses / Sentences
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              +620 words &bull; Enhanced SLA credits, audit rights &amp; ML carve-outs
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Deletions / Removals */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Deletions / Removals
              </CardTitle>
              <div className="rounded-md bg-rose-500/10 p-1.5 text-rose-600 dark:text-rose-400">
                <FileMinus2 className="size-4" aria-hidden="true" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-0">
            <p className="font-mono text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              -8 Clauses Struck Through
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              -310 words &bull; Excised unilateral termination &amp; uncapped liability
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Pending Review Comments */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Review Comments
              </CardTitle>
              <div className="rounded-md bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400">
                <MessageSquare className="size-4" aria-hidden="true" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-0">
            <p className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {pendingCount} Open Counsel Comments
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {resolvedCount} resolved &bull; 2 require General Counsel sign-off
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Liability Cap Shift */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Liability Cap Shift
              </CardTitle>
              <div className="bg-primary/10 text-primary rounded-md p-1.5">
                <Scale className="size-4" aria-hidden="true" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-0">
            <p className="text-primary font-mono text-2xl font-bold tracking-tight">$1.0M &rarr; $2.5M Super-Cap</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Shifted from 1x annual fees to 2.5x aggregate contract liability
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 2-Column Redline Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Redlined Document Prose */}
        <main className="space-y-6 lg:col-span-8">
          <div className="border-border bg-card rounded-xl border shadow-xs">
            {/* Document Controls & Legend Top Bar */}
            <div className="border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5">
              <div className="flex items-center gap-2">
                <FileText className="text-primary size-4" aria-hidden="true" />
                <span className="text-foreground text-xs font-semibold sm:text-sm">
                  Master Services Agreement (MSA) &bull; Draft v3.2
                </span>
              </div>

              {/* Visual Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-5 rounded border border-emerald-500/30 bg-emerald-500/20" />
                  <span className="text-muted-foreground">Insertion (Acme Counsel)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-5 rounded border border-rose-500/30 bg-rose-500/20" />
                  <span className="text-muted-foreground">Deletion (Struck Out)</span>
                </div>
              </div>
            </div>

            {/* Document Content Body */}
            <div className="divide-border space-y-8 divide-y px-5 py-6 sm:px-8">
              {/* Section 2: Intellectual Property & Data Ownership */}
              <section id="clause-2-4" className="scroll-mt-6 space-y-3 pt-6 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-foreground text-sm font-bold tracking-tight sm:text-base">
                      Section 2 &bull; Intellectual Property &amp; Customer Data
                    </h2>
                    <Badge
                      wrap
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
                    >
                      [RESOLVED] &bull; § 2.4 ML Carve-out
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs"
                    onClick={() => selectComment('c-4', 'clause-2-4')}
                  >
                    <MessageSquare className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>View Resolution</span>
                  </Button>
                </div>

                <div className="border-border bg-muted/20 space-y-3 rounded-lg border p-4 text-xs leading-relaxed sm:text-sm">
                  <p className="text-foreground">
                    <strong className="text-foreground font-semibold">
                      2.4 Proprietary Rights &amp; Restrictions.
                    </strong>
                    Customer retains all right, title, and interest in and to Customer Data, including all Intellectual
                    Property Rights therein. Provider shall not acquire any ownership interest in or rights to Customer
                    Data, except for the limited license granted herein to perform the Services.{' '}
                    <span className="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400">
                      Under no circumstances shall Provider utilize, parse, vectorize, or ingest Customer Data,
                      confidential telemetry, or user communications to train, fine-tune, or benchmark any public or
                      proprietary artificial intelligence, large language, or algorithmic model without express prior
                      written addendum.
                    </span>
                  </p>
                </div>
              </section>

              {/* Section 4: Service Level Agreements */}
              <section id="clause-4-2" className="scroll-mt-6 space-y-3 pt-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-foreground text-sm font-bold tracking-tight sm:text-base">
                      Section 4 &bull; Service Level Agreements &amp; Availability Commitments
                    </h2>
                    <Badge
                      wrap
                      variant="outline"
                      className="border-amber-500/30 bg-amber-500/10 font-mono text-xs text-amber-700 dark:text-amber-400"
                    >
                      [DIFF-4.2] &bull; 2 Pending Redlines
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'h-7 gap-1.5 px-2.5 text-xs',
                      activeCommentId === 'c-1'
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground',
                    )}
                    onClick={() => selectComment('c-1', 'clause-4-2')}
                  >
                    <MessageSquare className="size-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Comment #1 &bull; Sarah Lin</span>
                  </Button>
                </div>

                <div
                  className={cn(
                    'border-border bg-card space-y-4 rounded-lg border p-4 text-xs leading-relaxed transition-colors sm:p-5 sm:text-sm',
                    activeCommentId === 'c-1' ? 'ring-primary/40 ring-2' : '',
                  )}
                >
                  <p className="text-foreground">
                    <strong className="text-foreground font-semibold">4.1 Monthly Uptime Commitment.</strong>
                    Provider warrants that the Production Cloud Service will achieve a Monthly Uptime Percentage of no
                    less than{' '}
                    <span className="rounded bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 line-through decoration-rose-500/60 dark:text-rose-400">
                      ninety-nine and one-half percent (99.5%)
                    </span>{' '}
                    <span className="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400">
                      ninety-nine and ninety-five hundredths percent (99.95%)
                    </span>{' '}
                    during each calendar billing month of the applicable Order Term (&ldquo;Service Level
                    Standard&rdquo;).
                  </p>

                  <p className="text-foreground">
                    <strong className="text-foreground font-semibold">
                      4.2 SLA Failure Remedies &amp; Maintenance Notice.
                    </strong>
                    If Provider fails to meet the Service Level Standard for any calendar month, Customer shall be
                    entitled to an immediate credit against future invoices equal to{' '}
                    <span className="rounded bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 line-through decoration-rose-500/60 dark:text-rose-400">
                      ten percent (10%)
                    </span>{' '}
                    <span className="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400">
                      twenty-five percent (25%)
                    </span>{' '}
                    of the prorated monthly fees for such month. Scheduled Maintenance windows shall occur solely
                    between 01:00 and 04:00 UTC on Sunday mornings and require no less than{' '}
                    <span className="rounded bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 line-through decoration-rose-500/60 dark:text-rose-400">
                      forty-eight (48) hours
                    </span>{' '}
                    <span className="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400">
                      seven (7) business days
                    </span>{' '}
                    advance electronic notice to Customer&rsquo;s Lead SRE contact.
                  </p>
                </div>
              </section>

              {/* Section 8: Limitation of Liability */}
              <section id="clause-8-1" className="scroll-mt-6 space-y-3 pt-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-foreground text-sm font-bold tracking-tight sm:text-base">
                      Section 8 &bull; Limitation of Liability &amp; Super-Cap Allocation
                    </h2>
                    <Badge
                      wrap
                      variant="outline"
                      className="border-rose-500/30 bg-rose-500/10 font-mono text-xs font-semibold text-rose-700 dark:text-rose-400"
                    >
                      [DIFF-8.1] &bull; HIGH IMPACT SHIFT
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'h-7 gap-1.5 px-2.5 text-xs',
                      activeCommentId === 'c-2'
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground',
                    )}
                    onClick={() => selectComment('c-2', 'clause-8-1')}
                  >
                    <MessageSquare className="size-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Comment #2 &bull; Marcus Vance</span>
                  </Button>
                </div>

                <div
                  className={cn(
                    'border-border bg-card space-y-4 rounded-lg border p-4 text-xs leading-relaxed transition-colors sm:p-5 sm:text-sm',
                    activeCommentId === 'c-2' ? 'ring-primary/40 ring-2' : '',
                  )}
                >
                  <p className="text-foreground font-mono text-xs leading-relaxed uppercase">
                    <strong className="text-foreground font-bold">8.1 AGGREGATE LIABILITY CAP.</strong>
                    EXCEPT FOR LIABILITIES ARISING FROM A BREACH OF CONFIDENTIALITY UNDER SECTION 6, FRAUD, OR
                    INDEMNIFICATION OBLIGATIONS UNDER SECTION 10, NEITHER PARTY&rsquo;S MAXIMUM AGGREGATE LIABILITY
                    UNDER THIS AGREEMENT SHALL EXCEED{' '}
                    <span className="rounded bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 line-through decoration-rose-500/60 dark:text-rose-400">
                      THE TOTAL FEES ACTUALLY PAID BY CUSTOMER TO PROVIDER IN THE TWELVE (12) MONTHS PRECEDING THE EVENT
                      GIVING RISE TO LIABILITY.
                    </span>{' '}
                    <span className="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400">
                      THE GREATER OF TWO MILLION FIVE HUNDRED THOUSAND UNITED STATES DOLLARS ($2,500,000 USD) OR TWO AND
                      ONE-HALF TIMES (2.5X) THE AGGREGATE FEES PAYABLE OVER THE ENTIRE ORDER FORM DURATION
                      (&ldquo;SUPER-CAP&rdquo;).
                    </span>
                  </p>

                  <p className="text-foreground">
                    <strong className="text-foreground font-semibold">8.2 Direct Damages Carve-Out.</strong>
                    Notwithstanding anything to the contrary, the mutual waiver of consequential damages in Section 8.3
                    shall not preclude or limit recovery of{' '}
                    <span className="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400">
                      reasonable third-party forensic incident investigation expenses, statutory breach notification
                      mailings, and credit monitoring services required under GDPR, HIPAA, or State Data Privacy laws.
                    </span>
                  </p>
                </div>
              </section>

              {/* Section 12: Governing Law & Arbitration */}
              <section id="clause-12-3" className="scroll-mt-6 space-y-3 pt-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-foreground text-sm font-bold tracking-tight sm:text-base">
                      Section 12 &bull; Governing Law, Venue &amp; Arbitration
                    </h2>
                    <Badge
                      wrap
                      variant="outline"
                      className="border-primary/30 bg-primary/10 text-primary font-mono text-xs"
                    >
                      [DIFF-12.3] &bull; Modified Venue
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'h-7 gap-1.5 px-2.5 text-xs',
                      activeCommentId === 'c-3'
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground',
                    )}
                    onClick={() => selectComment('c-3', 'clause-12-3')}
                  >
                    <MessageSquare className="text-primary size-3.5" />
                    <span>Comment #3 &bull; Elena Rostova</span>
                  </Button>
                </div>

                <div
                  className={cn(
                    'border-border bg-card space-y-4 rounded-lg border p-4 text-xs leading-relaxed transition-colors sm:p-5 sm:text-sm',
                    activeCommentId === 'c-3' ? 'ring-primary/40 ring-2' : '',
                  )}
                >
                  <p className="text-foreground">
                    <strong className="text-foreground font-semibold">12.1 Applicable Law.</strong>
                    This Agreement shall be governed by, construed, and enforced in accordance with the substantive laws
                    of the State of Delaware, without reference to its conflict-of-law principles.
                  </p>

                  <p className="text-foreground">
                    <strong className="text-foreground font-semibold">
                      12.3 Binding Commercial Arbitration &amp; Fee Recovery.
                    </strong>
                    Any controversy, dispute, or claim arising out of or relating to this Agreement, or the breach
                    thereof, shall be resolved by{' '}
                    <span className="rounded bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 line-through decoration-rose-500/60 dark:text-rose-400">
                      the state or federal courts situated in Wilmington, Delaware.
                    </span>{' '}
                    <span className="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400">
                      binding arbitration administered by the American Arbitration Association (AAA) in accordance with
                      its Commercial Arbitration Rules, before a single neutral arbitrator seated in the City and State
                      of New York.
                    </span>{' '}
                    <span className="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400">
                      The prevailing party in any proceeding to enforce or interpret this Agreement shall be entitled to
                      recover from the non-prevailing party all reasonable attorneys&rsquo; fees, arbitrator
                      compensation, and expert witness disbursements incurred in connection therewith.
                    </span>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* Right Column: Attorney Comments & Negotiations Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:col-span-4">
          <div className="border-border bg-card space-y-4 rounded-xl border p-4 shadow-xs">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-primary size-4" aria-hidden="true" />
                <h2 className="text-foreground text-sm font-bold tracking-tight">Counsel Comments &amp; Markups</h2>
              </div>
              <span className="text-muted-foreground font-mono text-xs font-medium">
                {filteredComments.length} items
              </span>
            </div>

            {/* Filter Pills */}
            <div className="bg-muted/60 flex items-center gap-1.5 rounded-lg p-1">
              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedFilter === 'all'
                    ? 'bg-background text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSelectedFilter('all')}
              >
                All ({comments.length})
              </button>
              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedFilter === 'pending'
                    ? 'bg-background text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSelectedFilter('pending')}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedFilter === 'resolved'
                    ? 'bg-background text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSelectedFilter('resolved')}
              >
                Resolved ({resolvedCount})
              </button>
            </div>

            <Separator />

            {/* Comments Feed */}
            <div className="space-y-3.5">
              {filteredComments.map((comment) => (
                <Card
                  key={comment.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={activeCommentId === comment.id}
                  className={cn(
                    'border-border hover:border-primary/40 focus-visible:ring-ring cursor-pointer transition-all focus-visible:ring-2 focus-visible:outline-none',
                    activeCommentId === comment.id ? 'border-primary/60 bg-muted/20 ring-primary/30 ring-1' : 'bg-card',
                    comment.status === 'resolved' ? 'opacity-75' : '',
                  )}
                  onClick={() => selectComment(comment.id, comment.clauseId)}
                  onKeyDown={(e) => {
                    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      selectComment(comment.id, comment.clauseId)
                    }
                  }}
                >
                  <CardHeader className="p-3.5 pb-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="border-border size-7 border">
                          <AvatarFallback className="bg-primary/10 text-primary font-mono text-xs font-bold">
                            {comment.authorInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-foreground text-xs leading-none font-semibold">{comment.authorName}</p>
                          <p className="text-muted-foreground mt-0.5 max-w-[170px] truncate text-xs">
                            {comment.authorRole}
                          </p>
                        </div>
                      </div>

                      <Badge
                        wrap
                        variant="outline"
                        className={cn(
                          'shrink-0 font-mono text-xs',
                          comment.status === 'resolved'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
                        )}
                      >
                        {comment.status === 'resolved' ? 'Resolved' : 'Pending'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2.5 p-3.5 pt-0 text-xs">
                    {/* Clause context pill */}
                    <div className="bg-muted/50 text-muted-foreground rounded px-2 py-1 font-mono text-xs">
                      {comment.clauseTitle}
                    </div>

                    {/* Comment narrative */}
                    <p className="text-foreground leading-relaxed">&ldquo;{comment.commentText}&rdquo;</p>

                    {/* Proposed change box */}
                    <div className="rounded border border-emerald-500/20 bg-emerald-500/5 p-2 text-xs">
                      <span className="mb-0.5 block font-semibold text-emerald-700 dark:text-emerald-400">
                        Proposed Redline Tweak:
                      </span>
                      <span className="text-muted-foreground">{comment.proposedChange}</span>
                    </div>

                    <div className="text-muted-foreground flex items-center justify-between pt-1 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" aria-hidden="true" />
                        {comment.timestamp}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="border-border bg-muted/10 flex items-center justify-between gap-2 border-t p-2.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleReply(comment.id)
                      }}
                    >
                      <MessageSquareReply className="text-muted-foreground size-3" aria-hidden="true" />
                      <span>Reply</span>
                    </Button>

                    <Button
                      variant={comment.status === 'resolved' ? 'outline' : 'default'}
                      size="sm"
                      className={cn(
                        'h-7 gap-1 text-xs',
                        comment.status === 'resolved' ? 'text-muted-foreground' : 'font-medium',
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleAcceptTweak(comment.id)
                      }}
                    >
                      <Check className="size-3" aria-hidden="true" />
                      <span>{comment.status === 'resolved' ? 'Reopen' : 'Accept Tweak'}</span>
                    </Button>
                  </CardFooter>

                  {/* Inline Thread Reply Input */}
                  {replyingCommentId === comment.id && (
                    <div
                      className="border-border bg-background space-y-2 border-t p-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <textarea
                        value={replyDraftText}
                        onChange={(e) => setReplyDraftText(e.target.value)}
                        placeholder="Draft reply to counsel thread..."
                        className="border-border bg-card placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-none rounded-md border p-2 text-xs focus-visible:ring-2 focus-visible:outline-none"
                        rows={2}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setReplyingCommentId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-6 gap-1 px-2.5 text-xs font-semibold"
                          onClick={() => submitReply(comment.id)}
                        >
                          <Send className="size-3" aria-hidden="true" />
                          <span>Send</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
