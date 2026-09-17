'use client'

import * as React from 'react'
import {
  Building2,
  Car,
  Clock,
  Cloud,
  CreditCard,
  Download,
  Eye,
  FileCheck,
  GitBranch,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Palette,
  Paperclip,
  Plane,
  Plus,
  Receipt,
  RotateCcw,
  Search,
  ShieldAlert,
  TrendingUp,
  Upload,
  Utensils,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type TransactionStatus = 'cleared' | 'pending' | 'receipt_needed'
export type CategoryKey = 'cloud' | 'travel' | 'saas' | 'transport' | 'office' | 'meals'

export interface Cardholder {
  name: string
  avatar: string
  initials: string
  cardLast4: string
  cardType: 'Virtual' | 'Physical'
}

export interface Transaction {
  id: string
  merchant: string
  merchantNote: string
  merchantIcon: React.ElementType
  category: string
  categoryKey: CategoryKey
  cardholder: Cardholder
  date: string
  status: TransactionStatus
  statusLabel: string
  amount: string
  isRefund: boolean
  hasReceipt: boolean
  receiptFileName?: string
}

const categoryStyles: Record<CategoryKey, string> = {
  cloud: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  travel: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  saas: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  transport: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  office: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  meals: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
}

const statusStyles: Record<TransactionStatus, string> = {
  cleared: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  pending: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  receipt_needed: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
}

const statusDots: Record<TransactionStatus, string> = {
  cleared: 'bg-emerald-500',
  pending: 'bg-blue-500',
  receipt_needed: 'bg-amber-500',
}

const transactions: Transaction[] = [
  {
    id: 'tx-01',
    merchant: 'AWS Cloud Services',
    merchantNote: 'Production us-east-1 compute & S3',
    merchantIcon: Cloud,
    category: 'Cloud Hosting',
    categoryKey: 'cloud',
    cardholder: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      initials: 'ER',
      cardLast4: '4892',
      cardType: 'Virtual',
    },
    date: 'Aug 21, 2026 · 14:28',
    status: 'cleared',
    statusLabel: 'Cleared',
    amount: '-$1,420.00',
    isRefund: false,
    hasReceipt: true,
    receiptFileName: 'aws-invoice-aug-2026.pdf',
  },
  {
    id: 'tx-02',
    merchant: 'Delta Air Lines',
    merchantNote: 'SFO → JFK nonstop (Q3 Conf)',
    merchantIcon: Plane,
    category: 'Travel',
    categoryKey: 'travel',
    cardholder: {
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      initials: 'MC',
      cardLast4: '3190',
      cardType: 'Physical',
    },
    date: 'Aug 21, 2026 · 11:15',
    status: 'pending',
    statusLabel: 'Pending',
    amount: '-$849.00',
    isRefund: false,
    hasReceipt: true,
    receiptFileName: 'delta-eticket-dl8932.pdf',
  },
  {
    id: 'tx-03',
    merchant: 'GitHub Enterprise',
    merchantNote: '42 Enterprise team seats',
    merchantIcon: GitBranch,
    category: 'SaaS',
    categoryKey: 'saas',
    cardholder: {
      name: 'Amara Okafor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      initials: 'AO',
      cardLast4: '9455',
      cardType: 'Virtual',
    },
    date: 'Aug 20, 2026 · 09:00',
    status: 'cleared',
    statusLabel: 'Cleared',
    amount: '-$882.00',
    isRefund: false,
    hasReceipt: true,
    receiptFileName: 'github-inv-aug2026.pdf',
  },
  {
    id: 'tx-04',
    merchant: 'Uber for Business',
    merchantNote: 'Client dinner return ride',
    merchantIcon: Car,
    category: 'Transport',
    categoryKey: 'transport',
    cardholder: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      initials: 'SJ',
      cardLast4: '6021',
      cardType: 'Physical',
    },
    date: 'Aug 19, 2026 · 22:45',
    status: 'receipt_needed',
    statusLabel: 'Receipt Needed',
    amount: '-$48.50',
    isRefund: false,
    hasReceipt: false,
  },
  {
    id: 'tx-05',
    merchant: 'Figma Professional',
    merchantNote: 'Design team organization plan',
    merchantIcon: Palette,
    category: 'SaaS',
    categoryKey: 'saas',
    cardholder: {
      name: 'Priya Nair',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      initials: 'PN',
      cardLast4: '7712',
      cardType: 'Virtual',
    },
    date: 'Aug 19, 2026 · 16:30',
    status: 'cleared',
    statusLabel: 'Cleared',
    amount: '-$360.00',
    isRefund: false,
    hasReceipt: true,
    receiptFileName: 'figma-subscription-receipt.pdf',
  },
  {
    id: 'tx-06',
    merchant: 'WeWork Coworking',
    merchantNote: 'NYC satellite team hot desks',
    merchantIcon: Building2,
    category: 'Office',
    categoryKey: 'office',
    cardholder: {
      name: 'Jonas Weber',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      initials: 'JW',
      cardLast4: '1109',
      cardType: 'Physical',
    },
    date: 'Aug 18, 2026 · 10:00',
    status: 'receipt_needed',
    statusLabel: 'Receipt Needed',
    amount: '-$1,250.00',
    isRefund: false,
    hasReceipt: false,
  },
  {
    id: 'tx-07',
    merchant: 'Google Workspace',
    merchantNote: 'Security & suite - 55 users',
    merchantIcon: Mail,
    category: 'SaaS',
    categoryKey: 'saas',
    cardholder: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      initials: 'ER',
      cardLast4: '4892',
      cardType: 'Virtual',
    },
    date: 'Aug 17, 2026 · 08:30',
    status: 'cleared',
    statusLabel: 'Cleared',
    amount: '-$660.00',
    isRefund: false,
    hasReceipt: true,
    receiptFileName: 'google-workspace-statement.pdf',
  },
  {
    id: 'tx-08',
    merchant: 'Slack Pro',
    merchantNote: 'Vendor annual prepay refund adjustment',
    merchantIcon: MessageSquare,
    category: 'SaaS',
    categoryKey: 'saas',
    cardholder: {
      name: 'Amara Okafor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      initials: 'AO',
      cardLast4: '9455',
      cardType: 'Virtual',
    },
    date: 'Aug 16, 2026 · 15:40',
    status: 'cleared',
    statusLabel: 'Cleared',
    amount: '+$5,000.00',
    isRefund: true,
    hasReceipt: true,
    receiptFileName: 'slack-credit-adjustment.pdf',
  },
  {
    id: 'tx-09',
    merchant: 'Sweetgreen Catering',
    merchantNote: 'Quarterly all-hands team lunch',
    merchantIcon: Utensils,
    category: 'Meals',
    categoryKey: 'meals',
    cardholder: {
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      initials: 'MC',
      cardLast4: '3190',
      cardType: 'Physical',
    },
    date: 'Aug 15, 2026 · 12:15',
    status: 'receipt_needed',
    statusLabel: 'Receipt Needed',
    amount: '-$320.00',
    isRefund: false,
    hasReceipt: false,
  },
]

