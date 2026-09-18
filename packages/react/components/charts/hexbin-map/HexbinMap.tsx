'use client'

import * as React from 'react'
import { Map, MapMarker, type MapVariant } from '@/components/ui/map'
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-react'

export interface HexState {
  id: string
  name: string
  col: number
  row: number
}

export interface HexbinDatum {
  value: number
  status?: 'leader' | 'active' | 'growing' | 'developing' | 'neutral'
  description?: string
  color?: string
}

export interface HexbinMapProps {
  shape?: 'hexagon' | 'square'
  preset?: 'us-states' | 'world-regions'
  items?: HexState[]
  data?: Record<string, HexbinDatum>
  selected?: string
  onSelectedChange?: (id: string | undefined) => void
  onSelect?: (payload: { id: string; name: string; datum?: HexbinDatum }) => void
  showLabels?: boolean
  showValues?: boolean
  valueFormatter?: (value: number) => string
  colorRamp?: string[]
  emptyColor?: string
  height?: number | string
  interactive?: boolean
  className?: string
  ariaLabel?: string
}

export const US_HEX_STATES: HexState[] = [
  { id: 'AK', name: 'Alaska', col: 0, row: 0 },
  { id: 'ME', name: 'Maine', col: 11, row: 0 },
  { id: 'WA', name: 'Washington', col: 1, row: 1 },
  { id: 'ID', name: 'Idaho', col: 2, row: 1 },
  { id: 'MT', name: 'Montana', col: 3, row: 1 },
  { id: 'ND', name: 'North Dakota', col: 4, row: 1 },
  { id: 'MN', name: 'Minnesota', col: 5, row: 1 },
  { id: 'IL', name: 'Illinois', col: 6, row: 1 },
  { id: 'WI', name: 'Wisconsin', col: 7, row: 1 },
  { id: 'MI', name: 'Michigan', col: 8, row: 1 },
  { id: 'NY', name: 'New York', col: 9, row: 1 },
  { id: 'VT', name: 'Vermont', col: 10, row: 1 },
  { id: 'NH', name: 'New Hampshire', col: 11, row: 1 },
  { id: 'OR', name: 'Oregon', col: 1, row: 2 },
  { id: 'NV', name: 'Nevada', col: 2, row: 2 },
  { id: 'WY', name: 'Wyoming', col: 3, row: 2 },
  { id: 'SD', name: 'South Dakota', col: 4, row: 2 },
  { id: 'IA', name: 'Iowa', col: 5, row: 2 },
  { id: 'IN', name: 'Indiana', col: 6, row: 2 },
  { id: 'OH', name: 'Ohio', col: 7, row: 2 },
  { id: 'PA', name: 'Pennsylvania', col: 8, row: 2 },
  { id: 'NJ', name: 'New Jersey', col: 9, row: 2 },
  { id: 'MA', name: 'Massachusetts', col: 10, row: 2 },
  { id: 'RI', name: 'Rhode Island', col: 11, row: 2 },
  { id: 'CA', name: 'California', col: 1, row: 3 },
  { id: 'UT', name: 'Utah', col: 2, row: 3 },
  { id: 'CO', name: 'Colorado', col: 3, row: 3 },
  { id: 'NE', name: 'Nebraska', col: 4, row: 3 },
  { id: 'MO', name: 'Missouri', col: 5, row: 3 },
  { id: 'KY', name: 'Kentucky', col: 6, row: 3 },
  { id: 'WV', name: 'West Virginia', col: 7, row: 3 },
  { id: 'VA', name: 'Virginia', col: 8, row: 3 },
  { id: 'MD', name: 'Maryland', col: 9, row: 3 },
  { id: 'DE', name: 'Delaware', col: 10, row: 3 },
  { id: 'AZ', name: 'Arizona', col: 2, row: 4 },
  { id: 'NM', name: 'New Mexico', col: 3, row: 4 },
  { id: 'KS', name: 'Kansas', col: 4, row: 4 },
  { id: 'AR', name: 'Arkansas', col: 5, row: 4 },
  { id: 'TN', name: 'Tennessee', col: 6, row: 4 },
  { id: 'NC', name: 'North Carolina', col: 7, row: 4 },
  { id: 'SC', name: 'South Carolina', col: 8, row: 4 },
  { id: 'DC', name: 'District of Columbia', col: 9, row: 4 },
  { id: 'CT', name: 'Connecticut', col: 10, row: 4 },
  { id: 'OK', name: 'Oklahoma', col: 4, row: 5 },
  { id: 'LA', name: 'Louisiana', col: 5, row: 5 },
  { id: 'MS', name: 'Mississippi', col: 6, row: 5 },
  { id: 'AL', name: 'Alabama', col: 7, row: 5 },
  { id: 'GA', name: 'Georgia', col: 8, row: 5 },
  { id: 'HI', name: 'Hawaii', col: 0, row: 6 },
  { id: 'TX', name: 'Texas', col: 4, row: 6 },
  { id: 'FL', name: 'Florida', col: 8, row: 6 },
]

