import Story from '../../components/story/Story'
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function Map3DBuildingsDemo() {
  return (
    <Story
      title="3D Extruded Buildings"
      description="Real-time 3D building footprint extrusion with 60° camera pitch and ambient roof shading."
    >
      <Map
        accessToken={token}
        variant="dark"
        center={[-73.985, 40.748]}
        zoom={15.8}
        pitch={60}
        bearing={-17}
        buildings3d={true}
        className="h-96 w-full rounded-lg border"
      >
        <MapMarker lngLat={[-73.985, 40.748]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="size-3 animate-ping rounded-full bg-sky-400" />
            <span className="border-border bg-background/95 mt-1 rounded border px-2 py-0.5 font-mono text-xs font-bold text-sky-500 shadow-md">
              Midtown Tower
            </span>
          </div>
        </MapMarker>
      </Map>
    </Story>
  )
}
