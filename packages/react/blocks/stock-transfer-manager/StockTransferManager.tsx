'use client'

import * as React from 'react'
import { ArrowRight, Barcode, CheckCircle2, Plus, QrCode, Trash2, Truck, Warehouse } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface TransferItem {
  id: string
  sku: string
  name: string
  barcode: string
  lotNumber: string
  sourceBin: string
  targetBin: string
  availableQty: number
  transferQty: number
  unit: string
  condition: 'sellable' | 'quarantine' | 'damaged'
}

export interface StockTransferProps {
  transferId?: string
  initialStatus?: 'draft' | 'staged' | 'in_transit' | 'received'
  className?: string
}

export function StockTransferManager({
  transferId = 'TRF-2026-8841',
  initialStatus = 'staged',
  className,
}: StockTransferProps) {
  const [status, setStatus] = React.useState(initialStatus)
  const [sourceWarehouse, setSourceWarehouse] = React.useState('wh-east-01')
  const [targetWarehouse, setTargetWarehouse] = React.useState('wh-central-02')
  const [transportType, setTransportType] = React.useState('pallet_freight')
  const [barcodeQuery, setBarcodeQuery] = React.useState('')

  const [items, setItems] = React.useState<TransferItem[]>([
    {
      id: 'itm-1',
      sku: 'SKU-LOGI-884',
      name: 'Industrial Barcode Scanner IP65',
      barcode: '079357318921',
      lotNumber: 'LOT-2026-A1',
      sourceBin: 'A-04-R2-B12',
      targetBin: 'C-01-R1-B03',
      availableQty: 140,
      transferQty: 25,
      unit: 'pcs',
      condition: 'sellable',
    },
    {
      id: 'itm-2',
      sku: 'SKU-PWR-331',
      name: 'Lithium Iron Battery Pack 48V',
      barcode: '079357318945',
      lotNumber: 'LOT-2025-X9',
      sourceBin: 'B-12-R4-B01',
      targetBin: 'D-08-R2-B09',
      availableQty: 48,
      transferQty: 12,
      unit: 'units',
      condition: 'sellable',
    },
    {
      id: 'itm-3',
      sku: 'SKU-SENS-102',
      name: 'Optical Proximity Sensor M18',
      barcode: '079357318988',
      lotNumber: 'LOT-2026-C4',
      sourceBin: 'A-02-R1-B06',
      targetBin: 'A-09-R3-B02',
      availableQty: 320,
      transferQty: 80,
      unit: 'pcs',
      condition: 'sellable',
    },
  ])

  const totalUnits = items.reduce((sum, item) => sum + Number(item.transferQty || 0), 0)
  const totalLineItems = items.length

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: `itm-${Date.now()}`,
        sku: 'SKU-GEN-001',
        name: 'Standard Packing Material Kit',
        barcode: '079357399999',
        lotNumber: 'LOT-UNASSIGNED',
        sourceBin: 'A-01-R1-B01',
        targetBin: 'B-01-R1-B01',
        availableQty: 100,
        transferQty: 10,
        unit: 'kits',
        condition: 'sellable',
      },
    ])
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateItemQty(id: string, qty: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, transferQty: qty } : i)))
  }

  function updateItemCondition(id: string, condition: 'sellable' | 'quarantine' | 'damaged') {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, condition } : i)))
  }

  function handleScan() {
    if (!barcodeQuery) return
    setItems((prev) =>
      prev.map((i) =>
        i.barcode === barcodeQuery || i.sku === barcodeQuery ? { ...i, transferQty: i.transferQty + 1 } : i,
      ),
    )
    setBarcodeQuery('')
  }

  return (
    <div data-slot="stock-transfer-manager" className={`w-full space-y-6 ${className ?? ''}`}>
      {/* Header Summary Card */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-mono text-sm font-medium">{transferId}</span>
              <Badge
                variant={
                  status === 'received'
                    ? 'default'
                    : status === 'in_transit'
                      ? 'secondary'
                      : status === 'staged'
                        ? 'outline'
                        : 'outline'
                }
                className="capitalize"
              >
                {status.replace('_', ' ')}
              </Badge>
            </div>
            <CardTitle className="text-xl">Inter-Warehouse Stock Transfer</CardTitle>
            <CardDescription>
              Transfer goods between fulfillment hubs with bin-level tracking and scan verification.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {status === 'staged' && (
              <Button variant="default" className="gap-2" onClick={() => setStatus('in_transit')}>
                <Truck className="size-4" />
                Dispatch Transfer
              </Button>
            )}
            {status === 'in_transit' && (
              <Button variant="default" className="gap-2" onClick={() => setStatus('received')}>
                <CheckCircle2 className="size-4" />
                Confirm Receipt
              </Button>
            )}
            {status === 'received' && (
              <Button variant="outline" className="gap-2" onClick={() => setStatus('staged')}>
                Reset Transfer
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="border-border grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3">
          {/* Source Hub */}
          <div className="border-border space-y-2 rounded-lg border p-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Warehouse className="size-3.5" />
              <span>ORIGIN FACILITY</span>
            </div>
            <Select
              value={sourceWarehouse}
              onValueChange={setSourceWarehouse}
              disabled={status !== 'draft' && status !== 'staged'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select origin warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wh-east-01">East Coast Fulfillment (NJ-01)</SelectItem>
                <SelectItem value="wh-west-02">West Coast Distribution (CA-04)</SelectItem>
                <SelectItem value="wh-midwest-03">Midwest Logistics Hub (IL-02)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destination Hub */}
          <div className="border-border space-y-2 rounded-lg border p-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <ArrowRight className="size-3.5" />
              <span>DESTINATION FACILITY</span>
            </div>
            <Select
              value={targetWarehouse}
              onValueChange={setTargetWarehouse}
              disabled={status !== 'draft' && status !== 'staged'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select target warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wh-central-02">Central Distribution Center (TX-01)</SelectItem>
                <SelectItem value="wh-north-01">Northern Sorting Facility (WA-02)</SelectItem>
                <SelectItem value="wh-south-03">Southeast Regional Hub (GA-03)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Carrier / Transport */}
          <div className="border-border space-y-2 rounded-lg border p-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Truck className="size-3.5" />
              <span>SHIPPING METHOD</span>
            </div>
            <Select
              value={transportType}
              onValueChange={setTransportType}
              disabled={status !== 'draft' && status !== 'staged'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select transit mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pallet_freight">Dedicated LTL Freight (Palletized)</SelectItem>
                <SelectItem value="express_courier">Priority Courier (Same Day Air)</SelectItem>
                <SelectItem value="internal_fleet">Internal Fleet Transfer (Route 09)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Line Items Table Card */}
      <Card>
        <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Manifest Line Items</CardTitle>
            <CardDescription>
              {totalLineItems} unique SKUs · {totalUnits} total units staged for transfer
            </CardDescription>
          </div>

          {/* Quick Scan / SKU lookup bar */}
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Barcode className="text-muted-foreground pointer-events-none absolute top-2.5 left-2.5 size-4" />
              <Input
                value={barcodeQuery}
                onChange={(e) => setBarcodeQuery(e.target.value)}
                placeholder="Scan barcode or SKU..."
                className="pl-8"
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
            </div>
            <Button variant="secondary" size="icon" title="Scan Barcode" onClick={handleScan}>
              <QrCode className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={addItem}>
              <Plus className="size-3.5" />
              Add Item
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Product / SKU</TableHead>
                <TableHead>Lot / Batch</TableHead>
                <TableHead>Source Bin</TableHead>
                <TableHead>Target Bin</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="w-[120px] text-right">Transfer Qty</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  {/* SKU + Name */}
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                      <span>{item.sku}</span>
                      <span>·</span>
                      <span>{item.barcode}</span>
                    </div>
                  </TableCell>

                  {/* Lot Number */}
                  <TableCell>
                    <span className="font-mono text-xs">{item.lotNumber}</span>
                  </TableCell>

                  {/* Source Bin */}
                  <TableCell>
                    <span className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs font-medium">
                      {item.sourceBin}
                    </span>
                  </TableCell>

                  {/* Target Bin */}
                  <TableCell>
                    <span className="border-border text-foreground rounded border px-1.5 py-0.5 font-mono text-xs font-medium">
                      {item.targetBin}
                    </span>
                  </TableCell>

                  {/* Available Qty */}
                  <TableCell className="text-muted-foreground text-right font-mono text-xs">
                    {item.availableQty} {item.unit}
                  </TableCell>

                  {/* Transfer Qty Input */}
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      min={1}
                      max={item.availableQty}
                      value={item.transferQty}
                      onChange={(e) => updateItemQty(item.id, Number(e.target.value))}
                      className="h-8 text-right font-mono"
                      disabled={status === 'received'}
                    />
                  </TableCell>

                  {/* Condition */}
                  <TableCell>
                    <Select
                      value={item.condition}
                      onValueChange={(val: 'sellable' | 'quarantine' | 'damaged') => updateItemCondition(item.id, val)}
                      disabled={status === 'received'}
                    >
                      <SelectTrigger className="h-8 w-[110px] text-xs capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sellable">Sellable</SelectItem>
                        <SelectItem value="quarantine">Quarantine</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Remove Action */}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive size-8"
                      disabled={status === 'received'}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="border-border text-muted-foreground flex items-center justify-between border-t py-3 text-xs">
          <div>All inventory movements are recorded in immutable ledger log #LOG-9402.</div>
          <div className="text-foreground font-medium">
            Total: <span className="font-mono">{totalUnits}</span> items across{' '}
            <span className="font-mono">{totalLineItems}</span> positions
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
