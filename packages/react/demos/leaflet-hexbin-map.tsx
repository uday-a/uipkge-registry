import * as React from 'react'
import Story from '../../components/story/Story'
import { LeafletMap, LeafletPolygon, LeafletTooltip } from '@/components/ui/leaflet-map'

// ─────────────────────────────────────────────────────────────────────────────
// Hexbin density map: regular pointy-top hexagons binned over CONUS, fill
// opacity scaled by density. `hexRing` builds a 6-vertex ring around a center
// at a fixed degree radius, correcting longitude for latitude stretch.
// ─────────────────────────────────────────────────────────────────────────────
function hexRing(center: [number, number], r = 1.85): [number, number][] {
  const [cx, cy] = center
  const ring: [number, number][] = []
  for (let i = 0; i <= 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 30)
    const lng = cx + (r * Math.cos(a)) / Math.cos((cy * Math.PI) / 180)
    ring.push([lng, cy + r * Math.sin(a)])
  }
  return ring
}

const HEXES: { name: string; center: [number, number]; density: number }[] = [
  { name: 'Washington', center: [-120.0, 47.0], density: 82 },
  { name: 'Oregon', center: [-120.5, 43.8], density: 58 },
  { name: 'California', center: [-119.5, 37.0], density: 96 },
  { name: 'Nevada', center: [-115.5, 39.3], density: 44 },
  { name: 'Arizona', center: [-111.7, 34.3], density: 61 },
  { name: 'Utah', center: [-111.5, 39.3], density: 67 },
  { name: 'Montana', center: [-110.0, 46.8], density: 22 },
  { name: 'Colorado', center: [-105.5, 39.0], density: 74 },
  { name: 'Texas Panhandle', center: [-101.8, 35.2], density: 63 },
  { name: 'Texas', center: [-99.0, 31.0], density: 88 },
  { name: 'North Dakota', center: [-100.5, 47.4], density: 18 },
  { name: 'Kansas', center: [-98.3, 38.5], density: 41 },
  { name: 'Minnesota', center: [-94.5, 46.2], density: 55 },
  { name: 'Missouri', center: [-92.4, 38.4], density: 57 },
  { name: 'Illinois', center: [-89.2, 40.0], density: 71 },
  { name: 'Georgia', center: [-83.4, 32.9], density: 66 },
  { name: 'Virginia', center: [-78.6, 37.8], density: 93 },
  { name: 'New York', center: [-75.5, 42.9], density: 85 },
]

const opacityFor = (d: number) => 0.12 + (d / 100) * 0.68

export default function LeafletHexbinMapDemo() {
  return (
    <Story
      title="CONUS Hexbin Density"
      description="LeafletPolygon hex bins over the dark Esri canvas — fillOpacity carries the density value so sparse cells fade into the basemap."
    >
      <LeafletMap
        variant="dark"
        center={[-96, 38]}
        zoom={3.8}
        minZoom={3}
        className="h-[420px] w-full rounded-lg border"
      >
        {HEXES.map((h) => (
          <LeafletPolygon
            key={h.name}
            lngLatPath={hexRing(h.center)}
            color="#7dd3fc"
            weight={1}
            opacity={0.7}
            fill
            fillColor="#38bdf8"
            fillOpacity={opacityFor(h.density)}
          >
            <LeafletTooltip direction="top" offset={[0, -6]}>
              <div className="font-mono text-xs">
                <div className="text-foreground font-bold">{h.name}</div>
                <div className="text-muted-foreground">density {h.density} / 100</div>
              </div>
            </LeafletTooltip>
          </LeafletPolygon>
        ))}
        <div className="border-border bg-card/95 absolute bottom-3 left-3 z-[1000] rounded-lg border px-3 py-2 shadow-sm backdrop-blur-sm">
          <p className="text-foreground text-xs font-semibold">Report density</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-sky-400/25" />
            <span className="size-2.5 rounded-sm bg-sky-400/45" />
            <span className="size-2.5 rounded-sm bg-sky-400/70" />
            <span className="size-2.5 rounded-sm bg-sky-400" />
            <span className="text-muted-foreground ml-1 font-mono text-[10px]">sparse → dense</span>
          </div>
        </div>
      </LeafletMap>
    </Story>
  )
}
