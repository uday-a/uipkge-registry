'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LeafletMap, LeafletMarker, LeafletCircle, type LeafletMapRef } from '@/components/ui/leaflet-map'

export type FacilityType = 'Shelter' | 'Medical Staging' | 'Command Post'
export type FacilityStatus = 'Open' | 'Near Capacity' | 'Closed'

export interface Facility {
  id: string
  name: string
  type: FacilityType
  /** [lng, lat] — Mapbox order. */
  coords: [number, number]
  capacity: number
  occupied: number
  status: FacilityStatus
}

export interface LeafletDisasterResponseMapProps extends React.HTMLAttributes<HTMLDivElement> {
  facilities?: Facility[]
}

// Module-level constants: stable references keep LeafletMap's center effect
// from re-firing setView on every render and cancelling flyTo animations.
const MAP_CENTER: [number, number] = [-122.2711, 37.8044]

// Wildfire incident origin in the Oakland Hills + a secondary spot fire.
const INCIDENT: [number, number] = [-122.165, 37.845]
const SPOT_FIRE: [number, number] = [-122.145, 37.856]

// Evacuation perimeter rings (meter radii): hard exclusion + warning zone.
const EVAC_RADIUS_M = 1800
const WARNING_RADIUS_M = 3600

const DEFAULT_FACILITIES: Facility[] = [
  {
    id: 's-1',
    name: 'Oakland Civic Shelter',
    type: 'Shelter',
    coords: [-122.265, 37.795],
    capacity: 500,
    occupied: 340,
    status: 'Open',
  },
  {
    id: 's-2',
    name: 'Eastmont Medical Staging',
    type: 'Medical Staging',
    coords: [-122.19, 37.77],
    capacity: 120,
    occupied: 98,
    status: 'Near Capacity',
  },
  {
    id: 's-3',
    name: 'Unified Incident Command Post',
    type: 'Command Post',
    coords: [-122.225, 37.852],
    capacity: 80,
    occupied: 45,
    status: 'Open',
  },
]

export function LeafletDisasterResponseMap({
  className,
  facilities = DEFAULT_FACILITIES,
  ...props
}: LeafletDisasterResponseMapProps) {
  const [activeId, setActiveId] = React.useState(facilities[0]?.id ?? '')
  const mapRef = React.useRef<LeafletMapRef>(null)
  const activeFacility = facilities.find((f) => f.id === activeId) ?? facilities[0]

  const focusFacility = (f: Facility) => {
    setActiveId(f.id)
    mapRef.current?.flyTo?.({ center: f.coords, zoom: 12.5, duration: 800 })
  }

  const focusHazard = () => {
    mapRef.current?.flyTo?.({ center: INCIDENT, zoom: 12, duration: 800 })
  }

  return (
    <div
      data-slot="leaflet-disaster-response-map"
      className={cn('grid gap-4 lg:grid-cols-[1fr_320px]', className)}
      {...props}
    >
      <div className="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
        <LeafletMap ref={mapRef} variant="light" center={MAP_CENTER} zoom={11} className="h-full w-full">
          {/* Evacuation perimeter rings (radii in meters) */}
          <LeafletCircle
            center={INCIDENT}
            radius={EVAC_RADIUS_M}
            color="#dc2626"
            weight={2}
            opacity={0.9}
            dashArray="6 4"
            fillColor="#ef4444"
            fillOpacity={0.15}
            onClick={focusHazard}
          />
          <LeafletCircle
            center={INCIDENT}
            radius={WARNING_RADIUS_M}
            color="#d97706"
            weight={1.5}
            opacity={0.7}
            dashArray="4 6"
            fillColor="#f59e0b"
            fillOpacity={0.05}
          />

          {/* Active fire origin */}
          <LeafletMarker lngLat={INCIDENT} anchor="center" onClick={focusHazard}>
            <div className="relative flex cursor-pointer items-center justify-center">
              <span className="absolute size-9 animate-ping rounded-full bg-rose-500/30" />
              <div className="flex size-7 items-center justify-center rounded-full bg-rose-600 font-mono text-xs font-bold text-white shadow-lg ring-2 ring-white">
                🔥
              </div>
            </div>
          </LeafletMarker>

          {/* Secondary spot fire */}
          <LeafletMarker lngLat={SPOT_FIRE} anchor="center" onClick={focusHazard}>
            <div className="relative flex cursor-pointer items-center justify-center">
              <span className="absolute size-6 animate-ping rounded-full bg-amber-500/30" />
              <div className="flex size-5 items-center justify-center rounded-full bg-amber-600 font-mono text-[9px] font-bold text-white shadow-md ring-2 ring-white">
                🔥
              </div>
            </div>
          </LeafletMarker>

          {/* Shelters and Medical Staging */}
          {facilities.map((f) => (
            <LeafletMarker key={f.id} lngLat={f.coords} anchor="bottom" onClick={() => focusFacility(f)}>
              <div className="group flex cursor-pointer flex-col items-center">
                <div
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full shadow-md ring-2 transition-transform group-hover:scale-110',
                    f.type === 'Shelter'
                      ? 'bg-emerald-600 text-white ring-emerald-400/40'
                      : f.type === 'Medical Staging'
                        ? 'bg-blue-600 text-white ring-blue-400/40'
                        : 'bg-primary text-primary-foreground ring-primary/40',
                  )}
                >
                  {f.type === 'Shelter' ? '🏠' : f.type === 'Medical Staging' ? '✚' : '★'}
                </div>
                <span className="border-border bg-background/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-bold whitespace-nowrap shadow-xs">
                  {f.name.split(' ')[0]}
                </span>
              </div>
            </LeafletMarker>
          ))}
        </LeafletMap>
      </div>

      {/* Incident Control Dashboard */}
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-rose-500/30 bg-rose-500/10 font-mono text-xs text-rose-600 dark:text-rose-400"
            >
              LEVEL 3 EVACUATION
            </Badge>
            <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {activeFacility.status}
            </Badge>
          </div>
          <CardTitle className="mt-2 text-lg">{activeFacility.name}</CardTitle>
          <CardDescription className="text-xs">
            Capacity: {activeFacility.occupied} / {activeFacility.capacity} beds occupied
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Capacity Bar */}
          <div className="border-border space-y-1.5 border-t pt-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-muted-foreground">Occupancy Rate</span>
              <span className="text-foreground font-bold">
                {Math.round((activeFacility.occupied / activeFacility.capacity) * 100)}%
              </span>
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  activeFacility.occupied / activeFacility.capacity > 0.8 ? 'bg-amber-500' : 'bg-emerald-500',
                )}
                style={{ width: `${(activeFacility.occupied / activeFacility.capacity) * 100}%` }}
              />
            </div>
          </div>

          <div className="border-border space-y-1 border-t pt-3">
            <div className="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
              Staged Relief Sites
            </div>
            {facilities.map((f) => (
              <button
                key={f.id}
                type="button"
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors',
                  activeId === f.id
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'hover:bg-muted text-muted-foreground',
                )}
                onClick={() => focusFacility(f)}
              >
                <span className="max-w-[170px] truncate">{f.name}</span>
                <span className="font-mono text-[10px] opacity-75">
                  {f.occupied}/{f.capacity}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 font-mono text-xs" onClick={focusHazard}>
              Exclusion Zone
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 font-mono text-xs"
              onClick={() => focusFacility(activeFacility)}
            >
              Focus Site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LeafletDisasterResponseMap
