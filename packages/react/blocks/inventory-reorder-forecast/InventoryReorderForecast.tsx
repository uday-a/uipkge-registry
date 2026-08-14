'use client'

import * as React from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FileCheck,
  PackageCheck,
  PackagePlus,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type StockHealthStatus = 'critical' | 'warning' | 'healthy'

export interface ReorderItem {
  id: string
  sku: string
  name: string
  category: string
  supplier: string
  onHandStock: number
  safetyStockThreshold: number
  dailySalesVelocity: number
  velocityTrend: number
  daysOfInventoryRemaining: number
  supplierLeadTimeDays: number
  recommendedReorderQty: number
  unitCost: number
  estimatedPoCost: number
  status: StockHealthStatus
}

const reorderItems: ReorderItem[] = [
  {
    id: 'sku-1',
    sku: 'SKU-RN-105-BLK',
    name: 'Aero Minimalist Runner 10.5',
    category: 'Footwear',
    supplier: 'Apex Footwear Ltd',
    onHandStock: 42,
    safetyStockThreshold: 80,
    dailySalesVelocity: 12.4,
    velocityTrend: 14.2,
    daysOfInventoryRemaining: 3.4,
    supplierLeadTimeDays: 14,
    recommendedReorderQty: 250,
    unitCost: 50.0,
    estimatedPoCost: 12500.0,
    status: 'critical',
  },
  {
    id: 'sku-2',
    sku: 'SKU-PK-082-SLT',
    name: 'Technical Shell Parka L',
    category: 'Outerwear',
    supplier: 'Nordic Outerwear Co',
    onHandStock: 18,
    safetyStockThreshold: 50,
    dailySalesVelocity: 4.5,
    velocityTrend: 8.5,
    daysOfInventoryRemaining: 4.0,
    supplierLeadTimeDays: 21,
    recommendedReorderQty: 120,
    unitCost: 145.0,
    estimatedPoCost: 17400.0,
    status: 'critical',
  },
  {
    id: 'sku-3',
    sku: 'SKU-HD-419-PRO',
    name: 'Pro Studio Headphones',
    category: 'Electronics',
    supplier: 'Sonic Acoustics Inc',
    onHandStock: 65,
    safetyStockThreshold: 85,
    dailySalesVelocity: 8.2,
    velocityTrend: 5.0,
    daysOfInventoryRemaining: 7.9,
    supplierLeadTimeDays: 10,
    recommendedReorderQty: 100,
    unitCost: 110.0,
    estimatedPoCost: 11000.0,
    status: 'warning',
  },
  {
    id: 'sku-4',
    sku: 'SKU-CD-904-BRN',
    name: 'Leather Cardholder',
    category: 'Accessories',
    supplier: 'Tuscan Goods Ltd',
    onHandStock: 88,
    safetyStockThreshold: 100,
    dailySalesVelocity: 6.0,
    velocityTrend: 2.1,
    daysOfInventoryRemaining: 14.7,
    supplierLeadTimeDays: 12,
    recommendedReorderQty: 150,
    unitCost: 32.0,
    estimatedPoCost: 4800.0,
    status: 'warning',
  },
  {
    id: 'sku-5',
    sku: 'SKU-WC-331-WHT',
    name: 'Wireless Charger Mat',
    category: 'Electronics',
    supplier: 'Volt Innovations',
    onHandStock: 340,
    safetyStockThreshold: 120,
    dailySalesVelocity: 8.1,
    velocityTrend: -1.4,
    daysOfInventoryRemaining: 42.0,
    supplierLeadTimeDays: 7,
    recommendedReorderQty: 100,
    unitCost: 25.5,
    estimatedPoCost: 2550.0,
    status: 'healthy',
  },
]

