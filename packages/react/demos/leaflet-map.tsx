import * as React from 'react'
import Story from '../../components/story/Story'
import {
  LeafletMap,
  LeafletMarker,
  LeafletPopup,
  LeafletTooltip,
  LeafletPolyline,
  LeafletPolygon,
  LeafletCircle,
  LeafletCircleMarker,
  LeafletGeoJson,
  LeafletTileLayer,
  type LeafletMapRef,
  type LeafletMapVariant,
} from '@/components/ui/leaflet-map'

const variantOptions: { id: LeafletMapVariant; label: string; desc: string }[] = [
  { id: 'default', label: 'Default', desc: 'Theme-aware Esri light/dark' },
  { id: 'streets', label: 'Streets', desc: 'OpenStreetMap Standard tiles' },
  { id: 'light', label: 'Light', desc: 'Esri Light Gray — clean editorial canvas' },
  { id: 'dark', label: 'Dark', desc: 'Esri Dark Gray — dashboard canvas' },
  { id: 'muted', label: 'Muted', desc: 'Theme-aware + desaturated tile pane' },
  { id: 'outdoors', label: 'Outdoors', desc: 'OpenTopoMap contours & trails' },
  { id: 'satellite-streets', label: 'Satellite Hybrid', desc: 'Esri imagery + label overlay' },
  { id: 'satellite', label: 'Satellite', desc: 'Esri World Imagery, no labels' },
  { id: 'navigation-day', label: 'Nav Day', desc: 'Esri Street Map high contrast' },
  { id: 'navigation-night', label: 'Nav Night', desc: 'Esri dark canvas HUD' },
]

const landmarks = [
  {
    id: 'hq',
    name: 'Global Operations HQ',
    detail: '350 5th Ave, New York',
    status: 'Active · 1,420 staff',
    lngLat: [-73.985, 40.748] as [number, number],
  },
  {
    id: 'depot',
    name: 'East River Depot',
    detail: '12 W 34th St, New York',
    status: 'Active · 24 bays',
    lngLat: [-73.961, 40.763] as [number, number],
  },
]

const routePath: [number, number][] = [
  [-74.006, 40.7128],
  [-73.977, 40.7312],
  [-73.985, 40.7484],
  [-73.968, 40.7614],
  [-73.9776, 40.7736],
]
const routeWaypoints = [
  { name: 'Pickup · SoHo', lngLat: routePath[0] },
  { name: 'Drop-off · UWS', lngLat: routePath[routePath.length - 1] },
]

const zones: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Zone A — Midtown', quota: '92%' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.01, 40.735],
            [-73.975, 40.735],
            [-73.975, 40.765],
            [-74.01, 40.765],
            [-74.01, 40.735],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Zone B — FiDi', quota: '71%' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.02, 40.7],
            [-73.99, 40.7],
            [-73.99, 40.722],
            [-74.02, 40.722],
            [-74.02, 40.7],
          ],
        ],
      },
    },
  ],
}

