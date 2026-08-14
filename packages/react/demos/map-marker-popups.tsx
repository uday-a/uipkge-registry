import { useState } from 'react'
import Story from '../../components/story/Story'
import { Map, MapMarker, MapPopup } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function MapMarkerPopupsDemo() {
  const [activeMarker, setActiveMarker] = useState<string | null>('hq')

  return (
    <Story
      title="Marker Popups"
      description="Interactive marker pins with customizable popup dialogs and reactive selection."
    >
      <Map
        accessToken={token}
        variant="light"
        center={[-73.985, 40.748]}
        zoom={13.5}
        className="h-96 w-full rounded-lg border"
      >
        <MapMarker lngLat={[-73.985, 40.748]} anchor="bottom" onClick={() => setActiveMarker('hq')}>
          <div className="group flex cursor-pointer flex-col items-center">
            <span className="bg-primary ring-primary/25 size-3.5 rounded-full ring-4 transition-transform group-hover:scale-110" />
            <span className="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold shadow-xs">
              Headquarters
            </span>
          </div>
        </MapMarker>
        {activeMarker === 'hq' && (
          <MapPopup
            lngLat={[-73.985, 40.748]}
            offset={[0, -32]}
            className="border-border bg-popover space-y-1 rounded-lg border p-3 text-xs shadow-md"
            onClose={() => setActiveMarker(null)}
          >
            <div className="text-foreground font-bold">Global Operations HQ</div>
            <div className="text-muted-foreground">350 5th Ave, New York, NY 10118</div>
            <div className="font-mono text-xs font-medium text-emerald-500">Status: Active • 1,420 Staff</div>
          </MapPopup>
        )}
      </Map>
    </Story>
  )
}
