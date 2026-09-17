<script setup lang="ts">
import { ref } from "vue";
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
} from "@/components/ui/leaflet-map";

// ─────────────────────────────────────────────────────────────────────────────
// 1. VARIANT SWITCHER — every key-free basemap preset
// ─────────────────────────────────────────────────────────────────────────────
const activeVariant = ref<LeafletMapVariant>("default");
const variantOptions: { id: LeafletMapVariant; label: string; desc: string }[] =
  [
    { id: "default", label: "Default", desc: "Theme-aware Esri light/dark" },
    { id: "streets", label: "Streets", desc: "OpenStreetMap Standard tiles" },
    {
      id: "light",
      label: "Light",
      desc: "Esri Light Gray — clean editorial canvas",
    },
    { id: "dark", label: "Dark", desc: "Esri Dark Gray — dashboard canvas" },
    {
      id: "muted",
      label: "Muted",
      desc: "Theme-aware + desaturated tile pane",
    },
    {
      id: "outdoors",
      label: "Outdoors",
      desc: "OpenTopoMap contours & trails",
    },
    {
      id: "satellite-streets",
      label: "Satellite Hybrid",
      desc: "Esri imagery + label overlay",
    },
    {
      id: "satellite",
      label: "Satellite",
      desc: "Esri World Imagery, no labels",
    },
    {
      id: "navigation-day",
      label: "Nav Day",
      desc: "Esri Street Map high contrast",
    },
    {
      id: "navigation-night",
      label: "Nav Night",
      desc: "Esri dark canvas HUD",
    },
  ];

