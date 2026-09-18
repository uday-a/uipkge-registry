'use client'

import * as React from 'react'
import type { LineLayerSpecification } from 'mapbox-gl'
import { Map, MapMarker, MapSource, MapLayer, type MapVariant } from '@/components/ui/map'
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-react'

export interface MapRegion {
  id: string
  name: string
  path?: string
}

export interface MapPin {
  id?: string
  lat?: number
  lng?: number
  x?: number
  y?: number
  label?: string
  value?: string | number
  color?: string
  status?: string
  description?: string
}

export interface FlowRoute {
  id?: string
  from: { lat?: number; lng?: number; x?: number; y?: number }
  to: { lat?: number; lng?: number; x?: number; y?: number }
  color?: string
  width?: number
  curvature?: number
  animated?: boolean
  dashed?: boolean
  duration?: number
  label?: string
}

export interface RegionDataRecord {
  value?: number
  label?: string
  status?: string
  color?: string
  description?: string
}

export interface VectorMapProps {
  mode?: 'countries' | 'continents'
  regions?: MapRegion[]
  regionData?: Record<string, RegionDataRecord>
  selectedRegion?: string
  onSelectedRegionChange?: (id: string) => void
  pins?: MapPin[]
  routes?: FlowRoute[]
  height?: number | string
  interactive?: boolean
  showGraticule?: boolean
  showRegionLabels?: boolean
  fillColor?: string
  hoverColor?: string
  strokeColor?: string
  className?: string
  ariaLabel?: string
  projection?: 'globe' | 'mercator'
}

export const WORLD_REGIONS: MapRegion[] = [
  { id: 'northAmerica', name: 'North America' },
  { id: 'southAmerica', name: 'South America' },
  { id: 'europe', name: 'Europe' },
  { id: 'asia', name: 'Asia' },
  { id: 'africa', name: 'Africa' },
  { id: 'australiaOceania', name: 'Oceania' },
  { id: 'unitedKingdom', name: 'United Kingdom' },
  { id: 'japan', name: 'Japan' },
]

export const WORLD_COUNTRIES: MapRegion[] = [
  { id: 'US', name: 'United States' },
  { id: 'CA', name: 'Canada' },
  { id: 'GB', name: 'United Kingdom' },
  { id: 'DE', name: 'Germany' },
  { id: 'FR', name: 'France' },
  { id: 'JP', name: 'Japan' },
  { id: 'CN', name: 'China' },
  { id: 'IN', name: 'India' },
  { id: 'BR', name: 'Brazil' },
  { id: 'AU', name: 'Australia' },
]

export function projectPoint(pt: { lat?: number; lng?: number; x?: number; y?: number }) {
  if (pt.x !== undefined && pt.y !== undefined) return { x: pt.x, y: pt.y }
  const lng = pt.lng ?? 0
  const lat = pt.lat ?? 0
  const x = ((lng + 180) / 360) * 1000
  const y = ((90 - lat) / 180) * 500
  return { x, y }
}

