<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Map, MapMarker, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

defineProps<{ accessToken?: string }>()

interface Vessel {
  mmsi: string
  name: string
  flag: string
  type: 'Container' | 'Crude Tanker' | 'Bulk Carrier' | 'Tug'
  coords: [number, number]
  heading: number
  speedKnots: number
  draught: string
  dest: string
  eta: string
  status: 'Underway' | 'Moored' | 'At Anchor'
}

const mapRef = ref<MapRef | null>(null)

const vessels: Vessel[] = [
  {
    mmsi: '219018442',
    name: 'EVER GIVEN',
    flag: 'PA',
    type: 'Container',
    coords: [103.78, 1.25],
    heading: 110,
    speedKnots: 14.8,
    draught: '15.7m',
    dest: 'SGSIN PEB',
    eta: 'OCT 24 14:00',
    status: 'Underway',
  },
  {
    mmsi: '636019812',
    name: 'NORDIC STAR',
    flag: 'LR',
    type: 'Crude Tanker',
    coords: [103.88, 1.22],
    heading: 245,
    speedKnots: 0.2,
    draught: '12.1m',
    dest: 'SINGAPORE ANCH',
    eta: 'OCT 24 08:30',
    status: 'At Anchor',
  },
  {
    mmsi: '356782000',
    name: 'PACIFIC RUBY',
    flag: 'SG',
    type: 'Bulk Carrier',
    coords: [103.95, 1.29],
    heading: 45,
    speedKnots: 11.2,
    draught: '10.4m',
    dest: 'JPTYO',
    eta: 'OCT 29 06:00',
    status: 'Underway',
  },
  {
    mmsi: '508111222',
    name: 'HARBOR VALIANT',
    flag: 'SG',
    type: 'Tug',
    coords: [103.75, 1.28],
    heading: 180,
    speedKnots: 6.4,
    draught: '4.5m',
    dest: 'PASIR PANJANG',
    eta: 'OCT 24 12:00',
    status: 'Underway',
  },
]

const activeVessel = ref<Vessel>(vessels[0])

async function selectVessel(v: Vessel) {
  activeVessel.value = v
  // `:center` is reactive, so Vue re-applies it on the next tick and would
  // otherwise cancel this flight and strand the camera at the default zoom.
  await nextTick()
  mapRef.value?.flyTo({ center: v.coords, zoom: 11.5 })
}
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[1fr_320px]">
    <div class="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
      <Map
        ref="mapRef"
        :access-token="accessToken"
        variant="dark"
        :center="activeVessel.coords"
        :zoom="10.8"
        class="h-full w-full"
      >
        <MapMarker v-for="v in vessels" :key="v.mmsi" :lng-lat="v.coords" anchor="center" @click="selectVessel(v)">
          <div class="group relative flex cursor-pointer flex-col items-center">
            <div
              class="flex size-7 items-center justify-center rounded-full font-bold text-cyan-400 transition-transform hover:scale-125"
              :class="activeVessel.mmsi === v.mmsi ? 'bg-cyan-500/20 ring-2 ring-cyan-400' : 'bg-background/80'"
              :style="{ transform: `rotate(${v.heading}deg)` }"
            >
              ▲
            </div>
            <span
              class="border-border bg-card/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-semibold tracking-wider whitespace-nowrap shadow-xs"
              :class="activeVessel.mmsi === v.mmsi ? 'border-cyan-400/50 text-cyan-400' : 'text-foreground'"
            >
              {{ v.name }}
            </span>
          </div>
        </MapMarker>
      </Map>
    </div>

    <!-- AIS Telemetry Drawer -->
    <Card class="flex flex-col justify-between">
      <CardHeader>
        <div class="flex items-center justify-between">
          <Badge variant="outline" class="font-mono text-xs">{{ activeVessel.type }}</Badge>
          <Badge class="border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">{{
            activeVessel.status
          }}</Badge>
        </div>
        <CardTitle class="mt-2 font-mono text-lg">{{ activeVessel.name }}</CardTitle>
        <CardDescription class="font-mono text-xs"
          >MMSI: {{ activeVessel.mmsi }} • Flag: {{ activeVessel.flag }}</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="border-border bg-muted/40 grid grid-cols-2 gap-2 rounded-lg border p-2.5 font-mono text-xs">
          <div>
            <div class="text-muted-foreground text-[10px] uppercase">Speed Over Ground</div>
            <div class="text-foreground text-sm font-bold">{{ activeVessel.speedKnots }} kts</div>
          </div>
          <div>
            <div class="text-muted-foreground text-[10px] uppercase">Heading</div>
            <div class="text-foreground text-sm font-bold">{{ activeVessel.heading }}°</div>
          </div>
          <div class="mt-2">
            <div class="text-muted-foreground text-[10px] uppercase">Max Draught</div>
            <div class="text-foreground text-sm font-bold">{{ activeVessel.draught }}</div>
          </div>
          <div class="mt-2">
            <div class="text-muted-foreground text-[10px] uppercase">Destination</div>
            <div class="text-foreground truncate text-xs font-bold">{{ activeVessel.dest }}</div>
          </div>
        </div>

        <div class="border-border space-y-1 border-t pt-3">
          <div class="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
            Singapore Strait Traffic
          </div>
          <button
            v-for="v in vessels"
            :key="v.mmsi"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors"
            :class="
              activeVessel.mmsi === v.mmsi
                ? 'bg-accent text-accent-foreground font-semibold'
                : 'hover:bg-muted text-muted-foreground'
            "
            @click="selectVessel(v)"
          >
            <span class="font-mono">{{ v.name }}</span>
            <span class="font-mono text-[10px] opacity-75">{{ v.speedKnots }} kts</span>
          </button>
        </div>

        <Button variant="outline" size="sm" class="w-full font-mono text-xs" @click="selectVessel(activeVessel)">
          Center on Vessel
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
