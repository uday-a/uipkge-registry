'use client'

import * as React from 'react'
import { Barcode, Check, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface PickItem {
  id: string
  sequence: number
  location: string
  sku: string
  name: string
  barcode: string
  requiredQty: number
  pickedQty: number
  toteNumber: string
  orderNumber: string
  status: 'pending' | 'picking' | 'picked' | 'shortage'
}

export interface WavePickingConsoleProps {
  waveId?: string
  zoneName?: string
  pickerName?: string
  className?: string
}

export function WavePickingConsole({
  waveId = 'WAVE-B2C-904',
  zoneName = 'Zone 02 · Fast Mover Aisle',
  pickerName = 'Alex Mercer (ID: PK-41)',
  className,
}: WavePickingConsoleProps) {
  const [activeBarcode, setActiveBarcode] = React.useState('')

  const [pickItems, setPickItems] = React.useState<PickItem[]>([
    {
      id: 'pk-1',
      sequence: 1,
      location: 'A02-S1-B04',
      sku: 'SKU-AUDIO-ANC',
      name: 'Active Noise Canceling Headphones Matte Black',
      barcode: '079357319901',
      requiredQty: 2,
      pickedQty: 2,
      toteNumber: 'TOTE-01',
      orderNumber: 'ORD-99120',
      status: 'picked',
    },
    {
      id: 'pk-2',
      sequence: 2,
      location: 'A02-S3-B11',
      sku: 'SKU-CABLE-BRAID',
      name: 'Braided Type-C Thunderbolt 4 Cable (2m)',
      barcode: '079357319902',
      requiredQty: 4,
      pickedQty: 1,
      toteNumber: 'TOTE-02',
      orderNumber: 'ORD-99124',
      status: 'picking',
    },
    {
      id: 'pk-3',
      sequence: 3,
      location: 'A03-S2-B08',
      sku: 'SKU-DESK-PAD',
      name: 'Top-Grain Leather Desk Mat Midnight Gray',
      barcode: '079357319903',
      requiredQty: 1,
      pickedQty: 0,
      toteNumber: 'TOTE-01',
      orderNumber: 'ORD-99120',
      status: 'pending',
    },
    {
      id: 'pk-4',
      sequence: 4,
      location: 'A04-S1-B02',
      sku: 'SKU-HUB-10IN1',
      name: 'USB-C Aluminum Desktop Docking Station',
      barcode: '079357319904',
      requiredQty: 3,
      pickedQty: 0,
      toteNumber: 'TOTE-03',
      orderNumber: 'ORD-99131',
      status: 'pending',
    },
  ])

  const totalUnitsToPick = pickItems.reduce((acc, i) => acc + i.requiredQty, 0)
  const totalUnitsPicked = pickItems.reduce((acc, i) => acc + i.pickedQty, 0)
  const progressPercentage = Math.round((totalUnitsPicked / totalUnitsToPick) * 100)

  const activeItem = pickItems.find((i) => i.status === 'picking') || pickItems.find((i) => i.status === 'pending')

  function scanItem() {
    if (!activeItem) return
    setPickItems((prev) => {
      let movedToNext = false
      return prev
        .map((item) => {
          if (item.id === activeItem.id && item.pickedQty < item.requiredQty) {
            const nextQty = item.pickedQty + 1
            const isDone = nextQty === item.requiredQty
            if (isDone) movedToNext = true
            return {
              ...item,
              pickedQty: nextQty,
              status: (isDone ? 'picked' : 'picking') as PickItem['status'],
            }
          }
          return item
        })
        .map((item, idx, arr) => {
          if (movedToNext && item.status === 'pending') {
            // make the first pending active
            const firstPending = arr.find((x) => x.status === 'pending')
            if (item.id === firstPending?.id) {
              return { ...item, status: 'picking' as const }
            }
          }
          return item
        })
    })
    setActiveBarcode('')
  }

  function flagShortage(id: string) {
    setPickItems((prev) => {
      let foundNext = false
      return prev.map((item) => {
        if (item.id === id) {
          foundNext = true
          return { ...item, status: 'shortage' as const }
        }
        if (foundNext && item.status === 'pending') {
          foundNext = false
          return { ...item, status: 'picking' as const }
        }
        return item
      })
    })
  }

  return (
    <div data-slot="wave-picking-console" className={`w-full space-y-6 ${className ?? ''}`}>
      {/* Top Wave Header Card */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-mono text-sm font-semibold">{waveId}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {zoneName}
              </Badge>
              <Badge variant={progressPercentage === 100 ? 'default' : 'secondary'}>{progressPercentage}% Picked</Badge>
            </div>
            <CardTitle className="text-xl">Batch Order Wave Picking Console</CardTitle>
            <CardDescription>
              Assigned Picker: <span className="text-foreground font-medium">{pickerName}</span> · Route Optimized
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-muted-foreground text-xs">Pick Completion</div>
              <div className="font-mono text-lg font-bold">
                {totalUnitsPicked} / {totalUnitsToPick} Units
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Active Pick Target Banner */}
        {activeItem && (
          <CardContent className="border-border border-t pt-4">
            <div className="border-border bg-muted/40 rounded-lg border p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-foreground text-background rounded px-2 py-0.5 font-mono text-xs font-semibold">
                      NEXT TARGET: {activeItem.location}
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">TOTE: {activeItem.toteNumber}</span>
                    <span className="text-muted-foreground font-mono text-xs">({activeItem.orderNumber})</span>
                  </div>
                  <div className="text-foreground text-lg font-semibold">{activeItem.name}</div>
                  <div className="text-muted-foreground font-mono text-xs">
                    SKU: {activeItem.sku} · Scan Barcode: {activeItem.barcode}
                  </div>
                </div>

                {/* Fast Scan & Action Button Group */}
                <div className="flex items-center gap-2">
                  <div className="relative w-48">
                    <Barcode className="text-muted-foreground pointer-events-none absolute top-2.5 left-2.5 size-4" />
                    <Input
                      value={activeBarcode}
                      onChange={(e) => setActiveBarcode(e.target.value)}
                      placeholder="Scan SKU barcode..."
                      className="h-9 pl-8"
                      onKeyDown={(e) => e.key === 'Enter' && scanItem()}
                    />
                  </div>
                  <Button size="sm" className="gap-1.5" onClick={scanItem}>
                    <Check className="size-4" />
                    Confirm Pick
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => flagShortage(activeItem.id)}
                  >
                    Flag Shortage
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Optimized Route Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Optimized Pick Route Sequence</CardTitle>
          <CardDescription>
            Pick items strictly in sequence to minimize travel distance across fulfillment aisles.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Seq</TableHead>
                <TableHead>Location Bin</TableHead>
                <TableHead className="w-[300px]">Product / SKU</TableHead>
                <TableHead>Tote & Order</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickItems.map((item) => (
                <TableRow key={item.id} className={item.status === 'picking' ? 'bg-muted/50 font-medium' : ''}>
                  {/* Sequence Number */}
                  <TableCell className="text-muted-foreground font-mono text-xs">#{item.sequence}</TableCell>

                  {/* Location Bin */}
                  <TableCell>
                    <div className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                      <MapPin className="text-muted-foreground size-3.5" />
                      <span>{item.location}</span>
                    </div>
                  </TableCell>

                  {/* Product */}
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground font-mono text-xs">{item.sku}</div>
                  </TableCell>

                  {/* Tote & Order */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <Badge variant="outline">{item.toteNumber}</Badge>
                      <span className="text-muted-foreground">{item.orderNumber}</span>
                    </div>
                  </TableCell>

                  {/* Qty Progress */}
                  <TableCell className="text-right font-mono text-sm">
                    {item.pickedQty} / {item.requiredQty}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'picked'
                          ? 'default'
                          : item.status === 'picking'
                            ? 'secondary'
                            : item.status === 'shortage'
                              ? 'destructive'
                              : 'outline'
                      }
                      className="capitalize"
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="border-border text-muted-foreground flex items-center justify-between border-t py-3 text-xs">
          <div>Completed totes are automatically routed to Conveyor Pack Station 04.</div>
          <div className="text-foreground font-medium">
            Wave Target: <span className="font-mono">{pickItems.length}</span> pick positions
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
