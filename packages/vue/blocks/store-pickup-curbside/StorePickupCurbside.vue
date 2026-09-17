<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  Bell,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Navigation,
  Package,
  PackageCheck,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Store,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type PickupMode = 'curbside' | 'in_store'
export type OrderStatus = 'arrived' | 'en_route' | 'ready_staging' | 'completed'

export interface OrderItem {
  id: string
  name: string
  sku: string
  quantity: number
  price: number
  staged: boolean
  category: string
}

export interface PickupOrder {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerInitials: string
  avatar?: string
  pickupMode: PickupMode
  spotNumber?: number
  vehicleDetails?: {
    makeModel: string
    plate: string
    hazardsFlashing?: boolean
  }
  pickupDeskBay?: string
  status: OrderStatus
  statusLabel: string
  etaMinutes?: number
  distanceMiles?: number
  waitMinutes?: number
  stagingLocation: {
    zone: string
    bin: string
    lockerPin?: string
    type: 'shelf' | 'locker' | 'bulky'
  }
  items: OrderItem[]
  orderTotal: number
  placedAt: string
  readyAt: string
  arrivedAt?: string
  verificationCode: string
  assignedRunner?: string
}

interface Props {
  storeName?: string
  storeCode?: string
  initialModeFilter?: 'all' | 'curbside' | 'in_store'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  storeName: 'Pasadena Flagship Store #02',
  storeCode: 'STORE-CA-02',
  initialModeFilter: 'all',
})

const INITIAL_ORDERS: PickupOrder[] = [
  {
    id: 'order-1',
    orderNumber: 'BOPIS-84920',
    customerName: 'Elena Rostova',
    customerPhone: '(415) 555-0192',
    customerInitials: 'ER',
    pickupMode: 'curbside',
    spotNumber: 4,
    vehicleDetails: {
      makeModel: 'Silver Tesla Model 3',
      plate: '7XYZ892',
      hazardsFlashing: true,
    },
    status: 'arrived',
    statusLabel: 'Customer Arrived · Waiting 2m',
    waitMinutes: 2,
    stagingLocation: {
      zone: 'Aisle 02',
      bin: 'Bin B-14',
      type: 'shelf',
    },
    items: [
      {
        id: 'item-1',
        name: 'Studio Pro Wireless Headphones',
        sku: 'AUD-902-BLK',
        quantity: 1,
        price: 249.0,
        staged: true,
        category: 'Audio',
      },
      {
        id: 'item-2',
        name: 'Carbon Runner Wind Jacket',
        sku: 'APP-410-MED',
        quantity: 1,
        price: 100.0,
        staged: true,
        category: 'Apparel',
      },
    ],
    orderTotal: 349.0,
    placedAt: '11:20 AM',
    readyAt: '11:35 AM',
    arrivedAt: '11:42 AM',
    verificationCode: '4920',
    assignedRunner: 'Jordan Miller',
  },
  {
    id: 'order-2',
    orderNumber: 'BOPIS-84919',
    customerName: 'David Chen',
    customerPhone: '(415) 555-0841',
    customerInitials: 'DC',
    pickupMode: 'curbside',
    spotNumber: 2,
    vehicleDetails: {
      makeModel: 'Midnight Blue Rivian R1T',
      plate: '8ABC104',
      hazardsFlashing: true,
    },
    status: 'arrived',
    statusLabel: 'Customer Arrived · Waiting 4m',
    waitMinutes: 4,
    stagingLocation: {
      zone: 'Aisle 01',
      bin: 'Bin A-08',
      type: 'bulky',
    },
    items: [
      {
        id: 'item-3',
        name: '4K Ultra HD Smart Monitor 27"',
        sku: 'DIS-270-4K',
        quantity: 1,
        price: 380.0,
        staged: true,
        category: 'Displays',
      },
      {
        id: 'item-4',
        name: 'Ergonomic Desk Stand',
        sku: 'ACC-110-SLV',
        quantity: 1,
        price: 110.0,
        staged: true,
        category: 'Accessories',
      },
      {
        id: 'item-5',
        name: '100W USB-C Thunderbolt Dock',
        sku: 'DOK-090-BLK',
        quantity: 1,
        price: 90.0,
        staged: true,
        category: 'Power',
      },
    ],
    orderTotal: 580.0,
    placedAt: '10:45 AM',
    readyAt: '11:10 AM',
    arrivedAt: '11:40 AM',
    verificationCode: '8419',
    assignedRunner: 'Marcus Lee',
  },
  {
    id: 'order-3',
    orderNumber: 'BOPIS-84918',
    customerName: 'Marcus Vance',
    customerPhone: '(415) 555-0329',
    customerInitials: 'MV',
    pickupMode: 'in_store',
    pickupDeskBay: 'Pickup Desk Bay 01',
    status: 'en_route',
    statusLabel: 'En Route · 6 min ETA',
    etaMinutes: 6,
    distanceMiles: 1.4,
    stagingLocation: {
      zone: 'Locker #12',
      bin: 'Bin L-12',
      lockerPin: '8491',
      type: 'locker',
    },
    items: [
      {
        id: 'item-6',
        name: 'Pro Max Mirrorless Camera Kit',
        sku: 'CAM-800-PRO',
        quantity: 1,
        price: 1299.0,
        staged: true,
        category: 'Photography',
      },
    ],
    orderTotal: 1299.0,
    placedAt: '11:05 AM',
    readyAt: '11:28 AM',
    verificationCode: '9182',
    assignedRunner: 'Staging Auto-Lock',
  },
  {
    id: 'order-4',
    orderNumber: 'BOPIS-84917',
    customerName: 'Aisha Patel',
    customerPhone: '(415) 555-0782',
    customerInitials: 'AP',
    pickupMode: 'in_store',
    pickupDeskBay: 'Pickup Desk Bay 03',
    status: 'ready_staging',
    statusLabel: 'Ready in Staging Locker #04',
    stagingLocation: {
      zone: 'Aisle 03',
      bin: 'Bin C-02',
      lockerPin: '3719',
      type: 'locker',
    },
    items: [
      {
        id: 'item-7',
        name: 'Organic Single-Origin Espresso Blend',
        sku: 'COF-012-ESP',
        quantity: 2,
        price: 38.0,
        staged: true,
        category: 'Beverage',
      },
      {
        id: 'item-8',
        name: 'Precision Gooseneck Pour-Over Kettle',
        sku: 'KET-044-SS',
        quantity: 1,
        price: 74.5,
        staged: true,
        category: 'Kitchen',
      },
      {
        id: 'item-9',
        name: 'Digital Barista Gram Scale',
        sku: 'SCL-019-DIG',
        quantity: 1,
        price: 30.0,
        staged: true,
        category: 'Kitchen',
      },
    ],
    orderTotal: 142.5,
    placedAt: '10:15 AM',
    readyAt: '10:50 AM',
    verificationCode: '1742',
    assignedRunner: 'Desk Associate',
  },
  {
    id: 'order-5',
    orderNumber: 'BOPIS-84916',
    customerName: 'Sarah Jenkins',
    customerPhone: '(415) 555-0453',
    customerInitials: 'SJ',
    pickupMode: 'curbside',
    spotNumber: 1,
    vehicleDetails: {
      makeModel: 'White Toyota RAV4',
      plate: '6MNO451',
      hazardsFlashing: false,
    },
    status: 'en_route',
    statusLabel: 'En Route · 12 min ETA',
    etaMinutes: 12,
    distanceMiles: 3.8,
    stagingLocation: {
      zone: 'Aisle 02',
      bin: 'Bin B-03',
      type: 'shelf',
    },
    items: [
      {
        id: 'item-10',
        name: 'Ultra Hydration 20L Trail Backpack',
        sku: 'OUT-220-BLU',
        quantity: 1,
        price: 130.0,
        staged: true,
        category: 'Outdoors',
      },
      {
        id: 'item-11',
        name: 'Carbon Composite Trekking Poles (Pair)',
        sku: 'OUT-771-CAR',
        quantity: 1,
        price: 80.0,
        staged: true,
        category: 'Outdoors',
      },
    ],
    orderTotal: 210.0,
    placedAt: '11:15 AM',
    readyAt: '11:38 AM',
    verificationCode: '9160',
    assignedRunner: 'Unassigned',
  },
]