// ─────────────────────────────────────────────────────────────────────────────
// 2. MARKERS & POPUPS
// ─────────────────────────────────────────────────────────────────────────────
const landmarks = [
  {
    id: "hq",
    name: "Global Operations HQ",
    detail: "350 5th Ave, New York",
    status: "Active · 1,420 staff",
    lngLat: [-73.985, 40.748] as [number, number],
  },
  {
    id: "depot",
    name: "East River Depot",
    detail: "12 W 34th St, New York",
    status: "Active · 24 bays",
    lngLat: [-73.961, 40.763] as [number, number],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROUTE LAYER — polyline with casing + waypoints
// ─────────────────────────────────────────────────────────────────────────────
const routePath: [number, number][] = [
  [-74.006, 40.7128],
  [-73.977, 40.7312],
  [-73.985, 40.7484],
  [-73.968, 40.7614],
  [-73.9776, 40.7736],
];
const routeWaypoints = [
  { name: "Pickup · SoHo", lngLat: routePath[0] },
  { name: "Drop-off · UWS", lngLat: routePath[routePath.length - 1] },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. GEOJSON — service areas + camera helpers
// ─────────────────────────────────────────────────────────────────────────────
const zones: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Zone A — Midtown", quota: "92%" },
      geometry: {
        type: "Polygon",
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
      type: "Feature",
      properties: { name: "Zone B — FiDi", quota: "71%" },
      geometry: {
        type: "Polygon",
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
};

const geoMap = ref<LeafletMapRef | null>(null);
function fitZones() {
  geoMap.value?.fitBounds([
    [-74.03, 40.69],
    [-73.95, 40.78],
  ]);
}
function resetZones() {
  geoMap.value?.flyTo({ center: [-73.99, 40.735], zoom: 13, duration: 700 });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CONTROLS STORY STATE
// ─────────────────────────────────────────────────────────────────────────────
const controlsMap = ref<LeafletMapRef | null>(null);
const controlsZoom = ref(12);
function onControlsCreated(m: any) {
  m.on("zoomend", () => {
    controlsZoom.value = Math.round(m.getZoom() * 10) / 10;
  });
}
</script>

<template>
  <!-- 1 ─────────────────────────────────────────────────────────────────── -->
  <Story
    title="Default — theme-aware"
    description="Free Esri light/dark canvas tiles follow the app theme automatically. No API key, no token, no setup."
  >
    <LeafletMap
      :center="[-73.985, 40.748]"
      :zoom="12.5"
      class="h-96 w-full rounded-lg border"
    />
  </Story>

  <!-- 2 ─────────────────────────────────────────────────────────────────── -->
  <Story
    title="Basemap Variants"
    description="Every key-free tile preset: OpenStreetMap, Esri Gray Canvas/Street/Imagery, and OpenTopoMap."
  >
    <div class="space-y-3">
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="v in variantOptions"
          :key="v.id"
          type="button"
          :title="v.desc"
          class="rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          :class="
            activeVariant === v.id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card text-muted-foreground hover:text-foreground'
          "
          @click="activeVariant = v.id"
        >
          {{ v.label }}
        </button>
      </div>
      <LeafletMap
        :key="activeVariant"
        :variant="activeVariant"
        :center="[-73.985, 40.748]"
        :zoom="12"
        class="h-96 w-full rounded-lg border"
      />
    </div>
  </Story>

  <!-- 3 ─────────────────────────────────────────────────────────────────── -->
  <Story
    title="Markers & Popups"
    description="LeafletMarker renders real DOM into a div icon — buttons, badges, and Vue handlers all keep working."
  >
    <LeafletMap
      variant="light"
      :center="[-73.975, 40.755]"
      :zoom="13.5"
      class="h-96 w-full rounded-lg border"
    >
      <LeafletMarker
        v-for="m in landmarks"
        :key="m.id"
        :lng-lat="m.lngLat"
        anchor="bottom"
      >
        <div class="group flex cursor-pointer flex-col items-center">
          <span
            class="bg-primary ring-primary/25 size-3.5 rounded-full ring-4 transition-transform group-hover:scale-110"
          />
          <span
            class="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold shadow-xs"
          >
            {{ m.name }}
          </span>
        </div>
        <!-- Nested popups bind to the marker and open on click. -->
        <LeafletPopup :offset="[0, -38]" class="space-y-1 text-xs">
          <div class="text-foreground font-bold">{{ m.name }}</div>
          <div class="text-muted-foreground">{{ m.detail }}</div>
          <div class="font-mono text-xs font-medium text-emerald-500">
            {{ m.status }}
          </div>
        </LeafletPopup>
      </LeafletMarker>
    </LeafletMap>
  </Story>

  <!-- 4 ─────────────────────────────────────────────────────────────────── -->
  <Story
    title="Tooltips"
    description="LeafletTooltip binds to the nearest ancestor layer — or floats standalone at a coordinate."
  >
    <LeafletMap
      :center="[-73.985, 40.748]"
      :zoom="12.5"
      class="h-96 w-full rounded-lg border"
    >
      <LeafletCircleMarker
        :center="[-73.985, 40.748]"
        :radius="10"
        color="#3b82f6"
        :fill="true"
        fill-color="#3b82f6"
        :fill-opacity="0.9"
      >
        <LeafletTooltip direction="top" :offset="[0, -12]">
          <span class="font-mono text-xs font-bold"
            >Empire State — 1,250 ft</span
          >
        </LeafletTooltip>
      </LeafletCircleMarker>
      <LeafletCircleMarker
        :center="[-73.95, 40.73]"
        :radius="10"
        color="#f59e0b"
        :fill="true"
        fill-color="#f59e0b"
        :fill-opacity="0.9"
      >
        <LeafletTooltip direction="top" :offset="[0, -12]">
          <span class="font-mono text-xs font-bold">East Village Hub</span>
        </LeafletTooltip>
      </LeafletCircleMarker>
    </LeafletMap>
  </Story>

  <!-- 5 ─────────────────────────────────────────────────────────────────── -->
  <Story
    title="Route Layer"
    description="LeafletPolyline draws a cased route line; waypoint markers pin the endpoints."
  >
    <LeafletMap
      variant="streets"
      :center="[-73.985, 40.745]"
      :zoom="13"
      class="h-96 w-full rounded-lg border"
    >
      <LeafletPolyline
        :lng-lat-path="routePath"
        color="#0f172a"
        :weight="7"
        :opacity="0.35"
      />
      <LeafletPolyline
        :lng-lat-path="routePath"
        color="#3b82f6"
        :weight="4"
        :opacity="1"
        dash-array="1 0"
      />
      <LeafletMarker
        v-for="w in routeWaypoints"
        :key="w.name"
        :lng-lat="w.lngLat"
        anchor="bottom"
      >
        <div class="flex flex-col items-center">
          <span
            class="border-background size-3 rounded-full border-2 bg-blue-600 shadow"
          />
          <span
            class="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs"
          >
            {{ w.name }}
          </span>
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>

  <!-- 6 ─────────────────────────────────────────────────────────────────── -->
  <Story
    title="GeoJSON Zones"
    description="LeafletGeoJson renders FeatureCollections; onEachFeature / style options map properties to paint."
  >
    <div class="space-y-3">
      <div class="flex gap-1.5">
        <button
          type="button"
          class="border-border bg-card text-foreground hover:bg-muted rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          @click="fitZones"
        >
          Fit zones
        </button>
        <button
          type="button"
          class="border-border bg-card text-foreground hover:bg-muted rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          @click="resetZones"
        >
          Reset view
        </button>
      </div>
      <LeafletMap
        ref="geoMap"
        variant="muted"
        :center="[-73.99, 40.735]"
        :zoom="13"
        class="h-96 w-full rounded-lg border"
      >
        <LeafletGeoJson
          :geojson="zones"
          :options="{
            style: (f: any) => ({
              color: '#2563eb',
              weight: 2,
              fillColor: '#3b82f6',
              fillOpacity: f?.properties?.quota === '92%' ? 0.3 : 0.15,
            }),
          }"
        />
      </LeafletMap>
    </div>
  </Story>

  <!-- 7 ─────────────────────────────────────────────────────────────────── -->
  <Story
    title="Circles & Radii"
    description="LeafletCircle is meter-accurate (coverage rings); LeafletCircleMarker is pixel-fixed (data points)."
  >
    <LeafletMap
      variant="outdoors"
      :center="[-119.5383, 37.8651]"
      :zoom="11"
      class="h-96 w-full rounded-lg border"
    >
      <LeafletCircle
        :center="[-119.5383, 37.8651]"
        :radius="9000"
        color="#f59e0b"
        :weight="2"
        :fill="true"
        fill-color="#f59e0b"
        :fill-opacity="0.12"
      />
      <LeafletCircle
        :center="[-119.5383, 37.8651]"
        :radius="4500"
        color="#f59e0b"
        :weight="2"
        :fill="true"
        fill-color="#f59e0b"
        :fill-opacity="0.2"
        dash-array="6 4"
      />
      <LeafletMarker :lng-lat="[-119.5383, 37.8651]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span
            class="border-background size-3 rounded-full border-2 bg-amber-500 shadow"
          />
          <span
            class="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs"
            >Yosemite Gate</span
          >
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>

  <!-- 8 ─────────────────────────────────────────────────────────────────── -->
  <Story
    title="Controls & Fullscreen"
    description="navigation/fullscreen props place Leaflet zoom and an HTML5 fullscreen button on themed chrome."
  >
    <div class="space-y-3">
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          class="border-border bg-card text-foreground hover:bg-muted rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          @click="controlsMap?.zoomIn()"
        >
          Zoom in
        </button>
        <button
          type="button"
          class="border-border bg-card text-foreground hover:bg-muted rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          @click="controlsMap?.zoomOut()"
        >
          Zoom out
        </button>
        <span class="text-muted-foreground ml-2 font-mono text-xs"
          >zoom {{ controlsZoom }}</span
        >
      </div>
      <LeafletMap
        ref="controlsMap"
        variant="streets"
        :center="[-0.1276, 51.5074]"
        :zoom="12"
        :fullscreen="true"
        navigation-position="top-right"
        fullscreen-position="top-left"
        class="h-96 w-full rounded-lg border"
        @created="onControlsCreated"
      />
    </div>
  </Story>

  <!-- 9 ─────────────────────────────────────────────────────────────────── -->
  <Story
    title="Custom Tile Layer"
    description="LeafletTileLayer stacks extra raster layers; tile-url on LeafletMap swaps the basemap outright."
  >
    <LeafletMap
      variant="satellite"
      :center="[-122.478, 37.819]"
      :zoom="13"
      class="h-96 w-full rounded-lg border"
    >
      <LeafletTileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        :opacity="0.9"
      />
      <LeafletMarker :lng-lat="[-122.478, 37.819]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span
            class="border-background size-3 rounded-full border-2 bg-white shadow"
          />
          <span
            class="mt-1 rounded border border-white/20 bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white shadow-xs"
            >Golden Gate</span
          >
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>

  <!-- 10 ────────────────────────────────────────────────────────────────── -->
  <Story
    title="World View — Compact"
    description="size presets (sm/lg/xl/full) or your own className; min-zoom clamps keep the canvas sane."
  >
    <LeafletMap
      :center="[15, 20]"
      :zoom="1.4"
      :min-zoom="1.2"
      :navigation="false"
      :scroll-wheel-zoom="false"
      size="sm"
      class="rounded-lg border"
    />
  </Story>

  <!-- 11 ────────────────────────────────────────────────────────────────── -->
  <Story
    title="Polygon Boundary"
    description="LeafletPolygon renders cadastral-style boundaries; dashed rings read as restricted airspace."
  >
    <LeafletMap
      variant="navigation-day"
      :center="[4.4, 51.9]"
      :zoom="11"
      class="h-96 w-full rounded-lg border"
    >
      <LeafletPolygon
        :lng-lat-path="[
          [4.28, 51.82],
          [4.55, 51.82],
          [4.55, 51.98],
          [4.28, 51.98],
          [4.28, 51.82],
        ]"
        color="#e11d48"
        :weight="2"
        dash-array="8 6"
        :fill="true"
        fill-color="#e11d48"
        :fill-opacity="0.08"
      />
      <LeafletMarker :lng-lat="[4.4, 51.9]" anchor="center">
        <span
          class="border-border bg-card text-foreground rounded-md border px-2 py-1 font-mono text-[10px] font-bold shadow-xs"
          >PORT OF ROTTERDAM</span
        >
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
