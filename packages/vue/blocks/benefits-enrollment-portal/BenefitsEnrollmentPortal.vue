<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

interface Props {
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
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  employeeName: 'Elena Rostova',
  employeeId: 'EMP-48201',
  coverageTier: 'Employee + Spouse',
  department: 'Engineering · Senior Staff',
  deadlineDate: 'Sep 15',
  daysRemaining: 14,
  annualSalary: 120000,
  payPeriodsPerYear: 24,
  initialMedicalPlan: 'medical-ppo-hsa',
  initialDentalPlan: 'dental-comprehensive',
  initialVisionPlan: 'vision-choice-plus',
  initial401kRate: 6,
})

// Benefit plans configuration
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

// State
const selectedMedical = ref<string>(props.initialMedicalPlan)
const selectedDental = ref<string>(props.initialDentalPlan)
const selectedVision = ref<string>(props.initialVisionPlan)
const k401Rate = ref<number>(props.initial401kRate)
const isSubmitted = ref<boolean>(false)
const signatureAcknowledged = ref<boolean>(false)
const showSignModal = ref<boolean>(false)

// 401(k) slider marks
const SLIDER_MARKS = {
  1: '1%',
  4: '4%',
  6: '6% (Max Match)',
  10: '10%',
  15: '15%',
  20: '20%',
}

// Current Plan Objects
const currentMedical = computed(() => MEDICAL_PLANS.find((p) => p.id === selectedMedical.value) ?? MEDICAL_PLANS[0])
const currentDental = computed(() => DENTAL_PLANS.find((p) => p.id === selectedDental.value) ?? DENTAL_PLANS[0])
const currentVision = computed(() => VISION_PLANS.find((p) => p.id === selectedVision.value) ?? VISION_PLANS[0])

// Paycheck & Salary Calculations
const paycheckGross = computed(() => props.annualSalary / props.payPeriodsPerYear)

// 401(k) Employee Contribution
const k401EmployeePerPaycheck = computed(() => (paycheckGross.value * k401Rate.value) / 100)
const k401EmployeeAnnual = computed(() => k401EmployeePerPaycheck.value * props.payPeriodsPerYear)

// Employer 401(k) Match Logic:
// 100% match up to 4% + 50% match on next 2% -> Max 5.0% match unlocked at 6% employee contribution
// At $120,000 salary: 5.0% of $120,000 = $6,000 / year ($250 / paycheck)
const employerMatchRate = computed(() => {
  if (k401Rate.value <= 0) return 0
  if (k401Rate.value <= 4) return k401Rate.value
  if (k401Rate.value === 5) return 4.5
  return 5.0
})

const k401EmployerPerPaycheck = computed(() => (paycheckGross.value * employerMatchRate.value) / 100)
const k401EmployerAnnual = computed(() => k401EmployerPerPaycheck.value * props.payPeriodsPerYear)
const maxMatchUnlocked = computed(() => k401Rate.value >= 6)
const missedMatchAnnual = computed(() => {
  const maxPossible = (props.annualSalary * 5.0) / 100
  return Math.max(0, maxPossible - k401EmployerAnnual.value)
})

// Health & Welfare Employee Cost Per Paycheck
const healthCostPerPaycheck = computed(() => {
  return (
    currentMedical.value.employeeCostPerPaycheck +
    currentDental.value.employeeCostPerPaycheck +
    currentVision.value.employeeCostPerPaycheck
  )
})

// Total Employee Deductions Per Paycheck (Health + 401k)
const totalEmployeePerPaycheck = computed(() => healthCostPerPaycheck.value + k401EmployeePerPaycheck.value)

// Tax Savings Estimate (assuming ~25% effective marginal bracket for pre-tax deductions)
const estimatedTaxSavingsPerPaycheck = computed(() => Math.round(totalEmployeePerPaycheck.value * 0.25 * 100) / 100)
const netTakeHomeImpact = computed(() => totalEmployeePerPaycheck.value - estimatedTaxSavingsPerPaycheck.value)