// State
const orders = ref<PickupOrder[]>(INITIAL_ORDERS)
const searchQuery = ref('')
const selectedModeFilter = ref<'all' | 'curbside' | 'in_store'>(props.initialModeFilter)
const selectedStatusFilter = ref<'all' | 'arrived' | 'en_route' | 'ready_staging' | 'completed'>('all')
const lastRefreshed = ref('Just now')
const isLiveSyncing = ref(true)

// Modals State
const checkInModalOpen = ref(false)
const inspectModalOpen = ref(false)
const notifyModalOpen = ref(false)
const newOrderModalOpen = ref(false)
const selectedOrder = ref<PickupOrder | null>(null)
const notifyChannel = ref<'sms' | 'push'>('sms')
const notifyMessageSent = ref(false)
const actionFeedbackToast = ref<string | null>(null)

// Check-in Form State
const checkInOrderId = ref('order-3')
const checkInSpot = ref('4')
const checkInVehicleModel = ref('Silver Tesla Model 3')
const checkInPlate = ref('7XYZ892')
const checkInHazards = ref(true)
const checkInNotes = ref('Parked in bay 4, trunk unlocked for contactless placement.')

// New Order Form State
const newCustomerName = ref('')
const newCustomerPhone = ref('')
const newPickupMode = ref<PickupMode>('curbside')
const newSpotNumber = ref('3')
const newStagingAisle = ref('Aisle 01')
const newStagingBin = ref('Bin A-12')
const newItemSummary = ref('')
const newOrderTotal = ref('120.00')

// Computed
const readyInStagingCount = computed(() => orders.value.filter((o) => o.status !== 'completed').length)
const arrivedCustomersCount = computed(() => orders.value.filter((o) => o.status === 'arrived').length)
const enRouteCount = computed(() => orders.value.filter((o) => o.status === 'en_route').length)
const completedCount = computed(() => orders.value.filter((o) => o.status === 'completed').length + 32)

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const matchesSearch =
      searchQuery.value.trim() === '' ||
      order.customerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customerPhone.includes(searchQuery.value) ||
      order.stagingLocation.bin.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (order.vehicleDetails?.makeModel.toLowerCase().includes(searchQuery.value.toLowerCase()) ?? false) ||
      (order.vehicleDetails?.plate.toLowerCase().includes(searchQuery.value.toLowerCase()) ?? false) ||
      order.items.some((i) => i.name.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesMode = selectedModeFilter.value === 'all' || order.pickupMode === selectedModeFilter.value

    const matchesStatus = selectedStatusFilter.value === 'all' || order.status === selectedStatusFilter.value

    return matchesSearch && matchesMode && matchesStatus
  })
})

