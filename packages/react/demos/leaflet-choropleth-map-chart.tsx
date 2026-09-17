import * as React from 'react'
import Story from '../../components/story/Story'
import { LeafletMap, LeafletGeoJson } from '@/components/ui/leaflet-map'

// ─────────────────────────────────────────────────────────────────────────────
// Choropleth on a real basemap: hand-drawn bounding-box polygons stand in for
// country outlines; a binned blue scale maps the metric to fill color.
// ─────────────────────────────────────────────────────────────────────────────
const SCALE = [
  { label: '< 60%', color: '#dbeafe', swatch: 'bg-blue-100' },
  { label: '60–75%', color: '#93c5fd', swatch: 'bg-blue-300' },
  { label: '75–85%', color: '#60a5fa', swatch: 'bg-blue-400' },
  { label: '85–92%', color: '#3b82f6', swatch: 'bg-blue-500' },
  { label: '≥ 92%', color: '#1d4ed8', swatch: 'bg-blue-700' },
]

function colorFor(value: number): string {
  if (value >= 92) return SCALE[4].color
  if (value >= 85) return SCALE[3].color
  if (value >= 75) return SCALE[2].color
  if (value >= 60) return SCALE[1].color
  return SCALE[0].color
}

// Rough [west, south, east, north] boxes — plausible shapes, not boundaries.
const REGIONS: { name: string; value: number; box: [number, number, number, number] }[] = [
  { name: 'United States', value: 92, box: [-125, 25, -66, 49] },
  { name: 'Brazil', value: 81, box: [-73, -33, -35, 5] },
  { name: 'European Union', value: 90, box: [-10, 37, 26, 58] },
  { name: 'Russia', value: 85, box: [30, 42, 170, 70] },
  { name: 'China', value: 74, box: [76, 19, 133, 53] },
  { name: 'India', value: 52, box: [68, 8, 96, 35] },
  { name: 'Australia', value: 91, box: [113, -43, 153, -11] },
  { name: 'South Africa', value: 72, box: [16, -34, 33, -22] },
  { name: 'Egypt', value: 71, box: [25, 22, 36, 32] },
  { name: 'Japan', value: 93, box: [129, 31, 145, 45] },
]

function boxRing([w, s, e, n]: [number, number, number, number]): [number, number][] {
  return [
    [w, s],
    [e, s],
    [e, n],
    [w, n],
    [w, s],
  ]
}

const regions: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: REGIONS.map((r) => ({
    type: 'Feature',
    properties: { name: r.name, value: r.value },
    geometry: { type: 'Polygon', coordinates: [boxRing(r.box)] },
  })),
}

const geoJsonOptions = {
  style: (f: any) => ({
    color: '#ffffff',
    weight: 1,
    fillColor: colorFor(f?.properties?.value ?? 0),
    fillOpacity: 0.72,
  }),
  onEachFeature: (f: any, layer: any) => {
    layer.bindTooltip(
      `<div class="font-mono text-xs"><span class="font-bold">${f.properties.name}</span> — ${f.properties.value}% penetration</div>`,
      { sticky: true },
    )
  },
}

export default function LeafletChoroplethMapChartDemo() {
  return (
    <Story
      title="World Choropleth"
      description="LeafletGeoJson fills simplified region polygons with a binned sequential scale; the muted basemap stays quiet so the data layer carries the color."
    >
      <LeafletMap
        variant="muted"
        center={[15, 25]}
        zoom={1.4}
        minZoom={1.2}
        className="h-[420px] w-full rounded-lg border"
      >
        <LeafletGeoJson geojson={regions} options={geoJsonOptions} />
        <div className="border-border bg-card/95 absolute bottom-3 left-3 z-[1000] rounded-lg border px-3 py-2 shadow-sm backdrop-blur-sm">
          <p className="text-foreground text-xs font-semibold">Internet penetration</p>
          <div className="mt-1.5 flex flex-col gap-1">
            {SCALE.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className={`size-2.5 rounded-sm ${s.swatch}`} />
                <span className="text-muted-foreground font-mono text-[10px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </LeafletMap>
    </Story>
  )
}
