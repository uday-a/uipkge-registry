'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LeafletMap, LeafletMarker, LeafletPolyline, type LeafletMapRef } from '@/components/ui/leaflet-map'

export interface LeafletDeliveryTrackingMapProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const origin: [number, number] = [-122.4194, 37.7749]
const destination: [number, number] = [-122.392, 37.7915]
const courierPosition: [number, number] = [-122.405, 37.783]

const routeCoords: [number, number][] = [
  [-122.4194, 37.7749],
  [-122.414, 37.778],
  [-122.405, 37.783],
  [-122.399, 37.787],
  [-122.392, 37.7915],
]

export function LeafletDeliveryTrackingMap({ className, ...props }: LeafletDeliveryTrackingMapProps) {
  const mapRef = React.useRef<LeafletMapRef>(null)

  const focusCourier = () => {
    mapRef.current?.flyTo({ center: courierPosition, zoom: 14.5, duration: 800 })
  }

  const focusDestination = () => {
    mapRef.current?.flyTo({ center: destination, zoom: 15, duration: 800 })
  }

  return (
    <div
      data-slot="leaflet-delivery-tracking-map"
      className={cn('grid gap-4 lg:grid-cols-[1fr_320px]', className)}
      {...props}
    >
      <div className="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
        <LeafletMap ref={mapRef} variant="dark" center={courierPosition} zoom={13.5} className="h-full w-full">
          <LeafletPolyline lngLatPath={routeCoords} color="#2563eb" weight={4} lineCap="round" lineJoin="round" />
          {/* Restaurant / Merchant */}
          <LeafletMarker lngLat={origin} anchor="bottom">
            <div className="flex flex-col items-center">
              <span className="bg-muted-foreground ring-muted size-3 rounded-full ring-4" />
              <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px]">
                Merchant
              </span>
            </div>
          </LeafletMarker>
          {/* Live Courier */}
          <LeafletMarker lngLat={courierPosition} anchor="center">
            <div className="relative flex cursor-pointer items-center justify-center" onClick={focusCourier}>
              <span className="bg-primary/25 absolute size-7 animate-ping rounded-full" />
              <div className="bg-primary text-primary-foreground ring-background flex size-7 items-center justify-center rounded-full shadow-md ring-2">
                🛵
              </div>
            </div>
          </LeafletMarker>
          {/* Destination */}
          <LeafletMarker lngLat={destination} anchor="bottom">
            <div className="flex cursor-pointer flex-col items-center" onClick={focusDestination}>
              <span className="size-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
              <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Delivery Dropoff
              </span>
            </div>
          </LeafletMarker>
        </LeafletMap>
      </div>

      {/* Telemetry & Order Status */}
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              ORDER #8924
            </Badge>
            <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Approaching
            </Badge>
          </div>
          <CardTitle className="mt-2 text-lg">Express Courier</CardTitle>
          <CardDescription>
            Estimated delivery in <strong className="text-foreground">8 mins</strong> (0.8 mi away)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border space-y-2 border-t pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Driver</span>
              <span className="text-foreground font-medium">Carlos M. (★ 4.98)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Vehicle</span>
              <span className="text-foreground font-mono">E-Scooter #412</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Destination</span>
              <span className="text-foreground max-w-[170px] truncate font-medium">Market St & 2nd Ave</span>
            </div>
          </div>

          <div className="border-border space-y-1.5 border-t pt-3 font-mono text-xs">
            <div className="text-muted-foreground flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>12:42 PM — Order picked up</span>
            </div>
            <div className="text-foreground flex items-center gap-2 font-medium">
              <span className="bg-primary size-1.5 animate-pulse rounded-full" />
              <span>12:51 PM — Approaching building</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={focusCourier}>
              Track Courier
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={focusDestination}>
              Dropoff Point
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LeafletDeliveryTrackingMap
