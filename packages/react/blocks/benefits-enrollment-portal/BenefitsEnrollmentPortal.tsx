'use client'

import * as React from 'react'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileSignature,
  HeartPulse,
  PiggyBank,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

export interface BenefitsEnrollmentPortalProps {
  employeeName?: string
  employeeId?: string
  coverageTier?: string
  department?: string
  deadlineDate?: string
  daysRemaining?: number
  annualSalary?: number
  payPeriodsPerYear?: number
  initialMedicalPlan?: string
  initialDentalPlan?: string
  initialVisionPlan?: string
  initial401kRate?: number
  className?: string
}

interface MedicalPlan {
  id: string
  name: string
  carrier: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'outline'
  employeeCostPerPaycheck: number
  employerCostPerMonth: number
  deductible: string
  outOfPocketMax: string
  copayOrCoinsurance: string
  hsaSeed: number
  description: string
  highlights: string[]
}

const MEDICAL_PLANS: MedicalPlan[] = [
  {
    id: 'medical-ppo-hsa',
    name: 'BlueCross PPO High Deductible + HSA',
    carrier: 'BlueCross BlueShield',
    badge: 'Popular · HSA Eligible',
    badgeVariant: 'secondary',
    employeeCostPerPaycheck: 85,
    employerCostPerMonth: 450,
    deductible: '$1,600 ind / $3,200 fam',
    outOfPocketMax: '$4,000 ind / $8,000 fam',
    copayOrCoinsurance: '10% after deductible',
    hsaSeed: 500,
    description: 'Triple tax-advantaged health savings account with an employer-funded annual HSA contribution.',
    highlights: [
      '$500 annual employer HSA contribution funded on Jan 1',
      '100% preventive care covered in-network with $0 deductible',
      'Flexible nationwide PPO specialist access without referrals',
    ],
  },
  {
    id: 'medical-gold-ppo',
    name: 'BlueCross Gold Premier PPO',
    carrier: 'BlueCross BlueShield',
    badge: 'Low $250 Deductible',
    badgeVariant: 'outline',
    employeeCostPerPaycheck: 180,
    employerCostPerMonth: 520,
    deductible: '$250 ind / $500 fam',
    outOfPocketMax: '$2,500 ind / $5,000 fam',
    copayOrCoinsurance: '$20 Primary / $40 Specialist',
    hsaSeed: 0,
    description: 'Predictable low-copay coverage designed for frequent medical care, prescriptions, and peace of mind.',
    highlights: [
      'Ultra-low $250 individual deductible for comprehensive care',
      '$20 primary care & $40 specialist fixed office visit copays',
      'Tier 1 generic prescriptions covered at $10 copay',
    ],
  },
  {
    id: 'medical-kaiser-hmo',
    name: 'Kaiser Permanente HMO',
    carrier: 'Kaiser Permanente',
    badge: '$0 Deductible',
    badgeVariant: 'outline',
    employeeCostPerPaycheck: 40,
    employerCostPerMonth: 420,
    deductible: '$0 ind / $0 fam',
    outOfPocketMax: '$1,500 ind / $3,000 fam',
    copayOrCoinsurance: '$15 Primary / $25 Specialist',
    hsaSeed: 0,
    description: 'Integrated in-network HMO coverage with zero deductible and lowest payroll deduction.',
    highlights: [
      '$0 deductible with everything under one roof at Kaiser centers',
      '$15 copay for routine medical and virtual telehealth visits',
      'Lowest bi-weekly payroll deduction across all medical tiers',
    ],
  },
]

interface DentalPlan {
  id: string
  name: string
  carrier: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'outline'
  employeeCostPerPaycheck: number
  employerCostPerMonth: number
  annualMax: string
  preventive: string
  basic: string
  majorOrOrtho: string
  description: string
}