function triggerToast(msg: string) {
  actionFeedbackToast.value = msg
  setTimeout(() => {
    if (actionFeedbackToast.value === msg) {
      actionFeedbackToast.value = null
    }
  }, 3500)
}

function handleInspect(order: PickupOrder) {
  selectedOrder.value = order
  inspectModalOpen.value = true
}

function handleNotify(order: PickupOrder) {
  selectedOrder.value = order
  notifyMessageSent.value = false
  notifyModalOpen.value = true
}

function sendNotification() {
  if (!selectedOrder.value) return
  notifyMessageSent.value = true
  setTimeout(() => {
    notifyModalOpen.value = false
    triggerToast(
      `Sent arrival notification to ${selectedOrder.value?.customerName} via ${notifyChannel.value.toUpperCase()}`,
    )
  }, 1000)
}

function handleMarkDelivered(orderId: string) {
  const target = orders.value.find((o) => o.id === orderId)
  if (target) {
    target.status = 'completed'
    target.statusLabel = 'Delivered & Handed Over'
    triggerToast(`Order #${target.orderNumber} successfully delivered to ${target.customerName}!`)
    if (inspectModalOpen.value) {
      inspectModalOpen.value = false
    }
  }
}

function handleCheckInSubmit() {
  const order = orders.value.find((o) => o.id === checkInOrderId.value)
  if (order) {
    order.status = 'arrived'
    order.pickupMode = 'curbside'
    order.spotNumber = parseInt(checkInSpot.value, 10) || 4
    order.waitMinutes = 1
    order.statusLabel = `Customer Arrived · Waiting 1m`
    order.vehicleDetails = {
      makeModel: checkInVehicleModel.value || 'Vehicle Unspecified',
      plate: checkInPlate.value || 'N/A',
      hazardsFlashing: checkInHazards.value,
    }
    order.arrivedAt = 'Just now'
    checkInModalOpen.value = false
    triggerToast(`Customer ${order.customerName} checked into Spot #${order.spotNumber}! Runner alerted.`)
  }
}

function handleCreateNewOrder() {
  if (!newCustomerName.value) return
  const idNum = Math.floor(10000 + Math.random() * 90000)
  const newOrder: PickupOrder = {
    id: `order-${Date.now()}`,
    orderNumber: `BOPIS-${idNum}`,
    customerName: newCustomerName.value,
    customerPhone: newCustomerPhone.value || '(415) 555-0100',
    customerInitials: newCustomerName.value
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
    pickupMode: newPickupMode.value,
    spotNumber: newPickupMode.value === 'curbside' ? parseInt(newSpotNumber.value, 10) || 3 : undefined,
    pickupDeskBay: newPickupMode.value === 'in_store' ? 'Pickup Desk Bay 02' : undefined,
    vehicleDetails:
      newPickupMode.value === 'curbside'
        ? {
            makeModel: 'Customer Vehicle',
            plate: 'PENDING',
            hazardsFlashing: false,
          }
        : undefined,
    status: 'ready_staging',
    statusLabel: `Ready in ${newStagingAisle.value}`,
    stagingLocation: {
      zone: newStagingAisle.value,
      bin: newStagingBin.value,
      type: newPickupMode.value === 'in_store' ? 'locker' : 'shelf',
    },
    items: [
      {
        id: `item-${Date.now()}`,
        name: newItemSummary.value || 'Selected Retail Merchandise',
        sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
        quantity: 1,
        price: parseFloat(newOrderTotal.value) || 99.0,
        staged: true,
        category: 'General',
      },
    ],
    orderTotal: parseFloat(newOrderTotal.value) || 99.0,
    placedAt: '11:45 AM',
    readyAt: 'Just now',
    verificationCode: `${Math.floor(1000 + Math.random() * 9000)}`,
    assignedRunner: 'Pending Handoff',
  }

  orders.value.unshift(newOrder)
  newOrderModalOpen.value = false
  newCustomerName.value = ''
  newCustomerPhone.value = ''
  newItemSummary.value = ''
  triggerToast(`New Order #${newOrder.orderNumber} staged in ${newOrder.stagingLocation.bin}!`)
}

function handleRefresh() {
  lastRefreshed.value = 'Just now'
  triggerToast('Refreshed pickup staging queue & curbside telemetry')
}
</script>

