'use client'

import { Check, Download, Eye, MoreHorizontal, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft'

export interface Invoice {
  id: string
  number: string
  client: string
  issued: string
  due: string
  amount: string
  status: InvoiceStatus
}

const summary = [
  { label: 'Total outstanding', value: '$12,480.00', note: '5 unpaid invoices', tone: '' },
  { label: 'Paid this month', value: '$28,930.00', note: '+12% vs last month', tone: '' },
  {
    label: 'Overdue',
    value: '$3,120.00',
    note: '2 invoices past due',
    tone: 'text-red-600 dark:text-red-400',
  },
]

const statusClass: Record<InvoiceStatus, string> = {
  paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  overdue: 'bg-red-500/10 text-red-600 dark:text-red-400',
  draft: '',
}

const invoices: Invoice[] = [
  {
    id: 'i1',
    number: 'INV-2026-0142',
    client: 'Acme Corp',
    issued: 'Aug 18, 2026',
    due: 'Sep 1, 2026',
    amount: '$4,800.00',
    status: 'pending',
  },
  {
    id: 'i2',
    number: 'INV-2026-0141',
    client: 'Northwind Traders',
    issued: 'Aug 15, 2026',
    due: 'Aug 30, 2026',
    amount: '$2,350.00',
    status: 'overdue',
  },
  {
    id: 'i3',
    number: 'INV-2026-0140',
    client: 'Globex Industries',
    issued: 'Aug 12, 2026',
    due: 'Sep 10, 2026',
    amount: '$1,200.00',
    status: 'draft',
  },
  {
    id: 'i4',
    number: 'INV-2026-0139',
    client: 'Helios Labs',
    issued: 'Aug 8, 2026',
    due: 'Aug 22, 2026',
    amount: '$6,750.00',
    status: 'paid',
  },
  {
    id: 'i5',
    number: 'INV-2026-0138',
    client: 'Acme Corp',
    issued: 'Aug 5, 2026',
    due: 'Aug 19, 2026',
    amount: '$770.00',
    status: 'paid',
  },
  {
    id: 'i6',
    number: 'INV-2026-0137',
    client: 'Vertex Media',
    issued: 'Jul 30, 2026',
    due: 'Aug 13, 2026',
    amount: '$3,120.00',
    status: 'overdue',
  },
  {
    id: 'i7',
    number: 'INV-2026-0136',
    client: 'Initech Systems',
    issued: 'Jul 24, 2026',
    due: 'Aug 7, 2026',
    amount: '$5,400.00',
    status: 'paid',
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

export function InvoicesList({ className }: { className?: string }) {
  return (
    <div data-slot="invoices-list" className={cn('w-full space-y-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage billing for all of your clients.</p>
        </div>
        <Button>
          <Plus aria-hidden="true" />
          New invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.label} className="shadow-xs">
            <CardContent className="space-y-1">
              <p className="text-muted-foreground text-sm">{item.label}</p>
              <p className={cn('text-2xl font-bold tracking-tight tabular-nums', item.tone)}>{item.value}</p>
              <p className="text-muted-foreground text-xs">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-card overflow-x-auto rounded-lg border shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-xs font-medium">{invoice.number}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs">{initials(invoice.client)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm font-medium">{invoice.client}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{invoice.issued}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{invoice.due}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">{invoice.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={invoice.status === 'draft' ? 'secondary' : undefined}
                    className={cn('capitalize', statusClass[invoice.status])}
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                        <MoreHorizontal aria-hidden="true" />
                        <span className="sr-only">Open actions for {invoice.number}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye aria-hidden="true" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download aria-hidden="true" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled={invoice.status === 'paid' || invoice.status === 'draft'}>
                        <Check aria-hidden="true" />
                        Mark as paid
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Showing {invoices.length} of 42 invoices</p>
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
