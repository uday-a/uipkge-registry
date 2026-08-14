'use client'

import * as React from 'react'
import { AlertTriangle, Clock, PackageCheck, Printer, ShieldCheck, Warehouse } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface POLineItem {
  id: string
  sku: string
  title: string
  orderedQty: number
  receivedQty: number
  rejectedQty: number
  rejectionReason: 'none' | 'damaged_packaging' | 'expired_lot' | 'wrong_specification' | 'temperature_excursion'
  lotNumber: string
  expiryDate: string
  stagingLocation: string
}

export interface PurchaseOrderReceivingProps {
  poNumber?: string
  vendorName?: string
  deliveryDocket?: string
  className?: string
}

export function PurchaseOrderReceiving({
  poNumber = 'PO-2026-4409',
  vendorName = 'Apex Precision Engineering Ltd',
  deliveryDocket = 'BOL-APX-98214',
  className,
}: PurchaseOrderReceivingProps) {
  const [isCompleted, setIsCompleted] = React.useState(false)
  const [receivingDock, setReceivingDock] = React.useState('dock-03')
  const [inspectionStatus, setInspectionStatus] = React.useState<'pending' | 'passed' | 'discrepancy'>('pending')

  const [lines, setLines] = React.useState<POLineItem[]>([
    {
      id: 'po-1',
      sku: 'SKU-VALVE-99',
      title: 'High-Pressure Hydraulic Valve 3/8"',
      orderedQty: 100,
      receivedQty: 100,
      rejectedQty: 0,
      rejectionReason: 'none',
      lotNumber: 'LOT-HYD-998',
      expiryDate: '2029-12-31',
      stagingLocation: 'ZONE-A-RACK-04',
    },
    {
      id: 'po-2',
      sku: 'SKU-SEAL-04',
      title: 'Fluorocarbon O-Ring Flange Kit (Pack of 50)',
      orderedQty: 250,
      receivedQty: 245,
      rejectedQty: 5,
      rejectionReason: 'damaged_packaging',
      lotNumber: 'LOT-O-7712',
      expiryDate: '2028-06-30',
      stagingLocation: 'ZONE-A-RACK-01',
    },
    {
      id: 'po-3',
      sku: 'SKU-GAUGE-12',
      title: 'Digital Calibration Pressure Gauge 0-600 PSI',
      orderedQty: 40,
      receivedQty: 40,
      rejectedQty: 0,
      rejectionReason: 'none',
      lotNumber: 'LOT-CAL-002',
      expiryDate: '2031-01-15',
      stagingLocation: 'ZONE-B-RACK-09',
    },
  ])

  const totalOrdered = lines.reduce((acc, item) => acc + item.orderedQty, 0)
  const totalAccepted = lines.reduce((acc, item) => acc + item.receivedQty, 0)
  const totalRejected = lines.reduce((acc, item) => acc + item.rejectedQty, 0)

  function updateLine(id: string, updates: Partial<POLineItem>) {
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, ...updates } : line)))
  }

  function finalizeReceipt() {
    if (totalRejected > 0 || totalAccepted < totalOrdered) {
      setInspectionStatus('discrepancy')
    } else {
      setInspectionStatus('passed')
    }
    setIsCompleted(true)
  }

  function resetReceipt() {
    setIsCompleted(false)
    setInspectionStatus('pending')
  }

  return (
    <div data-slot="purchase-order-receiving" className={`w-full space-y-6 ${className ?? ''}`}>
      {/* Top PO Header Info */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-mono text-sm font-semibold">{poNumber}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {deliveryDocket}
              </Badge>
              <Badge
                variant={
                  inspectionStatus === 'passed'
                    ? 'default'
                    : inspectionStatus === 'discrepancy'
                      ? 'destructive'
                      : 'secondary'
                }
                className="capitalize"
              >
                {isCompleted ? `GRN ${inspectionStatus}` : 'Receiving in Progress'}
              </Badge>
            </div>
            <CardTitle className="text-xl">Inbound Goods Receipt & QA Inspection</CardTitle>
            <CardDescription>
              Supplier: <strong className="text-foreground font-medium">{vendorName}</strong> · Inbound Dock
              Verification
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Printer className="size-4" />
              Print Putaway Labels
            </Button>
            {!isCompleted ? (
              <Button variant="default" size="sm" className="gap-1.5" onClick={finalizeReceipt}>
                <PackageCheck className="size-4" />
                Generate GRN
              </Button>
            ) : (
              <Button variant="secondary" size="sm" className="gap-1.5" onClick={resetReceipt}>
                Edit Receipt
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="border-border grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3">
          {/* Receiving Dock */}
          <div className="border-border space-y-1.5 rounded-lg border p-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Warehouse className="size-3.5" />
              <span>RECEIVING BAY</span>
            </div>
            <Select value={receivingDock} onValueChange={setReceivingDock} disabled={isCompleted}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dock-01">Inbound Dock Bay 01 (Heavy Freight)</SelectItem>
                <SelectItem value="dock-02">Inbound Dock Bay 02 (Cross-Dock)</SelectItem>
                <SelectItem value="dock-03">Inbound Dock Bay 03 (Standard Freight)</SelectItem>
                <SelectItem value="dock-04">Inbound Cold Storage Quarantine Bay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discrepancy Summary */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">RECEIPT SUMMARY</div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="font-mono text-xl font-semibold">
                {totalAccepted} / {totalOrdered}
              </div>
              {totalRejected > 0 ? (
                <Badge variant="destructive" className="font-mono text-xs">
                  {totalRejected} Rejected
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground font-mono text-xs">
                  100% Match
                </Badge>
              )}
            </div>
          </div>

          {/* QA Verification Badge */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">QA AUDIT DISPOSITION</div>
            <div className="flex items-center gap-2 pt-1">
              {inspectionStatus === 'passed' && <ShieldCheck className="text-foreground size-5" />}
              {inspectionStatus === 'discrepancy' && <AlertTriangle className="text-destructive size-5" />}
              {inspectionStatus === 'pending' && <Clock className="text-muted-foreground size-5" />}
              <span className="text-sm font-medium">
                {inspectionStatus === 'passed'
                  ? 'All lines cleared for putaway'
                  : inspectionStatus === 'discrepancy'
                    ? 'Discrepancy logged for vendor credit'
                    : 'Awaiting line verification'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PO Line Item Matching Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Purchase Order Line Verification</CardTitle>
          <CardDescription>
            Verify quantities received against vendor packing list and assign warehouse staging zones.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Item / Description</TableHead>
                <TableHead className="text-right">Ordered</TableHead>
                <TableHead className="w-[110px] text-right">Received</TableHead>
                <TableHead className="w-[110px] text-right">Rejected</TableHead>
                <TableHead>Rejection Reason</TableHead>
                <TableHead>Lot Number</TableHead>
                <TableHead>Staging Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((line) => (
                <TableRow key={line.id}>
                  {/* Item Details */}
                  <TableCell>
                    <div className="font-medium">{line.title}</div>
                    <div className="text-muted-foreground font-mono text-xs">{line.sku}</div>
                  </TableCell>

                  {/* Ordered Qty */}
                  <TableCell className="text-muted-foreground text-right font-mono text-sm">
                    {line.orderedQty}
                  </TableCell>

                  {/* Received Qty */}
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      min={0}
                      value={line.receivedQty}
                      onChange={(e) => updateLine(line.id, { receivedQty: Number(e.target.value) })}
                      className="h-8 text-right font-mono"
                      disabled={isCompleted}
                    />
                  </TableCell>

                  {/* Rejected Qty */}
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      min={0}
                      value={line.rejectedQty}
                      onChange={(e) => updateLine(line.id, { rejectedQty: Number(e.target.value) })}
                      className="h-8 text-right font-mono"
                      disabled={isCompleted}
                    />
                  </TableCell>

                  {/* Reason */}
                  <TableCell>
                    <Select
                      value={line.rejectionReason}
                      onValueChange={(val: POLineItem['rejectionReason']) =>
                        updateLine(line.id, { rejectionReason: val })
                      }
                      disabled={isCompleted || line.rejectedQty === 0}
                    >
                      <SelectTrigger className="h-8 w-[160px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Accepted)</SelectItem>
                        <SelectItem value="damaged_packaging">Damaged Packaging</SelectItem>
                        <SelectItem value="expired_lot">Short Shelf Life</SelectItem>
                        <SelectItem value="wrong_specification">Incorrect Spec</SelectItem>
                        <SelectItem value="temperature_excursion">Temp Excursion</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Lot Number Input */}
                  <TableCell>
                    <Input
                      value={line.lotNumber}
                      onChange={(e) => updateLine(line.id, { lotNumber: e.target.value })}
                      placeholder="Lot #"
                      className="h-8 w-28 font-mono text-xs"
                      disabled={isCompleted}
                    />
                  </TableCell>

                  {/* Staging Target */}
                  <TableCell>
                    <span className="bg-muted text-foreground rounded px-2 py-1 font-mono text-xs font-medium">
                      {line.stagingLocation}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="border-border text-muted-foreground flex items-center justify-between border-t py-3 text-xs">
          <div>Official GRN generates supplier debit note automatically for any non-zero rejection.</div>
          <div className="text-foreground font-medium">
            Accepted: <span className="font-mono font-semibold">{totalAccepted}</span> units · Rejected:{' '}
            <span className="text-destructive font-mono font-semibold">{totalRejected}</span> units
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
