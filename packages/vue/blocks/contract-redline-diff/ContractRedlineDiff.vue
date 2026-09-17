<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
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
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ContractRedlineDiffProps>(), {
  contractTitle: 'Master Services Agreement · Redline Review v3.2 vs v3.1',
  counterparty: 'Acme Enterprise Corp',
  counselFirm: 'Davis Polk & Wardwell LLP',
  versionComparison: 'v3.2 (Counterparty Redlines) vs v3.1 (Baseline Executed)',
})

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

const comments = ref<CommentItem[]>(props.initialComments ? [...props.initialComments] : [...defaultComments])
const activeCommentId = ref<string>('c-1')
const selectedFilter = ref<'all' | 'pending' | 'resolved'>('all')
const replyingCommentId = ref<string | null>(null)
const replyDraftText = ref<string>('')
const actionBannerMessage = ref<string | null>(null)

const pendingCount = computed(() => comments.value.filter((c) => c.status === 'pending').length)
const resolvedCount = computed(() => comments.value.filter((c) => c.status === 'resolved').length)

const filteredComments = computed(() => {
  if (selectedFilter.value === 'pending') {
    return comments.value.filter((c) => c.status === 'pending')
  }
  if (selectedFilter.value === 'resolved') {
    return comments.value.filter((c) => c.status === 'resolved')
  }
  return comments.value
})

