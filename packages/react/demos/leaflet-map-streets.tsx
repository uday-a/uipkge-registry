import Story from '../../components/story/Story'
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'

export default function LeafletMapStreetsDemo() {
  return (
    <Story
      title="Streets Basemap"
      description="Detailed urban street networks, transit stations, and local points of interest on free OpenStreetMap Standard tiles."
    >
      <LeafletMap variant="streets" center={[-73.985, 40.748]} zoom={13.5} className="h-96 w-full rounded-lg border">
        <LeafletMarker lngLat={[-73.985, 40.748]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              Empire State Building
            </span>
          </div>
        </LeafletMarker>
      </LeafletMap>
    </Story>
  )
}
