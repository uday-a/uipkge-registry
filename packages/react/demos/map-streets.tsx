import Story from '../../components/story/Story'
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function MapStreetsDemo() {
  return (
    <Story
      title="Streets Basemap"
      description="Detailed urban street networks, transit stations, and local points of interest."
    >
      <Map
        accessToken={token}
        variant="streets"
        center={[-73.985, 40.748]}
        zoom={13.5}
        className="h-96 w-full rounded-lg border"
      >
        <MapMarker lngLat={[-73.985, 40.748]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              Empire State Building
            </span>
          </div>
        </MapMarker>
      </Map>
    </Story>
  )
}