function selectComment(id: string, clauseId?: string) {
  activeCommentId.value = id
  if (clauseId && typeof document !== 'undefined') {
    const el = document.getElementById(clauseId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

function toggleAcceptTweak(id: string) {
  const comment = comments.value.find((c) => c.id === id)
  if (comment) {
    if (comment.status === 'pending') {
      comment.status = 'resolved'
      actionBannerMessage.value = `Accepted proposed language for "${comment.clauseTitle}"`
    } else {
      comment.status = 'pending'
      actionBannerMessage.value = `Reopened review for "${comment.clauseTitle}"`
    }
  }
}

function handleAcceptAll() {
  comments.value.forEach((c) => {
    c.status = 'resolved'
  })
  actionBannerMessage.value = 'All 3 pending redlines and attorney comments have been accepted into draft v3.3'
}

function handleRejectAll() {
  comments.value.forEach((c) => {
    c.status = 'pending'
  })
  actionBannerMessage.value = 'Redline proposals flagged for revision. Counterparty notified of rejection.'
}

function toggleReply(id: string) {
  if (replyingCommentId.value === id) {
    replyingCommentId.value = null
    replyDraftText.value = ''
  } else {
    replyingCommentId.value = id
    replyDraftText.value = ''
  }
}

function submitReply(id: string) {
  if (!replyDraftText.value.trim()) return
  actionBannerMessage.value = `Reply posted to counsel thread on ${comments.value.find((c) => c.id === id)?.clauseTitle}`
  replyingCommentId.value = null
  replyDraftText.value = ''
}
</script>

<template>
  <div data-slot="contract-redline-diff" :class="cn('bg-background text-foreground w-full space-y-6', props.class)">
    <!-- Header Section -->
    <header class="border-border bg-card rounded-xl border p-5 shadow-xs sm:p-6">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              CLM Contract Workspace &bull; MSA-2026-0882
            </span>
            <Badge
              v-if="pendingCount > 0"
              variant="outline"
              class="border-amber-500/30 bg-amber-500/10 font-mono text-xs font-semibold whitespace-normal text-amber-700 dark:text-amber-400"
            >
              <span class="mr-1.5 size-1.5 rounded-full bg-amber-500"></span>
              {{ pendingCount }} Pending Redlines &bull; {{ resolvedCount }} Resolved
            </Badge>
            <Badge
              wrap
              v-else
              variant="outline"
              class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400"
            >
              <CheckCircle2 class="mr-1 size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              All Changes Accepted &bull; Ready for Execution
            </Badge>
          </div>

          <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            {{ props.contractTitle }}
          </h1>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
            <div class="text-muted-foreground flex items-center gap-1.5">
              <span class="text-foreground font-medium">Counterparty:</span>
              <span>{{ props.counterparty }}</span>
            </div>
            <span class="text-muted-foreground/40 hidden sm:inline">&bull;</span>
            <div class="text-muted-foreground flex items-center gap-1.5">
              <span class="text-foreground font-medium">Outside Counsel:</span>
              <span>{{ props.counselFirm }}</span>
            </div>
            <span class="text-muted-foreground/40 hidden sm:inline">&bull;</span>
            <div class="text-muted-foreground flex items-center gap-1.5">
              <History class="size-3.5" aria-hidden="true" />
              <span>{{ props.versionComparison }}</span>
            </div>
          </div>
        </div>

        <!-- Header Action Controls -->
        <div class="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium" @click="handleRejectAll">
            <XCircle class="text-muted-foreground size-4" aria-hidden="true" />
            <span>Reject Changes</span>
          </Button>

          <Button variant="default" size="sm" class="gap-1.5 text-xs font-semibold shadow-xs" @click="handleAcceptAll">
            <Check class="size-4" aria-hidden="true" />
            <span>Accept All Changes</span>
          </Button>
        </div>
      </div>

      <!-- Action Feedback Banner -->
      <div
        v-if="actionBannerMessage"
        class="border-primary/20 bg-primary/5 mt-4 flex items-center justify-between rounded-lg border px-4 py-2.5 text-xs"
      >
        <div class="text-foreground flex items-center gap-2 font-medium">
          <Sparkles class="text-primary size-4 shrink-0" aria-hidden="true" />
          <span>{{ actionBannerMessage }}</span>
        </div>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded p-1 focus-visible:ring-2 focus-visible:outline-none"
          @click="actionBannerMessage = null"
          aria-label="Dismiss notification"
        >
          <X class="size-3.5" />
        </button>
      </div>
    </header>

    <!-- 4 Redline Summary Metric Cards -->
    <section aria-label="Redline metrics overview" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Metric 1: Additions / Insertions -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-center justify-between">
            <CardTitle class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Additions / Insertions
            </CardTitle>
            <div class="rounded-md bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
              <FilePlus2 class="size-4" aria-hidden="true" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-1 p-4 pt-0">
          <p class="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            +14 Clauses / Sentences
          </p>
          <p class="text-muted-foreground text-xs leading-relaxed">
            +620 words &bull; Enhanced SLA credits, audit rights &amp; ML carve-outs
          </p>
        </CardContent>
      </Card>

      <!-- Metric 2: Deletions / Removals -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-center justify-between">
            <CardTitle class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Deletions / Removals
            </CardTitle>
            <div class="rounded-md bg-rose-500/10 p-1.5 text-rose-600 dark:text-rose-400">
              <FileMinus2 class="size-4" aria-hidden="true" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-1 p-4 pt-0">
          <p class="font-mono text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            -8 Clauses Struck Through
          </p>
          <p class="text-muted-foreground text-xs leading-relaxed">
            -310 words &bull; Excised unilateral termination &amp; uncapped liability
          </p>
        </CardContent>
      </Card>

      <!-- Metric 3: Pending Review Comments -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-center justify-between">
            <CardTitle class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Review Comments
            </CardTitle>
            <div class="rounded-md bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400">
              <MessageSquare class="size-4" aria-hidden="true" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-1 p-4 pt-0">
          <p class="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {{ pendingCount }} Open Counsel Comments
          </p>
          <p class="text-muted-foreground text-xs leading-relaxed">
            {{ resolvedCount }} resolved &bull; 2 require General Counsel sign-off
          </p>
        </CardContent>
      </Card>

      <!-- Metric 4: Liability Cap Shift -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-center justify-between">
            <CardTitle class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Liability Cap Shift
            </CardTitle>
            <div class="bg-primary/10 text-primary rounded-md p-1.5">
              <Scale class="size-4" aria-hidden="true" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-1 p-4 pt-0">
          <p class="text-primary font-mono text-2xl font-bold tracking-tight">$1.0M &rarr; $2.5M Super-Cap</p>
          <p class="text-muted-foreground text-xs leading-relaxed">
            Shifted from 1x annual fees to 2.5x aggregate contract liability
          </p>
        </CardContent>
      </Card>
    </section>

    <!-- 2-Column Redline Workspace -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
      <!-- Left Column: Redlined Document Prose -->
      <main class="space-y-6 lg:col-span-8">
        <div class="border-border bg-card rounded-xl border shadow-xs">
          <!-- Document Controls & Legend Top Bar -->
          <div class="border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5">
            <div class="flex items-center gap-2">
              <FileText class="text-primary size-4" aria-hidden="true" />
              <span class="text-foreground text-xs font-semibold sm:text-sm">
                Master Services Agreement (MSA) &bull; Draft v3.2
              </span>
            </div>

            <!-- Visual Legend -->
            <div class="flex flex-wrap items-center gap-3 text-xs">
              <div class="flex items-center gap-1.5">
                <span class="inline-block h-3 w-5 rounded border border-emerald-500/30 bg-emerald-500/20"></span>
                <span class="text-muted-foreground">Insertion (Acme Counsel)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="inline-block h-3 w-5 rounded border border-rose-500/30 bg-rose-500/20"></span>
                <span class="text-muted-foreground">Deletion (Struck Out)</span>
              </div>
            </div>
          </div>

          <!-- Document Content Body -->
          <div class="divide-border space-y-8 divide-y px-5 py-6 sm:px-8">
            <!-- Section 2: Intellectual Property & Data Ownership -->
            <section id="clause-2-4" class="scroll-mt-6 space-y-3 pt-6 first:pt-0">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <h2 class="text-foreground text-sm font-bold tracking-tight sm:text-base">
                    Section 2 &bull; Intellectual Property &amp; Customer Data
                  </h2>
                  <Badge
                    wrap
                    variant="outline"
                    class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
                  >
                    [RESOLVED] &bull; § 2.4 ML Carve-out
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs"
                  @click="selectComment('c-4', 'clause-2-4')"
                >
                  <MessageSquare class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>View Resolution</span>
                </Button>
              </div>

              <div class="border-border bg-muted/20 space-y-3 rounded-lg border p-4 text-xs leading-relaxed sm:text-sm">
                <p class="text-foreground">
                  <strong class="text-foreground font-semibold">2.4 Proprietary Rights &amp; Restrictions.</strong>
                  Customer retains all right, title, and interest in and to Customer Data, including all Intellectual
                  Property Rights therein. Provider shall not acquire any ownership interest in or rights to Customer
                  Data, except for the limited license granted herein to perform the Services.
                  <span
                    class="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400"
                  >
                    Under no circumstances shall Provider utilize, parse, vectorize, or ingest Customer Data,
                    confidential telemetry, or user communications to train, fine-tune, or benchmark any public or
                    proprietary artificial intelligence, large language, or algorithmic model without express prior
                    written addendum.
                  </span>
                </p>
              </div>
            </section>

            <!-- Section 4: Service Level Agreements -->
            <section id="clause-4-2" class="scroll-mt-6 space-y-3 pt-8">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <h2 class="text-foreground text-sm font-bold tracking-tight sm:text-base">
                    Section 4 &bull; Service Level Agreements &amp; Availability Commitments
                  </h2>
                  <Badge
                    wrap
                    variant="outline"
                    class="border-amber-500/30 bg-amber-500/10 font-mono text-xs text-amber-700 dark:text-amber-400"
                  >
                    [DIFF-4.2] &bull; 2 Pending Redlines
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  :class="
                    cn(
                      'h-7 gap-1.5 px-2.5 text-xs',
                      activeCommentId === 'c-1'
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground',
                    )
                  "
                  @click="selectComment('c-1', 'clause-4-2')"
                >
                  <MessageSquare class="size-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Comment #1 &bull; Sarah Lin</span>
                </Button>
              </div>

              <div
                :class="
                  cn(
                    'border-border bg-card space-y-4 rounded-lg border p-4 text-xs leading-relaxed transition-colors sm:p-5 sm:text-sm',
                    activeCommentId === 'c-1' ? 'ring-primary/40 ring-2' : '',
                  )
                "
              >
                <p class="text-foreground">
                  <strong class="text-foreground font-semibold">4.1 Monthly Uptime Commitment.</strong>
                  Provider warrants that the Production Cloud Service will achieve a Monthly Uptime Percentage of no
                  less than
                  <span
                    class="rounded bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 line-through decoration-rose-500/60 dark:text-rose-400"
                  >
                    ninety-nine and one-half percent (99.5%)
                  </span>
                  <span
                    class="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400"
                  >
                    ninety-nine and ninety-five hundredths percent (99.95%)
                  </span>
                  during each calendar billing month of the applicable Order Term (&ldquo;Service Level
                  Standard&rdquo;).
                </p>

                <p class="text-foreground">
                  <strong class="text-foreground font-semibold"
                    >4.2 SLA Failure Remedies &amp; Maintenance Notice.</strong
                  >
                  If Provider fails to meet the Service Level Standard for any calendar month, Customer shall be
                  entitled to an immediate credit against future invoices equal to
                  <span
                    class="rounded bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 line-through decoration-rose-500/60 dark:text-rose-400"
                  >
                    ten percent (10%)
                  </span>
                  <span
                    class="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400"
                  >
                    twenty-five percent (25%)
                  </span>
                  of the prorated monthly fees for such month. Scheduled Maintenance windows shall occur solely between
                  01:00 and 04:00 UTC on Sunday mornings and require no less than
                  <span
                    class="rounded bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 line-through decoration-rose-500/60 dark:text-rose-400"
                  >
                    forty-eight (48) hours
                  </span>
                  <span
                    class="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400"
                  >
                    seven (7) business days
                  </span>
                  advance electronic notice to Customer&rsquo;s Lead SRE contact.
                </p>
              </div>
            </section>

            <!-- Section 8: Limitation of Liability -->
            <section id="clause-8-1" class="scroll-mt-6 space-y-3 pt-8">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <h2 class="text-foreground text-sm font-bold tracking-tight sm:text-base">
                    Section 8 &bull; Limitation of Liability &amp; Super-Cap Allocation
                  </h2>
                  <Badge
                    wrap
                    variant="outline"
                    class="border-rose-500/30 bg-rose-500/10 font-mono text-xs font-semibold text-rose-700 dark:text-rose-400"
                  >
                    [DIFF-8.1] &bull; HIGH IMPACT SHIFT
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  :class="
                    cn(
                      'h-7 gap-1.5 px-2.5 text-xs',
                      activeCommentId === 'c-2'
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground',
                    )
                  "
                  @click="selectComment('c-2', 'clause-8-1')"
                >
                  <MessageSquare class="size-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Comment #2 &bull; Marcus Vance</span>
                </Button>
              </div>

              <div
                :class="
                  cn(
                    'border-border bg-card space-y-4 rounded-lg border p-4 text-xs leading-relaxed transition-colors sm:p-5 sm:text-sm',
                    activeCommentId === 'c-2' ? 'ring-primary/40 ring-2' : '',
                  )
                "
              >
                <p class="text-foreground font-mono text-xs leading-relaxed uppercase">
                  <strong class="text-foreground font-bold">8.1 AGGREGATE LIABILITY CAP.</strong>
                  EXCEPT FOR LIABILITIES ARISING FROM A BREACH OF CONFIDENTIALITY UNDER SECTION 6, FRAUD, OR
                  INDEMNIFICATION OBLIGATIONS UNDER SECTION 10, NEITHER PARTY&rsquo;S MAXIMUM AGGREGATE LIABILITY UNDER
                  THIS AGREEMENT SHALL EXCEED
                  <span
                    class="rounded bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 line-through decoration-rose-500/60 dark:text-rose-400"
                  >
                    THE TOTAL FEES ACTUALLY PAID BY CUSTOMER TO PROVIDER IN THE TWELVE (12) MONTHS PRECEDING THE EVENT
                    GIVING RISE TO LIABILITY.
                  </span>
                  <span
                    class="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400"
                  >
                    THE GREATER OF TWO MILLION FIVE HUNDRED THOUSAND UNITED STATES DOLLARS ($2,500,000 USD) OR TWO AND
                    ONE-HALF TIMES (2.5X) THE AGGREGATE FEES PAYABLE OVER THE ENTIRE ORDER FORM DURATION
                    (&ldquo;SUPER-CAP&rdquo;).
                  </span>
                </p>

                <p class="text-foreground">
                  <strong class="text-foreground font-semibold">8.2 Direct Damages Carve-Out.</strong>
                  Notwithstanding anything to the contrary, the mutual waiver of consequential damages in Section 8.3
                  shall not preclude or limit recovery of
                  <span
                    class="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400"
                  >
                    reasonable third-party forensic incident investigation expenses, statutory breach notification
                    mailings, and credit monitoring services required under GDPR, HIPAA, or State Data Privacy laws.
                  </span>
                </p>
              </div>
            </section>

            <!-- Section 12: Governing Law & Arbitration -->
            <section id="clause-12-3" class="scroll-mt-6 space-y-3 pt-8">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <h2 class="text-foreground text-sm font-bold tracking-tight sm:text-base">
                    Section 12 &bull; Governing Law, Venue &amp; Arbitration
                  </h2>
                  <Badge wrap variant="outline" class="border-primary/30 bg-primary/10 text-primary font-mono text-xs">
                    [DIFF-12.3] &bull; Modified Venue
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  :class="
                    cn(
                      'h-7 gap-1.5 px-2.5 text-xs',
                      activeCommentId === 'c-3'
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground',
                    )
                  "
                  @click="selectComment('c-3', 'clause-12-3')"
                >
                  <MessageSquare class="text-primary size-3.5" />
                  <span>Comment #3 &bull; Elena Rostova</span>
                </Button>
              </div>

              <div
                :class="
                  cn(
                    'border-border bg-card space-y-4 rounded-lg border p-4 text-xs leading-relaxed transition-colors sm:p-5 sm:text-sm',
                    activeCommentId === 'c-3' ? 'ring-primary/40 ring-2' : '',
                  )
                "
              >
                <p class="text-foreground">
                  <strong class="text-foreground font-semibold">12.1 Applicable Law.</strong>
                  This Agreement shall be governed by, construed, and enforced in accordance with the substantive laws
                  of the State of Delaware, without reference to its conflict-of-law principles.
                </p>

                <p class="text-foreground">
                  <strong class="text-foreground font-semibold"
                    >12.3 Binding Commercial Arbitration &amp; Fee Recovery.</strong
                  >
                  Any controversy, dispute, or claim arising out of or relating to this Agreement, or the breach
                  thereof, shall be resolved by
                  <span
                    class="rounded bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 line-through decoration-rose-500/60 dark:text-rose-400"
                  >
                    the state or federal courts situated in Wilmington, Delaware.
                  </span>
                  <span
                    class="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400"
                  >
                    binding arbitration administered by the American Arbitration Association (AAA) in accordance with
                    its Commercial Arbitration Rules, before a single neutral arbitrator seated in the City and State of
                    New York.
                  </span>
                  <span
                    class="rounded bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 underline decoration-emerald-500/40 dark:text-emerald-400"
                  >
                    The prevailing party in any proceeding to enforce or interpret this Agreement shall be entitled to
                    recover from the non-prevailing party all reasonable attorneys&rsquo; fees, arbitrator compensation,
                    and expert witness disbursements incurred in connection therewith.
                  </span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <!-- Right Column: Attorney Comments & Negotiations Sidebar -->
      <aside class="space-y-4 lg:sticky lg:top-6 lg:col-span-4">
        <div class="border-border bg-card space-y-4 rounded-xl border p-4 shadow-xs">
          <!-- Sidebar Header -->
          <div class="flex items-center justify-between pb-1">
            <div class="flex items-center gap-2">
              <MessageSquare class="text-primary size-4" aria-hidden="true" />
              <h2 class="text-foreground text-sm font-bold tracking-tight">Counsel Comments &amp; Markups</h2>
            </div>
            <span class="text-muted-foreground font-mono text-xs font-medium">
              {{ filteredComments.length }} items
            </span>
          </div>

          <!-- Filter Pills -->
          <div class="bg-muted/60 flex items-center gap-1.5 rounded-lg p-1">
            <button
              type="button"
              :class="
                cn(
                  'focus-visible:ring-ring flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedFilter === 'all'
                    ? 'bg-background text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="selectedFilter = 'all'"
            >
              All ({{ comments.length }})
            </button>
            <button
              type="button"
              :class="
                cn(
                  'focus-visible:ring-ring flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedFilter === 'pending'
                    ? 'bg-background text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="selectedFilter = 'pending'"
            >
              Pending ({{ pendingCount }})
            </button>
            <button
              type="button"
              :class="
                cn(
                  'focus-visible:ring-ring flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedFilter === 'resolved'
                    ? 'bg-background text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="selectedFilter = 'resolved'"
            >
              Resolved ({{ resolvedCount }})
            </button>
          </div>

          <Separator />

          <!-- Comments Feed -->
          <div class="space-y-3.5">
            <Card
              v-for="comment in filteredComments"
              :key="comment.id"
              role="button"
              tabindex="0"
              :aria-pressed="activeCommentId === comment.id"
              :class="
                cn(
                  'border-border hover:border-primary/40 focus-visible:ring-ring cursor-pointer transition-all focus-visible:ring-2 focus-visible:outline-none',
                  activeCommentId === comment.id ? 'border-primary/60 bg-muted/20 ring-primary/30 ring-1' : 'bg-card',
                  comment.status === 'resolved' ? 'opacity-75' : '',
                )
              "
              @click="selectComment(comment.id, comment.clauseId)"
              @keydown.enter="selectComment(comment.id, comment.clauseId)"
              @keydown.space.prevent="selectComment(comment.id, comment.clauseId)"
            >
              <CardHeader class="p-3.5 pb-2">
                <div class="flex flex-wrap items-start justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <Avatar class="border-border size-7 border">
                      <AvatarFallback class="bg-primary/10 text-primary font-mono text-xs font-bold">
                        {{ comment.authorInitials }}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p class="text-foreground text-xs leading-none font-semibold">
                        {{ comment.authorName }}
                      </p>
                      <p class="text-muted-foreground mt-0.5 max-w-[170px] truncate text-xs">
                        {{ comment.authorRole }}
                      </p>
                    </div>
                  </div>

                  <Badge
                    wrap
                    variant="outline"
                    :class="
                      cn(
                        'shrink-0 font-mono text-xs',
                        comment.status === 'resolved'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
                      )
                    "
                  >
                    {{ comment.status === 'resolved' ? 'Resolved' : 'Pending' }}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent class="space-y-2.5 p-3.5 pt-0 text-xs">
                <!-- Clause context pill -->
                <div class="bg-muted/50 text-muted-foreground rounded px-2 py-1 font-mono text-xs">
                  {{ comment.clauseTitle }}
                </div>

                <!-- Comment narrative -->
                <p class="text-foreground leading-relaxed">&ldquo;{{ comment.commentText }}&rdquo;</p>

                <!-- Proposed change box -->
                <div class="rounded border border-emerald-500/20 bg-emerald-500/5 p-2 text-xs">
                  <span class="mb-0.5 block font-semibold text-emerald-700 dark:text-emerald-400">
                    Proposed Redline Tweak:
                  </span>
                  <span class="text-muted-foreground">
                    {{ comment.proposedChange }}
                  </span>
                </div>

                <div class="text-muted-foreground flex items-center justify-between pt-1 text-xs">
                  <span class="flex items-center gap-1">
                    <Clock class="size-3" aria-hidden="true" />
                    {{ comment.timestamp }}
                  </span>
                </div>
              </CardContent>

              <CardFooter class="border-border bg-muted/10 flex items-center justify-between gap-2 border-t p-2.5">
                <Button variant="outline" size="sm" class="h-7 gap-1 text-xs" @click.stop="toggleReply(comment.id)">
                  <MessageSquareReply class="text-muted-foreground size-3" aria-hidden="true" />
                  <span>Reply</span>
                </Button>

                <Button
                  :variant="comment.status === 'resolved' ? 'outline' : 'default'"
                  size="sm"
                  :class="
                    cn('h-7 gap-1 text-xs', comment.status === 'resolved' ? 'text-muted-foreground' : 'font-medium')
                  "
                  @click.stop="toggleAcceptTweak(comment.id)"
                >
                  <Check class="size-3" aria-hidden="true" />
                  <span>{{ comment.status === 'resolved' ? 'Reopen' : 'Accept Tweak' }}</span>
                </Button>
              </CardFooter>

              <!-- Inline Thread Reply Input -->
              <div
                v-if="replyingCommentId === comment.id"
                class="border-border bg-background space-y-2 border-t p-3"
                @click.stop
              >
                <textarea
                  v-model="replyDraftText"
                  placeholder="Draft reply to counsel thread..."
                  class="border-border bg-card placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-none rounded-md border p-2 text-xs focus-visible:ring-2 focus-visible:outline-none"
                  rows="2"
                ></textarea>
                <div class="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" class="h-6 px-2 text-xs" @click="replyingCommentId = null">
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    class="h-6 gap-1 px-2.5 text-xs font-semibold"
                    @click="submitReply(comment.id)"
                  >
                    <Send class="size-3" aria-hidden="true" />
                    <span>Send</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
