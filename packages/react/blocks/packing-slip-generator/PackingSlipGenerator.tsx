'use client'

import * as React from 'react'
import {
  Box,
  Building2,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  Copy,
  FileDown,
  MapPin,
  Printer,
  QrCode,
  RotateCcw,
  Scan,
  ShieldCheck,
  Tag,
  Truck,
  User,
  Warehouse,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface PackingSlipItem {
  id: string
  sku: string
  barcode: string
  name: string
  variant: string
  location: string
  qtyOrdered: number
  qtyPacked: number
  weightLbs: number
  notes?: string
  initialPacked?: boolean
}

export interface PackingSlipProps {
  className?: string
  packingSlipNo?: string
  orderNo?: string
  carrier?: string
  carrierService?: string
  trackingNo?: string
  orderDate?: string
  shipDate?: string
  warehouseName?: string
  warehouseFacility?: string
  warehouseAddress?: string
  warehousePhone?: string
  warehouseEmail?: string
  customerName?: string
  customerCompany?: string
  customerAddress?: string
  customerPhone?: string
  customerEmail?: string
  deliveryNotes?: string
  pickerName?: string
  pickerId?: string
  packStation?: string
  shift?: string
  boxSize?: string
  dunnageType?: string
  qcInspector?: string
  qcStamp?: string
  qcTimestamp?: string
  items?: PackingSlipItem[]
  showActions?: boolean
  initialPackedAll?: boolean
}

const defaultItems: PackingSlipItem[] = [
  {
    id: 'item-1',
    sku: '#SKU-84920',
    barcode: '849201928410',
    name: 'Aero Minimalist Runner',
    variant: 'Size 10.5 · Matte Black',
    location: 'Aisle 04 · Rack B · Shelf 02',
    qtyOrdered: 1,
    qtyPacked: 1,
    weightLbs: 1.8,
    notes: 'Eco-Knit Upper / EVA Cushioning Sole',
    initialPacked: true,
  },
  {
    id: 'item-2',
    sku: '#SKU-77219',
    barcode: '772198421093',
    name: 'HydroShield Waterproof Shell Jacket',
    variant: "Men's M · Alpine Green",
    location: 'Aisle 02 · Rack D · Shelf 01',
    qtyOrdered: 1,
    qtyPacked: 1,
    weightLbs: 1.6,
    notes: '3-Layer DWR Membrane / Sealed Seams',
    initialPacked: true,
  },
  {
    id: 'item-3',
    sku: '#SKU-31904',
    barcode: '319045812903',
    name: 'Ergonomic Trail Crew Socks (3-Pack)',
    variant: 'Charcoal / Grey · L',
    location: 'Aisle 08 · Rack A · Shelf 04',
    qtyOrdered: 1,
    qtyPacked: 1,
    weightLbs: 1.4,
    notes: 'Merino Wool Blend / Seamless Toe',
    initialPacked: false,
  },
]

export function PackingSlipGenerator({
  className,
  packingSlipNo = '#PS-849201',
  orderNo = '#ORD-92841',
  carrier = 'FedEx',
  carrierService = 'FedEx 2-Day Air',
  trackingNo = '7849 2018 9284 1029',
  orderDate = 'Aug 21, 2026',
  shipDate = 'Aug 21, 2026',
  warehouseName = 'Apex Retail Warehouse #04',
  warehouseFacility = 'West Coast Omnichannel Hub',
  warehouseAddress = '1040 North Industry Pkwy, Reno, NV 89502',
  warehousePhone = '+1 (800) 555-0199',
  warehouseEmail = 'fulfillment-reno4@apexretail.io',
  customerName = 'Eleanor Vance',
  customerCompany = 'Vance Design Studios · Suite 400',
  customerAddress = '742 Evergreen Terrace, Springfield, OR 97477',
  customerPhone = '+1 (555) 839-2019',
  customerEmail = 'eleanor.vance@vancestudios.design',
  deliveryNotes = 'Gate Code: #4829. Leave at covered front porch if unavailable. Do not bend.',
  pickerName = 'Marcus Vance',
  pickerId = '#EMP-4821',
  packStation = 'Pack Station #4',
  shift = 'Morning Shift · Bay Alpha',
  boxSize = 'Box #3 · 14" × 10" × 6"',
  dunnageType = 'Recycled Kraft Void Fill (1.2 oz)',
  qcInspector = 'Elena Rostova (#QC-89)',
  qcStamp = 'QC Passed · Station #4',
  qcTimestamp = '2026-08-21 09:42 PST',
  items = defaultItems,
  showActions = true,
  initialPackedAll = false,
}: PackingSlipProps) {
  const effectiveItems = items && items.length > 0 ? items : defaultItems

  const [packedState, setPackedState] = React.useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    for (const item of effectiveItems) {
      map[item.id] = initialPackedAll ? true : (item.initialPacked ?? false)
    }
    return map
  })

  const [copiedTracking, setCopiedTracking] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)

  const totalOrderedUnits = effectiveItems.reduce((sum, item) => sum + item.qtyOrdered, 0)
  const totalPackedUnits = effectiveItems.reduce((sum, item) => {
    return sum + (packedState[item.id] ? item.qtyPacked : 0)
  }, 0)
  const totalWeight = effectiveItems.reduce((sum, item) => sum + item.weightLbs, 0)

  const verifiedItemsCount = effectiveItems.filter((item) => packedState[item.id]).length
  const isAllPacked = effectiveItems.every((item) => packedState[item.id])
  const progressPercentage =
    effectiveItems.length === 0 ? 0 : Math.round((verifiedItemsCount / effectiveItems.length) * 100)

  const toggleItemPacked = (id: string) => {
    setPackedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const setItemPacked = (id: string, checked: boolean | 'indeterminate') => {
    setPackedState((prev) => ({
      ...prev,
      [id]: checked === true,
    }))
  }

  const markAllPacked = () => {
    const next: Record<string, boolean> = {}
    for (const item of effectiveItems) {
      next[item.id] = true
    }
    setPackedState(next)
  }

  const resetPackingChecklist = () => {
    const next: Record<string, boolean> = {}
    for (const item of effectiveItems) {
      next[item.id] = false
    }
    setPackedState(next)
  }

  const copyTrackingNumber = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(trackingNo)
      setCopiedTracking(true)
      setTimeout(() => {
        setCopiedTracking(false)
      }, 2000)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleDownloadPdf = () => {
    setIsDownloading(true)
    setTimeout(() => {
      setIsDownloading(false)
    }, 1500)
  }

  return (
    <div data-slot="packing-slip-generator" className={cn('w-full space-y-6', className)}>
      {/* Top Action & Fulfillment Toolbar (Screen Only) */}
      {showActions && (
        <div className="no-print border-border bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-mono text-sm font-semibold tracking-tight">{packingSlipNo}</span>
              <Badge variant="outline" className="gap-1 font-mono text-xs">
                <Tag className="text-muted-foreground size-3" aria-hidden="true" />
                {orderNo}
              </Badge>
            </div>

            <Separator orientation="vertical" className="hidden h-4 sm:block" />

            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Truck className="text-primary size-3.5" aria-hidden="true" />
              <span className="text-foreground font-medium">{carrierService}</span>
            </div>

            <Badge variant={isAllPacked ? 'default' : 'secondary'} className="gap-1 text-xs font-medium">
              {isAllPacked ? (
                <CheckCircle2 className="size-3" aria-hidden="true" />
              ) : (
                <Clock className="size-3" aria-hidden="true" />
              )}
              {isAllPacked
                ? 'All Items Verified'
                : `${verifiedItemsCount}/${effectiveItems.length} Packed (${progressPercentage}%)`}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-medium"
              onClick={isAllPacked ? resetPackingChecklist : markAllPacked}
            >
              {isAllPacked ? (
                <RotateCcw className="size-3.5" aria-hidden="true" />
              ) : (
                <CheckCheck className="size-3.5" aria-hidden="true" />
              )}
              {isAllPacked ? 'Reset Checklist' : 'Verify All'}
            </Button>

            <Button
              aria-label="Download attachment"
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-medium"
              disabled={isDownloading}
              onClick={handleDownloadPdf}
            >
              <FileDown className="size-3.5" aria-hidden="true" />
              {isDownloading ? 'Generating PDF...' : 'Download PDF'}
            </Button>

            <Button type="button" size="sm" className="gap-1.5 text-xs font-medium" onClick={handlePrint}>
              <Printer className="size-3.5" aria-hidden="true" />
              Print 4x6 Slip
            </Button>
          </div>
        </div>
      )}

      {/* Printable Packing Slip Paper Container */}
      <div className="packing-slip-paper border-border bg-card mx-auto w-full max-w-4xl space-y-6 rounded-xl border p-6 shadow-md transition-shadow sm:p-8">
        {/* Section 1: Warehouse & Slip Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg shadow-xs">
                <Warehouse className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-foreground text-base font-semibold tracking-tight sm:text-lg">{warehouseName}</h2>
                <p className="text-muted-foreground text-xs">{warehouseFacility}</p>
              </div>
            </div>
            <div className="text-muted-foreground text-xs">
              <p>{warehouseAddress}</p>
              <p className="mt-0.5">
                {warehousePhone} · {warehouseEmail}
              </p>
            </div>
          </div>

          {/* Slip Meta & Barcode Header */}
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="border-primary/20 bg-primary/5 text-primary inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold">
              COMMERCIAL PACKING SLIP
            </div>
            <div className="space-y-1 text-left text-xs sm:text-right">
              <div className="flex items-center gap-2 sm:justify-end">
                <span className="text-muted-foreground">Packing Slip Ref:</span>
                <span className="text-foreground font-mono font-semibold">{packingSlipNo}</span>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <span className="text-muted-foreground">Order Reference:</span>
                <span className="text-foreground font-mono font-semibold">{orderNo}</span>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="text-foreground font-medium">{orderDate}</span>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <span className="text-muted-foreground">Ship Date:</span>
                <span className="text-foreground font-medium">{shipDate}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Section 2: Routing Grid (Ship-To, Origin, Carrier) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Ship-To Customer Details */}
          <div className="border-border/80 bg-muted/20 rounded-lg border p-4">
            <div className="text-muted-foreground mb-2.5 flex items-center gap-2 text-xs font-medium">
              <User className="text-primary size-3.5" aria-hidden="true" />
              Ship-To Recipient
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-foreground text-sm font-semibold">{customerName}</p>
              <p className="text-foreground/80 font-medium">{customerCompany}</p>
              <p className="text-muted-foreground">{customerAddress}</p>
              <p className="text-muted-foreground">{customerPhone}</p>
              {deliveryNotes && (
                <div className="mt-2.5 rounded border border-amber-500/20 bg-amber-500/10 p-2 text-amber-900 dark:text-amber-200">
                  <p className="text-xs font-semibold">Delivery Note:</p>
                  <p className="text-xs">{deliveryNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ship-From Origin Hub */}
          <div className="border-border/80 bg-muted/20 rounded-lg border p-4">
            <div className="text-muted-foreground mb-2.5 flex items-center gap-2 text-xs font-medium">
              <Building2 className="text-primary size-3.5" aria-hidden="true" />
              Fulfillment Origin
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-foreground text-sm font-semibold">{warehouseName}</p>
              <p className="text-foreground/80 font-medium">Outbound Logistics Dock #12</p>
              <p className="text-muted-foreground">{warehouseAddress}</p>
              <p className="text-muted-foreground">Support: {warehousePhone}</p>
              <div className="text-muted-foreground mt-2.5 flex items-center gap-1.5 text-xs">
                <Zap className="size-3 text-emerald-500" aria-hidden="true" />
                <span>Direct EDI Dispatch Cleared</span>
              </div>
            </div>
          </div>

          {/* Carrier & Logistics Routing */}
          <div className="border-border/80 bg-muted/20 rounded-lg border p-4">
            <div className="text-muted-foreground mb-2.5 flex items-center gap-2 text-xs font-medium">
              <Truck className="text-primary size-3.5" aria-hidden="true" />
              Carrier & Service
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-foreground text-sm font-semibold">{carrierService}</p>
                <p className="text-muted-foreground">Standard Air Parcel · Guaranteed</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tracking Number:</span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-foreground font-mono text-xs font-semibold">{trackingNo}</span>
                  <button
                    type="button"
                    className="no-print border-border hover:bg-muted focus-visible:ring-ring inline-flex size-6 items-center justify-center rounded border focus-visible:ring-2 focus-visible:outline-none"
                    title="Copy Tracking Number"
                    onClick={copyTrackingNumber}
                  >
                    {copiedTracking ? (
                      <Check className="text-muted-foreground size-3" aria-hidden="true" />
                    ) : (
                      <Copy className="text-muted-foreground size-3" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-muted-foreground border-border/40 flex items-center justify-between border-t pt-1 text-xs">
                <span>Billing: Prepaid</span>
                <span className="font-mono">Declared: $349.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Picker & Pack Station Barcode Verification Ribbon */}
        <div className="border-border bg-muted/40 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <User className="text-primary size-3.5" aria-hidden="true" />
                Picker & Station
              </div>
              <p className="text-foreground text-sm font-semibold">
                {pickerName} <span className="text-muted-foreground font-mono text-xs font-normal">({pickerId})</span>
              </p>
              <p className="text-muted-foreground text-xs">
                {packStation} · {shift}
              </p>
            </div>

            <Separator orientation="vertical" className="hidden h-10 md:block" />

            <div className="space-y-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <Scan className="text-primary size-3.5" aria-hidden="true" />
                Packing Progress
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-muted border-border/50 h-2 w-28 overflow-hidden rounded-full border">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-foreground font-mono text-xs font-semibold tabular-nums">
                  {verifiedItemsCount}/{effectiveItems.length} Verified
                </span>
              </div>
            </div>
          </div>

          {/* Authentic Code 128 Simulated Barcode Scan Tag */}
          <div className="border-border/60 bg-background/80 flex flex-col items-center justify-center rounded border px-3 py-2 text-center shadow-2xs sm:items-end">
            <div className="flex h-8 items-center gap-[2px]" aria-label="Barcode">
              <span className="bg-foreground h-8 w-[3px]" />
              <span className="h-8 w-[1px] bg-transparent" />
              <span className="bg-foreground h-8 w-[2px]" />
              <span className="h-8 w-[1px] bg-transparent" />
              <span className="bg-foreground h-8 w-[4px]" />
              <span className="h-8 w-[2px] bg-transparent" />
              <span className="bg-foreground h-8 w-[1px]" />
              <span className="bg-foreground h-8 w-[3px]" />
              <span className="h-8 w-[1px] bg-transparent" />
              <span className="bg-foreground h-8 w-[5px]" />
              <span className="h-8 w-[2px] bg-transparent" />
              <span className="bg-foreground h-8 w-[2px]" />
              <span className="h-8 w-[1px] bg-transparent" />
              <span className="bg-foreground h-8 w-[4px]" />
              <span className="h-8 w-[2px] bg-transparent" />
              <span className="bg-foreground h-8 w-[3px]" />
              <span className="h-8 w-[1px] bg-transparent" />
              <span className="bg-foreground h-8 w-[5px]" />
              <span className="h-8 w-[2px] bg-transparent" />
              <span className="bg-foreground h-8 w-[2px]" />
              <span className="h-8 w-[1px] bg-transparent" />
              <span className="bg-foreground h-8 w-[3px]" />
              <span className="h-8 w-[1px] bg-transparent" />
              <span className="bg-foreground h-8 w-[4px]" />
              <span className="h-8 w-[2px] bg-transparent" />
              <span className="bg-foreground h-8 w-[5px]" />
              <span className="h-8 w-[1px] bg-transparent" />
              <span className="bg-foreground h-8 w-[3px]" />
              <span className="h-8 w-[2px] bg-transparent" />
              <span className="bg-foreground h-8 w-[4px]" />
              <span className="h-8 w-[1px] bg-transparent" />
              <span className="bg-foreground h-8 w-[2px]" />
              <span className="h-8 w-[2px] bg-transparent" />
              <span className="bg-foreground h-8 w-[5px]" />
              <span className="h-8 w-[1px] bg-transparent" />
              <span className="bg-foreground h-8 w-[3px]" />
            </div>
            <p className="text-foreground font-mono text-xs font-semibold tracking-widest">
              *{orderNo.replace('#', '')}*
            </p>
          </div>
        </div>

        {/* Section 4: Itemized Pick List Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground text-sm font-semibold tracking-tight">Itemized Pick & Pack Checklist</h3>
              <Badge variant="outline" className="font-mono text-xs">
                {effectiveItems.length} Line Items
              </Badge>
            </div>
            <span className="text-muted-foreground text-xs">Check items upon bin scan and physical carton packing</span>
          </div>

          <div className="border-border overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-12 text-center">Packed</TableHead>
                    <TableHead className="w-48">Bin / Location</TableHead>
                    <TableHead className="w-36">SKU & Barcode</TableHead>
                    <TableHead>Item Name & Variant Details</TableHead>
                    <TableHead className="w-28 text-center">Qty Pick/Ord</TableHead>
                    <TableHead className="w-24 text-right">Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {effectiveItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className={cn(
                        'cursor-pointer transition-colors select-none',
                        packedState[item.id] ? 'bg-primary/[0.02] dark:bg-primary/[0.04]' : 'hover:bg-muted/20',
                      )}
                      onClick={() => toggleItemPacked(item.id)}
                    >
                      {/* Interactive Packed Checkbox */}
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center">
                          <Checkbox
                            id={`chk-${item.id}`}
                            checked={packedState[item.id] ?? false}
                            onCheckedChange={(val) => setItemPacked(item.id, val)}
                          />
                        </div>
                      </TableCell>

                      {/* Warehouse Bin / Location Tag */}
                      <TableCell>
                        <div className="border-border bg-muted/60 text-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium">
                          <MapPin className="text-primary size-3 shrink-0" aria-hidden="true" />
                          <span>{item.location}</span>
                        </div>
                      </TableCell>

                      {/* SKU & Barcode */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-foreground font-mono text-xs font-semibold">{item.sku}</p>
                          <p className="text-muted-foreground font-mono text-xs">UPC: {item.barcode}</p>
                        </div>
                      </TableCell>

                      {/* Item Description & Variant Notes */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <p
                            className={cn(
                              'text-foreground text-xs font-semibold',
                              packedState[item.id] && 'text-foreground/90',
                            )}
                          >
                            {item.name}
                          </p>
                          <p className="text-muted-foreground text-xs">{item.variant}</p>
                          {item.notes && <p className="text-muted-foreground/80 text-xs italic">{item.notes}</p>}
                        </div>
                      </TableCell>

                      {/* Quantity Ordered vs Packed */}
                      <TableCell className="text-center">
                        <div className="border-border/80 bg-background text-foreground inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs font-semibold shadow-2xs">
                          <span className={packedState[item.id] ? 'text-primary' : 'text-foreground'}>
                            {packedState[item.id] ? item.qtyPacked : 0}
                          </span>
                          <span className="text-muted-foreground font-normal">/</span>
                          <span className="tabular-nums">{item.qtyOrdered}</span>
                        </div>
                      </TableCell>

                      {/* Item Unit Weight */}
                      <TableCell className="text-right">
                        <span className="text-foreground font-mono text-xs font-medium tabular-nums">
                          {item.weightLbs.toFixed(1)} lbs
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="bg-muted/50 font-medium">
                  <TableRow>
                    <TableCell colSpan={4} className="text-foreground text-left text-xs font-semibold">
                      Order Package Totals ({effectiveItems.length} Distinct SKUs)
                    </TableCell>
                    <TableCell className="text-foreground text-center font-mono text-xs font-semibold tabular-nums">
                      {totalPackedUnits} / {totalOrderedUnits} Units
                    </TableCell>
                    <TableCell className="text-foreground text-right font-mono text-xs font-semibold tabular-nums">
                      {totalWeight.toFixed(1)} lbs
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </div>

        {/* Section 5: Package Summary & Quality Control Certification */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Package Carton Specs */}
          <div className="border-border/80 bg-muted/20 space-y-2 rounded-lg border p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
              <Box className="text-primary size-3.5" aria-hidden="true" />
              Carton Specifications
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Packing Box:</span>
                <span className="text-foreground font-medium">{boxSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Units:</span>
                <span className="text-foreground font-mono font-semibold">{totalOrderedUnits} items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Gross Weight:</span>
                <span className="text-foreground font-mono font-semibold">{totalWeight.toFixed(1)} lbs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Void Fill / Dunnage:</span>
                <span className="text-muted-foreground">{dunnageType}</span>
              </div>
            </div>
          </div>

          {/* Customer Returns & Exchange Notice */}
          <div className="border-border/80 bg-muted/20 space-y-2 rounded-lg border p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
              <QrCode className="text-primary size-3.5" aria-hidden="true" />
              Hassle-Free Returns
            </div>
            <div className="text-muted-foreground space-y-1 text-xs">
              <p className="text-foreground font-medium">Need to make an exchange or return?</p>
              <p>
                Scan the QR code or visit <span className="text-foreground font-mono">apexretail.com/returns</span>{' '}
                within 30 days.
              </p>
              <p className="text-muted-foreground/90 pt-1 text-xs">
                Please include this packing slip with items in original condition.
              </p>
            </div>
          </div>

          {/* Quality Control Stamp Container */}
          <div className="border-border/80 bg-muted/20 flex flex-col items-center justify-center rounded-lg border p-4">
            <div className="w-full rotate-[-1.5deg] rounded-lg border-2 border-dashed border-emerald-600/70 bg-emerald-500/10 p-3 text-center transition-transform hover:rotate-0 dark:border-emerald-400/70 dark:bg-emerald-500/15">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
                <span className="font-mono text-xs font-semibold tracking-widest uppercase">{qcStamp}</span>
              </div>
              <p className="mt-1 font-mono text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                AUDITED & SEALED
              </p>
              <p className="mt-0.5 text-xs text-emerald-700/80 dark:text-emerald-300/80">Inspector: {qcInspector}</p>
              <p className="font-mono text-xs text-emerald-600/70 dark:text-emerald-400/70">{qcTimestamp}</p>
            </div>
          </div>
        </div>

        {/* Section 6: Document Footer Note */}
        <div className="border-border text-muted-foreground flex flex-col items-center justify-between gap-2 border-t pt-4 text-xs sm:flex-row">
          <p>Generated by Apex Logistics WMS v4.8.2 · Station ID: {packStation}</p>
          <p className="font-mono">DOC ID: PS-2026-849201-US-04 · Barcode Validated</p>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .packing-slip-paper {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}

export default PackingSlipGenerator
