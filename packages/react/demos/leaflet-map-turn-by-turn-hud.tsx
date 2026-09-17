import Story from '../../components/story/Story'
import { LeafletMap, LeafletMarker, LeafletPolyline } from '@/components/ui/leaflet-map'

// Midtown Manhattan route — Canal St up to Columbus Circle. The vehicle sits
// mid-route at Herald Square; the path splits into completed/remaining legs.
const routePath: [number, number][] = [
  [-73.9998, 40.7208],
  [-73.9975, 40.725],
  [-73.994, 40.731],
  [-73.9915, 40.7365],
  [-73.9885, 40.741],
  [-73.9855, 40.748],
  [-73.983, 40.754],
  [-73.981, 40.761],
  [-73.9798, 40.768],
]
const VEHICLE_INDEX = 5
const vehiclePos = routePath[VEHICLE_INDEX]
const completedPath = routePath.slice(0, VEHICLE_INDEX + 1)
const remainingPath = routePath.slice(VEHICLE_INDEX)

export default function LeafletMapTurnByTurnHudDemo() {
  return (
    <Story
      title="Turn-by-Turn HUD"
      description="In-dash vehicle routing display with a cased route line, next-turn card, and speed telemetry — no GL pitch required."
    >
      <LeafletMap
        variant="navigation-night"
        center={[-73.985, 40.748]}
        zoom={14.5}
        className="h-96 w-full rounded-lg border"
      >
        {/* HUD overlay — absolute inside the relative map shell, above Leaflet panes. */}
        <div className="border-border bg-card/90 absolute top-3 left-3 z-[1000] w-60 overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 p-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <svg
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 14 5-5-5-5" />
                <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-foreground font-mono text-lg leading-tight font-bold">850 ft</div>
              <div className="text-muted-foreground truncate text-xs">Turn right onto W 34th St</div>
            </div>
          </div>
          <div className="border-border flex items-center justify-between border-t px-3 py-2 font-mono text-[11px]">
            <span className="text-muted-foreground">
              ETA <span className="text-foreground font-bold">4:32 PM</span>
            </span>
            <span className="text-muted-foreground">6 min · 2.1 mi</span>
            <span className="font-bold text-emerald-400">28 MPH</span>
          </div>
        </div>

        {/* Route: low-opacity casing, completed leg muted, remaining leg bright. */}
        <LeafletPolyline
          lngLatPath={routePath}
          color="#0ea5e9"
          weight={9}
          opacity={0.25}
          lineCap="round"
          lineJoin="round"
        />
        <LeafletPolyline lngLatPath={completedPath} color="#52525b" weight={5} opacity={0.9} lineCap="round" />
        <LeafletPolyline lngLatPath={remainingPath} color="#38bdf8" weight={5} opacity={1} lineCap="round" />

        {/* Origin */}
        <LeafletMarker lngLat={routePath[0]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="border-background size-3 rounded-full border-2 bg-emerald-500 shadow" />
            <span className="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold whitespace-nowrap shadow-xs">
              Origin · Canal St
            </span>
          </div>
        </LeafletMarker>

        {/* Vehicle */}
        <LeafletMarker lngLat={vehiclePos} anchor="center">
          <div className="flex flex-col items-center">
            <div className="flex size-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-md ring-2 ring-white">
              ▲
            </div>
            <span className="border-border/80 bg-card/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold whitespace-nowrap text-sky-400 shadow-md">
              28 MPH • Heading N
            </span>
          </div>
        </LeafletMarker>

        {/* Destination */}
        <LeafletMarker lngLat={routePath[routePath.length - 1]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="border-background size-3 rounded-full border-2 bg-rose-500 shadow" />
            <span className="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold whitespace-nowrap shadow-xs">
              Columbus Circle
            </span>
          </div>
        </LeafletMarker>
      </LeafletMap>
    </Story>
  )
}
