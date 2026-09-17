'use client'

import * as React from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function InsuranceEligibilityChecker({ className }: { className?: string }) {
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [lastVerifiedText, setLastVerifiedText] = React.useState('Active Coverage · Verified Today at 09:15 AM')

  const handleReverify = () => {
    if (isVerifying) return
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      const now = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date())
      setLastVerifiedText(`Active Coverage · Verified Real-time at ${now}`)
    }, 750)
  }

  return (
    <div
      data-slot="insurance-eligibility-checker"
      className={cn('bg-background text-foreground w-full space-y-6', className)}
    >
      {/* Header: Patient Demographics & Real-time Eligibility Status */}
      <header className="bg-card border-border rounded-xl border p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-6">
          {/* Top Row: Title & Real-time Action */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-lg border">
                  <ShieldCheck className="size-4" />
                </div>
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Insurance Eligibility & Benefits Verifier
                </h1>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Real-time EDI 270/271 electronic benefit eligibility inquiry, deductible accumulators, and coverage
                limits.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isVerifying}
                className="gap-1.5 text-xs font-medium"
                onClick={handleReverify}
              >
                <RefreshCw className={cn('size-3.5', isVerifying && 'text-primary animate-spin')} />
                <span>{isVerifying ? 'Verifying EDI 270...' : 'Re-verify Real-time'}</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Patient & Primary Payer Profile Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Patient Demographics */}
            <div className="space-y-1">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <User className="size-3.5" />
                <span>Patient Name & DOB</span>
              </div>
              <p className="text-foreground text-sm font-semibold">David Chen</p>
              <p className="text-muted-foreground text-xs tabular-nums">DOB: 1978-10-14 (48 yrs · Male)</p>
            </div>

            {/* Primary Payer / Plan */}
            <div className="space-y-1">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <Building2 className="size-3.5" />
                <span>Insurance Payer & Plan</span>
              </div>
              <p className="text-foreground text-sm font-semibold">BlueCross BlueShield</p>
              <p className="text-muted-foreground text-xs">PPO - Choice Plus Network</p>
            </div>

            {/* Member & Group ID */}
            <div className="space-y-1">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <CreditCard className="size-3.5" />
                <span>Member & Policy ID</span>
              </div>
              <p className="text-foreground font-mono text-sm font-semibold tabular-nums">#BCBS-98421094</p>
              <p className="text-muted-foreground text-xs tabular-nums">Group: GRP-88204-01 · Plan #902</p>
            </div>

            {/* Verification Status Badge */}
            <div className="space-y-1.5">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <Activity className="size-3.5" />
                <span>Verification Status</span>
              </div>
              <div>
                <Badge
                  wrap
                  variant="outline"
                  className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                >
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span>{lastVerifiedText}</span>
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs tabular-nums">
                Trace: EDI-271-99842 · Effective: Jan 01, 2026 – Dec 31, 2026
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 4 Primary Benefit Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Individual Deductible */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Individual Deductible
              </CardTitle>
              <Badge wrap variant="secondary" className="text-xs font-normal">
                In-Network
              </Badge>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$1,200.00</span>
                <span className="text-muted-foreground text-xs font-normal tabular-nums">/ $2,500.00 met</span>
              </div>
              <CardDescription className="text-xs">
                <strong className="text-foreground font-medium tabular-nums">$1,300.00</strong> remaining in plan year
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Accumulator Met</span>
                <span className="text-foreground font-semibold tabular-nums">48%</span>
              </div>
              <Progress value={48} className="h-2" />
              <p className="text-muted-foreground pt-1 text-xs tabular-nums">
                Family Deductible: $2,400.00 / $5,000.00 met (48%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Out-of-Pocket Maximum */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Out-of-Pocket Maximum
              </CardTitle>
              <Badge wrap variant="secondary" className="text-xs font-normal">
                Annual Max
              </Badge>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$2,800.00</span>
                <span className="text-muted-foreground text-xs font-normal tabular-nums">/ $6,000.00 met</span>
              </div>
              <CardDescription className="text-xs">
                <strong className="text-foreground font-medium tabular-nums">$3,200.00</strong> until 100% plan
                liability
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Accumulator Met</span>
                <span className="text-foreground font-semibold tabular-nums">46%</span>
              </div>
              <Progress value={46} className="h-2" />
              <p className="text-muted-foreground pt-1 text-xs tabular-nums">
                Includes deductibles, copays & Rx coinsurance
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Primary Care Copay */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Primary Care Copay
              </CardTitle>
              <Badge
                wrap
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              >
                No Deductible
              </Badge>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$25.00</span>
                <span className="text-muted-foreground text-xs font-normal">copay</span>
              </div>
              <CardDescription className="text-xs">No deductible required prior to copay benefit</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="border-border/60 bg-muted/30 rounded-lg border p-2.5 text-xs">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="text-primary size-3.5 shrink-0" />
                <span className="text-foreground font-medium">Designated PCP In-Network</span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">$0.00 copay for annual preventive wellness checkups</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Specialist Copay */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Specialist Copay
              </CardTitle>
              <Badge
                wrap
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
              >
                PA Required
              </Badge>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$50.00</span>
                <span className="text-muted-foreground text-xs font-normal">copay</span>
              </div>
              <CardDescription className="text-xs">Prior authorization required for select procedures</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="border-border/60 bg-muted/30 rounded-lg border p-2.5 text-xs">
              <div className="flex items-center gap-1.5">
                <Hospital className="text-primary size-3.5 shrink-0" />
                <span className="text-foreground font-medium">Direct Specialist Access</span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">No primary care physician (PCP) referral required</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Detailed Coverage Category Breakdown Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileCheck className="text-primary size-4" />
                <CardTitle className="text-base sm:text-lg">Detailed Coverage Category Breakdown</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Schedule of in-network vs out-of-network patient cost-sharing, authorization rules, and annual benefit
                limits.
              </CardDescription>
            </div>
            <Badge wrap variant="outline" className="text-muted-foreground w-fit text-xs font-normal">
              Updated via ANSI 835/271
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="min-w-[220px] font-semibold">Service Category</TableHead>
                  <TableHead className="min-w-[170px] font-semibold">In-Network Coverage</TableHead>
                  <TableHead className="min-w-[170px] font-semibold">Out-of-Network Coverage</TableHead>
                  <TableHead className="min-w-[190px] font-semibold">Prior Authorization (PA)</TableHead>
                  <TableHead className="min-w-[200px] text-right font-semibold">Annual Limits & Copay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Row 1: Preventive Care */}
                <TableRow>
                  <TableCell className="align-top font-medium">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-foreground text-sm font-semibold">Preventive Care</p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Annual wellness exams, biometric screenings, routine adult & pediatric immunizations,
                          mammograms.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <span className="text-foreground text-sm font-bold tabular-nums">100% covered</span>
                      <Badge
                        wrap
                        variant="outline"
                        className="block w-fit border-emerald-500/30 bg-emerald-500/10 text-xs font-normal text-emerald-700 dark:text-emerald-400"
                      >
                        $0 Deductible & Copay
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="space-y-0.5">
                      <span className="text-foreground text-sm font-medium tabular-nums">60% of UCR</span>
                      <p className="text-muted-foreground text-xs">Subject to out-of-network deductible</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="size-3.5 shrink-0" />
                      <span className="font-medium">Not Required</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">Direct access without pre-certification</p>
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <div className="space-y-0.5">
                      <p className="text-foreground text-sm font-bold tabular-nums">$0.00 copay</p>
                      <p className="text-muted-foreground text-xs tabular-nums">Unlimited annual wellness visits</p>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Row 2: Specialist Visits */}
                <TableRow>
                  <TableCell className="align-top font-medium">
                    <div className="flex items-start gap-2.5">
                      <div className="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border">
                        <Stethoscope className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-foreground text-sm font-semibold">Specialist Visits</p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Cardiology, neurology, physical & occupational therapy, diagnostic imaging, and outpatient
                          consultations.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <span className="text-foreground text-sm font-bold tabular-nums">80% after deductible</span>
                      <p className="text-muted-foreground text-xs tabular-nums">$50.00 office visit copay</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="space-y-0.5">
                      <span className="text-foreground text-sm font-medium tabular-nums">60% of UCR</span>
                      <p className="text-muted-foreground text-xs">Balance billing applies above UCR</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span className="font-medium">Required for Procedures</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">PA required for MRI, CT scans & surgery</p>
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <div className="space-y-0.5">
                      <p className="text-foreground text-sm font-bold tabular-nums">$50.00 copay</p>
                      <p className="text-muted-foreground text-xs tabular-nums">Max 30 PT visits / calendar year</p>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Row 3: Urgent Care & ER */}
                <TableRow>
                  <TableCell className="align-top font-medium">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      <Hospital className="size-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-foreground text-sm font-semibold">Urgent Care & ER</p>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        Emergency department trauma evaluation, hospital triage, advanced imaging, and walk-in urgent
                        clinics.
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <span className="text-foreground text-sm font-bold tabular-nums">100% after copay</span>
                      <p className="text-muted-foreground text-xs tabular-nums">$100 Urgent / $350 ER + 20%</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="space-y-0.5">
                      <span className="text-foreground text-sm font-medium tabular-nums">
                        Emergency: In-Network Rate
                      </span>
                      <p className="text-muted-foreground text-xs">Prudent Layperson Standard (ACA)</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="size-3.5 shrink-0" />
                      <span className="font-medium">Exempt for Emergency</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">Notification requested within 48h</p>
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <div className="space-y-0.5">
                      <p className="text-foreground text-sm font-bold tabular-nums">$100.00 / $350.00</p>
                      <p className="text-muted-foreground text-xs tabular-nums">ER copay waived if admitted</p>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Row 4: Prescription Drug Tiers */}
                <TableRow>
                  <TableCell className="align-top font-medium">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <Pill className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-foreground text-sm font-semibold">Prescription Drug Tiers</p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Tier 1 Generic, Tier 2 Preferred Brand, Tier 3 Non-Preferred Brand, Tier 4 Specialty
                          Biologics.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <span className="text-foreground text-sm font-bold tabular-nums">Tier 1–3 Copay / T4 20%</span>
                      <p className="text-muted-foreground text-xs tabular-nums">T1: $10 · T2: $35 · T3: $70</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="space-y-0.5">
                      <span className="text-muted-foreground text-sm font-medium">Not Covered</span>
                      <p className="text-muted-foreground text-xs">Participating retail & mail order only</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span className="font-medium">Step Therapy / PA</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">Mandatory PA for Tier 4 Specialty</p>
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <div className="space-y-0.5">
                      <p className="text-foreground text-sm font-bold tabular-nums">$10.00 – $70.00</p>
                      <p className="text-muted-foreground text-xs tabular-nums">$3,500.00 Rx Annual OOP Max</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Insurance / Coordination of Benefits (COB) Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="text-primary size-4" />
                <CardTitle className="text-base sm:text-lg">
                  Secondary Insurance & Coordination of Benefits (COB)
                </CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Medicare secondary payor rules and automated electronic crossover claims coordination.
              </CardDescription>
            </div>
            <Badge
              wrap
              variant="outline"
              className="w-fit border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            >
              Automatic Crossover Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Secondary Payer */}
            <div className="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3.5">
              <p className="text-muted-foreground text-xs font-medium">Secondary Payer</p>
              <p className="text-foreground text-sm font-semibold">Medicare Part B (CMS)</p>
              <p className="text-muted-foreground text-xs">Medical Insurance</p>
            </div>

            {/* Policy & HICN Number */}
            <div className="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3.5">
              <p className="text-muted-foreground text-xs font-medium">Secondary Policy / MBI</p>
              <p className="text-foreground font-mono text-sm font-semibold tabular-nums">#MED-9023411-B</p>
              <p className="text-muted-foreground text-xs">Coordination: Secondary Payor</p>
            </div>

            {/* Part B Deductible */}
            <div className="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3.5">
              <p className="text-muted-foreground text-xs font-medium">Medicare Part B Deductible</p>
              <p className="text-foreground text-sm font-semibold tabular-nums">$240.00 / $240.00 met</p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">100% Deductible Satisfied</p>
            </div>

            {/* Secondary Benefit Coverage */}
            <div className="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3.5">
              <p className="text-muted-foreground text-xs font-medium">Secondary Cost Sharing</p>
              <p className="text-foreground text-sm font-semibold">20% Coinsurance Balance</p>
              <p className="text-muted-foreground text-xs">Covers patient gap liability</p>
            </div>
          </div>

          {/* Coordination of Benefits EDI Advice Banner */}
          <div className="border-border/80 bg-muted/40 flex items-start gap-3 rounded-lg border p-3.5">
            <Info className="text-primary mt-0.5 size-4 shrink-0" />
            <div className="space-y-0.5 text-xs leading-relaxed">
              <p className="text-foreground font-semibold">Automated 837P / EDI-271 Crossover Agreement (COBA)</p>
              <p className="text-muted-foreground">
                Primary claims processed by BlueCross BlueShield automatically transmit to Medicare for secondary
                adjudication. No manual paper secondary submission is required for eligible in-network clinical
                encounters.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InsuranceEligibilityChecker
