<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  ArrowRight,
  Building2,
  Calculator,
  Calendar,
  Car,
  CheckCircle2,
  DollarSign,
  FileSpreadsheet,
  Home,
  Sparkles,
  Wallet,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

type LoanType = 'mortgage-30' | 'commercial-10' | 'auto-5' | 'personal-3'

interface LoanPreset {
  id: LoanType
  name: string
  amount: number
  rate: number
  termYears: number
  extraPayment: number
  description: string
}

const LOAN_PRESETS: Record<LoanType, LoanPreset> = {
  'mortgage-30': {
    id: 'mortgage-30',
    name: 'Mortgage 30Y',
    amount: 450_000,
    rate: 6.5,
    termYears: 30,
    extraPayment: 200,
    description: '30-year fixed home mortgage',
  },
  'commercial-10': {
    id: 'commercial-10',
    name: 'Commercial 10Y',
    amount: 1_200_000,
    rate: 7.25,
    termYears: 10,
    extraPayment: 500,
    description: '10-year commercial real estate loan',
  },
  'auto-5': {
    id: 'auto-5',
    name: 'Auto Loan 5Y',
    amount: 45_000,
    rate: 5.9,
    termYears: 5,
    extraPayment: 50,
    description: '60-month standard vehicle loan',
  },
  'personal-3': {
    id: 'personal-3',
    name: 'Personal Loan',
    amount: 25_000,
    rate: 9.5,
    termYears: 3,
    extraPayment: 25,
    description: '36-month fixed unsecured personal loan',
  },
}

const LOAN_AMOUNT_MARKS = {
  100000: '$100K',
  500000: '$500K',
  1000000: '$1M',
  2000000: '$2M',
}

const INTEREST_RATE_MARKS = {
  1: '1%',
  5: '5%',
  10: '10%',
  15: '15%',
}

const LOAN_TERM_MARKS = {
  5: '5Y',
  10: '10Y',
  15: '15Y',
  20: '20Y',
  30: '30Y',
}

const EXTRA_PAYMENT_MARKS = {
  0: '$0',
  500: '$500',
  1000: '$1K',
  2000: '$2K',
}

const TERM_PRESETS = [5, 10, 15, 20, 30]

const selectedLoanType = ref<LoanType>('mortgage-30')
const loanAmount = ref(450_000)
const interestRate = ref(6.5)
const loanTermYears = ref(30)
const extraMonthlyPayment = ref(200)
const showAllYears = ref(false)

function handleTabChange(value: string | number) {
  const type = String(value) as LoanType
  selectedLoanType.value = type
  const preset = LOAN_PRESETS[type]
  if (preset) {
    loanAmount.value = preset.amount
    interestRate.value = preset.rate
    loanTermYears.value = preset.termYears
    extraMonthlyPayment.value = preset.extraPayment
  }
}

// Base monthly payment (standard amortization without extra payments)
const baseMonthlyPayment = computed(() => {
  const principal = loanAmount.value
  const annualRate = interestRate.value
  const termYears = loanTermYears.value
  const totalMonths = termYears * 12

  if (principal <= 0 || totalMonths <= 0) return 0
  if (annualRate <= 0) return principal / totalMonths

  const monthlyRate = annualRate / 100 / 12
  const factor = Math.pow(1 + monthlyRate, totalMonths)
  if (!isFinite(factor) || factor <= 1) return principal / totalMonths
  return (principal * (monthlyRate * factor)) / (factor - 1)
})

// Total standard cost and interest without extra payment
const totalCostBase = computed(() => {
  return baseMonthlyPayment.value * loanTermYears.value * 12
})

const totalInterestBase = computed(() => {
  return Math.max(0, totalCostBase.value - loanAmount.value)
})

interface MonthRecord {
  month: number
  principalPaid: number
  interestPaid: number
  extraPaid: number
  totalPaid: number
  remainingBalance: number
}

interface YearRecord {
  year: number
  principalPaid: number
  interestPaid: number
  extraPaid: number
  totalPaid: number
  remainingBalance: number
}