// Total Employer Annual Benefit Value
// Employer Medical + Employer Dental + Employer Vision + HSA Seed + Employer 401k Match + Life/Disability Insurance ($2,386)
const employerMedicalAnnual = computed(() => currentMedical.value.employerCostPerMonth * 12)
const employerDentalAnnual = computed(() => currentDental.value.employerCostPerMonth * 12)
const employerVisionAnnual = computed(() => currentVision.value.employerCostPerMonth * 12)
const hsaSeedAnnual = computed(() => currentMedical.value.hsaSeed)
const employerLifeDisabilityAnnual = 2386

const totalEmployerAnnualValue = computed(() => {
  return (
    employerMedicalAnnual.value +
    employerDentalAnnual.value +
    employerVisionAnnual.value +
    hsaSeedAnnual.value +
    k401EmployerAnnual.value +
    employerLifeDisabilityAnnual
  )
})

function handleSignAndSubmit() {
  if (!signatureAcknowledged.value) return
  isSubmitted.value = true
  showSignModal.value = false
}

function handleResetEnrollment() {
  isSubmitted.value = false
  signatureAcknowledged.value = false
}
</script>

<template>
  <div
    data-slot="benefits-enrollment-portal"
    :class="cn('mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8', props.class)"
  >
    <!-- Header Banner -->
    <div class="border-border bg-card relative overflow-hidden rounded-xl border p-6 shadow-xs">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2.5">
            <Badge
              wrap
              variant="outline"
              class="max-w-full gap-1.5 border-amber-500/30 bg-amber-500/10 px-3 py-1 text-left text-xs font-semibold text-amber-700 dark:text-amber-400"
            >
              <Clock class="size-3.5" />
              Open Enrollment Period Ends {{ deadlineDate }} · {{ daysRemaining }} Days Left
            </Badge>
            <Badge
              v-if="isSubmitted"
              variant="secondary"
              class="border-success/30 bg-success/10 text-success gap-1 text-xs font-semibold"
            >
              <CheckCircle2 class="size-3.5" />
              Elections Submitted & Signed
            </Badge>
          </div>

          <div>
            <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              Annual Benefits Open Enrollment
            </h1>
            <p class="text-muted-foreground mt-1 text-sm sm:text-base">
              Select your health coverage, retirement matching, and ancillary wellness plans for the 2026-2027 plan
              year.
            </p>
          </div>

          <!-- Employee metadata strip -->
          <div
            class="border-border/60 bg-muted/40 text-muted-foreground mt-3 inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg border px-3.5 py-2 text-xs"
          >
            <div class="text-foreground flex items-center gap-1.5 font-medium">
              <User class="text-primary size-3.5" />
              <span>{{ employeeName }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Users class="size-3.5" />
              <span
                >Tier: <strong class="text-foreground font-medium">{{ coverageTier }}</strong></span
              >
            </div>
            <div>
              <span
                >ID: <strong class="text-foreground font-mono font-medium">{{ employeeId }}</strong></span
              >
            </div>
            <div>
              <span
                >Base:
                <strong class="text-foreground font-medium tabular-nums"
                  >${{ annualSalary.toLocaleString('en-US') }}/yr</strong
                ></span
              >
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2.5 sm:flex-row lg:flex-col lg:items-end">
          <Button v-if="!isSubmitted" size="lg" class="gap-2 font-semibold shadow-xs" @click="showSignModal = true">
            <FileSignature class="size-4" />
            Save Selections & Sign
          </Button>
          <Button
            v-else
            variant="outline"
            size="lg"
            class="border-success/40 bg-success/5 text-success hover:bg-success/10 gap-2 font-semibold"
            @click="handleResetEnrollment"
          >
            <RefreshCw class="size-4" />
            Modify My Elections
          </Button>

          <p class="text-muted-foreground text-xs lg:text-right">
            Changes take effect <span class="text-foreground font-medium">October 1, 2026</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Submitted Banner (If Confirmed) -->
    <div
      v-if="isSubmitted"
      class="border-success/30 bg-success/10 text-foreground flex flex-col items-start justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
    >
      <div class="flex flex-wrap items-start gap-3">
        <div
          class="border-success/30 bg-success/20 text-success mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border"
        >
          <Check class="size-4" />
        </div>
        <div>
          <p class="text-foreground text-sm font-semibold">Enrollment Signed & Confirmed for Plan Year 2026-2027</p>
          <p class="text-muted-foreground mt-0.5 text-xs">
            Confirmation Reference: <span class="text-foreground font-mono font-medium">#BEN-2026-89241</span> · Signed
            by {{ employeeName }} on August 21, 2026.
          </p>
        </div>
      </div>
      <Button aria-label="Download attachment" variant="outline" size="sm" class="gap-1.5 text-xs">
        <Download class="size-3.5" />
        Download Summary PDF
      </Button>
    </div>

    <!-- Main 2-Column Grid: Plan Options (Col 8) + Sticky Paycheck Impact (Col 4) -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      <!-- Plan Selection Flow -->
      <div class="space-y-8 lg:col-span-8">
        <!-- Category 1: Medical Health Plan -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
              <div class="flex items-center gap-2.5">
                <div
                  class="border-primary/20 bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg border"
                >
                  <HeartPulse class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-base sm:text-lg">1. Medical Health Plan</CardTitle>
                  <CardDescription
                    >Comprehensive inpatient, outpatient, prescription, and preventive medical
                    coverage.</CardDescription
                  >
                </div>
              </div>
              <Badge variant="secondary" class="text-xs"> 3 Plans Available </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <RadioGroup
              :model-value="selectedMedical"
              @update:model-value="(val) => (selectedMedical = String(val))"
              class="gap-3.5"
            >
              <div
                v-for="plan in MEDICAL_PLANS"
                :key="plan.id"
                role="button"
                tabindex="0"
                :aria-pressed="selectedMedical === plan.id"
                :class="
                  cn(
                    'focus-visible:ring-ring relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4.5 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                    selectedMedical === plan.id
                      ? 'border-primary bg-primary/[0.03] dark:bg-primary/10 ring-primary/30 shadow-xs ring-1'
                      : 'border-border hover:border-border/80 hover:bg-muted/30',
                  )
                "
                @click="selectedMedical = plan.id"
                @keydown.enter="selectedMedical = plan.id"
                @keydown.space.prevent="selectedMedical = plan.id"
              >
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="flex flex-wrap items-start gap-3">
                    <RadioGroupItem :id="plan.id" :value="plan.id" class="mt-0.5" />
                    <div class="space-y-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <label :for="plan.id" class="text-foreground cursor-pointer text-sm font-semibold sm:text-base">
                          {{ plan.name }}
                        </label>
                        <Badge v-if="plan.badge" :variant="plan.badgeVariant" class="text-xs font-medium">
                          {{ plan.badge }}
                        </Badge>
                      </div>
                      <p class="text-muted-foreground text-xs">{{ plan.carrier }} · {{ plan.description }}</p>
                    </div>
                  </div>

                  <div class="shrink-0 text-right">
                    <div class="flex items-baseline justify-end gap-1">
                      <span class="text-foreground text-lg font-bold tabular-nums sm:text-xl">
                        ${{ plan.employeeCostPerPaycheck }}
                      </span>
                      <span class="text-muted-foreground text-xs font-normal">/ paycheck</span>
                    </div>
                    <p class="text-muted-foreground text-xs">
                      Employer pays
                      <span class="text-foreground font-medium tabular-nums">${{ plan.employerCostPerMonth }}/mo</span>
                    </p>
                  </div>
                </div>

                <!-- Plan Benefit Matrix Details -->
                <div
                  class="border-border/60 bg-card/60 mt-1 grid grid-cols-2 gap-2.5 rounded-lg border p-3 text-xs sm:grid-cols-4"
                >
                  <div>
                    <span class="text-muted-foreground block">Annual Deductible</span>
                    <span class="text-foreground font-semibold tabular-nums">{{ plan.deductible }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground block">Out-of-Pocket Max</span>
                    <span class="text-foreground font-semibold tabular-nums">{{ plan.outOfPocketMax }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground block">Primary / Specialist</span>
                    <span class="text-foreground font-semibold">{{ plan.copayOrCoinsurance }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground block">HSA Company Seed</span>
                    <span
                      :class="
                        plan.hsaSeed > 0
                          ? 'text-success font-semibold tabular-nums'
                          : 'text-muted-foreground font-medium'
                      "
                    >
                      {{ plan.hsaSeed > 0 ? `$${plan.hsaSeed} / yr` : 'Not eligible' }}
                    </span>
                  </div>
                </div>

                <!-- Plan Bullet Highlights -->
                <ul class="text-muted-foreground mt-0.5 space-y-1 text-xs">
                  <li v-for="(highlight, i) in plan.highlights" :key="i" class="flex items-center gap-2">
                    <Check class="text-primary size-3.5 shrink-0" />
                    <span>{{ highlight }}</span>
                  </li>
                </ul>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <!-- Category 2: Dental Plan -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
              <div class="flex items-center gap-2.5">
                <div
                  class="border-primary/20 bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg border"
                >
                  <ShieldCheck class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-base sm:text-lg">2. Dental Plan</CardTitle>
                  <CardDescription
                    >Preventive exams, cleanings, restorative treatments, and orthodontic benefits.</CardDescription
                  >
                </div>
              </div>
              <Badge variant="secondary" class="text-xs"> 2 Plans + Waive </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <RadioGroup
              :model-value="selectedDental"
              @update:model-value="(val) => (selectedDental = String(val))"
              class="gap-3.5"
            >
              <div
                v-for="plan in DENTAL_PLANS"
                :key="plan.id"
                role="button"
                tabindex="0"
                :aria-pressed="selectedDental === plan.id"
                :class="
                  cn(
                    'focus-visible:ring-ring relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4.5 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                    selectedDental === plan.id
                      ? 'border-primary bg-primary/[0.03] dark:bg-primary/10 ring-primary/30 shadow-xs ring-1'
                      : 'border-border hover:border-border/80 hover:bg-muted/30',
                  )
                "
                @click="selectedDental = plan.id"
                @keydown.enter="selectedDental = plan.id"
                @keydown.space.prevent="selectedDental = plan.id"
              >
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="flex flex-wrap items-start gap-3">
                    <RadioGroupItem :id="plan.id" :value="plan.id" class="mt-0.5" />
                    <div class="space-y-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <label :for="plan.id" class="text-foreground cursor-pointer text-sm font-semibold sm:text-base">
                          {{ plan.name }}
                        </label>
                        <Badge v-if="plan.badge" :variant="plan.badgeVariant ?? 'outline'" class="text-xs font-medium">
                          {{ plan.badge }}
                        </Badge>
                      </div>
                      <p class="text-muted-foreground text-xs">{{ plan.carrier }} · {{ plan.description }}</p>
                    </div>
                  </div>

                  <div class="shrink-0 text-right">
                    <div class="flex items-baseline justify-end gap-1">
                      <span class="text-foreground text-lg font-bold tabular-nums sm:text-xl">
                        ${{ plan.employeeCostPerPaycheck }}
                      </span>
                      <span class="text-muted-foreground text-xs font-normal">/ paycheck</span>
                    </div>
                    <p v-if="plan.employerCostPerMonth > 0" class="text-muted-foreground text-xs">
                      Employer pays
                      <span class="text-foreground font-medium tabular-nums">${{ plan.employerCostPerMonth }}/mo</span>
                    </p>
                    <p v-else class="text-muted-foreground text-xs">No payroll deduction</p>
                  </div>
                </div>

                <div
                  v-if="plan.employeeCostPerPaycheck > 0"
                  class="border-border/60 bg-card/60 mt-1 grid grid-cols-2 gap-2.5 rounded-lg border p-3 text-xs sm:grid-cols-4"
                >
                  <div>
                    <span class="text-muted-foreground block">Annual Maximum</span>
                    <span class="text-foreground font-semibold tabular-nums">{{ plan.annualMax }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground block">Preventive Cleanings</span>
                    <span class="text-foreground font-semibold">{{ plan.preventive }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground block">Basic Services</span>
                    <span class="text-foreground font-semibold">{{ plan.basic }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground block">Major &amp; Orthodontics</span>
                    <span class="text-foreground font-semibold">{{ plan.majorOrOrtho }}</span>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <!-- Category 3: Vision Plan -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
              <div class="flex items-center gap-2.5">
                <div
                  class="border-primary/20 bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg border"
                >
                  <Eye class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-base sm:text-lg">3. Vision Plan</CardTitle>
                  <CardDescription
                    >Routine eye exams, designer frame allowances, contact lenses, and progressive lens
                    discounts.</CardDescription
                  >
                </div>
              </div>
              <Badge variant="secondary" class="text-xs"> 2 Plans + Waive </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <RadioGroup
              :model-value="selectedVision"
              @update:model-value="(val) => (selectedVision = String(val))"
              class="gap-3.5"
            >
              <div
                v-for="plan in VISION_PLANS"
                :key="plan.id"
                role="button"
                tabindex="0"
                :aria-pressed="selectedVision === plan.id"
                :class="
                  cn(
                    'focus-visible:ring-ring relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4.5 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                    selectedVision === plan.id
                      ? 'border-primary bg-primary/[0.03] dark:bg-primary/10 ring-primary/30 shadow-xs ring-1'
                      : 'border-border hover:border-border/80 hover:bg-muted/30',
                  )
                "
                @click="selectedVision = plan.id"
                @keydown.enter="selectedVision = plan.id"
                @keydown.space.prevent="selectedVision = plan.id"
              >
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="flex flex-wrap items-start gap-3">
                    <RadioGroupItem :id="plan.id" :value="plan.id" class="mt-0.5" />
                    <div class="space-y-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <label :for="plan.id" class="text-foreground cursor-pointer text-sm font-semibold sm:text-base">
                          {{ plan.name }}
                        </label>
                        <Badge v-if="plan.badge" :variant="plan.badgeVariant ?? 'outline'" class="text-xs font-medium">
                          {{ plan.badge }}
                        </Badge>
                      </div>
                      <p class="text-muted-foreground text-xs">{{ plan.carrier }} · {{ plan.description }}</p>
                    </div>
                  </div>

                  <div class="shrink-0 text-right">
                    <div class="flex items-baseline justify-end gap-1">
                      <span class="text-foreground text-lg font-bold tabular-nums sm:text-xl">
                        ${{ plan.employeeCostPerPaycheck }}
                      </span>
                      <span class="text-muted-foreground text-xs font-normal">/ paycheck</span>
                    </div>
                    <p v-if="plan.employerCostPerMonth > 0" class="text-muted-foreground text-xs">
                      Employer pays
                      <span class="text-foreground font-medium tabular-nums">${{ plan.employerCostPerMonth }}/mo</span>
                    </p>
                    <p v-else class="text-muted-foreground text-xs">No payroll deduction</p>
                  </div>
                </div>

                <div
                  v-if="plan.employeeCostPerPaycheck > 0"
                  class="border-border/60 bg-card/60 mt-1 grid grid-cols-1 gap-2.5 rounded-lg border p-3 text-xs sm:grid-cols-3"
                >
                  <div>
                    <span class="text-muted-foreground block">Annual Exam Copay</span>
                    <span class="text-foreground font-semibold">{{ plan.examCopay }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground block">Frame Allowance</span>
                    <span class="text-foreground font-semibold tabular-nums">{{ plan.frameAllowance }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground block">Prescription Lenses</span>
                    <span class="text-foreground font-semibold">{{ plan.lenses }}</span>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <!-- Category 4: 401(k) Retirement & Employer Match -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div
                  class="border-primary/20 bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg border"
                >
                  <PiggyBank class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-base sm:text-lg">4. 401(k) Retirement &amp; Employer Match</CardTitle>
                  <CardDescription
                    >Pre-tax salary deferrals with tiered 100% + 50% company matching formula.</CardDescription
                  >
                </div>
              </div>
              <Badge :variant="maxMatchUnlocked ? 'default' : 'outline'" class="text-xs">
                {{ maxMatchUnlocked ? 'Max Match Active' : 'Match Available' }}
              </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-6">
            <!-- Employer Match Callout Box -->
            <div
              class="border-primary/30 bg-primary/5 dark:bg-primary/10 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex flex-wrap items-start gap-3">
                <Sparkles class="text-primary mt-0.5 size-5 shrink-0" />
                <div class="space-y-1">
                  <span class="text-foreground text-sm font-semibold">Company Match Formula</span>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    100% match up to 4% + 50% match on next 2% ·
                    <strong class="text-foreground font-medium">Maximum $6,000 employer match unlocked!</strong>
                  </p>
                </div>
              </div>

              <div class="shrink-0">
                <Badge
                  :variant="maxMatchUnlocked ? 'secondary' : 'outline'"
                  :class="
                    maxMatchUnlocked
                      ? 'border-success/30 bg-success/10 text-success'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  "
                  class="gap-1.5 px-3 py-1 text-xs font-semibold"
                >
                  <CheckCircle2 v-if="maxMatchUnlocked" class="size-3.5" />
                  <AlertCircle v-else class="size-3.5" />
                  {{
                    maxMatchUnlocked
                      ? '100% Max Match Achieved ($6,000/yr)'
                      : `Leaving $${missedMatchAnnual.toLocaleString('en-US')}/yr on table`
                  }}
                </Badge>
              </div>
            </div>

            <!-- Interactive Slider Section -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <span class="text-foreground text-sm font-semibold">Your Pre-Tax Contribution Rate</span>
                  <p class="text-muted-foreground text-xs">
                    Calculated from gross salary (${{
                      paycheckGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    }}
                    / semi-monthly paycheck)
                  </p>
                </div>

                <div class="text-right">
                  <div class="flex items-baseline justify-end gap-1">
                    <span class="text-primary text-2xl font-bold tabular-nums sm:text-3xl"> {{ k401Rate }}% </span>
                    <span class="text-muted-foreground text-xs">Contribution</span>
                  </div>
                  <span class="text-foreground text-xs font-medium tabular-nums">
                    ${{ k401EmployeePerPaycheck.toFixed(2) }} / paycheck (${{
                      k401EmployeeAnnual.toLocaleString('en-US')
                    }}/yr)
                  </span>
                </div>
              </div>

              <div class="py-5">
                <Slider
                  :model-value="k401Rate"
                  :min="1"
                  :max="20"
                  :step="1"
                  :marks="SLIDER_MARKS"
                  :tooltip="
                    (val) =>
                      `${val}% (${((props.annualSalary * val) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}/yr)`
                  "
                  @update:model-value="(val) => (k401Rate = typeof val === 'number' ? val : val[0])"
                />
              </div>
            </div>

            <!-- 401(k) Financial Impact Breakdown -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div class="border-border bg-card/60 rounded-lg border p-3 text-center sm:text-left">
                <span class="text-muted-foreground block text-xs">Your Paycheck Deferral</span>
                <span class="text-foreground text-lg font-bold tabular-nums">
                  ${{ k401EmployeePerPaycheck.toFixed(2) }}
                </span>
                <span class="text-muted-foreground block text-xs tabular-nums">
                  ${{ k401EmployeeAnnual.toLocaleString('en-US') }} / year
                </span>
              </div>

              <div class="border-success/30 bg-success/5 rounded-lg border p-3 text-center sm:text-left">
                <span class="text-success block text-xs font-medium">Employer Match Added</span>
                <span class="text-success text-lg font-bold tabular-nums">
                  +${{ k401EmployerPerPaycheck.toFixed(2) }}
                </span>
                <span class="text-muted-foreground block text-xs tabular-nums">
                  ${{ k401EmployerAnnual.toLocaleString('en-US') }} / year (Free Match)
                </span>
              </div>

              <div class="border-border bg-card/60 rounded-lg border p-3 text-center sm:text-left">
                <span class="text-muted-foreground block text-xs">Total 401(k) Annual Savings</span>
                <span class="text-foreground text-lg font-bold tabular-nums">
                  ${{ (k401EmployeeAnnual + k401EmployerAnnual).toLocaleString('en-US') }}
                </span>
                <span class="text-muted-foreground block text-xs"> 2026 IRS Cap: $23,500 </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sticky Paycheck Impact Summary Box (Col 4) -->
      <div class="lg:sticky lg:top-8 lg:col-span-4">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Paycheck Impact Summary
              </span>
              <Badge variant="outline" class="text-xs"> Semi-Monthly </Badge>
            </div>

            <!-- Primary Highlight Metric 1: Total Employee Cost per Paycheck -->
            <div class="mt-4 space-y-1">
              <span class="text-muted-foreground text-xs font-medium">Total Employee Benefit Cost</span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-foreground text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                  ${{ healthCostPerPaycheck.toFixed(2) }}
                </span>
                <span class="text-muted-foreground text-sm font-normal"> / pay period</span>
              </div>
              <p class="text-muted-foreground text-xs">Pre-tax health, dental, and vision deductions</p>
            </div>

            <!-- Primary Highlight Metric 2: Total Annual Employer Benefit Value -->
            <div class="border-primary/20 bg-primary/5 dark:bg-primary/10 mt-4 rounded-xl border p-3.5">
              <span class="text-muted-foreground block text-xs font-medium">Total Annual Employer Value</span>
              <div class="flex items-baseline gap-1">
                <span class="text-primary text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                  ${{
                    totalEmployerAnnualValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                </span>
                <span class="text-muted-foreground text-xs font-normal"> / year</span>
              </div>
              <p class="text-muted-foreground mt-1 text-xs">
                Includes company medical, dental, vision subsidies, HSA seed, match &amp; insurance.
              </p>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-0">
            <Separator />

            <!-- Itemized Paycheck Deductions -->
            <div class="space-y-2 text-xs">
              <span class="text-muted-foreground block font-semibold tracking-wider uppercase">
                Employee Payroll Deductions
              </span>

              <div class="flex items-center justify-between">
                <span class="text-foreground"
                  >Medical ({{ currentMedical.name.split(' ')[0] }} {{ currentMedical.name.split(' ')[1] }})</span
                >
                <span class="text-foreground font-medium tabular-nums"
                  >${{ currentMedical.employeeCostPerPaycheck.toFixed(2) }}</span
                >
              </div>

              <div class="flex items-center justify-between">
                <span class="text-foreground"
                  >Dental ({{ currentDental.name.split(' ')[0] }} {{ currentDental.name.split(' ')[1] }})</span
                >
                <span class="text-foreground font-medium tabular-nums"
                  >${{ currentDental.employeeCostPerPaycheck.toFixed(2) }}</span
                >
              </div>

              <div class="flex items-center justify-between">
                <span class="text-foreground"
                  >Vision ({{ currentVision.name.split(' ')[0] }} {{ currentVision.name.split(' ')[1] }})</span
                >
                <span class="text-foreground font-medium tabular-nums"
                  >${{ currentVision.employeeCostPerPaycheck.toFixed(2) }}</span
                >
              </div>

              <div class="border-border/60 flex items-center justify-between border-t pt-1.5 font-semibold">
                <span class="text-foreground">Pre-Tax Health Total</span>
                <span class="text-foreground tabular-nums">${{ healthCostPerPaycheck.toFixed(2) }}</span>
              </div>

              <div class="text-muted-foreground flex items-center justify-between">
                <span>401(k) Contribution ({{ k401Rate }}%)</span>
                <span class="text-foreground font-medium tabular-nums">${{ k401EmployeePerPaycheck.toFixed(2) }}</span>
              </div>

              <div class="bg-muted/50 flex items-center justify-between rounded-md p-2 font-semibold">
                <span class="text-foreground">Total Pre-Tax per Paycheck</span>
                <span class="text-foreground tabular-nums">${{ totalEmployeePerPaycheck.toFixed(2) }}</span>
              </div>

              <div class="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-1">
                <span>Est. Pre-Tax Tax Savings (~25%)</span>
                <span class="text-success font-medium tabular-nums"
                  >-${{ estimatedTaxSavingsPerPaycheck.toFixed(2) }}</span
                >
              </div>

              <div class="text-muted-foreground flex items-center justify-between">
                <span>Est. Net Take-Home Impact</span>
                <span class="text-foreground font-medium tabular-nums">-${{ netTakeHomeImpact.toFixed(2) }}</span>
              </div>
            </div>

            <Separator />

            <!-- Itemized Employer Annual Contributions -->
            <div class="space-y-1.5 text-xs">
              <span class="text-muted-foreground block font-semibold tracking-wider uppercase">
                Employer Benefits Breakdown
              </span>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Medical Subsidy</span>
                <span class="text-foreground font-medium tabular-nums"
                  >${{ (currentMedical.employerCostPerMonth * 12).toLocaleString('en-US') }}/yr</span
                >
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Dental Subsidy</span>
                <span class="text-foreground font-medium tabular-nums"
                  >${{ (currentDental.employerCostPerMonth * 12).toLocaleString('en-US') }}/yr</span
                >
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Vision Subsidy</span>
                <span class="text-foreground font-medium tabular-nums"
                  >${{ (currentVision.employerCostPerMonth * 12).toLocaleString('en-US') }}/yr</span
                >
              </div>

              <div v-if="currentMedical.hsaSeed > 0" class="flex items-center justify-between">
                <span class="text-muted-foreground">HSA Annual Contribution</span>
                <span class="text-foreground font-medium tabular-nums"
                  >${{ currentMedical.hsaSeed.toLocaleString('en-US') }}/yr</span
                >
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">401(k) Employer Match</span>
                <span class="text-foreground font-medium tabular-nums"
                  >${{ k401EmployerAnnual.toLocaleString('en-US') }}/yr</span
                >
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Life, AD&amp;D &amp; Disability</span>
                <span class="text-foreground font-medium tabular-nums"
                  >${{ employerLifeDisabilityAnnual.toLocaleString('en-US') }}/yr</span
                >
              </div>
            </div>
          </CardContent>

          <CardFooter class="flex flex-col gap-2.5 pt-0">
            <Button
              v-if="!isSubmitted"
              size="lg"
              class="w-full gap-2 font-semibold shadow-xs"
              @click="showSignModal = true"
            >
              <FileSignature class="size-4" />
              Save Selections & Sign
            </Button>
            <Button
              v-else
              variant="outline"
              size="default"
              class="border-success/30 bg-success/10 text-success w-full gap-2 font-semibold"
              @click="handleResetEnrollment"
            >
              <Check class="size-4" />
              Elections Signed (Edit)
            </Button>

            <p class="text-muted-foreground text-center text-xs">
              Annual elections lock on {{ deadlineDate }}, 11:59 PM EST
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>

    <!-- Electronic Signature Confirmation Modal Dialog -->
    <div
      v-if="showSignModal"
      class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
    >
      <div
        class="border-border bg-card animate-in fade-in zoom-in-95 relative w-full max-w-lg rounded-xl border p-6 shadow-xl duration-150"
      >
        <div class="space-y-2">
          <div class="text-primary flex items-center gap-2">
            <FileSignature class="size-5" />
            <h3 class="text-foreground text-lg font-bold">Review &amp; Sign Elective Enrollment</h3>
          </div>
          <p class="text-muted-foreground text-xs">
            Please verify your selections below before electronically signing for the 2026-2027 plan year.
          </p>
        </div>

        <div class="border-border bg-muted/40 my-4 space-y-2 rounded-lg border p-3.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Employee:</span>
            <span class="text-foreground font-medium">{{ employeeName }} ({{ coverageTier }})</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Medical Plan:</span>
            <span class="text-foreground font-medium">{{ currentMedical.name }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Dental Plan:</span>
            <span class="text-foreground font-medium">{{ currentDental.name }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Vision Plan:</span>
            <span class="text-foreground font-medium">{{ currentVision.name }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">401(k) Contribution:</span>
            <span class="text-foreground font-medium tabular-nums"
              >{{ k401Rate }}% (${{ k401EmployeePerPaycheck.toFixed(2) }} / paycheck)</span
            >
          </div>
          <div class="border-border/60 flex items-center justify-between border-t pt-2 font-bold">
            <span class="text-foreground">Total Deduction per Paycheck:</span>
            <span class="text-foreground tabular-nums">${{ totalEmployeePerPaycheck.toFixed(2) }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <label class="flex cursor-pointer items-start gap-2.5 select-none">
            <input
              type="checkbox"
              v-model="signatureAcknowledged"
              class="border-input text-primary focus-visible:ring-ring mt-0.5 size-4 rounded border focus-visible:ring-2"
            />
            <span class="text-muted-foreground text-xs leading-relaxed">
              I acknowledge that I have selected the benefit plans above and authorize pre-tax semi-monthly payroll
              deductions commencing October 1, 2026.
            </span>
          </label>
        </div>

        <div class="mt-6 flex items-center justify-end gap-2.5">
          <Button variant="outline" size="sm" @click="showSignModal = false"> Cancel </Button>
          <Button
            size="sm"
            :disabled="!signatureAcknowledged"
            class="gap-1.5 font-semibold"
            @click="handleSignAndSubmit"
          >
            <FileCheck class="size-4" />
            Confirm &amp; Submit Signature
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
