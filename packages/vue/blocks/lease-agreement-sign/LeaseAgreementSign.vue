<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface LeaseAgreementSignProps {
  class?: HTMLAttributes['class']
  initialSigned?: boolean
  initialInitialsCompleted?: boolean
}

const props = withDefaults(defineProps<LeaseAgreementSignProps>(), {
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

function signAgreement() {
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
  const el = document.getElementById('initial-marker-1')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function scrollToInitial2() {
  const el = document.getElementById('initial-marker-2')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <div data-slot="lease-agreement-sign" :class="cn('bg-background text-foreground w-full', props.class)">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <!-- Top Header -->
      <header class="border-border bg-card mb-6 rounded-xl border p-5 shadow-xs sm:p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-muted-foreground text-xs font-medium">Agreement Ref:</span>
              <span class="text-foreground font-mono text-xs font-semibold tabular-nums">#LSA-2026-44B</span>
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
                class="gap-1.5 border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-700 dark:text-blue-400"
              >
                <PenTool class="size-3.5" />
                <span>Ready for Tenant Signature</span>
              </Badge>
              <Badge
                wrap
                v-else
                class="gap-1.5 border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
              >
                <AlertCircle class="size-3.5" />
                <span
                  >Action Required &bull; {{ (initial1Completed ? 0 : 1) + (initial2Completed ? 0 : 1) }} Signatures
                  Needed</span
                >
              </Badge>
            </div>
            <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              Residential Lease Agreement &bull; 12-Month Term
            </h1>
            <p class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <Building2 class="size-4 shrink-0" />
              <span>Unit 4B &bull; 742 Evergreen Terrace, Springfield, OR 97477</span>
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <Button variant="outline" size="sm" class="gap-1.5 text-xs" @click="handlePrint">
              <Printer class="size-4" />
              <span>Print</span>
            </Button>
            <Button
              aria-label="Download attachment"
              variant="outline"
              size="sm"
              class="gap-1.5 text-xs"
              @click="handleDownload"
            >
              <Download class="size-4" />
              <span>{{ downloadSuccess ? 'Downloading PDF...' : 'Download Draft PDF' }}</span>
            </Button>
            <Button
              v-if="isSigned"
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

      <!-- 2-Column Layout -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <!-- Left Column: Legal Lease Document -->
        <main class="space-y-6 lg:col-span-8">
          <div class="border-border bg-card rounded-xl border p-6 shadow-xs sm:p-8">
            <!-- Document Title Bar -->
            <div class="border-border border-b pb-6 text-center">
              <Badge wrap variant="outline" class="font-mono text-xs tracking-widest uppercase">
                Official Real Estate Contract
              </Badge>
              <h2 class="text-foreground mt-3 text-lg font-bold tracking-tight uppercase sm:text-xl">
                Standard Residential Lease Agreement
              </h2>
              <p class="text-muted-foreground mt-1 text-xs">
                State of Oregon &bull; Multnomah County &bull; Governing Statute: ORS Chapter 90
              </p>
            </div>

            <!-- Lease Summary Terms Box -->
            <div class="my-6">
              <div class="bg-muted/40 border-border rounded-lg border p-4 sm:p-5">
                <div class="mb-3 flex items-center justify-between">
                  <h3 class="text-foreground text-xs font-semibold tracking-wider uppercase">
                    Key Financial &amp; Term Summary
                  </h3>
                  <Badge wrap variant="secondary" class="font-mono text-xs">Fixed-Term</Badge>
                </div>
                <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div class="border-border/60 bg-card rounded-md border p-3">
                    <p class="text-muted-foreground text-xs font-medium">Monthly Rent</p>
                    <p class="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">$3,450.00</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">Due 1st of month</p>
                  </div>
                  <div class="border-border/60 bg-card rounded-md border p-3">
                    <p class="text-muted-foreground text-xs font-medium">Lease Duration</p>
                    <p class="text-foreground mt-1 text-xs font-bold sm:text-sm">12 Months</p>
                    <p class="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                      Sep 01, 2026 – Aug 31, 2027
                    </p>
                  </div>
                  <div class="border-border/60 bg-card rounded-md border p-3">
                    <p class="text-muted-foreground text-xs font-medium">Security Deposit</p>
                    <p class="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">$3,450.00</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">Escrow Trust Acct</p>
                  </div>
                  <div class="border-border/60 bg-card rounded-md border p-3">
                    <p class="text-muted-foreground text-xs font-medium">Pet Policy</p>
                    <p class="text-foreground mt-1 text-xs font-bold sm:text-sm">Approved - 1 Dog</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">$50/mo pet rent</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Legal Sections -->
            <div class="text-foreground/90 space-y-8 text-xs leading-relaxed sm:text-sm">
              <!-- Section 1: Parties & Premises -->
              <section id="section-1" class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">01</span>
                  <h3 class="text-foreground text-sm font-bold sm:text-base">Parties, Premises &amp; Occupancy</h3>
                </div>
                <p class="text-muted-foreground">
                  This Residential Lease Agreement (the &ldquo;Agreement&rdquo;) is entered into on this 21st day of
                  August, 2026, by and between:
                </p>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div class="border-border bg-muted/20 rounded-lg border p-3.5">
                    <p class="text-foreground text-xs font-semibold tracking-wider uppercase">Landlord / Lessor</p>
                    <p class="text-foreground mt-1 font-medium">Evergreen Heritage Holdings LLC</p>
                    <p class="text-muted-foreground text-xs">Managing Agent: Marcus Vance, CPM</p>
                    <p class="text-muted-foreground font-mono text-xs">Lic #OR-994201 &bull; info@evergreenhh.com</p>
                  </div>
                  <div class="border-border bg-muted/20 rounded-lg border p-3.5">
                    <p class="text-foreground text-xs font-semibold tracking-wider uppercase">Tenant / Lessee</p>
                    <p class="text-foreground mt-1 font-medium">Elena Rostova</p>
                    <p class="text-muted-foreground text-xs">Primary Occupant</p>
                    <p class="text-muted-foreground text-xs">elena.rostova@example.com &bull; (555) 234-5678</p>
                  </div>
                </div>
                <p class="text-muted-foreground">
                  <strong>Premises Description:</strong> Landlord hereby leases to Tenant the residential real property
                  situated at <strong>Unit 4B, 742 Evergreen Terrace, Springfield, OR 97477</strong>, comprising 2
                  Bedrooms, 2 Full Bathrooms (approx. 1,120 sq ft), together with designated covered parking stall #42
                  and storage locker #S-14.
                </p>
              </section>

              <Separator />

              <!-- Section 2: Rent Payment & Late Fees -->
              <section id="section-2" class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">02</span>
                  <h3 class="text-foreground text-sm font-bold sm:text-base">Rent Payment Schedule &amp; Late Fees</h3>
                </div>
                <p class="text-muted-foreground">
                  Tenant agrees to pay Landlord the base monthly rent of
                  <strong class="text-foreground font-mono tabular-nums">$3,450.00 USD</strong> plus
                  <strong class="text-foreground font-mono tabular-nums">$50.00 USD</strong> monthly pet rent, for an
                  aggregate monthly payment of
                  <strong class="text-foreground font-mono tabular-nums">$3,500.00 USD</strong>, due on or before the
                  first (1st) day of each calendar month.
                </p>
                <p class="text-muted-foreground">
                  <strong>Grace Period &amp; Penalties:</strong> A grace period is provided through 11:59 PM PST on the
                  fifth (5th) day of the month. If rent is not received in full by 12:00 AM on the sixth (6th) calendar
                  day, a statutory late fee of
                  <strong class="text-foreground font-mono tabular-nums">$75.00 USD</strong> shall immediately apply,
                  plus an additional charge of
                  <strong class="text-foreground font-mono tabular-nums">$10.00 USD per day</strong> until the
                  delinquent balance is satisfied in full.
                </p>

                <!-- Initial Marker 1 -->
                <div
                  id="initial-marker-1"
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
                        <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                          >Tenant Initial Requirement &bull; Section 2</span
                        >
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
                        Acknowledge and agree to the $3,450.00 rent schedule, ACH delivery, and $75.00 late assessment
                        clauses.
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      :disabled="isSigned"
                      :variant="initial1Completed ? 'outline' : 'default'"
                      :class="
                        cn(
                          'shrink-0 gap-2 text-xs font-medium transition-all',
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

              <!-- Section 3: Maintenance & Occupancy Rules -->
              <section id="section-3" class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">03</span>
                  <h3 class="text-foreground text-sm font-bold sm:text-base">
                    Maintenance, Utilities &amp; Occupancy Rules
                  </h3>
                </div>
                <ul class="text-muted-foreground space-y-2">
                  <li class="flex items-start gap-2">
                    <CheckCircle2 class="text-primary mt-0.5 size-4 shrink-0" />
                    <span>
                      <strong class="text-foreground">Quiet Hours:</strong> Community quiet hours are strictly enforced
                      between 10:00 PM and 7:00 AM daily.
                    </span>
                  </li>
                  <li class="flex items-start gap-2">
                    <CheckCircle2 class="text-primary mt-0.5 size-4 shrink-0" />
                    <span>
                      <strong class="text-foreground">HVAC Maintenance:</strong> Tenant shall replace HVAC air filters
                      every 90 calendar days. Replacement filters are provided free of charge at property management.
                    </span>
                  </li>
                  <li class="flex items-start gap-2">
                    <CheckCircle2 class="text-primary mt-0.5 size-4 shrink-0" />
                    <span>
                      <strong class="text-foreground">Guest Policy:</strong> Guests staying exceeding 14 consecutive
                      calendar days require written authorization from property management.
                    </span>
                  </li>
                  <li class="flex items-start gap-2">
                    <CheckCircle2 class="text-primary mt-0.5 size-4 shrink-0" />
                    <span>
                      <strong class="text-foreground">Utilities Allocation:</strong> Landlord pays municipal water,
                      sewer, and storm drainage. Tenant is responsible for electricity (PGE), gas (NW Natural), and
                      high-speed internet.
                    </span>
                  </li>
                </ul>
              </section>

              <Separator />

              <!-- Section 4: Termination & Move-out Notice -->
              <section id="section-4" class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">04</span>
                  <h3 class="text-foreground text-sm font-bold sm:text-base">
                    Termination, Renewal &amp; Move-Out Notice
                  </h3>
                </div>
                <p class="text-muted-foreground">
                  Either party may terminate or request non-renewal of this lease by delivering a formal written notice
                  at least <strong>sixty (60) calendar days</strong> prior to the lease expiration date of August 31,
                  2027.
                </p>
                <p class="text-muted-foreground">
                  <strong>Move-Out &amp; Carpet Certification:</strong> Upon vacating the premises, Tenant shall return
                  all building keys (2 unit keys, 1 mailbox key, 1 garage fob) and furnish a paid receipt from a
                  licensed professional carpet cleaning service. A joint walk-through inspection will be conducted
                  within 72 hours of key surrender.
                </p>

                <!-- Initial Marker 2 -->
                <div
                  id="initial-marker-2"
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
                        <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                          >Tenant Initial Requirement &bull; Section 4</span
                        >
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
                        Acknowledge the 60-day written move-out notice requirement and professional carpet cleaning
                        obligation.
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      :disabled="isSigned"
                      :variant="initial2Completed ? 'outline' : 'default'"
                      :class="
                        cn(
                          'shrink-0 gap-2 text-xs font-medium transition-all',
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

              <!-- Document Signatures Execution Box -->
              <section class="space-y-4 pt-2">
                <div class="flex items-center justify-between">
                  <h3 class="text-foreground text-sm font-bold sm:text-base">Execution &amp; Legal Signatures</h3>
                  <span class="text-muted-foreground font-mono text-xs">2 of 2 Parties</span>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <!-- Landlord Signature Block -->
                  <div class="border-border bg-muted/20 rounded-lg border p-4">
                    <div class="flex items-center justify-between">
                      <p class="text-foreground text-xs font-semibold tracking-wider uppercase">Landlord Signature</p>
                      <Badge
                        wrap
                        variant="outline"
                        class="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
                      >
                        <Check class="mr-1 size-3" /> Signed
                      </Badge>
                    </div>
                    <div class="border-border/60 bg-card my-3 rounded-md border p-3 text-center">
                      <p class="text-xl font-medium tracking-wide text-emerald-800 italic dark:text-emerald-300">
                        Marcus Vance
                      </p>
                      <p class="text-muted-foreground mt-0.5 font-mono text-xs">Agent for Evergreen Holdings LLC</p>
                    </div>
                    <div class="text-muted-foreground space-y-1 font-mono text-xs">
                      <p class="flex justify-between">
                        <span>Date Signed:</span>
                        <span class="text-foreground font-semibold tabular-nums">Aug 20, 2026 &bull; 09:15 PDT</span>
                      </p>
                      <p class="flex justify-between">
                        <span>Certificate ID:</span>
                        <span class="text-foreground font-semibold">DS-EHG-8842-MV</span>
                      </p>
                    </div>
                  </div>

                  <!-- Tenant Signature Block -->
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
                      <p class="text-foreground text-xs font-semibold tracking-wider uppercase">Tenant Signature</p>
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
                          e-Signed via DocuSign / UIPKGE Registry
                        </p>
                      </template>
                      <template v-else>
                        <p class="text-muted-foreground text-xs italic">
                          Awaiting signature execution via right sidebar
                        </p>
                        <p class="text-muted-foreground/80 mt-1 text-xs">Complete 2 initials above to enable signing</p>
                      </template>
                    </div>

                    <div class="text-muted-foreground space-y-1 font-mono text-xs">
                      <p class="flex justify-between">
                        <span>Date Signed:</span>
                        <span class="text-foreground font-semibold tabular-nums">
                          {{ isSigned ? 'Aug 21, 2026 • 10:44 PDT' : 'Pending' }}
                        </span>
                      </p>
                      <p class="flex justify-between">
                        <span>Digital Audit Hash:</span>
                        <span class="text-foreground font-semibold">
                          {{ isSigned ? 'SHA256:7f83b1...9069' : 'Unsigned' }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        <!-- Right Column: Sticky Signature Action Sidebar -->
        <aside class="space-y-5 lg:sticky lg:top-6 lg:col-span-4 lg:self-start">
          <!-- Signer Identity Card -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div
                    class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full font-bold"
                  >
                    ER
                  </div>
                  <div>
                    <CardTitle class="text-sm font-semibold">{{ signerName }}</CardTitle>
                    <CardDescription class="text-xs">Primary Lessee &bull; Tenant</CardDescription>
                  </div>
                </div>
                <Badge wrap variant="outline" class="border-primary/30 text-primary font-mono text-xs"
                  >Signer 1/1</Badge
                >
              </div>
            </CardHeader>
            <CardContent class="text-muted-foreground space-y-2 p-4 pt-2 text-xs">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Email:</span>
                <span class="text-foreground font-medium">elena.rostova@example.com</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Auth Level:</span>
                <span class="text-foreground font-medium">SMS 2FA Verified</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">IP Session:</span>
                <span class="text-foreground font-mono tabular-nums">198.51.100.42 (TLS 1.3)</span>
              </div>
            </CardContent>
          </Card>

          <!-- Signature Required Checklist -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2">
              <div class="flex items-center justify-between">
                <CardTitle class="text-sm font-semibold">Required Action Checklist</CardTitle>
                <Badge
                  :variant="completedCount === 3 ? 'default' : 'secondary'"
                  class="font-mono text-xs whitespace-normal tabular-nums"
                >
                  {{ completedCount }} / 3 Done
                </Badge>
              </div>
              <CardDescription class="text-xs">All initial markers must be completed prior to signing</CardDescription>
            </CardHeader>
            <CardContent class="space-y-2.5 p-4 pt-2">
              <!-- Item 1 -->
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
                    <p class="text-foreground font-medium">Initial Section 2 (Rent &amp; Fees)</p>
                    <p class="text-muted-foreground text-xs">Acknowledges $3,450 rent &amp; late charges</p>
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
                  {{ initial1Completed ? 'Done' : 'Click to jump' }}
                </Badge>
              </button>

              <!-- Item 2 -->
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
                    <p class="text-foreground font-medium">Initial Section 4 (Move-Out)</p>
                    <p class="text-muted-foreground text-xs">Acknowledges 60-day notice &amp; cleaning</p>
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
                  {{ initial2Completed ? 'Done' : 'Click to jump' }}
                </Badge>
              </button>

              <!-- Item 3 -->
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
                    <p class="text-foreground font-medium">Sign Full Agreement</p>
                    <p class="text-muted-foreground text-xs">Execute legal lease contract</p>
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

          <!-- Signature Pad / Typography Box -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2">
              <CardTitle class="text-sm font-semibold">Electronic Signature Preview</CardTitle>
              <CardDescription class="text-xs">Adopt your legal signature typography</CardDescription>
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
                  <span>256-Bit eIDAS / ESIGN Certified</span>
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
                  I agree to transact electronically and confirm this electronic signature legally binds me under U.S.
                  ESIGN Act and ORS Chapter 90.
                </span>
              </label>

              <!-- Main Execution Button -->
              <div class="space-y-2 pt-2">
                <Button
                  v-if="!isSigned"
                  type="button"
                  class="w-full gap-2 text-sm font-semibold shadow-xs transition-all"
                  :disabled="!canSign"
                  @click="signAgreement"
                >
                  <PenTool class="size-4" />
                  <span>Sign &amp; Finalize Agreement</span>
                </Button>

                <div
                  v-else
                  class="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center"
                >
                  <div
                    class="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                  >
                    <CheckCircle2 class="size-4" />
                    <span>Lease Executed Successfully!</span>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    A copy of the countersigned PDF has been securely dispatched to your verified email.
                  </p>
                  <Button
                    aria-label="Download attachment"
                    size="sm"
                    class="mt-2 w-full gap-1.5 text-xs"
                    @click="handleDownload"
                  >
                    <Download class="size-3.5" />
                    <span>Download Signed PDF</span>
                  </Button>
                </div>

                <p v-if="!isSigned && !canSign" class="text-muted-foreground text-center text-xs">
                  {{
                    !initial1Completed || !initial2Completed
                      ? 'Please complete all initial checkpoints above before signing.'
                      : 'Please check the electronic consent box.'
                  }}
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- Audit Log Mini Card -->
          <div class="border-border bg-card/60 text-muted-foreground space-y-1.5 rounded-lg border p-3 text-xs">
            <div class="text-foreground flex items-center gap-1.5 font-medium">
              <Lock class="text-primary size-3.5" />
              <span>Cryptographic Tamper-Proof Audit Trail</span>
            </div>
            <p class="leading-relaxed">
              Every initial and signature event is stamped with SHA-256 integrity hash, RFC 3161 trusted timestamp, and
              logged in the immutable lease registry ledger.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
