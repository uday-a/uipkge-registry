<script setup lang="ts">
import { Map, MapSource, MapLayer, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

const routeCoords = [
  [-122.4194, 37.7749],
  [-122.41, 37.78],
  [-122.395, 37.785],
  [-122.389, 37.79],
]
</script>

<template>
  <Story title="Route Layer" description="Declarative GeoJSON route line string with line casing and endpoint markers.">
    <Map
      :access-token="token"
      variant="light"
      :center="[-122.404, 37.782]"
      :zoom="13"
      class="h-96 w-full rounded-lg border"
    >
      <MapSource
        id="courier-route"
        :options="{
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: routeCoords },
          },
        }"
      />
      <MapLayer
        id="courier-route-line"
        :options="{
          type: 'line',
          source: 'courier-route',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#0284c7', 'line-width': 4 },
        }"
      />
      <MapMarker :lng-lat="[-122.4194, 37.7749]" anchor="bottom">
        <span class="size-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
      </MapMarker>
      <MapMarker :lng-lat="[-122.389, 37.79]" anchor="bottom">
        <span class="size-3 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
      </MapMarker>
    </Map>
  </Story>
</template>