export function TransactionFeed({ className }: { className?: string }) {
  const [search, setSearch] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState('all')
  const [dateRangeFilter, setDateRangeFilter] = React.useState('this_month')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const isFiltered =
    search.trim() !== '' || categoryFilter !== 'all' || dateRangeFilter !== 'this_month' || statusFilter !== 'all'

  const filteredTransactions = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return transactions.filter((tx) => {
      const matchesCategory = categoryFilter === 'all' || tx.categoryKey === categoryFilter
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter
      const matchesQuery =
        !query ||
        tx.merchant.toLowerCase().includes(query) ||
        tx.merchantNote.toLowerCase().includes(query) ||
        tx.category.toLowerCase().includes(query) ||
        tx.cardholder.name.toLowerCase().includes(query) ||
        tx.cardholder.cardLast4.includes(query)

      return matchesCategory && matchesStatus && matchesQuery
    })
  }, [search, categoryFilter, statusFilter])

  const resetFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setDateRangeFilter('this_month')
    setStatusFilter('all')
  }

  return (
    <div data-slot="transaction-feed" className={cn('w-full space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">Transactions</h2>
          <p className="text-muted-foreground text-sm">
            Real-time ledger of card expenses, wire transfers, and subscription charges.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button aria-label="Download attachment" variant="outline" size="sm">
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </Button>
          <Button size="sm">
            <Plus className="size-4" aria-hidden="true" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Total Spent This Month</p>
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <CreditCard className="size-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$42,850.00</p>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="mr-0.5 size-3.5" aria-hidden="true" />
                +8.4%
              </span>
              <span>vs previous month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Pending Approvals</p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Clock className="size-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">6 transactions</p>
            <p className="text-muted-foreground text-xs">$3,410.00 requiring review</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Missing Receipts</p>
              <Badge
                wrap
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-xs text-amber-600 dark:text-amber-400"
              >
                Action required
              </Badge>
            </div>
            <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">3</p>
            <p className="text-muted-foreground text-xs">Total $1,618.50 unverified</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Average Transaction</p>
              <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-lg">
                <Receipt className="size-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$185.20</p>
            <p className="text-muted-foreground text-xs">Across 231 card charges</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-3 shadow-xs md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search transactions..."
              className="h-9 w-full pl-9 text-xs sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-full text-xs sm:w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cloud">Cloud Hosting</SelectItem>
                <SelectItem value="saas">Software & SaaS</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="meals">Meals & Dining</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
              <SelectTrigger className="h-9 w-full text-xs sm:w-36">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_30">Last 30 Days</SelectItem>
                <SelectItem value="last_90">Last 90 Days</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="all_time">All Time</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-full text-xs sm:w-36">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="cleared">Cleared</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="receipt_needed">Receipt Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-9 self-start px-2 text-xs md:self-auto"
            onClick={resetFilters}
          >
            <RotateCcw className="mr-1.5 size-3.5" aria-hidden="true" />
            Reset filters
          </Button>
        )}
      </div>

      {/* Transactions Table */}
      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="min-w-[220px]">Merchant / Note</TableHead>
                <TableHead className="min-w-[130px]">Category</TableHead>
                <TableHead className="min-w-[180px]">Cardholder</TableHead>
                <TableHead className="min-w-[150px]">Date & Time</TableHead>
                <TableHead className="min-w-[130px]">Status</TableHead>
                <TableHead className="min-w-[120px] text-right">Amount</TableHead>
                <TableHead className="min-w-[110px] text-center">Receipt</TableHead>
                <TableHead className="w-12 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => {
                const MerchantIcon = tx.merchantIcon
                return (
                  <TableRow key={tx.id} className="hover:bg-muted/50 transition-colors">
                    {/* Merchant & Note */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="border-border/60 bg-muted/60 text-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-xs">
                          <MerchantIcon className="size-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground truncate text-sm font-medium">{tx.merchant}</p>
                          <p className="text-muted-foreground truncate text-xs">{tx.merchantNote}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category Badge */}
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs font-normal', categoryStyles[tx.categoryKey])}>
                        {tx.category}
                      </Badge>
                    </TableCell>

                    {/* Cardholder */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-7">
                          <AvatarImage src={tx.cardholder.avatar} alt={tx.cardholder.name} />
                          <AvatarFallback className="text-xs">{tx.cardholder.initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-foreground truncate text-xs font-medium">{tx.cardholder.name}</p>
                          <p className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                            <span>••••</span>
                            <span>{tx.cardholder.cardLast4}</span>
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Date & Time */}
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                      {tx.date}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs font-medium capitalize', statusStyles[tx.status])}
                      >
                        <span
                          className={cn('mr-1.5 size-1.5 rounded-full', statusDots[tx.status])}
                          aria-hidden="true"
                        />
                        {tx.statusLabel}
                      </Badge>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="text-right text-sm font-semibold whitespace-nowrap tabular-nums">
                      <span className={tx.isRefund ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}>
                        {tx.amount}
                      </span>
                    </TableCell>

                    {/* Receipt Indicator */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {tx.hasReceipt ? (
                          <span
                            className="text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors"
                            title={tx.receiptFileName || 'View receipt'}
                          >
                            <Paperclip className="text-muted-foreground size-3.5" aria-hidden="true" />
                            <span>Attached</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-500/20 focus-visible:ring-2 focus-visible:outline-none dark:text-amber-400"
                          >
                            <Upload className="size-3" aria-hidden="true" />
                            <span>Upload</span>
                          </button>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions Dropdown */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="size-4" aria-hidden="true" />
                            <span className="sr-only">Open actions for {tx.merchant}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 size-4" aria-hidden="true" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Paperclip className="mr-2 size-4" aria-hidden="true" />
                            {tx.hasReceipt ? 'View Receipt' : 'Attach Receipt'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <FileCheck className="mr-2 size-4" aria-hidden="true" />
                            Match Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                            <ShieldAlert className="mr-2 size-4" aria-hidden="true" />
                            Dispute
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}

              {/* Empty State Row */}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-36 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="text-muted-foreground/50 size-6" aria-hidden="true" />
                      <p className="text-foreground text-sm font-medium">No transactions match your filters</p>
                      <p className="text-muted-foreground text-xs">
                        Try clearing your search query or reset category/status
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 text-xs" onClick={resetFilters}>
                        Reset filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer strip */}
        <div className="border-border bg-card text-muted-foreground flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-xs sm:flex-row">
          <p className="tabular-nums">
            Showing <span className="text-foreground font-medium">{filteredTransactions.length}</span> of{' '}
            <span className="text-foreground font-medium">{transactions.length}</span> transactions
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
