import Story from '../../components/story/Story'
import { LeafletMap, LeafletMarker, LeafletPolygon, LeafletPolyline } from '@/components/ui/leaflet-map'

// Active leg — cased: a wide low-opacity glow under a thinner bright line.
const routePath: [number, number][] = [
  [-74.013, 40.705],
  [-74.005, 40.718],
  [-73.992, 40.733],
  [-73.985, 40.748],
  [-73.976, 40.761],
  [-73.972, 40.774],
]

// Planned extension — dashed to read as not-yet-active.
const extensionPath: [number, number][] = [
  [-73.972, 40.774],
  [-73.962, 40.79],
  [-73.955, 40.802],
]

// Dashed service zone around Midtown.
const serviceZone: [number, number][] = [
  [-74.0, 40.738],
  [-73.965, 40.738],
  [-73.965, 40.768],
  [-74.0, 40.768],
  [-74.0, 40.738],
]

const waypoints = [
  { name: 'Pickup · Battery Park', color: 'bg-emerald-500', lngLat: routePath[0] },
  { name: 'Stop · Midtown', color: 'bg-sky-400', lngLat: routePath[3] },
  { name: 'Drop-off · Central Park', color: 'bg-rose-500', lngLat: routePath[routePath.length - 1] },
]

export default function LeafletMapRouteLayerDemo() {
  return (
    <Story
      title="Route Layer"
      description="Stacked LeafletPolylines build a cased route — a thick low-opacity line under a thinner bright one — plus dash-array extensions and a dashed service zone."
    >
      <LeafletMap variant="dark" center={[-73.985, 40.748]} zoom={12.5} className="h-96 w-full rounded-lg border">
        <LeafletPolygon
          lngLatPath={serviceZone}
          color="#38bdf8"
          weight={1.5}
          opacity={0.7}
          dashArray="8 6"
          fill
          fillColor="#38bdf8"
          fillOpacity={0.08}
        />
        {/* Casing glow */}
        <LeafletPolyline lngLatPath={routePath} color="#e2e8f0" weight={9} opacity={0.25} lineCap="round" />
        {/* Bright route core */}
        <LeafletPolyline lngLatPath={routePath} color="#38bdf8" weight={4} opacity={1} lineCap="round" />
        {/* Dashed planned extension */}
        <LeafletPolyline
          lngLatPath={extensionPath}
          color="#f59e0b"
          weight={3}
          opacity={0.9}
          dashArray="2 8"
          lineCap="round"
        />
        {waypoints.map((w) => (
          <LeafletMarker key={w.name} lngLat={w.lngLat} anchor="bottom">
            <div className="flex flex-col items-center">
              <span className={`border-background size-3 rounded-full border-2 shadow ${w.color}`} />
              <span className="border-border bg-card/95 text-foreground mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs">
                {w.name}
              </span>
            </div>
          </LeafletMarker>
        ))}
      </LeafletMap>
    </Story>
  )
}
