<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
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
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const selectedYear = ref('2026')

const metrics = [
  {
    title: 'Estimated Q3 Tax Liability',
    value: '$14,280.00',
    subtitle: 'Due Sep 15, 2026 · Payment pending',
    badge: 'Due in 24 days',
    badgeVariant: 'warning' as const,
    icon: Receipt,
  },
  {
    title: 'Gross Taxable Income',
    value: '$128,450.00',
    subtitle: 'YTD revenue across 4 client contracts',
    badge: '+18.4% YoY',
    badgeVariant: 'success' as const,
    icon: TrendingUp,
  },
  {
    title: 'Total Deductible Expenses',
    value: '$34,820.00',
    subtitle: 'YTD deductions across 5 categories',
    badge: '27.1% ratio',
    badgeVariant: 'info' as const,
    icon: FileCheck,
  },
  {
    title: 'Effective Tax Rate',
    value: '21.4%',
    subtitle: 'Federal (15.2%) + CA State (6.2%)',
    badge: 'Blended rate',
    badgeVariant: 'secondary' as const,
    icon: Scale,
  },
]

const jurisdictions = [
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

const deductionCategories = [
  {
    id: 'software',
    name: 'Software & Subscriptions',
    description: 'Cloud hosting, SaaS tooling, API subscriptions, and dev licenses',
    spent: '$12,450.00',
    rate: '100%',
    rateBadgeVariant: 'default' as const,
    savings: '$2,664.30',
  },
  {
    id: 'contractors',
    name: 'Contractor Payments',
    description: '1099-NEC engineering contractors, QA specialists, and design partners',
    spent: '$11,200.00',
    rate: '100%',
    rateBadgeVariant: 'default' as const,
    savings: '$2,396.80',
  },
  {
    id: 'office',
    name: 'Office & Equipment',
    description: 'Workstations, displays, ergonomic chairs, and home office deduction',
    spent: '$5,670.00',
    rate: '100%',
    rateBadgeVariant: 'default' as const,
    savings: '$1,213.38',
  },
  {
    id: 'travel',
    name: 'Travel & Meals',
    description: 'Client on-sites, tech conferences, and 50% eligible business dining',
    spent: '$3,100.00',
    rate: '50% for meals',
    rateBadgeVariant: 'secondary' as const,
    savings: '$331.70',
  },
  {
    id: 'professional',
    name: 'Professional Services',
    description: 'Corporate legal counsel, CPA tax advisory, and payroll processing',
    spent: '$2,400.00',
    rate: '100%',
    rateBadgeVariant: 'default' as const,
    savings: '$513.60',
  },
]

const quarterlySchedule = [
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
</script>

<template>
  <div data-slot="tax-summary-report" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div class="flex flex-wrap items-center gap-3">
          <h2 class="text-foreground text-2xl font-bold tracking-tight">Tax Summary & Estimated Liability</h2>
          <Badge wrap variant="warning" class="gap-1.5 px-2.5 py-1 text-xs font-medium">
            <Clock class="size-3.5" aria-hidden="true" />
            Q3 Estimated Taxes Due Sep 15
          </Badge>
        </div>
        <p class="text-muted-foreground mt-1 text-sm">
          Quarterly estimated tax obligations, IRS Schedule C deductible expenses, and jurisdictional liabilities.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <Select v-model="selectedYear">
          <SelectTrigger size="sm" class="w-36 text-xs font-medium" aria-label="Select Tax Year">
            <SelectValue placeholder="Tax Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026 Tax Year</SelectItem>
            <SelectItem value="2025">2025 Tax Year</SelectItem>
            <SelectItem value="2024">2024 Tax Year</SelectItem>
          </SelectContent>
        </Select>

        <Button aria-label="Download attachment" variant="outline" size="sm" class="gap-1.5 text-xs">
          <Download class="size-4" aria-hidden="true" />
          Export Tax Package
        </Button>

        <Button size="sm" class="gap-1.5 text-xs">
          <CreditCard class="size-4" aria-hidden="true" />
          Pay Estimated Tax
        </Button>
      </div>
    </div>

    <!-- 4 Key Tax Metrics Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="metric in metrics" :key="metric.title" class="shadow-xs">
        <CardContent class="p-5">
          <div class="flex items-center justify-between gap-2">
            <p class="text-muted-foreground text-xs font-medium">{{ metric.title }}</p>
            <div
              class="bg-muted text-muted-foreground border-border/60 flex size-8 shrink-0 items-center justify-center rounded-md border shadow-2xs"
              aria-hidden="true"
            >
              <component :is="metric.icon" class="size-4" />
            </div>
          </div>
          <div class="mt-3">
            <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">{{ metric.value }}</p>
            <div class="mt-2 flex items-center gap-2">
              <Badge wrap :variant="metric.badgeVariant" class="px-1.5 py-0 text-xs font-medium">
                {{ metric.badge }}
              </Badge>
              <span class="text-muted-foreground truncate text-xs">{{ metric.subtitle }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Tax Liability Breakdown by Jurisdiction -->
    <Card class="shadow-xs">
      <CardHeader>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle class="text-base font-semibold">Tax Liability Breakdown by Jurisdiction</CardTitle>
            <CardDescription class="text-xs sm:text-sm">
              Estimated Q3 distribution across federal, state, and payroll authorities ($14,280.00 total).
            </CardDescription>
          </div>
          <Badge wrap variant="outline" class="text-xs tabular-nums">3 Jurisdictions Active</Badge>
        </div>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Visual Multi-segment bar -->
        <div class="space-y-1.5">
          <div class="bg-muted/60 ring-border/50 flex h-3 w-full overflow-hidden rounded-full p-0.5 ring-1">
            <div
              class="bg-primary h-full rounded-l-full transition-all duration-300"
              style="width: 59%"
              title="Federal Income Tax: 59%"
            />
            <div
              class="h-full bg-amber-500 transition-all duration-300 dark:bg-amber-400"
              style="width: 27%"
              title="State & Local Tax: 27%"
            />
            <div
              class="h-full rounded-r-full bg-emerald-500 transition-all duration-300 dark:bg-emerald-400"
              style="width: 14%"
              title="Self-Employment / FICA: 14%"
            />
          </div>
          <div class="text-muted-foreground flex items-center justify-between text-xs">
            <span>Federal (59%)</span>
            <span>State (27%)</span>
            <span>Self-Employment (14%)</span>
          </div>
        </div>

        <!-- Jurisdiction Cards Grid -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            v-for="j in jurisdictions"
            :key="j.id"
            class="bg-muted/30 border-border/80 flex flex-col justify-between rounded-lg border p-4 shadow-2xs"
          >
            <div>
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <span :class="cn('size-2.5 shrink-0 self-start rounded-full', j.accentColor)" aria-hidden="true" />
                    <h4 class="text-foreground min-w-0 text-sm font-semibold">{{ j.name }}</h4>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">{{ j.authority }}</p>
                </div>
                <Badge wrap variant="secondary" class="text-xs font-semibold tabular-nums">{{ j.percentage }}%</Badge>
              </div>

              <div class="my-4">
                <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">{{ j.amount }}</p>
                <p class="text-muted-foreground mt-1 text-xs">{{ j.rateDescription }}</p>
              </div>
            </div>

            <Progress :model-value="j.percentage" class="h-1.5" />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Deductible Expense Categories Table -->
    <Card class="shadow-xs">
      <CardHeader>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle class="text-base font-semibold">Deductible Expense Categories</CardTitle>
            <CardDescription class="text-xs sm:text-sm">
              IRS Schedule C business deductions applied YTD to reduce gross taxable revenue ($34,820.00 total spent).
            </CardDescription>
          </div>
          <Badge wrap variant="outline" class="text-xs font-medium tabular-nums">YTD Tax Savings: $7,119.78</Badge>
        </div>
      </CardHeader>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[45%]">Category & Description</TableHead>
              <TableHead class="text-right">Total Spent YTD</TableHead>
              <TableHead class="text-center">Deductible Rate</TableHead>
              <TableHead class="text-right">Total Tax Savings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="category in deductionCategories" :key="category.id">
              <TableCell>
                <div class="text-foreground text-sm font-medium">{{ category.name }}</div>
                <div class="text-muted-foreground text-xs">{{ category.description }}</div>
              </TableCell>
              <TableCell class="text-foreground text-right font-medium tabular-nums">{{ category.spent }}</TableCell>
              <TableCell class="text-center">
                <Badge wrap :variant="category.rateBadgeVariant" class="text-xs font-medium">
                  {{ category.rate }}
                </Badge>
              </TableCell>
              <TableCell class="text-right font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                {{ category.savings }}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow class="font-medium">
              <TableCell>Total Business Deductions (5 categories)</TableCell>
              <TableCell class="text-foreground text-right font-bold tabular-nums">$34,820.00</TableCell>
              <TableCell class="text-center">
                <Badge wrap variant="outline" class="text-xs font-medium">95.5% blended</Badge>
              </TableCell>
              <TableCell class="text-right font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                $7,119.78
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>

    <!-- Quarterly Tax Filing Schedule Timeline -->
    <Card class="shadow-xs">
      <CardHeader>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle class="text-base font-semibold">Quarterly Estimated Tax Schedule</CardTitle>
            <CardDescription class="text-xs sm:text-sm">
              2026 fiscal tax year remittance timeline, due dates, and IRS EFTPS confirmations.
            </CardDescription>
          </div>
          <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
            <ShieldCheck class="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>IRS EFTPS Integrated</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="q in quarterlySchedule"
            :key="q.quarter"
            :class="
              cn(
                'relative flex flex-col justify-between rounded-lg border p-4 transition-colors',
                q.isCurrent ? 'border-primary/60 bg-primary/[0.03] shadow-xs' : 'border-border bg-card shadow-2xs',
              )
            "
          >
            <div>
              <div class="flex items-center justify-between gap-2">
                <span class="text-foreground text-sm font-semibold">{{ q.quarter }}</span>
                <Badge
                  :variant="q.status === 'Paid' ? 'success' : q.status === 'Upcoming' ? 'warning' : 'secondary'"
                  class="text-xs font-medium whitespace-normal"
                >
                  {{ q.status }}
                </Badge>
              </div>

              <div class="mt-2 space-y-1">
                <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Calendar class="size-3.5" aria-hidden="true" />
                  <span>Due: {{ q.dueDate }}</span>
                </div>
                <p class="text-muted-foreground text-xs">Period: {{ q.period }}</p>
              </div>
            </div>

            <div class="border-border/60 mt-4 border-t pt-3">
              <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <span class="text-muted-foreground text-xs">Amount</span>
                <span :class="cn('text-lg font-bold tabular-nums', q.isCurrent ? 'text-primary' : 'text-foreground')">
                  {{ q.amount }}
                </span>
              </div>
              <div
                :class="
                  cn(
                    'mt-1 flex items-center gap-1.5 text-xs',
                    q.status === 'Paid'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : q.status === 'Upcoming'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-muted-foreground',
                  )
                "
              >
                <CheckCircle2 v-if="q.status === 'Paid'" class="size-3.5 shrink-0" aria-hidden="true" />
                <Clock v-else-if="q.status === 'Upcoming'" class="size-3.5 shrink-0" aria-hidden="true" />
                <Calendar v-else class="size-3.5 shrink-0" aria-hidden="true" />
                <span class="truncate">{{ q.note }}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
