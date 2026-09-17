<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Map, MapMarker, MapSource, MapLayer, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

defineProps<{ accessToken?: string }>()

interface Parcel {
  apn: string
  address: string
  zoning: string
  lotSqFt: string
  acres: number
  assessedValue: string
  taxYear: number
  coords: [number, number]
  polygon: [number, number][]
}

const mapRef = ref<MapRef | null>(null)

const parcels: Parcel[] = [
  {
    apn: '0482-104-012',
    address: '450 Mountain View Rd, Austin, TX',
    zoning: 'SF-3 (Single Family)',
    lotSqFt: '14,280 sq ft',
    acres: 0.33,
    assessedValue: '$1,280,000',
    taxYear: 2025,
    coords: [-97.7431, 30.2672],
    polygon: [
      [-97.7438, 30.2678],
      [-97.7424, 30.2678],
      [-97.7424, 30.2666],
      [-97.7438, 30.2666],
      [-97.7438, 30.2678],
    ],
  },
  {
    apn: '0482-104-013',
    address: '460 Mountain View Rd, Austin, TX',
    zoning: 'SF-3 (Single Family)',
    lotSqFt: '16,500 sq ft',
    acres: 0.38,
    assessedValue: '$1,410,000',
    taxYear: 2025,
    coords: [-97.741, 30.2672],
    polygon: [
      [-97.7424, 30.2678],
      [-97.741, 30.2678],
      [-97.741, 30.2666],
      [-97.7424, 30.2666],
      [-97.7424, 30.2678],
    ],
  },
]

const activeParcel = ref<Parcel>(parcels[0])

async function selectParcel(p: Parcel) {
  activeParcel.value = p
  // `:center` is reactive, so Vue re-applies it on the next tick and would
  // otherwise cancel this flight and strand the camera at the default zoom.
  await nextTick()
  mapRef.value?.flyTo({ center: p.coords, zoom: 17 })
}
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[1fr_320px]">
    <div class="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
      <Map
        ref="mapRef"
        :access-token="accessToken"
        variant="satellite-streets"
        :center="activeParcel.coords"
        :zoom="16.5"
        class="h-full w-full"
      >
        <!-- Parcel Boundary Polygons -->
        <MapSource
          id="parcel-primary"
          :options="{
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'Polygon', coordinates: [activeParcel.polygon] },
            },
          }"
        />
        <MapLayer
          id="parcel-primary-fill"
          :options="{
            type: 'fill',
            source: 'parcel-primary',
            paint: { 'fill-color': '#eab308', 'fill-opacity': 0.28 },
          }"
        />
        <MapLayer
          id="parcel-primary-line"
          :options="{
            type: 'line',
            source: 'parcel-primary',
            paint: { 'line-color': '#facc15', 'line-width': 2.5 },
          }"
        />

        <MapMarker v-for="p in parcels" :key="p.apn" :lng-lat="p.coords" anchor="center" @click="selectParcel(p)">
          <div class="group flex cursor-pointer flex-col items-center">
            <span
              class="border-border bg-background/90 rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold shadow-md transition-transform group-hover:scale-110"
              :class="activeParcel.apn === p.apn ? 'border-amber-400 text-amber-500' : 'text-foreground'"
            >
              {{ p.apn }}
            </span>
          </div>
        </MapMarker>
      </Map>
    </div>

    <!-- Cadastral Parcel Valuation Card -->
    <Card class="flex flex-col justify-between">
      <CardHeader>
        <div class="flex items-center justify-between">
          <Badge variant="outline" class="font-mono text-xs">APN {{ activeParcel.apn }}</Badge>
          <Badge class="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">{{
            activeParcel.zoning
          }}</Badge>
        </div>
        <CardTitle class="mt-2 text-base font-medium">{{ activeParcel.address }}</CardTitle>
        <CardDescription class="font-mono text-xs"
          >{{ activeParcel.lotSqFt }} • {{ activeParcel.acres }} Acres</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="border-border space-y-2 border-t pt-3 font-mono text-xs">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Assessed Valuation</span>
            <span class="text-foreground text-base font-bold">{{ activeParcel.assessedValue }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Zoning Code</span>
            <span class="text-foreground">{{ activeParcel.zoning }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Assessment Roll Year</span>
            <span class="text-foreground">{{ activeParcel.taxYear }}</span>
          </div>
        </div>

        <div class="border-border space-y-1 border-t pt-3">
          <div class="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
            Adjacent Cadastral Lots
          </div>
          <button
            v-for="p in parcels"
            :key="p.apn"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors"
            :class="
              activeParcel.apn === p.apn
                ? 'bg-accent text-accent-foreground font-semibold'
                : 'hover:bg-muted text-muted-foreground'
            "
            @click="selectParcel(p)"
          >
            <span class="font-mono">{{ p.apn }}</span>
            <span class="font-mono text-[10px] opacity-75">{{ p.lotSqFt }}</span>
          </button>
        </div>

        <Button variant="outline" size="sm" class="w-full font-mono text-xs" @click="selectParcel(activeParcel)">
          Center Cadastral Lot
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
