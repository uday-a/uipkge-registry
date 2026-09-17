<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Landmark,
  Receipt,
  Send,
  ShieldCheck,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface EmployeeRecord {
  id: string
  name: string
  role: string
  department: string
  payType: 'Salary' | 'Hourly'
  hours: string
  grossPay: string
  deductions: string
  deductionsDetail: string
  netPay: string
  paymentMethod: string
  bankDetail: string
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const timelineSteps = [
  {
    step: 1,
    title: 'ACH Debit Date',
    date: 'Wednesday, Aug 19, 2026',
    time: '5:00 PM EST',
    description: 'Company Operating Account (•••• 9021) debited for payroll & tax liability.',
    status: 'Completed',
    statusClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: CheckCircle2,
  },
  {
    step: 2,
    title: 'Bank Processing',
    date: 'Thursday, Aug 20, 2026',
    time: 'Automated Clearing',
    description: 'Federal Reserve NACHA batch transmission, ACH clearing, and tax escrow lock.',
    status: 'In Transit',
    statusClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    icon: Landmark,
  },
  {
    step: 3,
    title: 'Employee Payday',
    date: 'Friday, Aug 21, 2026',
    time: '12:01 AM Local',
    description: 'Net funds settled across 42 employee accounts and electronic paystubs released.',
    status: 'Target Payday',
    statusClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: DollarSign,
  },
]

const summaryCards = [
  {
    label: 'Total Company Cost',
    value: '$184,250.00',
    badge: 'Cycle #16',
    description: 'Gross pay ($169,670.00) + Employer taxes ($14,580.00)',
    icon: Building2,
  },
  {
    label: 'Net Direct Deposit Pay',
    value: '$138,420.00',
    badge: '42 Employees',
    description: 'Disbursed to 42 employees via automated 100% direct deposit',
    icon: CreditCard,
  },
  {
    label: 'Employee Withholdings',
    value: '$31,250.00',
    badge: 'Federal & State Tax',
    description: '$31,250.00 · Federal & State Tax, FICA & benefit deductions',
    icon: Receipt,
  },
  {
    label: 'Employer Payroll Taxes',
    value: '$14,580.00',
    badge: 'FICA & FUTA',
    description: '$14,580.00 · FICA & FUTA, SUTA employer contributions',
    icon: ShieldCheck,
  },
]

const employees: EmployeeRecord[] = [
  {
    id: 'emp-1',
    name: 'Elena Rostova',
    role: 'Principal Engineer',
    department: 'Engineering',
    payType: 'Salary',
    hours: '80.0 hrs',
    grossPay: '$8,750.00',
    deductions: '-$2,140.00',
    deductionsDetail: 'Pre-tax 401k & Health',
    netPay: '$6,610.00',
    paymentMethod: 'Direct Deposit',
    bankDetail: 'Chase •••• 4892',
  },
  {
    id: 'emp-2',
    name: 'Marcus Vance',
    role: 'Staff Architect',
    department: 'Engineering',
    payType: 'Salary',
    hours: '80.0 hrs',
    grossPay: '$8,125.00',
    deductions: '-$1,980.00',
    deductionsDetail: 'Pre-tax 401k & HSA',
    netPay: '$6,145.00',
    paymentMethod: 'Direct Deposit',
    bankDetail: 'Wells Fargo •••• 3109',
  },
  {
    id: 'emp-3',
    name: 'David Chen',
    role: 'Senior Full-Stack',
    department: 'Engineering',
    payType: 'Salary',
    hours: '80.0 hrs',
    grossPay: '$6,875.00',
    deductions: '-$1,650.00',
    deductionsDetail: 'Pre-tax 401k & Dental',
    netPay: '$5,225.00',
    paymentMethod: 'Direct Deposit',
    bankDetail: 'Bank of America •••• 7741',
  },
  {
    id: 'emp-4',
    name: 'Sarah Jenkins',
    role: 'Frontend Specialist',
    department: 'Engineering',
    payType: 'Hourly',
    hours: '80.0 hrs',
    grossPay: '$5,492.50',
    deductions: '-$1,280.00',
    deductionsDetail: 'Medical & Vision',
    netPay: '$4,212.50',
    paymentMethod: 'Direct Deposit',
    bankDetail: 'Citibank •••• 9018',
  },
  {
    id: 'emp-5',
    name: 'Alex Rivera',
    role: 'Product Designer',
    department: 'Design',
    payType: 'Salary',
    hours: '80.0 hrs',
    grossPay: '$6,250.00',
    deductions: '-$1,490.00',
    deductionsDetail: 'Pre-tax 401k & Health',
    netPay: '$4,760.00',
    paymentMethod: 'Direct Deposit',
    bankDetail: 'SVB •••• 6523',
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
</script>

<template>
  <div data-slot="payroll-run-summary" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-3">
          <h2 class="text-foreground text-2xl font-bold tracking-tight">Payroll Run Summary</h2>
          <Badge
            wrap
            variant="outline"
            class="gap-1.5 border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
          >
            <span class="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Approved & Ready to Submit
          </Badge>
        </div>
        <p class="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
          <span class="inline-flex items-center gap-1.5">
            <Calendar class="size-4" aria-hidden="true" />
            Pay Period: <strong class="text-foreground font-medium">Aug 01, 2026 – Aug 15, 2026</strong>
          </span>
          <span> Pay Date: <strong class="text-foreground font-medium">Aug 21</strong> </span>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <Button aria-label="Download attachment" variant="outline">
          <Download class="size-4" aria-hidden="true" />
          Export Payroll CSV
        </Button>
        <Button>
          <Send class="size-4" aria-hidden="true" />
          Submit Payroll ($184,250.00)
        </Button>
      </div>
    </div>

    <!-- 4 Primary Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="card in summaryCards" :key="card.label" class="relative overflow-hidden shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">
            {{ card.label }}
          </CardTitle>
          <Badge wrap variant="secondary" class="text-xs font-normal">
            {{ card.badge }}
          </Badge>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="text-foreground text-3xl font-bold tracking-tight tabular-nums">
            {{ card.value }}
          </div>
          <p class="text-muted-foreground text-xs leading-relaxed">
            {{ card.description }}
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Direct Deposit Funding Timeline Bar -->
    <Card class="border-border shadow-xs">
      <CardHeader class="border-b pb-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <Clock class="text-muted-foreground size-4" aria-hidden="true" />
            <CardTitle class="text-sm font-semibold tracking-tight"> Direct Deposit Funding Timeline </CardTitle>
          </div>
          <Badge wrap variant="outline" class="text-muted-foreground w-fit text-xs font-normal">
            ACH 2-Day Settlement Window
          </Badge>
        </div>
      </CardHeader>
      <CardContent class="pt-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            v-for="(item, idx) in timelineSteps"
            :key="item.step"
            class="bg-card relative flex flex-col justify-between rounded-lg border p-4 shadow-xs"
          >
            <div class="space-y-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex min-w-0 items-center gap-2">
                  <div
                    class="bg-muted text-foreground flex size-7 items-center justify-center rounded-full text-xs font-semibold"
                  >
                    {{ item.step }}
                  </div>
                  <span class="text-foreground text-xs font-semibold tracking-tight">
                    {{ item.title }}
                  </span>
                </div>
                <Badge wrap :class="cn('text-xs font-medium capitalize', item.statusClass)">
                  {{ item.status }}
                </Badge>
              </div>

              <div class="pt-1">
                <p class="text-foreground text-xs font-medium">{{ item.date }}</p>
                <p class="text-muted-foreground text-xs">{{ item.time }}</p>
              </div>

              <p class="text-muted-foreground text-xs leading-relaxed">
                {{ item.description }}
              </p>
            </div>

            <div class="text-muted-foreground mt-3 flex items-center justify-between border-t pt-2 text-xs">
              <span class="inline-flex items-center gap-1 font-medium">
                <component :is="item.icon" class="text-foreground/70 size-3.5" aria-hidden="true" />
                {{ idx === 0 ? 'Verified' : idx === 1 ? 'Processing' : 'Scheduled' }}
              </span>
              <span v-if="idx < timelineSteps.length - 1" class="text-muted-foreground/50 hidden md:inline-flex">
                Next: Step {{ idx + 2 }}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Employee Payroll Table -->
    <div class="bg-card overflow-hidden rounded-lg border shadow-xs">
      <div class="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-foreground text-base font-semibold tracking-tight">Employee Compensation Breakdown</h3>
          <p class="text-muted-foreground mt-0.5 text-xs">
            5 of 42 employees shown in active batch · 80.0 standard cycle base hours
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Badge wrap variant="secondary" class="text-xs font-medium"> 42 Total Employees </Badge>
          <Badge
            wrap
            variant="outline"
            class="border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            Approved & Ready to Submit
          </Badge>
        </div>
      </div>

      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow class="bg-muted/40 hover:bg-muted/40">
              <TableHead class="min-w-[220px]">Employee</TableHead>
              <TableHead>Pay Type</TableHead>
              <TableHead class="text-right">Hours</TableHead>
              <TableHead class="text-right">Gross Pay</TableHead>
              <TableHead class="min-w-[180px] text-right">Total Deductions</TableHead>
              <TableHead class="text-right">Net Pay</TableHead>
              <TableHead class="min-w-[220px]">Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="emp in employees" :key="emp.id" class="hover:bg-muted/30">
              <TableCell>
                <div class="flex items-center gap-3">
                  <Avatar class="size-8 border">
                    <AvatarFallback class="text-xs font-medium">
                      {{ initials(emp.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex min-w-0 flex-col">
                    <div class="flex items-center gap-2">
                      <span class="text-foreground truncate text-sm font-semibold">{{ emp.name }}</span>
                      <Badge wrap variant="outline" class="px-1.5 py-0 text-xs font-normal">
                        {{ emp.department }}
                      </Badge>
                    </div>
                    <span class="text-muted-foreground truncate text-xs">{{ emp.role }}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  :variant="emp.payType === 'Salary' ? 'outline' : 'secondary'"
                  class="text-xs font-medium whitespace-normal"
                >
                  {{ emp.payType }}
                </Badge>
              </TableCell>
              <TableCell class="text-foreground text-right font-mono text-xs tabular-nums">
                {{ emp.hours }}
              </TableCell>
              <TableCell class="text-foreground text-right font-medium tabular-nums">
                {{ emp.grossPay }}
              </TableCell>
              <TableCell class="text-right">
                <div class="flex flex-col items-end">
                  <span class="text-sm font-medium text-red-600 tabular-nums dark:text-red-400">
                    {{ emp.deductions }}
                  </span>
                  <span class="text-muted-foreground text-xs">
                    {{ emp.deductionsDetail }}
                  </span>
                </div>
              </TableCell>
              <TableCell class="text-right">
                <span class="text-sm font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                  {{ emp.netPay }}
                </span>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <Landmark class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                  <div class="flex min-w-0 flex-col">
                    <span class="text-foreground truncate text-xs font-medium">{{ emp.paymentMethod }}</span>
                    <span class="text-muted-foreground truncate text-xs">{{ emp.bankDetail }}</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div class="bg-muted/20 flex flex-col items-center justify-between gap-3 border-t p-4 sm:flex-row">
        <p class="text-muted-foreground text-xs">
          Showing 5 of 42 employees · Reconciliation verified against IRS Form 941 schedules
        </p>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled> Previous </Button>
          <Button variant="outline" size="sm"> Next </Button>
        </div>
      </div>
    </div>
  </div>
</template>
