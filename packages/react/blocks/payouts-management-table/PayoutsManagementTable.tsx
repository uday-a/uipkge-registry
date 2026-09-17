'use client'

import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Landmark,
  MoreHorizontal,
  ShieldCheck,
  Wallet,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type PayoutStatus = 'paid' | 'in_transit' | 'pending' | 'failed'

export interface PayoutBatch {
  id: string
  initiatedDate: string
  arrivalDate: string
  destination: string
  grossAmount: string
  feeAmount: string
  netAmount: string
  status: PayoutStatus
}

const statusConfig: Record<PayoutStatus, { label: string; className: string }> = {
  paid: {
    label: 'Paid',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  in_transit: {
    label: 'In Transit',
    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  },
}

const summary = [
  {
    title: 'Available for Payout',
    amount: '$18,420.50',
    description: 'Auto-transfers daily at 00:00 UTC',
    icon: Wallet,
    iconClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'In Transit / Scheduled',
    amount: '$4,250.00',
    description: 'Estimated arrival: Aug 23, 2026',
    icon: Clock,
    iconClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Rolling Reserve / Held',
    amount: '$1,500.00',
    description: 'Released in 14 days',
    icon: ShieldCheck,
    iconClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
]

const payouts: PayoutBatch[] = [
  {
    id: 'PO-84920',
    initiatedDate: 'Aug 21, 2026',
    arrivalDate: 'Est. Aug 23, 2026',
    destination: 'Chase •••• 4892',
    grossAmount: '$12,780.00',
    feeAmount: '-$330.00',
    netAmount: '$12,450.00',
    status: 'in_transit',
  },
  {
    id: 'PO-84919',
    initiatedDate: 'Aug 20, 2026',
    arrivalDate: 'Est. Aug 22, 2026',
    destination: 'Chase •••• 4892',
    grossAmount: '$8,950.00',
    feeAmount: '-$245.50',
    netAmount: '$8,704.50',
    status: 'pending',
  },
  {
    id: 'PO-84918',
    initiatedDate: 'Aug 19, 2026',
    arrivalDate: 'Aug 21, 2026',
    destination: 'Chase •••• 4892',
    grossAmount: '$15,400.00',
    feeAmount: '-$398.00',
    netAmount: '$15,002.00',
    status: 'paid',
  },
  {
    id: 'PO-84917',
    initiatedDate: 'Aug 18, 2026',
    arrivalDate: 'Aug 20, 2026',
    destination: 'Chase •••• 4892',
    grossAmount: '$9,220.00',
    feeAmount: '-$238.40',
    netAmount: '$8,981.60',
    status: 'paid',
  },
  {
    id: 'PO-84916',
    initiatedDate: 'Aug 17, 2026',
    arrivalDate: 'Aug 19, 2026',
    destination: 'Chase •••• 4892',
    grossAmount: '$6,100.00',
    feeAmount: '-$162.00',
    netAmount: '$5,938.00',
    status: 'failed',
  },
  {
    id: 'PO-84915',
    initiatedDate: 'Aug 16, 2026',
    arrivalDate: 'Aug 18, 2026',
    destination: 'Chase •••• 4892',
    grossAmount: '$18,340.00',
    feeAmount: '-$460.00',
    netAmount: '$17,880.00',
    status: 'paid',
  },
]

export function PayoutsManagementTable({ className }: { className?: string }) {
  return (
    <div data-slot="payouts-management-table" className={cn('w-full space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payouts &amp; Transfers</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Track automated scheduled settlements, rolling reserves, and bank transfers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline">
            <CalendarClock aria-hidden="true" />
            Configure Payout Schedule
          </Button>
          <Button>
            <Zap aria-hidden="true" />
            Instant Payout
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="shadow-xs">
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm font-medium">{item.title}</p>
                  <div className={cn('flex size-8 items-center justify-center rounded-md', item.iconClass)}>
                    <Icon aria-hidden="true" className="size-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight tabular-nums">{item.amount}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Primary Destination Card */}
      <Card className="shadow-xs">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
              <Landmark aria-hidden="true" className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">Chase Commercial •••• 4892</span>
                <Badge
                  variant="outline"
                  className="border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 aria-hidden="true" className="size-3" />
                  Verified
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Primary Settlement
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                Routing <span className="font-mono tabular-nums">021000021</span> · Checking account · Daily automated
                transfer
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="self-start sm:self-auto">
            <Building2 aria-hidden="true" />
            Update Bank Account
          </Button>
        </CardContent>
      </Card>

      {/* Payouts Batch Table */}
      <div className="bg-card overflow-x-auto rounded-lg border shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payout ID</TableHead>
              <TableHead>Initiated / Expected</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="text-right">Gross</TableHead>
              <TableHead className="text-right">Fees</TableHead>
              <TableHead className="text-right">Net Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout.id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-xs font-semibold">{payout.id}</TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{payout.initiatedDate}</div>
                  <div className="text-muted-foreground text-xs">{payout.arrivalDate}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Landmark aria-hidden="true" className="text-muted-foreground size-3.5 shrink-0" />
                    <span>{payout.destination}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-right text-sm tabular-nums">
                  {payout.grossAmount}
                </TableCell>
                <TableCell className="text-muted-foreground text-right text-xs tabular-nums">
                  {payout.feeAmount}
                </TableCell>
                <TableCell className="text-right text-sm font-semibold tabular-nums">{payout.netAmount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('font-medium', statusConfig[payout.status].className)}>
                    {statusConfig[payout.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                        <MoreHorizontal aria-hidden="true" />
                        <span className="sr-only">Open actions for {payout.id}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem>
                        <FileText aria-hidden="true" />
                        View itemized breakdown
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download aria-hidden="true" />
                        Download receipt
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <ExternalLink aria-hidden="true" />
                        Trace transfer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          Showing <span className="text-foreground font-medium">6</span> of{' '}
          <span className="text-foreground font-medium">128</span> payout batches
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
