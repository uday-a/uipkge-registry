<script setup lang="ts">
import { LeafletMap, LeafletPolyline, LeafletCircleMarker, LeafletTooltip } from '@/components/ui/leaflet-map'

// ─────────────────────────────────────────────────────────────────────────────
// Route flow map: great-circle-ish arcs approximated by a quadratic Bezier in
// lng/lat space — the midpoint lifts poleward, mimicking flight corridors.
// ─────────────────────────────────────────────────────────────────────────────
const wrapLng = (x: number) => ((((x + 180) % 360) + 360) % 360) - 180

/** Curved path between two [lng, lat] points. `lift` scales the poleward bow. */
function arcPath(from: [number, number], to: [number, number], lift = 0.24, segments = 48): [number, number][] {
  const [x1, y1] = from
  const y2 = to[1]
  let x2 = to[0]
  // Take the short way across the antimeridian (e.g. SF -> Tokyo via -220°, not +140°).
  if (Math.abs(x2 - x1) > 180) x2 += x2 > x1 ? -360 : 360
  const dist = Math.hypot(x2 - x1, y2 - y1)
  const pole = (y1 + y2) / 2 >= 0 ? 1 : -1
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2 + pole * dist * lift
  const pts: [number, number][] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    pts.push([
      (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2,
      (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2,
    ])
  }
  return pts
}

/** Split an unwrapped path at ±180° into multi-part rings Leaflet can draw. */
function splitAtAntimeridian(pts: [number, number][]): [number, number][][] {
  const parts: [number, number][][] = []
  let part: [number, number][] = []
  let prev = pts[0]
  part.push([wrapLng(prev[0]), prev[1]])
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]
    const prevCell = Math.floor((prev[0] + 180) / 360)
    const pCell = Math.floor((p[0] + 180) / 360)
    if (prevCell === pCell) {
      part.push([wrapLng(p[0]), p[1]])
    } else {
      const dir = Math.sign(p[0] - prev[0])
      const boundary = pCell * 360 + 180 // unwrapped crossing longitude (±180)
      const t = (boundary - prev[0]) / (p[0] - prev[0])
      const y = prev[1] + t * (p[1] - prev[1])
      part.push([dir > 0 ? 180 : -180, y])
      parts.push(part)
      part = [
        [dir > 0 ? -180 : 180, y],
        [wrapLng(p[0]), p[1]],
      ]
    }
    prev = p
  }
  parts.push(part)
  return parts
}

const CITIES: Record<string, { name: string; lngLat: [number, number] }> = {
  NYC: { name: 'New York', lngLat: [-74.0, 40.7] },
  LON: { name: 'London', lngLat: [-0.12, 51.5] },
  SFO: { name: 'San Francisco', lngLat: [-122.4, 37.6] },
  TYO: { name: 'Tokyo', lngLat: [139.7, 35.7] },
  SIN: { name: 'Singapore', lngLat: [103.8, 1.4] },
  DXB: { name: 'Dubai', lngLat: [55.3, 25.2] },
  SYD: { name: 'Sydney', lngLat: [151.2, -33.9] },
  SAO: { name: 'São Paulo', lngLat: [-46.6, -23.6] },
}

const ROUTES = [
  { id: 'JFK-LHR', from: 'NYC', to: 'LON', label: 'New York → London', volume: '38 flights/day' },
  { id: 'SFO-HND', from: 'SFO', to: 'TYO', label: 'San Francisco → Tokyo', volume: '12 flights/day' },
  { id: 'LHR-SIN', from: 'LON', to: 'SIN', label: 'London → Singapore', volume: '16 flights/day' },
  { id: 'DXB-JFK', from: 'DXB', to: 'NYC', label: 'Dubai → New York', volume: '7 flights/day' },
  { id: 'SYD-SIN', from: 'SYD', to: 'SIN', label: 'Sydney → Singapore', volume: '11 flights/day' },
  { id: 'GRU-LHR', from: 'SAO', to: 'LON', label: 'São Paulo → London', volume: '9 flights/day' },
]

const arcs = ROUTES.map((r) => ({
  ...r,
  parts: splitAtAntimeridian(arcPath(CITIES[r.from].lngLat, CITIES[r.to].lngLat)),
}))

const hubs = Object.values(CITIES)
</script>

<template>
  <Story
    title="Intercontinental Flight Corridors"
    description="Cased Bezier arcs on the dark canvas — a wide low-opacity underlay plus a dashed top line reads as motion; circle markers pin the hubs."
  >
    <LeafletMap
      variant="dark"
      :center="[-30, 45]"
      :zoom="1.8"
      :min-zoom="1.2"
      class="h-[420px] w-full rounded-lg border"
    >
      <template v-for="r in arcs" :key="r.id">
        <LeafletPolyline :lng-lat-path="r.parts" color="#e2e8f0" :weight="5" :opacity="0.18" line-cap="round" />
        <LeafletPolyline
          :lng-lat-path="r.parts"
          color="#38bdf8"
          :weight="2"
          :opacity="0.95"
          dash-array="7 9"
          line-cap="round"
        >
          <LeafletTooltip :sticky="true">
            <div class="font-mono text-xs">
              <div class="text-foreground font-bold">{{ r.label }}</div>
              <div class="text-muted-foreground">{{ r.volume }}</div>
            </div>
          </LeafletTooltip>
        </LeafletPolyline>
      </template>
      <LeafletCircleMarker
        v-for="c in hubs"
        :key="c.name"
        :center="c.lngLat"
        :radius="4.5"
        color="#e2e8f0"
        :weight="1.5"
        :fill="true"
        fill-color="#38bdf8"
        :fill-opacity="0.95"
      >
        <LeafletTooltip direction="top" :offset="[0, -6]">
          <span class="font-mono text-xs font-bold">{{ c.name }}</span>
        </LeafletTooltip>
      </LeafletCircleMarker>
      <div
        class="border-border bg-card/95 absolute top-3 left-3 z-[1000] rounded-lg border px-3 py-2 shadow-sm backdrop-blur-sm"
      >
        <p class="text-foreground text-xs font-semibold">Active corridors</p>
        <p class="text-muted-foreground mt-0.5 font-mono text-[10px]">6 routes · 8 hubs · live schedule</p>
      </div>
    </LeafletMap>
  </Story>
</template>
