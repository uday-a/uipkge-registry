'use client'

import * as React from 'react'
import { ArrowRightLeft, CheckCircle2, Clock, Send, Split, Truck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ShipmentItem {
  id: string
  sku: string
  name: string
  qty: number
  unitPrice: number
  originHub: string
  status: 'ready' | 'backordered' | 'dispatched'
  restockEta?: string
}

export interface SplitPackage {
  packageId: string
  carrier: string
  trackingNumber?: string
  status: 'ready_to_ship' | 'awaiting_inventory' | 'dispatched'
  items: ShipmentItem[]
}

export interface BackorderSplitShipmentProps {
  orderId?: string
  customerName?: string
  customerTier?: string
  className?: string
}

export function BackorderSplitShipmentManager({
  orderId = 'ORD-SPLIT-9921',
  customerName = 'Aero Dynamics Corp',
  customerTier = 'Enterprise VIP · Net-30',
  className,
}: BackorderSplitShipmentProps) {
  const [packages, setPackages] = React.useState<SplitPackage[]>([
    {
      packageId: 'PKG-A (In Stock · WH-East)',
      carrier: 'FedEx Priority Overnight',
      trackingNumber: 'FX-8891-4401-US',
      status: 'ready_to_ship',
      items: [
        {
          id: 'pkg-1-1',
          sku: 'SKU-SERVO-01',
          name: 'Precision Micro Servo Motor 12V',
          qty: 4,
          unitPrice: 125,
          originHub: 'wh-east-01',
          status: 'ready',
        },
        {
          id: 'pkg-1-2',
          sku: 'SKU-FLANGE-99',
          name: 'Anodized Billet Flange Mount 45mm',
          qty: 2,
          unitPrice: 65,
          originHub: 'wh-east-01',
          status: 'ready',
        },
      ],
    },
    {
      packageId: 'PKG-B (Backordered · Sourcing WH-West)',
      carrier: 'UPS Standard Ground',
      status: 'awaiting_inventory',
      items: [
        {
          id: 'pkg-2-1',
          sku: 'SKU-CTRL-BOARD',
          name: 'Industrial Embedded Controller Rev 3.2',
          qty: 1,
          unitPrice: 420,
          originHub: 'wh-west-02',
          status: 'backordered',
          restockEta: 'Inbound PO arrives in 2 business days',
        },
      ],
    },
  ])

  function dispatchPackage(pkgId: string) {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.packageId === pkgId
          ? {
              ...pkg,
              status: 'dispatched' as const,
              items: pkg.items.map((i) => ({ ...i, status: 'dispatched' as const })),
            }
          : pkg,
      ),
    )
  }

  return (
    <div data-slot="backorder-split-shipment-manager" className={`w-full space-y-6 ${className ?? ''}`}>
      {/* Header Summary Card */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-mono text-sm font-semibold">{orderId}</span>
              <Badge variant="outline">{customerTier}</Badge>
              <Badge variant="secondary" className="gap-1">
                <Split className="text-foreground size-3" />
                Split Fulfillment (2 Shipments)
              </Badge>
            </div>
            <CardTitle className="text-xl">Split Shipment & Backorder Triage</CardTitle>
            <CardDescription>
              Account: <strong className="text-foreground font-medium">{customerName}</strong> · Multi-Node Routing
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Clock className="size-3.5" />
              Hold Entire Order
            </Button>
            <Button variant="default" size="sm" className="gap-1.5">
              <Send className="size-3.5" />
              Release Ready Packages
            </Button>
          </div>
        </CardHeader>

        <CardContent className="border-border grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3">
          {/* Fulfillment Policy */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">FULFILLMENT RULE</div>
            <div className="text-foreground text-sm font-semibold">Partial Dispatch Allowed (Speed Priority)</div>
            <div className="text-muted-foreground text-xs">
              Ship available items immediately without backorder delay.
            </div>
          </div>

          {/* In-Stock Value */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">READY SHIPMENT VALUE</div>
            <div className="text-foreground font-mono text-xl font-semibold">$630.00 USD</div>
            <div className="text-muted-foreground text-xs">6 units allocated from East Coast Hub.</div>
          </div>

          {/* Backordered Value */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">BACKORDERED VALUE</div>
            <div className="text-foreground font-mono text-xl font-semibold">$420.00 USD</div>
            <div className="text-muted-foreground text-xs">1 unit waiting on PO-2026-881 inbound dock.</div>
          </div>
        </CardContent>
      </Card>

      {/* Split Packages Breakdown */}
      <div className="space-y-4">
        {packages.map((pkg) => (
          <Card key={pkg.packageId}>
            <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold">{pkg.packageId}</span>
                  <Badge
                    variant={
                      pkg.status === 'dispatched' ? 'default' : pkg.status === 'ready_to_ship' ? 'secondary' : 'outline'
                    }
                    className="capitalize"
                  >
                    {pkg.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="text-muted-foreground font-mono text-xs">
                  Carrier: {pkg.carrier}
                  {pkg.trackingNumber && <span>· Tracking: {pkg.trackingNumber}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {pkg.status === 'ready_to_ship' && (
                  <Button
                    size="sm"
                    variant="default"
                    className="gap-1.5"
                    onClick={() => dispatchPackage(pkg.packageId)}
                  >
                    <Truck className="size-3.5" />
                    Dispatch Package Now
                  </Button>
                )}
                {pkg.status === 'awaiting_inventory' && (
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <ArrowRightLeft className="size-3.5" />
                    Re-route to 3PL
                  </Button>
                )}
                {pkg.status === 'dispatched' && (
                  <Badge variant="outline" className="text-xs">
                    Dispatched
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">SKU & Description</TableHead>
                    <TableHead>Fulfillment Origin</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Line Total</TableHead>
                    <TableHead>Inventory Status / ETA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pkg.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="text-foreground font-medium">{item.name}</div>
                        <div className="text-muted-foreground font-mono text-xs">{item.sku}</div>
                      </TableCell>

                      <TableCell>
                        <span className="bg-muted text-foreground rounded px-2 py-0.5 font-mono text-xs font-medium">
                          {item.originHub}
                        </span>
                      </TableCell>

                      <TableCell className="text-right font-mono text-sm">{item.qty}</TableCell>

                      <TableCell className="text-muted-foreground text-right font-mono text-sm">
                        ${item.unitPrice.toFixed(2)}
                      </TableCell>

                      <TableCell className="text-right font-mono text-sm font-medium">
                        ${(item.qty * item.unitPrice).toFixed(2)}
                      </TableCell>

                      <TableCell>
                        {item.status === 'ready' && (
                          <div className="text-foreground flex items-center gap-1.5 text-xs">
                            <CheckCircle2 className="size-3.5" />
                            <span>Allocated & Packed</span>
                          </div>
                        )}
                        {item.status === 'dispatched' && (
                          <div className="text-foreground flex items-center gap-1.5 text-xs">
                            <Truck className="size-3.5" />
                            <span>In Transit</span>
                          </div>
                        )}
                        {item.status === 'backordered' && (
                          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <Clock className="size-3.5" />
                            <span>{item.restockEta}</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
