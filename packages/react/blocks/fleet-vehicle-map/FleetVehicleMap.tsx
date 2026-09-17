'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Map, MapMarker } from '@/components/ui/map'

export type VehicleStatus = 'moving' | 'idling' | 'parked'

export interface FleetVehicle {
  id: string
  identifier: string
  model: string
  driver: string
  status: VehicleStatus
  speed: number
  lat: number
  lng: number
}

export interface FleetVehicleMapProps extends React.HTMLAttributes<HTMLDivElement> {
  accessToken?: string
  vehicles?: FleetVehicle[]
}

const DEFAULT_VEHICLES: FleetVehicle[] = [
  {
    id: 'v-104',
    identifier: 'Truck #104',
    model: 'Volvo VNL 860',
    driver: 'Marcus Vance',
    status: 'moving',
    speed: 64,
    lat: 41.5868,
    lng: -93.625,
  },
  {
    id: 'v-208',
    identifier: 'Van #208',
    model: 'Ford E-Transit 350',
    driver: 'Elena Rostova',
    status: 'moving',
    speed: 48,
    lat: 41.6005,
    lng: -93.712,
  },
  {
    id: 'v-109',
    identifier: 'Truck #109',
    model: 'Freightliner Cascadia',
    driver: 'Derrick Hayes',
    status: 'idling',
    speed: 0,
    lat: 41.984,
    lng: -93.582,
  },
  {
    id: 'v-212',
    identifier: 'Van #212',
    model: 'Mercedes Sprinter',
    driver: 'Aaliyah Patel',
    status: 'moving',
    speed: 52,
    lat: 41.591,
    lng: -93.604,
  },
]

function statusVariant(status: VehicleStatus) {
  if (status === 'moving') return 'info' as const
  if (status === 'idling') return 'warning' as const
  return 'secondary' as const
}

export function FleetVehicleMap({
  className,
  accessToken = '',
  vehicles = DEFAULT_VEHICLES,
  ...props
}: FleetVehicleMapProps) {
  const [selectedId, setSelectedId] = React.useState(vehicles[0]?.id ?? '')
  const mapRef = React.useRef<any>(null)
  const selected = vehicles.find((v) => v.id === selectedId) ?? vehicles[0]

  const selectVehicle = (vehicle: FleetVehicle) => {
    setSelectedId(vehicle.id)
    mapRef.current?.flyTo?.({
      center: [vehicle.lng, vehicle.lat],
      zoom: 12,
      essential: true,
      duration: 800,
    })
  }

  return (
    <div data-slot="fleet-vehicle-map" className={cn('flex h-full min-h-0 flex-col gap-4', className)} {...props}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">Fleet</h2>
        <p className="text-muted-foreground text-xs">{vehicles.length} units</p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
          <div className="relative min-h-[360px] flex-1 overflow-hidden">
            <Map
              accessToken={accessToken}
              variant="dark"
              center={selected ? [selected.lng, selected.lat] : [-93.625, 41.59]}
              zoom={11}
              className="absolute inset-0 size-full"
              onCreated={(map) => {
                mapRef.current = map
              }}
            >
              {vehicles.map((vehicle) => (
                <MapMarker key={vehicle.id} longitude={vehicle.lng} latitude={vehicle.lat} anchor="center">
                  <button
                    type="button"
                    className={
                      selectedId === vehicle.id
                        ? 'border-primary bg-primary text-primary-foreground rounded-full border px-2 py-0.5 font-mono text-xs font-semibold shadow-xs'
                        : 'border-border bg-card text-foreground rounded-full border px-2 py-0.5 font-mono text-xs font-semibold shadow-xs'
                    }
                    onClick={() => selectVehicle(vehicle)}
                  >
                    {vehicle.identifier.replace('Truck ', '').replace('Van ', '')}
                  </button>
                </MapMarker>
              ))}
            </Map>
          </div>
        </Card>

        <Card className="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-4">
          <CardHeader className="border-border border-b p-4">
            <CardTitle className="text-sm font-semibold">Vehicles</CardTitle>
          </CardHeader>
          <CardContent className="divide-border min-h-0 flex-1 divide-y overflow-auto p-0">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                className={cn(
                  'hover:bg-accent/50 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
                  selectedId === vehicle.id && 'bg-accent/60',
                )}
                onClick={() => selectVehicle(vehicle)}
              >
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-medium">{vehicle.identifier}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {vehicle.driver} · {vehicle.model}
                  </p>
                </div>
                <Badge variant={statusVariant(vehicle.status)} className="shrink-0 text-xs capitalize">
                  {vehicle.status === 'moving' ? `${vehicle.speed} mph` : vehicle.status}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FleetVehicleMap
