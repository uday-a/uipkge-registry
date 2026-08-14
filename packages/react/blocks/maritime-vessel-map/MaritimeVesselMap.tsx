import { useState, useRef } from 'react'
import { Map, MapMarker, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface Vessel {
  mmsi: string
  name: string
  flag: string
  type: 'Container' | 'Crude Tanker' | 'Bulk Carrier' | 'Tug'
  coords: [number, number]
  heading: number
  speedKnots: number
  draught: string
  dest: string
  eta: string
  status: 'Underway' | 'Moored' | 'At Anchor'
}

export interface MaritimeVesselMapProps {
  accessToken?: string
}

export function MaritimeVesselMap({ accessToken }: MaritimeVesselMapProps) {
  const mapRef = useRef<MapRef | null>(null)

  const vessels: Vessel[] = [
    {
      mmsi: '219018442',
      name: 'EVER GIVEN',
      flag: 'PA',
      type: 'Container',
      coords: [103.78, 1.25],
      heading: 110,
      speedKnots: 14.8,
      draught: '15.7m',
      dest: 'SGSIN PEB',
      eta: 'OCT 24 14:00',
      status: 'Underway',
    },
    {
      mmsi: '636019812',
      name: 'NORDIC STAR',
      flag: 'LR',
      type: 'Crude Tanker',
      coords: [103.88, 1.22],
      heading: 245,
      speedKnots: 0.2,
      draught: '12.1m',
      dest: 'SINGAPORE ANCH',
      eta: 'OCT 24 08:30',
      status: 'At Anchor',
    },
    {
      mmsi: '356782000',
      name: 'PACIFIC RUBY',
      flag: 'SG',
      type: 'Bulk Carrier',
      coords: [103.95, 1.29],
      heading: 45,
      speedKnots: 11.2,
      draught: '10.4m',
      dest: 'JPTYO',
      eta: 'OCT 29 06:00',
      status: 'Underway',
    },
    {
      mmsi: '508111222',
      name: 'HARBOR VALIANT',
      flag: 'SG',
      type: 'Tug',
      coords: [103.75, 1.28],
      heading: 180,
      speedKnots: 6.4,
      draught: '4.5m',
      dest: 'PASIR PANJANG',
      eta: 'OCT 24 12:00',
      status: 'Underway',
    },
  ]

  const [activeVessel, setActiveVessel] = useState<Vessel>(vessels[0])

  const selectVessel = (v: Vessel) => {
    setActiveVessel(v)
    mapRef.current?.flyTo({ center: v.coords, zoom: 11.5 })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
        <Map
          ref={mapRef}
          accessToken={accessToken}
          variant="dark"
          center={activeVessel.coords}
          zoom={10.8}
          className="h-full w-full"
        >
          {vessels.map((v) => (
            <MapMarker key={v.mmsi} lngLat={v.coords} anchor="center" onClick={() => selectVessel(v)}>
              <div className="group relative flex cursor-pointer flex-col items-center">
                <div
                  className={`flex size-7 items-center justify-center rounded-full font-bold text-cyan-400 transition-transform hover:scale-125 ${
                    activeVessel.mmsi === v.mmsi ? 'bg-cyan-500/20 ring-2 ring-cyan-400' : 'bg-background/80'
                  }`}
                  style={{ transform: `rotate(${v.heading}deg)` }}
                >
                  ▲
                </div>
                <span
                  className={`border-border bg-card/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-semibold tracking-wider whitespace-nowrap shadow-xs ${
                    activeVessel.mmsi === v.mmsi ? 'border-cyan-400/50 text-cyan-400' : 'text-foreground'
                  }`}
                >
                  {{ v: v.name }['v']}
                </span>
              </div>
            </MapMarker>
          ))}
        </Map>
      </div>

      {/* AIS Telemetry Drawer */}
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {activeVessel.type}
            </Badge>
            <Badge className="border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              {activeVessel.status}
            </Badge>
          </div>
          <CardTitle className="mt-2 font-mono text-lg">{activeVessel.name}</CardTitle>
          <CardDescription className="font-mono text-xs">
            MMSI: {activeVessel.mmsi} • Flag: {activeVessel.flag}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border bg-muted/40 grid grid-cols-2 gap-2 rounded-lg border p-2.5 font-mono text-xs">
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">Speed Over Ground</div>
              <div className="text-foreground text-sm font-bold">{activeVessel.speedKnots} kts</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">Heading</div>
              <div className="text-foreground text-sm font-bold">{activeVessel.heading}°</div>
            </div>
            <div className="mt-2">
              <div className="text-muted-foreground text-[10px] uppercase">Max Draught</div>
              <div className="text-foreground text-sm font-bold">{activeVessel.draught}</div>
            </div>
            <div className="mt-2">
              <div className="text-muted-foreground text-[10px] uppercase">Destination</div>
              <div className="text-foreground truncate text-xs font-bold">{activeVessel.dest}</div>
            </div>
          </div>

          <div className="border-border space-y-1 border-t pt-3">
            <div className="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
              Singapore Strait Traffic
            </div>
            {vessels.map((v) => (
              <button
                key={v.mmsi}
                type="button"
                className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors ${
                  activeVessel.mmsi === v.mmsi
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
                onClick={() => selectVessel(v)}
              >
                <span className="font-mono">{v.name}</span>
                <span className="font-mono text-[10px] opacity-75">{v.speedKnots} kts</span>
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full font-mono text-xs"
            onClick={() => selectVessel(activeVessel)}
          >
            Center on Vessel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
