<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
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
} from 'lucide-vue-next'
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

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const search = ref('')
const statusFilter = ref<'all' | OrderStatus>('all')
const selected = ref<Set<string>>(new Set())
const selectedOrder = ref<Order | null>(null)
const drawerOpen = ref(false)

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

const filteredOrders = computed(() => {
  const query = search.value.trim().toLowerCase()
  return orders.filter((order) => {
    const matchesStatus = statusFilter.value === 'all' || order.status === statusFilter.value
    const matchesQuery =
      !query ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query) ||
      order.customer.email.toLowerCase().includes(query)
    return matchesStatus && matchesQuery
  })
})

const statusCounts = computed(() => {
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
})

const statusOptions = computed(() => [
  { value: 'all', label: 'All', count: statusCounts.value.all },
  { value: 'paid', label: 'Paid', count: statusCounts.value.paid },
  { value: 'processing', label: 'Processing', count: statusCounts.value.processing },
  { value: 'shipped', label: 'Shipped', count: statusCounts.value.shipped },
  { value: 'refunded', label: 'Refunded', count: statusCounts.value.refunded },
])

const allSelected = computed(
  () => filteredOrders.value.length > 0 && filteredOrders.value.every((ord) => selected.value.has(ord.id)),
)
const someSelected = computed(() => filteredOrders.value.some((ord) => selected.value.has(ord.id)))

function toggleAll(checked: boolean) {
  selected.value = checked ? new Set(filteredOrders.value.map((ord) => ord.id)) : new Set()
}

function toggleRow(id: string, checked: boolean) {
  const next = new Set(selected.value)
  if (checked) next.add(id)
  else next.delete(id)
  selected.value = next
}

function clearSelection() {
  selected.value = new Set()
}

function exportSelected() {
  clearSelection()
}

function markSelectedShipped() {
  clearSelection()
}