export const WORLD_HEX_REGIONS: HexState[] = [
  { id: 'CA', name: 'Canada', col: 2, row: 0 },
  { id: 'GL', name: 'Greenland', col: 4, row: 0 },
  { id: 'NO', name: 'Nordics', col: 6, row: 0 },
  { id: 'US-W', name: 'US West', col: 1, row: 1 },
  { id: 'US-E', name: 'US East', col: 2, row: 1 },
  { id: 'UK', name: 'United Kingdom', col: 5, row: 1 },
  { id: 'EU-W', name: 'Western Europe', col: 6, row: 1 },
  { id: 'EU-E', name: 'Eastern Europe', col: 7, row: 1 },
  { id: 'RU', name: 'Northern Eurasia', col: 8, row: 1 },
  { id: 'MX', name: 'Mexico', col: 1, row: 2 },
  { id: 'MED', name: 'Mediterranean', col: 6, row: 2 },
  { id: 'ME', name: 'Middle East', col: 7, row: 2 },
  { id: 'CN', name: 'East Asia', col: 8, row: 2 },
  { id: 'JP', name: 'Japan', col: 9, row: 2 },
  { id: 'BR', name: 'Brazil', col: 2, row: 3 },
  { id: 'AF-N', name: 'North Africa', col: 5, row: 3 },
  { id: 'IN', name: 'South Asia', col: 7, row: 3 },
  { id: 'SEA', name: 'Southeast Asia', col: 8, row: 3 },
  { id: 'AR', name: 'South Cone', col: 2, row: 4 },
  { id: 'AF-S', name: 'Sub-Saharan', col: 5, row: 4 },
  { id: 'AU', name: 'Australia & Oceania', col: 8, row: 4 },
]

const US_CENTROIDS: Record<string, [number, number]> = {
  AK: [-152.4, 64.2],
  ME: [-69.4, 45.3],
  WA: [-120.7, 47.7],
  ID: [-114.7, 44.1],
  MT: [-110.4, 46.9],
  ND: [-100.5, 47.5],
  MN: [-94.6, 46.7],
  IL: [-89.4, 40.6],
  WI: [-89.6, 43.8],
  MI: [-85.6, 44.3],
  NY: [-74.2, 43.3],
  VT: [-72.6, 44.6],
  NH: [-71.6, 43.2],
  OR: [-120.5, 43.8],
  NV: [-116.4, 38.8],
  WY: [-107.3, 43.1],
  SD: [-99.9, 44.3],
  IA: [-93.5, 42.0],
  IN: [-86.1, 40.3],
  OH: [-82.9, 40.4],
  PA: [-77.2, 41.2],
  NJ: [-74.4, 40.1],
  MA: [-71.4, 42.4],
  RI: [-71.5, 41.6],
  CA: [-119.4, 36.8],
  UT: [-111.1, 39.3],
  CO: [-105.8, 39.5],
  NE: [-99.9, 41.5],
  MO: [-91.8, 37.9],
  KY: [-84.3, 37.8],
  WV: [-80.4, 38.6],
  VA: [-78.7, 37.4],
  MD: [-76.6, 39.0],
  DE: [-75.5, 39.0],
  AZ: [-111.1, 34.0],
  NM: [-106.0, 34.5],
  KS: [-98.5, 38.5],
  AR: [-92.3, 34.8],
  TN: [-86.6, 35.5],
  NC: [-79.0, 35.8],
  SC: [-81.2, 33.8],
  DC: [-77.0, 38.9],
  CT: [-72.7, 41.6],
  OK: [-97.5, 35.0],
  LA: [-91.9, 30.9],
  MS: [-89.7, 32.4],
  AL: [-86.9, 32.3],
  GA: [-83.6, 32.2],
  HI: [-157.8, 21.3],
  TX: [-99.9, 31.9],
  FL: [-81.5, 27.6],
}

function getCoords(item: HexState): [number, number] {
  if (US_CENTROIDS[item.id]) return US_CENTROIDS[item.id]
  const lng = -120 + item.col * 14
  const lat = 50 - item.row * 8
  return [lng, lat]
}