function VariantsStory() {
  const [activeVariant, setActiveVariant] = React.useState<LeafletMapVariant>('default')
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {variantOptions.map((v) => (
          <button
            key={v.id}
            type="button"
            title={v.desc}
            className={
              activeVariant === v.id
                ? 'border-primary bg-primary/10 text-primary rounded-md border px-2.5 py-1 font-mono text-xs transition-colors'
                : 'border-border bg-card text-muted-foreground hover:text-foreground rounded-md border px-2.5 py-1 font-mono text-xs transition-colors'
            }
            onClick={() => setActiveVariant(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>
      <LeafletMap
        key={activeVariant}
        variant={activeVariant}
        center={[-73.985, 40.748]}
        zoom={12}
        className="h-96 w-full rounded-lg border"
      />
    </div>
  )
}

function GeoJsonStory() {
  const mapRef = React.useRef<LeafletMapRef>(null)
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        <button
          type="button"
          className="border-border bg-card text-foreground hover:bg-muted rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          onClick={() =>
            mapRef.current?.fitBounds([
              [-74.03, 40.69],
              [-73.95, 40.78],
            ])
          }
        >
          Fit zones
        </button>
        <button
          type="button"
          className="border-border bg-card text-foreground hover:bg-muted rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          onClick={() => mapRef.current?.flyTo({ center: [-73.99, 40.735], zoom: 13, duration: 700 })}
        >
          Reset view
        </button>
      </div>
      <LeafletMap
        ref={mapRef}
        variant="muted"
        center={[-73.99, 40.735]}
        zoom={13}
        className="h-96 w-full rounded-lg border"
      >
        <LeafletGeoJson
          geojson={zones}
          options={{
            style: (f: any) => ({
              color: '#2563eb',
              weight: 2,
              fillColor: '#3b82f6',
              fillOpacity: f?.properties?.quota === '92%' ? 0.3 : 0.15,
            }),
          }}
        />
      </LeafletMap>
    </div>
  )
}

function ControlsStory() {
  const mapRef = React.useRef<LeafletMapRef>(null)
  const [zoom, setZoom] = React.useState(12)
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="border-border bg-card text-foreground hover:bg-muted rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          onClick={() => mapRef.current?.zoomIn()}
        >
          Zoom in
        </button>
        <button
          type="button"
          className="border-border bg-card text-foreground hover:bg-muted rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          onClick={() => mapRef.current?.zoomOut()}
        >
          Zoom out
        </button>
        <span className="text-muted-foreground ml-2 font-mono text-xs">zoom {zoom}</span>
      </div>
      <LeafletMap
        ref={mapRef}
        variant="streets"
        center={[-0.1276, 51.5074]}
        zoom={12}
        fullscreen
        navigationPosition="top-right"
        fullscreenPosition="top-left"
        className="h-96 w-full rounded-lg border"
        onCreated={(m) => {
          m.on('zoomend', () => setZoom(Math.round(m.getZoom() * 10) / 10))
        }}
      />
    </div>
  )
}

export default function LeafletMapDemo() {
  return (
    <>
      <Story
        title="Default — theme-aware"
        description="Free Esri light/dark canvas tiles follow the app theme automatically. No API key, no token, no setup."
      >
        <LeafletMap center={[-73.985, 40.748]} zoom={12.5} className="h-96 w-full rounded-lg border" />
      </Story>

      <Story
        title="Basemap Variants"
        description="Every key-free tile preset: OpenStreetMap, Esri Gray Canvas/Street/Imagery, and OpenTopoMap."
      >
        <VariantsStory />
      </Story>

      <Story
        title="Markers & Popups"
        description="LeafletMarker renders real DOM into a div icon — buttons, badges, and React handlers all keep working."
      >
        <LeafletMap variant="light" center={[-73.975, 40.755]} zoom={13.5} className="h-96 w-full rounded-lg border">
          {landmarks.map((m) => (
            <LeafletMarker key={m.id} lngLat={m.lngLat} anchor="bottom">
              <div className="group flex cursor-pointer flex-col items-center">
                <span className="bg-primary ring-primary/25 size-3.5 rounded-full ring-4 transition-transform group-hover:scale-110" />
                <span className="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold shadow-xs">
                  {m.name}
                </span>
              </div>
              <LeafletPopup offset={[0, -38]} className="space-y-1 text-xs">
                <div className="text-foreground font-bold">{m.name}</div>
                <div className="text-muted-foreground">{m.detail}</div>
                <div className="font-mono text-xs font-medium text-emerald-500">{m.status}</div>
              </LeafletPopup>
            </LeafletMarker>
          ))}
        </LeafletMap>
      </Story>

      <Story
        title="Tooltips"
        description="LeafletTooltip binds to the nearest ancestor layer — or floats standalone at a coordinate."
      >
        <LeafletMap center={[-73.985, 40.748]} zoom={12.5} className="h-96 w-full rounded-lg border">
          <LeafletCircleMarker
            center={[-73.985, 40.748]}
            radius={10}
            color="#3b82f6"
            fill
            fillColor="#3b82f6"
            fillOpacity={0.9}
          >
            <LeafletTooltip direction="top" offset={[0, -12]}>
              <span className="font-mono text-xs font-bold">Empire State — 1,250 ft</span>
            </LeafletTooltip>
          </LeafletCircleMarker>
          <LeafletCircleMarker
            center={[-73.95, 40.73]}
            radius={10}
            color="#f59e0b"
            fill
            fillColor="#f59e0b"
            fillOpacity={0.9}
          >
            <LeafletTooltip direction="top" offset={[0, -12]}>
              <span className="font-mono text-xs font-bold">East Village Hub</span>
            </LeafletTooltip>
          </LeafletCircleMarker>
        </LeafletMap>
      </Story>

      <Story
        title="Route Layer"
        description="LeafletPolyline draws a cased route line; waypoint markers pin the endpoints."
      >
        <LeafletMap variant="streets" center={[-73.985, 40.745]} zoom={13} className="h-96 w-full rounded-lg border">
          <LeafletPolyline lngLatPath={routePath} color="#0f172a" weight={7} opacity={0.35} />
          <LeafletPolyline lngLatPath={routePath} color="#3b82f6" weight={4} opacity={1} dashArray="1 0" />
          {routeWaypoints.map((w) => (
            <LeafletMarker key={w.name} lngLat={w.lngLat} anchor="bottom">
              <div className="flex flex-col items-center">
                <span className="border-background size-3 rounded-full border-2 bg-blue-600 shadow" />
                <span className="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs">
                  {w.name}
                </span>
              </div>
            </LeafletMarker>
          ))}
        </LeafletMap>
      </Story>

      <Story
        title="GeoJSON Zones"
        description="LeafletGeoJson renders FeatureCollections; onEachFeature / style options map properties to paint."
      >
        <GeoJsonStory />
      </Story>

      <Story
        title="Circles & Radii"
        description="LeafletCircle is meter-accurate (coverage rings); LeafletCircleMarker is pixel-fixed (data points)."
      >
        <LeafletMap
          variant="outdoors"
          center={[-119.5383, 37.8651]}
          zoom={11}
          className="h-96 w-full rounded-lg border"
        >
          <LeafletCircle
            center={[-119.5383, 37.8651]}
            radius={9000}
            color="#f59e0b"
            weight={2}
            fill
            fillColor="#f59e0b"
            fillOpacity={0.12}
          />
          <LeafletCircle
            center={[-119.5383, 37.8651]}
            radius={4500}
            color="#f59e0b"
            weight={2}
            fill
            fillColor="#f59e0b"
            fillOpacity={0.2}
            dashArray="6 4"
          />
          <LeafletMarker lngLat={[-119.5383, 37.8651]} anchor="bottom">
            <div className="flex flex-col items-center">
              <span className="border-background size-3 rounded-full border-2 bg-amber-500 shadow" />
              <span className="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs">
                Yosemite Gate
              </span>
            </div>
          </LeafletMarker>
        </LeafletMap>
      </Story>

      <Story
        title="Controls & Fullscreen"
        description="navigation/fullscreen props place Leaflet zoom and an HTML5 fullscreen button on themed chrome."
      >
        <ControlsStory />
      </Story>

      <Story
        title="Custom Tile Layer"
        description="LeafletTileLayer stacks extra raster layers; tileUrl on LeafletMap swaps the basemap outright."
      >
        <LeafletMap variant="satellite" center={[-122.478, 37.819]} zoom={13} className="h-96 w-full rounded-lg border">
          <LeafletTileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            opacity={0.9}
          />
          <LeafletMarker lngLat={[-122.478, 37.819]} anchor="bottom">
            <div className="flex flex-col items-center">
              <span className="border-background size-3 rounded-full border-2 bg-white shadow" />
              <span className="mt-1 rounded border border-white/20 bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white shadow-xs">
                Golden Gate
              </span>
            </div>
          </LeafletMarker>
        </LeafletMap>
      </Story>

      <Story
        title="World View — Compact"
        description="size presets (sm/lg/xl/full) or your own className; min-zoom clamps keep the canvas sane."
      >
        <LeafletMap
          center={[15, 20]}
          zoom={1.4}
          minZoom={1.2}
          navigation={false}
          scrollWheelZoom={false}
          size="sm"
          className="rounded-lg border"
        />
      </Story>

      <Story
        title="Polygon Boundary"
        description="LeafletPolygon renders cadastral-style boundaries; dashed rings read as restricted airspace."
      >
        <LeafletMap variant="navigation-day" center={[4.4, 51.9]} zoom={11} className="h-96 w-full rounded-lg border">
          <LeafletPolygon
            lngLatPath={[
              [4.28, 51.82],
              [4.55, 51.82],
              [4.55, 51.98],
              [4.28, 51.98],
              [4.28, 51.82],
            ]}
            color="#e11d48"
            weight={2}
            dashArray="8 6"
            fill
            fillColor="#e11d48"
            fillOpacity={0.08}
          />
          <LeafletMarker lngLat={[4.4, 51.9]} anchor="center">
            <span className="border-border bg-card text-foreground rounded-md border px-2 py-1 font-mono text-[10px] font-bold shadow-xs">
              PORT OF ROTTERDAM
            </span>
          </LeafletMarker>
        </LeafletMap>
      </Story>
    </>
  )
}
