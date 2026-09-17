'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Map, MapMarker } from '@/components/ui/map'

export interface HubLocation {
  id: string
  code: string
  city: string
  country: string
  lat: number
  lng: number
  latencyMs: number
}

export interface HubLocatorMapProps extends React.HTMLAttributes<HTMLDivElement> {
  accessToken?: string
  hubs?: HubLocation[]
}

const DEFAULT_HUBS: HubLocation[] = [
  {
    id: 'iad-01',
    code: 'IAD-01',
    city: 'Ashburn',
    country: 'United States',
    lat: 39.0438,
    lng: -77.4874,
    latencyMs: 11,
  },
  {
    id: 'lhr-01',
    code: 'LHR-01',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    latencyMs: 14,
  },
  { id: 'fra-01', code: 'FRA-01', city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, latencyMs: 13 },
  { id: 'nrt-01', code: 'NRT-01', city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, latencyMs: 19 },
  { id: 'sin-01', code: 'SIN-01', city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, latencyMs: 22 },
  { id: 'gru-01', code: 'GRU-01', city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, latencyMs: 42 },
]

export function HubLocatorMap({ className, accessToken = '', hubs = DEFAULT_HUBS, ...props }: HubLocatorMapProps) {
  const [selectedId, setSelectedId] = React.useState(hubs[0]?.id ?? '')
  const mapRef = React.useRef<any>(null)

  const selectHub = (hub: HubLocation) => {
    setSelectedId(hub.id)
    mapRef.current?.flyTo?.({
      center: [hub.lng, hub.lat],
      zoom: 5.5,
      essential: true,
      duration: 900,
    })
  }

  return (
    <div data-slot="hub-locator-map" className={cn('flex h-full min-h-0 flex-col gap-4', className)} {...props}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">Hubs</h2>
        <p className="text-muted-foreground text-xs">{hubs.length} locations</p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
          <div className="relative min-h-[360px] flex-1 overflow-hidden">
            <Map
              accessToken={accessToken}
              variant="dark"
              center={[10, 25]}
              zoom={1.6}
              className="absolute inset-0 size-full"
              onCreated={(map) => {
                mapRef.current = map
              }}
            >
              {hubs.map((hub) => (
                <MapMarker key={hub.id} longitude={hub.lng} latitude={hub.lat} anchor="center">
                  <button
                    type="button"
                    className={
                      selectedId === hub.id
                        ? 'border-primary bg-primary text-primary-foreground rounded-full border px-2 py-0.5 font-mono text-xs font-semibold shadow-xs'
                        : 'border-border bg-card text-foreground rounded-full border px-2 py-0.5 font-mono text-xs font-semibold shadow-xs'
                    }
                    onClick={() => selectHub(hub)}
                  >
                    {hub.code}
                  </button>
                </MapMarker>
              ))}
            </Map>
          </div>
        </Card>

        <Card className="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-4">
          <CardHeader className="border-border border-b p-4">
            <CardTitle className="text-sm font-semibold">Locations</CardTitle>
          </CardHeader>
          <CardContent className="divide-border min-h-0 flex-1 divide-y overflow-auto p-0">
            {hubs.map((hub) => (
              <button
                key={hub.id}
                type="button"
                className={cn(
                  'hover:bg-accent/50 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
                  selectedId === hub.id && 'bg-accent/60',
                )}
                onClick={() => selectHub(hub)}
              >
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-medium">{hub.code}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {hub.city}, {hub.country}
                  </p>
                </div>
                <span className="text-muted-foreground font-mono text-xs tabular-nums">{hub.latencyMs}ms</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HubLocatorMap
