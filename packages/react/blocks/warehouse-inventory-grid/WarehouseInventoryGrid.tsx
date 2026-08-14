'use client'

import * as React from 'react'
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowUpRight,
  Barcode,
  Boxes,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  MoreHorizontal,
  Package,
  PackagePlus,
  Printer,
  QrCode,
  Search,
  Tag,
  Truck,
  Warehouse,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
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

export type StockStatus = 'in_stock' | 'low_stock'

export interface WarehouseItem {
  id: string
  sku: string
  barcode: string
  name: string
  category: string
  palletId: string
  zone: string
  binLocation: string
  aisle: string
  rack: string
  shelf: string
  onHand: number
  allocated: number
  available: number
  reorderThreshold: number
  unitVolume: string
  status: StockStatus
  lastCycleCount: string
}

const warehouseItems: WarehouseItem[] = [
  {
    id: 'wh-1',
    sku: '#SKU-84920',
    barcode: 'UPC-018249',
    name: 'Aero Runner 10.5 Matte Black',
    category: 'Footwear & Apparel',
    palletId: 'PLT-84920-04',
    zone: 'Zone A-West (High-Velocity)',
    binLocation: 'Aisle 04 · Rack B · Shelf 02',
    aisle: 'Aisle 04',
    rack: 'Rack B',
    shelf: 'Shelf 02',
    onHand: 450,
    allocated: 85,
    available: 365,
    reorderThreshold: 100,
    unitVolume: '0.04 m³',
    status: 'in_stock',
    lastCycleCount: '2 days ago',
  },
  {
    id: 'wh-2',
    sku: '#SKU-84921',
    barcode: 'UPC-029481',
    name: 'Technical Shell Jacket L',
    category: 'Outerwear',
    palletId: 'PLT-84921-02',
    zone: 'Zone A-North (Apparel Pick)',
    binLocation: 'Aisle 02 · Rack D · Shelf 01',
    aisle: 'Aisle 02',
    rack: 'Rack D',
    shelf: 'Shelf 01',
    onHand: 38,
    allocated: 30,
    available: 8,
    reorderThreshold: 50,
    unitVolume: '0.02 m³',
    status: 'low_stock',
    lastCycleCount: 'Yesterday',
  },
  {
    id: 'wh-3',
    sku: '#SKU-77210',
    barcode: 'UPC-093812',
    name: 'Heavy Duty Pallet Straps (50m)',
    category: 'Packaging & Materials',
    palletId: 'PLT-77210-09',
    zone: 'Zone B-Bulk (Industrial)',
    binLocation: 'Aisle 07 · Rack A · Shelf 04',
    aisle: 'Aisle 07',
    rack: 'Rack A',
    shelf: 'Shelf 04',
    onHand: 820,
    allocated: 140,
    available: 680,
    reorderThreshold: 200,
    unitVolume: '0.08 m³',
    status: 'in_stock',
    lastCycleCount: '5 days ago',
  },
  {
    id: 'wh-4',
    sku: '#SKU-99341',
    barcode: 'UPC-048201',
    name: 'Thermal Packaging Liner 24x24',
    category: 'Cold Chain Supplies',
    palletId: 'PLT-99341-01',
    zone: 'Zone C-Cold (Temp Controlled)',
    binLocation: 'Aisle 01 · Rack C · Shelf 03',
    aisle: 'Aisle 01',
    rack: 'Rack C',
    shelf: 'Shelf 03',
    onHand: 24,
    allocated: 18,
    available: 6,
    reorderThreshold: 60,
    unitVolume: '0.05 m³',
    status: 'low_stock',
    lastCycleCount: 'Today',
  },
  {
    id: 'wh-5',
    sku: '#SKU-65239',
    barcode: 'UPC-067194',
    name: 'Industrial Barcode Scanner BT',
    category: 'WMS Equipment',
    palletId: 'PLT-65239-03',
    zone: 'Zone D-Secure (High-Value)',
    binLocation: 'Aisle 09 · Rack A · Shelf 01',
    aisle: 'Aisle 09',
    rack: 'Rack A',
    shelf: 'Shelf 01',
    onHand: 115,
    allocated: 15,
    available: 100,
    reorderThreshold: 30,
    unitVolume: '0.01 m³',
    status: 'in_stock',
    lastCycleCount: '3 days ago',
  },
  {
    id: 'wh-6',
    sku: '#SKU-54018',
    barcode: 'UPC-081924',
    name: 'Anti-Static Bubble Wrap Roll',
    category: 'Packaging & Materials',
    palletId: 'PLT-54018-05',
    zone: 'Zone B-Bulk (Packaging Bay)',
    binLocation: 'Aisle 06 · Rack E · Shelf 02',
    aisle: 'Aisle 06',
    rack: 'Rack E',
    shelf: 'Shelf 02',
    onHand: 190,
    allocated: 45,
    available: 145,
    reorderThreshold: 75,
    unitVolume: '0.12 m³',
    status: 'in_stock',
    lastCycleCount: '1 week ago',
  },
]