export function VectorMap({
  mode = 'continents',
  regions = WORLD_REGIONS,
  regionData = {},
  selectedRegion: controlledRegion,
  onSelectedRegionChange,
  pins = [],
  routes = [],
  height = 460,
  interactive = true,
  projection: initialProjection = 'globe',
  className,
}: VectorMapProps) {
  const [internalRegion, setInternalRegion] = React.useState<string>('northAmerica')
  const [projection, setProjection] = React.useState<'globe' | 'mercator'>(initialProjection)
  const [hoveredPin, setHoveredPin] = React.useState<MapPin | null>(null)

  const activeRegion = controlledRegion !== undefined ? controlledRegion : internalRegion
  const activeRecord = regionData[activeRegion] || null

  const handleSelectRegion = (id: string) => {
    if (!interactive) return
    setInternalRegion(id)
    onSelectedRegionChange?.(id)
  }

  const toggleProjection = () => {
    setProjection((prev) => (prev === 'globe' ? 'mercator' : 'globe'))
  }

  const routesGeoJson = React.useMemo(() => {
    if (!routes || !routes.length) return null
    return {
      type: 'FeatureCollection',
      features: routes.map((r, i) => {
        const fromLng = r.from.lng ?? -74
        const fromLat = r.from.lat ?? 40
        const toLng = r.to.lng ?? 8
        const toLat = r.to.lat ?? 50
        return {
          type: 'Feature',
          id: i,
          properties: {
            color: r.color || 'rgba(56, 189, 248, 0.75)',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [fromLng, fromLat],
              [(fromLng + toLng) / 2, (fromLat + toLat) / 2 + 5],
              [toLng, toLat],
            ],
          },
        }
      }),
    }
  }, [routes])

  // mapbox reads a data-driven paint value as an expression tuple; without the
  // annotation TS widens ['get', 'color'] to string[] and the layer rejects it.
  const routeLinePaint: LineLayerSpecification['paint'] = {
    'line-color': ['get', 'color'],
    'line-width': 1.5,
    'line-dasharray': [2, 2],
  }

  return (
    <div
      className={cn(
        'border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs',
        className,
      )}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <Map variant="dark" projection={projection} center={[10, 25]} zoom={1.6} className="size-full">
        {routesGeoJson && (
          <MapSource id="vector-routes-source" type="geojson" data={routesGeoJson}>
            <MapLayer id="vector-routes-layer" type="line" paint={routeLinePaint} />
          </MapSource>
        )}

        {pins.map((pin, i) => (
          <MapMarker
            key={i}
            longitude={pin.lng ?? 0}
            latitude={pin.lat ?? 0}
            anchor="center"
            className="cursor-pointer select-none"
          >
            <div
              className="relative flex size-6 items-center justify-center"
              onMouseEnter={() => setHoveredPin(pin)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <span
                className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                style={{ backgroundColor: pin.color || 'oklch(0.65 0.20 145)' }}
              />
              <span
                className="ring-background relative inline-flex size-2.5 rounded-full shadow-xs ring-2"
                style={{
                  backgroundColor: pin.color || 'oklch(0.65 0.20 145)',
                  boxShadow: `0 0 10px ${pin.color || 'oklch(0.65 0.20 145)'}`,
                }}
              />
            </div>
          </MapMarker>
        ))}
      </Map>

      <div className="border-border/70 bg-card/85 absolute top-3 left-3 z-10 hidden max-w-md flex-wrap gap-1 rounded-lg border p-1.5 shadow-xs backdrop-blur-md md:flex">
        {regions.map((r) => (
          <button
            key={r.id}
            type="button"
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-medium transition',
              activeRegion === r.id
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            onClick={() => handleSelectRegion(r.id)}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div className="border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md">
        <button
          type="button"
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
          onClick={toggleProjection}
        >
          <Globe className="size-3.5" />
          <span className="capitalize">{projection}</span>
        </button>
      </div>

      {activeRecord && (
        <div className="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150">
          <div className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: activeRecord.color || 'oklch(0.65 0.20 145)' }}
            />
            <h4 className="text-foreground text-sm font-semibold capitalize">
              {activeRegion.replace(/([A-Z])/g, ' $1')}
            </h4>
            <span className="text-muted-foreground ml-auto font-mono text-xs uppercase">
              {activeRecord.status || 'Optimal'}
            </span>
          </div>

          {activeRecord.value !== undefined && (
            <div className="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs">
              <span className="text-muted-foreground">Active Nodes</span>
              <span className="text-foreground font-semibold">{activeRecord.value.toLocaleString()}</span>
            </div>
          )}

          {activeRecord.description && (
            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">{activeRecord.description}</p>
          )}
        </div>
      )}

      {hoveredPin && (
        <div className="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute right-3 bottom-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150">
          <div className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: hoveredPin.color || 'oklch(0.65 0.20 145)' }}
            />
            <h5 className="text-foreground text-xs font-semibold">{hoveredPin.label || 'Hub'}</h5>
          </div>
          {hoveredPin.description && <p className="text-muted-foreground mt-1 text-xs">{hoveredPin.description}</p>}
          {hoveredPin.value !== undefined && (
            <div className="border-border/60 mt-2 flex items-baseline justify-between border-t pt-1.5 font-mono text-xs">
              <span className="text-muted-foreground">Throughput</span>
              <span className="text-foreground font-semibold">{hoveredPin.value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VectorMap
