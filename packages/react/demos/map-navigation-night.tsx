import Story from '../../components/story/Story'
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function mapNavigationNightDemo() {
  return (
    <Story
      title="Navigation Night"
      description="Low-glare high-contrast dark automotive night HUD palette for distraction-free night driving."
    >
      <Map
        accessToken={token}
        variant="navigation-night"
        center={[-122.403, 37.782]}
        zoom={14}
        className="h-96 w-full rounded-lg border"
      >
        <MapMarker lngLat={[-122.403, 37.782]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              Mission St Corridor
            </span>
          </div>
        </MapMarker>
      </Map>
    </Story>
  )
}
