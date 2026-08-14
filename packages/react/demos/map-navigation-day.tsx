import Story from '../../components/story/Story'
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function mapNavigationDayDemo() {
  return (
    <Story
      title="Navigation Day"
      description="High-contrast automotive day palette designed for turn-by-turn routing and in-vehicle navigation."
    >
      <Map
        accessToken={token}
        variant="navigation-day"
        center={[-0.1276, 51.5074]}
        zoom={13.5}
        className="h-96 w-full rounded-lg border"
      >
        <MapMarker lngLat={[-0.1276, 51.5074]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              London Fleet Depot
            </span>
          </div>
        </MapMarker>
      </Map>
    </Story>
  )
}
