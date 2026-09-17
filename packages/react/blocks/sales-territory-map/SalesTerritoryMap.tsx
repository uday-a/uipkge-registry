'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Map, MapMarker } from '@/components/ui/map'

export interface SalesTerritory {
  id: string
  name: string
  code: string
  arr: string
  attainment: number
  status: 'attained' | 'ontrack' | 'attention'
  centerLngLat: [number, number]
}

export const DEFAULT_TERRITORIES: SalesTerritory[] = [
  {
    id: 'na-enterprise',
    name: 'North America',
    code: 'NA-ENT',
    arr: '$6.4M',
    attainment: 111,
    status: 'attained',
    centerLngLat: [-98.5, 39.8],
  },
  {
    id: 'emea-central',
    name: 'EMEA Central',
    code: 'EMEA-C',
    arr: '$5.8M',
    attainment: 124,
    status: 'attained',
    centerLngLat: [10.4, 51.1],
  },
  {
    id: 'apac-growth',
    name: 'APAC Growth',
    code: 'APAC-G',
    arr: '$4.1M',
    attainment: 94,
    status: 'ontrack',
    centerLngLat: [120.0, 30.0],
  },
  {
    id: 'latam-emerging',
    name: 'Latin America',
    code: 'LATAM-E',
    arr: '$2.1M',
    attainment: 83,
    status: 'attention',
    centerLngLat: [-55.0, -14.0],
  },
]

export interface SalesTerritoryMapProps extends React.HTMLAttributes<HTMLDivElement> {
  territories?: SalesTerritory[]
  accessToken?: string
}

function statusVariant(status: SalesTerritory['status']) {
  if (status === 'attained') return 'info' as const
  if (status === 'ontrack') return 'secondary' as const
  return 'warning' as const
}

export function SalesTerritoryMap({
  className,
  territories = DEFAULT_TERRITORIES,
  accessToken = '',
  ...props
}: SalesTerritoryMapProps) {
  const [selectedId, setSelectedId] = React.useState(territories[0]?.id ?? '')
  const mapRef = React.useRef<any>(null)

  const fitTerritories = (map: any) => {
    const coords = territories.map((t) => t.centerLngLat)
    if (coords.length < 2) return
    const lons = coords.map((c) => c[0])
    const lats = coords.map((c) => c[1])
    try {
      map.fitBounds(
        [
          [Math.min(...lons), Math.min(...lats)],
          [Math.max(...lons), Math.max(...lats)],
        ],
        { padding: { top: 48, bottom: 48, left: 80, right: 80 }, duration: 0, maxZoom: 1.8 },
      )
    } catch {
      /* map not ready */
    }
  }

  const selectTerritory = (territory: SalesTerritory) => {
    setSelectedId(territory.id)
    mapRef.current?.flyTo?.({
      center: territory.centerLngLat,
      zoom: 2.8,
      essential: true,
      duration: 800,
    })
  }

  return (
    <div data-slot="sales-territory-map" className={cn('flex h-full min-h-0 flex-col gap-4', className)} {...props}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">Territories</h2>
        <p className="text-muted-foreground text-xs">{territories.length} regions</p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
          <div className="relative min-h-[360px] flex-1 overflow-hidden">
            <Map
              accessToken={accessToken}
              variant="dark"
              center={[15, 20]}
              zoom={1.2}
              className="absolute inset-0 size-full"
              onCreated={(map) => {
                mapRef.current = map
                if (typeof map.loaded === 'function' && map.loaded()) fitTerritories(map)
                else map.once?.('load', () => fitTerritories(map))
              }}
            >
              {territories.map((t) => (
                <MapMarker key={t.id} longitude={t.centerLngLat[0]} latitude={t.centerLngLat[1]} anchor="center">
                  <button
                    type="button"
                    className={
                      selectedId === t.id
                        ? 'border-primary bg-primary text-primary-foreground rounded-full border px-2 py-0.5 font-mono text-xs font-semibold shadow-xs'
                        : 'border-border bg-card text-foreground rounded-full border px-2 py-0.5 font-mono text-xs font-semibold shadow-xs'
                    }
                    onClick={() => selectTerritory(t)}
                  >
                    {t.code} {t.attainment}%
                  </button>
                </MapMarker>
              ))}
            </Map>
          </div>
        </Card>

        <Card className="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-4">
          <CardHeader className="border-border border-b p-4">
            <CardTitle className="text-sm font-semibold">Quota</CardTitle>
          </CardHeader>
          <CardContent className="divide-border min-h-0 flex-1 divide-y overflow-auto p-0">
            {territories.map((t) => (
              <button
                key={t.id}
                type="button"
                className={cn(
                  'hover:bg-accent/50 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
                  selectedId === t.id && 'bg-accent/60',
                )}
                onClick={() => selectTerritory(t)}
              >
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-medium">
                    {t.code} · {t.name}
                  </p>
                  <p className="text-muted-foreground font-mono text-xs tabular-nums">{t.arr}</p>
                </div>
                <Badge variant={statusVariant(t.status)} className="shrink-0 text-xs tabular-nums">
                  {t.attainment}%
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SalesTerritoryMap
