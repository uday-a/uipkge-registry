import Story from '../../components/story/Story'
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function mapOutdoorsDemo() {
  return (
    <Story
      title="Outdoors & Topo"
      description="Topographic contour lines, mountain relief, and hiking trail networks across Yosemite National Park."
    >
      <Map
        accessToken={token}
        variant="outdoors"
        center={[-119.538, 37.745]}
        zoom={12.5}
        pitch={40}
        terrain3d={true}
        className="h-96 w-full rounded-lg border"
      >
        <MapMarker lngLat={[-119.538, 37.745]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              Half Dome (8,839 ft)
            </span>
          </div>
        </MapMarker>
      </Map>
    </Story>
  )
}
