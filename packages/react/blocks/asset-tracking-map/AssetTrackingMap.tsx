import { useState, useRef } from 'react'
import { Map, MapMarker, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface ContainerAsset {
  id: string
  containerNo: string
  type: 'Reefer' | 'Dry Cargo' | 'Hazardous'
  location: string
  coords: [number, number]
  temp?: string
  humidity?: string
  battery: string
  geofence: 'Inside Zone' | 'In Transit' | 'Exited Perimeter'
  status: 'Nominal' | 'Alert' | 'Secured'
}

export interface AssetTrackingMapProps {
  accessToken?: string
}

export function AssetTrackingMap({ accessToken }: AssetTrackingMapProps) {
  const mapRef = useRef<MapRef | null>(null)

  const assets: ContainerAsset[] = [
    {
      id: 'c-1',
      containerNo: 'MSKU-948102',
      type: 'Reefer',
      location: 'Port of Long Beach, Pier G',
      coords: [-118.216, 33.754],
      temp: '-18.4°C',
      humidity: '84%',
      battery: '92%',
      geofence: 'Inside Zone',
      status: 'Nominal',
    },
    {
      id: 'c-2',
      containerNo: 'CMAU-310892',
      type: 'Dry Cargo',
      location: 'Barstow Rail Yard, Track 4',
      coords: [-117.022, 34.898],
      battery: '78%',
      geofence: 'In Transit',
      status: 'Nominal',
    },
    {
      id: 'c-3',
      containerNo: 'HLXU-772901',
      type: 'Reefer',
      location: 'Inland Empire Logistics Depot',
      coords: [-117.585, 34.062],
      temp: '+4.2°C',
      humidity: '62%',
      battery: '64%',
      geofence: 'Inside Zone',
      status: 'Alert',
    },
    {
      id: 'c-4',
      containerNo: 'OOLU-550183',
      type: 'Hazardous',
      location: 'Pacific Intermodal Terminal',
      coords: [-118.243, 33.974],
      battery: '95%',
      geofence: 'Inside Zone',
      status: 'Secured',
    },
  ]

  const [activeAsset, setActiveAsset] = useState<ContainerAsset>(assets[0])

  const selectAsset = (a: ContainerAsset) => {
    setActiveAsset(a)
    mapRef.current?.flyTo({ center: a.coords, zoom: 11.5 })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
        <Map
          ref={mapRef}
          accessToken={accessToken}
          variant="light"
          center={activeAsset.coords}
          zoom={9.2}
          className="h-full w-full"
        >
          {assets.map((a) => (
            <MapMarker key={a.id} lngLat={a.coords} anchor="bottom" onClick={() => selectAsset(a)}>
              <div className="group relative flex cursor-pointer flex-col items-center">
                <div
                  className={`flex size-7 items-center justify-center rounded-md font-mono text-xs font-bold shadow-md ring-2 transition-transform group-hover:scale-110 ${
                    a.status === 'Alert'
                      ? 'bg-amber-500 text-white ring-amber-400'
                      : 'bg-primary text-primary-foreground ring-primary/25'
                  }`}
                >
                  📦
                </div>
                <span className="border-border bg-background/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-bold shadow-xs">
                  {a.containerNo.split('-')[1]}
                </span>
              </div>
            </MapMarker>
          ))}
        </Map>
      </div>

      {/* Asset Telemetry & Sensor Card */}
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {activeAsset.type}
            </Badge>
            <Badge
              className={
                activeAsset.status === 'Alert'
                  ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }
            >
              {activeAsset.status}
            </Badge>
          </div>
          <CardTitle className="mt-2 font-mono text-lg">{activeAsset.containerNo}</CardTitle>
          <CardDescription className="text-xs">{activeAsset.location}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border bg-muted/40 grid grid-cols-2 gap-2 rounded-lg border p-2.5 font-mono text-xs">
            {activeAsset.temp && (
              <div>
                <div className="text-muted-foreground text-[10px] uppercase">Cold Chain Temp</div>
                <div
                  className={`text-sm font-bold ${
                    activeAsset.status === 'Alert' ? 'text-amber-500' : 'text-foreground'
                  }`}
                >
                  {activeAsset.temp}
                </div>
              </div>
            )}
            {activeAsset.humidity && (
              <div>
                <div className="text-muted-foreground text-[10px] uppercase">Humidity</div>
                <div className="text-foreground text-sm font-bold">{activeAsset.humidity}</div>
              </div>
            )}
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">IoT Battery</div>
              <div className="text-foreground text-sm font-bold">{activeAsset.battery}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">Geofence</div>
              <div className="text-foreground text-sm font-bold">{activeAsset.geofence}</div>
            </div>
          </div>

          <div className="border-border space-y-1 border-t pt-3">
            <div className="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
              Tracked Cargo Units
            </div>
            {assets.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors ${
                  activeAsset.id === a.id
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
                onClick={() => selectAsset(a)}
              >
                <span className="font-mono">{a.containerNo}</span>
                <span
                  className={`font-mono text-[10px] ${
                    a.status === 'Alert' ? 'font-bold text-amber-500' : 'opacity-70'
                  }`}
                >
                  {a.type}
                </span>
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full font-mono text-xs"
            onClick={() => selectAsset(activeAsset)}
          >
            Center on Container
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
