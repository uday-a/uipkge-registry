'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeafletMap, LeafletMarker, LeafletPolygon, type LeafletMapRef } from '@/components/ui/leaflet-map'

export interface LeafletIsochroneReachabilityMapProps extends React.HTMLAttributes<HTMLDivElement> {}

const hubLocation: [number, number] = [-122.419, 37.775] // Downtown San Francisco

// Key-free drive-time approximation: a perturbed ring whose radius varies by
// angle through fixed harmonic offsets, so each band reads as an irregular
// blob rather than a perfect circle (a real isochrone needs a routing API).
function createIsochroneCoords(radiusMiles: number, phase: number): [number, number][] {
  const points: [number, number][] = []
  const steps = 48
  const latDelta = radiusMiles / 69
  const lngDelta = radiusMiles / (69 * Math.cos((hubLocation[1] * Math.PI) / 180))
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI
    const jitter = 1 + 0.16 * Math.sin(angle * 3 + phase) + 0.07 * Math.sin(angle * 7 + phase * 2.3)
    const lng = hubLocation[0] + lngDelta * Math.cos(angle) * jitter
    const lat = hubLocation[1] + latDelta * Math.sin(angle) * jitter
    points.push([lng, lat])
  }
  return points
}

const isochrones = {
  10: { coords: createIsochroneCoords(2.8, 0.4), pop: '340K', jobs: '520K', color: '#10b981', label: '10 Min Commute' },
  20: {
    coords: createIsochroneCoords(6.2, 1.7),
    pop: '1.24M',
    jobs: '890K',
    color: '#3b82f6',
    label: '20 Min Commute',
  },
  30: {
    coords: createIsochroneCoords(11.5, 2.9),
    pop: '2.85M',
    jobs: '1.45M',
    color: '#8b5cf6',
    label: '30 Min Commute',
  },
}

const destinations = [
  { name: 'Mission Depot', lngLat: [-122.414, 37.762] as [number, number] },
  { name: 'Daly City Hub', lngLat: [-122.47, 37.705] as [number, number] },
  { name: 'Oakland Annex', lngLat: [-122.272, 37.804] as [number, number] },
]

export function LeafletIsochroneReachabilityMap({ className, ...props }: LeafletIsochroneReachabilityMapProps) {
  const mapRef = React.useRef<LeafletMapRef>(null)
  const [selectedTime, setSelectedTime] = React.useState<10 | 20 | 30>(20)

  return (
    <div
      data-slot="leaflet-isochrone-reachability-map"
      className={cn('grid gap-4 lg:grid-cols-[1fr_320px]', className)}
      {...props}
    >
      <div className="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
        <LeafletMap
          ref={mapRef}
          variant="light"
          center={hubLocation}
          zoom={10.5}
          className="absolute inset-0 size-full"
        >
          {/* 30m Isochrone (outermost, drawn first) */}
          <LeafletPolygon
            lngLatPath={isochrones[30].coords}
            color={isochrones[30].color}
            weight={1.5}
            dashArray="4 4"
            fill
            fillColor={isochrones[30].color}
            fillOpacity={selectedTime >= 30 ? 0.15 : 0.04}
          />

          {/* 20m Isochrone */}
          <LeafletPolygon
            lngLatPath={isochrones[20].coords}
            color={isochrones[20].color}
            weight={2}
            fill
            fillColor={isochrones[20].color}
            fillOpacity={selectedTime >= 20 ? 0.22 : 0.06}
          />

          {/* 10m Isochrone (innermost, most opaque) */}
          <LeafletPolygon
            lngLatPath={isochrones[10].coords}
            color={isochrones[10].color}
            weight={2.5}
            fill
            fillColor={isochrones[10].color}
            fillOpacity={0.3}
          />

          {/* Destinations */}
          {destinations.map((dest) => (
            <LeafletMarker key={dest.name} lngLat={dest.lngLat} anchor="center">
              <div className="flex flex-col items-center gap-0.5">
                <span className="border-background bg-foreground size-2 rounded-full border-2 shadow-xs" />
                <span className="bg-card/90 text-foreground rounded px-1 font-mono text-[10px] font-semibold whitespace-nowrap shadow-xs">
                  {dest.name}
                </span>
              </div>
            </LeafletMarker>
          ))}

          {/* Central Hub Marker */}
          <LeafletMarker lngLat={hubLocation} anchor="center">
            <div className="relative flex items-center justify-center">
              <span className="bg-primary/30 absolute size-6 animate-ping rounded-full" />
              <div className="bg-primary text-primary-foreground ring-background flex size-6 items-center justify-center rounded-full font-mono text-xs font-bold shadow-md ring-2">
                ★
              </div>
            </div>
          </LeafletMarker>
        </LeafletMap>
      </div>

      {/* Isochrone Analytics Card */}
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              COMMUTE ANALYSIS
            </Badge>
            <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">Drive-Time</Badge>
          </div>
          <CardTitle className="mt-2 text-lg">Reachability Zones</CardTitle>
          <CardDescription>Transit reachability from Downtown Distribution Hub.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Range Selector Tabs */}
          <div className="border-border bg-muted grid grid-cols-3 gap-1 rounded-lg border p-1 text-xs">
            {([10, 20, 30] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`rounded-md py-1.5 font-medium transition-all ${
                  selectedTime === t
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setSelectedTime(t)}
              >
                {t} mins
              </button>
            ))}
          </div>

          <div className="border-border space-y-3 border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Population Reach</span>
              <span className="text-foreground font-mono text-base font-bold">{isochrones[selectedTime].pop}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Workforce / Labor Pool</span>
              <span className="text-foreground font-mono text-base font-bold">{isochrones[selectedTime].jobs}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Service Band</span>
              <span className="font-mono text-xs font-semibold" style={{ color: isochrones[selectedTime].color }}>
                {isochrones[selectedTime].label}
              </span>
            </div>
          </div>

          <div className="border-border text-muted-foreground space-y-2 border-t pt-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Green ring: 10-minute urban core</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-500" />
              <span>Blue ring: 20-minute metropolitan belt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-purple-500" />
              <span>Purple ring: 30-minute outer ring</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LeafletIsochroneReachabilityMap
