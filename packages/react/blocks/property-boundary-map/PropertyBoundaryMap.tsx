import { useState, useRef } from 'react'
import { Map, MapMarker, MapSource, MapLayer, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface Parcel {
  apn: string
  address: string
  zoning: string
  lotSqFt: string
  acres: number
  assessedValue: string
  taxYear: number
  coords: [number, number]
  polygon: [number, number][]
}

export interface PropertyBoundaryMapProps {
  accessToken?: string
}

export function PropertyBoundaryMap({ accessToken }: PropertyBoundaryMapProps) {
  const mapRef = useRef<MapRef | null>(null)

  const parcels: Parcel[] = [
    {
      apn: '0482-104-012',
      address: '450 Mountain View Rd, Austin, TX',
      zoning: 'SF-3 (Single Family)',
      lotSqFt: '14,280 sq ft',
      acres: 0.33,
      assessedValue: '$1,280,000',
      taxYear: 2025,
      coords: [-97.7431, 30.2672],
      polygon: [
        [-97.7438, 30.2678],
        [-97.7424, 30.2678],
        [-97.7424, 30.2666],
        [-97.7438, 30.2666],
        [-97.7438, 30.2678],
      ],
    },
    {
      apn: '0482-104-013',
      address: '460 Mountain View Rd, Austin, TX',
      zoning: 'SF-3 (Single Family)',
      lotSqFt: '16,500 sq ft',
      acres: 0.38,
      assessedValue: '$1,410,000',
      taxYear: 2025,
      coords: [-97.741, 30.2672],
      polygon: [
        [-97.7424, 30.2678],
        [-97.741, 30.2678],
        [-97.741, 30.2666],
        [-97.7424, 30.2666],
        [-97.7424, 30.2678],
      ],
    },
  ]

  const [activeParcel, setActiveParcel] = useState<Parcel>(parcels[0])

  const selectParcel = (p: Parcel) => {
    setActiveParcel(p)
    mapRef.current?.flyTo({ center: p.coords, zoom: 17 })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
        <Map
          ref={mapRef}
          accessToken={accessToken}
          variant="satellite-streets"
          center={activeParcel.coords}
          zoom={16.5}
          className="h-full w-full"
        >
          {/* Parcel Boundary Polygons */}
          <MapSource
            id="parcel-primary"
            options={{
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: { type: 'Polygon', coordinates: [activeParcel.polygon] },
              },
            }}
          />
          <MapLayer
            id="parcel-primary-fill"
            options={{
              type: 'fill',
              source: 'parcel-primary',
              paint: { 'fill-color': '#eab308', 'fill-opacity': 0.28 },
            }}
          />
          <MapLayer
            id="parcel-primary-line"
            options={{
              type: 'line',
              source: 'parcel-primary',
              paint: { 'line-color': '#facc15', 'line-width': 2.5 },
            }}
          />

          {parcels.map((p) => (
            <MapMarker key={p.apn} lngLat={p.coords} anchor="center" onClick={() => selectParcel(p)}>
              <div className="group flex cursor-pointer flex-col items-center">
                <span
                  className={`border-border bg-background/90 rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold shadow-md transition-transform group-hover:scale-110 ${
                    activeParcel.apn === p.apn ? 'border-amber-400 text-amber-500' : 'text-foreground'
                  }`}
                >
                  {p.apn}
                </span>
              </div>
            </MapMarker>
          ))}
        </Map>
      </div>

      {/* Cadastral Parcel Valuation Card */}
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              APN {activeParcel.apn}
            </Badge>
            <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {activeParcel.zoning}
            </Badge>
          </div>
          <CardTitle className="mt-2 text-base font-medium">{activeParcel.address}</CardTitle>
          <CardDescription className="font-mono text-xs">
            {activeParcel.lotSqFt} • {activeParcel.acres} Acres
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border space-y-2 border-t pt-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Assessed Valuation</span>
              <span className="text-foreground text-base font-bold">{activeParcel.assessedValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Zoning Code</span>
              <span className="text-foreground">{activeParcel.zoning}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Assessment Roll Year</span>
              <span className="text-foreground">{activeParcel.taxYear}</span>
            </div>
          </div>

          <div className="border-border space-y-1 border-t pt-3">
            <div className="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
              Adjacent Cadastral Lots
            </div>
            {parcels.map((p) => (
              <button
                key={p.apn}
                type="button"
                className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors ${
                  activeParcel.apn === p.apn
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
                onClick={() => selectParcel(p)}
              >
                <span className="font-mono">{p.apn}</span>
                <span className="font-mono text-[10px] opacity-75">{p.lotSqFt}</span>
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full font-mono text-xs"
            onClick={() => selectParcel(activeParcel)}
          >
            Center Cadastral Lot
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
