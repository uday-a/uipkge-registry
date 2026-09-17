'use client'

import * as React from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

function fmtCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0)
}

function fmtCurrencyWhole(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val || 0)
}

export function LoanCalculator({ className }: { className?: string }) {
  const [selectedLoanType, setSelectedLoanType] = React.useState<LoanType>('mortgage-30')
  const [loanAmount, setLoanAmount] = React.useState(450_000)
  const [interestRate, setInterestRate] = React.useState(6.5)
  const [loanTermYears, setLoanTermYears] = React.useState(30)
  const [extraMonthlyPayment, setExtraMonthlyPayment] = React.useState(200)
  const [showAllYears, setShowAllYears] = React.useState(false)

  const handleTabChange = React.useCallback((value: string) => {
    const type = value as LoanType
    setSelectedLoanType(type)
    const preset = LOAN_PRESETS[type]
    if (preset) {
      setLoanAmount(preset.amount)
      setInterestRate(preset.rate)
      setLoanTermYears(preset.termYears)
      setExtraMonthlyPayment(preset.extraPayment)
    }
  }, [])

  // Base monthly payment (standard amortization without extra payments)
  const baseMonthlyPayment = React.useMemo(() => {
    const principal = loanAmount
    const annualRate = interestRate
    const termYears = loanTermYears
    const totalMonths = termYears * 12

    if (principal <= 0 || totalMonths <= 0) return 0
    if (annualRate <= 0) return principal / totalMonths

    const monthlyRate = annualRate / 100 / 12
    const factor = Math.pow(1 + monthlyRate, totalMonths)
    if (!isFinite(factor) || factor <= 1) return principal / totalMonths
    return (principal * (monthlyRate * factor)) / (factor - 1)
  }, [loanAmount, interestRate, loanTermYears])

  // Total standard cost and interest without extra payment
  const totalCostBase = React.useMemo(() => {
    return baseMonthlyPayment * loanTermYears * 12
  }, [baseMonthlyPayment, loanTermYears])

  const totalInterestBase = React.useMemo(() => {
    return Math.max(0, totalCostBase - loanAmount)
  }, [totalCostBase, loanAmount])

  // Month-by-month amortization schedule calculation
  const amortizationResult = React.useMemo(() => {
    const principal = Math.max(0, loanAmount)
    const annualRate = Math.max(0, interestRate)
    const termYears = Math.max(1, loanTermYears)
    const extra = Math.max(0, extraMonthlyPayment)
    const basePayment = baseMonthlyPayment
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
    const interestSaved = Math.max(0, totalInterestBase - totalInterest)

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
  }, [loanAmount, interestRate, loanTermYears, extraMonthlyPayment, baseMonthlyPayment, totalInterestBase])

  // Visual breakdown percentages
  const principalPercent = React.useMemo(() => {
    const total = amortizationResult.totalLoanCost
    if (total <= 0) return 100
    return Math.min(100, Math.max(0, Math.round((loanAmount / total) * 100)))
  }, [amortizationResult.totalLoanCost, loanAmount])

  const interestPercent = React.useMemo(() => {
    return Math.max(0, 100 - principalPercent)
  }, [principalPercent])

  // Filtered schedule for display
  const displayedSchedule = React.useMemo(() => {
    if (showAllYears) {
      return amortizationResult.yearlySchedule
    }
    return amortizationResult.yearlySchedule.slice(0, 5)
  }, [showAllYears, amortizationResult.yearlySchedule])

  // Totals for the displayed schedule
  const displayedTotals = React.useMemo(() => {
    const list = displayedSchedule
    return {
      principal: list.reduce((sum, r) => sum + r.principalPaid, 0),
      interest: list.reduce((sum, r) => sum + r.interestPaid, 0),
      extra: list.reduce((sum, r) => sum + r.extraPaid, 0),
      total: list.reduce((sum, r) => sum + r.totalPaid, 0),
    }
  }, [displayedSchedule])

  return (
    <div data-slot="loan-calculator" className={cn('mx-auto w-full max-w-6xl space-y-10 p-4 sm:p-6 lg:p-8', className)}>
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs font-medium tracking-wider uppercase">
          <Calculator className="text-primary size-3.5" />
          Loan Amortization Engine
        </Badge>
        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Loan &amp; Mortgage Amortization Calculator
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-base">
            Estimate monthly payments, interest vs principal breakdown, and payoff timelines with extra payments.
          </p>
        </div>

        {/* Loan Type Tabs */}
        <div className="mt-2 flex w-full justify-center">
          <Tabs value={selectedLoanType} onValueChange={handleTabChange} className="w-full sm:w-auto">
            <TabsList variant="segmented" className="grid w-full grid-cols-2 sm:flex sm:w-auto">
              <TabsTrigger value="mortgage-30" className="gap-1.5">
                <Home className="size-3.5" />
                Mortgage 30Y
              </TabsTrigger>
              <TabsTrigger value="commercial-10" className="gap-1.5">
                <Building2 className="size-3.5" />
                Commercial 10Y
              </TabsTrigger>
              <TabsTrigger value="auto-5" className="gap-1.5">
                <Car className="size-3.5" />
                Auto Loan 5Y
              </TabsTrigger>
              <TabsTrigger value="personal-3" className="gap-1.5">
                <Wallet className="size-3.5" />
                Personal Loan
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 2-Column Calculator Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Inputs Card */}
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="text-primary size-5" />
                Loan Parameters
              </CardTitle>
              <CardDescription>
                Customize loan principal, interest rate, term duration, and extra monthly contributions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* 1. Loan Amount */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-foreground text-sm font-medium">Loan Amount (Principal)</span>
                    <p className="text-muted-foreground text-xs">Total borrowed loan amount.</p>
                  </div>
                  <div className="w-36 sm:w-44">
                    <Input
                      id="loan-amount-input"
                      type="number"
                      size="small"
                      min={5000}
                      max={2500000}
                      step={5000}
                      prefix="$"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="pb-6">
                  <Slider
                    value={[loanAmount]}
                    min={10000}
                    max={2000000}
                    step={5000}
                    marks={LOAN_AMOUNT_MARKS}
                    tooltip={(val) => `$${val.toLocaleString('en-US')}`}
                    onValueChange={(val) => setLoanAmount(val[0])}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground text-xs">Quick select:</span>
                  {[150000, 300000, 450000, 750000, 1200000].map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setLoanAmount(amt)}
                    >
                      ${amt >= 1000000 ? `${(amt / 1000000).toFixed(1)}M` : `${amt / 1000}K`}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 2. Interest Rate */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-foreground text-sm font-medium">Annual Interest Rate (APR)</span>
                    <p className="text-muted-foreground text-xs">Fixed annual percentage rate.</p>
                  </div>
                  <div className="w-32 sm:w-36">
                    <Input
                      id="interest-rate-input"
                      type="number"
                      size="small"
                      min={0.5}
                      max={25}
                      step={0.1}
                      suffix="%"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="pb-6">
                  <Slider
                    value={[interestRate]}
                    min={1}
                    max={15}
                    step={0.1}
                    marks={INTEREST_RATE_MARKS}
                    tooltip={(val) => `${val.toFixed(1)}%`}
                    onValueChange={(val) => setInterestRate(val[0])}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground text-xs">Market benchmarks:</span>
                  {[4.5, 5.5, 6.5, 7.5, 9.5].map((rate) => (
                    <Button
                      key={rate}
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setInterestRate(rate)}
                    >
                      {rate}%
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 3. Loan Term */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-foreground text-sm font-medium">Loan Term</span>
                    <p className="text-muted-foreground text-xs">Amortization period in years.</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="font-mono text-xs font-semibold">
                      {loanTermYears} Years ({loanTermYears * 12} mo)
                    </Badge>
                  </div>
                </div>
                <div className="pb-6">
                  <Slider
                    value={[loanTermYears]}
                    min={1}
                    max={30}
                    step={1}
                    marks={LOAN_TERM_MARKS}
                    tooltip={(val) => `${val} Years`}
                    onValueChange={(val) => setLoanTermYears(val[0])}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground text-xs">Standard terms:</span>
                  {TERM_PRESETS.map((term) => (
                    <Button
                      key={term}
                      variant={loanTermYears === term ? 'default' : 'outline'}
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setLoanTermYears(term)}
                    >
                      {term} Yrs
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 4. Extra Monthly Payment */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-medium">Extra Monthly Payment</span>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/20 bg-emerald-500/10 text-xs font-normal text-emerald-600 dark:text-emerald-400"
                      >
                        Accelerates Payoff
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">Directly reduces principal balance each month.</p>
                  </div>
                  <div className="w-36 sm:w-44">
                    <Input
                      id="extra-payment-input"
                      type="number"
                      size="small"
                      min={0}
                      max={10000}
                      step={25}
                      prefix="$"
                      suffix="/ mo"
                      value={extraMonthlyPayment}
                      onChange={(e) => setExtraMonthlyPayment(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="pb-6">
                  <Slider
                    value={[extraMonthlyPayment]}
                    min={0}
                    max={2000}
                    step={25}
                    marks={EXTRA_PAYMENT_MARKS}
                    tooltip={(val) => `$${val}/mo`}
                    onValueChange={(val) => setExtraMonthlyPayment(val[0])}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground text-xs">Quick extra:</span>
                  {[0, 100, 200, 500, 1000].map((extra) => (
                    <Button
                      key={extra}
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setExtraMonthlyPayment(extra)}
                    >
                      +${extra}/mo
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Results Card (Sticky on desktop) */}
        <div className="lg:sticky lg:top-8 lg:col-span-5">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Estimated Monthly Payment
                </span>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold"
                >
                  Amortized
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                    {fmtCurrency(baseMonthlyPayment)}
                  </span>
                  <span className="text-muted-foreground text-sm font-normal"> / month</span>
                </div>
                {extraMonthlyPayment > 0 ? (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Total monthly cash outlay:{' '}
                    <span className="text-foreground font-semibold tabular-nums">
                      {fmtCurrency(baseMonthlyPayment + extraMonthlyPayment)}/mo
                    </span>{' '}
                    ({fmtCurrency(baseMonthlyPayment)} base + {fmtCurrency(extraMonthlyPayment)} extra)
                  </p>
                ) : (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Standard fixed payment based on {interestRate}% APR over {loanTermYears} years.
                  </p>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <Separator />

              {/* Extra Payment Impact Box */}
              {extraMonthlyPayment > 0 && amortizationResult.interestSavings > 0 && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="mt-0.5 size-4 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm leading-snug font-semibold">
                        Saves {fmtCurrencyWhole(amortizationResult.interestSavings)} and cuts{' '}
                        {amortizationResult.yearsSaved} years off payoff!
                      </p>
                      <p className="leading-normal text-emerald-700/80 dark:text-emerald-300/80">
                        You'll be debt-free in {amortizationResult.actualYears} years ({amortizationResult.actualMonths}{' '}
                        payments) instead of {loanTermYears} years.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Breakdown */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Loan Principal</span>
                  <span className="font-medium tabular-nums">{fmtCurrency(loanAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Interest Paid</span>
                  <span className="font-medium text-amber-600 tabular-nums dark:text-amber-400">
                    {fmtCurrency(amortizationResult.totalInterestPaid)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Loan Cost</span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {fmtCurrency(amortizationResult.totalLoanCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Effective Payoff Timeline</span>
                  <span className="font-medium tabular-nums">
                    {amortizationResult.actualYears} Years ({amortizationResult.actualMonths} mo)
                  </span>
                </div>
              </div>

              <Separator />

              {/* Visual Principal vs Interest Bar */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground">Principal vs. Total Interest</span>
                  <span className="text-muted-foreground tabular-nums">
                    {principalPercent}% / {interestPercent}%
                  </span>
                </div>
                <div className="bg-muted relative flex h-3 w-full overflow-hidden rounded-full shadow-inner">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${principalPercent}%` }}
                  />
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${interestPercent}%` }}
                  />
                </div>
                <div className="text-muted-foreground flex flex-col gap-1.5 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-primary size-2 shrink-0 rounded-full" />
                    <span>
                      Principal: {fmtCurrencyWhole(loanAmount)} ({principalPercent}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 shrink-0 rounded-full bg-amber-500" />
                    <span>
                      Interest: {fmtCurrencyWhole(amortizationResult.totalInterestPaid)} ({interestPercent}%)
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Key Features / Trust Checklist */}
              <ul className="text-muted-foreground space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary size-3.5 shrink-0" />
                  <span>Real-time compound interest calculations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary size-3.5 shrink-0" />
                  <span>Principal reduction extra payment model</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary size-3.5 shrink-0" />
                  <span>Standard fixed-rate banking amortization schedule</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter className="flex flex-col gap-2.5 pt-2">
              <Button className="w-full gap-2 font-semibold shadow-xs" size="lg">
                Apply for Pre-Approval
                <ArrowRight className="size-4" />
              </Button>
              <Button aria-label="Download attachment" variant="outline" className="w-full gap-2" size="default">
                <FileSpreadsheet className="size-4" />
                Download Schedule (CSV)
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <Card className="mt-8">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-primary size-5" />
              Amortization Schedule
            </CardTitle>
            <CardDescription>
              Annual breakdown of principal reduction, interest paid, extra contributions, and ending balance.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowAllYears((prev) => !prev)}>
              {showAllYears ? 'Show First 5 Years' : `Show All ${amortizationResult.yearlySchedule.length} Years`}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table density="cozy">
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Principal Paid</TableHead>
                  <TableHead className="text-right">Interest Paid</TableHead>
                  <TableHead className="text-right">Extra Principal</TableHead>
                  <TableHead className="text-right">Total Payment</TableHead>
                  <TableHead className="text-right">Ending Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedSchedule.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>Year {row.year}</span>
                        {row.year === 1 && (
                          <Badge variant="outline" className="text-xs font-normal">
                            Initial
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground text-right font-medium tabular-nums">
                      {fmtCurrency(row.principalPaid)}
                    </TableCell>
                    <TableCell className="text-right text-amber-600 tabular-nums dark:text-amber-400">
                      {fmtCurrency(row.interestPaid)}
                    </TableCell>
                    <TableCell className="text-right text-emerald-600 tabular-nums dark:text-emerald-400">
                      {row.extraPaid > 0 ? `+${fmtCurrency(row.extraPaid)}` : '—'}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {fmtCurrency(row.totalPaid)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {fmtCurrency(row.remainingBalance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="font-bold">
                    Total ({displayedSchedule.length} {displayedSchedule.length === 1 ? 'Year' : 'Years'})
                  </TableCell>
                  <TableCell className="text-foreground text-right font-bold tabular-nums">
                    {fmtCurrency(displayedTotals.principal)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-amber-600 tabular-nums dark:text-amber-400">
                    {fmtCurrency(displayedTotals.interest)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                    {fmtCurrency(displayedTotals.extra)}
                  </TableCell>
                  <TableCell className="text-right font-bold tabular-nums">
                    {fmtCurrency(displayedTotals.total)}
                  </TableCell>
                  <TableCell className="text-right font-bold tabular-nums">
                    {fmtCurrency(displayedSchedule[displayedSchedule.length - 1]?.remainingBalance ?? 0)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoanCalculator
