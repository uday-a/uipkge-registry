import * as React from 'react'
import { Map, MapMarker, MapSource, MapLayer, type MapVariant } from '@/components/ui/map'
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-react'

export interface ChoroplethDatum {
  id: string
  value: number
  name?: string
}

export interface ChoroplethPin {
  name: string
  coord: [number, number]
  color?: string
}

export interface ChoroplethLink {
  from: [number, number]
  to: [number, number]
  label?: string
}

export interface ChoroplethMapChartProps {
  geoJson: any
  mapName?: string
  data?: ChoroplethDatum[]
  idField?: 'id' | 'name'
  pins?: ChoroplethPin[]
  links?: ChoroplethLink[]
  showScale?: boolean
  height?: number | string
  center?: [number, number]
  zoom?: number
  variant?: MapVariant
  projection?: 'globe' | 'mercator'
  className?: string
  ariaLabel?: string
}

export function ChoroplethMapChart({
  geoJson,
  mapName = 'uipkge-map',
  data = [],
  idField = 'id',
  pins = [],
  links = [],
  showScale = true,
  height = 420,
  center = [0, 20],
  zoom = 1.5,
  variant = 'dark',
  projection: initialProjection = 'globe',
  className,
}: ChoroplethMapChartProps) {
  const [projection, setProjection] = React.useState<'globe' | 'mercator'>(initialProjection)

  const dataMap = React.useMemo(() => {
    const map = new globalThis.Map<string, number>()
    if (!data) return map
    for (const d of data) {
      map.set(String(d.id).toLowerCase(), d.value)
      if (d.name) map.set(String(d.name).toLowerCase(), d.value)
    }
    return map
  }, [data])

  const values = React.useMemo(() => (data ? data.map((d) => d.value) : []), [data])
  const minValue = React.useMemo(() => (values.length ? Math.min(...values) : 0), [values])
  const maxValue = React.useMemo(() => (values.length ? Math.max(...values) : 100), [values])

  const enrichedGeoJson = React.useMemo(() => {
    if (!geoJson || !geoJson.features) return geoJson
    const features = geoJson.features.map((f: any) => {
      const idVal = f.id !== undefined ? String(f.id).toLowerCase() : ''
      const nameVal = f.properties?.name ? String(f.properties.name).toLowerCase() : ''
      const matchedVal = dataMap.get(idVal) ?? dataMap.get(nameVal) ?? null

      return {
        ...f,
        properties: {
          ...f.properties,
          value: matchedVal,
          title: f.properties?.name || f.id || 'Region',
        },
      }
    })

    return {
      ...geoJson,
      features,
    }
  }, [geoJson, dataMap])

  const fillPaint = React.useMemo(
    () => ({
      'fill-color': [
        'case',
        ['!=', ['get', 'value'], null],
        [
          'interpolate',
          ['linear'],
          ['get', 'value'],
          minValue,
          'rgba(56, 189, 248, 0.25)',
          maxValue,
          'rgba(56, 189, 248, 0.9)',
        ],
        'rgba(255, 255, 255, 0.04)',
      ] as any,
      'fill-opacity': 0.85,
    }),
    [minValue, maxValue],
  )

  const strokePaint = {
    'line-color': 'rgba(255, 255, 255, 0.25)',
    'line-width': 1,
  }

  const linksGeoJson = React.useMemo(() => {
    if (!links || !links.length) return null
    return {
      type: 'FeatureCollection',
      features: links.map((link) => ({
        type: 'Feature',
        properties: { label: link.label },
        geometry: {
          type: 'LineString',
          coordinates: [link.from, link.to],
        },
      })),
    }
  }, [links])

  const linkLinePaint = {
    'line-color': 'rgba(245, 158, 11, 0.75)',
    'line-width': 2,
    'line-dasharray': [2, 2],
  }

  const toggleProjection = () => {
    setProjection((prev) => (prev === 'globe' ? 'mercator' : 'globe'))
  }

  return (
    <div
      className={cn(
        'border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs',
        className,
      )}
      style={{
        height: typeof height === 'number' ? `${height}px` : /^\d+$/.test(String(height)) ? `${height}px` : height,
      }}
    >
      <Map variant={variant} projection={projection} center={center} zoom={zoom} className="size-full">
        <MapSource id="choropleth-source" type="geojson" data={enrichedGeoJson}>
          <MapLayer id="choropleth-fill" type="fill" paint={fillPaint} />
          <MapLayer id="choropleth-stroke" type="line" paint={strokePaint} />
        </MapSource>

        {linksGeoJson && (
          <MapSource id="choropleth-links-source" type="geojson" data={linksGeoJson}>
            <MapLayer id="choropleth-links" type="line" paint={linkLinePaint} />
          </MapSource>
        )}

        {pins.map((pin, i) => (
          <MapMarker key={i} longitude={pin.coord[0]} latitude={pin.coord[1]} anchor="bottom">
            <div className="flex flex-col items-center">
              <span
                className="size-3 rounded-full shadow-md ring-4"
                style={{
                  backgroundColor: pin.color || 'oklch(0.65 0.20 145)',
                  boxShadow: `0 0 10px ${pin.color || 'oklch(0.65 0.20 145)'}`,
                }}
              />
              <span className="border-border/80 bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs backdrop-blur-xs">
                {pin.name}
              </span>
            </div>
          </MapMarker>
        ))}
      </Map>

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

      {showScale && values.length > 0 && (
        <div className="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-2.5 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex">
          <span className="text-muted-foreground font-mono text-[11px]">Range</span>
          <span className="text-muted-foreground font-mono text-[10px]">{minValue}</span>
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-sky-400/30 to-sky-400" />
          <span className="text-foreground font-mono text-[10px] font-semibold">{maxValue}</span>
        </div>
      )}
    </div>
  )
}

export default ChoroplethMapChart
