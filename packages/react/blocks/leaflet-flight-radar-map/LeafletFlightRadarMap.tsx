'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LeafletMap, LeafletMarker, LeafletPolyline, type LeafletMapRef } from '@/components/ui/leaflet-map'

type LngLat = [number, number]

export interface Flight {
  id: string
  callsign: string
  airline: string
  origin: string
  destination: string
  originCoords: LngLat
  destinationCoords: LngLat
  coords: LngLat
  heading: number
  altitude: number
  speed: number
  aircraft: string
  status: 'Cruising' | 'Ascending' | 'Descending'
}

export interface LeafletFlightRadarMapProps extends React.HTMLAttributes<HTMLDivElement> {
  flights?: Flight[]
}

const DEFAULT_FLIGHTS: Flight[] = [
  {
    id: 'f-101',
    callsign: 'UAL482',
    airline: 'United Airlines',
    origin: 'SFO',
    destination: 'ORD',
    originCoords: [-122.379, 37.6213],
    destinationCoords: [-87.9073, 41.9742],
    coords: [-112.0, 39.5],
    heading: 78,
    altitude: 34000,
    speed: 520,
    aircraft: 'B787-9',
    status: 'Cruising',
  },
  {
    id: 'f-102',
    callsign: 'DAL1209',
    airline: 'Delta Air Lines',
    origin: 'LAX',
    destination: 'JFK',
    originCoords: [-118.4085, 33.9416],
    destinationCoords: [-73.7781, 40.6413],
    coords: [-104.5, 36.2],
    heading: 72,
    altitude: 38000,
    speed: 545,
    aircraft: 'A350-900',
    status: 'Cruising',
  },
  {
    id: 'f-103',
    callsign: 'AAL89',
    airline: 'American Airlines',
    origin: 'DFW',
    destination: 'SEA',
    originCoords: [-97.0403, 32.8998],
    destinationCoords: [-122.3088, 47.4502],
    coords: [-107.2, 42.1],
    heading: 325,
    altitude: 29000,
    speed: 480,
    aircraft: 'B737-MAX8',
    status: 'Cruising',
  },
  {
    id: 'f-104',
    callsign: 'FDX14',
    airline: 'FedEx Express',
    origin: 'MEM',
    destination: 'OAK',
    originCoords: [-89.9767, 35.0424],
    destinationCoords: [-122.2208, 37.7126],
    coords: [-115.8, 38.0],
    heading: 285,
    altitude: 22000,
    speed: 440,
    aircraft: 'B777-F',
    status: 'Descending',
  },
]

/** Quadratic-bezier arc between two [lng, lat] points — a perpendicular lift
 *  on the control point gives the route its radar-style curve. */
function arcPath(from: LngLat, to: LngLat, segments = 32): LngLat[] {
  const midX = (from[0] + to[0]) / 2
  const midY = (from[1] + to[1]) / 2
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const ctrlX = midX - dy * 0.12
  const ctrlY = midY + dx * 0.12
  const points: LngLat[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const a = (1 - t) * (1 - t)
    const b = 2 * (1 - t) * t
    const c = t * t
    points.push([a * from[0] + b * ctrlX + c * to[0], a * from[1] + b * ctrlY + c * to[1]])
  }
  return points
}

