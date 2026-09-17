'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LeafletMap, LeafletMarker, LeafletPolyline, type LeafletMapRef } from '@/components/ui/leaflet-map'

type LngLat = [number, number]

export interface ContainerAsset {
  id: string
  containerNo: string
  type: 'Reefer' | 'Dry Cargo' | 'Hazardous'
  location: string
  coords: LngLat
  temp?: string
  humidity?: string
  battery: string
  geofence: 'Inside Zone' | 'In Transit' | 'Exited Perimeter'
  status: 'Nominal' | 'Alert' | 'Secured'
}

export interface LeafletAssetTrackingMapProps extends React.HTMLAttributes<HTMLDivElement> {
  assets?: ContainerAsset[]
}

const DEFAULT_ASSETS: ContainerAsset[] = [
  {
    id: 'c-1',
    containerNo: 'MSKU-948102',
    type: 'Reefer',
    location: 'Pasir Panjang Terminal, Berth P5',
    coords: [103.792, 1.276],
    temp: '-18.4°C',
    humidity: '84%',
    battery: '92%',
    geofence: 'Inside Zone',
    status: 'Nominal',
  },
  {
    id: 'c-2',
    containerNo: 'CMAU-310892',
    type: 'Dry Cargo',
    location: 'Singapore Strait, Eastbound Lane',
    coords: [103.945, 1.205],
    battery: '78%',
    geofence: 'In Transit',
    status: 'Nominal',
  },
  {
    id: 'c-3',
    containerNo: 'HLXU-772901',
    type: 'Reefer',
    location: 'Jurong Island Anchorage',
    coords: [103.71, 1.245],
    temp: '+4.2°C',
    humidity: '62%',
    battery: '64%',
    geofence: 'Inside Zone',
    status: 'Alert',
  },
  {
    id: 'c-4',
    containerNo: 'OOLU-550183',
    type: 'Hazardous',
    location: 'Tuas Port, Hazardous Bay T2',
    coords: [103.635, 1.285],
    battery: '95%',
    geofence: 'Inside Zone',
    status: 'Secured',
  },
]

/** Eastbound / westbound shipping lanes through the Singapore Strait. */
const SHIPPING_LANES: LngLat[][] = [
  [
    [103.5, 1.16],
    [103.7, 1.18],
    [103.9, 1.2],
    [104.1, 1.22],
  ],
  [
    [103.5, 1.21],
    [103.7, 1.24],
    [103.9, 1.27],
    [104.1, 1.29],
  ],
]

export function LeafletAssetTrackingMap({
  className,
  assets = DEFAULT_ASSETS,
  ...props
}: LeafletAssetTrackingMapProps) {
  const [activeId, setActiveId] = React.useState(assets[0]?.id ?? '')
  const mapRef = React.useRef<LeafletMapRef>(null)
  const activeAsset = assets.find((a) => a.id === activeId) ?? assets[0]

  const selectAsset = (a: ContainerAsset) => {
    setActiveId(a.id)
    mapRef.current?.flyTo({ center: a.coords, zoom: 11.5 })
  }

  return (
    <div
      data-slot="leaflet-asset-tracking-map"
      className={cn('grid gap-4 lg:grid-cols-[1fr_320px]', className)}
      {...props}
    >
      <div className="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
        <LeafletMap
          ref={mapRef}
          variant="satellite-streets"
          center={[103.8519, 1.29027]}
          zoom={11}
          className="h-full w-full"
        >
          {/* Strait shipping lanes */}
          {SHIPPING_LANES.map((lane, i) => (
            <LeafletPolyline key={i} lngLatPath={lane} color="#22d3ee" weight={2} opacity={0.55} dashArray="6 8" />
          ))}

          {assets.map((a) => (
            <LeafletMarker key={a.id} lngLat={a.coords} anchor="bottom">
              <button
                type="button"
                className="group relative flex cursor-pointer flex-col items-center"
                onClick={() => selectAsset(a)}
              >
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-md shadow-md ring-2 transition-transform group-hover:scale-110',
                    a.status === 'Alert'
                      ? 'bg-amber-500 text-white ring-amber-400'
                      : 'bg-primary text-primary-foreground ring-primary/25',
                  )}
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                </span>
                <span className="border-border bg-background/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-bold shadow-xs">
                  {a.containerNo.split('-')[1]}
                </span>
              </button>
            </LeafletMarker>
          ))}
        </LeafletMap>
      </div>

      {/* Asset Telemetry & Sensor Card */}
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {activeAsset.type}
            </Badge>
            <Badge
              className={
                activeAsset.status === 'Alert'
                  ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }
            >
              {activeAsset.status}
            </Badge>
          </div>
          <CardTitle className="mt-2 font-mono text-lg">{activeAsset.containerNo}</CardTitle>
          <CardDescription className="text-xs">{activeAsset.location}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border bg-muted/40 grid grid-cols-2 gap-2 rounded-lg border p-2.5 font-mono text-xs">
            {activeAsset.temp && (
              <div>
                <div className="text-muted-foreground text-[10px] uppercase">Cold Chain Temp</div>
                <div
                  className={cn(
                    'text-sm font-bold',
                    activeAsset.status === 'Alert' ? 'text-amber-500' : 'text-foreground',
                  )}
                >
                  {activeAsset.temp}
                </div>
              </div>
            )}
            {activeAsset.humidity && (
              <div>
                <div className="text-muted-foreground text-[10px] uppercase">Humidity</div>
                <div className="text-foreground text-sm font-bold">{activeAsset.humidity}</div>
              </div>
            )}
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">IoT Battery</div>
              <div className="text-foreground text-sm font-bold">{activeAsset.battery}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">Geofence</div>
              <div className="text-foreground text-sm font-bold">{activeAsset.geofence}</div>
            </div>
          </div>

          <div className="border-border space-y-1 border-t pt-3">
            <div className="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
              Tracked Cargo Units
            </div>
            {assets.map((a) => (
              <button
                key={a.id}
                type="button"
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors',
                  activeId === a.id
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'hover:bg-muted text-muted-foreground',
                )}
                onClick={() => selectAsset(a)}
              >
                <span className="font-mono">{a.containerNo}</span>
                <span
                  className={cn(
                    'font-mono text-[10px]',
                    a.status === 'Alert' ? 'font-bold text-amber-500' : 'opacity-70',
                  )}
                >
                  {a.type}
                </span>
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full font-mono text-xs"
            onClick={() => selectAsset(activeAsset)}
          >
            Center on Container
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default LeafletAssetTrackingMap
