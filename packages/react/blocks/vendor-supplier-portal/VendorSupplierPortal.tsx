'use client'

import * as React from 'react'
import { Download, FileSpreadsheet, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface VendorPO {
  id: string
  poNumber: string
  issueDate: string
  deliveryDeadline: string
  linesCount: number
  totalAmount: number
  status: 'acknowledged' | 'in_production' | 'shipped' | 'pending_ack'
}

export interface ContractedCatalogItem {
  id: string
  sku: string
  name: string
  moq: number
  contractedPrice: number
  leadTimeDays: number
  validUntil: string
}

export interface VendorPortalProps {
  vendorName?: string
  vendorId?: string
  tier?: string
  className?: string
}

export function VendorSupplierPortal({
  vendorName = 'Apex Precision Engineering Ltd',
  vendorId = 'VND-2026-9901',
  tier = 'Strategic Tier-1 Supplier',
  className,
}: VendorPortalProps) {
  const [activeTab, setActiveTab] = React.useState<'orders' | 'catalog'>('orders')

  const [orders, setOrders] = React.useState<VendorPO[]>([
    {
      id: 'po-1',
      poNumber: 'PO-2026-8840',
      issueDate: '2026-08-18',
      deliveryDeadline: '2026-08-28',
      linesCount: 4,
      totalAmount: 48500,
      status: 'in_production',
    },
    {
      id: 'po-2',
      poNumber: 'PO-2026-8855',
      issueDate: '2026-08-22',
      deliveryDeadline: '2026-09-02',
      linesCount: 2,
      totalAmount: 19200,
      status: 'pending_ack',
    },
    {
      id: 'po-3',
      poNumber: 'PO-2026-8812',
      issueDate: '2026-08-10',
      deliveryDeadline: '2026-08-21',
      linesCount: 6,
      totalAmount: 82400,
      status: 'shipped',
    },
  ])

  const [catalog] = React.useState<ContractedCatalogItem[]>([
    {
      id: 'cat-1',
      sku: 'SKU-VALVE-99',
      name: 'High-Pressure Hydraulic Valve 3/8"',
      moq: 50,
      contractedPrice: 185.0,
      leadTimeDays: 7,
      validUntil: '2027-06-30',
    },
    {
      id: 'cat-2',
      sku: 'SKU-SEAL-04',
      name: 'Fluorocarbon O-Ring Flange Kit (Pack of 50)',
      moq: 100,
      contractedPrice: 24.5,
      leadTimeDays: 3,
      validUntil: '2027-06-30',
    },
    {
      id: 'cat-3',
      sku: 'SKU-GAUGE-12',
      name: 'Digital Calibration Pressure Gauge 0-600 PSI',
      moq: 20,
      contractedPrice: 420.0,
      leadTimeDays: 14,
      validUntil: '2027-06-30',
    },
  ])

  function acknowledgePO(id: string) {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: 'acknowledged' as const } : order)))
  }

  return (
    <div data-slot="vendor-supplier-portal" className={`w-full space-y-6 ${className ?? ''}`}>
      {/* Header / Supplier SLA Scorecard */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-mono text-sm font-semibold">{vendorId}</span>
              <Badge variant="outline">{tier}</Badge>
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck className="text-foreground size-3" />
                ISO 9001:2015 Certified
              </Badge>
            </div>
            <CardTitle className="text-xl">{vendorName}</CardTitle>
            <CardDescription>Supplier SLA Performance Scorecard & Active Purchase Order Console</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileSpreadsheet className="size-3.5" />
              Export Statement
            </Button>
            <Button variant="default" size="sm" className="gap-1.5">
              <Download className="size-3.5" />
              Download MSA Contract
            </Button>
          </div>
        </CardHeader>

        <CardContent className="border-border grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-4">
          {/* On Time Delivery */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">ON-TIME DELIVERY (OTD)</div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="font-mono text-xl font-semibold">98.6%</div>
              <span className="text-muted-foreground font-mono text-xs">Target: 95.0%</span>
            </div>
          </div>

          {/* QA Acceptance */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">QA ACCEPTANCE RATE</div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="font-mono text-xl font-semibold">99.8%</div>
              <span className="text-muted-foreground font-mono text-xs">&lt; 0.2% NCR</span>
            </div>
          </div>

          {/* Avg Lead Time */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">AVG FULFILLMENT LEAD TIME</div>
            <div className="pt-1 font-mono text-xl font-semibold">5.4 Days</div>
          </div>

          {/* Total YTD Volume */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">ACTIVE PURCHASE VOLUME</div>
            <div className="pt-1 font-mono text-xl font-semibold">$150,100 USD</div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs & Content Card */}
      <Card>
        <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'orders' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('orders')}
            >
              Active Purchase Orders ({orders.length})
            </Button>
            <Button
              variant={activeTab === 'catalog' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('catalog')}
            >
              Contracted Catalog Prices ({catalog.length})
            </Button>
          </div>

          <div className="text-muted-foreground text-xs">
            Payment Terms: <span className="text-foreground font-medium">Net-45 Direct ACH Wire</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Table for Orders */}
          {activeTab === 'orders' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">PO Reference</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Delivery Deadline</TableHead>
                  <TableHead className="text-right">Line Items</TableHead>
                  <TableHead className="text-right">Total Order Value</TableHead>
                  <TableHead>Fulfillment Status</TableHead>
                  <TableHead className="w-[140px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="text-foreground font-mono font-semibold">{order.poNumber}</div>
                    </TableCell>

                    <TableCell className="text-muted-foreground font-mono text-xs">{order.issueDate}</TableCell>

                    <TableCell className="text-foreground font-mono text-xs font-medium">
                      {order.deliveryDeadline}
                    </TableCell>

                    <TableCell className="text-right font-mono text-sm">{order.linesCount} SKUs</TableCell>

                    <TableCell className="text-foreground text-right font-mono text-sm font-semibold">
                      ${order.totalAmount.toLocaleString()} USD
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'shipped'
                            ? 'default'
                            : order.status === 'in_production'
                              ? 'secondary'
                              : 'outline'
                        }
                        className="capitalize"
                      >
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      {order.status === 'pending_ack' ? (
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 text-xs"
                          onClick={() => acknowledgePO(order.id)}
                        >
                          Acknowledge PO
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[280px]">Product / Description</TableHead>
                  <TableHead>SKU Reference</TableHead>
                  <TableHead className="text-right">Min Order Qty (MOQ)</TableHead>
                  <TableHead className="text-right">Contracted Unit Price</TableHead>
                  <TableHead className="text-right">Standard Lead Time</TableHead>
                  <TableHead>Contract Validity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catalog.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="text-foreground font-medium">{item.name}</div>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-xs font-semibold">{item.sku}</span>
                    </TableCell>

                    <TableCell className="text-right font-mono text-sm">{item.moq} units</TableCell>

                    <TableCell className="text-foreground text-right font-mono text-sm font-semibold">
                      ${item.contractedPrice.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-right font-mono text-sm">
                      {item.leadTimeDays} Days
                    </TableCell>

                    <TableCell>
                      <span className="text-muted-foreground font-mono text-xs">Valid to {item.validUntil}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>

        <CardFooter className="border-border text-muted-foreground flex items-center justify-between border-t py-3 text-xs">
          <div>Supplier contract SLA terms audited quarterly per ISO 9001 compliance standards.</div>
          <div className="text-foreground font-medium">
            Vendor Status: <span className="text-foreground">Active & In Good Standing</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
