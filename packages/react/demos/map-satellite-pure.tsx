import Story from '../../components/story/Story'
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function mapSatellitePureDemo() {
  return (
    <Story
      title="Satellite Pure"
      description="Photorealistic high-resolution orbital satellite photography without labels or boundaries."
    >
      <Map
        accessToken={token}
        variant="satellite"
        center={[-112.112, 36.106]}
        zoom={11.5}
        className="h-96 w-full rounded-lg border"
      >
        <MapMarker lngLat={[-112.112, 36.106]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              Grand Canyon South Rim
            </span>
          </div>
        </MapMarker>
      </Map>
    </Story>
  )
}
