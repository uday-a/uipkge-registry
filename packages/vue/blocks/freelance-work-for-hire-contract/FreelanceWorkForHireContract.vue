<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface FreelanceWorkForHireContractProps {
  class?: HTMLAttributes['class']
  initialSigned?: boolean
  initialInitialsCompleted?: boolean
}

const props = withDefaults(defineProps<FreelanceWorkForHireContractProps>(), {
  initialSigned: false,
  initialInitialsCompleted: false,
})

const initial1Completed = ref(props.initialInitialsCompleted || props.initialSigned)
const initial2Completed = ref(props.initialInitialsCompleted || props.initialSigned)
const isSigned = ref(props.initialSigned)
const signerName = ref('Elena Rostova')
const signatureFont = ref<'serif' | 'script' | 'sans'>('serif')
const eConsentAgreed = ref(true)
const downloadSuccess = ref(false)

const completedCount = computed(() => {
  let count = 0
  if (initial1Completed.value) count++
  if (initial2Completed.value) count++
  if (isSigned.value) count++
  return count
})

const canSign = computed(() => {
  return initial1Completed.value && initial2Completed.value && eConsentAgreed.value && !isSigned.value
})

function toggleInitial1() {
  if (isSigned.value) return
  initial1Completed.value = !initial1Completed.value
}

function toggleInitial2() {
  if (isSigned.value) return
  initial2Completed.value = !initial2Completed.value
}

function signContract() {
  if (!canSign.value) return
  isSigned.value = true
}

function resetWorkflow() {
  initial1Completed.value = false
  initial2Completed.value = false
  isSigned.value = false
  downloadSuccess.value = false
}

function handleDownload() {
  downloadSuccess.value = true
  setTimeout(() => {
    downloadSuccess.value = false
  }, 2500)
}

