import Story from '../../components/story/Story'
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function mapLightDemo() {
  return (
    <Story
      title="Light Canvas"
      description="Clean editorial light palette for SaaS reporting, print-ready graphics, and billing portals."
    >
      <Map
        accessToken={token}
        variant="light"
        center={[2.3522, 48.8566]}
        zoom={12.5}
        className="h-96 w-full rounded-lg border"
      >
        <MapMarker lngLat={[2.3522, 48.8566]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              Paris Central District
            </span>
          </div>
        </MapMarker>
      </Map>
    </Story>
  )
}