<template>
  <div :class="cn('text-foreground w-full space-y-6', props.class)">
    <!-- Live Toast Notification Banner -->
    <div
      v-if="actionFeedbackToast"
      class="border-success/30 bg-success/10 text-success flex items-center justify-between rounded-md border px-4 py-2.5 text-xs font-medium shadow-xs transition-all duration-200"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>{{ actionFeedbackToast }}</span>
      </div>
      <button
        aria-label="Dismiss notification"
        type="button"
        class="text-muted-foreground hover:text-foreground inline-flex size-4 items-center justify-center"
        @click="actionFeedbackToast = null"
      >
        <X class="size-3.5" />
      </button>
    </div>

    <!-- Header Section -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div class="flex flex-wrap items-center gap-2.5">
          <div
            class="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded-lg border"
          >
            <Car class="size-4" />
          </div>
          <h1 class="text-xl font-bold tracking-tight md:text-2xl">Store Pickup & Curbside Coordination</h1>
          <Badge wrap variant="outline" class="gap-1.5 font-medium">
            <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span class="text-xs">Live Staging Radar</span>
          </Badge>
        </div>
        <div class="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-2 text-xs">
          <span class="text-foreground flex items-center gap-1 font-medium">
            <MapPin class="text-muted-foreground size-3.5" />
            {{ props.storeName }}
          </span>
          <span class="font-mono text-xs">{{ props.storeCode }}</span>
          <span class="text-foreground font-medium tabular-nums">
            {{ readyInStagingCount }} Ready · {{ enRouteCount }} En Route · {{ completedCount }} Completed
          </span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" class="h-9 gap-1.5 text-xs shadow-xs" @click="checkInModalOpen = true">
          <Car class="size-3.5 text-amber-500" />
          <span>Customer "I'm Here" Check-In</span>
        </Button>

        <Button size="sm" class="h-9 gap-1.5 text-xs shadow-xs" @click="newOrderModalOpen = true">
          <Plus class="size-3.5" />
          <span>New Pickup Order</span>
        </Button>
      </div>
    </div>

    <!-- 4 Fulfillment Health Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Ready in Staging -->
      <Card class="border-border shadow-xs">
        <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Ready for Customer
          </CardTitle>
          <div class="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
            <PackageCheck class="text-foreground size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1.5">
          <div class="text-2xl font-bold tracking-tight tabular-nums">8 Orders in Staging</div>
          <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
            <span>6 Bins · 2 Secured Lockers</span>
            <Badge wrap variant="success" class="h-5 px-1.5 text-xs font-medium"> 100% Pick Accuracy </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Card 2: Arrived in Curbside Bay (Amber Alert) -->
      <Card class="border-warning/30 bg-warning/5 shadow-xs">
        <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
          <CardTitle
            class="min-w-0 text-xs font-semibold tracking-wider break-words text-amber-800 uppercase dark:text-amber-300"
          >
            Customers in Parking Bays
          </CardTitle>
          <div class="bg-warning/15 text-warning flex size-7 items-center justify-center rounded-md">
            <Car class="size-4 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1.5">
          <div class="text-2xl font-bold tracking-tight text-amber-950 tabular-nums dark:text-amber-200">
            {{ arrivedCustomersCount }} Customers Arrived
          </div>
          <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
            <span class="text-amber-800/80 dark:text-amber-300/80">Bay #4 (2m) · Bay #2 (4m)</span>
            <Badge wrap variant="warning" class="h-5 gap-1 px-1.5 text-xs font-medium">
              <span class="size-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
              Action Required
            </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Card 3: Avg Fulfillment Time -->
      <Card class="border-border shadow-xs">
        <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Avg Fulfillment Time
          </CardTitle>
          <div class="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
            <Clock class="text-foreground size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1.5">
          <div class="text-2xl font-bold tracking-tight tabular-nums">1m 45s</div>
          <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
            <span>Goal &lt; 3m 00s (-18s vs target)</span>
            <Badge wrap variant="info" class="h-5 px-1.5 text-xs font-medium"> Fastest: 52s </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Card 4: Today's Completed Pickups -->
      <Card class="border-border shadow-xs">
        <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Today's Pickups
          </CardTitle>
          <div class="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
            <CheckCircle2 class="text-foreground size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1.5">
          <div class="text-2xl font-bold tracking-tight tabular-nums">{{ completedCount }} Orders</div>
          <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
            <span>$5,240 Fulfilled Volume</span>
            <Badge wrap variant="success" class="h-5 px-1.5 text-xs font-medium"> 97.2% On-Time SLA </Badge>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Active Pickup Orders Board / Table Card -->
    <Card class="border-border shadow-xs">
      <CardHeader class="space-y-4 pb-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-base font-semibold">Active Pickup Orders Board</CardTitle>
            <CardDescription class="text-xs">
              Live queue of customers arriving curbside and checking in at in-store fulfillment stations.
            </CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs shadow-xs" @click="handleRefresh">
              <RefreshCw class="text-muted-foreground size-3" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div class="relative max-w-sm flex-1">
            <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input
              v-model="searchQuery"
              placeholder="Search customer, order #, spot, or items..."
              class="h-8 pl-8 text-xs"
            />
            <button
              aria-label="Clear search"
              v-if="searchQuery"
              type="button"
              class="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
              @click="searchQuery = ''"
            >
              <X class="size-3" />
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div class="flex items-center gap-1.5">
              <span class="text-muted-foreground text-xs">Mode:</span>
              <Select v-model="selectedModeFilter">
                <SelectTrigger class="h-8 w-32 text-xs">
                  <SelectValue placeholder="Pickup Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="curbside">Curbside Bay</SelectItem>
                  <SelectItem value="in_store">In-Store Desk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-muted-foreground text-xs">Status:</span>
              <Select v-model="selectedStatusFilter">
                <SelectTrigger class="h-8 w-36 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="arrived">Customer Arrived</SelectItem>
                  <SelectItem value="en_route">En Route</SelectItem>
                  <SelectItem value="ready_staging">Ready in Staging</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader class="bg-muted/40">
              <TableRow>
                <TableHead class="w-[200px] text-xs font-semibold">Customer & Contact</TableHead>
                <TableHead class="w-[180px] text-xs font-semibold">Order & Items</TableHead>
                <TableHead class="w-[220px] text-xs font-semibold">Pickup Mode & Bay</TableHead>
                <TableHead class="w-[200px] text-xs font-semibold">Customer Status</TableHead>
                <TableHead class="w-[160px] text-xs font-semibold">Staging Location</TableHead>
                <TableHead class="w-[180px] text-right text-xs font-semibold">Fulfillment Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="order in filteredOrders"
                :key="order.id"
                :class="
                  cn(
                    'transition-colors duration-150',
                    order.status === 'arrived' && 'bg-amber-500/[0.04] dark:bg-amber-500/[0.08]',
                  )
                "
              >
                <!-- Customer Name & Phone -->
                <TableCell class="py-3">
                  <div class="flex items-center gap-2.5">
                    <Avatar class="border-border size-8 rounded-full border">
                      <AvatarFallback class="bg-muted text-xs font-medium">
                        {{ order.customerInitials }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="space-y-0.5">
                      <div class="text-foreground text-xs leading-tight font-semibold">
                        {{ order.customerName }}
                      </div>
                      <div class="text-muted-foreground flex items-center gap-1 font-mono text-xs tabular-nums">
                        <Phone class="text-muted-foreground/70 size-3" />
                        {{ order.customerPhone }}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <!-- Order Number & Items Summary -->
                <TableCell class="py-3">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-foreground font-mono text-xs font-bold"> #{{ order.orderNumber }} </span>
                      <span class="text-muted-foreground text-xs tabular-nums">
                        (${{ order.orderTotal.toFixed(2) }})
                      </span>
                    </div>
                    <div
                      class="text-muted-foreground max-w-[170px] min-w-0 truncate text-xs"
                      :title="order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')"
                    >
                      {{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'items' }}:
                      {{ order.items.map((i) => i.name).join(', ') }}
                    </div>
                  </div>
                </TableCell>

                <!-- Pickup Mode Badge -->
                <TableCell class="py-3">
                  <div class="space-y-1">
                    <template v-if="order.pickupMode === 'curbside'">
                      <Badge
                        wrap
                        variant="outline"
                        class="gap-1 border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-700 dark:text-emerald-300"
                      >
                        <Car class="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>Curbside Spot #{{ order.spotNumber }}</span>
                      </Badge>
                      <div v-if="order.vehicleDetails" class="text-muted-foreground flex items-center gap-1 text-xs">
                        <span class="max-w-[180px] truncate">{{ order.vehicleDetails.makeModel }}</span>
                        <span class="text-foreground font-mono font-medium">· {{ order.vehicleDetails.plate }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <Badge
                        wrap
                        variant="outline"
                        class="gap-1 border-sky-500/30 bg-sky-500/10 font-medium text-sky-700 dark:text-sky-300"
                      >
                        <Store class="size-3 shrink-0 text-sky-600 dark:text-sky-400" />
                        <span>In-Store Desk</span>
                      </Badge>
                      <div class="text-muted-foreground text-xs">
                        {{ order.pickupDeskBay || 'Front Pickup Counter' }}
                      </div>
                    </template>
                  </div>
                </TableCell>

                <!-- Customer Status -->
                <TableCell class="py-3">
                  <div class="space-y-1">
                    <template v-if="order.status === 'arrived'">
                      <Badge wrap variant="warning" class="gap-1.5 px-2 py-0.5 font-medium">
                        <span class="size-1.5 rounded-full bg-amber-500" />
                        <Clock class="size-3" />
                        <span class="tabular-nums">Customer Arrived · Waiting {{ order.waitMinutes || 2 }}m</span>
                      </Badge>
                      <div class="text-muted-foreground flex items-center gap-1 text-xs">
                        <span>Check-in: {{ order.arrivedAt || '11:40 AM' }}</span>
                        <span
                          v-if="order.vehicleDetails?.hazardsFlashing"
                          class="font-medium text-amber-600 dark:text-amber-400"
                          >· Hazards On</span
                        >
                      </div>
                    </template>

                    <template v-else-if="order.status === 'en_route'">
                      <Badge wrap variant="info" class="gap-1.5 px-2 py-0.5 font-medium">
                        <Navigation class="size-3 text-sky-500" />
                        <span class="tabular-nums">En Route · {{ order.etaMinutes }} min ETA</span>
                      </Badge>
                      <div class="text-muted-foreground text-xs">
                        <span class="tabular-nums">{{ order.distanceMiles }} miles away</span>
                      </div>
                    </template>

                    <template v-else-if="order.status === 'ready_staging'">
                      <Badge wrap variant="secondary" class="gap-1.5 px-2 py-0.5 font-medium">
                        <Package class="size-3" />
                        <span>Ready in Staging</span>
                      </Badge>
                      <div class="text-muted-foreground text-xs">Staged at {{ order.readyAt }}</div>
                    </template>

                    <template v-else>
                      <Badge wrap variant="success" class="gap-1.5 px-2 py-0.5 font-medium">
                        <CheckCircle2 class="size-3" />
                        <span>Delivered</span>
                      </Badge>
                      <div class="text-muted-foreground text-xs">Completed Handoff</div>
                    </template>
                  </div>
                </TableCell>

                <!-- Staging Location -->
                <TableCell class="py-3">
                  <div class="space-y-0.5">
                    <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                      <Layers class="text-muted-foreground size-3.5" />
                      <span>{{ order.stagingLocation.zone }}</span>
                      <span class="text-primary font-mono font-bold">{{ order.stagingLocation.bin }}</span>
                    </div>
                    <div v-if="order.stagingLocation.lockerPin" class="text-muted-foreground font-mono text-xs">
                      PIN Code: <span class="text-foreground font-bold">{{ order.stagingLocation.lockerPin }}</span>
                    </div>
                    <div v-else class="text-muted-foreground text-xs capitalize">
                      Type: {{ order.stagingLocation.type }} staging
                    </div>
                  </div>
                </TableCell>

                <!-- Fulfillment Actions -->
                <TableCell class="py-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Primary Mark Delivered Action (For Arrived Orders) -->
                    <Button
                      v-if="order.status === 'arrived'"
                      size="sm"
                      class="h-8 gap-1 bg-emerald-600 px-2.5 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                      @click="handleMarkDelivered(order.id)"
                    >
                      <Check class="size-3.5" />
                      <span>Mark Delivered</span>
                    </Button>

                    <!-- Notify Customer Action -->
                    <Button
                      v-else-if="order.status !== 'completed'"
                      variant="outline"
                      size="sm"
                      class="h-8 gap-1 px-2.5 text-xs shadow-xs"
                      @click="handleNotify(order)"
                    >
                      <Bell class="text-muted-foreground size-3" />
                      <span>Notify</span>
                    </Button>

                    <Button v-else variant="outline" size="sm" disabled class="h-8 text-xs opacity-60">
                      <CheckCircle2 class="size-3 text-emerald-500" />
                      <span>Fulfilled</span>
                    </Button>

                    <!-- Dropdown for Inspect & Details -->
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-foreground size-8">
                          <MoreHorizontal class="size-4" />
                          <span class="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" class="w-48 text-xs">
                        <DropdownMenuLabel>Order #{{ order.orderNumber }}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem class="cursor-pointer gap-2" @click="handleInspect(order)">
                          <Eye class="text-muted-foreground size-3.5" />
                          <span>Inspect Order Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem class="cursor-pointer gap-2" @click="handleNotify(order)">
                          <MessageSquare class="text-muted-foreground size-3.5" />
                          <span>Send SMS / Push Alert</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          v-if="order.status !== 'completed'"
                          class="cursor-pointer gap-2 font-medium text-emerald-600 dark:text-emerald-400"
                          @click="handleMarkDelivered(order.id)"
                        >
                          <CheckCircle2 class="size-3.5" />
                          <span>Complete Handoff</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredOrders.length === 0">
                <TableCell colspan="6" class="text-muted-foreground h-32 text-center text-xs">
                  No pickup orders match your search or filter criteria.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter
        class="border-border text-muted-foreground flex items-center justify-between border-t px-6 py-3 text-xs"
      >
        <div>
          Showing <span class="text-foreground font-medium tabular-nums">{{ filteredOrders.length }}</span> of
          <span class="text-foreground font-medium tabular-nums">{{ orders.length }}</span> active pickup orders
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <span class="size-2 rounded-full bg-emerald-500" />
            <span>Curbside Bays (Spots 1-6)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="size-2 rounded-full bg-sky-500" />
            <span>In-Store Pickup Desk</span>
          </div>
        </div>
      </CardFooter>
    </Card>

    <!-- Modal 1: Customer "I'm Here" Parking Spot Check-in Dialog -->
    <Dialog v-model:open="checkInModalOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <div
              class="flex size-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <Car class="size-4" />
            </div>
            <div>
              <DialogTitle class="text-base font-bold">Customer Parking Arrival Check-In</DialogTitle>
              <DialogDescription class="text-xs">
                Check in customer arriving at the curbside pickup bay or simulate customer mobile app check-in.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div class="space-y-4 py-2 text-xs">
          <!-- Select Order to Check In -->
          <div class="space-y-1.5">
            <label class="text-foreground font-medium">Select Customer Order</label>
            <Select v-model="checkInOrderId">
              <SelectTrigger class="h-9 text-xs">
                <SelectValue placeholder="Select active order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="o in orders.filter((x) => x.status !== 'completed')" :key="o.id" :value="o.id">
                  {{ o.customerName }} · #{{ o.orderNumber }} ({{ o.items.length }} items)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Select Parking Spot -->
          <div class="space-y-1.5">
            <label class="text-foreground font-medium">Curbside Parking Bay</label>
            <div class="grid grid-cols-6 gap-1.5">
              <button
                v-for="spot in ['1', '2', '3', '4', '5', '6']"
                :key="spot"
                type="button"
                :class="
                  cn(
                    'flex flex-col items-center justify-center rounded-md border py-2 text-xs font-semibold transition-all duration-150',
                    checkInSpot === spot
                      ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 ring-2 ring-emerald-500/30 dark:text-emerald-300'
                      : 'border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground',
                  )
                "
                @click="checkInSpot = spot"
              >
                <span>Bay</span>
                <span class="text-sm font-bold">#{{ spot }}</span>
              </button>
            </div>
          </div>

          <!-- Vehicle Information -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-foreground font-medium">Vehicle Make & Model</label>
              <Input v-model="checkInVehicleModel" placeholder="e.g. Silver Tesla Model 3" class="h-8 text-xs" />
            </div>
            <div class="space-y-1.5">
              <label class="text-foreground font-medium">License Plate</label>
              <Input v-model="checkInPlate" placeholder="e.g. 7XYZ892" class="h-8 font-mono text-xs uppercase" />
            </div>
          </div>

          <!-- Arrival Notes -->
          <div class="space-y-1.5">
            <label class="text-foreground font-medium">Arrival Instructions & Bay Notes</label>
            <Input v-model="checkInNotes" placeholder="e.g. Trunk unlocked, hazard lights on" class="h-8 text-xs" />
          </div>

          <!-- Hazard Lights Checkbox Simulation -->
          <div class="border-border bg-muted/40 flex items-center gap-2 rounded-md border p-2.5">
            <input
              id="hazards-checkbox"
              v-model="checkInHazards"
              type="checkbox"
              class="border-border text-primary focus:ring-primary size-4 rounded"
            />
            <label for="hazards-checkbox" class="text-foreground cursor-pointer text-xs">
              Vehicle hazard lights are actively flashing for runner identification
            </label>
          </div>
        </div>

        <DialogFooter class="gap-2 sm:gap-0">
          <DialogClose as-child>
            <Button variant="outline" size="sm" class="text-xs">Cancel</Button>
          </DialogClose>
          <Button
            size="sm"
            class="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
            @click="handleCheckInSubmit"
          >
            <CheckCircle2 class="size-3.5" />
            <span>Confirm Arrival & Alert Runner</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Modal 2: Inspect Order Details Dialog -->
    <Dialog v-model:open="inspectModalOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader v-if="selectedOrder">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2">
                <DialogTitle class="text-base font-bold"> Order #{{ selectedOrder.orderNumber }} </DialogTitle>
                <Badge
                  :variant="selectedOrder.pickupMode === 'curbside' ? 'success' : 'info'"
                  class="text-xs font-medium whitespace-normal"
                >
                  {{
                    selectedOrder.pickupMode === 'curbside'
                      ? `Curbside Bay #${selectedOrder.spotNumber}`
                      : 'In-Store Desk'
                  }}
                </Badge>
              </div>
              <DialogDescription class="mt-1 text-xs">
                Placed at {{ selectedOrder.placedAt }} · Staged at {{ selectedOrder.readyAt }}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div v-if="selectedOrder" class="space-y-4 py-2 text-xs">
          <!-- Customer & Contact Strip -->
          <div class="border-border bg-muted/30 flex items-center justify-between rounded-lg border p-3">
            <div class="flex items-center gap-2.5">
              <Avatar class="border-border size-9 border">
                <AvatarFallback class="text-xs font-bold">{{ selectedOrder.customerInitials }}</AvatarFallback>
              </Avatar>
              <div>
                <div class="text-foreground text-xs font-semibold">{{ selectedOrder.customerName }}</div>
                <div class="text-muted-foreground font-mono text-xs">{{ selectedOrder.customerPhone }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-muted-foreground text-xs">Pickup Verification PIN</div>
              <div class="text-primary font-mono text-sm font-bold tracking-widest">
                {{ selectedOrder.verificationCode }}
              </div>
            </div>
          </div>

          <!-- Staging & Bay Location Details -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="border-border space-y-1 rounded-md border p-2.5">
              <div class="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <Layers class="size-3.5" />
                <span>Staging Bin Location</span>
              </div>
              <div class="text-foreground text-xs font-bold">
                {{ selectedOrder.stagingLocation.zone }} ·
                <span class="text-primary font-mono">{{ selectedOrder.stagingLocation.bin }}</span>
              </div>
              <div class="text-muted-foreground text-xs capitalize">
                {{ selectedOrder.stagingLocation.type }} unit storage
              </div>
            </div>

            <div class="border-border space-y-1 rounded-md border p-2.5">
              <div class="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <Car class="size-3.5" />
                <span>Vehicle & Bay</span>
              </div>
              <template v-if="selectedOrder.pickupMode === 'curbside' && selectedOrder.vehicleDetails">
                <div class="text-foreground truncate text-xs font-bold">
                  Spot #{{ selectedOrder.spotNumber }} · {{ selectedOrder.vehicleDetails.makeModel }}
                </div>
                <div class="text-muted-foreground font-mono text-xs">
                  Plate: {{ selectedOrder.vehicleDetails.plate }}
                </div>
              </template>
              <template v-else>
                <div class="text-foreground text-xs font-bold">
                  {{ selectedOrder.pickupDeskBay || 'Pickup Counter' }}
                </div>
                <div class="text-muted-foreground text-xs">
                  Locker PIN: {{ selectedOrder.stagingLocation.lockerPin || 'N/A' }}
                </div>
              </template>
            </div>
          </div>

          <!-- Staged Items Checklist -->
          <div class="space-y-2">
            <div class="text-foreground flex items-center justify-between text-xs font-medium">
              <span>Order Items Checklist ({{ selectedOrder.items.length }} items)</span>
              <span class="text-muted-foreground">Total: ${{ selectedOrder.orderTotal.toFixed(2) }}</span>
            </div>
            <div class="border-border max-h-40 space-y-1.5 overflow-y-auto rounded-md border p-2">
              <div
                v-for="item in selectedOrder.items"
                :key="item.id"
                class="bg-muted/40 flex items-center justify-between rounded p-2 text-xs"
              >
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="size-3.5 shrink-0 text-emerald-500" />
                  <div>
                    <div class="text-foreground font-medium">{{ item.name }}</div>
                    <div class="text-muted-foreground font-mono text-xs">
                      SKU: {{ item.sku }} · Qty: {{ item.quantity }}
                    </div>
                  </div>
                </div>
                <div class="text-foreground font-mono text-xs font-medium">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" class="text-xs" @click="inspectModalOpen = false"> Close </Button>
          <Button
            v-if="selectedOrder?.status !== 'completed'"
            size="sm"
            class="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
            @click="selectedOrder && handleMarkDelivered(selectedOrder.id)"
          >
            <Check class="size-3.5" />
            <span>Mark Delivered & Close</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Modal 3: Notify Customer Dialog -->
    <Dialog v-model:open="notifyModalOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader v-if="selectedOrder">
          <DialogTitle class="text-base font-bold">Notify Customer</DialogTitle>
          <DialogDescription class="text-xs">
            Send real-time pickup status alert to {{ selectedOrder.customerName }} ({{ selectedOrder.customerPhone }}).
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedOrder" class="space-y-4 py-2 text-xs">
          <div class="space-y-1.5">
            <label class="text-foreground font-medium">Notification Channel</label>
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                :class="
                  cn(
                    'flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-semibold transition-colors',
                    notifyChannel === 'sms'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground',
                  )
                "
                @click="notifyChannel = 'sms'"
              >
                <MessageSquare class="size-3.5" />
                <span>SMS Text Message</span>
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-semibold transition-colors',
                    notifyChannel === 'push'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground',
                  )
                "
                @click="notifyChannel = 'push'"
              >
                <Bell class="size-3.5" />
                <span>Mobile App Push</span>
              </button>
            </div>
          </div>

          <div class="border-border bg-muted/40 space-y-1.5 rounded-md border p-3 text-xs">
            <div class="text-foreground flex items-center justify-between font-medium">
              <span>Message Preview</span>
              <span class="text-muted-foreground font-mono">160 chars</span>
            </div>
            <p class="text-muted-foreground text-xs leading-relaxed">
              "Hi {{ selectedOrder.customerName }}, your Order #{{ selectedOrder.orderNumber }} is ready at
              {{ props.storeName }}! Pull into Curbside Spot #{{ selectedOrder.spotNumber || '1-6' }} and tap 'I'm Here'
              for runner delivery."
            </p>
          </div>
        </div>

        <DialogFooter class="gap-2 sm:gap-0">
          <DialogClose as-child>
            <Button variant="outline" size="sm" class="text-xs">Cancel</Button>
          </DialogClose>
          <Button size="sm" class="gap-1.5 text-xs" :disabled="notifyMessageSent" @click="sendNotification">
            <Send class="size-3.5" />
            <span>{{ notifyMessageSent ? 'Notification Sent!' : 'Send Alert' }}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Modal 4: New Pickup Order Staging Dialog -->
    <Dialog v-model:open="newOrderModalOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-base font-bold">Stage New Pickup Order</DialogTitle>
          <DialogDescription class="text-xs">
            Register an incoming online BOPIS order into retail staging shelves or lockers.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-3.5 py-2 text-xs">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-foreground font-medium">Customer Name</label>
              <Input v-model="newCustomerName" placeholder="e.g. Alex Morgan" class="h-8 text-xs" />
            </div>
            <div class="space-y-1.5">
              <label class="text-foreground font-medium">Customer Phone</label>
              <Input v-model="newCustomerPhone" placeholder="e.g. (415) 555-0199" class="h-8 font-mono text-xs" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-foreground font-medium">Pickup Mode</label>
              <Select v-model="newPickupMode">
                <SelectTrigger class="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="curbside">Curbside Bay</SelectItem>
                  <SelectItem value="in_store">In-Store Desk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-1.5">
              <label class="text-foreground font-medium">Preferred Bay / Desk</label>
              <Select v-model="newSpotNumber">
                <SelectTrigger class="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Bay #1</SelectItem>
                  <SelectItem value="2">Bay #2</SelectItem>
                  <SelectItem value="3">Bay #3</SelectItem>
                  <SelectItem value="4">Bay #4</SelectItem>
                  <SelectItem value="5">Bay #5</SelectItem>
                  <SelectItem value="6">Bay #6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-foreground font-medium">Staging Aisle</label>
              <Input v-model="newStagingAisle" placeholder="e.g. Aisle 01" class="h-8 text-xs" />
            </div>
            <div class="space-y-1.5">
              <label class="text-foreground font-medium">Staging Bin</label>
              <Input v-model="newStagingBin" placeholder="e.g. Bin B-05" class="h-8 text-xs" />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-foreground font-medium">Items Summary</label>
            <Input
              v-model="newItemSummary"
              placeholder="e.g. Noise Cancelling Earbuds, Travel Case"
              class="h-8 text-xs"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-foreground font-medium">Order Total ($)</label>
            <Input v-model="newOrderTotal" placeholder="120.00" class="h-8 font-mono text-xs" />
          </div>
        </div>

        <DialogFooter class="gap-2 sm:gap-0">
          <DialogClose as-child>
            <Button variant="outline" size="sm" class="text-xs">Cancel</Button>
          </DialogClose>
          <Button size="sm" class="text-xs" :disabled="!newCustomerName" @click="handleCreateNewOrder">
            <span>Stage & Assign Bin</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
