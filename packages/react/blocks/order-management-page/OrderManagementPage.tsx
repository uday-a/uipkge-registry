'use client'

import * as React from 'react'
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
  TrendingUp,
  Truck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type OrderStatus = 'paid' | 'processing' | 'shipped' | 'refunded'

export interface OrderItem {
  name: string
  sku: string
  quantity: number
  price: number
}

export interface CustomerInfo {
  name: string
  email: string
  avatar?: string
  address: string
  city: string
  state: string
  zip: string
}

export interface Order {
  id: string
  orderNumber: string
  date: string
  customer: CustomerInfo
  items: OrderItem[]
  status: OrderStatus
  paymentMethod: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  carrier?: string
  trackingNumber?: string
}

const orders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: '#ORD-8492',
    date: 'Oct 24, 2026',
    customer: {
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zip: '97477',
    },
    items: [
      { name: 'Ergonomic Mechanical Keyboard', sku: 'KB-ERGO-01', quantity: 1, price: 189 },
      { name: 'Desk Mat Pro (Midnight)', sku: 'MAT-PRO-BLK', quantity: 1, price: 39 },
    ],
    status: 'processing',
    paymentMethod: 'Mastercard •••• 8492',
    subtotal: 228,
    shipping: 0,
    tax: 18.24,
    total: 246.24,
    carrier: 'FedEx Priority',
    trackingNumber: 'FX-9281034-US',
  },
  {
    id: 'ord-2',
    orderNumber: '#ORD-8491',
    date: 'Oct 24, 2026',
    customer: {
      name: 'Marcus Vance',
      email: 'marcus.v@acme-corp.com',
      address: '100 Enterprise Way, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
    },
    items: [
      { name: 'UltraWide Monitor 34"', sku: 'MON-34-UW', quantity: 1, price: 699 },
      { name: 'Dual Monitor Arm Mount', sku: 'ACC-ARM-02', quantity: 1, price: 129 },
      { name: 'Braided DisplayPort Cable 2m', sku: 'CAB-DP-02', quantity: 1, price: 24 },
    ],
    status: 'shipped',
    paymentMethod: 'Visa •••• 4242',
    subtotal: 852,
    shipping: 0,
    tax: 68.16,
    total: 920.16,
    carrier: 'UPS Ground',
    trackingNumber: '1Z999AA10123456784',
  },
  {
    id: 'ord-3',
    orderNumber: '#ORD-8490',
    date: 'Oct 23, 2026',
    customer: {
      name: 'Elena Rostova',
      email: 'elena.rostova@techflow.io',
      address: '450 Innovation Parkway',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    },
    items: [{ name: 'SaaS Enterprise Annual License', sku: 'LIC-ENT-YR', quantity: 1, price: 1200 }],
    status: 'paid',
    paymentMethod: 'Visa •••• 9104',
    subtotal: 1200,
    shipping: 0,
    tax: 0,
    total: 1200,
  },
  {
    id: 'ord-4',
    orderNumber: '#ORD-8489',
    date: 'Oct 23, 2026',
    customer: {
      name: 'David Kim',
      email: 'david.kim@designly.co',
      address: '88 King Street West',
      city: 'Seattle',
      state: 'WA',
      zip: '98104',
    },
    items: [
      { name: 'USB-C Multiport Dock Pro', sku: 'HUB-USBC-8P', quantity: 2, price: 79 },
      { name: 'Thunderbolt 4 Braided Cable', sku: 'CAB-TB4-1M', quantity: 2, price: 29 },
    ],
    status: 'shipped',
    paymentMethod: 'Apple Pay',
    subtotal: 216,
    shipping: 0,
    tax: 17.28,
    total: 233.28,
    carrier: 'DHL Express',
    trackingNumber: 'DHL-8492019-EXP',
  },
  {
    id: 'ord-5',
    orderNumber: '#ORD-8488',
    date: 'Oct 22, 2026',
    customer: {
      name: 'Olivia Taylor',
      email: 'olivia.t@summit.ai',
      address: '12 Marina Boulevard',
      city: 'Boston',
      state: 'MA',
      zip: '02210',
    },
    items: [{ name: 'Noise-Cancelling Studio Headphones', sku: 'AUD-NC-700', quantity: 1, price: 349 }],
    status: 'refunded',
    paymentMethod: 'Visa •••• 1128',
    subtotal: 349,
    shipping: 0,
    tax: 27.92,
    total: 376.92,
  },
  {
    id: 'ord-6',
    orderNumber: '#ORD-8487',
    date: 'Oct 22, 2026',
    customer: {
      name: 'Liam Johansson',
      email: 'liam.j@nordic.se',
      address: '240 Queen Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
    },
    items: [
      { name: 'Aluminum Laptop Riser', sku: 'STN-ALUM-SLV', quantity: 1, price: 65 },
      { name: 'Wireless Precision Mouse', sku: 'MOU-WL-01', quantity: 1, price: 99 },
    ],
    status: 'processing',
    paymentMethod: 'Mastercard •••• 5531',
    subtotal: 164,
    shipping: 0,
    tax: 13.12,
    total: 177.12,
    carrier: 'USPS Priority',
    trackingNumber: '9400100000000000000000',
  },
  {
    id: 'ord-7',
    orderNumber: '#ORD-8486',
    date: 'Oct 21, 2026',
    customer: {
      name: 'Aisha Patel',
      email: 'aisha.patel@globalnet.com',
      address: '500 Central Avenue',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
    },
    items: [{ name: 'Cloud Storage Tier 3 (500GB)', sku: 'SRV-STR-500', quantity: 1, price: 450 }],
    status: 'paid',
    paymentMethod: 'Amex •••• 3009',
    subtotal: 450,
    shipping: 0,
    tax: 36,
    total: 486,
  },
  {
    id: 'ord-8',
    orderNumber: '#ORD-8485',
    date: 'Oct 20, 2026',
    customer: {
      name: 'Lucas Moreau',
      email: 'lucas.m@atelier.fr',
      address: '15 Rue de la Paix',
      city: 'Boulder',
      state: 'CO',
      zip: '80302',
    },
    items: [
      { name: 'Broadcast Studio Microphone', sku: 'MIC-POD-01', quantity: 1, price: 229 },
      { name: 'Dual-Layer Pop Filter', sku: 'ACC-POP-01', quantity: 1, price: 25 },
      { name: 'Gold-Plated XLR Cable 3m', sku: 'CAB-XLR-03', quantity: 1, price: 19 },
    ],
    status: 'shipped',
    paymentMethod: 'Visa •••• 7712',
    subtotal: 273,
    shipping: 0,
    tax: 21.84,
    total: 294.84,
    carrier: 'FedEx Ground',
    trackingNumber: 'FX-7712093-US',
  },
]

