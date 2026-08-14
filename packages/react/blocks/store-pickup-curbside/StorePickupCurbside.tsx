'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export interface StorePickupCurbsideProps {
  storeName?: string
  storeCode?: string
  initialModeFilter?: 'all' | 'curbside' | 'in_store'
  className?: string
}

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

export function StorePickupCurbside({
  storeName = 'Pasadena Flagship Store #02',
  storeCode = 'STORE-CA-02',
  initialModeFilter = 'all',
  className,
}: StorePickupCurbsideProps) {
  const [orders, setOrders] = React.useState<PickupOrder[]>(INITIAL_ORDERS)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedModeFilter, setSelectedModeFilter] = React.useState<'all' | 'curbside' | 'in_store'>(initialModeFilter)
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<
    'all' | 'arrived' | 'en_route' | 'ready_staging' | 'completed'
  >('all')

  // Modals
  const [checkInModalOpen, setCheckInModalOpen] = React.useState(false)
  const [inspectModalOpen, setInspectModalOpen] = React.useState(false)
  const [notifyModalOpen, setNotifyModalOpen] = React.useState(false)
  const [newOrderModalOpen, setNewOrderModalOpen] = React.useState(false)
  const [selectedOrder, setSelectedOrder] = React.useState<PickupOrder | null>(null)
  const [notifyChannel, setNotifyChannel] = React.useState<'sms' | 'push'>('sms')
  const [notifyMessageSent, setNotifyMessageSent] = React.useState(false)
  const [actionFeedbackToast, setActionFeedbackToast] = React.useState<string | null>(null)

  // Check-in form
  const [checkInOrderId, setCheckInOrderId] = React.useState('order-3')
  const [checkInSpot, setCheckInSpot] = React.useState('4')
  const [checkInVehicleModel, setCheckInVehicleModel] = React.useState('Silver Tesla Model 3')
  const [checkInPlate, setCheckInPlate] = React.useState('7XYZ892')
  const [checkInHazards, setCheckInHazards] = React.useState(true)
  const [checkInNotes, setCheckInNotes] = React.useState('Parked in bay 4, trunk unlocked for contactless placement.')

  // New order form
  const [newCustomerName, setNewCustomerName] = React.useState('')
  const [newCustomerPhone, setNewCustomerPhone] = React.useState('')
  const [newPickupMode, setNewPickupMode] = React.useState<PickupMode>('curbside')
  const [newSpotNumber, setNewSpotNumber] = React.useState('3')
  const [newStagingAisle, setNewStagingAisle] = React.useState('Aisle 01')
  const [newStagingBin, setNewStagingBin] = React.useState('Bin A-12')
  const [newItemSummary, setNewItemSummary] = React.useState('')
  const [newOrderTotal, setNewOrderTotal] = React.useState('120.00')

  // Toast feedback helper
  const triggerToast = React.useCallback((msg: string) => {
    setActionFeedbackToast(msg)
    setTimeout(() => {
      setActionFeedbackToast((current) => (current === msg ? null : current))
    }, 3500)
  }, [])

  // KPI calculations
  const readyInStagingCount = React.useMemo(() => orders.filter((o) => o.status !== 'completed').length, [orders])
  const arrivedCustomersCount = React.useMemo(() => orders.filter((o) => o.status === 'arrived').length, [orders])
  const enRouteCount = React.useMemo(() => orders.filter((o) => o.status === 'en_route').length, [orders])
  const completedCount = React.useMemo(() => orders.filter((o) => o.status === 'completed').length + 32, [orders])

  // Filtered orders list
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        query === '' ||
        order.customerName.toLowerCase().includes(query) ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerPhone.includes(query) ||
        order.stagingLocation.bin.toLowerCase().includes(query) ||
        (order.vehicleDetails?.makeModel.toLowerCase().includes(query) ?? false) ||
        (order.vehicleDetails?.plate.toLowerCase().includes(query) ?? false) ||
        order.items.some((i) => i.name.toLowerCase().includes(query))

      const matchesMode = selectedModeFilter === 'all' || order.pickupMode === selectedModeFilter
      const matchesStatus = selectedStatusFilter === 'all' || order.status === selectedStatusFilter

      return matchesSearch && matchesMode && matchesStatus
    })
  }, [orders, searchQuery, selectedModeFilter, selectedStatusFilter])

  const handleInspect = (order: PickupOrder) => {
    setSelectedOrder(order)
    setInspectModalOpen(true)
  }

  const handleNotify = (order: PickupOrder) => {
    setSelectedOrder(order)
    setNotifyMessageSent(false)
    setNotifyModalOpen(true)
  }

  const sendNotification = () => {
    if (!selectedOrder) return
    setNotifyMessageSent(true)
    setTimeout(() => {
      setNotifyModalOpen(false)
      triggerToast(`Sent arrival notification to ${selectedOrder.customerName} via ${notifyChannel.toUpperCase()}`)
    }, 1000)
  }

  const handleMarkDelivered = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'completed',
              statusLabel: 'Delivered & Handed Over',
            }
          : o,
      ),
    )
    const target = orders.find((o) => o.id === orderId)
    if (target) {
      triggerToast(`Order #${target.orderNumber} successfully delivered to ${target.customerName}!`)
    }
    setInspectModalOpen(false)
  }

  const handleCheckInSubmit = () => {
    const target = orders.find((o) => o.id === checkInOrderId)
    if (target) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === checkInOrderId
            ? {
                ...o,
                status: 'arrived',
                pickupMode: 'curbside',
                spotNumber: parseInt(checkInSpot, 10) || 4,
                waitMinutes: 1,
                statusLabel: 'Customer Arrived · Waiting 1m',
                vehicleDetails: {
                  makeModel: checkInVehicleModel || 'Vehicle Unspecified',
                  plate: checkInPlate || 'N/A',
                  hazardsFlashing: checkInHazards,
                },
                arrivedAt: 'Just now',
              }
            : o,
        ),
      )
      setCheckInModalOpen(false)
      triggerToast(`Customer ${target.customerName} checked into Spot #${checkInSpot}! Runner alerted.`)
    }
  }

  const handleCreateNewOrder = () => {
    if (!newCustomerName) return
    const idNum = Math.floor(10000 + Math.random() * 90000)
    const newOrder: PickupOrder = {
      id: `order-${Date.now()}`,
      orderNumber: `BOPIS-${idNum}`,
      customerName: newCustomerName,
      customerPhone: newCustomerPhone || '(415) 555-0100',
      customerInitials: newCustomerName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      pickupMode: newPickupMode,
      spotNumber: newPickupMode === 'curbside' ? parseInt(newSpotNumber, 10) || 3 : undefined,
      pickupDeskBay: newPickupMode === 'in_store' ? 'Pickup Desk Bay 02' : undefined,
      vehicleDetails:
        newPickupMode === 'curbside'
          ? {
              makeModel: 'Customer Vehicle',
              plate: 'PENDING',
              hazardsFlashing: false,
            }
          : undefined,
      status: 'ready_staging',
      statusLabel: `Ready in ${newStagingAisle}`,
      stagingLocation: {
        zone: newStagingAisle,
        bin: newStagingBin,
        type: newPickupMode === 'in_store' ? 'locker' : 'shelf',
      },
      items: [
        {
          id: `item-${Date.now()}`,
          name: newItemSummary || 'Selected Retail Merchandise',
          sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
          quantity: 1,
          price: parseFloat(newOrderTotal) || 99.0,
          staged: true,
          category: 'General',
        },
      ],
      orderTotal: parseFloat(newOrderTotal) || 99.0,
      placedAt: '11:45 AM',
      readyAt: 'Just now',
      verificationCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      assignedRunner: 'Pending Handoff',
    }

    setOrders((prev) => [newOrder, ...prev])
    setNewOrderModalOpen(false)
    setNewCustomerName('')
    setNewCustomerPhone('')
    setNewItemSummary('')
    triggerToast(`New Order #${newOrder.orderNumber} staged in ${newOrder.stagingLocation.bin}!`)
  }

  const handleRefresh = () => {
    triggerToast('Refreshed pickup staging queue & curbside telemetry')
  }

  return (
    <div className={cn('text-foreground w-full space-y-6', className)}>
      {/* Live Toast Notification Banner */}
      {actionFeedbackToast && (
        <div className="border-success/30 bg-success/10 text-success flex items-center justify-between rounded-md border px-4 py-2.5 text-xs font-medium shadow-xs transition-all duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{actionFeedbackToast}</span>
          </div>
          <button
            aria-label="Dismiss notification"
            type="button"
            className="text-muted-foreground hover:text-foreground inline-flex size-4 items-center justify-center"
            onClick={() => setActionFeedbackToast(null)}
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded-lg border">
              <Car className="size-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">Store Pickup & Curbside Coordination</h1>
            <Badge wrap variant="outline" className="gap-1.5 font-medium">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs">Live Staging Radar</span>
            </Badge>
          </div>
          <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-foreground flex items-center gap-1 font-medium">
              <MapPin className="text-muted-foreground size-3.5" />
              {storeName}
            </span>
            <span className="font-mono text-xs">{storeCode}</span>
            <span className="text-foreground font-medium tabular-nums">
              {readyInStagingCount} Ready · {enRouteCount} En Route · {completedCount} Completed
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs shadow-xs"
            onClick={() => setCheckInModalOpen(true)}
          >
            <Car className="size-3.5 text-amber-500" />
            <span>Customer "I'm Here" Check-In</span>
          </Button>

          <Button size="sm" className="h-9 gap-1.5 text-xs shadow-xs" onClick={() => setNewOrderModalOpen(true)}>
            <Plus className="size-3.5" />
            <span>New Pickup Order</span>
          </Button>
        </div>
      </div>

      {/* 4 Fulfillment Health Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Ready in Staging */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Ready for Customer
            </CardTitle>
            <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
              <PackageCheck className="text-foreground size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="text-2xl font-bold tracking-tight tabular-nums">8 Orders in Staging</div>
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
              <span>6 Bins · 2 Secured Lockers</span>
              <Badge wrap variant="success" className="h-5 px-1.5 text-xs font-medium">
                100% Pick Accuracy
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Arrived in Curbside Bay (Amber Alert) */}
        <Card className="border-warning/30 bg-warning/5 shadow-xs">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
            <CardTitle className="min-w-0 text-xs font-semibold tracking-wider break-words text-amber-800 uppercase dark:text-amber-300">
              Customers in Parking Bays
            </CardTitle>
            <div className="bg-warning/15 text-warning flex size-7 items-center justify-center rounded-md">
              <Car className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="text-2xl font-bold tracking-tight text-amber-950 tabular-nums dark:text-amber-200">
              {arrivedCustomersCount} Customers Arrived
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
              <span className="text-amber-800/80 dark:text-amber-300/80">Bay #4 (2m) · Bay #2 (4m)</span>
              <Badge wrap variant="warning" className="h-5 gap-1 px-1.5 text-xs font-medium">
                <span className="size-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                Action Required
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Avg Fulfillment Time */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Avg Fulfillment Time
            </CardTitle>
            <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
              <Clock className="text-foreground size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="text-2xl font-bold tracking-tight tabular-nums">1m 45s</div>
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
              <span>Goal &lt; 3m 00s (-18s vs target)</span>
              <Badge wrap variant="info" className="h-5 px-1.5 text-xs font-medium">
                Fastest: 52s
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Today's Completed Pickups */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Today's Pickups
            </CardTitle>
            <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
              <CheckCircle2 className="text-foreground size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="text-2xl font-bold tracking-tight tabular-nums">{completedCount} Orders</div>
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
              <span>$5,240 Fulfilled Volume</span>
              <Badge wrap variant="success" className="h-5 px-1.5 text-xs font-medium">
                97.2% On-Time SLA
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Pickup Orders Board / Table Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Active Pickup Orders Board</CardTitle>
              <CardDescription className="text-xs">
                Live queue of customers arriving curbside and checking in at in-store fulfillment stations.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs shadow-xs" onClick={handleRefresh}>
                <RefreshCw className="text-muted-foreground size-3" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {/* Filter & Search Controls */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customer, order #, spot, or items..."
                className="h-8 pl-8 text-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-xs">Mode:</span>
                <Select
                  value={selectedModeFilter}
                  onValueChange={(val: 'all' | 'curbside' | 'in_store') => setSelectedModeFilter(val)}
                >
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue placeholder="Pickup Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="curbside">Curbside Bay</SelectItem>
                    <SelectItem value="in_store">In-Store Desk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-xs">Status:</span>
                <Select
                  value={selectedStatusFilter}
                  onValueChange={(val: 'all' | 'arrived' | 'en_route' | 'ready_staging' | 'completed') =>
                    setSelectedStatusFilter(val)
                  }
                >
                  <SelectTrigger className="h-8 w-36 text-xs">
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

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[200px] text-xs font-semibold">Customer & Contact</TableHead>
                  <TableHead className="w-[180px] text-xs font-semibold">Order & Items</TableHead>
                  <TableHead className="w-[220px] text-xs font-semibold">Pickup Mode & Bay</TableHead>
                  <TableHead className="w-[200px] text-xs font-semibold">Customer Status</TableHead>
                  <TableHead className="w-[160px] text-xs font-semibold">Staging Location</TableHead>
                  <TableHead className="w-[180px] text-right text-xs font-semibold">Fulfillment Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className={cn(
                      'transition-colors duration-150',
                      order.status === 'arrived' && 'bg-amber-500/[0.04] dark:bg-amber-500/[0.08]',
                    )}
                  >
                    {/* Customer Name & Phone */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="border-border size-8 rounded-full border">
                          <AvatarFallback className="bg-muted text-xs font-medium">
                            {order.customerInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <div className="text-foreground text-xs leading-tight font-semibold">
                            {order.customerName}
                          </div>
                          <div className="text-muted-foreground flex items-center gap-1 font-mono text-xs tabular-nums">
                            <Phone className="text-muted-foreground/70 size-3" />
                            {order.customerPhone}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Order Number & Items Summary */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground font-mono text-xs font-bold">#{order.orderNumber}</span>
                          <span className="text-muted-foreground text-xs tabular-nums">
                            (${order.orderTotal.toFixed(2)})
                          </span>
                        </div>
                        <div
                          className="text-muted-foreground max-w-[170px] min-w-0 truncate text-xs"
                          title={order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        >
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}:{' '}
                          {order.items.map((i) => i.name).join(', ')}
                        </div>
                      </div>
                    </TableCell>

                    {/* Pickup Mode Badge */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        {order.pickupMode === 'curbside' ? (
                          <>
                            <Badge
                              wrap
                              variant="outline"
                              className="gap-1 border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-700 dark:text-emerald-300"
                            >
                              <Car className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                              <span>Curbside Spot #{order.spotNumber}</span>
                            </Badge>
                            {order.vehicleDetails && (
                              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                <span className="max-w-[180px] truncate">{order.vehicleDetails.makeModel}</span>
                                <span className="text-foreground font-mono font-medium">
                                  · {order.vehicleDetails.plate}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <Badge
                              wrap
                              variant="outline"
                              className="gap-1 border-sky-500/30 bg-sky-500/10 font-medium text-sky-700 dark:text-sky-300"
                            >
                              <Store className="size-3 shrink-0 text-sky-600 dark:text-sky-400" />
                              <span>In-Store Desk</span>
                            </Badge>
                            <div className="text-muted-foreground text-xs">
                              {order.pickupDeskBay || 'Front Pickup Counter'}
                            </div>
                          </>
                        )}
                      </div>
                    </TableCell>

                    {/* Customer Status */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        {order.status === 'arrived' ? (
                          <>
                            <Badge wrap variant="warning" className="gap-1.5 px-2 py-0.5 font-medium">
                              <span className="size-1.5 rounded-full bg-amber-500" />
                              <Clock className="size-3" />
                              <span className="tabular-nums">Customer Arrived · Waiting {order.waitMinutes || 2}m</span>
                            </Badge>
                            <div className="text-muted-foreground flex items-center gap-1 text-xs">
                              <span>Check-in: {order.arrivedAt || '11:40 AM'}</span>
                              {order.vehicleDetails?.hazardsFlashing && (
                                <span className="font-medium text-amber-600 dark:text-amber-400">· Hazards On</span>
                              )}
                            </div>
                          </>
                        ) : order.status === 'en_route' ? (
                          <>
                            <Badge wrap variant="info" className="gap-1.5 px-2 py-0.5 font-medium">
                              <Navigation className="size-3 text-sky-500" />
                              <span className="tabular-nums">En Route · {order.etaMinutes} min ETA</span>
                            </Badge>
                            <div className="text-muted-foreground text-xs">
                              <span className="tabular-nums">{order.distanceMiles} miles away</span>
                            </div>
                          </>
                        ) : order.status === 'ready_staging' ? (
                          <>
                            <Badge wrap variant="secondary" className="gap-1.5 px-2 py-0.5 font-medium">
                              <Package className="size-3" />
                              <span>Ready in Staging</span>
                            </Badge>
                            <div className="text-muted-foreground text-xs">Staged at {order.readyAt}</div>
                          </>
                        ) : (
                          <>
                            <Badge wrap variant="success" className="gap-1.5 px-2 py-0.5 font-medium">
                              <CheckCircle2 className="size-3" />
                              <span>Delivered</span>
                            </Badge>
                            <div className="text-muted-foreground text-xs">Completed Handoff</div>
                          </>
                        )}
                      </div>
                    </TableCell>

                    {/* Staging Location */}
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                          <Layers className="text-muted-foreground size-3.5" />
                          <span>{order.stagingLocation.zone}</span>
                          <span className="text-primary font-mono font-bold">{order.stagingLocation.bin}</span>
                        </div>
                        {order.stagingLocation.lockerPin ? (
                          <div className="text-muted-foreground font-mono text-xs">
                            PIN Code:{' '}
                            <span className="text-foreground font-bold">{order.stagingLocation.lockerPin}</span>
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-xs capitalize">
                            Type: {order.stagingLocation.type} staging
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Fulfillment Actions */}
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status === 'arrived' ? (
                          <Button
                            size="sm"
                            className="h-8 gap-1 bg-emerald-600 px-2.5 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                            onClick={() => handleMarkDelivered(order.id)}
                          >
                            <Check className="size-3.5" />
                            <span>Mark Delivered</span>
                          </Button>
                        ) : order.status !== 'completed' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 px-2.5 text-xs shadow-xs"
                            onClick={() => handleNotify(order)}
                          >
                            <Bell className="text-muted-foreground size-3" />
                            <span>Notify</span>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled className="h-8 text-xs opacity-60">
                            <CheckCircle2 className="size-3 text-emerald-500" />
                            <span>Fulfilled</span>
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-foreground size-8"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 text-xs">
                            <DropdownMenuLabel>Order #{order.orderNumber}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => handleInspect(order)}>
                              <Eye className="text-muted-foreground size-3.5" />
                              <span>Inspect Order Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => handleNotify(order)}>
                              <MessageSquare className="text-muted-foreground size-3.5" />
                              <span>Send SMS / Push Alert</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {order.status !== 'completed' && (
                              <DropdownMenuItem
                                className="cursor-pointer gap-2 font-medium text-emerald-600 dark:text-emerald-400"
                                onClick={() => handleMarkDelivered(order.id)}
                              >
                                <CheckCircle2 className="size-3.5" />
                                <span>Complete Handoff</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground h-32 text-center text-xs">
                      No pickup orders match your search or filter criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-border text-muted-foreground flex items-center justify-between border-t px-6 py-3 text-xs">
          <div>
            Showing <span className="text-foreground font-medium tabular-nums">{filteredOrders.length}</span> of{' '}
            <span className="text-foreground font-medium tabular-nums">{orders.length}</span> active pickup orders
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Curbside Bays (Spots 1-6)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-sky-500" />
              <span>In-Store Pickup Desk</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Modal 1: Customer "I'm Here" Parking Spot Check-in Dialog */}
      <Dialog open={checkInModalOpen} onOpenChange={setCheckInModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Car className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">Customer Parking Arrival Check-In</DialogTitle>
                <DialogDescription className="text-xs">
                  Check in customer arriving at the curbside pickup bay or simulate customer mobile app check-in.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Select Order to Check In */}
            <div className="space-y-1.5">
              <label className="text-foreground font-medium">Select Customer Order</label>
              <Select value={checkInOrderId} onValueChange={setCheckInOrderId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select active order" />
                </SelectTrigger>
                <SelectContent>
                  {orders
                    .filter((x) => x.status !== 'completed')
                    .map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.customerName} · #{o.orderNumber} ({o.items.length} items)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Parking Spot */}
            <div className="space-y-1.5">
              <label className="text-foreground font-medium">Curbside Parking Bay</label>
              <div className="grid grid-cols-6 gap-1.5">
                {['1', '2', '3', '4', '5', '6'].map((spot) => (
                  <button
                    key={spot}
                    type="button"
                    className={cn(
                      'flex flex-col items-center justify-center rounded-md border py-2 text-xs font-semibold transition-all duration-150',
                      checkInSpot === spot
                        ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 ring-2 ring-emerald-500/30 dark:text-emerald-300'
                        : 'border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground',
                    )}
                    onClick={() => setCheckInSpot(spot)}
                  >
                    <span>Bay</span>
                    <span className="text-sm font-bold">#{spot}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-foreground font-medium">Vehicle Make & Model</label>
                <Input
                  value={checkInVehicleModel}
                  onChange={(e) => setCheckInVehicleModel(e.target.value)}
                  placeholder="e.g. Silver Tesla Model 3"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-foreground font-medium">License Plate</label>
                <Input
                  value={checkInPlate}
                  onChange={(e) => setCheckInPlate(e.target.value)}
                  placeholder="e.g. 7XYZ892"
                  className="h-8 font-mono text-xs uppercase"
                />
              </div>
            </div>

            {/* Arrival Notes */}
            <div className="space-y-1.5">
              <label className="text-foreground font-medium">Arrival Instructions & Bay Notes</label>
              <Input
                value={checkInNotes}
                onChange={(e) => setCheckInNotes(e.target.value)}
                placeholder="e.g. Trunk unlocked, hazard lights on"
                className="h-8 text-xs"
              />
            </div>

            {/* Hazard Lights Checkbox Simulation */}
            <div className="border-border bg-muted/40 flex items-center gap-2 rounded-md border p-2.5">
              <input
                id="hazards-checkbox-react"
                type="checkbox"
                checked={checkInHazards}
                onChange={(e) => setCheckInHazards(e.target.checked)}
                className="border-border text-primary focus:ring-primary size-4 rounded"
              />
              <label htmlFor="hazards-checkbox-react" className="text-foreground cursor-pointer text-xs">
                Vehicle hazard lights are actively flashing for runner identification
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="text-xs">
                Cancel
              </Button>
            </DialogClose>
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
              onClick={handleCheckInSubmit}
            >
              <CheckCircle2 className="size-3.5" />
              <span>Confirm Arrival & Alert Runner</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Inspect Order Details Dialog */}
      <Dialog open={inspectModalOpen} onOpenChange={setInspectModalOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <DialogTitle className="text-base font-bold">Order #{selectedOrder.orderNumber}</DialogTitle>
                      <Badge
                        wrap
                        variant={selectedOrder.pickupMode === 'curbside' ? 'success' : 'info'}
                        className="text-xs font-medium"
                      >
                        {selectedOrder.pickupMode === 'curbside'
                          ? `Curbside Bay #${selectedOrder.spotNumber}`
                          : 'In-Store Desk'}
                      </Badge>
                    </div>
                    <DialogDescription className="mt-1 text-xs">
                      Placed at {selectedOrder.placedAt} · Staged at {selectedOrder.readyAt}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Customer & Contact Strip */}
                <div className="border-border bg-muted/30 flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="border-border size-9 border">
                      <AvatarFallback className="text-xs font-bold">{selectedOrder.customerInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-foreground text-xs font-semibold">{selectedOrder.customerName}</div>
                      <div className="text-muted-foreground font-mono text-xs">{selectedOrder.customerPhone}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground text-xs">Pickup Verification PIN</div>
                    <div className="text-primary font-mono text-sm font-bold tracking-widest">
                      {selectedOrder.verificationCode}
                    </div>
                  </div>
                </div>

                {/* Staging & Bay Location Details */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="border-border space-y-1 rounded-md border p-2.5">
                    <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                      <Layers className="size-3.5" />
                      <span>Staging Bin Location</span>
                    </div>
                    <div className="text-foreground text-xs font-bold">
                      {selectedOrder.stagingLocation.zone} ·{' '}
                      <span className="text-primary font-mono">{selectedOrder.stagingLocation.bin}</span>
                    </div>
                    <div className="text-muted-foreground text-xs capitalize">
                      {selectedOrder.stagingLocation.type} unit storage
                    </div>
                  </div>

                  <div className="border-border space-y-1 rounded-md border p-2.5">
                    <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                      <Car className="size-3.5" />
                      <span>Vehicle & Bay</span>
                    </div>
                    {selectedOrder.pickupMode === 'curbside' && selectedOrder.vehicleDetails ? (
                      <>
                        <div className="text-foreground truncate text-xs font-bold">
                          Spot #{selectedOrder.spotNumber} · {selectedOrder.vehicleDetails.makeModel}
                        </div>
                        <div className="text-muted-foreground font-mono text-xs">
                          Plate: {selectedOrder.vehicleDetails.plate}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-foreground text-xs font-bold">
                          {selectedOrder.pickupDeskBay || 'Pickup Counter'}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Locker PIN: {selectedOrder.stagingLocation.lockerPin || 'N/A'}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Staged Items Checklist */}
                <div className="space-y-2">
                  <div className="text-foreground flex items-center justify-between text-xs font-medium">
                    <span>Order Items Checklist ({selectedOrder.items.length} items)</span>
                    <span className="text-muted-foreground">Total: ${selectedOrder.orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="border-border max-h-40 space-y-1.5 overflow-y-auto rounded-md border p-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="bg-muted/40 flex items-center justify-between rounded p-2 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                          <div>
                            <div className="text-foreground font-medium">{item.name}</div>
                            <div className="text-muted-foreground font-mono text-xs">
                              SKU: {item.sku} · Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="text-foreground font-mono text-xs font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setInspectModalOpen(false)}>
                  Close
                </Button>
                {selectedOrder.status !== 'completed' && (
                  <Button
                    size="sm"
                    className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                    onClick={() => handleMarkDelivered(selectedOrder.id)}
                  >
                    <Check className="size-3.5" />
                    <span>Mark Delivered & Close</span>
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal 3: Notify Customer Dialog */}
      <Dialog open={notifyModalOpen} onOpenChange={setNotifyModalOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-bold">Notify Customer</DialogTitle>
                <DialogDescription className="text-xs">
                  Send real-time pickup status alert to {selectedOrder.customerName} ({selectedOrder.customerPhone}).
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                <div className="space-y-1.5">
                  <label className="text-foreground font-medium">Notification Channel</label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      className={cn(
                        'flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-semibold transition-colors',
                        notifyChannel === 'sms'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground',
                      )}
                      onClick={() => setNotifyChannel('sms')}
                    >
                      <MessageSquare className="size-3.5" />
                      <span>SMS Text Message</span>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-semibold transition-colors',
                        notifyChannel === 'push'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground',
                      )}
                      onClick={() => setNotifyChannel('push')}
                    >
                      <Bell className="size-3.5" />
                      <span>Mobile App Push</span>
                    </button>
                  </div>
                </div>

                <div className="border-border bg-muted/40 space-y-1.5 rounded-md border p-3 text-xs">
                  <div className="text-foreground flex items-center justify-between font-medium">
                    <span>Message Preview</span>
                    <span className="text-muted-foreground font-mono">160 chars</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    "Hi {selectedOrder.customerName}, your Order #{selectedOrder.orderNumber} is ready at {storeName}!
                    Pull into Curbside Spot #{selectedOrder.spotNumber || '1-6'} and tap 'I'm Here' for runner
                    delivery."
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    Cancel
                  </Button>
                </DialogClose>
                <Button size="sm" className="gap-1.5 text-xs" disabled={notifyMessageSent} onClick={sendNotification}>
                  <Send className="size-3.5" />
                  <span>{notifyMessageSent ? 'Notification Sent!' : 'Send Alert'}</span>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal 4: New Pickup Order Staging Dialog */}
      <Dialog open={newOrderModalOpen} onOpenChange={setNewOrderModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Stage New Pickup Order</DialogTitle>
            <DialogDescription className="text-xs">
              Register an incoming online BOPIS order into retail staging shelves or lockers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-foreground font-medium">Customer Name</label>
                <Input
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-foreground font-medium">Customer Phone</label>
                <Input
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="e.g. (415) 555-0199"
                  className="h-8 font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-foreground font-medium">Pickup Mode</label>
                <Select value={newPickupMode} onValueChange={(val: PickupMode) => setNewPickupMode(val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curbside">Curbside Bay</SelectItem>
                    <SelectItem value="in_store">In-Store Desk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-foreground font-medium">Preferred Bay / Desk</label>
                <Select value={newSpotNumber} onValueChange={(val: string) => setNewSpotNumber(val)}>
                  <SelectTrigger className="h-8 text-xs">
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-foreground font-medium">Staging Aisle</label>
                <Input
                  value={newStagingAisle}
                  onChange={(e) => setNewStagingAisle(e.target.value)}
                  placeholder="e.g. Aisle 01"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-foreground font-medium">Staging Bin</label>
                <Input
                  value={newStagingBin}
                  onChange={(e) => setNewStagingBin(e.target.value)}
                  placeholder="e.g. Bin B-05"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground font-medium">Items Summary</label>
              <Input
                value={newItemSummary}
                onChange={(e) => setNewItemSummary(e.target.value)}
                placeholder="e.g. Noise Cancelling Earbuds, Travel Case"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground font-medium">Order Total ($)</label>
              <Input
                value={newOrderTotal}
                onChange={(e) => setNewOrderTotal(e.target.value)}
                placeholder="120.00"
                className="h-8 font-mono text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="text-xs">
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" className="text-xs" disabled={!newCustomerName} onClick={handleCreateNewOrder}>
              <span>Stage & Assign Bin</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StorePickupCurbside
