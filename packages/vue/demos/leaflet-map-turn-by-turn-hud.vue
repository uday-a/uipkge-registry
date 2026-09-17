<script setup lang="ts">
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
</script>

<template>
  <Story
    title="Turn-by-Turn HUD"
    description="In-dash vehicle routing display with a cased route line, next-turn card, and speed telemetry — no GL pitch required."
  >
    <LeafletMap
      variant="navigation-night"
      :center="[-73.985, 40.748]"
      :zoom="14.5"
      class="h-96 w-full rounded-lg border"
    >
      <!-- HUD overlay — absolute inside the relative map shell, above Leaflet panes. -->
      <div
        class="border-border bg-card/90 absolute top-3 left-3 z-[1000] w-60 overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm"
      >
        <div class="flex items-center gap-3 p-3">
          <div class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <svg
              class="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m15 14 5-5-5-5" />
              <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-foreground font-mono text-lg leading-tight font-bold">850 ft</div>
            <div class="text-muted-foreground truncate text-xs">Turn right onto W 34th St</div>
          </div>
        </div>
        <div class="border-border flex items-center justify-between border-t px-3 py-2 font-mono text-[11px]">
          <span class="text-muted-foreground">ETA <span class="text-foreground font-bold">4:32 PM</span></span>
          <span class="text-muted-foreground">6 min · 2.1 mi</span>
          <span class="font-bold text-emerald-400">28 MPH</span>
        </div>
      </div>

      <!-- Route: low-opacity casing, completed leg muted, remaining leg bright. -->
      <LeafletPolyline
        :lng-lat-path="routePath"
        color="#0ea5e9"
        :weight="9"
        :opacity="0.25"
        line-cap="round"
        line-join="round"
      />
      <LeafletPolyline :lng-lat-path="completedPath" color="#52525b" :weight="5" :opacity="0.9" line-cap="round" />
      <LeafletPolyline :lng-lat-path="remainingPath" color="#38bdf8" :weight="5" :opacity="1" line-cap="round" />

      <!-- Origin -->
      <LeafletMarker :lng-lat="routePath[0]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="border-background size-3 rounded-full border-2 bg-emerald-500 shadow" />
          <span
            class="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold whitespace-nowrap shadow-xs"
          >
            Origin · Canal St
          </span>
        </div>
      </LeafletMarker>

      <!-- Vehicle -->
      <LeafletMarker :lng-lat="vehiclePos" anchor="center">
        <div class="flex flex-col items-center">
          <div
            class="flex size-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-md ring-2 ring-white"
          >
            ▲
          </div>
          <span
            class="border-border/80 bg-card/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold whitespace-nowrap text-sky-400 shadow-md"
          >
            28 MPH • Heading N
          </span>
        </div>
      </LeafletMarker>

      <!-- Destination -->
      <LeafletMarker :lng-lat="routePath[routePath.length - 1]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="border-background size-3 rounded-full border-2 bg-rose-500 shadow" />
          <span
            class="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold whitespace-nowrap shadow-xs"
          >
            Columbus Circle
          </span>
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
