'use client'

import * as React from 'react'
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Film,
  FolderPlus,
  HeartPulse,
  Home,
  Laptop,
  PiggyBank,
  Plane,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface EnvelopeCategory {
  id: string
  name: string
  icon: React.ElementType
  budgeted: number
  spent: number
  note: string
  status: 'healthy' | 'warning' | 'completed' | 'on-track'
  statusLabel: string
  isSavings?: boolean
}

interface EnvelopeSection {
  id: string
  title: string
  description: string
  icon: React.ElementType
  totalBudgeted: number
  totalSpent: number
  categories: EnvelopeCategory[]
}

const sections: EnvelopeSection[] = [
  {
    id: 'immediate-obligations',
    title: 'Immediate Obligations',
    description: 'Non-negotiable fixed living expenses and essential monthly bills.',
    icon: Home,
    totalBudgeted: 3750,
    totalSpent: 3550,
    categories: [
      {
        id: 'cat-housing',
        name: 'Housing & Rent',
        icon: Home,
        budgeted: 2400,
        spent: 2400,
        note: 'Mortgage, HOA fee & insurance · Auto-paid Aug 1',
        status: 'completed',
        statusLabel: 'Paid in Full',
      },
      {
        id: 'cat-utilities',
        name: 'Utilities & Internet',
        icon: Zap,
        budgeted: 350,
        spent: 320,
        note: 'Electric ($185), Water ($75), Fiber ($60)',
        status: 'healthy',
        statusLabel: 'Healthy',
      },
      {
        id: 'cat-groceries',
        name: 'Groceries & Household',
        icon: ShoppingCart,
        budgeted: 800,
        spent: 650,
        note: 'Trader Joe’s & weekly produce · $15.00/day left',
        status: 'healthy',
        statusLabel: 'Healthy',
      },
      {
        id: 'cat-health',
        name: 'Health & Medical',
        icon: HeartPulse,
        budgeted: 200,
        spent: 180,
        note: 'Prescription copays & health membership',
        status: 'healthy',
        statusLabel: 'Healthy',
      },
    ],
  },
  {
    id: 'lifestyle-discretionary',
    title: 'Lifestyle & Discretionary',
    description: 'Variable lifestyle choices, dining, entertainment, and digital subscriptions.',
    icon: UtensilsCrossed,
    totalBudgeted: 700,
    totalSpent: 625,
    categories: [
      {
        id: 'cat-dining',
        name: 'Dining Out & Cafes',
        icon: UtensilsCrossed,
        budgeted: 400,
        spent: 380,
        note: 'Restaurants, coffee & takeout · $20.00 left for 10 days',
        status: 'warning',
        statusLabel: 'Near Limit',
      },
      {
        id: 'cat-entertainment',
        name: 'Entertainment & Leisure',
        icon: Film,
        budgeted: 200,
        spent: 150,
        note: 'Cinema tickets, gaming pass & weekend outings',
        status: 'healthy',
        statusLabel: 'Healthy',
      },
      {
        id: 'cat-tech',
        name: 'Tech & Subscriptions',
        icon: Laptop,
        budgeted: 100,
        spent: 95,
        note: 'iCloud, Spotify, GitHub Pro, ChatGPT Plus',
        status: 'warning',
        statusLabel: 'Near Limit',
      },
    ],
  },
  {
    id: 'savings-investments',
    title: 'Savings Goals & Investments',
    description: 'Dedicated wealth accumulation, emergency reserve, and planned sinking funds.',
    icon: PiggyBank,
    totalBudgeted: 1583,
    totalSpent: 1483,
    categories: [
      {
        id: 'cat-emergency',
        name: 'Emergency Fund',
        icon: ShieldCheck,
        budgeted: 500,
        spent: 500,
        note: 'High-yield cash reserve · Total balance: $18,500.00',
        status: 'completed',
        statusLabel: 'Goal Met',
        isSavings: true,
      },
      {
        id: 'cat-roth',
        name: 'Roth IRA Contribution',
        icon: TrendingUp,
        budgeted: 583,
        spent: 583,
        note: 'Broad-market index ETF · 2026 cap pacing ($7,000/yr)',
        status: 'completed',
        statusLabel: 'Maxed Monthly',
        isSavings: true,
      },
      {
        id: 'cat-vacation',
        name: 'Vacation & Travel Fund',
        icon: Plane,
        budgeted: 500,
        spent: 400,
        note: 'Tokyo autumn trip 2027 · $3,400.00 of $5,000.00 goal',
        status: 'on-track',
        statusLabel: '80% Funded',
        isSavings: true,
      },
    ],
  },
]

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function getProgressColor(status: EnvelopeCategory['status']): string {
  if (status === 'warning') {
    return '[&_[data-slot=progress-indicator]]:bg-amber-500'
  }
  if (status === 'completed' || status === 'healthy' || status === 'on-track') {
    return '[&_[data-slot=progress-indicator]]:bg-emerald-500'
  }
  return '[&_[data-slot=progress-indicator]]:bg-primary'
}