const amortizationResult = computed(() => {
  const principal = Math.max(0, loanAmount.value)
  const annualRate = Math.max(0, interestRate.value)
  const termYears = Math.max(1, loanTermYears.value)
  const extra = Math.max(0, extraMonthlyPayment.value)
  const basePayment = baseMonthlyPayment.value
  const monthlyRate = annualRate / 100 / 12
  const standardMonths = termYears * 12

  let balance = principal
  const monthlySchedule: MonthRecord[] = []
  let totalInterest = 0
  let totalPaid = 0
  let totalExtra = 0
  let month = 0
  const maxMonths = 1200 // 100 years safeguard

  while (balance > 0.005 && month < maxMonths) {
    month++
    const interestForMonth = annualRate > 0 ? balance * monthlyRate : 0
    let scheduledTotal = basePayment + extra

    if (balance + interestForMonth < scheduledTotal) {
      scheduledTotal = balance + interestForMonth
    }

    const principalForMonth = Math.min(balance, Math.max(0, scheduledTotal - interestForMonth))
    const extraForMonth = Math.max(0, scheduledTotal - basePayment)
    balance = Math.max(0, balance - principalForMonth)

    totalInterest += interestForMonth
    totalPaid += scheduledTotal
    totalExtra += extraForMonth

    monthlySchedule.push({
      month,
      principalPaid: principalForMonth,
      interestPaid: interestForMonth,
      extraPaid: extraForMonth,
      totalPaid: scheduledTotal,
      remainingBalance: balance,
    })
  }

  // Aggregate by year
  const yearlySchedule: YearRecord[] = []
  const totalYearsActual = Math.ceil(monthlySchedule.length / 12)

  for (let y = 1; y <= totalYearsActual; y++) {
    const startIdx = (y - 1) * 12
    const endIdx = Math.min(y * 12, monthlySchedule.length)
    const yearMonths = monthlySchedule.slice(startIdx, endIdx)

    if (yearMonths.length === 0) continue

    const yearPrincipal = yearMonths.reduce((sum, m) => sum + m.principalPaid, 0)
    const yearInterest = yearMonths.reduce((sum, m) => sum + m.interestPaid, 0)
    const yearExtra = yearMonths.reduce((sum, m) => sum + m.extraPaid, 0)
    const yearTotal = yearMonths.reduce((sum, m) => sum + m.totalPaid, 0)
    const endingBalance = yearMonths[yearMonths.length - 1]?.remainingBalance ?? 0

    yearlySchedule.push({
      year: y,
      principalPaid: yearPrincipal,
      interestPaid: yearInterest,
      extraPaid: yearExtra,
      totalPaid: yearTotal,
      remainingBalance: endingBalance,
    })
  }

  const monthsSaved = Math.max(0, standardMonths - monthlySchedule.length)
  const yearsSaved = monthsSaved / 12
  const interestSaved = Math.max(0, totalInterestBase.value - totalInterest)

  return {
    monthlySchedule,
    yearlySchedule,
    actualMonths: monthlySchedule.length,
    actualYears: (monthlySchedule.length / 12).toFixed(1),
    monthsSaved,
    yearsSaved: yearsSaved.toFixed(1),
    totalInterestPaid: totalInterest,
    totalLoanCost: totalPaid,
    totalExtraPaid: totalExtra,
    interestSavings: interestSaved,
  }
})

// Visual breakdown percentages
const principalPercent = computed(() => {
  const total = amortizationResult.value.totalLoanCost
  if (total <= 0) return 100
  return Math.min(100, Math.max(0, Math.round((loanAmount.value / total) * 100)))
})

const interestPercent = computed(() => {
  return Math.max(0, 100 - principalPercent.value)
})

// Filtered schedule for display
const displayedSchedule = computed(() => {
  if (showAllYears.value) {
    return amortizationResult.value.yearlySchedule
  }
  return amortizationResult.value.yearlySchedule.slice(0, 5)
})