export function HexbinMap({
  shape = 'hexagon',
  preset = 'us-states',
  items,
  data = {},
  selected: controlledSelected,
  onSelectedChange,
  onSelect,
  showLabels = true,
  showValues = false,
  valueFormatter = (v: number) => v.toLocaleString(),
  colorRamp = [
    'oklch(0.92 0.05 162)',
    'oklch(0.82 0.10 162)',
    'oklch(0.72 0.14 162)',
    'oklch(0.62 0.17 162)',
    'oklch(0.50 0.18 162)',
    'oklch(0.38 0.16 162)',
  ],
  emptyColor = 'rgba(255, 255, 255, 0.08)',
  height = 480,
  interactive = true,
  className,
}: HexbinMapProps) {
  const [internalSelected, setInternalSelected] = React.useState<string | undefined>(controlledSelected)
  const [projection, setProjection] = React.useState<'globe' | 'mercator'>(
    preset === 'world-regions' ? 'globe' : 'mercator',
  )

  const activeSelected = controlledSelected !== undefined ? controlledSelected : internalSelected

  const activeItems = React.useMemo(() => {
    if (items && items.length > 0) return items
    return preset === 'world-regions' ? WORLD_HEX_REGIONS : US_HEX_STATES
  }, [items, preset])

  const values = React.useMemo(() => {
    return Object.values(data)
      .map((d) => d.value)
      .filter((v) => typeof v === 'number')
  }, [data])

  const minValue = React.useMemo(() => (values.length ? Math.min(...values) : 0), [values])
  const maxValue = React.useMemo(() => (values.length ? Math.max(...values) : 100), [values])

  const getColor = React.useCallback(
    (datum?: HexbinDatum): string => {
      if (!datum) return emptyColor
      if (datum.color) return datum.color

      const val = datum.value
      const span = maxValue - minValue
      const normalized = span > 0 ? (val - minValue) / span : 0.5
      const idx = Math.min(colorRamp.length - 1, Math.floor(normalized * colorRamp.length))
      return colorRamp[idx]
    },
    [emptyColor, maxValue, minValue, colorRamp],
  )

  const activeStateItem = React.useMemo(
    () => activeItems.find((it) => it.id === activeSelected),
    [activeItems, activeSelected],
  )
  const activeStateDatum = React.useMemo(
    () => (activeSelected ? data[activeSelected] : undefined),
    [activeSelected, data],
  )

  const handleSelect = (item: HexState) => {
    if (!interactive) return
    setInternalSelected(item.id)
    onSelectedChange?.(item.id)
    onSelect?.({ id: item.id, name: item.name, datum: data[item.id] })
  }

  const mapCenter: [number, number] = React.useMemo(() => {
    return preset === 'world-regions' ? [0, 20] : [-97, 39]
  }, [preset])

  const mapZoom = React.useMemo(() => {
    return preset === 'world-regions' ? 1.5 : 3.6
  }, [preset])

  const toggleProjection = () => {
    setProjection((prev) => (prev === 'globe' ? 'mercator' : 'globe'))
  }

  return (
    <div
      className={cn(
        'border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs',
        className,
      )}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <Map variant="dark" projection={projection} center={mapCenter} zoom={mapZoom} className="size-full">
        {activeItems.map((item) => {
          const coords = getCoords(item)
          const isSelected = activeSelected === item.id
          const color = getColor(data[item.id])

          return (
            <MapMarker
              key={item.id}
              longitude={coords[0]}
              latitude={coords[1]}
              anchor="center"
              className={cn(
                'cursor-pointer transition-transform select-none',
                isSelected ? 'z-30 scale-115' : 'z-20 hover:scale-105',
              )}
            >
              <button
                type="button"
                className="group/hex relative flex size-10 items-center justify-center font-mono"
                onClick={() => handleSelect(item)}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    clipPath:
                      shape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : 'none',
                    backgroundColor: color,
                    border: isSelected ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
                    boxShadow: isSelected ? `0 0 14px ${color}` : 'none',
                  }}
                />

                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-white drop-shadow-sm">{item.id}</span>
                  {showValues && data[item.id] && (
                    <span className="text-[8px] font-semibold text-white/90">{Math.round(data[item.id].value)}</span>
                  )}
                </div>
              </button>
            </MapMarker>
          )
        })}
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

      {activeStateItem && (
        <div className="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: getColor(activeStateDatum) }} />
                <span className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                  {activeStateDatum?.status || 'Region'}
                </span>
              </div>
              <h4 className="text-foreground mt-0.5 text-sm font-semibold">
                {activeStateItem.name} ({activeStateItem.id})
              </h4>
            </div>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground text-xs"
              onClick={() => {
                setInternalSelected(undefined)
                onSelectedChange?.(undefined)
              }}
            >
              ✕
            </button>
          </div>

          {activeStateDatum && (
            <div className="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs">
              <span className="text-muted-foreground">Adoption Metric</span>
              <span className="text-foreground font-semibold">{valueFormatter(activeStateDatum.value)}%</span>
            </div>
          )}

          {activeStateDatum?.description && (
            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">{activeStateDatum.description}</p>
          )}
        </div>
      )}

      {values.length > 0 && (
        <div className="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex">
          <span className="text-muted-foreground font-mono text-[10px]">{minValue}</span>
          <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-xs">
            {colorRamp.map((c, i) => (
              <div key={i} className="w-3" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span className="text-foreground font-mono text-[10px] font-semibold">{maxValue}</span>
        </div>
      )}
    </div>
  )
}

export default HexbinMap