const DENTAL_PLANS: DentalPlan[] = [
  {
    id: 'dental-comprehensive',
    name: 'Delta Dental Premier Comprehensive',
    carrier: 'Delta Dental',
    badge: 'Comprehensive · Ortho Included',
    badgeVariant: 'secondary',
    employeeCostPerPaycheck: 14,
    employerCostPerMonth: 35,
    annualMax: '$2,000 / member / yr',
    preventive: '100% (2 cleanings & exams / yr)',
    basic: '80% coverage (fillings & endodontics)',
    majorOrOrtho: '50% coverage ($1,500 lifetime ortho)',
    description: 'Complete coverage for preventative cleanings, major restorative procedures, and orthodontic care.',
  },
  {
    id: 'dental-basic',
    name: 'Delta Dental Basic',
    carrier: 'Delta Dental',
    badge: 'Basic Preventive',
    badgeVariant: 'outline',
    employeeCostPerPaycheck: 5,
    employerCostPerMonth: 20,
    annualMax: '$1,000 / member / yr',
    preventive: '100% (2 cleanings / yr)',
    basic: '50% coverage',
    majorOrOrtho: 'Not covered',
    description: 'Essential preventive dental care for routine bi-annual cleanings, exams, and basic cavity fillings.',
  },
  {
    id: 'dental-waive',
    name: 'Waive Dental Coverage',
    carrier: 'Decline',
    employeeCostPerPaycheck: 0,
    employerCostPerMonth: 0,
    annualMax: '$0',
    preventive: 'None',
    basic: 'None',
    majorOrOrtho: 'None',
    description: 'Decline dental insurance coverage for the 2026-2027 plan year.',
  },
]

interface VisionPlan {
  id: string
  name: string
  carrier: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'outline'
  employeeCostPerPaycheck: number
  employerCostPerMonth: number
  examCopay: string
  frameAllowance: string
  lenses: string
  description: string
}

const VISION_PLANS: VisionPlan[] = [
  {
    id: 'vision-choice-plus',
    name: 'VSP Vision Choice Plus',
    carrier: 'VSP Vision Care',
    badge: '$200 Frame Allowance',
    badgeVariant: 'secondary',
    employeeCostPerPaycheck: 8,
    employerCostPerMonth: 12,
    examCopay: '$10 copay (every 12 mo)',
    frameAllowance: '$200 allowance + 20% off overage',
    lenses: 'Progressives & anti-glare covered in full',
    description: 'Premium vision coverage with generous designer frame allowances and full progressive lens coverage.',
  },
  {
    id: 'vision-standard',
    name: 'VSP Standard Vision',
    carrier: 'VSP Vision Care',
    badge: 'Standard',
    badgeVariant: 'outline',
    employeeCostPerPaycheck: 3,
    employerCostPerMonth: 8,
    examCopay: '$15 copay (every 12 mo)',
    frameAllowance: '$120 frame allowance',
    lenses: 'Standard single-vision lenses covered',
    description: 'Core vision benefit for annual eye exams and standard prescription glasses.',
  },
  {
    id: 'vision-waive',
    name: 'Waive Vision Coverage',
    carrier: 'Decline',
    employeeCostPerPaycheck: 0,
    employerCostPerMonth: 0,
    examCopay: '$0',
    frameAllowance: '$0',
    lenses: 'None',
    description: 'Decline vision insurance coverage for the 2026-2027 plan year.',
  },
]

const SLIDER_MARKS = {
  1: '1%',
  4: '4%',
  6: '6% (Max Match)',
  10: '10%',
  15: '15%',
  20: '20%',
}

