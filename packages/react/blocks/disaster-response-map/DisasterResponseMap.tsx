import { useState, useRef } from 'react'
import { Map, MapMarker, MapSource, MapLayer, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface Shelter {
  id: string
  name: string
  type: 'Shelter' | 'Medical Staging' | 'Command Post'
  coords: [number, number]
  capacity: number
  occupied: number
  status: 'Open' | 'Near Capacity' | 'Closed'
}

export interface DisasterResponseMapProps {
  accessToken?: string
}

export function DisasterResponseMap({ accessToken }: DisasterResponseMapProps) {
  const mapRef = useRef<MapRef | null>(null)

  const firePerimeterCoords: [number, number][] = [
    [-105.32, 40.01],
    [-105.29, 40.03],
    [-105.26, 40.02],
    [-105.25, 39.99],
    [-105.28, 39.97],
    [-105.31, 39.98],
    [-105.32, 40.01],
  ]

  const facilities: Shelter[] = [
    {
      id: 's-1',
      name: 'County Event Center Shelter',
      type: 'Shelter',
      coords: [-105.24, 40.04],
      capacity: 500,
      occupied: 340,
      status: 'Open',
    },
    {
      id: 's-2',
      name: 'West Valley Medical Staging',
      type: 'Medical Staging',
      coords: [-105.22, 39.98],
      capacity: 120,
      occupied: 98,
      status: 'Near Capacity',
    },
    {
      id: 's-3',
      name: 'Unified Incident Command Post',
      type: 'Command Post',
      coords: [-105.25, 40.07],
      capacity: 80,
      occupied: 45,
      status: 'Open',
    },
  ]

  const [activeFacility, setActiveFacility] = useState<Shelter>(facilities[0])

  const focusFacility = (f: Shelter) => {
    setActiveFacility(f)
    mapRef.current?.flyTo({ center: f.coords, zoom: 12.5 })
  }

  const focusHazard = () => {
    mapRef.current?.flyTo({ center: [-105.28, 40.0], zoom: 11.5 })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
        <Map
          ref={mapRef}
          accessToken={accessToken}
          variant="light"
          center={[-105.27, 40.01]}
          zoom={11.2}
          className="h-full w-full"
        >
          {/* Wildfire Hazard Exclusion Zone */}
          <MapSource
            id="hazard-zone"
            options={{
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: { type: 'Polygon', coordinates: [firePerimeterCoords] },
              },
            }}
          />
          <MapLayer
            id="hazard-zone-fill"
            options={{
              type: 'fill',
              source: 'hazard-zone',
              paint: { 'fill-color': '#ef4444', 'fill-opacity': 0.28 },
            }}
          />
          <MapLayer
            id="hazard-zone-line"
            options={{
              type: 'line',
              source: 'hazard-zone',
              paint: { 'line-color': '#dc2626', 'line-width': 2.5, 'line-dasharray': [2, 1] },
            }}
          />

          {/* Active Fire Origin Marker */}
          <MapMarker lngLat={[-105.29, 40.0]} anchor="center" onClick={focusHazard}>
            <div className="relative flex cursor-pointer items-center justify-center">
              <span className="absolute size-9 animate-ping rounded-full bg-rose-500/30" />
              <div className="flex size-7 items-center justify-center rounded-full bg-rose-600 font-mono text-xs font-bold text-white shadow-lg ring-2 ring-white">
                🔥
              </div>
            </div>
          </MapMarker>

          {/* Shelters and Medical Staging */}
          {facilities.map((f) => (
            <MapMarker key={f.id} lngLat={f.coords} anchor="bottom" onClick={() => focusFacility(f)}>
              <div className="group flex cursor-pointer flex-col items-center">
                <div
                  className={`flex size-7 items-center justify-center rounded-full shadow-md ring-2 transition-transform group-hover:scale-110 ${
                    f.type === 'Shelter'
                      ? 'bg-emerald-600 text-white ring-emerald-400/40'
                      : f.type === 'Medical Staging'
                        ? 'bg-blue-600 text-white ring-blue-400/40'
                        : 'bg-primary text-primary-foreground ring-primary/40'
                  }`}
                >
                  {f.type === 'Shelter' ? '🏠' : f.type === 'Medical Staging' ? '✚' : '★'}
                </div>
                <span className="border-border bg-background/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-bold whitespace-nowrap shadow-xs">
                  {f.name.split(' ')[0]}
                </span>
              </div>
            </MapMarker>
          ))}
        </Map>
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
                className={`h-full rounded-full transition-all ${
                  activeFacility.occupied / activeFacility.capacity > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
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
                className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors ${
                  activeFacility.id === f.id
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
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
