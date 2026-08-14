<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Map, MapMarker, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

defineProps<{ accessToken?: string }>()

interface ContainerAsset {
  id: string
  containerNo: string
  type: 'Reefer' | 'Dry Cargo' | 'Hazardous'
  location: string
  coords: [number, number]
  temp?: string
  humidity?: string
  battery: string
  geofence: 'Inside Zone' | 'In Transit' | 'Exited Perimeter'
  status: 'Nominal' | 'Alert' | 'Secured'
}

const mapRef = ref<MapRef | null>(null)

const assets: ContainerAsset[] = [
  {
    id: 'c-1',
    containerNo: 'MSKU-948102',
    type: 'Reefer',
    location: 'Port of Long Beach, Pier G',
    coords: [-118.216, 33.754],
    temp: '-18.4°C',
    humidity: '84%',
    battery: '92%',
    geofence: 'Inside Zone',
    status: 'Nominal',
  },
  {
    id: 'c-2',
    containerNo: 'CMAU-310892',
    type: 'Dry Cargo',
    location: 'Barstow Rail Yard, Track 4',
    coords: [-117.022, 34.898],
    battery: '78%',
    geofence: 'In Transit',
    status: 'Nominal',
  },
  {
    id: 'c-3',
    containerNo: 'HLXU-772901',
    type: 'Reefer',
    location: 'Inland Empire Logistics Depot',
    coords: [-117.585, 34.062],
    temp: '+4.2°C',
    humidity: '62%',
    battery: '64%',
    geofence: 'Inside Zone',
    status: 'Alert',
  },
  {
    id: 'c-4',
    containerNo: 'OOLU-550183',
    type: 'Hazardous',
    location: 'Pacific Intermodal Terminal',
    coords: [-118.243, 33.974],
    battery: '95%',
    geofence: 'Inside Zone',
    status: 'Secured',
  },
]

const activeAsset = ref<ContainerAsset>(assets[0])

async function selectAsset(a: ContainerAsset) {
  activeAsset.value = a
  // `:center` is reactive, so Vue re-applies it on the next tick and would
  // otherwise cancel this flight and strand the camera at the default zoom.
  await nextTick()
  mapRef.value?.flyTo({ center: a.coords, zoom: 11.5 })
}
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[1fr_320px]">
    <div class="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
      <Map
        ref="mapRef"
        :access-token="accessToken"
        variant="light"
        :center="activeAsset.coords"
        :zoom="9.2"
        class="h-full w-full"
      >
        <MapMarker v-for="a in assets" :key="a.id" :lng-lat="a.coords" anchor="bottom" @click="selectAsset(a)">
          <div class="group relative flex cursor-pointer flex-col items-center">
            <div
              class="flex size-7 items-center justify-center rounded-md font-mono text-xs font-bold shadow-md ring-2 transition-transform group-hover:scale-110"
              :class="
                a.status === 'Alert'
                  ? 'bg-amber-500 text-white ring-amber-400'
                  : 'bg-primary text-primary-foreground ring-primary/25'
              "
            >
              📦
            </div>
            <span
              class="border-border bg-background/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-bold shadow-xs"
            >
              {{ a.containerNo.split('-')[1] }}
            </span>
          </div>
        </MapMarker>
      </Map>
    </div>

    <!-- Asset Telemetry & Sensor Card -->
    <Card class="flex flex-col justify-between">
      <CardHeader>
        <div class="flex items-center justify-between">
          <Badge variant="outline" class="font-mono text-xs">{{ activeAsset.type }}</Badge>
          <Badge
            :class="
              activeAsset.status === 'Alert'
                ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            "
          >
            {{ activeAsset.status }}
          </Badge>
        </div>
        <CardTitle class="mt-2 font-mono text-lg">{{ activeAsset.containerNo }}</CardTitle>
        <CardDescription class="text-xs">{{ activeAsset.location }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="border-border bg-muted/40 grid grid-cols-2 gap-2 rounded-lg border p-2.5 font-mono text-xs">
          <div v-if="activeAsset.temp">
            <div class="text-muted-foreground text-[10px] uppercase">Cold Chain Temp</div>
            <div
              class="text-sm font-bold"
              :class="activeAsset.status === 'Alert' ? 'text-amber-500' : 'text-foreground'"
            >
              {{ activeAsset.temp }}
            </div>
          </div>
          <div v-if="activeAsset.humidity">
            <div class="text-muted-foreground text-[10px] uppercase">Humidity</div>
            <div class="text-foreground text-sm font-bold">{{ activeAsset.humidity }}</div>
          </div>
          <div>
            <div class="text-muted-foreground text-[10px] uppercase">IoT Battery</div>
            <div class="text-foreground text-sm font-bold">{{ activeAsset.battery }}</div>
          </div>
          <div>
            <div class="text-muted-foreground text-[10px] uppercase">Geofence</div>
            <div class="text-foreground text-sm font-bold">{{ activeAsset.geofence }}</div>
          </div>
        </div>

        <div class="border-border space-y-1 border-t pt-3">
          <div class="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
            Tracked Cargo Units
          </div>
          <button
            v-for="a in assets"
            :key="a.id"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors"
            :class="
              activeAsset.id === a.id
                ? 'bg-accent text-accent-foreground font-semibold'
                : 'hover:bg-muted text-muted-foreground'
            "
            @click="selectAsset(a)"
          >
            <span class="font-mono">{{ a.containerNo }}</span>
            <span
              class="font-mono text-[10px]"
              :class="a.status === 'Alert' ? 'font-bold text-amber-500' : 'opacity-70'"
            >
              {{ a.type }}
            </span>
          </button>
        </div>

        <Button variant="outline" size="sm" class="w-full font-mono text-xs" @click="selectAsset(activeAsset)">
          Center on Container
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