// Totals for the displayed schedule
const displayedTotals = computed(() => {
  const list = displayedSchedule.value
  return {
    principal: list.reduce((sum, r) => sum + r.principalPaid, 0),
    interest: list.reduce((sum, r) => sum + r.interestPaid, 0),
    extra: list.reduce((sum, r) => sum + r.extraPaid, 0),
    total: list.reduce((sum, r) => sum + r.totalPaid, 0),
  }
})

// Formatters
const fmtCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0)
}

const fmtCurrencyWhole = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val || 0)
}
</script>

<template>
  <div data-slot="loan-calculator" :class="cn('mx-auto w-full max-w-6xl space-y-10 p-4 sm:p-6 lg:p-8', props.class)">
    <!-- Header -->
    <div class="flex flex-col items-center gap-4 text-center">
      <Badge variant="outline" class="gap-1.5 px-3 py-1 text-xs font-medium tracking-wider uppercase">
        <Calculator class="text-primary size-3.5" />
        Loan Amortization Engine
      </Badge>
      <div class="space-y-2">
        <h2 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Loan &amp; Mortgage Amortization Calculator
        </h2>
        <p class="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-base">
          Estimate monthly payments, interest vs principal breakdown, and payoff timelines with extra payments.
        </p>
      </div>

      <!-- Loan Type Tabs -->
      <div class="mt-2 flex w-full justify-center">
        <Tabs :model-value="selectedLoanType" @update:model-value="handleTabChange" class="w-full sm:w-auto">
          <TabsList variant="segmented" class="grid w-full grid-cols-2 sm:flex sm:w-auto">
            <TabsTrigger value="mortgage-30" class="gap-1.5">
              <Home class="size-3.5" />
              Mortgage 30Y
            </TabsTrigger>
            <TabsTrigger value="commercial-10" class="gap-1.5">
              <Building2 class="size-3.5" />
              Commercial 10Y
            </TabsTrigger>
            <TabsTrigger value="auto-5" class="gap-1.5">
              <Car class="size-3.5" />
              Auto Loan 5Y
            </TabsTrigger>
            <TabsTrigger value="personal-3" class="gap-1.5">
              <Wallet class="size-3.5" />
              Personal Loan
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>

    <!-- 2-Column Calculator Layout -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      <!-- Left Inputs Card -->
      <div class="space-y-6 lg:col-span-7">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <DollarSign class="text-primary size-5" />
              Loan Parameters
            </CardTitle>
            <CardDescription>
              Customize loan principal, interest rate, term duration, and extra monthly contributions.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-8">
            <!-- 1. Loan Amount -->
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <span class="text-foreground text-sm font-medium">Loan Amount (Principal)</span>
                  <p class="text-muted-foreground text-xs">Total borrowed loan amount.</p>
                </div>
                <div class="w-36 sm:w-44">
                  <Input
                    id="loan-amount-input"
                    type="number"
                    size="small"
                    :min="5000"
                    :max="2500000"
                    :step="5000"
                    prefix="$"
                    :model-value="loanAmount"
                    @update:model-value="(val) => (loanAmount = Number(val) || 0)"
                  />
                </div>
              </div>
              <div class="pb-6">
                <Slider
                  :model-value="loanAmount"
                  :min="10000"
                  :max="2000000"
                  :step="5000"
                  :marks="LOAN_AMOUNT_MARKS"
                  :tooltip="(val) => `$${val.toLocaleString('en-US')}`"
                  @update:model-value="(val) => (loanAmount = typeof val === 'number' ? val : val[0])"
                />
              </div>
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-muted-foreground text-xs">Quick select:</span>
                <Button
                  v-for="amt in [150000, 300000, 450000, 750000, 1200000]"
                  :key="amt"
                  variant="outline"
                  size="sm"
                  class="h-6 px-2 text-xs"
                  @click="loanAmount = amt"
                >
                  ${{ amt >= 1000000 ? `${(amt / 1000000).toFixed(1)}M` : `${amt / 1000}K` }}
                </Button>
              </div>
            </div>

            <Separator />

            <!-- 2. Interest Rate -->
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <span class="text-foreground text-sm font-medium">Annual Interest Rate (APR)</span>
                  <p class="text-muted-foreground text-xs">Fixed annual percentage rate.</p>
                </div>
                <div class="w-32 sm:w-36">
                  <Input
                    id="interest-rate-input"
                    type="number"
                    size="small"
                    :min="0.5"
                    :max="25"
                    :step="0.1"
                    suffix="%"
                    :model-value="interestRate"
                    @update:model-value="(val) => (interestRate = Number(val) || 0)"
                  />
                </div>
              </div>
              <div class="pb-6">
                <Slider
                  :model-value="interestRate"
                  :min="1"
                  :max="15"
                  :step="0.1"
                  :marks="INTEREST_RATE_MARKS"
                  :tooltip="(val) => `${val.toFixed(1)}%`"
                  @update:model-value="(val) => (interestRate = typeof val === 'number' ? val : val[0])"
                />
              </div>
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-muted-foreground text-xs">Market benchmarks:</span>
                <Button
                  v-for="rate in [4.5, 5.5, 6.5, 7.5, 9.5]"
                  :key="rate"
                  variant="outline"
                  size="sm"
                  class="h-6 px-2 text-xs"
                  @click="interestRate = rate"
                >
                  {{ rate }}%
                </Button>
              </div>
            </div>

            <Separator />

            <!-- 3. Loan Term -->
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <span class="text-foreground text-sm font-medium">Loan Term</span>
                  <p class="text-muted-foreground text-xs">Amortization period in years.</p>
                </div>
                <div class="flex items-center gap-1.5">
                  <Badge variant="secondary" class="font-mono text-xs font-semibold">
                    {{ loanTermYears }} Years ({{ loanTermYears * 12 }} mo)
                  </Badge>
                </div>
              </div>
              <div class="pb-6">
                <Slider
                  :model-value="loanTermYears"
                  :min="1"
                  :max="30"
                  :step="1"
                  :marks="LOAN_TERM_MARKS"
                  :tooltip="(val) => `${val} Years`"
                  @update:model-value="(val) => (loanTermYears = typeof val === 'number' ? val : val[0])"
                />
              </div>
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-muted-foreground text-xs">Standard terms:</span>
                <Button
                  v-for="term in TERM_PRESETS"
                  :key="term"
                  :variant="loanTermYears === term ? 'default' : 'outline'"
                  size="sm"
                  class="h-6 px-2 text-xs"
                  @click="loanTermYears = term"
                >
                  {{ term }} Yrs
                </Button>
              </div>
            </div>

            <Separator />

            <!-- 4. Extra Monthly Payment -->
            <div class="space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-foreground text-sm font-medium">Extra Monthly Payment</span>
                    <Badge
                      variant="outline"
                      class="border-emerald-500/20 bg-emerald-500/10 text-xs font-normal text-emerald-600 dark:text-emerald-400"
                    >
                      Accelerates Payoff
                    </Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">Directly reduces principal balance each month.</p>
                </div>
                <div class="w-36 sm:w-44">
                  <Input
                    id="extra-payment-input"
                    type="number"
                    size="small"
                    :min="0"
                    :max="10000"
                    :step="25"
                    prefix="$"
                    suffix="/ mo"
                    :model-value="extraMonthlyPayment"
                    @update:model-value="(val) => (extraMonthlyPayment = Number(val) || 0)"
                  />
                </div>
              </div>
              <div class="pb-6">
                <Slider
                  :model-value="extraMonthlyPayment"
                  :min="0"
                  :max="2000"
                  :step="25"
                  :marks="EXTRA_PAYMENT_MARKS"
                  :tooltip="(val) => `$${val}/mo`"
                  @update:model-value="(val) => (extraMonthlyPayment = typeof val === 'number' ? val : val[0])"
                />
              </div>
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-muted-foreground text-xs">Quick extra:</span>
                <Button
                  v-for="extra in [0, 100, 200, 500, 1000]"
                  :key="extra"
                  variant="outline"
                  size="sm"
                  class="h-6 px-2 text-xs"
                  @click="extraMonthlyPayment = extra"
                >
                  +${{ extra }}/mo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Results Card (Sticky on desktop) -->
      <div class="lg:sticky lg:top-8 lg:col-span-5">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Estimated Monthly Payment
              </span>
              <Badge variant="secondary" class="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                Amortized
              </Badge>
            </div>
            <div class="mt-4">
              <div class="flex items-baseline gap-1.5">
                <span class="text-foreground text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                  {{ fmtCurrency(baseMonthlyPayment) }}
                </span>
                <span class="text-muted-foreground text-sm font-normal"> / month</span>
              </div>
              <p v-if="extraMonthlyPayment > 0" class="text-muted-foreground mt-2 text-xs">
                Total monthly cash outlay:
                <span class="text-foreground font-semibold tabular-nums">
                  {{ fmtCurrency(baseMonthlyPayment + extraMonthlyPayment) }}/mo
                </span>
                ({{ fmtCurrency(baseMonthlyPayment) }} base + {{ fmtCurrency(extraMonthlyPayment) }} extra)
              </p>
              <p v-else class="text-muted-foreground mt-2 text-xs">
                Standard fixed payment based on {{ interestRate }}% APR over {{ loanTermYears }} years.
              </p>
            </div>
          </CardHeader>

          <CardContent class="space-y-5">
            <Separator />

            <!-- Extra Payment Impact Box -->
            <div
              v-if="extraMonthlyPayment > 0 && amortizationResult.interestSavings > 0"
              class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400"
            >
              <div class="flex items-start gap-2.5">
                <Sparkles class="mt-0.5 size-4 shrink-0" />
                <div class="space-y-1">
                  <p class="text-sm leading-snug font-semibold">
                    Saves {{ fmtCurrencyWhole(amortizationResult.interestSavings) }} and cuts
                    {{ amortizationResult.yearsSaved }} years off payoff!
                  </p>
                  <p class="leading-normal text-emerald-700/80 dark:text-emerald-300/80">
                    You'll be debt-free in {{ amortizationResult.actualYears }} years ({{
                      amortizationResult.actualMonths
                    }}
                    payments) instead of {{ loanTermYears }} years.
                  </p>
                </div>
              </div>
            </div>

            <!-- Summary Breakdown -->
            <div class="space-y-2.5">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Total Loan Principal</span>
                <span class="font-medium tabular-nums">{{ fmtCurrency(loanAmount) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Total Interest Paid</span>
                <span class="font-medium text-amber-600 tabular-nums dark:text-amber-400">
                  {{ fmtCurrency(amortizationResult.totalInterestPaid) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Total Loan Cost</span>
                <span class="text-foreground font-semibold tabular-nums">
                  {{ fmtCurrency(amortizationResult.totalLoanCost) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Effective Payoff Timeline</span>
                <span class="font-medium tabular-nums">
                  {{ amortizationResult.actualYears }} Years ({{ amortizationResult.actualMonths }} mo)
                </span>
              </div>
            </div>

            <Separator />

            <!-- Visual Principal vs Interest Bar -->
            <div class="space-y-2.5">
              <div class="flex items-center justify-between text-xs font-medium">
                <span class="text-foreground">Principal vs. Total Interest</span>
                <span class="text-muted-foreground tabular-nums">{{ principalPercent }}% / {{ interestPercent }}%</span>
              </div>
              <div class="bg-muted relative flex h-3 w-full overflow-hidden rounded-full shadow-inner">
                <div class="bg-primary h-full transition-all duration-300" :style="{ width: `${principalPercent}%` }" />
                <div
                  class="h-full bg-amber-500 transition-all duration-300"
                  :style="{ width: `${interestPercent}%` }"
                />
              </div>
              <div
                class="text-muted-foreground flex flex-col gap-1.5 text-xs sm:flex-row sm:items-center sm:justify-between"
              >
                <div class="flex items-center gap-1.5">
                  <span class="bg-primary size-2 shrink-0 rounded-full" />
                  <span>Principal: {{ fmtCurrencyWhole(loanAmount) }} ({{ principalPercent }}%)</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="size-2 shrink-0 rounded-full bg-amber-500" />
                  <span
                    >Interest: {{ fmtCurrencyWhole(amortizationResult.totalInterestPaid) }} ({{
                      interestPercent
                    }}%)</span
                  >
                </div>
              </div>
            </div>

            <Separator />

            <!-- Key Features / Trust Checklist -->
            <ul class="text-muted-foreground space-y-2 text-xs">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="text-primary size-3.5 shrink-0" />
                <span>Real-time compound interest calculations</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="text-primary size-3.5 shrink-0" />
                <span>Principal reduction extra payment model</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="text-primary size-3.5 shrink-0" />
                <span>Standard fixed-rate banking amortization schedule</span>
              </li>
            </ul>
          </CardContent>

          <CardFooter class="flex flex-col gap-2.5 pt-2">
            <Button class="w-full gap-2 font-semibold shadow-xs" size="lg">
              Apply for Pre-Approval
              <ArrowRight class="size-4" />
            </Button>
            <Button aria-label="Download attachment" variant="outline" class="w-full gap-2" size="default">
              <FileSpreadsheet class="size-4" />
              Download Schedule (CSV)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>

    <!-- Amortization Schedule Table -->
    <Card class="mt-8">
      <CardHeader class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle class="flex items-center gap-2">
            <Calendar class="text-primary size-5" />
            Amortization Schedule
          </CardTitle>
          <CardDescription>
            Annual breakdown of principal reduction, interest paid, extra contributions, and ending balance.
          </CardDescription>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" class="text-xs" @click="showAllYears = !showAllYears">
            {{ showAllYears ? 'Show First 5 Years' : `Show All ${amortizationResult.yearlySchedule.length} Years` }}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <Table density="cozy">
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead class="text-right">Principal Paid</TableHead>
                <TableHead class="text-right">Interest Paid</TableHead>
                <TableHead class="text-right">Extra Principal</TableHead>
                <TableHead class="text-right">Total Payment</TableHead>
                <TableHead class="text-right">Ending Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in displayedSchedule" :key="row.year">
                <TableCell class="font-medium">
                  <div class="flex items-center gap-2">
                    <span>Year {{ row.year }}</span>
                    <Badge v-if="row.year === 1" variant="outline" class="text-xs font-normal"> Initial </Badge>
                  </div>
                </TableCell>
                <TableCell class="text-foreground text-right font-medium tabular-nums">
                  {{ fmtCurrency(row.principalPaid) }}
                </TableCell>
                <TableCell class="text-right text-amber-600 tabular-nums dark:text-amber-400">
                  {{ fmtCurrency(row.interestPaid) }}
                </TableCell>
                <TableCell class="text-right text-emerald-600 tabular-nums dark:text-emerald-400">
                  {{ row.extraPaid > 0 ? `+${fmtCurrency(row.extraPaid)}` : '—' }}
                </TableCell>
                <TableCell class="text-right font-semibold tabular-nums">
                  {{ fmtCurrency(row.totalPaid) }}
                </TableCell>
                <TableCell class="text-right font-semibold tabular-nums">
                  {{ fmtCurrency(row.remainingBalance) }}
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell class="font-bold">
                  Total ({{ displayedSchedule.length }} {{ displayedSchedule.length === 1 ? 'Year' : 'Years' }})
                </TableCell>
                <TableCell class="text-foreground text-right font-bold tabular-nums">
                  {{ fmtCurrency(displayedTotals.principal) }}
                </TableCell>
                <TableCell class="text-right font-bold text-amber-600 tabular-nums dark:text-amber-400">
                  {{ fmtCurrency(displayedTotals.interest) }}
                </TableCell>
                <TableCell class="text-right font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                  {{ fmtCurrency(displayedTotals.extra) }}
                </TableCell>
                <TableCell class="text-right font-bold tabular-nums">
                  {{ fmtCurrency(displayedTotals.total) }}
                </TableCell>
                <TableCell class="text-right font-bold tabular-nums">
                  {{ fmtCurrency(displayedSchedule[displayedSchedule.length - 1]?.remainingBalance ?? 0) }}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
