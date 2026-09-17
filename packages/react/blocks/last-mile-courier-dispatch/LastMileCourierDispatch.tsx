'use client'

import * as React from 'react'
import { BatteryCharging, Navigation, Phone, Radio, Truck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Map, MapMarker, MapSource, MapLayer } from '@/components/ui/map'
import { cn } from '@/lib/utils'

export interface DeliveryStop {
  id: string
  stopNumber: number
  trackingCode: string
  recipient: string
  address: string
  parcels: number
  timeWindow: string
  eta: string
  status: 'delivered' | 'en_route' | 'scheduled' | 'failed'
  podType?: 'signature' | 'photo_scanned' | 'front_door'
  podTimestamp?: string
  coords?: [number, number]
}

export interface LastMileDispatchProps {
  routeId?: string
  driverName?: string
  vehicleCode?: string
  className?: string
}

export function LastMileCourierDispatch({
  routeId = 'RTE-METRO-409',
  driverName = 'Elena Rostova',
  vehicleCode = 'VAN-EV-09 (Ford E-Transit)',
  className,
}: LastMileDispatchProps) {
  const [stops, setStops] = React.useState<DeliveryStop[]>([
    {
      id: 'stp-1',
      stopNumber: 1,
      trackingCode: 'TRK-9941-8812',
      recipient: 'Apex Logistics HQ',
      address: '742 Evergreen Terrace, Sector 4',
      parcels: 3,
      timeWindow: '08:30 - 09:30',
      eta: '08:52 AM',
      status: 'delivered',
      podType: 'signature',
      podTimestamp: '08:54 AM (Signed by J. Doe)',
      coords: [-73.991, 40.743],
    },
    {
      id: 'stp-2',
      stopNumber: 2,
      trackingCode: 'TRK-9941-8813',
      recipient: 'David K. Miller',
      address: '1204 Pinehurst Ave, Apt 3B',
      parcels: 1,
      timeWindow: '09:30 - 10:30',
      eta: '09:45 AM',
      status: 'delivered',
      podType: 'photo_scanned',
      podTimestamp: '09:48 AM (Doorstep Verified)',
      coords: [-73.987, 40.747],
    },
    {
      id: 'stp-3',
      stopNumber: 3,
      trackingCode: 'TRK-9941-8814',
      recipient: 'Global Tech Labs',
      address: '450 Innovation Parkway, Suite 100',
      parcels: 4,
      timeWindow: '10:00 - 11:30',
      eta: '10:25 AM',
      status: 'en_route',
      coords: [-73.982, 40.751],
    },
    {
      id: 'stp-4',
      stopNumber: 4,
      trackingCode: 'TRK-9941-8815',
      recipient: 'Sarah Jenkins',
      address: '88 Riverfront Blvd',
      parcels: 2,
      timeWindow: '11:30 - 12:30',
      eta: '11:45 AM',
      status: 'scheduled',
      coords: [-73.978, 40.755],
    },
    {
      id: 'stp-5',
      stopNumber: 5,
      trackingCode: 'TRK-9941-8816',
      recipient: 'Metro Health Clinic',
      address: '310 Health Sciences Way',
      parcels: 1,
      timeWindow: '12:30 - 14:00',
      eta: '01:10 PM',
      status: 'scheduled',
      coords: [-73.971, 40.758],
    },
  ])

  const completedCount = stops.filter((s) => s.status === 'delivered').length
  const totalStops = stops.length
  const onTimeRate = '98.4%'

  const routePolylineGeoJson = React.useMemo(
    () => ({
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: stops.map((s) => s.coords).filter(Boolean) as [number, number][],
      },
    }),
    [stops],
  )

  const courierRoutePaint = {
    'line-color': '#0284c7',
    'line-width': 3,
    'line-dasharray': [2, 2],
  }

  function markDelivered(id: string) {
    setStops((prev) => {
      let foundTarget = false
      return prev.map((stop) => {
        if (stop.id === id) {
          foundTarget = true
          return {
            ...stop,
            status: 'delivered' as const,
            podType: 'signature' as const,
            podTimestamp: 'Just now (Signed)',
          }
        }
        if (foundTarget && stop.status === 'scheduled') {
          foundTarget = false
          return { ...stop, status: 'en_route' as const }
        }
        return stop
      })
    })
  }

  return (
    <div data-slot="last-mile-courier-dispatch" className={`w-full space-y-6 ${className ?? ''}`}>
      {/* Header / Dispatch Telemetry Overview */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-mono text-sm font-semibold">{routeId}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {vehicleCode}
              </Badge>
              <Badge variant="secondary" className="gap-1 text-xs">
                <Radio className="text-foreground size-3" />
                Live Telemetry Active
              </Badge>
            </div>
            <CardTitle className="text-xl">Last-Mile Courier Dispatch & POD Telemetry</CardTitle>
            <CardDescription>
              Courier: <span className="text-foreground font-medium">{driverName}</span> · Urban Route Dispatch Matrix
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Phone className="size-3.5" />
              Contact Driver
            </Button>
            <Button variant="default" size="sm" className="gap-1.5">
              <Navigation className="size-3.5" />
              Live GPS Map
            </Button>
          </div>
        </CardHeader>

        <CardContent className="border-border grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-4">
          {/* Progress Metric */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">ROUTE COMPLETION</div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="font-mono text-xl font-semibold">
                {completedCount} / {totalStops}
              </div>
              <span className="text-muted-foreground font-mono text-xs">
                {Math.round((completedCount / totalStops) * 100)}%
              </span>
            </div>
          </div>

          {/* On-time SLA */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">ON-TIME WINDOW SLA</div>
            <div className="pt-1 font-mono text-xl font-semibold">{onTimeRate}</div>
          </div>

          {/* Vehicle Telemetry */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
              <BatteryCharging className="size-3.5" />
              <span>EV BATTERY / RANGE</span>
            </div>
            <div className="pt-1 font-mono text-xl font-semibold">74% · 142 km</div>
          </div>

          {/* Next Stop ETA */}
          <div className="border-border space-y-1 rounded-lg border p-3">
            <div className="text-muted-foreground text-xs font-medium">CURRENT TARGET ETA</div>
            <div className="pt-1 font-mono text-xl font-semibold">10:25 AM (Stop #3)</div>
          </div>
        </CardContent>
      </Card>

      {/* Live GPS Route Map */}
      <Card className="overflow-hidden">
        <CardHeader className="border-border/70 border-b pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Navigation className="size-4 text-sky-400" />
                <span>Live GPS Telemetry & Corridor Map</span>
              </CardTitle>
              <CardDescription>
                Real-time courier positioning with sequenced drop waypoints and completion status.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 animate-ping rounded-full bg-emerald-500" />
              <span className="text-muted-foreground font-mono text-xs">GPS Synced · 3s ago</span>
            </div>
          </div>
        </CardHeader>
        <div className="relative h-72 w-full sm:h-80">
          <Map variant="dark" center={[-73.982, 40.75]} zoom={13.8} className="size-full">
            {/* Route Polyline */}
            <MapSource id="courier-route-source" type="geojson" data={routePolylineGeoJson}>
              <MapLayer id="courier-route-line" type="line" paint={courierRoutePaint} />
            </MapSource>

            {/* Delivery Stop Markers */}
            {stops.map((stop) => (
              <MapMarker key={stop.id} longitude={stop.coords![0]} latitude={stop.coords![1]} anchor="center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'border-background flex size-6 items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold shadow-md',
                      stop.status === 'delivered'
                        ? 'bg-emerald-500 text-white'
                        : stop.status === 'en_route'
                          ? 'bg-amber-500 text-white ring-2 ring-amber-400/50'
                          : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {stop.stopNumber}
                  </div>
                  <span className="border-border/80 bg-background/90 py-0.2 mt-0.5 rounded border px-1 font-mono text-[9px] font-medium shadow-xs backdrop-blur-xs">
                    {stop.recipient.split(' ')[0]}
                  </span>
                </div>
              </MapMarker>
            ))}

            {/* Live Courier Van Marker */}
            <MapMarker longitude={-73.984} latitude={40.749} anchor="center" className="z-30">
              <div className="relative flex size-9 items-center justify-center">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-60" />
                <div className="relative flex size-8 items-center justify-center rounded-full border-2 border-white bg-sky-600 text-white shadow-lg">
                  <Truck className="size-4" />
                </div>
              </div>
            </MapMarker>
          </Map>
        </div>
      </Card>

      {/* Dispatch Sequence Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Delivery Manifest & Proof of Delivery (POD)</CardTitle>
          <CardDescription>
            Ordered drop sequence with recipient signature capture and delivery window timestamps.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Stop</TableHead>
                <TableHead className="w-[180px]">Tracking ID</TableHead>
                <TableHead className="w-[260px]">Recipient & Address</TableHead>
                <TableHead>Window / ETA</TableHead>
                <TableHead className="text-right">Parcels</TableHead>
                <TableHead>Status & Proof of Delivery</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stops.map((stop) => (
                <TableRow key={stop.id} className={stop.status === 'en_route' ? 'bg-muted/40 font-medium' : ''}>
                  {/* Stop Number */}
                  <TableCell className="text-muted-foreground font-mono text-xs">#0{stop.stopNumber}</TableCell>

                  {/* Tracking Code */}
                  <TableCell>
                    <div className="text-foreground font-mono text-xs font-semibold">{stop.trackingCode}</div>
                  </TableCell>

                  {/* Recipient & Address */}
                  <TableCell>
                    <div className="text-foreground font-medium">{stop.recipient}</div>
                    <div className="text-muted-foreground truncate text-xs">{stop.address}</div>
                  </TableCell>

                  {/* Time Window & ETA */}
                  <TableCell>
                    <div className="text-foreground text-xs">{stop.timeWindow}</div>
                    <div className="text-muted-foreground font-mono text-xs">ETA: {stop.eta}</div>
                  </TableCell>

                  {/* Parcels Count */}
                  <TableCell className="text-right font-mono text-sm">{stop.parcels} pkg</TableCell>

                  {/* Status & Proof of Delivery */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            stop.status === 'delivered'
                              ? 'default'
                              : stop.status === 'en_route'
                                ? 'secondary'
                                : 'outline'
                          }
                          className="capitalize"
                        >
                          {stop.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      {stop.podTimestamp && (
                        <span className="text-muted-foreground font-mono text-xs">{stop.podTimestamp}</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    {stop.status === 'en_route' && (
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-xs"
                        onClick={() => markDelivered(stop.id)}
                      >
                        Confirm POD
                      </Button>
                    )}
                    {stop.status === 'delivered' && <span className="text-muted-foreground text-xs">Logged</span>}
                    {stop.status === 'scheduled' && <span className="text-muted-foreground text-xs">Queued</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="border-border text-muted-foreground flex items-center justify-between border-t py-3 text-xs">
          <div>Geotagged proof of delivery records are synced automatically to customer tracking portals.</div>
          <div className="text-foreground font-medium">
            Route summary: <span className="font-mono">{totalStops}</span> total consignments
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
