'use client'

import * as React from 'react'
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileCheck,
  Receipt,
  Scale,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface TaxSummaryReportProps {
  className?: string
}

interface MetricItem {
  title: string
  value: string
  subtitle: string
  badge: string
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  icon: React.ElementType
}

interface JurisdictionItem {
  id: string
  name: string
  authority: string
  amount: string
  percentage: number
  rateDescription: string
  accentColor: string
}

interface DeductionCategoryItem {
  id: string
  name: string
  description: string
  spent: string
  rate: string
  rateBadgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  savings: string
}

interface QuarterlyScheduleItem {
  quarter: string
  period: string
  dueDate: string
  status: 'Paid' | 'Upcoming' | 'Future'
  amount: string
  note: string
  isCurrent: boolean
}

const metrics: MetricItem[] = [
  {
    title: 'Estimated Q3 Tax Liability',
    value: '$14,280.00',
    subtitle: 'Due Sep 15, 2026 · Payment pending',
    badge: 'Due in 24 days',
    badgeVariant: 'warning',
    icon: Receipt,
  },
  {
    title: 'Gross Taxable Income',
    value: '$128,450.00',
    subtitle: 'YTD revenue across 4 client contracts',
    badge: '+18.4% YoY',
    badgeVariant: 'success',
    icon: TrendingUp,
  },
  {
    title: 'Total Deductible Expenses',
    value: '$34,820.00',
    subtitle: 'YTD deductions across 5 categories',
    badge: '27.1% ratio',
    badgeVariant: 'info',
    icon: FileCheck,
  },
  {
    title: 'Effective Tax Rate',
    value: '21.4%',
    subtitle: 'Federal (15.2%) + CA State (6.2%)',
    badge: 'Blended rate',
    badgeVariant: 'secondary',
    icon: Scale,
  },
]

const jurisdictions: JurisdictionItem[] = [
  {
    id: 'federal',
    name: 'Federal Income Tax',
    authority: 'Internal Revenue Service (IRS)',
    amount: '$8,420.00',
    percentage: 59,
    rateDescription: 'Estimated at 24% marginal individual / corporate bracket',
    accentColor: 'bg-primary',
  },
  {
    id: 'state',
    name: 'State & Local Tax',
    authority: 'California Franchise Tax Board (FTB)',
    amount: '$3,860.00',
    percentage: 27,
    rateDescription: 'California Schedule CA (540) estimated at 9.3% bracket',
    accentColor: 'bg-amber-500 dark:bg-amber-400',
  },
  {
    id: 'fica',
    name: 'Self-Employment / FICA',
    authority: 'Social Security & Medicare (Schedule SE)',
    amount: '$2,000.00',
    percentage: 14,
    rateDescription: '15.3% self-employment contribution on 92.35% net earnings',
    accentColor: 'bg-emerald-500 dark:bg-emerald-400',
  },
]

const deductionCategories: DeductionCategoryItem[] = [
  {
    id: 'software',
    name: 'Software & Subscriptions',
    description: 'Cloud hosting, SaaS tooling, API subscriptions, and dev licenses',
    spent: '$12,450.00',
    rate: '100%',
    rateBadgeVariant: 'default',
    savings: '$2,664.30',
  },
  {
    id: 'contractors',
    name: 'Contractor Payments',
    description: '1099-NEC engineering contractors, QA specialists, and design partners',
    spent: '$11,200.00',
    rate: '100%',
    rateBadgeVariant: 'default',
    savings: '$2,396.80',
  },
  {
    id: 'office',
    name: 'Office & Equipment',
    description: 'Workstations, displays, ergonomic chairs, and home office deduction',
    spent: '$5,670.00',
    rate: '100%',
    rateBadgeVariant: 'default',
    savings: '$1,213.38',
  },
  {
    id: 'travel',
    name: 'Travel & Meals',
    description: 'Client on-sites, tech conferences, and 50% eligible business dining',
    spent: '$3,100.00',
    rate: '50% for meals',
    rateBadgeVariant: 'secondary',
    savings: '$331.70',
  },
  {
    id: 'professional',
    name: 'Professional Services',
    description: 'Corporate legal counsel, CPA tax advisory, and payroll processing',
    spent: '$2,400.00',
    rate: '100%',
    rateBadgeVariant: 'default',
    savings: '$513.60',
  },
]

