import Story from '../../components/story/Story'
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function Map3DTerrainDemo() {
  return (
    <Story
      title="3D Terrain & DEM"
      description="Digital elevation model (DEM) terrain relief with mountain shadowing and pitch controls."
    >
      <Map
        accessToken={token}
        variant="outdoors"
        center={[-119.538, 37.745]}
        zoom={12.8}
        pitch={50}
        bearing={25}
        terrain3d={true}
        className="h-96 w-full rounded-lg border"
      >
        <MapMarker lngLat={[-119.538, 37.745]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="size-3 rounded-full bg-emerald-600 ring-4 ring-emerald-600/30" />
            <span className="border-border bg-background/95 mt-1 rounded border px-2 py-0.5 font-mono text-xs font-bold shadow-md">
              Half Dome (8,839 ft)
            </span>
          </div>
        </MapMarker>
      </Map>
    </Story>
  )
}
