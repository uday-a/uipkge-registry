import Story from '../../components/story/Story'
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function MapTurnByTurnHudDemo() {
  return (
    <Story
      title="Turn-by-Turn HUD"
      description="In-dash vehicle routing display with real-time speed telemetry and heading indicator."
    >
      <Map
        accessToken={token}
        variant="navigation-night"
        center={[-122.403, 37.782]}
        zoom={14.5}
        pitch={45}
        className="h-96 w-full rounded-lg border"
      >
        <MapMarker lngLat={[-122.403, 37.782]} anchor="center">
          <div className="flex flex-col items-center">
            <div className="flex size-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-md ring-2 ring-white">
              ▲
            </div>
            <span className="border-border/80 bg-card/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold text-sky-400 shadow-md">
              42 MPH • Heading N
            </span>
          </div>
        </MapMarker>
      </Map>
    </Story>
  )
}