function handlePrint() {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

function scrollToInitial1() {
  const el = document.getElementById('vue-initial-marker-ip')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function scrollToInitial2() {
  const el = document.getElementById('vue-initial-marker-kill-fee')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function scrollToSignaturePad() {
  const el = document.getElementById('vue-signature-pad')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <div data-slot="freelance-work-for-hire-contract" :class="cn('bg-background text-foreground w-full', props.class)">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <!-- Top Agreement Header -->
      <header class="border-border bg-card mb-6 rounded-xl border p-5 shadow-xs sm:p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-muted-foreground text-xs font-medium">Contract Ref:</span>
              <span class="text-foreground font-mono text-xs font-semibold tabular-nums">#MSA-2026-4892</span>
              <span class="text-muted-foreground text-xs">&bull;</span>
              <span class="text-muted-foreground text-xs font-medium">Total Value:</span>
              <span class="text-foreground font-mono text-xs font-bold tabular-nums">$24,000.00 USD</span>
              <span class="text-muted-foreground text-xs">&bull;</span>
              <Badge
                wrap
                v-if="isSigned"
                class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              >
                <BadgeCheck class="size-3.5" />
                <span>Fully Executed &amp; Legally Binding</span>
              </Badge>
              <Badge
                wrap
                v-else-if="initial1Completed && initial2Completed"
                class="gap-1.5 border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
              >
                <PenTool class="size-3.5" />
                <span>Ready for Signature</span>
              </Badge>
              <Badge
                wrap
                v-else
                class="gap-1.5 border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
              >
                <AlertCircle class="size-3.5" />
                <span>
                  Ready for Signature &bull; {{ (initial1Completed ? 0 : 1) + (initial2Completed ? 0 : 1) }} Checkpoints
                  Pending
                </span>
              </Badge>
            </div>
            <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              Independent Contractor Agreement &amp; Work-for-Hire Assignment
            </h1>
            <div class="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
              <span class="flex items-center gap-1.5">
                <Scale class="text-primary size-3.5" />
                <span>Governing Law: <strong>State of Delaware, US</strong></span>
              </span>
              <span class="flex items-center gap-1.5">
                <Calendar class="text-primary size-3.5" />
                <span>Effective Date: <strong>September 01, 2026</strong></span>
              </span>
              <span class="flex items-center gap-1.5">
                <ShieldCheck class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Work-for-Hire (17 U.S.C. &sect; 101)</span>
              </span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <Button variant="outline" size="sm" class="gap-1.5 text-xs shadow-xs" @click="handlePrint">
              <Printer class="size-4" />
              <span>Print</span>
            </Button>
            <Button
              aria-label="Download attachment"
              variant="outline"
              size="sm"
              class="gap-1.5 text-xs shadow-xs"
              @click="handleDownload"
            >
              <Download class="size-4" />
              <span>{{ downloadSuccess ? 'Downloading PDF...' : 'Download Draft PDF' }}</span>
            </Button>
            <Button
              v-if="!isSigned"
              size="sm"
              class="gap-1.5 text-xs font-semibold shadow-xs"
              @click="scrollToSignaturePad"
            >
              <PenTool class="size-3.5" />
              <span>Sign Contract</span>
            </Button>
            <Button
              v-else
              variant="outline"
              size="sm"
              class="border-muted-foreground/30 gap-1.5 text-xs"
              @click="resetWorkflow"
            >
              <RotateCcw class="size-3.5" />
              <span>Reset Demo</span>
            </Button>
          </div>
        </div>
      </header>

      <!-- 2-Column Agreement Layout -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <!-- Left Column: Contract Document Terms -->
        <main class="space-y-6 lg:col-span-8">
          <div class="border-border bg-card rounded-xl border p-6 shadow-xs sm:p-8">
            <!-- Document Header Banner -->
            <div class="border-border border-b pb-6 text-center">
              <div
                class="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
              >
                <Scale class="size-3.5" />
                <span>MASTER SERVICES AGREEMENT (MSA) &bull; WORK-FOR-HIRE</span>
              </div>
              <h2 class="text-foreground mt-3 text-lg font-bold tracking-tight uppercase sm:text-xl">
                Independent Contractor Master Services Agreement
              </h2>
              <p class="text-muted-foreground mt-1 text-xs">
                Proprietary Rights Assignment &bull; Milestone Payment Schedule &bull; Kill Fee Terms
              </p>
            </div>

            <!-- Parties Comparison Matrix -->
            <div class="my-6">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <!-- Client Card -->
                <div class="border-border/80 bg-muted/20 rounded-lg border p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground text-xs font-bold tracking-wider uppercase">The Client</span>
                    <Badge wrap variant="outline" class="font-mono text-xs">Principal</Badge>
                  </div>
                  <div class="mt-2.5 flex items-center gap-3">
                    <Avatar class="border-border size-10 border">
                      <AvatarFallback class="bg-primary/10 text-primary font-bold">UP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p class="text-foreground text-sm font-bold">UIPKGE Technologies Inc.</p>
                      <p class="text-muted-foreground text-xs">Delaware C-Corp &bull; File #6849201</p>
                    </div>
                  </div>
                  <Separator class="my-3" />
                  <div class="text-muted-foreground space-y-1 font-mono text-xs">
                    <p class="flex justify-between">
                      <span>Address:</span>
                      <span class="text-foreground text-right font-sans">548 Market St, Suite 29000, SF, CA 94104</span>
                    </p>
                    <p class="flex justify-between">
                      <span>Authorized Signer:</span>
                      <span class="text-foreground font-sans font-semibold">David Chen (CTO)</span>
                    </p>
                    <p class="flex justify-between">
                      <span>Billing Contact:</span>
                      <span class="text-foreground font-sans">legal@uipkge.dev</span>
                    </p>
                  </div>
                </div>

                <!-- Contractor Card -->
                <div class="border-border/80 bg-muted/20 rounded-lg border p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground text-xs font-bold tracking-wider uppercase">The Contractor</span>
                    <Badge wrap variant="outline" class="font-mono text-xs">Independent Pro</Badge>
                  </div>
                  <div class="mt-2.5 flex items-center gap-3">
                    <Avatar class="border-border size-10 border">
                      <AvatarFallback class="bg-primary/10 text-primary font-bold">ER</AvatarFallback>
                    </Avatar>
                    <div>
                      <p class="text-foreground text-sm font-bold">Elena Rostova Design LLC</p>
                      <p class="text-muted-foreground text-xs">New York LLC &bull; EIN: XX-XXX4910</p>
                    </div>
                  </div>
                  <Separator class="my-3" />
                  <div class="text-muted-foreground space-y-1 font-mono text-xs">
                    <p class="flex justify-between">
                      <span>Address:</span>
                      <span class="text-foreground text-right font-sans">350 5th Avenue, Suite 4100, NY, NY 10118</span>
                    </p>
                    <p class="flex justify-between">
                      <span>Principal Signer:</span>
                      <span class="text-foreground font-sans font-semibold">Elena Rostova (Design Architect)</span>
                    </p>
                    <p class="flex justify-between">
                      <span>Direct Contact:</span>
                      <span class="text-foreground font-sans">elena@rostovadesign.io</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scope of Work Executive Summary Box -->
            <div class="bg-muted/30 border-border mb-8 rounded-lg border p-4 sm:p-5">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                    >Statement of Work (SOW-01)</span
                  >
                  <h3 class="text-foreground text-sm font-bold sm:text-base">
                    Full-Stack Design System Component Architecture &amp; Documentation
                  </h3>
                </div>
                <Badge wrap variant="secondary" class="self-start font-mono text-xs sm:self-auto"
                  >Fixed-Price Milestone</Badge
                >
              </div>
              <p class="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
                Contractor shall architect, code, test, and document a multi-framework component registry matching
                enterprise production craft standards, comprising OKLCH design tokens, 50 headless Vue &amp; React UI
                primitives, 50 composed application blocks, accessibility test suites, and interactive Astro live
                documentation.
              </p>
              <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div class="border-border/60 bg-card rounded-md border p-2.5">
                  <p class="text-muted-foreground text-xs font-medium">Total Consideration</p>
                  <p class="text-foreground mt-0.5 font-mono text-base font-bold tabular-nums sm:text-lg">$24,000.00</p>
                  <p class="text-muted-foreground text-xs">100% Milestone-based</p>
                </div>
                <div class="border-border/60 bg-card rounded-md border p-2.5">
                  <p class="text-muted-foreground text-xs font-medium">Payment Terms</p>
                  <p class="text-foreground mt-0.5 text-xs font-bold sm:text-sm">Net 15 Days</p>
                  <p class="text-muted-foreground text-xs">Upon acceptance</p>
                </div>
                <div class="border-border/60 bg-card rounded-md border p-2.5">
                  <p class="text-muted-foreground text-xs font-medium">IP Ownership</p>
                  <p class="text-foreground mt-0.5 text-xs font-bold sm:text-sm">Work-for-Hire</p>
                  <p class="text-muted-foreground text-xs">17 U.S.C. &sect; 101</p>
                </div>
                <div class="border-border/60 bg-card rounded-md border p-2.5">
                  <p class="text-muted-foreground text-xs font-medium">Kill Fee Baseline</p>
                  <p
                    class="text-foreground mt-0.5 font-mono text-base font-bold text-amber-700 tabular-nums sm:text-lg dark:text-amber-400"
                  >
                    25.0%
                  </p>
                  <p class="text-muted-foreground text-xs">On uncompleted</p>
                </div>
              </div>
            </div>

            <!-- Legal Sections Stream -->
            <div class="text-foreground/90 space-y-8 text-xs leading-relaxed sm:text-sm">
              <!-- Section 1: Services & Deliverables Table -->
              <section id="vue-section-1" class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">01</span>
                  <h3 class="text-foreground text-sm font-bold sm:text-base">
                    Services, Milestone Deliverables &amp; Acceptance
                  </h3>
                </div>
                <p class="text-muted-foreground">
                  Contractor agrees to perform the services and provide the specific deliverables set forth in the
                  milestone schedule below. Each deliverable shall undergo formal review by Client within seven (7)
                  business days of submission.
                </p>

                <!-- Itemized Deliverables Table -->
                <div class="border-border overflow-hidden rounded-lg border">
                  <div class="overflow-x-auto">
                    <Table>
                      <TableHeader class="bg-muted/50">
                        <TableRow>
                          <TableHead class="text-xs font-bold">Milestone &amp; Scope</TableHead>
                          <TableHead class="text-xs font-bold">Target Date</TableHead>
                          <TableHead class="text-right text-xs font-bold">Consideration</TableHead>
                          <TableHead class="text-right text-xs font-bold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell class="font-medium">
                            <div class="space-y-0.5">
                              <p class="text-foreground font-semibold">
                                Milestone 1: Architectural Discovery &amp; Token Spec
                              </p>
                              <p class="text-muted-foreground text-xs">
                                OKLCH token set, Tailwind v4 theme bindings, typography scale, and core utilities.
                              </p>
                            </div>
                          </TableCell>
                          <TableCell class="text-muted-foreground font-mono text-xs tabular-nums"
                            >Sep 15, 2026</TableCell
                          >
                          <TableCell class="text-foreground text-right font-mono font-bold tabular-nums">
                            $6,000.00
                            <span class="text-muted-foreground block text-xs font-normal">25% (Deposit)</span>
                          </TableCell>
                          <TableCell class="text-right">
                            <Badge
                              wrap
                              class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                            >
                              <Check class="mr-1 size-3" /> Paid &amp; Settled
                            </Badge>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell class="font-medium">
                            <div class="space-y-0.5">
                              <p class="text-foreground font-semibold">
                                Milestone 2: Core 50 UI Primitives in Vue &amp; React
                              </p>
                              <p class="text-muted-foreground text-xs">
                                50 accessible headless primitives (Reka UI &amp; Radix mirror), CVA variants, and unit
                                test suites.
                              </p>
                            </div>
                          </TableCell>
                          <TableCell class="text-muted-foreground font-mono text-xs tabular-nums"
                            >Oct 15, 2026</TableCell
                          >
                          <TableCell class="text-foreground text-right font-mono font-bold tabular-nums">
                            $10,000.00
                            <span class="text-muted-foreground block text-xs font-normal">41.67%</span>
                          </TableCell>
                          <TableCell class="text-right">
                            <Badge
                              wrap
                              variant="outline"
                              class="border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-700 dark:text-blue-400"
                            >
                              <Clock class="mr-1 size-3" /> Pending Review
                            </Badge>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell class="font-medium">
                            <div class="space-y-0.5">
                              <p class="text-foreground font-semibold">
                                Milestone 3: 50 Composed Application Blocks &amp; Docs
                              </p>
                              <p class="text-muted-foreground text-xs">
                                50 production application domain blocks, Astro documentation pages, story demos, and
                                manifests.
                              </p>
                            </div>
                          </TableCell>
                          <TableCell class="text-muted-foreground font-mono text-xs tabular-nums"
                            >Nov 15, 2026</TableCell
                          >
                          <TableCell class="text-foreground text-right font-mono font-bold tabular-nums">
                            $8,000.00
                            <span class="text-muted-foreground block text-xs font-normal">33.33%</span>
                          </TableCell>
                          <TableCell class="text-right">
                            <Badge wrap variant="secondary" class="text-muted-foreground text-xs font-medium">
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

              <!-- Section 2: Intellectual Property Assignment & Work-for-Hire -->
              <section id="vue-section-2" class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">02</span>
                  <h3 class="text-foreground text-sm font-bold sm:text-base">
                    Intellectual Property Assignment &amp; Work-for-Hire Doctrine
                  </h3>
                </div>
                <div class="text-muted-foreground space-y-2.5">
                  <p>
                    <strong class="text-foreground">2.1 Work-for-Hire Declaration:</strong> Contractor expressly
                    acknowledges and agrees that all original works of authorship, user interface components, software
                    architecture, codebases, design tokens, documentation, graphic assets, and associated inventions
                    prepared, authored, or contributed by Contractor under this Agreement shall constitute a
                    <strong class="text-foreground">&ldquo;Work Made for Hire&rdquo;</strong> as defined under the
                    United States Copyright Act (17 U.S.C. &sect; 101) for the benefit of Client.
                  </p>
                  <p>
                    <strong class="text-foreground">2.2 Absolute Assignment:</strong> To the extent that any Deliverable
                    does not legally qualify as a work made for hire, Contractor hereby irrevocably, unconditionally,
                    and perpetually transfers, assigns, and conveys to Client all worldwide right, title, and interest
                    in and to all Intellectual Property Rights, including patents, copyrights, trade secrets,
                    trademarks, and moral rights, effective immediately upon receipt of full payment for the applicable
                    milestone.
                  </p>
                  <p>
                    <strong class="text-foreground">2.3 Pre-Existing IP &amp; Open-Source Carveout:</strong> Contractor
                    retains sole ownership of pre-existing general toolchains and standard open-source libraries
                    licensed under OSI-approved licenses (MIT/Apache-2.0) incorporated into the Deliverables, granting
                    Client an irrevocable, perpetual, royalty-free, worldwide license to utilize, sub-license, and
                    distribute such pre-existing materials.
                  </p>
                </div>

                <!-- Initial Checkpoint Marker 1 -->
                <div
                  id="vue-initial-marker-ip"
                  :class="
                    cn(
                      'rounded-lg border p-4 transition-all duration-200',
                      initial1Completed
                        ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                        : 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/20 dark:bg-amber-950/20',
                    )
                  "
                >
                  <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                          Contractor Initial Checkpoint &bull; Section 2
                        </span>
                        <Badge
                          wrap
                          v-if="initial1Completed"
                          class="border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                        >
                          <Check class="mr-1 size-3" /> Initialed
                        </Badge>
                        <Badge
                          wrap
                          v-else
                          class="border-amber-500/40 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
                        >
                          Action Required
                        </Badge>
                      </div>
                      <p class="text-muted-foreground text-xs">
                        Contractor hereby irrevocably assigns all right, title, and interest in deliverables upon
                        receipt of full payment under 17 U.S.C. &sect; 101.
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      :disabled="isSigned"
                      :variant="initial1Completed ? 'outline' : 'default'"
                      :class="
                        cn(
                          'shrink-0 gap-2 text-xs font-medium shadow-xs transition-all',
                          initial1Completed
                            ? 'border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300'
                            : 'bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600',
                        )
                      "
                      @click="toggleInitial1"
                    >
                      <template v-if="initial1Completed">
                        <span class="text-sm font-semibold italic">ER</span>
                        <span class="font-mono text-xs tabular-nums">&bull; Elena Rostova [Initialed]</span>
                      </template>
                      <template v-else>
                        <Pen class="size-3.5" />
                        <span>Click to Initial [ER]</span>
                      </template>
                    </Button>
                  </div>
                </div>
              </section>

              <Separator />

              <!-- Section 3: Compensation & Invoicing -->
              <section id="vue-section-3" class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">03</span>
                  <h3 class="text-foreground text-sm font-bold sm:text-base">
                    Compensation, Invoicing &amp; Net 15 Terms
                  </h3>
                </div>
                <div class="text-muted-foreground space-y-2.5">
                  <p>
                    <strong class="text-foreground">3.1 Aggregate Consideration:</strong> In full consideration for the
                    timely and satisfactory completion of the Deliverables, Client shall pay Contractor an aggregate
                    fixed fee of
                    <strong class="text-foreground font-mono tabular-nums">$24,000.00 USD</strong> according to the
                    milestone schedule in Section 1.
                  </p>
                  <p>
                    <strong class="text-foreground">3.2 Invoicing &amp; Net 15 Terms:</strong> Contractor shall submit
                    an electronic invoice upon delivery of each milestone. Client shall remit payment within
                    <strong class="text-foreground">fifteen (15) calendar days (Net 15)</strong> from the date of formal
                    written acceptance via ACH direct deposit or international wire. Overdue undisputed balances shall
                    accrue statutory interest at 1.5% per month.
                  </p>
                  <p>
                    <strong class="text-foreground">3.3 Taxes &amp; Independent Status:</strong> Contractor operates
                    strictly as an independent contractor. Contractor is solely responsible for reporting and remitting
                    all applicable federal, state, local, and self-employment taxes (IRS Form 1099-NEC). No employment
                    benefits, healthcare, retirement, or worker&rsquo;s compensation coverage are provided.
                  </p>
                </div>
              </section>

              <Separator />

              <!-- Section 4: Termination & Kill Fee -->
              <section id="vue-section-4" class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">04</span>
                  <h3 class="text-foreground text-sm font-bold sm:text-base">Termination &amp; 25% Kill Fee Policy</h3>
                </div>
                <div class="text-muted-foreground space-y-2.5">
                  <p>
                    <strong class="text-foreground">4.1 Convenience Termination:</strong> Either party may terminate
                    this Agreement without cause upon providing
                    <strong class="text-foreground">fourteen (14) calendar days</strong> prior written notice to the
                    other party.
                  </p>
                  <p>
                    <strong class="text-foreground">4.2 Kill Fee Entitlement:</strong> In the event Client elects to
                    terminate this Agreement for convenience prior to final completion, Client shall promptly pay
                    Contractor for: (a) all completed and accepted milestones in full, and (b) a
                    <strong class="text-foreground font-semibold text-amber-700 dark:text-amber-400"
                      >Kill Fee of twenty-five percent (25%)</strong
                    >
                    of the total remaining uncompleted milestone compensation to cover reserved contractor capacity and
                    schedule reallocation.
                  </p>
                  <p>
                    <strong class="text-foreground">4.3 Immediate Handover:</strong> Upon termination, Contractor shall
                    immediately deliver to Client all completed and partially completed work product, Git branches,
                    design system source files, and credentials up to the termination effective date.
                  </p>
                </div>

                <!-- Initial Checkpoint Marker 2 -->
                <div
                  id="vue-initial-marker-kill-fee"
                  :class="
                    cn(
                      'rounded-lg border p-4 transition-all duration-200',
                      initial2Completed
                        ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                        : 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/20 dark:bg-amber-950/20',
                    )
                  "
                >
                  <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                          Contractor Initial Checkpoint &bull; Section 4
                        </span>
                        <Badge
                          wrap
                          v-if="initial2Completed"
                          class="border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                        >
                          <Check class="mr-1 size-3" /> Initialed
                        </Badge>
                        <Badge
                          wrap
                          v-else
                          class="border-amber-500/40 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
                        >
                          Action Required
                        </Badge>
                      </div>
                      <p class="text-muted-foreground text-xs">
                        Acknowledge the 14-day termination notice requirement and 25% kill fee clause on uncompleted
                        milestones.
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      :disabled="isSigned"
                      :variant="initial2Completed ? 'outline' : 'default'"
                      :class="
                        cn(
                          'shrink-0 gap-2 text-xs font-medium shadow-xs transition-all',
                          initial2Completed
                            ? 'border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300'
                            : 'bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600',
                        )
                      "
                      @click="toggleInitial2"
                    >
                      <template v-if="initial2Completed">
                        <span class="text-sm font-semibold italic">ER</span>
                        <span class="font-mono text-xs tabular-nums">&bull; Elena Rostova [Initialed]</span>
                      </template>
                      <template v-else>
                        <Pen class="size-3.5" />
                        <span>Click to Initial [ER]</span>
                      </template>
                    </Button>
                  </div>
                </div>
              </section>

              <Separator />

              <!-- Execution & Signatures Section -->
              <section class="space-y-4 pt-2">
                <div class="flex items-center justify-between">
                  <h3 class="text-foreground text-sm font-bold sm:text-base">Execution &amp; Legal Signatures</h3>
                  <span class="text-muted-foreground font-mono text-xs">2 of 2 Parties Countersigned</span>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <!-- Client Signature Block -->
                  <div class="border-border bg-muted/20 rounded-lg border p-4">
                    <div class="flex items-center justify-between">
                      <p class="text-foreground text-xs font-semibold tracking-wider uppercase">Client Execution</p>
                      <Badge
                        wrap
                        variant="outline"
                        class="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
                      >
                        <Check class="mr-1 size-3" /> Signed &amp; Verified
                      </Badge>
                    </div>
                    <div class="border-border/60 bg-card my-3 rounded-md border p-3 text-center">
                      <p class="text-xl font-medium tracking-wide text-emerald-800 italic dark:text-emerald-300">
                        David Chen
                      </p>
                      <p class="text-muted-foreground mt-0.5 font-mono text-xs">CTO &bull; UIPKGE Technologies Inc.</p>
                    </div>
                    <div class="text-muted-foreground space-y-1 font-mono text-xs">
                      <p class="flex justify-between">
                        <span>Date Executed:</span>
                        <span class="text-foreground font-semibold tabular-nums">Aug 20, 2026 &bull; 14:22 EDT</span>
                      </p>
                      <p class="flex justify-between">
                        <span>Digital Cert:</span>
                        <span class="text-foreground font-semibold">CERT-UIP-2026-991A</span>
                      </p>
                    </div>
                  </div>

                  <!-- Contractor Signature Block -->
                  <div
                    :class="
                      cn(
                        'rounded-lg border p-4 transition-all duration-200',
                        isSigned
                          ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                          : 'border-border bg-muted/10 border-dashed',
                      )
                    "
                  >
                    <div class="flex items-center justify-between">
                      <p class="text-foreground text-xs font-semibold tracking-wider uppercase">Contractor Execution</p>
                      <Badge
                        wrap
                        v-if="isSigned"
                        class="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400"
                      >
                        <Check class="mr-1 size-3" /> Signed
                      </Badge>
                      <Badge
                        wrap
                        v-else
                        class="border-amber-500/40 bg-amber-500/10 font-mono text-xs font-medium text-amber-700 dark:text-amber-400"
                      >
                        Pending Signature
                      </Badge>
                    </div>

                    <div
                      :class="
                        cn(
                          'my-3 rounded-md border p-3 text-center transition-all',
                          isSigned
                            ? 'bg-card border-emerald-500/40'
                            : 'border-muted-foreground/30 bg-muted/20 border-dashed',
                        )
                      "
                    >
                      <template v-if="isSigned">
                        <p
                          :class="
                            cn(
                              'text-xl font-medium tracking-wide text-emerald-800 dark:text-emerald-300',
                              signatureFont === 'serif' && 'font-medium tracking-wide italic',
                              signatureFont === 'script' && 'font-medium tracking-widest italic',
                              signatureFont === 'sans' && 'font-semibold tracking-tight',
                            )
                          "
                        >
                          {{ signerName }}
                        </p>
                        <p class="text-muted-foreground mt-0.5 font-mono text-xs">
                          Principal &bull; Elena Rostova Design LLC
                        </p>
                      </template>
                      <template v-else>
                        <p class="text-muted-foreground text-xs italic">
                          Awaiting contractor electronic execution via sidebar
                        </p>
                        <p class="text-muted-foreground/80 mt-1 text-xs">
                          Complete both initials above to enable signing
                        </p>
                      </template>
                    </div>

                    <div class="text-muted-foreground space-y-1 font-mono text-xs">
                      <p class="flex justify-between">
                        <span>Date Signed:</span>
                        <span class="text-foreground font-semibold tabular-nums">
                          {{ isSigned ? 'Aug 21, 2026 • 11:15 EDT' : 'Pending' }}
                        </span>
                      </p>
                      <p class="flex justify-between">
                        <span>Audit Hash:</span>
                        <span class="text-foreground font-semibold">
                          {{ isSigned ? 'SHA256:4b9a2...e781' : 'Unexecuted' }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        <!-- Right Column: Milestone & Payment Schedule + Signature Action Center -->
        <aside class="space-y-5 lg:sticky lg:top-6 lg:col-span-4 lg:self-start">
          <!-- Contractor Signer Profile Card -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <Avatar class="border-border size-9 border">
                    <AvatarFallback class="bg-primary/10 text-primary text-xs font-bold">ER</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle class="text-sm font-semibold">{{ signerName }}</CardTitle>
                    <CardDescription class="text-xs">Principal Design Architect</CardDescription>
                  </div>
                </div>
                <Badge wrap variant="outline" class="border-primary/30 text-primary font-mono text-xs"
                  >Contractor</Badge
                >
              </div>
            </CardHeader>
            <CardContent class="text-muted-foreground space-y-2 p-4 pt-2 text-xs">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Entity:</span>
                <span class="text-foreground font-medium">Elena Rostova Design LLC</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Tax Status:</span>
                <span class="text-foreground font-medium">W-9 On File (EIN Verified)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Disbursement:</span>
                <span class="text-foreground font-mono tabular-nums">ACH Direct Deposit (&bull;&bull;8842)</span>
              </div>
            </CardContent>
          </Card>

          <!-- Milestone & Payout Schedule Card -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2">
              <div class="flex items-center justify-between">
                <CardTitle class="text-sm font-semibold">Payment Milestones</CardTitle>
                <span class="text-foreground font-mono text-xs font-bold tabular-nums">$24,000.00 USD</span>
              </div>
              <CardDescription class="text-xs">Milestone-based disbursement on acceptance</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3 p-4 pt-2 text-xs">
              <!-- Milestone 1 -->
              <div class="border-border/70 bg-muted/20 rounded-lg border p-3">
                <div class="flex items-center justify-between">
                  <span class="text-foreground font-semibold">1. Discovery &amp; Token Spec</span>
                  <Badge
                    wrap
                    class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    Paid $6,000
                  </Badge>
                </div>
                <div class="text-muted-foreground mt-1.5 flex items-center justify-between">
                  <span>Target: Sep 15, 2026</span>
                  <span class="font-mono tabular-nums">25% Allocation</span>
                </div>
              </div>

              <!-- Milestone 2 -->
              <div class="border-border/70 bg-muted/20 rounded-lg border p-3">
                <div class="flex items-center justify-between">
                  <span class="text-foreground font-semibold">2. Core 50 UI Primitives</span>
                  <Badge
                    wrap
                    variant="outline"
                    class="border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-700 dark:text-blue-400"
                  >
                    Review $10,000
                  </Badge>
                </div>
                <div class="text-muted-foreground mt-1.5 flex items-center justify-between">
                  <span>Target: Oct 15, 2026</span>
                  <span class="font-mono tabular-nums">41.67% Allocation</span>
                </div>
              </div>

              <!-- Milestone 3 -->
              <div class="border-border/70 bg-muted/20 rounded-lg border p-3">
                <div class="flex items-center justify-between">
                  <span class="text-foreground font-semibold">3. 50 Composed Blocks</span>
                  <Badge wrap variant="secondary" class="text-muted-foreground text-xs font-medium"> Due $8,000 </Badge>
                </div>
                <div class="text-muted-foreground mt-1.5 flex items-center justify-between">
                  <span>Target: Nov 15, 2026</span>
                  <span class="font-mono tabular-nums">33.33% Final</span>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="space-y-1.5 pt-1">
                <div class="flex justify-between text-xs">
                  <span class="text-muted-foreground">Payment Progress</span>
                  <span class="text-foreground font-mono font-medium tabular-nums">$6,000 / $24,000 (25%)</span>
                </div>
                <div class="bg-muted flex h-2 w-full overflow-hidden rounded-full">
                  <div class="h-full w-[25%] bg-emerald-500" title="Paid (25%)" />
                  <div class="h-full w-[41.67%] bg-blue-500/60" title="In Review (41.67%)" />
                  <div class="bg-muted-foreground/20 h-full w-[33.33%]" title="Scheduled (33.33%)" />
                </div>
              </div>

              <!-- Kill Fee Calculation Callout -->
              <div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
                    <ShieldAlert class="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>25% Kill Fee Protection</span>
                  </div>
                  <span class="font-mono font-bold text-amber-800 tabular-nums dark:text-amber-300">$4,500.00</span>
                </div>
                <p class="text-muted-foreground mt-1 text-xs">
                  Calculated as 25% of uncompleted milestones ($18,000.00) payable upon client convenience termination.
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- Signature Action Checklist Card -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2">
              <div class="flex items-center justify-between">
                <CardTitle class="text-sm font-semibold">Execution Checklist</CardTitle>
                <Badge
                  :variant="completedCount === 3 ? 'default' : 'secondary'"
                  class="font-mono text-xs whitespace-normal tabular-nums"
                >
                  {{ completedCount }} / 3 Done
                </Badge>
              </div>
              <CardDescription class="text-xs">Complete all mandatory checkpoints to finalize contract</CardDescription>
            </CardHeader>
            <CardContent class="space-y-2.5 p-4 pt-2">
              <!-- Item 1: Initial Section 2 IP -->
              <button
                type="button"
                class="border-border/80 hover:bg-muted/40 flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-xs transition-colors"
                @click="scrollToInitial1"
              >
                <div class="flex items-center gap-2.5">
                  <div
                    :class="
                      cn(
                        'flex size-5 items-center justify-center rounded-full text-xs font-semibold',
                        initial1Completed
                          ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
                      )
                    "
                  >
                    <Check v-if="initial1Completed" class="size-3" />
                    <span v-else>1</span>
                  </div>
                  <div>
                    <p class="text-foreground font-medium">Initial Section 2 (IP Assignment)</p>
                    <p class="text-muted-foreground text-xs">17 U.S.C. &sect; 101 Work-for-Hire clause</p>
                  </div>
                </div>
                <Badge
                  wrap
                  :variant="initial1Completed ? 'outline' : 'secondary'"
                  :class="
                    cn(
                      'text-xs',
                      initial1Completed
                        ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                        : 'text-amber-700 dark:text-amber-400',
                    )
                  "
                >
                  {{ initial1Completed ? 'Done' : 'Review' }}
                </Badge>
              </button>

              <!-- Item 2: Initial Section 4 Kill Fee -->
              <button
                type="button"
                class="border-border/80 hover:bg-muted/40 flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-xs transition-colors"
                @click="scrollToInitial2"
              >
                <div class="flex items-center gap-2.5">
                  <div
                    :class="
                      cn(
                        'flex size-5 items-center justify-center rounded-full text-xs font-semibold',
                        initial2Completed
                          ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
                      )
                    "
                  >
                    <Check v-if="initial2Completed" class="size-3" />
                    <span v-else>2</span>
                  </div>
                  <div>
                    <p class="text-foreground font-medium">Initial Section 4 (25% Kill Fee)</p>
                    <p class="text-muted-foreground text-xs">Termination protocol &amp; compensation</p>
                  </div>
                </div>
                <Badge
                  wrap
                  :variant="initial2Completed ? 'outline' : 'secondary'"
                  :class="
                    cn(
                      'text-xs',
                      initial2Completed
                        ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                        : 'text-amber-700 dark:text-amber-400',
                    )
                  "
                >
                  {{ initial2Completed ? 'Done' : 'Review' }}
                </Badge>
              </button>

              <!-- Item 3: Full MSA Signature -->
              <div
                :class="
                  cn(
                    'flex items-center justify-between rounded-lg border p-2.5 text-xs',
                    isSigned ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border/80 bg-card',
                  )
                "
              >
                <div class="flex items-center gap-2.5">
                  <div
                    :class="
                      cn(
                        'flex size-5 items-center justify-center rounded-full text-xs font-semibold',
                        isSigned ? 'bg-emerald-500 text-white dark:bg-emerald-600' : 'bg-muted text-muted-foreground',
                      )
                    "
                  >
                    <Check v-if="isSigned" class="size-3" />
                    <span v-else>3</span>
                  </div>
                  <div>
                    <p class="text-foreground font-medium">Execute Agreement</p>
                    <p class="text-muted-foreground text-xs">Contractor e-signature</p>
                  </div>
                </div>
                <Badge
                  wrap
                  :variant="isSigned ? 'outline' : 'secondary'"
                  :class="
                    cn(
                      'text-xs',
                      isSigned
                        ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                        : 'text-muted-foreground',
                    )
                  "
                >
                  {{ isSigned ? 'Executed' : 'Pending' }}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <!-- Interactive Signature Pad Card -->
          <Card id="vue-signature-pad" class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2">
              <CardTitle class="text-sm font-semibold">Contractor Signature Pad</CardTitle>
              <CardDescription class="text-xs">Adopt signature style &amp; execute contract</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4 p-4 pt-2">
              <!-- Style Selector -->
              <div class="bg-muted/60 grid grid-cols-3 gap-1.5 rounded-lg p-1">
                <button
                  type="button"
                  :class="
                    cn(
                      'rounded-md py-1 text-center text-xs font-medium transition-colors',
                      signatureFont === 'serif'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="signatureFont = 'serif'"
                >
                  Formal Serif
                </button>
                <button
                  type="button"
                  :class="
                    cn(
                      'rounded-md py-1 text-center text-xs font-medium transition-colors',
                      signatureFont === 'script'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="signatureFont = 'script'"
                >
                  Script Elegance
                </button>
                <button
                  type="button"
                  :class="
                    cn(
                      'rounded-md py-1 text-center text-xs font-medium transition-colors',
                      signatureFont === 'sans'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="signatureFont = 'sans'"
                >
                  Modern Sans
                </button>
              </div>

              <!-- Preview Display Box -->
              <div class="border-border bg-muted/20 relative rounded-lg border p-4 text-center">
                <p class="text-muted-foreground text-xs font-medium">Adopted Signature</p>
                <div class="my-2 flex min-h-[48px] items-center justify-center">
                  <span
                    :class="
                      cn(
                        'text-foreground text-2xl select-none',
                        signatureFont === 'serif' && 'font-medium tracking-wide italic',
                        signatureFont === 'script' && 'font-medium tracking-widest italic',
                        signatureFont === 'sans' && 'font-semibold tracking-tight',
                      )
                    "
                  >
                    {{ signerName }}
                  </span>
                </div>
                <div class="text-muted-foreground flex items-center justify-center gap-1.5 font-mono text-xs">
                  <ShieldCheck class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>256-Bit eIDAS &amp; U.S. ESIGN Compliant</span>
                </div>
              </div>

              <!-- Consent Checkbox -->
              <label class="text-muted-foreground flex cursor-pointer items-start gap-2.5 text-xs">
                <input
                  v-model="eConsentAgreed"
                  type="checkbox"
                  :disabled="isSigned"
                  class="text-primary focus:ring-ring border-border mt-0.5 size-4 rounded"
                />
                <span>
                  I agree to transact electronically and execute this Master Services Agreement (#MSA-2026-4892) as a
                  legally binding instrument.
                </span>
              </label>

              <!-- Main Execution Button -->
              <div class="space-y-2 pt-2">
                <Button
                  v-if="!isSigned"
                  type="button"
                  class="w-full gap-2 text-sm font-semibold shadow-xs transition-all"
                  :disabled="!canSign"
                  @click="signContract"
                >
                  <PenTool class="size-4" />
                  <span>Sign &amp; Execute Agreement</span>
                </Button>

                <div
                  v-else
                  class="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center"
                >
                  <div
                    class="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                  >
                    <CheckCircle2 class="size-4" />
                    <span>Contract Executed Successfully!</span>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Countersigned MSA certificate dispatched to David Chen (CTO) and Elena Rostova.
                  </p>
                  <Button
                    aria-label="Download attachment"
                    size="sm"
                    class="mt-2 w-full gap-1.5 text-xs shadow-xs"
                    @click="handleDownload"
                  >
                    <Download class="size-3.5" />
                    <span>Download Executed Contract</span>
                  </Button>
                </div>

                <p v-if="!isSigned && !canSign" class="text-muted-foreground text-center text-xs">
                  {{
                    !initial1Completed || !initial2Completed
                      ? 'Please complete both section initial checkpoints above.'
                      : 'Please check the electronic records consent box.'
                  }}
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- Audit Ledger Mini Card -->
          <div class="border-border bg-card/60 text-muted-foreground space-y-1.5 rounded-lg border p-3 text-xs">
            <div class="text-foreground flex items-center gap-1.5 font-medium">
              <Lock class="text-primary size-3.5" />
              <span>Tamper-Proof Audit Trail Ledger</span>
            </div>
            <p class="leading-relaxed">
              Every initial checkpoint and signature event is stamped with SHA-256 integrity hash, RFC 3161 timestamp,
              and recorded in the permanent contract execution audit trail.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
