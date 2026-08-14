<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Home,
  Landmark,
  ShieldCheck,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const autopayEnabled = ref(true)
const autopayDay = ref<'1st' | '5th'>('1st')

interface PaymentRecord {
  id: string
  period: string
  description: string
  dueDate: string
  paidDate: string
  method: string
  methodType: 'ach' | 'card' | 'wire'
  amount: string
  status: 'paid' | 'waived'
  statusLabel: string
}

const financialCards = [
  {
    title: 'Monthly Base Rent',
    value: '$3,450.00',
    unit: '/ mo',
    description: 'Fixed lease rate through Jul 2027',
    icon: Home,
    iconColor: 'bg-primary/10 text-primary',
  },
  {
    title: 'Next Due Date',
    value: 'Sep 01, 2026',
    unit: '',
    description: 'Due in 11 days · Grace period to Sep 5',
    highlightBadge: 'Due in 11 days',
    icon: Calendar,
    iconColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Autopay Status',
    value: 'Active',
    unit: '',
    description: 'Scheduled for 1st of month with Visa •••• 4892',
    icon: Zap,
    iconColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Security Deposit on File',
    value: '$3,450.00',
    unit: '',
    description: 'Held in Escrow (Interest Bearing)',
    icon: ShieldCheck,
    iconColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
]

const paymentRecords: PaymentRecord[] = [
  {
    id: 'pay-2026-08',
    period: 'August 2026 Rent',
    description: 'Base Rent ($3,400.00) + High-Speed Fiber ($50.00)',
    dueDate: 'Aug 01, 2026',
    paidDate: 'Aug 01, 2026',
    method: 'ACH Transfer · Chase •••• 4892',
    methodType: 'ach',
    amount: '$3,450.00',
    status: 'paid',
    statusLabel: 'Paid on Time',
  },
  {
    id: 'pay-2026-07',
    period: 'July 2026 Rent',
    description: 'Base Rent ($3,400.00) + Assigned Parking Spot #4B ($50.00)',
    dueDate: 'Jul 01, 2026',
    paidDate: 'Jul 01, 2026',
    method: 'ACH Transfer · Chase •••• 4892',
    methodType: 'ach',
    amount: '$3,450.00',
    status: 'paid',
    statusLabel: 'Paid on Time',
  },
  {
    id: 'pay-2026-06',
    period: 'June 2026 Rent',
    description: 'Base Rent ($3,400.00) + Water & Sewer Allocation ($50.00)',
    dueDate: 'Jun 01, 2026',
    paidDate: 'Jun 03, 2026',
    method: 'Visa •••• 4892',
    methodType: 'card',
    amount: '$3,450.00',
    status: 'waived',
    statusLabel: 'Late Fee Waived',
  },
  {
    id: 'pay-2026-05',
    period: 'May 2026 Rent',
    description: 'Base Rent ($3,400.00) + Storage Locker #12 ($50.00)',
    dueDate: 'May 01, 2026',
    paidDate: 'May 01, 2026',
    method: 'ACH Transfer · Chase •••• 4892',
    methodType: 'ach',
    amount: '$3,450.00',
    status: 'paid',
    statusLabel: 'Paid on Time',
  },
  {
    id: 'pay-2026-04',
    period: 'April 2026 Rent',
    description: 'First Full Month Base Rent ($3,400.00) + Pet Rent ($50.00)',
    dueDate: 'Apr 01, 2026',
    paidDate: 'Apr 01, 2026',
    method: 'ACH Transfer · Chase •••• 4892',
    methodType: 'ach',
    amount: '$3,450.00',
    status: 'paid',
    statusLabel: 'Paid on Time',
  },
  {
    id: 'pay-2026-03-dep',
    period: 'Security Deposit & Move-In Fee',
    description: '100% Refundable Security Escrow Deposit + Key Fob Activation',
    dueDate: 'Mar 15, 2026',
    paidDate: 'Mar 15, 2026',
    method: 'Wire Transfer · Wells Fargo •••• 1044',
    methodType: 'wire',
    amount: '$3,450.00',
    status: 'paid',
    statusLabel: 'Paid on Time',
  },
]
</script>

<template>
  <div data-slot="tenant-rent-ledger" :class="cn('w-full space-y-6', props.class)">
    <!-- Resident & Unit Header -->
    <div
      class="bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2.5">
          <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Elena Rostova</h2>
          <Badge wrap variant="secondary" class="text-xs font-semibold"> Unit 4B </Badge>
          <Badge
            wrap
            variant="outline"
            class="border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 class="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            $0.00 Paid in Full
          </Badge>
        </div>
        <div class="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm">
          <Building2 class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
          <span>Pacific Heights Luxury Residences, San Francisco</span>
        </div>
      </div>
      <div class="flex items-center gap-3 self-start sm:self-auto">
        <Button class="font-medium shadow-xs">
          <CreditCard class="size-4" aria-hidden="true" />
          Pay Rent Now
        </Button>
      </div>
    </div>

    <!-- 4 Financial Overview Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="card in financialCards" :key="card.title" class="shadow-xs">
        <CardContent class="space-y-2 p-5">
          <div class="flex items-center justify-between gap-2">
            <p class="text-muted-foreground text-xs font-medium">{{ card.title }}</p>
            <div :class="cn('flex size-8 shrink-0 items-center justify-center rounded-lg', card.iconColor)">
              <component :is="card.icon" class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div class="flex items-baseline gap-1">
              <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">{{ card.value }}</p>
              <span v-if="card.unit" class="text-muted-foreground text-xs font-normal">{{ card.unit }}</span>
            </div>
            <p class="text-muted-foreground mt-1 text-xs">{{ card.description }}</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Autopay & Payment Method Card -->
    <Card class="shadow-xs">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-base font-semibold">Autopay &amp; Payment Preferences</CardTitle>
            <CardDescription class="text-xs">
              Configure automatic monthly rent deduction and manage saved funding methods.
            </CardDescription>
          </div>
          <Badge
            wrap
            v-if="autopayEnabled"
            variant="outline"
            class="border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            Autopay Active
          </Badge>
          <Badge wrap v-else variant="secondary" class="text-xs font-medium"> Autopay Paused </Badge>
        </div>
      </CardHeader>
      <CardContent class="space-y-5">
        <!-- Toggle Autopay Switch -->
        <div
          class="bg-muted/30 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="space-y-0.5">
            <label for="autopay-toggle" class="text-foreground cursor-pointer text-sm font-medium">
              Enable Automatic Rent Deductions
            </label>
            <p class="text-muted-foreground text-xs">
              Automatically charge your primary payment method on your selected schedule before due date.
            </p>
          </div>
          <Switch id="autopay-toggle" :model-value="autopayEnabled" @update:model-value="autopayEnabled = $event" />
        </div>

        <Separator />

        <!-- Primary Bank Account / Card -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Primary Payment Method</h4>
            <Button variant="ghost" size="xs" class="text-primary hover:text-primary text-xs font-medium">
              Change Method
            </Button>
          </div>
          <div class="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3.5">
              <div class="bg-background flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs">
                <CreditCard class="text-foreground size-5" aria-hidden="true" />
              </div>
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="text-foreground text-sm font-semibold tabular-nums">Visa •••• 4892</span>
                  <Badge wrap variant="secondary" class="text-xs font-normal">Default</Badge>
                </div>
                <p class="text-muted-foreground text-xs">Elena Rostova · Expires 08/28 · Bank of America</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Badge
                wrap
                variant="outline"
                class="border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 class="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                Verified for ACH &amp; Debit
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Autopay Date Selector (1st vs 5th) -->
        <div class="space-y-3">
          <div class="space-y-0.5">
            <h4 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Scheduled Deduction Date
            </h4>
            <p class="text-muted-foreground text-xs">Select when rent will be debited from your account each cycle.</p>
          </div>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              :disabled="!autopayEnabled"
              :class="
                cn(
                  'focus-visible:ring-ring flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                  autopayDay === '1st' && autopayEnabled
                    ? 'border-primary bg-primary/5 ring-primary ring-1'
                    : 'border-border hover:bg-muted/50',
                )
              "
              @click="autopayDay = '1st'"
            >
              <div
                :class="
                  cn(
                    'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                    autopayDay === '1st' && autopayEnabled
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/50',
                  )
                "
              >
                <span v-if="autopayDay === '1st' && autopayEnabled" class="bg-background size-1.5 rounded-full" />
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-foreground text-sm font-medium">1st of the month</span>
                  <Badge
                    wrap
                    variant="outline"
                    class="border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    Recommended
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs">
                  Debited promptly on the rent due date. Ensures zero delinquency risk.
                </p>
              </div>
            </button>

            <button
              type="button"
              :disabled="!autopayEnabled"
              :class="
                cn(
                  'focus-visible:ring-ring flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                  autopayDay === '5th' && autopayEnabled
                    ? 'border-primary bg-primary/5 ring-primary ring-1'
                    : 'border-border hover:bg-muted/50',
                )
              "
              @click="autopayDay = '5th'"
            >
              <div
                :class="
                  cn(
                    'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                    autopayDay === '5th' && autopayEnabled
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/50',
                  )
                "
              >
                <span v-if="autopayDay === '5th' && autopayEnabled" class="bg-background size-1.5 rounded-full" />
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-foreground text-sm font-medium">5th of the month</span>
                  <Badge wrap variant="secondary" class="text-xs font-normal"> Grace Period </Badge>
                </div>
                <p class="text-muted-foreground text-xs">
                  Processes within the standard 5-day building grace window before late fees.
                </p>
              </div>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Payment History Ledger Table -->
    <div class="space-y-3">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-foreground text-base font-semibold tracking-tight">Payment History &amp; Ledger</h3>
          <p class="text-muted-foreground text-xs">
            Complete transaction record of monthly rent charges, utility allocations, and security deposits.
          </p>
        </div>
        <Button aria-label="Download attachment" variant="outline" size="sm" class="self-start sm:self-auto">
          <Download class="size-4" aria-hidden="true" />
          Download Statement (PDF)
        </Button>
      </div>

      <div class="bg-card overflow-x-auto rounded-lg border shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Billing Period &amp; Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead class="text-right">Amount Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right"><span class="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="record in paymentRecords" :key="record.id" class="hover:bg-muted/50">
              <TableCell>
                <div class="text-foreground text-sm font-medium">{{ record.period }}</div>
                <div class="text-muted-foreground text-xs">{{ record.description }}</div>
              </TableCell>
              <TableCell class="text-muted-foreground text-sm tabular-nums">{{ record.dueDate }}</TableCell>
              <TableCell class="text-foreground text-sm font-medium tabular-nums">{{ record.paidDate }}</TableCell>
              <TableCell>
                <div class="text-foreground flex items-center gap-1.5 text-xs sm:text-sm">
                  <Landmark
                    v-if="record.methodType === 'ach'"
                    class="text-muted-foreground size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <CreditCard
                    v-else-if="record.methodType === 'card'"
                    class="text-muted-foreground size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <ShieldCheck v-else class="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                  <span class="truncate">{{ record.method }}</span>
                </div>
              </TableCell>
              <TableCell class="text-foreground text-right text-sm font-bold tabular-nums">
                {{ record.amount }}
              </TableCell>
              <TableCell>
                <Badge
                  v-if="record.status === 'paid'"
                  variant="outline"
                  class="border-emerald-500/20 bg-emerald-500/10 text-xs font-medium whitespace-normal text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 class="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  {{ record.statusLabel }}
                </Badge>
                <Badge
                  wrap
                  v-else
                  variant="outline"
                  class="border-blue-500/20 bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400"
                >
                  <Clock class="size-3 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  {{ record.statusLabel }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-8 gap-1.5 text-xs"
                  aria-label="Download receipt PDF"
                >
                  <Download class="size-3.5" aria-hidden="true" />
                  <span>Receipt</span>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div
        class="text-muted-foreground flex flex-col gap-3 pt-1 text-xs sm:flex-row sm:items-center sm:justify-between"
      >
        <p>
          Showing <span class="text-foreground font-medium">6</span> of
          <span class="text-foreground font-medium">6</span> lease payments · Lease Ref:
          <span class="font-mono">PH-4B-2026</span>
        </p>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="xs" disabled>Previous</Button>
          <Button variant="outline" size="xs" disabled>Next</Button>
        </div>
      </div>
    </div>
  </div>
</template>
