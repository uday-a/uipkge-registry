'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeafletMap, LeafletMarker, LeafletPopup, type LeafletMapRef } from '@/components/ui/leaflet-map'

export interface RetailStore {
  id: string
  name: string
  address: string
  neighborhood: string
  lat: number
  lng: number
  distanceMiles: number
  hours: string
  isOpen: boolean
  amenities: string[]
}

export interface LeafletStoreLocatorMapProps extends React.HTMLAttributes<HTMLDivElement> {
  stores?: RetailStore[]
}

const DEFAULT_STORES: RetailStore[] = [
  {
    id: 'nyc-herald',
    name: 'Herald Square',
    address: '151 W 34th St',
    neighborhood: 'Midtown',
    lat: 40.7484,
    lng: -73.9879,
    distanceMiles: 0.3,
    hours: 'Open until 10 PM',
    isOpen: true,
    amenities: ['Pickup', 'Returns', 'Cafe'],
  },
  {
    id: 'nyc-chelsea',
    name: 'Chelsea Market',
    address: '75 9th Ave',
    neighborhood: 'Chelsea',
    lat: 40.7424,
    lng: -74.0061,
    distanceMiles: 0.9,
    hours: 'Open until 9 PM',
    isOpen: true,
    amenities: ['Parking', 'Cafe'],
  },
  {
    id: 'nyc-soho',
    name: 'SoHo Flagship',
    address: '112 Greene St',
    neighborhood: 'SoHo',
    lat: 40.7248,
    lng: -73.9984,
    distanceMiles: 1.6,
    hours: 'Open until 9 PM',
    isOpen: true,
    amenities: ['Parking', 'Pickup', 'Returns'],
  },
  {
    id: 'nyc-ues',
    name: 'Lexington & 78th',
    address: '1120 Lexington Ave',
    neighborhood: 'Upper East Side',
    lat: 40.7736,
    lng: -73.9614,
    distanceMiles: 1.8,
    hours: 'Open until 8 PM',
    isOpen: true,
    amenities: ['Pickup', 'Returns'],
  },
  {
    id: 'nyc-tribeca',
    name: 'Tribeca',
    address: '60 Hudson St',
    neighborhood: 'Tribeca',
    lat: 40.7175,
    lng: -74.0089,
    distanceMiles: 2.1,
    hours: 'Closed · Opens 10 AM',
    isOpen: false,
    amenities: ['Parking', 'Returns'],
  },
]

export function LeafletStoreLocatorMap({ className, stores = DEFAULT_STORES, ...props }: LeafletStoreLocatorMapProps) {
  const [selectedId, setSelectedId] = React.useState(stores[0]?.id ?? '')
  const mapRef = React.useRef<LeafletMapRef>(null)

  const selectStore = (store: RetailStore) => {
    setSelectedId(store.id)
    mapRef.current?.flyTo?.({
      center: [store.lng, store.lat],
      zoom: 14,
      duration: 900,
    })
  }

  return (
    <div
      data-slot="leaflet-store-locator-map"
      className={cn('flex h-full min-h-0 flex-col gap-4', className)}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">Stores</h2>
        <p className="text-muted-foreground text-xs">
          {stores.filter((s) => s.isOpen).length} open · {stores.length} locations
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
          <div className="relative min-h-[360px] flex-1 overflow-hidden">
            <LeafletMap
              ref={mapRef}
              variant="streets"
              center={[-73.985, 40.748]}
              zoom={13}
              className="absolute inset-0 size-full"
            >
              {stores.map((store) => (
                <LeafletMarker key={store.id} lngLat={[store.lng, store.lat]} anchor="center">
                  <button
                    type="button"
                    className={
                      selectedId === store.id
                        ? 'border-primary bg-primary text-primary-foreground rounded-full border px-2 py-0.5 text-xs font-semibold shadow-xs'
                        : 'border-border bg-card text-foreground rounded-full border px-2 py-0.5 text-xs font-semibold shadow-xs'
                    }
                    onClick={() => selectStore(store)}
                  >
                    {store.name}
                  </button>
                  <LeafletPopup offset={[0, -18]} className="space-y-1 text-xs">
                    <p className="text-foreground font-semibold">{store.name}</p>
                    <p className="text-muted-foreground">
                      {store.address}, {store.neighborhood}
                    </p>
                    <p className="text-muted-foreground">
                      {store.hours} · {store.distanceMiles} mi away
                    </p>
                  </LeafletPopup>
                </LeafletMarker>
              ))}
            </LeafletMap>
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
                <div className="min-w-0 space-y-1">
                  <p className="text-foreground truncate text-sm font-medium">{store.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {store.address}, {store.neighborhood} · {store.hours}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {store.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-[10px]">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-muted-foreground font-mono text-xs tabular-nums">{store.distanceMiles} mi</span>
                  <Badge variant={store.isOpen ? 'info' : 'secondary'} className="text-xs">
                    {store.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LeafletStoreLocatorMap
