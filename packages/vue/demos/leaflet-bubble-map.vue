<script setup lang="ts">
import { LeafletMap, LeafletCircleMarker, LeafletTooltip } from '@/components/ui/leaflet-map'

// ─────────────────────────────────────────────────────────────────────────────
// Proportional-symbol bubble map: pixel-radius LeafletCircleMarkers sized by a
// sqrt scale so circle AREA stays proportional to the metric.
// ─────────────────────────────────────────────────────────────────────────────
const CITIES = [
  { name: 'New York', region: 'us-east-1', lngLat: [-74.0, 40.7] as [number, number], value: 148 },
  { name: 'San Francisco', region: 'us-west-1', lngLat: [-122.4, 37.8] as [number, number], value: 121 },
  { name: 'Mexico City', region: 'mx-central-1', lngLat: [-99.1, 19.4] as [number, number], value: 43 },
  { name: 'São Paulo', region: 'sa-east-1', lngLat: [-46.6, -23.6] as [number, number], value: 64 },
  { name: 'London', region: 'eu-west-2', lngLat: [-0.12, 51.5] as [number, number], value: 132 },
  { name: 'Frankfurt', region: 'eu-central-1', lngLat: [8.68, 50.1] as [number, number], value: 112 },
  { name: 'Amsterdam', region: 'eu-west-1', lngLat: [4.9, 52.4] as [number, number], value: 84 },
  { name: 'Dubai', region: 'me-central-1', lngLat: [55.3, 25.2] as [number, number], value: 52 },
  { name: 'Mumbai', region: 'ap-south-1', lngLat: [72.9, 19.1] as [number, number], value: 74 },
  { name: 'Singapore', region: 'ap-southeast-1', lngLat: [103.8, 1.35] as [number, number], value: 96 },
  { name: 'Tokyo', region: 'ap-northeast-1', lngLat: [139.7, 35.7] as [number, number], value: 126 },
  { name: 'Sydney', region: 'ap-southeast-2', lngLat: [151.2, -33.9] as [number, number], value: 58 },
]

const MAX = Math.max(...CITIES.map((c) => c.value))
// sqrt scale: visual area, not radius, tracks the value.
const radiusFor = (v: number) => 5 + Math.sqrt(v / MAX) * 20
</script>

<template>
  <Story
    title="Global Edge Traffic"
    description="Proportional LeafletCircleMarkers over a muted world basemap — bubble area scales with daily request volume, avoiding landmass bias."
  >
    <LeafletMap
      variant="muted"
      :center="[15, 20]"
      :zoom="1.5"
      :min-zoom="1.2"
      class="h-[420px] w-full rounded-lg border"
    >
      <LeafletCircleMarker
        v-for="c in CITIES"
        :key="c.name"
        :center="c.lngLat"
        :radius="radiusFor(c.value)"
        color="#1d4ed8"
        :weight="1.5"
        :fill="true"
        fill-color="#3b82f6"
        :fill-opacity="0.55"
      >
        <LeafletTooltip direction="top" :offset="[0, -8]">
          <div class="font-mono text-xs">
            <div class="text-foreground font-bold">{{ c.name }}</div>
            <div class="text-muted-foreground">{{ c.region }} · {{ c.value }}M req/day</div>
          </div>
        </LeafletTooltip>
      </LeafletCircleMarker>
      <div
        class="border-border bg-card/95 absolute top-3 left-3 z-[1000] rounded-lg border px-3 py-2 shadow-sm backdrop-blur-sm"
      >
        <p class="text-foreground text-xs font-semibold">Edge requests / day</p>
        <p class="text-muted-foreground mt-0.5 font-mono text-[10px]">bubble area ∝ volume (M)</p>
      </div>
    </LeafletMap>
  </Story>
</template>
