import { useState, useRef } from 'react'
import { Map, MapMarker, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface Flight {
  id: string
  callsign: string
  airline: string
  origin: string
  destination: string
  coords: [number, number]
  heading: number
  altitude: number
  speed: number
  aircraft: string
  status: 'Cruising' | 'Ascending' | 'Descending'
}

export interface FlightRadarMapProps {
  accessToken?: string
}

export function FlightRadarMap({ accessToken }: FlightRadarMapProps) {
  const mapRef = useRef<MapRef | null>(null)

  const flights: Flight[] = [
    {
      id: 'f-101',
      callsign: 'UAL482',
      airline: 'United Airlines',
      origin: 'SFO',
      destination: 'ORD',
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
      coords: [-115.8, 38.0],
      heading: 285,
      altitude: 22000,
      speed: 440,
      aircraft: 'B777-F',
      status: 'Descending',
    },
  ]

  const [activeFlight, setActiveFlight] = useState<Flight>(flights[0])

  const selectFlight = (f: Flight) => {
    setActiveFlight(f)
    mapRef.current?.flyTo({ center: f.coords, zoom: 6.5 })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
        <Map
          ref={mapRef}
          accessToken={accessToken}
          variant="dark"
          center={activeFlight.coords}
          zoom={5.2}
          className="h-full w-full"
        >
          {flights.map((f) => (
            <MapMarker key={f.id} lngLat={f.coords} anchor="center" onClick={() => selectFlight(f)}>
              <div className="group relative flex cursor-pointer flex-col items-center">
                <div
                  className={`flex size-7 items-center justify-center rounded-full font-bold text-sky-400 transition-transform hover:scale-125 ${
                    activeFlight.id === f.id ? 'bg-sky-500/20 ring-2 ring-sky-400' : 'bg-background/80'
                  }`}
                  style={{ transform: `rotate(${f.heading}deg)` }}
                >
                  ▲
                </div>
                <span
                  className={`border-border bg-card/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-semibold tracking-wider whitespace-nowrap shadow-xs ${
                    activeFlight.id === f.id ? 'border-sky-400/50 text-sky-400' : 'text-foreground'
                  }`}
                >
                  {f.callsign}
                </span>
              </div>
            </MapMarker>
          ))}
        </Map>
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

          <div className="border-border space-y-1 border-t pt-3">
            <div className="text-muted-foreground mb-1.5 font-mono text-[10px] tracking-wider uppercase">
              Monitored In-Flight
            </div>
            {flights.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors ${
                  activeFlight.id === f.id
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
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