export function BenefitsEnrollmentPortal({
  employeeName = 'Elena Rostova',
  employeeId = 'EMP-48201',
  coverageTier = 'Employee + Spouse',
  department = 'Engineering · Senior Staff',
  deadlineDate = 'Sep 15',
  daysRemaining = 14,
  annualSalary = 120000,
  payPeriodsPerYear = 24,
  initialMedicalPlan = 'medical-ppo-hsa',
  initialDentalPlan = 'dental-comprehensive',
  initialVisionPlan = 'vision-choice-plus',
  initial401kRate = 6,
  className,
}: BenefitsEnrollmentPortalProps) {
  const [selectedMedical, setSelectedMedical] = React.useState<string>(initialMedicalPlan)
  const [selectedDental, setSelectedDental] = React.useState<string>(initialDentalPlan)
  const [selectedVision, setSelectedVision] = React.useState<string>(initialVisionPlan)
  const [k401Rate, setK401Rate] = React.useState<number>(initial401kRate)
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [signatureAcknowledged, setSignatureAcknowledged] = React.useState<boolean>(false)
  const [showSignModal, setShowSignModal] = React.useState<boolean>(false)

  const currentMedical = React.useMemo(
    () => MEDICAL_PLANS.find((p) => p.id === selectedMedical) ?? MEDICAL_PLANS[0],
    [selectedMedical],
  )
  const currentDental = React.useMemo(
    () => DENTAL_PLANS.find((p) => p.id === selectedDental) ?? DENTAL_PLANS[0],
    [selectedDental],
  )
  const currentVision = React.useMemo(
    () => VISION_PLANS.find((p) => p.id === selectedVision) ?? VISION_PLANS[0],
    [selectedVision],
  )

  const paycheckGross = annualSalary / payPeriodsPerYear

  // 401(k) Calculations
  const k401EmployeePerPaycheck = (paycheckGross * k401Rate) / 100
  const k401EmployeeAnnual = k401EmployeePerPaycheck * payPeriodsPerYear

  const employerMatchRate = React.useMemo(() => {
    if (k401Rate <= 0) return 0
    if (k401Rate <= 4) return k401Rate
    if (k401Rate === 5) return 4.5
    return 5.0
  }, [k401Rate])

  const k401EmployerPerPaycheck = (paycheckGross * employerMatchRate) / 100
  const k401EmployerAnnual = k401EmployerPerPaycheck * payPeriodsPerYear
  const maxMatchUnlocked = k401Rate >= 6
  const missedMatchAnnual = Math.max(0, (annualSalary * 5.0) / 100 - k401EmployerAnnual)

  // Health costs per paycheck
  const healthCostPerPaycheck =
    currentMedical.employeeCostPerPaycheck +
    currentDental.employeeCostPerPaycheck +
    currentVision.employeeCostPerPaycheck

  const totalEmployeePerPaycheck = healthCostPerPaycheck + k401EmployeePerPaycheck
  const estimatedTaxSavingsPerPaycheck = Math.round(totalEmployeePerPaycheck * 0.25 * 100) / 100
  const netTakeHomeImpact = totalEmployeePerPaycheck - estimatedTaxSavingsPerPaycheck

  // Employer total annual value
  const employerMedicalAnnual = currentMedical.employerCostPerMonth * 12
  const employerDentalAnnual = currentDental.employerCostPerMonth * 12
  const employerVisionAnnual = currentVision.employerCostPerMonth * 12
  const hsaSeedAnnual = currentMedical.hsaSeed
  const employerLifeDisabilityAnnual = 2386

  const totalEmployerAnnualValue =
    employerMedicalAnnual +
    employerDentalAnnual +
    employerVisionAnnual +
    hsaSeedAnnual +
    k401EmployerAnnual +
    employerLifeDisabilityAnnual

  const handleSignAndSubmit = () => {
    if (!signatureAcknowledged) return
    setIsSubmitted(true)
    setShowSignModal(false)
  }

  const handleResetEnrollment = () => {
    setIsSubmitted(false)
    setSignatureAcknowledged(false)
  }

  return (
    <div
      data-slot="benefits-enrollment-portal"
      className={cn('mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8', className)}
    >
      {/* Header Banner */}
      <div className="border-border bg-card relative overflow-hidden rounded-xl border p-6 shadow-xs">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge
                wrap
                variant="outline"
                className="max-w-full gap-1.5 border-amber-500/30 bg-amber-500/10 px-3 py-1 text-left text-xs font-semibold text-amber-700 dark:text-amber-400"
              >
                <Clock className="size-3.5" />
                Open Enrollment Period Ends {deadlineDate} · {daysRemaining} Days Left
              </Badge>
              {isSubmitted && (
                <Badge
                  variant="secondary"
                  className="border-success/30 bg-success/10 text-success gap-1 text-xs font-semibold"
                >
                  <CheckCircle2 className="size-3.5" />
                  Elections Submitted &amp; Signed
                </Badge>
              )}
            </div>

            <div>
              <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                Annual Benefits Open Enrollment
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Select your health coverage, retirement matching, and ancillary wellness plans for the 2026-2027 plan
                year.
              </p>
            </div>

            {/* Employee metadata strip */}
            <div className="border-border/60 bg-muted/40 text-muted-foreground mt-3 inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg border px-3.5 py-2 text-xs">
              <div className="text-foreground flex items-center gap-1.5 font-medium">
                <User className="text-primary size-3.5" />
                <span>{employeeName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="size-3.5" />
                <span>
                  Tier: <strong className="text-foreground font-medium">{coverageTier}</strong>
                </span>
              </div>
              <div>
                <span>
                  ID: <strong className="text-foreground font-mono font-medium">{employeeId}</strong>
                </span>
              </div>
              <div>
                <span>
                  Base:{' '}
                  <strong className="text-foreground font-medium tabular-nums">
                    ${annualSalary.toLocaleString('en-US')}/yr
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col lg:items-end">
            {!isSubmitted ? (
              <Button size="lg" className="gap-2 font-semibold shadow-xs" onClick={() => setShowSignModal(true)}>
                <FileSignature className="size-4" />
                Save Selections &amp; Sign
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="border-success/40 bg-success/5 text-success hover:bg-success/10 gap-2 font-semibold"
                onClick={handleResetEnrollment}
              >
                <RefreshCw className="size-4" />
                Modify My Elections
              </Button>
            )}

            <p className="text-muted-foreground text-xs lg:text-right">
              Changes take effect <span className="text-foreground font-medium">October 1, 2026</span>
            </p>
          </div>
        </div>
      </div>

      {/* Submitted Banner (If Confirmed) */}
      {isSubmitted && (
        <div className="border-success/30 bg-success/10 text-foreground flex flex-col items-start justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-start gap-3">
            <div className="border-success/30 bg-success/20 text-success mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border">
              <Check className="size-4" />
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">
                Enrollment Signed &amp; Confirmed for Plan Year 2026-2027
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Confirmation Reference: <span className="text-foreground font-mono font-medium">#BEN-2026-89241</span> ·
                Signed by {employeeName} on August 21, 2026.
              </p>
            </div>
          </div>
          <Button aria-label="Download attachment" variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="size-3.5" />
            Download Summary PDF
          </Button>
        </div>
      )}

      {/* Main 2-Column Grid: Plan Options (Col 8) + Sticky Paycheck Impact (Col 4) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Plan Selection Flow */}
        <div className="space-y-8 lg:col-span-8">
          {/* Category 1: Medical Health Plan */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
                <div className="flex items-center gap-2.5">
                  <div className="border-primary/20 bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg border">
                    <HeartPulse className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">1. Medical Health Plan</CardTitle>
                    <CardDescription>
                      Comprehensive inpatient, outpatient, prescription, and preventive medical coverage.
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  3 Plans Available
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <RadioGroup value={selectedMedical} onValueChange={(val) => setSelectedMedical(val)} className="gap-3.5">
                {MEDICAL_PLANS.map((plan) => {
                  const isSelected = selectedMedical === plan.id
                  return (
                    <div
                      key={plan.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedMedical === plan.id}
                      className={cn(
                        'focus-visible:ring-ring relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4.5 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                        selectedMedical === plan.id
                          ? 'border-primary bg-primary/[0.03] dark:bg-primary/10 ring-primary/30 shadow-xs ring-1'
                          : 'border-border hover:border-border/80 hover:bg-muted/30',
                      )}
                      onClick={() => setSelectedMedical(plan.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedMedical(plan.id)
                        }
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-wrap items-start gap-3">
                          <RadioGroupItem id={plan.id} value={plan.id} className="mt-0.5" />
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <label
                                htmlFor={plan.id}
                                className="text-foreground cursor-pointer text-sm font-semibold sm:text-base"
                              >
                                {plan.name}
                              </label>
                              {plan.badge && (
                                <Badge variant={plan.badgeVariant} className="text-xs font-medium">
                                  {plan.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {plan.carrier} · {plan.description}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-foreground text-lg font-bold tabular-nums sm:text-xl">
                              ${plan.employeeCostPerPaycheck}
                            </span>
                            <span className="text-muted-foreground text-xs font-normal">/ paycheck</span>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            Employer pays{' '}
                            <span className="text-foreground font-medium tabular-nums">
                              ${plan.employerCostPerMonth}/mo
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Plan Benefit Matrix Details */}
                      <div className="border-border/60 bg-card/60 mt-1 grid grid-cols-2 gap-2.5 rounded-lg border p-3 text-xs sm:grid-cols-4">
                        <div>
                          <span className="text-muted-foreground block">Annual Deductible</span>
                          <span className="text-foreground font-semibold tabular-nums">{plan.deductible}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Out-of-Pocket Max</span>
                          <span className="text-foreground font-semibold tabular-nums">{plan.outOfPocketMax}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Primary / Specialist</span>
                          <span className="text-foreground font-semibold">{plan.copayOrCoinsurance}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">HSA Company Seed</span>
                          <span
                            className={
                              plan.hsaSeed > 0
                                ? 'text-success font-semibold tabular-nums'
                                : 'text-muted-foreground font-medium'
                            }
                          >
                            {plan.hsaSeed > 0 ? `$${plan.hsaSeed} / yr` : 'Not eligible'}
                          </span>
                        </div>
                      </div>

                      {/* Plan Bullet Highlights */}
                      <ul className="text-muted-foreground mt-0.5 space-y-1 text-xs">
                        {plan.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="text-primary size-3.5 shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Category 2: Dental Plan */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
                <div className="flex items-center gap-2.5">
                  <div className="border-primary/20 bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg border">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">2. Dental Plan</CardTitle>
                    <CardDescription>
                      Preventive exams, cleanings, restorative treatments, and orthodontic benefits.
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  2 Plans + Waive
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <RadioGroup value={selectedDental} onValueChange={(val) => setSelectedDental(val)} className="gap-3.5">
                {DENTAL_PLANS.map((plan) => {
                  const isSelected = selectedDental === plan.id
                  return (
                    <div
                      key={plan.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedDental === plan.id}
                      className={cn(
                        'focus-visible:ring-ring relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4.5 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                        selectedDental === plan.id
                          ? 'border-primary bg-primary/[0.03] dark:bg-primary/10 ring-primary/30 shadow-xs ring-1'
                          : 'border-border hover:border-border/80 hover:bg-muted/30',
                      )}
                      onClick={() => setSelectedDental(plan.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedDental(plan.id)
                        }
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-wrap items-start gap-3">
                          <RadioGroupItem id={plan.id} value={plan.id} className="mt-0.5" />
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <label
                                htmlFor={plan.id}
                                className="text-foreground cursor-pointer text-sm font-semibold sm:text-base"
                              >
                                {plan.name}
                              </label>
                              {plan.badge && (
                                <Badge variant={plan.badgeVariant ?? 'outline'} className="text-xs font-medium">
                                  {plan.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {plan.carrier} · {plan.description}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-foreground text-lg font-bold tabular-nums sm:text-xl">
                              ${plan.employeeCostPerPaycheck}
                            </span>
                            <span className="text-muted-foreground text-xs font-normal">/ paycheck</span>
                          </div>
                          {plan.employerCostPerMonth > 0 ? (
                            <p className="text-muted-foreground text-xs">
                              Employer pays{' '}
                              <span className="text-foreground font-medium tabular-nums">
                                ${plan.employerCostPerMonth}/mo
                              </span>
                            </p>
                          ) : (
                            <p className="text-muted-foreground text-xs">No payroll deduction</p>
                          )}
                        </div>
                      </div>

                      {plan.employeeCostPerPaycheck > 0 && (
                        <div className="border-border/60 bg-card/60 mt-1 grid grid-cols-2 gap-2.5 rounded-lg border p-3 text-xs sm:grid-cols-4">
                          <div>
                            <span className="text-muted-foreground block">Annual Maximum</span>
                            <span className="text-foreground font-semibold tabular-nums">{plan.annualMax}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Preventive Cleanings</span>
                            <span className="text-foreground font-semibold">{plan.preventive}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Basic Services</span>
                            <span className="text-foreground font-semibold">{plan.basic}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Major &amp; Orthodontics</span>
                            <span className="text-foreground font-semibold">{plan.majorOrOrtho}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Category 3: Vision Plan */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
                <div className="flex items-center gap-2.5">
                  <div className="border-primary/20 bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg border">
                    <Eye className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">3. Vision Plan</CardTitle>
                    <CardDescription>
                      Routine eye exams, designer frame allowances, contact lenses, and progressive lens discounts.
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  2 Plans + Waive
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <RadioGroup value={selectedVision} onValueChange={(val) => setSelectedVision(val)} className="gap-3.5">
                {VISION_PLANS.map((plan) => {
                  const isSelected = selectedVision === plan.id
                  return (
                    <div
                      key={plan.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedVision === plan.id}
                      className={cn(
                        'focus-visible:ring-ring relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4.5 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                        selectedVision === plan.id
                          ? 'border-primary bg-primary/[0.03] dark:bg-primary/10 ring-primary/30 shadow-xs ring-1'
                          : 'border-border hover:border-border/80 hover:bg-muted/30',
                      )}
                      onClick={() => setSelectedVision(plan.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedVision(plan.id)
                        }
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-wrap items-start gap-3">
                          <RadioGroupItem id={plan.id} value={plan.id} className="mt-0.5" />
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <label
                                htmlFor={plan.id}
                                className="text-foreground cursor-pointer text-sm font-semibold sm:text-base"
                              >
                                {plan.name}
                              </label>
                              {plan.badge && (
                                <Badge variant={plan.badgeVariant ?? 'outline'} className="text-xs font-medium">
                                  {plan.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {plan.carrier} · {plan.description}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-foreground text-lg font-bold tabular-nums sm:text-xl">
                              ${plan.employeeCostPerPaycheck}
                            </span>
                            <span className="text-muted-foreground text-xs font-normal">/ paycheck</span>
                          </div>
                          {plan.employerCostPerMonth > 0 ? (
                            <p className="text-muted-foreground text-xs">
                              Employer pays{' '}
                              <span className="text-foreground font-medium tabular-nums">
                                ${plan.employerCostPerMonth}/mo
                              </span>
                            </p>
                          ) : (
                            <p className="text-muted-foreground text-xs">No payroll deduction</p>
                          )}
                        </div>
                      </div>

                      {plan.employeeCostPerPaycheck > 0 && (
                        <div className="border-border/60 bg-card/60 mt-1 grid grid-cols-1 gap-2.5 rounded-lg border p-3 text-xs sm:grid-cols-3">
                          <div>
                            <span className="text-muted-foreground block">Annual Exam Copay</span>
                            <span className="text-foreground font-semibold">{plan.examCopay}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Frame Allowance</span>
                            <span className="text-foreground font-semibold tabular-nums">{plan.frameAllowance}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Prescription Lenses</span>
                            <span className="text-foreground font-semibold">{plan.lenses}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Category 4: 401(k) Retirement & Employer Match */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="border-primary/20 bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg border">
                    <PiggyBank className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">4. 401(k) Retirement &amp; Employer Match</CardTitle>
                    <CardDescription>
                      Pre-tax salary deferrals with tiered 100% + 50% company matching formula.
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={maxMatchUnlocked ? 'default' : 'outline'} className="text-xs">
                  {maxMatchUnlocked ? 'Max Match Active' : 'Match Available'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Employer Match Callout Box */}
              <div className="border-primary/30 bg-primary/5 dark:bg-primary/10 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-start gap-3">
                  <Sparkles className="text-primary mt-0.5 size-5 shrink-0" />
                  <div className="space-y-1">
                    <span className="text-foreground text-sm font-semibold">Company Match Formula</span>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      100% match up to 4% + 50% match on next 2% ·{' '}
                      <strong className="text-foreground font-medium">Maximum $6,000 employer match unlocked!</strong>
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <Badge
                    variant={maxMatchUnlocked ? 'secondary' : 'outline'}
                    className={cn(
                      'gap-1.5 px-3 py-1 text-xs font-semibold',
                      maxMatchUnlocked
                        ? 'border-success/30 bg-success/10 text-success'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
                    )}
                  >
                    {maxMatchUnlocked ? (
                      <>
                        <CheckCircle2 className="size-3.5" />
                        100% Max Match Achieved ($6,000/yr)
                      </>
                    ) : (
                      <>
                        <AlertCircle className="size-3.5" />
                        Leaving ${missedMatchAnnual.toLocaleString('en-US')}/yr on table
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Interactive Slider Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-foreground text-sm font-semibold">Your Pre-Tax Contribution Rate</span>
                    <p className="text-muted-foreground text-xs">
                      Calculated from gross salary ($
                      {paycheckGross.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      / semi-monthly paycheck)
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-primary text-2xl font-bold tabular-nums sm:text-3xl">{k401Rate}%</span>
                      <span className="text-muted-foreground text-xs">Contribution</span>
                    </div>
                    <span className="text-foreground text-xs font-medium tabular-nums">
                      ${k401EmployeePerPaycheck.toFixed(2)} / paycheck (${k401EmployeeAnnual.toLocaleString('en-US')}
                      /yr)
                    </span>
                  </div>
                </div>

                <div className="py-5">
                  <Slider
                    value={[k401Rate]}
                    min={1}
                    max={20}
                    step={1}
                    marks={SLIDER_MARKS}
                    tooltip={(val) =>
                      `${val}% (${((annualSalary * val) / 100).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      })}/yr)`
                    }
                    onValueChange={(val) => setK401Rate(val[0])}
                  />
                </div>
              </div>

              {/* 401(k) Financial Impact Breakdown */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="border-border bg-card/60 rounded-lg border p-3 text-center sm:text-left">
                  <span className="text-muted-foreground block text-xs">Your Paycheck Deferral</span>
                  <span className="text-foreground text-lg font-bold tabular-nums">
                    ${k401EmployeePerPaycheck.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground block text-xs tabular-nums">
                    ${k401EmployeeAnnual.toLocaleString('en-US')} / year
                  </span>
                </div>

                <div className="border-success/30 bg-success/5 rounded-lg border p-3 text-center sm:text-left">
                  <span className="text-success block text-xs font-medium">Employer Match Added</span>
                  <span className="text-success text-lg font-bold tabular-nums">
                    +${k401EmployerPerPaycheck.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground block text-xs tabular-nums">
                    ${k401EmployerAnnual.toLocaleString('en-US')} / year (Free Match)
                  </span>
                </div>

                <div className="border-border bg-card/60 rounded-lg border p-3 text-center sm:text-left">
                  <span className="text-muted-foreground block text-xs">Total 401(k) Annual Savings</span>
                  <span className="text-foreground text-lg font-bold tabular-nums">
                    ${(k401EmployeeAnnual + k401EmployerAnnual).toLocaleString('en-US')}
                  </span>
                  <span className="text-muted-foreground block text-xs">2026 IRS Cap: $23,500</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sticky Paycheck Impact Summary Box (Col 4) */}
        <div className="lg:sticky lg:top-8 lg:col-span-4">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Paycheck Impact Summary
                </span>
                <Badge variant="outline" className="text-xs">
                  Semi-Monthly
                </Badge>
              </div>

              {/* Primary Highlight Metric 1: Total Employee Cost per Paycheck */}
              <div className="mt-4 space-y-1">
                <span className="text-muted-foreground text-xs font-medium">Total Employee Benefit Cost</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                    ${healthCostPerPaycheck.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground text-sm font-normal"> / pay period</span>
                </div>
                <p className="text-muted-foreground text-xs">Pre-tax health, dental, and vision deductions</p>
              </div>

              {/* Primary Highlight Metric 2: Total Annual Employer Benefit Value */}
              <div className="border-primary/20 bg-primary/5 dark:bg-primary/10 mt-4 rounded-xl border p-3.5">
                <span className="text-muted-foreground block text-xs font-medium">Total Annual Employer Value</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-primary text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                    $
                    {totalEmployerAnnualValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-muted-foreground text-xs font-normal"> / year</span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Includes company medical, dental, vision subsidies, HSA seed, match &amp; insurance.
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <Separator />

              {/* Itemized Paycheck Deductions */}
              <div className="space-y-2 text-xs">
                <span className="text-muted-foreground block font-semibold tracking-wider uppercase">
                  Employee Payroll Deductions
                </span>

                <div className="flex items-center justify-between">
                  <span className="text-foreground">
                    Medical ({currentMedical.name.split(' ')[0]} {currentMedical.name.split(' ')[1]})
                  </span>
                  <span className="text-foreground font-medium tabular-nums">
                    ${currentMedical.employeeCostPerPaycheck.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-foreground">
                    Dental ({currentDental.name.split(' ')[0]} {currentDental.name.split(' ')[1]})
                  </span>
                  <span className="text-foreground font-medium tabular-nums">
                    ${currentDental.employeeCostPerPaycheck.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-foreground">
                    Vision ({currentVision.name.split(' ')[0]} {currentVision.name.split(' ')[1]})
                  </span>
                  <span className="text-foreground font-medium tabular-nums">
                    ${currentVision.employeeCostPerPaycheck.toFixed(2)}
                  </span>
                </div>

                <div className="border-border/60 flex items-center justify-between border-t pt-1.5 font-semibold">
                  <span className="text-foreground">Pre-Tax Health Total</span>
                  <span className="text-foreground tabular-nums">${healthCostPerPaycheck.toFixed(2)}</span>
                </div>

                <div className="text-muted-foreground flex items-center justify-between">
                  <span>401(k) Contribution ({k401Rate}%)</span>
                  <span className="text-foreground font-medium tabular-nums">
                    ${k401EmployeePerPaycheck.toFixed(2)}
                  </span>
                </div>

                <div className="bg-muted/50 flex items-center justify-between rounded-md p-2 font-semibold">
                  <span className="text-foreground">Total Pre-Tax per Paycheck</span>
                  <span className="text-foreground tabular-nums">${totalEmployeePerPaycheck.toFixed(2)}</span>
                </div>

                <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-1">
                  <span>Est. Pre-Tax Tax Savings (~25%)</span>
                  <span className="text-success font-medium tabular-nums">
                    -${estimatedTaxSavingsPerPaycheck.toFixed(2)}
                  </span>
                </div>

                <div className="text-muted-foreground flex items-center justify-between">
                  <span>Est. Net Take-Home Impact</span>
                  <span className="text-foreground font-medium tabular-nums">-${netTakeHomeImpact.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              {/* Itemized Employer Annual Contributions */}
              <div className="space-y-1.5 text-xs">
                <span className="text-muted-foreground block font-semibold tracking-wider uppercase">
                  Employer Benefits Breakdown
                </span>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Medical Subsidy</span>
                  <span className="text-foreground font-medium tabular-nums">
                    ${(currentMedical.employerCostPerMonth * 12).toLocaleString('en-US')}/yr
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dental Subsidy</span>
                  <span className="text-foreground font-medium tabular-nums">
                    ${(currentDental.employerCostPerMonth * 12).toLocaleString('en-US')}/yr
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Vision Subsidy</span>
                  <span className="text-foreground font-medium tabular-nums">
                    ${(currentVision.employerCostPerMonth * 12).toLocaleString('en-US')}/yr
                  </span>
                </div>

                {currentMedical.hsaSeed > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">HSA Annual Contribution</span>
                    <span className="text-foreground font-medium tabular-nums">
                      ${currentMedical.hsaSeed.toLocaleString('en-US')}/yr
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">401(k) Employer Match</span>
                  <span className="text-foreground font-medium tabular-nums">
                    ${k401EmployerAnnual.toLocaleString('en-US')}/yr
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Life, AD&amp;D &amp; Disability</span>
                  <span className="text-foreground font-medium tabular-nums">
                    ${employerLifeDisabilityAnnual.toLocaleString('en-US')}/yr
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2.5 pt-0">
              {!isSubmitted ? (
                <Button
                  size="lg"
                  className="w-full gap-2 font-semibold shadow-xs"
                  onClick={() => setShowSignModal(true)}
                >
                  <FileSignature className="size-4" />
                  Save Selections &amp; Sign
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="default"
                  className="border-success/30 bg-success/10 text-success w-full gap-2 font-semibold"
                  onClick={handleResetEnrollment}
                >
                  <Check className="size-4" />
                  Elections Signed (Edit)
                </Button>
              )}

              <p className="text-muted-foreground text-center text-xs">
                Annual elections lock on {deadlineDate}, 11:59 PM EST
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Electronic Signature Confirmation Modal Dialog */}
      {showSignModal && (
        <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="border-border bg-card animate-in fade-in zoom-in-95 relative w-full max-w-lg rounded-xl border p-6 shadow-xl duration-150">
            <div className="space-y-2">
              <div className="text-primary flex items-center gap-2">
                <FileSignature className="size-5" />
                <h3 className="text-foreground text-lg font-bold">Review &amp; Sign Elective Enrollment</h3>
              </div>
              <p className="text-muted-foreground text-xs">
                Please verify your selections below before electronically signing for the 2026-2027 plan year.
              </p>
            </div>

            <div className="border-border bg-muted/40 my-4 space-y-2 rounded-lg border p-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Employee:</span>
                <span className="text-foreground font-medium">
                  {employeeName} ({coverageTier})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Medical Plan:</span>
                <span className="text-foreground font-medium">{currentMedical.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dental Plan:</span>
                <span className="text-foreground font-medium">{currentDental.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vision Plan:</span>
                <span className="text-foreground font-medium">{currentVision.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">401(k) Contribution:</span>
                <span className="text-foreground font-medium tabular-nums">
                  {k401Rate}% (${k401EmployeePerPaycheck.toFixed(2)} / paycheck)
                </span>
              </div>
              <div className="border-border/60 flex items-center justify-between border-t pt-2 font-bold">
                <span className="text-foreground">Total Deduction per Paycheck:</span>
                <span className="text-foreground tabular-nums">${totalEmployeePerPaycheck.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-2.5 select-none">
                <input
                  type="checkbox"
                  checked={signatureAcknowledged}
                  onChange={(e) => setSignatureAcknowledged(e.target.checked)}
                  className="border-input text-primary focus-visible:ring-ring mt-0.5 size-4 rounded border focus-visible:ring-2"
                />
                <span className="text-muted-foreground text-xs leading-relaxed">
                  I acknowledge that I have selected the benefit plans above and authorize pre-tax semi-monthly payroll
                  deductions commencing October 1, 2026.
                </span>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <Button variant="outline" size="sm" onClick={() => setShowSignModal(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!signatureAcknowledged}
                className="gap-1.5 font-semibold"
                onClick={handleSignAndSubmit}
              >
                <FileCheck className="size-4" />
                Confirm &amp; Submit Signature
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
