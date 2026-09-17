import Story from '../../components/story/Story'
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'

export default function LeafletMapMutedDemo() {
  return (
    <Story
      title="Muted Minimal"
      description="Desaturated theme-aware canvas where roads and terrain recede, giving custom telemetry markers visual priority."
    >
      <LeafletMap variant="muted" center={[139.6917, 35.6895]} zoom={12} className="h-96 w-full rounded-lg border">
        <LeafletMarker lngLat={[139.6917, 35.6895]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
            <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
              Shinjuku Hub
            </span>
          </div>
        </LeafletMarker>
      </LeafletMap>
    </Story>
  )
}
