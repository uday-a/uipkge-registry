import Story from '../../components/story/Story'
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'

export default function LeafletMapNavigationDayDemo() {
  return (
    <Story
      title="Navigation Day"
      description="High-contrast Esri World Street Map palette designed for turn-by-turn routing and daytime fleet navigation."
    >
      <LeafletMap
        variant="navigation-day"
        center={[-122.401, 37.787]}
        zoom={14.5}
        className="h-96 w-full rounded-lg border"
      >
        <LeafletMarker lngLat={[-122.401, 37.787]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              Ferry Building Terminal
            </span>
          </div>
        </LeafletMarker>
      </LeafletMap>
    </Story>
  )
}