function openOrderDetails(order: Order) {
  selectedOrder.value = order
  drawerOpen.value = true
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
</script>

<template>
  <div data-slot="order-management-page" :class="cn('w-full space-y-6', props.class)">
    <!-- Page Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-foreground text-2xl font-bold tracking-tight">Orders</h2>
        <p class="text-muted-foreground mt-1 text-sm">Manage and track customer purchases</p>
      </div>
      <div class="flex items-center gap-2">
        <Button aria-label="Download attachment" variant="outline" size="sm" class="text-xs">
          <Download class="mr-1.5 size-3.5" aria-hidden="true" />
          Export CSV
        </Button>
        <Button size="sm" class="text-xs">
          <Plus class="mr-1.5 size-3.5" aria-hidden="true" />
          New Order
        </Button>
      </div>
    </div>

    <!-- 4 Stat/KPI Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card class="shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Total Orders</p>
            <div class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
              <ShoppingCart class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">1,429</span>
            <span class="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp class="size-3.5" aria-hidden="true" />
              +8.2%
            </span>
          </div>
          <p class="text-muted-foreground mt-1 text-xs">vs. previous 30 days</p>
        </CardContent>
      </Card>

      <Card class="shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Pending Fulfillment</p>
            <div
              class="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <Clock class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">28</span>
            <span
              class="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400"
            >
              12 urgent
            </span>
          </div>
          <p class="text-muted-foreground mt-1 text-xs">Requires warehouse dispatch</p>
        </CardContent>
      </Card>

      <Card class="shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Processing</p>
            <div
              class="flex size-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400"
            >
              <PackageCheck class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">45</span>
            <span
              class="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400"
            >
              In queue
            </span>
          </div>
          <p class="text-muted-foreground mt-1 text-xs">Packaging & label generation</p>
        </CardContent>
      </Card>

      <Card class="shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Total Revenue</p>
            <div class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
              <DollarSign class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$128,450</span>
            <span class="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight class="size-3.5" aria-hidden="true" />
              +14.5%
            </span>
          </div>
          <p class="text-muted-foreground mt-1 text-xs">vs. previous period</p>
        </CardContent>
      </Card>
    </div>

    <!-- Search and Filter Toolbar -->
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <div class="relative min-w-[240px] flex-1 sm:max-w-xs">
          <Search
            class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input v-model="search" placeholder="Search order ID, customer..." class="h-9 pl-9 text-xs" />
        </div>

        <div class="bg-muted/60 flex items-center gap-1 rounded-lg border p-1">
          <button
            v-for="status in statusOptions"
            :key="status.value"
            type="button"
            :class="
              cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                statusFilter === status.value
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )
            "
            @click="statusFilter = status.value as any"
          >
            {{ status.label }}
            <span
              v-if="status.count !== undefined"
              :class="
                cn(
                  'ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-normal tabular-nums',
                  statusFilter === status.value ? 'bg-muted text-foreground' : 'text-muted-foreground',
                )
              "
            >
              {{ status.count }}
            </span>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="text-xs font-normal">
          <Calendar class="text-muted-foreground mr-1.5 size-3.5" aria-hidden="true" />
          Last 30 days
          <ChevronDown class="text-muted-foreground ml-1.5 size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>

    <!-- Bulk Action Bar -->
    <div
      v-if="selected.size > 0"
      class="bg-muted/50 flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-2.5 shadow-xs"
    >
      <div class="flex items-center gap-2">
        <span
          class="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full text-xs font-medium"
        >
          {{ selected.size }}
        </span>
        <span class="text-foreground text-sm font-medium">
          {{ selected.size }} {{ selected.size === 1 ? 'order' : 'orders' }} selected
        </span>
      </div>
      <div class="flex items-center gap-2">
        <Button aria-label="Download attachment" variant="outline" size="sm" class="text-xs" @click="exportSelected">
          <Download class="mr-1.5 size-3.5" aria-hidden="true" />
          Export selected
        </Button>
        <Button variant="outline" size="sm" class="text-xs" @click="markSelectedShipped">
          <Truck class="mr-1.5 size-3.5" aria-hidden="true" />
          Mark as shipped
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="text-destructive hover:text-destructive text-xs"
          @click="clearSelection"
        >
          Cancel
        </Button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-card overflow-x-auto rounded-lg border shadow-xs">
      <Table>
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead class="w-10">
              <Checkbox
                :model-value="allSelected ? true : someSelected ? 'indeterminate' : false"
                aria-label="Select all orders"
                @update:model-value="toggleAll($event === true)"
              />
            </TableHead>
            <TableHead class="min-w-[110px]">Order ID</TableHead>
            <TableHead class="min-w-[100px]">Date</TableHead>
            <TableHead class="min-w-[200px]">Customer</TableHead>
            <TableHead class="min-w-[220px]">Items</TableHead>
            <TableHead class="min-w-[90px] text-right">Total</TableHead>
            <TableHead class="min-w-[120px]">Fulfillment</TableHead>
            <TableHead class="w-10 text-right"><span class="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="order in filteredOrders"
            :key="order.id"
            class="group hover:bg-muted/40 cursor-pointer transition-colors"
            @click="openOrderDetails(order)"
          >
            <TableCell class="w-10" @click.stop>
              <Checkbox
                :model-value="selected.has(order.id)"
                :aria-label="`Select order ${order.orderNumber}`"
                @update:model-value="toggleRow(order.id, $event === true)"
              />
            </TableCell>
            <TableCell>
              <span class="text-foreground font-mono text-xs font-semibold hover:underline">
                {{ order.orderNumber }}
              </span>
            </TableCell>
            <TableCell class="text-muted-foreground text-xs tabular-nums">
              {{ order.date }}
            </TableCell>
            <TableCell>
              <div class="flex items-center gap-2.5">
                <Avatar class="size-7">
                  <AvatarFallback class="text-xs font-medium">{{ initials(order.customer.name) }}</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <p class="text-foreground truncate text-sm font-medium">{{ order.customer.name }}</p>
                  <p class="text-muted-foreground truncate text-xs">{{ order.customer.email }}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div class="text-xs">
                <span class="text-foreground font-medium">
                  {{ order.items.reduce((acc, item) => acc + item.quantity, 0) }}
                  {{ order.items.reduce((acc, item) => acc + item.quantity, 0) === 1 ? 'item' : 'items' }}
                </span>
                <span class="text-muted-foreground ml-1.5 inline-block max-w-[180px] truncate align-bottom">
                  • {{ order.items[0]?.name }}{{ order.items.length > 1 ? ` +${order.items.length - 1} more` : '' }}
                </span>
              </div>
            </TableCell>
            <TableCell class="text-foreground text-right font-mono text-xs font-semibold tabular-nums">
              ${{ formatCurrency(order.total) }}
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                :class="cn('gap-1.5 px-2 py-0.5 text-xs font-medium capitalize', statusBadgeConfig[order.status].class)"
              >
                <span :class="cn('size-1.5 rounded-full', statusBadgeConfig[order.status].dot)" aria-hidden="true" />
                {{ statusBadgeConfig[order.status].label }}
              </Badge>
            </TableCell>
            <TableCell class="text-right" @click.stop>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon-sm" class="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal class="size-4" aria-hidden="true" />
                    <span class="sr-only">Actions for {{ order.orderNumber }}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48">
                  <DropdownMenuLabel>Order actions</DropdownMenuLabel>
                  <DropdownMenuItem @click="openOrderDetails(order)">
                    <Eye class="mr-2 size-4" aria-hidden="true" />
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText class="mr-2 size-4" aria-hidden="true" />
                    Download invoice
                  </DropdownMenuItem>
                  <DropdownMenuItem v-if="order.status === 'processing'">
                    <Truck class="mr-2 size-4" aria-hidden="true" />
                    Mark as shipped
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem v-if="order.status !== 'refunded'" class="text-destructive focus:text-destructive">
                    <RotateCcw class="mr-2 size-4" aria-hidden="true" />
                    Issue refund
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          <TableRow v-if="filteredOrders.length === 0">
            <TableCell colspan="8" class="text-muted-foreground h-32 text-center text-sm">
              No orders match your filter criteria.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination Footer -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <p class="text-muted-foreground text-xs tabular-nums">Showing 1-{{ filteredOrders.length }} of 1,429 orders</p>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="text-xs" disabled> Previous </Button>
        <Button variant="outline" size="sm" class="text-xs"> Next </Button>
      </div>
    </div>

    <!-- Quick Details Drawer / Sheet -->
    <Sheet :open="drawerOpen" @update:open="drawerOpen = $event">
      <SheetContent side="right" class="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <div v-if="selectedOrder" class="flex h-full flex-col">
          <!-- Sheet Header -->
          <SheetHeader class="space-y-1 border-b px-6 py-5">
            <div class="flex items-center justify-between pr-6">
              <span class="text-foreground font-mono text-base font-bold">{{ selectedOrder.orderNumber }}</span>
              <Badge
                variant="outline"
                :class="
                  cn(
                    'gap-1.5 px-2.5 py-0.5 text-xs font-medium capitalize',
                    statusBadgeConfig[selectedOrder.status].class,
                  )
                "
              >
                <span
                  :class="cn('size-1.5 rounded-full', statusBadgeConfig[selectedOrder.status].dot)"
                  aria-hidden="true"
                />
                {{ statusBadgeConfig[selectedOrder.status].label }}
              </Badge>
            </div>
            <SheetTitle class="text-muted-foreground text-xs font-normal">
              Placed on {{ selectedOrder.date }}
            </SheetTitle>
            <SheetDescription class="sr-only">Detailed view of order {{ selectedOrder.orderNumber }}</SheetDescription>
          </SheetHeader>

          <!-- Sheet Body -->
          <div class="flex-1 space-y-6 overflow-y-auto px-6 py-5 text-sm">
            <!-- Customer & Shipping -->
            <div class="bg-muted/20 space-y-3 rounded-lg border p-4">
              <div class="flex items-center justify-between">
                <h4 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Customer & Shipping
                </h4>
                <span class="text-muted-foreground font-mono text-xs">{{ selectedOrder.paymentMethod }}</span>
              </div>
              <div class="flex items-center gap-3">
                <Avatar class="size-9">
                  <AvatarFallback class="text-xs font-semibold">
                    {{ initials(selectedOrder.customer.name) }}
                  </AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <p class="text-foreground font-medium">{{ selectedOrder.customer.name }}</p>
                  <p class="text-muted-foreground text-xs">{{ selectedOrder.customer.email }}</p>
                </div>
              </div>
              <div class="text-muted-foreground border-t pt-2.5 text-xs">
                <p class="text-foreground font-medium">Delivery address:</p>
                <p>{{ selectedOrder.customer.address }}</p>
                <p>
                  {{ selectedOrder.customer.city }}, {{ selectedOrder.customer.state }} {{ selectedOrder.customer.zip }}
                </p>
              </div>
            </div>

            <!-- Fulfillment & Tracking if available -->
            <div
              v-if="selectedOrder.carrier && selectedOrder.trackingNumber"
              class="border-border bg-card space-y-2 rounded-lg border p-4"
            >
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Fulfillment</span>
                <Badge variant="secondary" class="text-xs font-normal">In Transit</Badge>
              </div>
              <div class="flex items-center justify-between pt-1 text-xs">
                <span class="text-muted-foreground">Carrier:</span>
                <span class="text-foreground font-medium">{{ selectedOrder.carrier }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Tracking ID:</span>
                <span class="text-foreground font-mono font-medium">{{ selectedOrder.trackingNumber }}</span>
              </div>
            </div>

            <!-- Line Items -->
            <div class="space-y-3">
              <h4 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Line Items</h4>
              <div class="divide-border bg-card divide-y rounded-lg border">
                <div
                  v-for="(item, idx) in selectedOrder.items"
                  :key="idx"
                  class="flex items-center justify-between gap-3 p-3.5"
                >
                  <div class="min-w-0 flex-1">
                    <p class="text-foreground truncate text-sm font-medium">{{ item.name }}</p>
                    <p class="text-muted-foreground font-mono text-xs">
                      SKU: {{ item.sku }} • Qty: {{ item.quantity }} × ${{ formatCurrency(item.price) }}
                    </p>
                  </div>
                  <div class="text-foreground font-mono text-xs font-semibold tabular-nums">
                    ${{ formatCurrency(item.price * item.quantity) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Cost Breakdown -->
            <div class="bg-card space-y-2 rounded-lg border p-4 text-xs">
              <div class="text-muted-foreground flex justify-between">
                <span>Subtotal</span>
                <span class="text-foreground font-mono tabular-nums"
                  >${{ formatCurrency(selectedOrder.subtotal) }}</span
                >
              </div>
              <div class="text-muted-foreground flex justify-between">
                <span>Estimated Shipping</span>
                <span class="text-foreground font-mono tabular-nums">
                  {{ selectedOrder.shipping === 0 ? 'Free' : `$${formatCurrency(selectedOrder.shipping)}` }}
                </span>
              </div>
              <div class="text-muted-foreground flex justify-between">
                <span>Tax</span>
                <span class="text-foreground font-mono tabular-nums">${{ formatCurrency(selectedOrder.tax) }}</span>
              </div>
              <div class="text-foreground flex justify-between border-t pt-2 text-sm font-medium">
                <span>Total</span>
                <span class="text-foreground font-mono font-bold tabular-nums">
                  ${{ formatCurrency(selectedOrder.total) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Sheet Footer -->
          <SheetFooter class="bg-muted/10 flex flex-row items-center justify-between gap-2 border-t px-6 py-4">
            <Button aria-label="Download attachment" variant="outline" size="sm" class="text-xs">
              <Download class="mr-1.5 size-3.5" aria-hidden="true" />
              Invoice PDF
            </Button>
            <SheetClose as-child>
              <Button variant="secondary" size="sm" class="text-xs">Close</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
