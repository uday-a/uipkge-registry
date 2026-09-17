'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Map, MapMarker } from '@/components/ui/map'

export interface RetailStore {
  id: string
  name: string
  city: string
  country: string
  lat: number
  lng: number
  isOpen: boolean
}

export interface StoreLocatorMapProps extends React.HTMLAttributes<HTMLDivElement> {
  accessToken?: string
  stores?: RetailStore[]
}

const DEFAULT_STORES: RetailStore[] = [
  {
    id: 'nyc-soho',
    name: 'SoHo Flagship',
    city: 'New York',
    country: 'United States',
    lat: 40.7248,
    lng: -73.9984,
    isOpen: true,
  },
  {
    id: 'lon-regent',
    name: 'Regent Street',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5142,
    lng: -0.1418,
    isOpen: true,
  },
  { id: 'tyo-ginza', name: 'Ginza Studio', city: 'Tokyo', country: 'Japan', lat: 35.6719, lng: 139.7658, isOpen: true },
  {
    id: 'par-champs',
    name: 'Champs-Élysées',
    city: 'Paris',
    country: 'France',
    lat: 48.8718,
    lng: 2.3013,
    isOpen: true,
  },
  {
    id: 'syd-george',
    name: 'George Street',
    city: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    isOpen: false,
  },
]

export function StoreLocatorMap({
  className,
  accessToken = '',
  stores = DEFAULT_STORES,
  ...props
}: StoreLocatorMapProps) {
  const [selectedId, setSelectedId] = React.useState(stores[0]?.id ?? '')
  const mapRef = React.useRef<any>(null)

  const selectStore = (store: RetailStore) => {
    setSelectedId(store.id)
    mapRef.current?.flyTo?.({
      center: [store.lng, store.lat],
      zoom: 12.5,
      essential: true,
      duration: 900,
    })
  }

  return (
    <div data-slot="store-locator-map" className={cn('flex h-full min-h-0 flex-col gap-4', className)} {...props}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">Stores</h2>
        <p className="text-muted-foreground text-xs">
          {stores.filter((s) => s.isOpen).length} open · {stores.length} locations
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
          <div className="relative min-h-[360px] flex-1 overflow-hidden">
            <Map
              accessToken={accessToken}
              variant="dark"
              center={[10, 20]}
              zoom={1.5}
              className="absolute inset-0 size-full"
              onCreated={(map) => {
                mapRef.current = map
              }}
            >
              {stores.map((store) => (
                <MapMarker key={store.id} longitude={store.lng} latitude={store.lat} anchor="center">
                  <button
                    type="button"
                    className={
                      selectedId === store.id
                        ? 'border-primary bg-primary text-primary-foreground rounded-full border px-2 py-0.5 text-xs font-semibold shadow-xs'
                        : 'border-border bg-card text-foreground rounded-full border px-2 py-0.5 text-xs font-semibold shadow-xs'
                    }
                    onClick={() => selectStore(store)}
                  >
                    {store.city}
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
            {stores.map((store) => (
              <button
                key={store.id}
                type="button"
                className={cn(
                  'hover:bg-accent/50 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
                  selectedId === store.id && 'bg-accent/60',
                )}
                onClick={() => selectStore(store)}
              >
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-medium">{store.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {store.city}, {store.country}
                  </p>
                </div>
                <Badge variant={store.isOpen ? 'info' : 'secondary'} className="shrink-0 text-xs">
                  {store.isOpen ? 'Open' : 'Closed'}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StoreLocatorMap
