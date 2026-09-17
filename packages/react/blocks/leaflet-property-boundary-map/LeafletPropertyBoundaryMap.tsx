'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { LeafletMap, LeafletMarker, LeafletPolygon, type LeafletMapRef } from '@/components/ui/leaflet-map'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface Parcel {
  apn: string
  address: string
  zoning: string
  /** Plain-hex zone fill — Leaflet renders paths to SVG/canvas, so CSS vars do not resolve there. */
  color: string
  lotSqFt: string
  acres: number
  assessedValue: string
  taxYear: number
  coords: [number, number]
  polygon: [number, number][]
}

export interface LeafletPropertyBoundaryMapProps extends React.HTMLAttributes<HTMLDivElement> {
  parcels?: Parcel[]
}

const DEFAULT_PARCELS: Parcel[] = [
  {
    apn: '093-142-018',
    address: '418 Kingsley Ave, Palo Alto, CA',
    zoning: 'R-1 (Single Family)',
    color: '#facc15',
    lotSqFt: '8,712 sq ft',
    acres: 0.2,
    assessedValue: '$3,940,000',
    taxYear: 2025,
    coords: [-122.1709, 37.4281],
    polygon: [
      [-122.1715, 37.4285],
      [-122.1703, 37.4285],
      [-122.1703, 37.4277],
      [-122.1715, 37.4277],
      [-122.1715, 37.4285],
    ],
  },
  {
    apn: '093-142-019',
    address: '424 Kingsley Ave, Palo Alto, CA',
    zoning: 'R-1 (Single Family)',
    color: '#facc15',
    lotSqFt: '9,580 sq ft',
    acres: 0.22,
    assessedValue: '$4,120,000',
    taxYear: 2025,
    coords: [-122.1693, 37.4281],
    polygon: [
      [-122.1699, 37.4285],
      [-122.1687, 37.4285],
      [-122.1687, 37.4277],
      [-122.1699, 37.4277],
      [-122.1699, 37.4285],
    ],
  },
  {
    apn: '093-142-021',
    address: '510 Lytton Ave, Palo Alto, CA',
    zoning: 'CS (Service Commercial)',
    color: '#c084fc',
    lotSqFt: '21,780 sq ft',
    acres: 0.5,
    assessedValue: '$6,850,000',
    taxYear: 2025,
    coords: [-122.1699, 37.4268],
    polygon: [
      [-122.1708, 37.4273],
      [-122.169, 37.4273],
      [-122.169, 37.4263],
      [-122.1708, 37.4263],
      [-122.1708, 37.4273],
    ],
  },
  {
    apn: '093-142-024',
    address: '777 Bryant Ct, Palo Alto, CA',
    zoning: 'RM-20 (Multi-Family)',
    color: '#38bdf8',
    lotSqFt: '13,068 sq ft',
    acres: 0.3,
    assessedValue: '$5,230,000',
    taxYear: 2025,
    coords: [-122.1723, 37.4268],
    polygon: [
      [-122.173, 37.4273],
      [-122.1716, 37.4273],
      [-122.1716, 37.4263],
      [-122.173, 37.4263],
      [-122.173, 37.4273],
    ],
  },
  {
    apn: '093-142-030',
    address: '250 Hamilton Ave, Palo Alto, CA',
    zoning: 'PF (Public Facility)',
    color: '#34d399',
    lotSqFt: '30,492 sq ft',
    acres: 0.7,
    assessedValue: '$8,900,000',
    taxYear: 2025,
    coords: [-122.1679, 37.4261],
    polygon: [
      [-122.1687, 37.4265],
      [-122.1671, 37.4265],
      [-122.1671, 37.4256],
      [-122.1687, 37.4256],
      [-122.1687, 37.4265],
    ],
  },
]

// Downtown Palo Alto — stable reference so the map's center effect never re-fires.
const MAP_CENTER: [number, number] = [-122.1697, 37.4275]

export function LeafletPropertyBoundaryMap({
  className,
  parcels = DEFAULT_PARCELS,
  ...props
}: LeafletPropertyBoundaryMapProps) {
  const mapRef = React.useRef<LeafletMapRef>(null)
  const [activeApn, setActiveApn] = React.useState(parcels[0]?.apn ?? '')
  const activeParcel = parcels.find((p) => p.apn === activeApn) ?? parcels[0]

  const selectParcel = (p: Parcel) => {
    setActiveApn(p.apn)
    mapRef.current?.flyTo({ center: p.coords, zoom: 17 })
  }

  return (
    <div
      data-slot="leaflet-property-boundary-map"
      className={cn('grid gap-4 lg:grid-cols-[1fr_320px]', className)}
      {...props}
    >
      <div className="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
        <LeafletMap ref={mapRef} variant="satellite-streets" center={MAP_CENTER} zoom={16} className="h-full w-full">
          {/* Cadastral lot polygons, filled by zoning class */}
          {parcels.map((p) => (
            <LeafletPolygon
              key={`lot-${p.apn}`}
              lngLatPath={p.polygon}
              color={p.color}
              weight={activeParcel?.apn === p.apn ? 3 : 1.5}
              opacity={0.95}
              fill
              fillColor={p.color}
              fillOpacity={activeParcel?.apn === p.apn ? 0.35 : 0.15}
              onClick={() => selectParcel(p)}
            />
          ))}

          {parcels.map((p) => (
            <LeafletMarker key={p.apn} lngLat={p.coords} anchor="center" onClick={() => selectParcel(p)}>
              <div className="group flex cursor-pointer flex-col items-center">
                <span
                  className={`border-border bg-background/90 rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold shadow-md transition-transform group-hover:scale-110 ${
                    activeParcel?.apn === p.apn ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                  style={activeParcel?.apn === p.apn ? { color: p.color, borderColor: p.color } : undefined}
                >
                  {p.apn}
                </span>
              </div>
            </LeafletMarker>
          ))}
        </LeafletMap>
      </div>

      {/* Cadastral Parcel Valuation Card */}
      {activeParcel && (
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono text-xs">
                APN {activeParcel.apn}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 text-xs">
                <span className="size-2 rounded-full" style={{ backgroundColor: activeParcel.color }} />
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
      )}
    </div>
  )
}

export default LeafletPropertyBoundaryMap
