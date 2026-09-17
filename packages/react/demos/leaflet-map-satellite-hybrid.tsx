import Story from '../../components/story/Story'
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'

export default function LeafletMapSatelliteHybridDemo() {
  return (
    <Story
      title="Satellite Hybrid"
      description="High-resolution Esri aerial imagery layered with reference boundaries and place-name labels."
    >
      <LeafletMap
        variant="satellite-streets"
        center={[-122.478, 37.819]}
        zoom={13}
        className="h-96 w-full rounded-lg border"
      >
        <LeafletMarker lngLat={[-122.478, 37.819]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              Golden Gate Strait
            </span>
          </div>
        </LeafletMarker>
      </LeafletMap>
    </Story>
  )
}