export function WarehouseInventoryGrid({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [facility, setFacility] = React.useState('bay-area')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [zoneFilter, setZoneFilter] = React.useState('all')

  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<'transfer' | 'receive'>('transfer')
  const [selectedItem, setSelectedItem] = React.useState<WarehouseItem | null>(null)

  const [transferDestination, setTransferDestination] = React.useState('bin-dest-1')
  const [transferQty, setTransferQty] = React.useState(50)
  const [transferPalletId, setTransferPalletId] = React.useState('PLT-84920-04')
  const [transferReason, setTransferReason] = React.useState('reslotting')

  const [receivePo, setReceivePo] = React.useState('po-8910')
  const [receiveSku, setReceiveSku] = React.useState('SKU-84920')
  const [receiveQty, setReceiveQty] = React.useState(250)
  const [receiveBin, setReceiveBin] = React.useState('bay-02')

  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null)

  const filteredItems = React.useMemo(() => {
    return warehouseItems.filter((item) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.barcode.toLowerCase().includes(q) ||
        item.binLocation.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesZone = zoneFilter === 'all' || item.zone.toLowerCase().includes(zoneFilter.toLowerCase())

      return matchesSearch && matchesCategory && matchesStatus && matchesZone
    })
  }, [searchQuery, categoryFilter, statusFilter, zoneFilter])

  const openTransferDrawer = (item?: WarehouseItem) => {
    const target = item || warehouseItems[0]
    setSelectedItem(target)
    setTransferPalletId(target.palletId)
    setTransferQty(Math.min(50, target.available))
    setDrawerMode('transfer')
    setDrawerOpen(true)
  }

  const openReceiveDrawer = () => {
    setDrawerMode('receive')
    setDrawerOpen(true)
  }

  const handleConfirmTransfer = () => {
    if (!selectedItem) return
    setActionFeedback(`Successfully relocated ${transferQty} units of ${selectedItem.sku} to destination bin.`)
    setDrawerOpen(false)
    setTimeout(() => {
      setActionFeedback(null)
    }, 4000)
  }

  const handleConfirmReceive = () => {
    setActionFeedback(`Received ${receiveQty} units for ${receivePo.toUpperCase()} staged into Bay 02.`)
    setDrawerOpen(false)
    setTimeout(() => {
      setActionFeedback(null)
    }, 4000)
  }

  const handlePrintBarcode = (item: WarehouseItem) => {
    setActionFeedback(`Barcode label queued for ${item.sku} (${item.barcode}) on Zebra Printer #2.`)
    setTimeout(() => {
      setActionFeedback(null)
    }, 3500)
  }

  const handleCycleCount = (item: WarehouseItem) => {
    setActionFeedback(`Cycle count logged and verified for bin ${item.binLocation}.`)
    setTimeout(() => {
      setActionFeedback(null)
    }, 3500)
  }

  return (
    <div data-slot="warehouse-inventory-grid" className={cn('w-full space-y-6', className)} {...props}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Warehouse className="size-4.5 shrink-0" />
            </div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Warehouse Inventory & Bin Locations
            </h1>
            <Badge
              wrap
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
              WMS Live
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Real-time multi-bin locator, safety stock reorder thresholds, and pallet relocation manifests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Warehouse Facility Select */}
          <Select value={facility} onValueChange={setFacility}>
            <SelectTrigger className="w-full sm:w-[320px]">
              <Building2 className="text-muted-foreground size-4 shrink-0" />
              <SelectValue placeholder="Select warehouse facility" className="min-w-0 truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bay-area">Bay Area Fulfillment Center #04 · Aisle A-D</SelectItem>
              <SelectItem value="seattle">Seattle Logistics Hub #02 · High-Bay B</SelectItem>
              <SelectItem value="dallas">Dallas Central Depot #01 · Mezzanine C</SelectItem>
              <SelectItem value="newark">Newark Cold Chain #03 · Zone Free-01</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-1.5" onClick={() => openTransferDrawer()}>
            <ArrowRightLeft className="size-4 shrink-0" />
            Relocate Bin
          </Button>

          <Button className="gap-1.5 shadow-xs" onClick={openReceiveDrawer}>
            <PackagePlus className="size-4 shrink-0" />
            Receive Inventory
          </Button>
        </div>
      </div>

      {/* Notification / Action Feedback Banner */}
      {actionFeedback && (
        <div className="border-primary/20 bg-primary/5 text-foreground flex items-center justify-between rounded-lg border px-4 py-3 text-sm shadow-xs transition-all">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            <span className="text-xs font-medium sm:text-sm">{actionFeedback}</span>
          </div>
          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 shrink-0 p-0"
            aria-label="Dismiss notification"
            onClick={() => setActionFeedback(null)}
          >
            <X className="size-3.5 shrink-0" />
          </Button>
        </div>
      )}

      {/* 4 WMS Inventory Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total SKUs */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Total SKUs in Stock
            </CardTitle>
            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
              <Package className="size-4 shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
              1,842 <span className="text-muted-foreground text-sm font-normal">SKUs</span>
            </div>
            <p className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
              <span className="flex items-center font-medium text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="mr-0.5 inline size-3 shrink-0" />
                +48 SKUs
              </span>
              <span>· 99.4% count accuracy</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Warehouse Capacity */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Warehouse Capacity
            </CardTitle>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Boxes className="size-4 shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">84.5%</div>
              <span className="text-muted-foreground text-xs tabular-nums">12,400 / 14,800 pallets</span>
            </div>
            <Progress value={84.5} className="h-1.5" />
            <p className="text-muted-foreground text-xs">2,400 available slots in High-Bay & Bulk</p>
          </CardContent>
        </Card>

        {/* Metric 3: Low Stock Alerts */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Low Stock Alerts
            </CardTitle>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-4 shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold tracking-tight text-amber-600 tabular-nums dark:text-amber-400">
                12
              </div>
              <Badge wrap variant="warning" className="text-xs font-normal">
                Action required
              </Badge>
            </div>
            <p className="text-muted-foreground pt-1 text-xs">Below safety stock threshold · 4 POs in transit</p>
          </CardContent>
        </Card>

        {/* Metric 4: Inbound Shipments Today */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Inbound Shipments Today
            </CardTitle>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Truck className="size-4 shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
              4 <span className="text-muted-foreground text-sm font-normal">POs arriving</span>
            </div>
            <p className="text-muted-foreground pt-1 text-xs">2,450 units expected by 16:00 · Bay 02 & 05</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Filter & Search Toolbar */}
      <Card className="shadow-xs">
        <CardHeader className="border-border border-b pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <div className="relative w-full min-w-0 md:max-w-sm">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 shrink-0 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search SKU or product"
                  className="h-9 pl-9 text-xs sm:text-sm"
                />
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-9 w-[160px] text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Footwear & Apparel">Footwear & Apparel</SelectItem>
                  <SelectItem value="Outerwear">Outerwear</SelectItem>
                  <SelectItem value="Packaging & Materials">Packaging & Materials</SelectItem>
                  <SelectItem value="Cold Chain Supplies">Cold Chain Supplies</SelectItem>
                  <SelectItem value="WMS Equipment">WMS Equipment</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[140px] text-xs">
                  <SelectValue placeholder="All Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock (Reorder)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>
                Showing <strong className="text-foreground tabular-nums">{filteredItems.length}</strong> of{' '}
                {warehouseItems.length} inventory items
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[180px] text-xs font-semibold">SKU & Barcode</TableHead>
                  <TableHead className="min-w-[220px] text-xs font-semibold">Item & Category</TableHead>
                  <TableHead className="min-w-[210px] text-xs font-semibold">Bin / Rack Location</TableHead>
                  <TableHead className="text-right text-xs font-semibold">On Hand</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Allocated</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Available (ATP)</TableHead>
                  <TableHead className="min-w-[160px] text-xs font-semibold">Reorder & Status</TableHead>
                  <TableHead className="w-[60px] text-right text-xs font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                    {/* SKU & Barcode */}
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <div className="text-foreground font-mono text-xs font-semibold">{item.sku}</div>
                        <div className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                          <Barcode className="text-muted-foreground/70 size-3 shrink-0" />
                          <span>{item.barcode}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Item Name & Category */}
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <div className="text-foreground text-sm font-medium">{item.name}</div>
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <span>{item.category}</span>
                          <span>·</span>
                          <span className="font-mono text-xs">{item.palletId}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Bin / Rack Location Badge */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <Badge wrap variant="outline" className="bg-muted/30 gap-1.5 font-mono text-xs font-medium">
                          <Tag className="text-primary size-3 shrink-0" />
                          {item.binLocation}
                        </Badge>
                        <div className="text-muted-foreground text-xs">{item.zone}</div>
                      </div>
                    </TableCell>

                    {/* On Hand */}
                    <TableCell className="py-3 text-right">
                      <div className="text-foreground text-sm font-semibold tabular-nums">
                        {item.onHand.toLocaleString()}{' '}
                        <span className="text-muted-foreground text-xs font-normal">units</span>
                      </div>
                      <div className="text-muted-foreground text-xs tabular-nums">{item.unitVolume}</div>
                    </TableCell>

                    {/* Allocated */}
                    <TableCell className="py-3 text-right">
                      <div className="text-muted-foreground text-sm font-medium tabular-nums">
                        {item.allocated.toLocaleString()}{' '}
                        <span className="text-muted-foreground text-xs font-normal">units</span>
                      </div>
                      <div className="text-muted-foreground text-xs tabular-nums">
                        {Math.round((item.allocated / item.onHand) * 100)}% reserved
                      </div>
                    </TableCell>

                    {/* Available (ATP) */}
                    <TableCell className="py-3 text-right">
                      <div className="text-foreground text-sm font-bold tabular-nums">
                        {item.available.toLocaleString()}{' '}
                        <span className="text-muted-foreground text-xs font-normal">units</span>
                      </div>
                      <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Ready to pick</div>
                    </TableCell>

                    {/* Reorder Threshold & Status */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        {item.status === 'in_stock' ? (
                          <Badge wrap variant="success" className="gap-1 text-xs">
                            <CheckCircle2 className="size-3 shrink-0" />
                            In Stock
                          </Badge>
                        ) : (
                          <Badge wrap variant="warning" className="gap-1 text-xs">
                            <AlertTriangle className="size-3 shrink-0" />
                            Low Stock - Reorder
                          </Badge>
                        )}
                        <div className="text-muted-foreground text-xs tabular-nums">
                          Min safety: {item.reorderThreshold} units
                        </div>
                      </div>
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="size-8 shrink-0">
                            <MoreHorizontal className="size-4 shrink-0" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-muted-foreground text-xs">Bin Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openTransferDrawer(item)}>
                            <ArrowRightLeft className="text-muted-foreground size-4 shrink-0" />
                            Transfer / Relocate Bin
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => handlePrintBarcode(item)}>
                            <Printer className="text-muted-foreground size-4 shrink-0" />
                            Print Barcode Label
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => handleCycleCount(item)}>
                            <ClipboardCheck className="text-muted-foreground size-4 shrink-0" />
                            Log Cycle Count
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer gap-2 text-amber-600 dark:text-amber-400"
                            onClick={openReceiveDrawer}
                          >
                            <PackagePlus className="size-4 shrink-0" />
                            Receive Restock Batch
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-muted-foreground h-32 text-center text-sm">
                      No warehouse inventory items found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Transfer / Relocate Bin Drawer (Sheet) */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full space-y-6 overflow-y-auto p-6 sm:max-w-md">
          {/* Drawer Header */}
          <SheetHeader className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
                {drawerMode === 'transfer' ? (
                  <ArrowRightLeft className="size-4 shrink-0" />
                ) : (
                  <PackagePlus className="size-4 shrink-0" />
                )}
              </div>
              <SheetTitle className="text-lg font-bold">
                {drawerMode === 'transfer' ? 'Relocate Bin / Pallet Transfer' : 'Receive Inventory Inbound'}
              </SheetTitle>
            </div>
            <SheetDescription className="text-muted-foreground text-xs">
              {drawerMode === 'transfer'
                ? 'Relocate inventory pallets between rack coordinates and generate WMS transfer manifests.'
                : 'Process inbound freight shipments, inspect UPC barcodes, and assign initial staging bins.'}
            </SheetDescription>
          </SheetHeader>

          {/* Mode: Transfer Bin */}
          {drawerMode === 'transfer' && selectedItem && (
            <div className="space-y-4">
              {/* Item Card Summary */}
              <div className="border-border bg-muted/20 space-y-3 rounded-lg border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-primary font-mono text-xs font-semibold">{selectedItem.sku}</div>
                    <div className="text-foreground text-sm font-medium">{selectedItem.name}</div>
                    <div className="text-muted-foreground text-xs">{selectedItem.category}</div>
                  </div>
                  <Badge wrap variant="outline" className="font-mono text-xs">
                    {selectedItem.palletId}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground">Current Bin:</span>
                    <p className="text-foreground mt-0.5 font-mono text-xs font-medium">{selectedItem.binLocation}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available to Move:</span>
                    <p className="mt-0.5 font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                      {selectedItem.available} units
                    </p>
                  </div>
                </div>
              </div>

              {/* Transfer Form Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-medium">Destination Rack / Bin Location</label>
                  <Select value={transferDestination} onValueChange={setTransferDestination}>
                    <SelectTrigger className="w-full text-xs">
                      <SelectValue placeholder="Select target bin location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bin-dest-1">
                        Aisle 01 · Rack A · Shelf 03 (Zone A-North · Standard Rack)
                      </SelectItem>
                      <SelectItem value="bin-dest-2">Aisle 03 · Rack B · Shelf 01 (Zone A-West · Fast-Pick)</SelectItem>
                      <SelectItem value="bin-dest-3">Aisle 08 · Rack C · Shelf 04 (Zone B-Bulk · High-Bay)</SelectItem>
                      <SelectItem value="bin-dest-4">Aisle 05 · Rack D · Shelf 02 (Zone C-Cold · Cold Bay)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-foreground text-xs font-medium">Transfer Quantity (Units)</label>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      Max: {selectedItem.available} units
                    </span>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    max={selectedItem.available}
                    value={transferQty}
                    onChange={(e) => setTransferQty(Number(e.target.value))}
                    className="text-xs tabular-nums sm:text-sm"
                  />
                  <div className="flex gap-1.5 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="flex-1 text-xs"
                      onClick={() => setTransferQty(Math.min(25, selectedItem.available))}
                    >
                      25
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="flex-1 text-xs"
                      onClick={() => setTransferQty(Math.min(50, selectedItem.available))}
                    >
                      50
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="flex-1 text-xs"
                      onClick={() => setTransferQty(Math.min(100, selectedItem.available))}
                    >
                      100
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="flex-1 text-xs"
                      onClick={() => setTransferQty(selectedItem.available)}
                    >
                      All ({selectedItem.available})
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-medium">Pallet ID / Batch Lot</label>
                  <Input
                    value={transferPalletId}
                    onChange={(e) => setTransferPalletId(e.target.value)}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-medium">Transfer Reason</label>
                  <Select value={transferReason} onValueChange={setTransferReason}>
                    <SelectTrigger className="w-full text-xs">
                      <SelectValue placeholder="Select transfer reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reslotting">Zone Re-slotting (Velocity Optimization)</SelectItem>
                      <SelectItem value="consolidation">Consolidation & Space Reclamation</SelectItem>
                      <SelectItem value="staging">Fast-Pick Outbound Wave Staging</SelectItem>
                      <SelectItem value="rack-repair">Damaged Rack Maintenance Relocation</SelectItem>
                      <SelectItem value="quarantine">Quarantine & Quality Audit Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Verified Scanner / Operator Badge */}
                <div className="border-border bg-muted/40 space-y-1 rounded-md border p-3 text-xs">
                  <div className="text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <QrCode className="text-primary size-3.5 shrink-0" />
                      WMS Scanner Terminal
                    </span>
                    <span className="text-foreground font-mono font-medium">TC57-OP44</span>
                  </div>
                  <p className="text-muted-foreground">Operator: Marcus Vance (Badge #OP-921)</p>
                </div>
              </div>
            </div>
          )}

          {/* Mode: Receive Inbound PO */}
          {drawerMode === 'receive' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Inbound Purchase Order</label>
                <Select value={receivePo} onValueChange={setReceivePo}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Select purchase order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="po-8910">PO-2026-8910 · Acme Footwear Corp (500 units)</SelectItem>
                    <SelectItem value="po-8914">PO-2026-8914 · Pacific Packaging Ltd (1,200 units)</SelectItem>
                    <SelectItem value="po-8919">PO-2026-8919 · Thermal Supply Chain Co (750 units)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Target SKU / Barcode</label>
                <Input
                  value={receiveSku}
                  onChange={(e) => setReceiveSku(e.target.value)}
                  placeholder="#SKU-84920 or UPC code"
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Received Quantity (Units)</label>
                <Input
                  type="number"
                  value={receiveQty}
                  onChange={(e) => setReceiveQty(Number(e.target.value))}
                  className="text-xs tabular-nums"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Assigned Inbound Staging Bay</label>
                <Select value={receiveBin} onValueChange={setReceiveBin}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Select staging bin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bay-02">Staging Bay Inbound-02 (Aisle 00 · Cross-Dock)</SelectItem>
                    <SelectItem value="bay-05">Staging Bay Inbound-05 (Cold Holding)</SelectItem>
                    <SelectItem value="bay-08">Bulk Floor Staging Area B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-foreground space-y-1 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3.5 shrink-0" />
                  Inbound Freight Scan Ready
                </div>
                <p className="text-muted-foreground">
                  Pallet tags will be generated and printed automatically upon receipt confirmation.
                </p>
              </div>
            </div>
          )}

          {/* Drawer Footer */}
          <SheetFooter className="border-border flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
            <SheetClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </SheetClose>
            {drawerMode === 'transfer' ? (
              <Button className="w-full gap-1.5 sm:w-auto" onClick={handleConfirmTransfer}>
                <ArrowRightLeft className="size-4 shrink-0" />
                Confirm Bin Transfer
              </Button>
            ) : (
              <Button className="w-full gap-1.5 sm:w-auto" onClick={handleConfirmReceive}>
                <ArrowDownToLine className="size-4 shrink-0" />
                Confirm Receipt
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
