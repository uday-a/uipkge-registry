import Story from '../../components/story/Story'
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function mapMutedDemo() {
  return (
    <Story
      title="Muted Minimal"
      description="Desaturated grayscale canvas where roads and terrain recede, giving custom telemetry markers visual priority."
    >
      <Map
        accessToken={token}
        variant="muted"
        center={[13.405, 52.52]}
        zoom={12}
        className="h-96 w-full rounded-lg border"
      >
        <MapMarker lngLat={[13.405, 52.52]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              Berlin Hub
            </span>
          </div>
        </MapMarker>
      </Map>
    </Story>
  )
}
