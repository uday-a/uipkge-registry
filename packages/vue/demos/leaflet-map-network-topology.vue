<script setup lang="ts">
import { LeafletMap, LeafletMarker, LeafletPopup, LeafletPolyline } from '@/components/ui/leaflet-map'

// Global multi-region cloud topology on the free Esri dark canvas.
const regions = [
  {
    code: 'us-east-1',
    name: 'N. Virginia',
    coords: [-77.04, 38.9] as [number, number],
    ping: '12ms',
    uptime: '99.99%',
    loss: '0.0%',
  },
  {
    code: 'us-west-2',
    name: 'Oregon',
    coords: [-122.67, 45.52] as [number, number],
    ping: '28ms',
    uptime: '99.98%',
    loss: '0.1%',
  },
  {
    code: 'eu-west-1',
    name: 'Ireland',
    coords: [-6.26, 53.34] as [number, number],
    ping: '64ms',
    uptime: '99.99%',
    loss: '0.0%',
  },
  {
    code: 'eu-central-1',
    name: 'Frankfurt',
    coords: [8.68, 50.11] as [number, number],
    ping: '72ms',
    uptime: '99.97%',
    loss: '0.2%',
  },
  {
    code: 'ap-southeast-1',
    name: 'Singapore',
    coords: [103.82, 1.35] as [number, number],
    ping: '98ms',
    uptime: '99.95%',
    loss: '0.3%',
  },
  {
    code: 'ap-northeast-1',
    name: 'Tokyo',
    coords: [139.69, 35.68] as [number, number],
    ping: '112ms',
    uptime: '99.98%',
    loss: '0.1%',
  },
  {
    code: 'ap-southeast-2',
    name: 'Sydney',
    coords: [151.21, -33.87] as [number, number],
    ping: '148ms',
    uptime: '99.96%',
    loss: '0.2%',
  },
  {
    code: 'sa-east-1',
    name: 'São Paulo',
    coords: [-46.63, -23.55] as [number, number],
    ping: '135ms',
    uptime: '99.94%',
    loss: '0.4%',
  },
]

const byCode = Object.fromEntries(regions.map((r) => [r.code, r]))

// Backbone links — straight polylines (Leaflet has no great-circle arcs), drawn
// as a multi-part path so the casing + inner line each need one layer.
const links: [string, string][] = [
  ['us-east-1', 'eu-west-1'],
  ['eu-west-1', 'eu-central-1'],
  ['eu-central-1', 'ap-southeast-1'],
  ['ap-southeast-1', 'ap-northeast-1'],
  ['ap-southeast-1', 'ap-southeast-2'],
  ['ap-northeast-1', 'us-west-2'],
  ['us-west-2', 'us-east-1'],
  ['us-east-1', 'sa-east-1'],
  ['eu-central-1', 'ap-northeast-1'],
]
const linkPaths = links.map(([a, b]) => [byCode[a].coords, byCode[b].coords])
</script>

<template>
  <Story
    title="Global Network Topology"
    description="Multi-region cloud infrastructure nodes with pulsing status rings, cased backbone links, and latency popups — all on key-free tiles."
  >
    <LeafletMap variant="dark" :center="[20, 20]" :zoom="1.5" class="h-96 w-full rounded-lg border">
      <!-- Dashed low-opacity casing + brighter inner line. -->
      <LeafletPolyline
        :lng-lat-path="linkPaths"
        color="#38bdf8"
        :weight="6"
        :opacity="0.12"
        dash-array="2 10"
        line-cap="round"
      />
      <LeafletPolyline :lng-lat-path="linkPaths" color="#7dd3fc" :weight="1.5" :opacity="0.9" line-cap="round" />

      <LeafletMarker v-for="r in regions" :key="r.code" :lng-lat="r.coords" anchor="center">
        <div class="flex cursor-pointer flex-col items-center">
          <span class="relative flex size-3">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span class="relative inline-flex size-3 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40" />
          </span>
          <div
            class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap shadow-xs"
          >
            <span class="text-foreground font-bold">{{ r.name }}</span>
            <span class="ml-1 font-semibold text-emerald-500">{{ r.ping }}</span>
          </div>
        </div>
        <LeafletPopup :offset="[0, -14]" class="space-y-1 text-xs">
          <div class="text-foreground font-bold">{{ r.name }}</div>
          <div class="text-muted-foreground font-mono">{{ r.code }}</div>
          <div class="grid grid-cols-2 gap-x-3 font-mono">
            <span class="text-muted-foreground">Latency</span>
            <span class="font-semibold text-emerald-500">{{ r.ping }}</span>
            <span class="text-muted-foreground">Uptime</span>
            <span class="text-foreground font-semibold">{{ r.uptime }}</span>
            <span class="text-muted-foreground">Pkt loss</span>
            <span class="text-foreground font-semibold">{{ r.loss }}</span>
          </div>
        </LeafletPopup>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
