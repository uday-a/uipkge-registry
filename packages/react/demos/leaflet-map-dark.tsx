import Story from '../../components/story/Story'
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'

export default function LeafletMapDarkDemo() {
  return (
    <Story
      title="Dark Canvas"
      description="Monochromatic dark palette on Esri Dark Gray Canvas, designed for mission-critical dashboards and high-contrast glowing overlays."
    >
      <LeafletMap variant="dark" center={[-74.006, 40.7128]} zoom={12} className="h-96 w-full rounded-lg border">
        <LeafletMarker lngLat={[-74.006, 40.7128]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              Manhattan Night Grid
            </span>
          </div>
        </LeafletMarker>
      </LeafletMap>
    </Story>
  )
}
