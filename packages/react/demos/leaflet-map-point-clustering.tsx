import * as React from 'react'
import Story from '../../components/story/Story'
import { LeafletMap, LeafletMarker, type LeafletMapRef } from '@/components/ui/leaflet-map'

// ~60 deterministic telemetry points scattered around major US metros.
// leaflet.markercluster isn't installed, so the demo does simple client-side
// grid aggregation: bucket every point into a ~4° lng/lat cell, then render one
// LeafletMarker per occupied cell — a count badge for groups, a dot for singles.
const POINTS: [number, number][] = [
  // Northeast corridor
  [-74.0, 40.7],
  [-73.9, 40.8],
  [-74.1, 40.6],
  [-73.8, 40.7],
  [-74.05, 40.75],
  [-71.06, 42.36],
  [-71.1, 42.3],
  [-75.16, 39.95],
  [-77.04, 38.9],
  [-77.1, 38.85],
  // Southeast
  [-84.39, 33.75],
  [-84.3, 33.8],
  [-80.19, 25.76],
  [-81.38, 28.54],
  [-80.84, 35.23],
  [-86.78, 36.16],
  [-90.07, 29.95],
  [-86.8, 33.52],
  // Midwest
  [-87.63, 41.88],
  [-87.7, 41.9],
  [-87.55, 41.8],
  [-83.05, 42.33],
  [-93.27, 44.98],
  [-90.2, 38.63],
  [-94.58, 39.1],
  [-81.69, 41.5],
  [-83.0, 39.96],
  [-86.16, 39.77],
  [-85.76, 38.25],
  [-95.93, 41.26],
  [-96.79, 46.88],
  // Texas & Plains
  [-95.37, 29.76],
  [-95.3, 29.7],
  [-96.8, 32.78],
  [-96.7, 32.85],
  [-97.74, 30.27],
  [-98.49, 29.42],
  [-97.52, 35.47],
  [-95.99, 36.15],
  [-97.34, 37.69],
  [-106.65, 35.08],
  // Mountain West
  [-104.99, 39.74],
  [-104.9, 39.8],
  [-112.07, 33.45],
  [-115.14, 36.17],
  [-111.89, 40.76],
  [-116.2, 43.62],
  [-108.5, 45.78],
  // West Coast
  [-118.24, 34.05],
  [-118.3, 34.1],
  [-118.15, 34.0],
  [-117.16, 32.72],
  [-122.42, 37.77],
  [-122.3, 37.8],
  [-121.89, 37.34],
  [-121.49, 38.58],
  [-122.33, 47.61],
  [-122.4, 47.5],
  [-122.68, 45.52],
]

const GRID_DEG = 4

const clusters = (() => {
  const cells = new Map<string, { lng: number; lat: number; count: number }>()
  for (const [lng, lat] of POINTS) {
    const key = `${Math.floor(lng / GRID_DEG)}:${Math.floor(lat / GRID_DEG)}`
    const cell = cells.get(key) ?? { lng: 0, lat: 0, count: 0 }
    cell.lng += lng
    cell.lat += lat
    cell.count += 1
    cells.set(key, cell)
  }
  return [...cells.entries()].map(([key, c]) => ({
    key,
    count: c.count,
    lngLat: [c.lng / c.count, c.lat / c.count] as [number, number],
    // Badge diameter scales with density — a genuinely dynamic value → style.
    size: 28 + Math.min(c.count, 14) * 2.5,
  }))
})()

export default function LeafletMapPointClusteringDemo() {
  const mapRef = React.useRef<LeafletMapRef>(null)
  return (
    <Story
      title="Point Clustering"
      description="Client-side grid aggregation buckets 60 telemetry points into density badges — no markercluster plugin, no GL, no API key. Click a cluster to drill in."
    >
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="border-border bg-card text-foreground hover:bg-muted rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
            onClick={() => mapRef.current?.flyTo({ center: [-98.5795, 39.8283], zoom: 3.5, duration: 900 })}
          >
            Reset view
          </button>
          <span className="text-muted-foreground ml-2 font-mono text-xs">
            {POINTS.length} points · {clusters.length} cells
          </span>
        </div>
        <LeafletMap
          ref={mapRef}
          variant="dark"
          center={[-98.5795, 39.8283]}
          zoom={3.5}
          className="h-96 w-full rounded-lg border"
        >
          {clusters.map((c) => (
            <LeafletMarker
              key={c.key}
              lngLat={c.lngLat}
              anchor="center"
              onClick={() => {
                if (c.count > 1) mapRef.current?.flyTo({ center: c.lngLat, zoom: 5.5, duration: 900 })
              }}
            >
              {c.count > 1 ? (
                <div
                  className="bg-primary text-primary-foreground ring-primary/25 flex cursor-pointer items-center justify-center rounded-full font-mono text-xs font-bold shadow-md ring-4 transition-transform hover:scale-110"
                  style={{ width: c.size, height: c.size }}
                >
                  {c.count}
                </div>
              ) : (
                <span className="block size-2 rounded-full bg-sky-400 ring-4 ring-sky-400/25" />
              )}
            </LeafletMarker>
          ))}
        </LeafletMap>
      </div>
    </Story>
  )
}
