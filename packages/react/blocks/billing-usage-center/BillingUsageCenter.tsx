'use client'

import * as React from 'react'
import { CreditCard, Download, FileText, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { SectionCard } from '@/components/ui/section-card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface PlanInfo {
  name: string
  price: string
  /** Billing cadence shown after the price, e.g. 'month' or 'year'. */
  cadence: string
  renewalDate: string
  seatsUsed: number
  seatsTotal: number
}

export interface UsageMetric {
  id: string
  label: string
  usedText: string
  includedText: string
  /** Percent of the included allowance. Above 100 means overage. */
  percent: number
  /** Shown when percent exceeds 100; falls back to a generic overage note. */
  overageNote?: string
}

export type InvoiceStatus = 'paid' | 'open' | 'past-due'

export interface Invoice {
  id: string
  number: string
  period: string
  amount: string
  status: InvoiceStatus
}

export interface BillingUsageCenterProps {
  plan?: PlanInfo
  usage?: UsageMetric[]
  invoices?: Invoice[]
  className?: string
}

const defaultPlan: PlanInfo = {
  name: 'Pro',
  price: '$49',
  cadence: 'month',
  renewalDate: 'September 12, 2026',
  seatsUsed: 18,
  seatsTotal: 20,
}

const defaultUsage: UsageMetric[] = [
  { id: 'storage', label: 'Storage', usedText: '8.2 GB', includedText: '10 GB', percent: 82 },
  { id: 'bandwidth', label: 'Bandwidth', usedText: '412 GB', includedText: '1 TB', percent: 41 },
  { id: 'api-calls', label: 'API calls', usedText: '640K', includedText: '1M', percent: 64 },
]

const defaultInvoices: Invoice[] = [
  { id: 'inv-003', number: 'INV-2026-003', period: 'Jul 1 – Jul 31, 2026', amount: '$49.00', status: 'paid' },
  { id: 'inv-002', number: 'INV-2026-002', period: 'Jun 1 – Jun 30, 2026', amount: '$49.00', status: 'paid' },
  { id: 'inv-001', number: 'INV-2026-001', period: 'May 1 – May 31, 2026', amount: '$49.00', status: 'paid' },
]

const statusMeta: Record<InvoiceStatus, { label: string; variant: 'success' | 'default' | 'destructive' }> = {
  paid: { label: 'Paid', variant: 'success' },
  open: { label: 'Open', variant: 'default' },
  'past-due': { label: 'Past due', variant: 'destructive' },
}

// success below 80%, warning as usage approaches the limit, destructive at/over it.
function usageBarClass(percent: number): string {
  if (percent >= 100) return '[&_[data-slot=progress-indicator]]:bg-destructive'
  if (percent >= 80) return '[&_[data-slot=progress-indicator]]:bg-warning'
  return '[&_[data-slot=progress-indicator]]:bg-success'
}

export function BillingUsageCenter({
  plan = defaultPlan,
  usage = defaultUsage,
  invoices = defaultInvoices,
  className,
}: BillingUsageCenterProps) {
  const seatsPercent = plan.seatsTotal > 0 ? (plan.seatsUsed / plan.seatsTotal) * 100 : 0

  const unpaidInvoices = invoices.filter((invoice) => invoice.status !== 'paid')
  const pastDueCount = invoices.filter((invoice) => invoice.status === 'past-due').length

  const unpaidNote = (() => {
    const count = unpaidInvoices.length
    const plural = count === 1 ? '' : 's'
    const pastPart = pastDueCount > 0 ? `, ${pastDueCount} of them past due` : ''
    return `You have ${count} unpaid invoice${plural}${pastPart}. Update your payment method to avoid service interruption.`
  })()

  return (
    <div data-slot="billing-usage-center" className={cn('mx-auto w-full max-w-3xl space-y-4', className)}>
      <SectionCard title="Current plan" description={`Renews on ${plan.renewalDate}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-bold tracking-tight">{plan.name}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {plan.price} <span className="text-xs">/ {plan.cadence}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-1.5">
          <div className="flex flex-wrap items-baseline justify-between gap-4 text-sm">
            <span className="font-medium">Seats used</span>
            <span className="text-muted-foreground text-xs tabular-nums">
              {plan.seatsUsed} of {plan.seatsTotal}
            </span>
          </div>
          <Progress value={seatsPercent} />
          <p className="text-muted-foreground text-xs">
            {Math.max(plan.seatsTotal - plan.seatsUsed, 0)} seats remaining on this plan.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="outline" size="sm">
            <CreditCard aria-hidden="true" />
            Manage payment
          </Button>
          <Button size="sm">Change plan</Button>
        </div>
      </SectionCard>

      <SectionCard title="Usage this month" description="Metered against your plan allowances.">
        <div className="space-y-5">
          {usage.map((metric) => (
            <div key={metric.id} className="space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-4 text-sm">
                <span className="font-medium">{metric.label}</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {metric.usedText} of {metric.includedText}
                </span>
              </div>
              <Progress value={Math.min(metric.percent, 100)} className={usageBarClass(metric.percent)} />
              {metric.percent > 100 && (
                <p className="text-destructive text-xs">
                  {metric.overageNote ??
                    `Over the ${metric.includedText} included in your plan — overage charges apply.`}
                </p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Invoice history"
        description={`${invoices.length} invoice${invoices.length === 1 ? '' : 's'}`}
      >
        {invoices.length > 0 ? (
          <div className="space-y-4">
            {unpaidInvoices.length > 0 && (
              <Alert className="border-warning/40 bg-warning/5">
                <TriangleAlert className="text-warning size-4" aria-hidden="true" />
                <AlertTitle>Past-due balance</AlertTitle>
                <AlertDescription>{unpaidNote}</AlertDescription>
              </Alert>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12">
                      <span className="sr-only">Download</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.period}</TableCell>
                      <TableCell className="text-right tabular-nums">{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge variant={statusMeta[invoice.status].variant}>{statusMeta[invoice.status].label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" aria-label={`Download invoice ${invoice.number}`}>
                          <Download aria-hidden="true" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <div className="bg-muted mb-3 rounded-full p-3">
              <FileText className="text-muted-foreground size-5" />
            </div>
            <p className="text-sm font-medium">No invoices yet</p>
            <p className="text-muted-foreground mt-0.5 text-xs">Invoices appear here after your first billing cycle.</p>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
