<script setup lang="ts">
import { ref } from 'vue'
import { Map, MapMarker, MapSource, MapLayer, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

defineProps<{ accessToken?: string }>()

const mapRef = ref<MapRef | null>(null)

const origin = [-122.4194, 37.7749] as [number, number]
const destination = [-122.392, 37.7915] as [number, number]
const courierPosition = ref<[number, number]>([-122.405, 37.783])

const routeCoords = [
  [-122.4194, 37.7749],
  [-122.414, 37.778],
  [-122.405, 37.783],
  [-122.399, 37.787],
  [-122.392, 37.7915],
]

function focusCourier() {
  mapRef.value?.flyTo({ center: courierPosition.value, zoom: 14.5 })
}

function focusDestination() {
  mapRef.value?.flyTo({ center: destination, zoom: 15 })
}
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[1fr_320px]">
    <div class="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
      <Map
        ref="mapRef"
        :access-token="accessToken"
        variant="light"
        :center="courierPosition"
        :zoom="13.5"
        class="h-full w-full"
      >
        <MapSource
          id="delivery-route"
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
          id="delivery-route-line"
          :options="{
            type: 'line',
            source: 'delivery-route',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#2563eb', 'line-width': 4 },
          }"
        />
        <!-- Restaurant / Merchant -->
        <MapMarker :lng-lat="origin" anchor="bottom">
          <div class="flex flex-col items-center">
            <span class="bg-muted-foreground ring-muted size-3 rounded-full ring-4" />
            <span class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px]"
              >Merchant</span
            >
          </div>
        </MapMarker>
        <!-- Live Courier -->
        <MapMarker :lng-lat="courierPosition" anchor="center">
          <div class="relative flex cursor-pointer items-center justify-center" @click="focusCourier">
            <span class="bg-primary/25 absolute size-7 animate-ping rounded-full" />
            <div
              class="bg-primary text-primary-foreground ring-background flex size-7 items-center justify-center rounded-full shadow-md ring-2"
            >
              🛵
            </div>
          </div>
        </MapMarker>
        <!-- Destination -->
        <MapMarker :lng-lat="destination" anchor="bottom">
          <div class="flex cursor-pointer flex-col items-center" @click="focusDestination">
            <span class="size-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
            <span
              class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
            >
              Delivery Dropoff
            </span>
          </div>
        </MapMarker>
      </Map>
    </div>

    <!-- Telemetry & Order Status -->
    <Card class="flex flex-col justify-between">
      <CardHeader>
        <div class="flex items-center justify-between">
          <Badge variant="outline" class="font-mono text-xs">ORDER #8924</Badge>
          <Badge class="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >Approaching</Badge
          >
        </div>
        <CardTitle class="mt-2 text-lg">Express Courier</CardTitle>
        <CardDescription
          >Estimated delivery in <strong class="text-foreground">8 mins</strong> (0.8 mi away)</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="border-border space-y-2 border-t pt-3">
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted-foreground">Driver</span>
            <span class="text-foreground font-medium">Carlos M. (★ 4.98)</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted-foreground">Vehicle</span>
            <span class="text-foreground font-mono">E-Scooter #412</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted-foreground">Destination</span>
            <span class="text-foreground max-w-[170px] truncate font-medium">Market St & 2nd Ave</span>
          </div>
        </div>

        <div class="border-border space-y-1.5 border-t pt-3 font-mono text-xs">
          <div class="text-muted-foreground flex items-center gap-2">
            <span class="size-1.5 rounded-full bg-emerald-500"></span>
            <span>12:42 PM — Order picked up</span>
          </div>
          <div class="text-foreground flex items-center gap-2 font-medium">
            <span class="bg-primary size-1.5 animate-pulse rounded-full"></span>
            <span>12:51 PM — Approaching building</span>
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <Button variant="outline" size="sm" class="flex-1" @click="focusCourier">Track Courier</Button>
          <Button variant="outline" size="sm" class="flex-1" @click="focusDestination">Dropoff Point</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
