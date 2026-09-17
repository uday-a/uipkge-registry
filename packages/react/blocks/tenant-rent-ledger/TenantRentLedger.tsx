'use client'

import * as React from 'react'
import { useState } from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface PaymentRecord {
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

export function TenantRentLedger({ className }: { className?: string }) {
  const [autopayEnabled, setAutopayEnabled] = useState(true)
  const [autopayDay, setAutopayDay] = useState<'1st' | '5th'>('1st')

  return (
    <div data-slot="tenant-rent-ledger" className={cn('w-full space-y-6', className)}>
      {/* Resident & Unit Header */}
      <div className="bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Elena Rostova</h2>
            <Badge wrap variant="secondary" className="text-xs font-semibold">
              Unit 4B
            </Badge>
            <Badge
              wrap
              variant="outline"
              className="border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              $0.00 Paid in Full
            </Badge>
          </div>
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm">
            <Building2 className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
            <span>Pacific Heights Luxury Residences, San Francisco</span>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button className="font-medium shadow-xs">
            <CreditCard className="size-4" aria-hidden="true" />
            Pay Rent Now
          </Button>
        </div>
      </div>

      {/* 4 Financial Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {financialCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="shadow-xs">
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-muted-foreground text-xs font-medium">{card.title}</p>
                  <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', card.iconColor)}>
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">{card.value}</p>
                    {card.unit && <span className="text-muted-foreground text-xs font-normal">{card.unit}</span>}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Autopay & Payment Method Card */}
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Autopay &amp; Payment Preferences</CardTitle>
              <CardDescription className="text-xs">
                Configure automatic monthly rent deduction and manage saved funding methods.
              </CardDescription>
            </div>
            {autopayEnabled ? (
              <Badge
                wrap
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                Autopay Active
              </Badge>
            ) : (
              <Badge wrap variant="secondary" className="text-xs font-medium">
                Autopay Paused
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Toggle Autopay Switch */}
          <div className="bg-muted/30 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <label htmlFor="autopay-toggle-react" className="text-foreground cursor-pointer text-sm font-medium">
                Enable Automatic Rent Deductions
              </label>
              <p className="text-muted-foreground text-xs">
                Automatically charge your primary payment method on your selected schedule before due date.
              </p>
            </div>
            <Switch id="autopay-toggle-react" checked={autopayEnabled} onCheckedChange={setAutopayEnabled} />
          </div>

          <Separator />

          {/* Primary Bank Account / Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Primary Payment Method
              </h4>
              <Button variant="ghost" size="xs" className="text-primary hover:text-primary text-xs font-medium">
                Change Method
              </Button>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="bg-background flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs">
                  <CreditCard className="text-foreground size-5" aria-hidden="true" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-semibold tabular-nums">Visa •••• 4892</span>
                    <Badge wrap variant="secondary" className="text-xs font-normal">
                      Default
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">Elena Rostova · Expires 08/28 · Bank of America</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  wrap
                  variant="outline"
                  className="border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  Verified for ACH &amp; Debit
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Autopay Date Selector (1st vs 5th) */}
          <div className="space-y-3">
            <div className="space-y-0.5">
              <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Scheduled Deduction Date
              </h4>
              <p className="text-muted-foreground text-xs">
                Select when rent will be debited from your account each cycle.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!autopayEnabled}
                className={cn(
                  'focus-visible:ring-ring flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                  autopayDay === '1st' && autopayEnabled
                    ? 'border-primary bg-primary/5 ring-primary ring-1'
                    : 'border-border hover:bg-muted/50',
                )}
                onClick={() => setAutopayDay('1st')}
              >
                <div
                  className={cn(
                    'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                    autopayDay === '1st' && autopayEnabled
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/50',
                  )}
                >
                  {autopayDay === '1st' && autopayEnabled && <span className="bg-background size-1.5 rounded-full" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-medium">1st of the month</span>
                    <Badge
                      wrap
                      variant="outline"
                      className="border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Debited promptly on the rent due date. Ensures zero delinquency risk.
                  </p>
                </div>
              </button>

              <button
                type="button"
                disabled={!autopayEnabled}
                className={cn(
                  'focus-visible:ring-ring flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                  autopayDay === '5th' && autopayEnabled
                    ? 'border-primary bg-primary/5 ring-primary ring-1'
                    : 'border-border hover:bg-muted/50',
                )}
                onClick={() => setAutopayDay('5th')}
              >
                <div
                  className={cn(
                    'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                    autopayDay === '5th' && autopayEnabled
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/50',
                  )}
                >
                  {autopayDay === '5th' && autopayEnabled && <span className="bg-background size-1.5 rounded-full" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-medium">5th of the month</span>
                    <Badge wrap variant="secondary" className="text-xs font-normal">
                      Grace Period
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Processes within the standard 5-day building grace window before late fees.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Ledger Table */}
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-foreground text-base font-semibold tracking-tight">Payment History &amp; Ledger</h3>
            <p className="text-muted-foreground text-xs">
              Complete transaction record of monthly rent charges, utility allocations, and security deposits.
            </p>
          </div>
          <Button aria-label="Download attachment" variant="outline" size="sm" className="self-start sm:self-auto">
            <Download className="size-4" aria-hidden="true" />
            Download Statement (PDF)
          </Button>
        </div>

        <div className="bg-card overflow-x-auto rounded-lg border shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Billing Period &amp; Description</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="text-foreground text-sm font-medium">{record.period}</div>
                    <div className="text-muted-foreground text-xs">{record.description}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm tabular-nums">{record.dueDate}</TableCell>
                  <TableCell className="text-foreground text-sm font-medium tabular-nums">{record.paidDate}</TableCell>
                  <TableCell>
                    <div className="text-foreground flex items-center gap-1.5 text-xs sm:text-sm">
                      {record.methodType === 'ach' && (
                        <Landmark className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                      )}
                      {record.methodType === 'card' && (
                        <CreditCard className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                      )}
                      {record.methodType === 'wire' && (
                        <ShieldCheck className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                      )}
                      <span className="truncate">{record.method}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground text-right text-sm font-bold tabular-nums">
                    {record.amount}
                  </TableCell>
                  <TableCell>
                    {record.status === 'paid' ? (
                      <Badge
                        wrap
                        variant="outline"
                        className="border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                      >
                        <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        {record.statusLabel}
                      </Badge>
                    ) : (
                      <Badge
                        wrap
                        variant="outline"
                        className="border-blue-500/20 bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400"
                      >
                        <Clock className="size-3 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        {record.statusLabel}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground h-8 gap-1.5 text-xs"
                      aria-label="Download receipt PDF"
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                      <span>Receipt</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-muted-foreground flex flex-col gap-3 pt-1 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing <span className="text-foreground font-medium">6</span> of{' '}
            <span className="text-foreground font-medium">6</span> lease payments · Lease Ref:{' '}
            <span className="font-mono">PH-4B-2026</span>
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="xs" disabled>
              Previous
            </Button>
            <Button variant="outline" size="xs" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