function getBadgeVariant(status: EnvelopeCategory['status']) {
  if (status === 'warning') return 'warning'
  if (status === 'completed' || status === 'healthy' || status === 'on-track') return 'success'
  return 'outline'
}

export function PersonalFinanceBudget({ className }: { className?: string }) {
  return (
    <div data-slot="personal-finance-budget" className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">Monthly Zero-Based Budget</h1>
            <div className="bg-muted text-foreground border-border flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold">
              <Calendar className="text-muted-foreground size-3.5" />
              <span>August 2026</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-3.5 shrink-0" />
              <span>
                To be Budgeted: <strong className="font-semibold tabular-nums">$0.00</strong> · Every dollar assigned!
              </span>
            </div>
            <span className="text-muted-foreground hidden text-xs sm:inline">Zero-Based Envelope Method</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 shadow-xs">
            <FolderPlus className="text-muted-foreground size-4" />
            <span>Add Category</span>
          </Button>
          <Button size="sm" className="gap-1.5 shadow-xs">
            <Plus className="size-4" />
            <span>Add Expense</span>
          </Button>
        </div>
      </div>

      {/* 4 Primary Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Monthly Income */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400"
                >
                  <Wallet className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-xs font-medium">Total Monthly Income</CardTitle>
              </div>
              <Badge variant="success" className="text-xs">
                100% Assigned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$8,500.00</div>
              <p className="text-muted-foreground mt-0.5 text-xs">2 Inflow streams (Salary & Freelance)</p>
            </div>
            <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-2 text-xs">
              <span>Unassigned Pool</span>
              <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">$0.00</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Budgeted & Spent */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                >
                  <CreditCard className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-xs font-medium">Budgeted & Spent</CardTitle>
              </div>
              <Badge variant="warning" className="text-xs tabular-nums">
                80.5% Spent
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="flex items-baseline gap-1 text-2xl font-bold tracking-tight">
                <span className="text-foreground tabular-nums">$6,840.00</span>
                <span className="text-muted-foreground text-xs font-normal tabular-nums">/ $8,500.00</span>
              </div>
              <div className="mt-2 space-y-1">
                <Progress value={80.5} className="h-2 [&_[data-slot=progress-indicator]]:bg-amber-500" />
              </div>
            </div>
            <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-2 text-xs">
              <span>Remaining in Envelopes</span>
              <span className="text-foreground font-medium tabular-nums">$1,660.00</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Savings Allocated */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400"
                >
                  <PiggyBank className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-xs font-medium">Savings Allocated</CardTitle>
              </div>
              <Badge variant="success" className="text-xs tabular-nums">
                19.5% Rate
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$1,660.00</div>
              <div className="mt-2 space-y-1">
                <Progress value={89.3} className="h-2 [&_[data-slot=progress-indicator]]:bg-emerald-500" />
              </div>
            </div>
            <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-2 text-xs">
              <span>Funded to Date</span>
              <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                $1,483.00 (89.3%)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Days Remaining in Month */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                >
                  <Clock className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-xs font-medium">Month Pace</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs font-normal tabular-nums">
                Day 21 of 31
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">10 Days left</div>
              <div className="mt-2 space-y-1">
                <Progress value={67.7} className="h-2" />
              </div>
            </div>
            <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-2 text-xs">
              <span>Cycle Elapsed</span>
              <span className="text-foreground font-medium tabular-nums">67.7% of month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Envelope Categories List Grouped by Section */}
      <div className="space-y-6">
        {sections.map((section) => {
          const SectionIcon = section.icon
          return (
            <Card key={section.id} className="overflow-hidden shadow-xs">
              <CardHeader className="bg-muted/20 border-border border-b py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <SectionIcon className="text-muted-foreground size-4 shrink-0" />
                      <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">{section.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="bg-background border-border flex items-center gap-2 rounded-md border px-3 py-1.5 shadow-2xs">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-foreground font-semibold tabular-nums">
                        {formatCurrency(section.totalSpent)}
                      </span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-muted-foreground font-medium tabular-nums">
                        {formatCurrency(section.totalBudgeted)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="min-w-[240px] text-xs font-semibold">Envelope Category</TableHead>
                        <TableHead className="text-right text-xs font-semibold">
                          {section.id === 'savings-investments' ? 'Monthly Target' : 'Budgeted'}
                        </TableHead>
                        <TableHead className="text-right text-xs font-semibold">
                          {section.id === 'savings-investments' ? 'Funded to Date' : 'Spent to Date'}
                        </TableHead>
                        <TableHead className="text-right text-xs font-semibold">
                          {section.id === 'savings-investments' ? 'Remaining to Goal' : 'Available Balance'}
                        </TableHead>
                        <TableHead className="min-w-[180px] text-xs font-semibold">Progress & Pace</TableHead>
                        <TableHead className="w-[110px] text-right text-xs font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {section.categories.map((cat) => {
                        const CatIcon = cat.icon
                        const remaining = cat.budgeted - cat.spent
                        const percent = Math.min(100, Math.round((cat.spent / cat.budgeted) * 100))

                        return (
                          <TableRow key={cat.id} className="hover:bg-muted/40 transition-colors">
                            {/* Envelope Category & Note */}
                            <TableCell className="py-3.5">
                              <div className="flex items-start gap-3">
                                <div
                                  aria-hidden="true"
                                  className="bg-muted text-muted-foreground border-border mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                                >
                                  <CatIcon className="size-4" />
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-foreground text-xs font-semibold">{cat.name}</p>
                                  <p className="text-muted-foreground text-xs">{cat.note}</p>
                                </div>
                              </div>
                            </TableCell>

                            {/* Budgeted Amount */}
                            <TableCell className="text-foreground py-3.5 text-right text-xs font-medium tabular-nums">
                              {formatCurrency(cat.budgeted)}
                            </TableCell>

                            {/* Spent to Date */}
                            <TableCell className="text-foreground py-3.5 text-right text-xs font-medium tabular-nums">
                              {formatCurrency(cat.spent)}
                            </TableCell>

                            {/* Remaining Balance */}
                            <TableCell className="py-3.5 text-right text-xs">
                              <span
                                className={cn(
                                  'font-bold tabular-nums',
                                  remaining === 0
                                    ? 'text-muted-foreground'
                                    : cat.status === 'warning'
                                      ? 'text-amber-600 dark:text-amber-400'
                                      : 'text-emerald-600 dark:text-emerald-400',
                                )}
                              >
                                {formatCurrency(remaining)}
                              </span>
                            </TableCell>

                            {/* Progress Bar & Percentage */}
                            <TableCell className="py-3.5">
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground tabular-nums">
                                    {percent}% {cat.isSavings ? 'funded' : 'used'}
                                  </span>
                                  <span className="text-muted-foreground text-xs tabular-nums">
                                    {formatCurrency(cat.spent)}
                                  </span>
                                </div>
                                <Progress value={percent} className={cn('h-1.5', getProgressColor(cat.status))} />
                              </div>
                            </TableCell>

                            {/* Status Badge */}
                            <TableCell className="py-3.5 text-right">
                              <Badge variant={getBadgeVariant(cat.status)} className="text-xs">
                                {cat.statusLabel}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Zero-Based Budgeting Philosophy & Rules Card */}
      <Card className="bg-muted/20 border-border p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400"
            >
              <CheckCircle2 className="size-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-foreground text-xs font-semibold">Zero-Based Allocation Completed</h4>
              <p className="text-muted-foreground text-xs">
                Every dollar of your $8,500.00 income is accounted for: $4,450.00 living expenses + $1,583.00 savings
                goals + $2,467.00 scheduled buffer = $0.00 unassigned.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal">
              Next Payday: Sep 1, 2026
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}