export function LeafletFlightRadarMap({ className, flights = DEFAULT_FLIGHTS, ...props }: LeafletFlightRadarMapProps) {
  const [activeId, setActiveId] = React.useState(flights[0]?.id ?? '')
  const mapRef = React.useRef<LeafletMapRef>(null)
  const activeFlight = flights.find((f) => f.id === activeId) ?? flights[0]

  const selectFlight = (f: Flight) => {
    setActiveId(f.id)
    mapRef.current?.flyTo({ center: f.coords, zoom: 6.5 })
  }

  return (
    <div
      data-slot="leaflet-flight-radar-map"
      className={cn('grid gap-4 lg:grid-cols-[1fr_320px]', className)}
      {...props}
    >
      <div className="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
        <LeafletMap ref={mapRef} variant="dark" center={[-95.7129, 37.0902]} zoom={4} className="h-full w-full">
          {/* Planned route arcs (dashed) */}
          {flights.map((f) => (
            <LeafletPolyline
              key={`${f.id}-route`}
              lngLatPath={arcPath(f.originCoords, f.destinationCoords)}
              color={activeId === f.id ? '#38bdf8' : '#64748b'}
              weight={activeId === f.id ? 2 : 1.5}
              opacity={activeId === f.id ? 0.8 : 0.35}
              dashArray="4 6"
            />
          ))}
          {/* Flown leg arcs (solid) */}
          {flights.map((f) => (
            <LeafletPolyline
              key={`${f.id}-flown`}
              lngLatPath={arcPath(f.originCoords, f.coords)}
              color={activeId === f.id ? '#38bdf8' : '#94a3b8'}
              weight={2}
              opacity={activeId === f.id ? 0.9 : 0.45}
            />
          ))}

          {flights.map((f) => (
            <LeafletMarker key={f.id} lngLat={f.coords} anchor="center">
              <button
                type="button"
                className="group relative flex cursor-pointer flex-col items-center"
                onClick={() => selectFlight(f)}
              >
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-sky-400 transition-transform group-hover:scale-125',
                    activeId === f.id ? 'bg-sky-500/20 ring-2 ring-sky-400' : 'bg-background/80',
                  )}
                  style={{ transform: `rotate(${f.heading}deg)` }}
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 1.5c-.8 0-1.5.7-1.5 1.6v5.1l-7.9 5.2v1.9l7.9-2.3v5.1l-2.4 1.7v1.6l3.9-1 3.9 1v-1.6l-2.4-1.7v-5.1l7.9 2.3v-1.9l-7.9-5.2V3.1c0-.9-.7-1.6-1.5-1.6Z" />
                  </svg>
                </span>
                <span
                  className={cn(
                    'border-border bg-card/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-semibold tracking-wider whitespace-nowrap shadow-xs',
                    activeId === f.id ? 'border-sky-400/50 text-sky-400' : 'text-foreground',
                  )}
                >
                  {f.callsign}
                </span>
              </button>
            </LeafletMarker>
          ))}
        </LeafletMap>
      </div>

      {/* Aviation Telemetry Radar Drawer */}
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {activeFlight.airline}
            </Badge>
            <Badge className="border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
              {activeFlight.status}
            </Badge>
          </div>
          <CardTitle className="mt-2 font-mono text-xl">{activeFlight.callsign}</CardTitle>
          <CardDescription className="flex items-center gap-2 font-mono text-xs">
            <span>{activeFlight.origin}</span>
            <span>✈ ─── ✈</span>
            <span>{activeFlight.destination}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border bg-muted/50 grid grid-cols-2 gap-2 rounded-lg border p-2.5 font-mono text-xs">
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">Altitude</div>
              <div className="text-foreground text-sm font-bold">{activeFlight.altitude.toLocaleString()} ft</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">Ground Speed</div>
              <div className="text-foreground text-sm font-bold">{activeFlight.speed} kts</div>
            </div>
            <div className="mt-2">
              <div className="text-muted-foreground text-[10px] uppercase">Heading</div>
              <div className="text-foreground text-sm font-bold">{activeFlight.heading}°</div>
            </div>
            <div className="mt-2">
              <div className="text-muted-foreground text-[10px] uppercase">Equipment</div>
              <div className="text-foreground text-sm font-bold">{activeFlight.aircraft}</div>
            </div>
          </div>

          {/* Flight Selector List */}
          <div className="border-border space-y-1 border-t pt-3">
            <div className="text-muted-foreground mb-1.5 font-mono text-[10px] tracking-wider uppercase">
              Monitored In-Flight
            </div>
            {flights.map((f) => (
              <button
                key={f.id}
                type="button"
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors',
                  activeId === f.id
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'hover:bg-muted text-muted-foreground',
                )}
                onClick={() => selectFlight(f)}
              >
                <span className="font-mono">
                  {f.callsign} ({f.origin}→{f.destination})
                </span>
                <span className="font-mono text-[10px] opacity-75">{f.altitude / 1000}k ft</span>
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full font-mono text-xs"
            onClick={() => selectFlight(activeFlight)}
          >
            Recenter Camera
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default LeafletFlightRadarMap
