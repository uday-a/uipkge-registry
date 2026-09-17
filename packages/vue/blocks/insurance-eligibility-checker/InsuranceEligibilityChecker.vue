<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import {
  Activity,
  AlertCircle,
  Building2,
  CheckCircle2,
  CreditCard,
  FileCheck,
  FileText,
  Hospital,
  Info,
  Pill,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  User,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const isVerifying = ref(false)
const lastVerifiedText = ref('Active Coverage · Verified Today at 09:15 AM')
const verificationCount = ref(1)

function handleReverify() {
  if (isVerifying.value) return
  isVerifying.value = true
  setTimeout(() => {
    isVerifying.value = false
    verificationCount.value++
    const now = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(new Date())
    lastVerifiedText.value = `Active Coverage · Verified Real-time at ${now}`
  }, 750)
}
</script>

<template>
  <div
    data-slot="insurance-eligibility-checker"
    :class="cn('bg-background text-foreground w-full space-y-6', props.class)"
  >
    <!-- Header: Patient Demographics & Real-time Eligibility Status -->
    <header class="bg-card border-border rounded-xl border p-5 shadow-xs sm:p-6">
      <div class="flex flex-col gap-6">
        <!-- Top Row: Title & Real-time Action -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <div
                class="bg-primary/10 text-primary border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-lg border"
              >
                <ShieldCheck class="size-4" />
              </div>
              <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                Insurance Eligibility & Benefits Verifier
              </h1>
            </div>
            <p class="text-muted-foreground text-xs sm:text-sm">
              Real-time EDI 270/271 electronic benefit eligibility inquiry, deductible accumulators, and coverage
              limits.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="isVerifying"
              class="gap-1.5 text-xs font-medium"
              @click="handleReverify"
            >
              <RefreshCw :class="cn('size-3.5', isVerifying && 'text-primary animate-spin')" />
              <span>{{ isVerifying ? 'Verifying EDI 270...' : 'Re-verify Real-time' }}</span>
            </Button>
          </div>
        </div>

        <Separator />

        <!-- Patient & Primary Payer Profile Details -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Patient Demographics -->
          <div class="space-y-1">
            <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <User class="size-3.5" />
              <span>Patient Name & DOB</span>
            </div>
            <p class="text-foreground text-sm font-semibold">David Chen</p>
            <p class="text-muted-foreground text-xs tabular-nums">DOB: 1978-10-14 (48 yrs · Male)</p>
          </div>

          <!-- Primary Payer / Plan -->
          <div class="space-y-1">
            <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Building2 class="size-3.5" />
              <span>Insurance Payer & Plan</span>
            </div>
            <p class="text-foreground text-sm font-semibold">BlueCross BlueShield</p>
            <p class="text-muted-foreground text-xs">PPO - Choice Plus Network</p>
          </div>

          <!-- Member & Group ID -->
          <div class="space-y-1">
            <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <CreditCard class="size-3.5" />
              <span>Member & Policy ID</span>
            </div>
            <p class="text-foreground font-mono text-sm font-semibold tabular-nums">#BCBS-98421094</p>
            <p class="text-muted-foreground text-xs tabular-nums">Group: GRP-88204-01 · Plan #902</p>
          </div>

          <!-- Verification Status Badge -->
          <div class="space-y-1.5">
            <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Activity class="size-3.5" />
              <span>Verification Status</span>
            </div>
            <div>
              <Badge
                wrap
                variant="outline"
                class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              >
                <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span>{{ lastVerifiedText }}</span>
              </Badge>
            </div>
            <p class="text-muted-foreground text-xs tabular-nums">
              Trace: EDI-271-99842 · Effective: Jan 01, 2026 – Dec 31, 2026
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- 4 Primary Benefit Cards -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Individual Deductible -->
      <Card class="relative overflow-hidden">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between">
            <CardTitle class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Individual Deductible
            </CardTitle>
            <Badge wrap variant="secondary" class="text-xs font-normal">In-Network</Badge>
          </div>
          <div class="mt-2 space-y-1">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$1,200.00</span>
              <span class="text-muted-foreground text-xs font-normal tabular-nums">/ $2,500.00 met</span>
            </div>
            <CardDescription class="text-xs">
              <strong class="text-foreground font-medium tabular-nums">$1,300.00</strong> remaining in plan year
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Accumulator Met</span>
              <span class="text-foreground font-semibold tabular-nums">48%</span>
            </div>
            <Progress :model-value="48" class="h-2" />
            <p class="text-muted-foreground pt-1 text-xs tabular-nums">
              Family Deductible: $2,400.00 / $5,000.00 met (48%)
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Card 2: Out-of-Pocket Maximum -->
      <Card class="relative overflow-hidden">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between">
            <CardTitle class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Out-of-Pocket Maximum
            </CardTitle>
            <Badge wrap variant="secondary" class="text-xs font-normal">Annual Max</Badge>
          </div>
          <div class="mt-2 space-y-1">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$2,800.00</span>
              <span class="text-muted-foreground text-xs font-normal tabular-nums">/ $6,000.00 met</span>
            </div>
            <CardDescription class="text-xs">
              <strong class="text-foreground font-medium tabular-nums">$3,200.00</strong> until 100% plan liability
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Accumulator Met</span>
              <span class="text-foreground font-semibold tabular-nums">46%</span>
            </div>
            <Progress :model-value="46" class="h-2" />
            <p class="text-muted-foreground pt-1 text-xs tabular-nums">Includes deductibles, copays & Rx coinsurance</p>
          </div>
        </CardContent>
      </Card>

      <!-- Card 3: Primary Care Copay -->
      <Card class="relative overflow-hidden">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between">
            <CardTitle class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Primary Care Copay
            </CardTitle>
            <Badge
              wrap
              variant="outline"
              class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            >
              No Deductible
            </Badge>
          </div>
          <div class="mt-2 space-y-1">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$25.00</span>
              <span class="text-muted-foreground text-xs font-normal">copay</span>
            </div>
            <CardDescription class="text-xs"> No deductible required prior to copay benefit </CardDescription>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="border-border/60 bg-muted/30 rounded-lg border p-2.5 text-xs">
            <div class="flex items-center gap-1.5">
              <Stethoscope class="text-primary size-3.5 shrink-0" />
              <span class="text-foreground font-medium">Designated PCP In-Network</span>
            </div>
            <p class="text-muted-foreground mt-1 text-xs">$0.00 copay for annual preventive wellness checkups</p>
          </div>
        </CardContent>
      </Card>

      <!-- Card 4: Specialist Copay -->
      <Card class="relative overflow-hidden">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between">
            <CardTitle class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Specialist Copay
            </CardTitle>
            <Badge
              wrap
              variant="outline"
              class="border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
            >
              PA Required
            </Badge>
          </div>
          <div class="mt-2 space-y-1">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$50.00</span>
              <span class="text-muted-foreground text-xs font-normal">copay</span>
            </div>
            <CardDescription class="text-xs"> Prior authorization required for select procedures </CardDescription>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="border-border/60 bg-muted/30 rounded-lg border p-2.5 text-xs">
            <div class="flex items-center gap-1.5">
              <Hospital class="text-primary size-3.5 shrink-0" />
              <span class="text-foreground font-medium">Direct Specialist Access</span>
            </div>
            <p class="text-muted-foreground mt-1 text-xs">No primary care physician (PCP) referral required</p>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- Detailed Coverage Category Breakdown Table -->
    <Card>
      <CardHeader>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <FileCheck class="text-primary size-4" />
              <CardTitle class="text-base sm:text-lg">Detailed Coverage Category Breakdown</CardTitle>
            </div>
            <CardDescription class="text-xs sm:text-sm">
              Schedule of in-network vs out-of-network patient cost-sharing, authorization rules, and annual benefit
              limits.
            </CardDescription>
          </div>
          <Badge wrap variant="outline" class="text-muted-foreground w-fit text-xs font-normal">
            Updated via ANSI 835/271
          </Badge>
        </div>
      </CardHeader>
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/40">
                <TableHead class="min-w-[220px] font-semibold">Service Category</TableHead>
                <TableHead class="min-w-[170px] font-semibold">In-Network Coverage</TableHead>
                <TableHead class="min-w-[170px] font-semibold">Out-of-Network Coverage</TableHead>
                <TableHead class="min-w-[190px] font-semibold">Prior Authorization (PA)</TableHead>
                <TableHead class="min-w-[200px] text-right font-semibold">Annual Limits & Copay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <!-- Row 1: Preventive Care -->
              <TableRow>
                <TableCell class="align-top font-medium">
                  <div class="flex items-start gap-2.5">
                    <div
                      class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                      <ShieldCheck class="size-4" />
                    </div>
                    <div class="space-y-0.5">
                      <p class="text-foreground text-sm font-semibold">Preventive Care</p>
                      <p class="text-muted-foreground text-xs leading-relaxed">
                        Annual wellness exams, biometric screenings, routine adult & pediatric immunizations,
                        mammograms.
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="space-y-1">
                    <span class="text-foreground text-sm font-bold tabular-nums">100% covered</span>
                    <Badge
                      wrap
                      variant="outline"
                      class="block w-fit border-emerald-500/30 bg-emerald-500/10 text-xs font-normal text-emerald-700 dark:text-emerald-400"
                    >
                      $0 Deductible & Copay
                    </Badge>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="space-y-0.5">
                    <span class="text-foreground text-sm font-medium tabular-nums">60% of UCR</span>
                    <p class="text-muted-foreground text-xs">Subject to out-of-network deductible</p>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 class="size-3.5 shrink-0" />
                    <span class="font-medium">Not Required</span>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">Direct access without pre-certification</p>
                </TableCell>
                <TableCell class="text-right align-top">
                  <div class="space-y-0.5">
                    <p class="text-foreground text-sm font-bold tabular-nums">$0.00 copay</p>
                    <p class="text-muted-foreground text-xs tabular-nums">Unlimited annual wellness visits</p>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Row 2: Specialist Visits -->
              <TableRow>
                <TableCell class="align-top font-medium">
                  <div class="flex items-start gap-2.5">
                    <div
                      class="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border"
                    >
                      <Stethoscope class="size-4" />
                    </div>
                    <div class="space-y-0.5">
                      <p class="text-foreground text-sm font-semibold">Specialist Visits</p>
                      <p class="text-muted-foreground text-xs leading-relaxed">
                        Cardiology, neurology, physical & occupational therapy, diagnostic imaging, and outpatient
                        consultations.
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="space-y-1">
                    <span class="text-foreground text-sm font-bold tabular-nums">80% after deductible</span>
                    <p class="text-muted-foreground text-xs tabular-nums">$50.00 office visit copay</p>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="space-y-0.5">
                    <span class="text-foreground text-sm font-medium tabular-nums">60% of UCR</span>
                    <p class="text-muted-foreground text-xs">Balance billing applies above UCR</p>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                    <AlertCircle class="size-3.5 shrink-0" />
                    <span class="font-medium">Required for Procedures</span>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">PA required for MRI, CT scans & surgery</p>
                </TableCell>
                <TableCell class="text-right align-top">
                  <div class="space-y-0.5">
                    <p class="text-foreground text-sm font-bold tabular-nums">$50.00 copay</p>
                    <p class="text-muted-foreground text-xs tabular-nums">Max 30 PT visits / calendar year</p>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Row 3: Urgent Care & ER -->
              <TableRow>
                <TableCell class="align-top font-medium">
                  <div
                    class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  >
                    <Hospital class="size-4" />
                  </div>
                  <div class="space-y-0.5">
                    <p class="text-foreground text-sm font-semibold">Urgent Care & ER</p>
                    <p class="text-muted-foreground text-xs leading-relaxed">
                      Emergency department trauma evaluation, hospital triage, advanced imaging, and walk-in urgent
                      clinics.
                    </p>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="space-y-1">
                    <span class="text-foreground text-sm font-bold tabular-nums">100% after copay</span>
                    <p class="text-muted-foreground text-xs tabular-nums">$100 Urgent / $350 ER + 20%</p>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="space-y-0.5">
                    <span class="text-foreground text-sm font-medium tabular-nums">Emergency: In-Network Rate</span>
                    <p class="text-muted-foreground text-xs">Prudent Layperson Standard (ACA)</p>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 class="size-3.5 shrink-0" />
                    <span class="font-medium">Exempt for Emergency</span>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">Notification requested within 48h</p>
                </TableCell>
                <TableCell class="text-right align-top">
                  <div class="space-y-0.5">
                    <p class="text-foreground text-sm font-bold tabular-nums">$100.00 / $350.00</p>
                    <p class="text-muted-foreground text-xs tabular-nums">ER copay waived if admitted</p>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Row 4: Prescription Drug Tiers -->
              <TableRow>
                <TableCell class="align-top font-medium">
                  <div class="flex items-start gap-2.5">
                    <div
                      class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    >
                      <Pill class="size-4" />
                    </div>
                    <div class="space-y-0.5">
                      <p class="text-foreground text-sm font-semibold">Prescription Drug Tiers</p>
                      <p class="text-muted-foreground text-xs leading-relaxed">
                        Tier 1 Generic, Tier 2 Preferred Brand, Tier 3 Non-Preferred Brand, Tier 4 Specialty Biologics.
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="space-y-1">
                    <span class="text-foreground text-sm font-bold tabular-nums">Tier 1–3 Copay / T4 20%</span>
                    <p class="text-muted-foreground text-xs tabular-nums">T1: $10 · T2: $35 · T3: $70</p>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="space-y-0.5">
                    <span class="text-muted-foreground text-sm font-medium">Not Covered</span>
                    <p class="text-muted-foreground text-xs">Participating retail & mail order only</p>
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                    <AlertCircle class="size-3.5 shrink-0" />
                    <span class="font-medium">Step Therapy / PA</span>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">Mandatory PA for Tier 4 Specialty</p>
                </TableCell>
                <TableCell class="text-right align-top">
                  <div class="space-y-0.5">
                    <p class="text-foreground text-sm font-bold tabular-nums">$10.00 – $70.00</p>
                    <p class="text-muted-foreground text-xs tabular-nums">$3,500.00 Rx Annual OOP Max</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Secondary Insurance / Coordination of Benefits (COB) Card -->
    <Card>
      <CardHeader>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <FileText class="text-primary size-4" />
              <CardTitle class="text-base sm:text-lg">Secondary Insurance & Coordination of Benefits (COB)</CardTitle>
            </div>
            <CardDescription class="text-xs sm:text-sm">
              Medicare secondary payor rules and automated electronic crossover claims coordination.
            </CardDescription>
          </div>
          <Badge
            wrap
            variant="outline"
            class="w-fit border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
          >
            Automatic Crossover Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Secondary Payer -->
          <div class="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3.5">
            <p class="text-muted-foreground text-xs font-medium">Secondary Payer</p>
            <p class="text-foreground text-sm font-semibold">Medicare Part B (CMS)</p>
            <p class="text-muted-foreground text-xs">Medical Insurance</p>
          </div>

          <!-- Policy & HICN Number -->
          <div class="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3.5">
            <p class="text-muted-foreground text-xs font-medium">Secondary Policy / MBI</p>
            <p class="text-foreground font-mono text-sm font-semibold tabular-nums">#MED-9023411-B</p>
            <p class="text-muted-foreground text-xs">Coordination: Secondary Payor</p>
          </div>

          <!-- Part B Deductible -->
          <div class="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3.5">
            <p class="text-muted-foreground text-xs font-medium">Medicare Part B Deductible</p>
            <p class="text-foreground text-sm font-semibold tabular-nums">$240.00 / $240.00 met</p>
            <p class="text-xs font-medium text-emerald-600 dark:text-emerald-400">100% Deductible Satisfied</p>
          </div>

          <!-- Secondary Benefit Coverage -->
          <div class="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3.5">
            <p class="text-muted-foreground text-xs font-medium">Secondary Cost Sharing</p>
            <p class="text-foreground text-sm font-semibold">20% Coinsurance Balance</p>
            <p class="text-muted-foreground text-xs">Covers patient gap liability</p>
          </div>
        </div>

        <!-- Coordination of Benefits EDI Advice Banner -->
        <div class="border-border/80 bg-muted/40 flex items-start gap-3 rounded-lg border p-3.5">
          <Info class="text-primary mt-0.5 size-4 shrink-0" />
          <div class="space-y-0.5 text-xs leading-relaxed">
            <p class="text-foreground font-semibold">Automated 837P / EDI-271 Crossover Agreement (COBA)</p>
            <p class="text-muted-foreground">
              Primary claims processed by BlueCross BlueShield automatically transmit to Medicare for secondary
              adjudication. No manual paper secondary submission is required for eligible in-network clinical
              encounters.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