export function InventoryReorderForecast({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [facility, setFacility] = React.useState('global-fulfillment')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const [createPoDialogOpen, setCreatePoDialogOpen] = React.useState(false)
  const [bulkPoDialogOpen, setBulkPoDialogOpen] = React.useState(false)
  const [selectedSkuItem, setSelectedSkuItem] = React.useState<ReorderItem | null>(null)
  const [customReorderQty, setCustomReorderQty] = React.useState<number>(250)
  const [selectedShippingMethod, setSelectedShippingMethod] = React.useState('standard-freight')

  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null)

  const filteredItems = React.useMemo(() => {
    return reorderItems.filter((item) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q)

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchQuery, categoryFilter, statusFilter])

  const criticalAndWarningItems = React.useMemo(() => {
    return reorderItems.filter((item) => item.status === 'critical' || item.status === 'warning')
  }, [])

  const dialogCalculatedCost = React.useMemo(() => {
    if (!selectedSkuItem) return 0
    return customReorderQty * selectedSkuItem.unitCost
  }, [selectedSkuItem, customReorderQty])

  const openCreatePoDialog = (item: ReorderItem) => {
    setSelectedSkuItem(item)
    setCustomReorderQty(item.recommendedReorderQty)
    setSelectedShippingMethod('standard-freight')
    setCreatePoDialogOpen(true)
  }

  const handleConfirmCreatePo = () => {
    if (!selectedSkuItem) return
    const poNumber = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`
    setActionFeedback(
      `Draft ${poNumber} created for ${selectedSkuItem.sku} (${customReorderQty} units · $${dialogCalculatedCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}) routed to ${selectedSkuItem.supplier}.`,
    )
    setCreatePoDialogOpen(false)
    setTimeout(() => {
      setActionFeedback(null)
    }, 4500)
  }

  const openBulkPoDialog = () => {
    setBulkPoDialogOpen(true)
  }

  const handleConfirmBulkPos = () => {
    setActionFeedback(
      `Successfully generated 4 Purchase Orders (Total $48,250.00) for Global Fulfillment Center replenishment.`,
    )
    setBulkPoDialogOpen(false)
    setTimeout(() => {
      setActionFeedback(null)
    }, 5000)
  }

  const handleExportPlan = () => {
    setActionFeedback(`Replenishment forecast plan for ${reorderItems.length} SKUs exported successfully as CSV.`)
    setTimeout(() => {
      setActionFeedback(null)
    }, 4000)
  }

  return (
    <div data-slot="inventory-reorder-forecast" className={cn('w-full space-y-6', className)} {...props}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Boxes className="size-4.5" />
            </div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Inventory Demand & Reorder Forecast
            </h1>
            <Badge
              variant="warning"
              className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />4 SKUs Need Reorder
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Multi-channel supply chain replenishment planner with lead-time demand forecasting and automated purchase
            order generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Facility Selector */}
          <Select value={facility} onValueChange={setFacility}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <Building2 className="text-muted-foreground size-4 shrink-0" />
              <SelectValue placeholder="Select fulfillment facility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global-fulfillment">Global Fulfillment Center</SelectItem>
              <SelectItem value="na-west-hub">North America West Distribution Hub</SelectItem>
              <SelectItem value="eu-central-dc">European Central Logistics Depot</SelectItem>
              <SelectItem value="apac-regional">APAC Regional Hub · Singapore</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Plan Button */}
          <Button
            aria-label="Download attachment"
            variant="outline"
            className="gap-1.5 shadow-xs"
            onClick={handleExportPlan}
          >
            <Download className="size-4" />
            Export Replenishment Plan
          </Button>

          {/* Primary Action: Generate Bulk POs */}
          <Button className="gap-1.5 shadow-xs" onClick={openBulkPoDialog}>
            <PackagePlus className="size-4" />
            Generate Bulk POs
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
            className="h-6 w-6 p-0"
            aria-label="Dismiss notification"
            onClick={() => setActionFeedback(null)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      )}

      {/* 4 Forecasting KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Critical Reorder SKUs */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Critical Reorder SKUs
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold tracking-tight text-amber-600 tabular-nums dark:text-amber-400">
                4 <span className="text-muted-foreground text-sm font-normal">SKUs</span>
              </div>
              <Badge variant="warning" className="text-xs font-normal">
                Action Required
              </Badge>
            </div>
            <p className="text-muted-foreground pt-1 text-xs">Below safety threshold · 2 in urgent stockout zone</p>
          </CardContent>
        </Card>

        {/* Metric 2: Estimated Stockout Days */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Estimated Stockout Days
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-baseline gap-2">
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
                6.4 <span className="text-muted-foreground text-sm font-normal">Days</span>
              </div>
              <Badge variant="destructive" className="text-xs font-normal">
                Critical Risk
              </Badge>
            </div>
            <p className="text-muted-foreground pt-1 text-xs">6.4 Days until stockout on top SKU · Urgent PO needed</p>
          </CardContent>
        </Card>

        {/* Metric 3: Suggested Purchase Order Value */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Suggested PO Value
            </CardTitle>
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$48,250.00</div>
            <p className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
              <span className="flex items-center font-medium text-emerald-600 dark:text-emerald-400">
                <Sparkles className="mr-1 inline size-3" />4 replenishment POs
              </span>
              <span>· 620 units total</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Inventory Turnover Rate */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Inventory Turnover Rate
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
              8.4x <span className="text-muted-foreground text-sm font-normal">/ year</span>
            </div>
            <p className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
              <span className="flex items-center font-medium text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="mr-0.5 inline size-3" />
                +1.2x
              </span>
              <span>vs industry benchmark (7.2x)</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reorder Demand Forecast Table Toolbar & Card */}
      <Card className="shadow-xs">
        <CardHeader className="border-border border-b pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <div className="relative w-full max-w-sm">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search SKU, product name, supplier..."
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
                  <SelectItem value="Footwear">Footwear</SelectItem>
                  <SelectItem value="Outerwear">Outerwear</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[170px] text-xs">
                  <SelectValue placeholder="All Health Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Status</SelectItem>
                  <SelectItem value="critical">Critical Stockout (&lt;7d)</SelectItem>
                  <SelectItem value="warning">Reorder Warning (7-15d)</SelectItem>
                  <SelectItem value="healthy">Healthy Stock (&gt;30d)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>
                Showing <strong className="text-foreground tabular-nums">{filteredItems.length}</strong> of{' '}
                {reorderItems.length} forecast SKUs
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Demand Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[240px] text-xs font-semibold">SKU Identifier & Product</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Current On-Hand</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Sales Velocity</TableHead>
                  <TableHead className="min-w-[150px] text-xs font-semibold">Days Remaining</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Supplier Lead Time</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Recommended Qty</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Est. PO Cost</TableHead>
                  <TableHead className="w-[120px] text-right text-xs font-semibold">Quick Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                    {/* SKU Identifier & Product Name */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <div className="text-foreground font-mono text-xs font-semibold">{item.sku}</div>
                        <div className="text-foreground text-sm font-medium">{item.name}</div>
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <span>{item.category}</span>
                          <span>·</span>
                          <span>{item.supplier}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Current On-Hand Stock */}
                    <TableCell className="py-3 text-right">
                      <div className="text-foreground text-sm font-semibold tabular-nums">
                        {item.onHandStock.toLocaleString()}{' '}
                        <span className="text-muted-foreground text-xs font-normal">units</span>
                      </div>
                      <div className="text-muted-foreground text-xs tabular-nums">
                        Safety: {item.safetyStockThreshold} units
                      </div>
                    </TableCell>

                    {/* Average Daily Sales Velocity */}
                    <TableCell className="py-3 text-right">
                      <div className="text-foreground text-sm font-semibold tabular-nums">
                        {item.dailySalesVelocity.toFixed(1)}{' '}
                        <span className="text-muted-foreground text-xs font-normal">units/day</span>
                      </div>
                      <div
                        className={cn(
                          'text-xs font-medium tabular-nums',
                          item.velocityTrend >= 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400',
                        )}
                      >
                        {item.velocityTrend >= 0 ? '+' : ''}
                        {item.velocityTrend.toFixed(1)}% 7d
                      </div>
                    </TableCell>

                    {/* Days of Inventory Remaining Badge */}
                    <TableCell className="py-3">
                      <div className="space-y-1.5">
                        {item.status === 'critical' ? (
                          <Badge variant="destructive" className="gap-1 font-mono text-xs font-semibold">
                            <AlertTriangle className="size-3" />
                            {item.daysOfInventoryRemaining.toFixed(1)} Days
                          </Badge>
                        ) : item.status === 'warning' ? (
                          <Badge
                            variant="warning"
                            className="gap-1 font-mono text-xs font-semibold text-amber-700 dark:text-amber-400"
                          >
                            <Clock className="size-3" />
                            {item.daysOfInventoryRemaining.toFixed(1)} Days
                          </Badge>
                        ) : (
                          <Badge variant="success" className="gap-1 font-mono text-xs font-semibold">
                            <CheckCircle2 className="size-3" />
                            {item.daysOfInventoryRemaining.toFixed(1)} Days
                          </Badge>
                        )}
                        <div className="text-muted-foreground text-xs">
                          {item.status === 'critical'
                            ? 'Stockout before delivery'
                            : item.status === 'warning'
                              ? 'Reorder buffer thin'
                              : 'Healthy inventory level'}
                        </div>
                      </div>
                    </TableCell>

                    {/* Supplier Lead Time */}
                    <TableCell className="py-3 text-right">
                      <div className="text-foreground font-mono text-sm font-semibold tabular-nums">
                        {item.supplierLeadTimeDays}{' '}
                        <span className="text-muted-foreground text-xs font-normal">Days</span>
                      </div>
                      <div className="text-muted-foreground text-xs">Mfg & Freight</div>
                    </TableCell>

                    {/* Recommended Reorder Qty */}
                    <TableCell className="py-3 text-right">
                      <div className="text-foreground text-sm font-bold tabular-nums">
                        {item.recommendedReorderQty}{' '}
                        <span className="text-muted-foreground text-xs font-normal">units</span>
                      </div>
                      <div className="text-muted-foreground text-xs">Optimal batch</div>
                    </TableCell>

                    {/* Estimated PO Cost */}
                    <TableCell className="py-3 text-right">
                      <div className="text-foreground font-mono text-sm font-bold tabular-nums">
                        ${item.estimatedPoCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-muted-foreground text-xs tabular-nums">
                        ${item.unitCost.toFixed(2)} / unit
                      </div>
                    </TableCell>

                    {/* Quick Action Button */}
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          className="gap-1 shadow-xs"
                          variant={item.status === 'critical' ? 'default' : 'outline'}
                          onClick={() => openCreatePoDialog(item)}
                        >
                          <PackageCheck className="size-3.5" />
                          Create PO
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-muted-foreground h-32 text-center text-sm">
                      No inventory forecast items match your current filter criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Purchase Order Draft Dialog */}
      <Dialog open={createPoDialogOpen} onOpenChange={setCreatePoDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                <PackageCheck className="size-4" />
              </div>
              <DialogTitle className="text-lg font-bold">Draft Purchase Order</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground text-xs">
              Review demand velocity, set purchase order quantity, and dispatch replenishment order to supplier.
            </DialogDescription>
          </DialogHeader>

          {selectedSkuItem && (
            <div className="space-y-4 py-2">
              {/* SKU Summary Banner */}
              <div className="border-border bg-muted/20 space-y-3 rounded-lg border p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-primary font-mono text-xs font-semibold">{selectedSkuItem.sku}</div>
                    <div className="text-foreground text-sm font-semibold">{selectedSkuItem.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {selectedSkuItem.supplier} · {selectedSkuItem.category}
                    </div>
                  </div>
                  <Badge
                    variant={
                      selectedSkuItem.status === 'critical'
                        ? 'destructive'
                        : selectedSkuItem.status === 'warning'
                          ? 'warning'
                          : 'success'
                    }
                    className="text-xs"
                  >
                    {selectedSkuItem.daysOfInventoryRemaining} Days Stock Left
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">On Hand:</span>
                    <p className="text-foreground font-semibold tabular-nums">{selectedSkuItem.onHandStock} units</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Daily Velocity:</span>
                    <p className="text-foreground font-semibold tabular-nums">
                      {selectedSkuItem.dailySalesVelocity} / day
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lead Time:</span>
                    <p className="text-foreground font-semibold tabular-nums">
                      {selectedSkuItem.supplierLeadTimeDays} Days
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Input & Quick Chips */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-foreground text-xs font-medium">Reorder Quantity (Units)</label>
                  <span className="text-muted-foreground text-xs">
                    Recommended: {selectedSkuItem.recommendedReorderQty} units
                  </span>
                </div>
                <Input
                  type="number"
                  min={1}
                  value={customReorderQty}
                  onChange={(e) => setCustomReorderQty(Number(e.target.value))}
                  className="text-xs tabular-nums sm:text-sm"
                />
                <div className="flex gap-1.5 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="flex-1 text-xs"
                    onClick={() => setCustomReorderQty(Math.round(selectedSkuItem.recommendedReorderQty * 0.5))}
                  >
                    50% ({Math.round(selectedSkuItem.recommendedReorderQty * 0.5)})
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="flex-1 text-xs"
                    onClick={() => setCustomReorderQty(selectedSkuItem.recommendedReorderQty)}
                  >
                    Recommended ({selectedSkuItem.recommendedReorderQty})
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="flex-1 text-xs"
                    onClick={() => setCustomReorderQty(Math.round(selectedSkuItem.recommendedReorderQty * 1.5))}
                  >
                    150% ({Math.round(selectedSkuItem.recommendedReorderQty * 1.5)})
                  </Button>
                </div>
              </div>

              {/* Shipping Freight Method */}
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Inbound Freight Method</label>
                <Select value={selectedShippingMethod} onValueChange={setSelectedShippingMethod}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard-freight">Standard Consolidated Freight (Est. 14 Days)</SelectItem>
                    <SelectItem value="expedited-air">Expedited Air Express (Est. 4 Days · +$420)</SelectItem>
                    <SelectItem value="ocean-container">Full Ocean Container FCL (Est. 28 Days · Economy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cost Calculation Summary Box */}
              <div className="border-border bg-muted/40 space-y-2 rounded-lg border p-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Unit Cost:</span>
                  <span className="text-foreground font-mono tabular-nums">${selectedSkuItem.unitCost.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Units to Order:</span>
                  <span className="text-foreground font-mono tabular-nums">{customReorderQty} units</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-foreground">Total Estimated PO Value:</span>
                  <span className="text-primary font-mono text-base font-bold tabular-nums">
                    $
                    {dialogCalculatedCost.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button className="gap-1.5" onClick={handleConfirmCreatePo}>
              <FileCheck className="size-4" />
              Generate Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk POs Generation Dialog */}
      <Dialog open={bulkPoDialogOpen} onOpenChange={setBulkPoDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                <PackagePlus className="size-4" />
              </div>
              <DialogTitle className="text-lg font-bold">Generate Bulk Purchase Orders</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground text-xs">
              Automatically create and batch replenishment purchase orders for all SKUs below safe safety threshold.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Summary Metrics */}
            <div className="border-border bg-muted/20 space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Destination Facility:</span>
                <Badge variant="outline" className="text-xs font-medium">
                  Global Fulfillment Center
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Total Purchase Orders:</span>
                <span className="text-foreground text-xs font-semibold tabular-nums">4 Vendor POs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Total Replenishment Units:</span>
                <span className="text-foreground text-xs font-semibold tabular-nums">620 Units</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-foreground text-xs font-semibold">Combined Total PO Value:</span>
                <span className="text-primary font-mono text-base font-bold tabular-nums">$48,250.00</span>
              </div>
            </div>

            {/* PO List Breakdown */}
            <div className="space-y-2">
              <div className="text-foreground text-xs font-semibold">Purchase Order Breakdown by Supplier</div>
              <div className="border-border space-y-2 rounded-md border p-2.5 text-xs">
                {criticalAndWarningItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1">
                    <div>
                      <span className="text-foreground font-medium">{item.supplier}</span>
                      <div className="text-muted-foreground font-mono text-xs">
                        {item.sku} ({item.recommendedReorderQty} units)
                      </div>
                    </div>
                    <span className="text-foreground font-mono font-semibold tabular-nums">
                      ${item.estimatedPoCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button className="gap-1.5" onClick={handleConfirmBulkPos}>
              <PackagePlus className="size-4" />
              Generate 4 Purchase Orders
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