const quarterlySchedule: QuarterlyScheduleItem[] = [
  {
    quarter: 'Q1 2026',
    period: 'Jan 1 – Mar 31',
    dueDate: 'April 15, 2026',
    status: 'Paid',
    amount: '$11,850.00',
    note: 'EFTPS Conf #98214 · Paid Apr 12',
    isCurrent: false,
  },
  {
    quarter: 'Q2 2026',
    period: 'Apr 1 – May 31',
    dueDate: 'June 15, 2026',
    status: 'Paid',
    amount: '$12,400.00',
    note: 'EFTPS Conf #45091 · Paid Jun 14',
    isCurrent: false,
  },
  {
    quarter: 'Q3 2026',
    period: 'Jun 1 – Aug 31',
    dueDate: 'September 15, 2026',
    status: 'Upcoming',
    amount: '$14,280.00',
    note: 'Auto-debit scheduled for Sep 15',
    isCurrent: true,
  },
  {
    quarter: 'Q4 2026',
    period: 'Sep 1 – Dec 31',
    dueDate: 'January 15, 2027',
    status: 'Future',
    amount: '$13,500.00',
    note: 'Projected year-end estimate',
    isCurrent: false,
  },
]

export function TaxSummaryReport({ className }: TaxSummaryReportProps) {
  const [selectedYear, setSelectedYear] = React.useState('2026')

  return (
    <div data-slot="tax-summary-report" className={cn('w-full space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">Tax Summary & Estimated Liability</h2>
            <Badge wrap variant="warning" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
              <Clock className="size-3.5" aria-hidden="true" />
              Q3 Estimated Taxes Due Sep 15
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Quarterly estimated tax obligations, IRS Schedule C deductible expenses, and jurisdictional liabilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger size="sm" className="w-36 text-xs font-medium" aria-label="Select Tax Year">
              <SelectValue placeholder="Tax Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026 Tax Year</SelectItem>
              <SelectItem value="2025">2025 Tax Year</SelectItem>
              <SelectItem value="2024">2024 Tax Year</SelectItem>
            </SelectContent>
          </Select>

          <Button aria-label="Download attachment" variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="size-4" aria-hidden="true" />
            Export Tax Package
          </Button>

          <Button size="sm" className="gap-1.5 text-xs">
            <CreditCard className="size-4" aria-hidden="true" />
            Pay Estimated Tax
          </Button>
        </div>
      </div>

      {/* 4 Key Tax Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="shadow-xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-muted-foreground text-xs font-medium">{metric.title}</p>
                  <div
                    aria-hidden="true"
                    className="bg-muted text-muted-foreground border-border/60 flex size-8 shrink-0 items-center justify-center rounded-md border shadow-2xs"
                  >
                    <Icon className="size-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">{metric.value}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge wrap variant={metric.badgeVariant} className="px-1.5 py-0 text-xs font-medium">
                      {
                        {
                          default: metric.badge,
                          secondary: metric.badge,
                          destructive: metric.badge,
                          outline: metric.badge,
                          success: metric.badge,
                          warning: metric.badge,
                          info: metric.badge,
                        }[metric.badgeVariant]
                      }
                    </Badge>
                    <span className="text-muted-foreground truncate text-xs">{metric.subtitle}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tax Liability Breakdown by Jurisdiction */}
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold">Tax Liability Breakdown by Jurisdiction</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Estimated Q3 distribution across federal, state, and payroll authorities ($14,280.00 total).
              </CardDescription>
            </div>
            <Badge wrap variant="outline" className="text-xs tabular-nums">
              3 Jurisdictions Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Multi-segment bar */}
          <div className="space-y-1.5">
            <div className="bg-muted/60 ring-border/50 flex h-3 w-full overflow-hidden rounded-full p-0.5 ring-1">
              <div
                className="bg-primary h-full rounded-l-full transition-all duration-300"
                style={{ width: '59%' }}
                title="Federal Income Tax: 59%"
              />
              <div
                className="h-full bg-amber-500 transition-all duration-300 dark:bg-amber-400"
                style={{ width: '27%' }}
                title="State & Local Tax: 27%"
              />
              <div
                className="h-full rounded-r-full bg-emerald-500 transition-all duration-300 dark:bg-emerald-400"
                style={{ width: '14%' }}
                title="Self-Employment / FICA: 14%"
              />
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>Federal (59%)</span>
              <span>State (27%)</span>
              <span>Self-Employment (14%)</span>
            </div>
          </div>

          {/* Jurisdiction Cards Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {jurisdictions.map((j) => (
              <div
                key={j.id}
                className="bg-muted/30 border-border/80 flex flex-col justify-between rounded-lg border p-4 shadow-2xs"
              >
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn('size-2.5 shrink-0 self-start rounded-full', j.accentColor)}
                          aria-hidden="true"
                        />
                        <h4 className="text-foreground min-w-0 text-sm font-semibold">{j.name}</h4>
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-xs">{j.authority}</p>
                    </div>
                    <Badge wrap variant="secondary" className="text-xs font-semibold tabular-nums">
                      {j.percentage}%
                    </Badge>
                  </div>

                  <div className="my-4">
                    <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">{j.amount}</p>
                    <p className="text-muted-foreground mt-1 text-xs">{j.rateDescription}</p>
                  </div>
                </div>

                <Progress value={j.percentage} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deductible Expense Categories Table */}
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold">Deductible Expense Categories</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                IRS Schedule C business deductions applied YTD to reduce gross taxable revenue ($34,820.00 total spent).
              </CardDescription>
            </div>
            <Badge wrap variant="outline" className="text-xs font-medium tabular-nums">
              YTD Tax Savings: $7,119.78
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[45%]">Category & Description</TableHead>
                <TableHead className="text-right">Total Spent YTD</TableHead>
                <TableHead className="text-center">Deductible Rate</TableHead>
                <TableHead className="text-right">Total Tax Savings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deductionCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="text-foreground text-sm font-medium">{category.name}</div>
                    <div className="text-muted-foreground text-xs">{category.description}</div>
                  </TableCell>
                  <TableCell className="text-foreground text-right font-medium tabular-nums">
                    {category.spent}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge wrap variant={category.rateBadgeVariant} className="text-xs font-medium">
                      {category.rate}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                    {category.savings}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="font-medium">
                <TableCell>Total Business Deductions (5 categories)</TableCell>
                <TableCell className="text-foreground text-right font-bold tabular-nums">$34,820.00</TableCell>
                <TableCell className="text-center">
                  <Badge wrap variant="outline" className="text-xs font-medium">
                    95.5% blended
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                  $7,119.78
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Quarterly Tax Filing Schedule Timeline */}
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold">Quarterly Estimated Tax Schedule</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                2026 fiscal tax year remittance timeline, due dates, and IRS EFTPS confirmations.
              </CardDescription>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>IRS EFTPS Integrated</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quarterlySchedule.map((q) => (
              <div
                key={q.quarter}
                className={cn(
                  'relative flex flex-col justify-between rounded-lg border p-4 transition-colors',
                  q.isCurrent ? 'border-primary/60 bg-primary/[0.03] shadow-xs' : 'border-border bg-card shadow-2xs',
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground text-sm font-semibold">{q.quarter}</span>
                    <Badge
                      wrap
                      variant={q.status === 'Paid' ? 'success' : q.status === 'Upcoming' ? 'warning' : 'secondary'}
                      className="text-xs font-medium"
                    >
                      {q.status}
                    </Badge>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <Calendar className="size-3.5" aria-hidden="true" />
                      <span>Due: {q.dueDate}</span>
                    </div>
                    <p className="text-muted-foreground text-xs">Period: {q.period}</p>
                  </div>
                </div>

                <div className="border-border/60 mt-4 border-t pt-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                    <span className="text-muted-foreground text-xs">Amount</span>
                    <span
                      className={cn('text-lg font-bold tabular-nums', q.isCurrent ? 'text-primary' : 'text-foreground')}
                    >
                      {q.amount}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'mt-1 flex items-center gap-1.5 text-xs',
                      q.status === 'Paid'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : q.status === 'Upcoming'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-muted-foreground',
                    )}
                  >
                    {q.status === 'Paid' ? (
                      <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                    ) : q.status === 'Upcoming' ? (
                      <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
                    )}
                    <span className="truncate">{q.note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
