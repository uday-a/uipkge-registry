<script setup lang="ts">
import { ref } from 'vue'
import { LeafletMap, type LeafletMapRef } from '@/components/ui/leaflet-map'

const mapRef = ref<LeafletMapRef | null>(null)

const landmarks = [
  { name: 'Big Ben', center: [-0.1246, 51.5007] as [number, number], zoom: 16 },
  { name: 'London Eye', center: [-0.1195, 51.5033] as [number, number], zoom: 16 },
  { name: 'Tower Bridge', center: [-0.0754, 51.5055] as [number, number], zoom: 15.5 },
]

/** [[west, south], [east, north]] in [lng, lat] — central London. */
const LONDON_BOUNDS: [[number, number], [number, number]] = [
  [-0.16, 51.49],
  [-0.06, 51.53],
]
</script>

<template>
  <Story
    title="Controls & Toolbar"
    description="navigation + fullscreen props place themed Leaflet chrome; the custom toolbar calls the exposed camera helpers — flyTo, zoomIn/zoomOut, fitBounds."
  >
    <LeafletMap
      ref="mapRef"
      variant="streets"
      :center="[-0.1276, 51.5074]"
      :zoom="13"
      :navigation="true"
      navigation-position="bottom-right"
      :fullscreen="true"
      class="h-96 w-full rounded-lg border"
    >
      <div
        class="border-border bg-card/95 absolute top-3 left-3 z-[1000] flex w-36 flex-col gap-0.5 rounded-md border p-1 shadow-md backdrop-blur"
      >
        <span class="text-muted-foreground px-2 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase">
          Landmarks
        </span>
        <button
          v-for="l in landmarks"
          :key="l.name"
          type="button"
          class="text-foreground hover:bg-muted rounded px-2 py-1 text-left font-mono text-xs transition-colors"
          @click="mapRef?.flyTo({ center: l.center, zoom: l.zoom })"
        >
          {{ l.name }}
        </button>
        <div class="border-border my-1 border-t" />
        <div class="flex gap-0.5">
          <button
            type="button"
            class="text-foreground hover:bg-muted flex-1 rounded px-2 py-1 font-mono text-xs transition-colors"
            aria-label="Zoom in"
            @click="mapRef?.zoomIn()"
          >
            +
          </button>
          <button
            type="button"
            class="text-foreground hover:bg-muted flex-1 rounded px-2 py-1 font-mono text-xs transition-colors"
            aria-label="Zoom out"
            @click="mapRef?.zoomOut()"
          >
            −
          </button>
        </div>
        <button
          type="button"
          class="text-foreground hover:bg-muted rounded px-2 py-1 text-left font-mono text-xs transition-colors"
          @click="mapRef?.fitBounds(LONDON_BOUNDS)"
        >
          Fit London
        </button>
      </div>
    </LeafletMap>
  </Story>
</template>