const statusBadgeConfig: Record<OrderStatus, { label: string; class: string; dot: string }> = {
  paid: {
    label: 'Paid',
    class: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  processing: {
    label: 'Processing',
    class: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    dot: 'bg-blue-500',
  },
  shipped: {
    label: 'Shipped',
    class: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    dot: 'bg-purple-500',
  },
  refunded: {
    label: 'Refunded',
    class: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
    dot: 'bg-red-500',
  },
}

function formatCurrency(val: number) {
  return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function OrderManagementPage({ className }: { className?: string }) {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | OrderStatus>('all')
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const filteredOrders = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      const matchesQuery =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query)
      return matchesStatus && matchesQuery
    })
  }, [search, statusFilter])

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      paid: 0,
      processing: 0,
      shipped: 0,
      refunded: 0,
    }
    for (const ord of orders) {
      counts[ord.status] = (counts[ord.status] || 0) + 1
    }
    return counts
  }, [])

  const statusOptions = [
    { value: 'all' as const, label: 'All', count: statusCounts.all },
    { value: 'paid' as const, label: 'Paid', count: statusCounts.paid },
    { value: 'processing' as const, label: 'Processing', count: statusCounts.processing },
    { value: 'shipped' as const, label: 'Shipped', count: statusCounts.shipped },
    { value: 'refunded' as const, label: 'Refunded', count: statusCounts.refunded },
  ]

  const allSelected = filteredOrders.length > 0 && filteredOrders.every((ord) => selected.has(ord.id))
  const someSelected = filteredOrders.some((ord) => selected.has(ord.id))

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(filteredOrders.map((ord) => ord.id)) : new Set())
  }

  const toggleRow = (id: string, checked: boolean) => {
    const next = new Set(selected)
    if (checked) next.add(id)
    else next.delete(id)
    setSelected(next)
  }

  const clearSelection = () => setSelected(new Set())
  const exportSelected = () => clearSelection()
  const markSelectedShipped = () => clearSelection()

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setDrawerOpen(true)
  }

  return (
    <div data-slot="order-management-page" className={cn('w-full space-y-6', className)}>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage and track customer purchases</p>
        </div>
        <div className="flex items-center gap-2">
          <Button aria-label="Download attachment" variant="outline" size="sm" className="text-xs">
            <Download className="mr-1.5 size-3.5" aria-hidden="true" />
            Export CSV
          </Button>
          <Button size="sm" className="text-xs">
            <Plus className="mr-1.5 size-3.5" aria-hidden="true" />
            New Order
          </Button>
        </div>
      </div>

      {/* 4 Stat/KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Total Orders</p>
              <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
                <ShoppingCart className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">1,429</span>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-3.5" aria-hidden="true" />
                +8.2%
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">vs. previous 30 days</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Pending Fulfillment</p>
              <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">28</span>
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                12 urgent
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">Requires warehouse dispatch</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Processing</p>
              <div className="flex size-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <PackageCheck className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">45</span>
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                In queue
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">Packaging & label generation</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Total Revenue</p>
              <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
                <DollarSign className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$128,450</span>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                +14.5%
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">vs. previous period</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID, customer..."
              className="h-9 pl-9 text-xs"
            />
          </div>

          <div className="bg-muted/60 flex items-center gap-1 rounded-lg border p-1">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                type="button"
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  statusFilter === status.value
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setStatusFilter(status.value)}
              >
                {status.label}
                {status.count !== undefined && (
                  <span
                    className={cn(
                      'ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-normal tabular-nums',
                      statusFilter === status.value ? 'bg-muted text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {status.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs font-normal">
            <Calendar className="text-muted-foreground mr-1.5 size-3.5" aria-hidden="true" />
            Last 30 days
            <ChevronDown className="text-muted-foreground ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div className="bg-muted/50 flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-2.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full text-xs font-medium">
              {selected.size}
            </span>
            <span className="text-foreground text-sm font-medium">
              {selected.size} {selected.size === 1 ? 'order' : 'orders'} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Download attachment"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={exportSelected}
            >
              <Download className="mr-1.5 size-3.5" aria-hidden="true" />
              Export selected
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={markSelectedShipped}>
              <Truck className="mr-1.5 size-3.5" aria-hidden="true" />
              Mark as shipped
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive text-xs"
              onClick={clearSelection}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-card overflow-x-auto rounded-lg border shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  aria-label="Select all orders"
                  onCheckedChange={(checked) => toggleAll(checked === true)}
                />
              </TableHead>
              <TableHead className="min-w-[110px]">Order ID</TableHead>
              <TableHead className="min-w-[100px]">Date</TableHead>
              <TableHead className="min-w-[200px]">Customer</TableHead>
              <TableHead className="min-w-[220px]">Items</TableHead>
              <TableHead className="min-w-[90px] text-right">Total</TableHead>
              <TableHead className="min-w-[120px]">Fulfillment</TableHead>
              <TableHead className="w-10 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                className="group hover:bg-muted/40 cursor-pointer transition-colors"
                onClick={() => openOrderDetails(order)}
              >
                <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.has(order.id)}
                    aria-label={`Select order ${order.orderNumber}`}
                    onCheckedChange={(checked) => toggleRow(order.id, checked === true)}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-foreground font-mono text-xs font-semibold hover:underline">
                    {order.orderNumber}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs tabular-nums">{order.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs font-medium">{initials(order.customer.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-medium">{order.customer.name}</p>
                      <p className="text-muted-foreground truncate text-xs">{order.customer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <span className="text-foreground font-medium">
                      {order.items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                      {order.items.reduce((acc, item) => acc + item.quantity, 0) === 1 ? 'item' : 'items'}
                    </span>
                    <span className="text-muted-foreground ml-1.5 inline-block max-w-[180px] truncate align-bottom">
                      • {order.items[0]?.name}
                      {order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-foreground text-right font-mono text-xs font-semibold tabular-nums">
                  ${formatCurrency(order.total)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'gap-1.5 px-2 py-0.5 text-xs font-medium capitalize',
                      statusBadgeConfig[order.status].class,
                    )}
                  >
                    <span
                      className={cn('size-1.5 rounded-full', statusBadgeConfig[order.status].dot)}
                      aria-hidden="true"
                    />
                    {statusBadgeConfig[order.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                        <span className="sr-only">Actions for {order.orderNumber}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Order actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openOrderDetails(order)}>
                        <Eye className="mr-2 size-4" aria-hidden="true" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 size-4" aria-hidden="true" />
                        Download invoice
                      </DropdownMenuItem>
                      {order.status === 'processing' && (
                        <DropdownMenuItem>
                          <Truck className="mr-2 size-4" aria-hidden="true" />
                          Mark as shipped
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {order.status !== 'refunded' && (
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <RotateCcw className="mr-2 size-4" aria-hidden="true" />
                          Issue refund
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-muted-foreground h-32 text-center text-sm">
                  No orders match your filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted-foreground text-xs tabular-nums">Showing 1-{filteredOrders.length} of 1,429 orders</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Next
          </Button>
        </div>
      </div>

      {/* Quick Details Drawer / Sheet */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
          {selectedOrder && (
            <div className="flex h-full flex-col">
              {/* Sheet Header */}
              <SheetHeader className="space-y-1 border-b px-6 py-5">
                <div className="flex items-center justify-between pr-6">
                  <span className="text-foreground font-mono text-base font-bold">{selectedOrder.orderNumber}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'gap-1.5 px-2.5 py-0.5 text-xs font-medium capitalize',
                      statusBadgeConfig[selectedOrder.status].class,
                    )}
                  >
                    <span
                      className={cn('size-1.5 rounded-full', statusBadgeConfig[selectedOrder.status].dot)}
                      aria-hidden="true"
                    />
                    {statusBadgeConfig[selectedOrder.status].label}
                  </Badge>
                </div>
                <SheetTitle className="text-muted-foreground text-xs font-normal">
                  Placed on {selectedOrder.date}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Detailed view of order {selectedOrder.orderNumber}
                </SheetDescription>
              </SheetHeader>

              {/* Sheet Body */}
              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5 text-sm">
                {/* Customer & Shipping */}
                <div className="bg-muted/20 space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Customer & Shipping
                    </h4>
                    <span className="text-muted-foreground font-mono text-xs">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="text-xs font-semibold">
                        {initials(selectedOrder.customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-foreground font-medium">{selectedOrder.customer.name}</p>
                      <p className="text-muted-foreground text-xs">{selectedOrder.customer.email}</p>
                    </div>
                  </div>
                  <div className="text-muted-foreground border-t pt-2.5 text-xs">
                    <p className="text-foreground font-medium">Delivery address:</p>
                    <p>{selectedOrder.customer.address}</p>
                    <p>
                      {selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.zip}
                    </p>
                  </div>
                </div>

                {/* Fulfillment & Tracking if available */}
                {selectedOrder.carrier && selectedOrder.trackingNumber && (
                  <div className="border-border bg-card space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Fulfillment
                      </span>
                      <Badge variant="secondary" className="text-xs font-normal">
                        In Transit
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-muted-foreground">Carrier:</span>
                      <span className="text-foreground font-medium">{selectedOrder.carrier}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Tracking ID:</span>
                      <span className="text-foreground font-mono font-medium">{selectedOrder.trackingNumber}</span>
                    </div>
                  </div>
                )}

                {/* Line Items */}
                <div className="space-y-3">
                  <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Line Items</h4>
                  <div className="divide-border bg-card divide-y rounded-lg border">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 p-3.5">
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-sm font-medium">{item.name}</p>
                          <p className="text-muted-foreground font-mono text-xs">
                            SKU: {item.sku} • Qty: {item.quantity} × ${formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="text-foreground font-mono text-xs font-semibold tabular-nums">
                          ${formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-card space-y-2 rounded-lg border p-4 text-xs">
                  <div className="text-muted-foreground flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-foreground font-mono tabular-nums">
                      ${formatCurrency(selectedOrder.subtotal)}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="text-foreground font-mono tabular-nums">
                      {selectedOrder.shipping === 0 ? 'Free' : `$${formatCurrency(selectedOrder.shipping)}`}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Tax</span>
                    <span className="text-foreground font-mono tabular-nums">${formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="text-foreground flex justify-between border-t pt-2 text-sm font-medium">
                    <span>Total</span>
                    <span className="text-foreground font-mono font-bold tabular-nums">
                      ${formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sheet Footer */}
              <SheetFooter className="bg-muted/10 flex flex-row items-center justify-between gap-2 border-t px-6 py-4">
                <Button aria-label="Download attachment" variant="outline" size="sm" className="text-xs">
                  <Download className="mr-1.5 size-3.5" aria-hidden="true" />
                  Invoice PDF
                </Button>
                <SheetClose asChild>
                  <Button variant="secondary" size="sm" className="text-xs">
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
