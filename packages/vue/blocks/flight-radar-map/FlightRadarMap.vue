<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Map, MapMarker, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

defineProps<{ accessToken?: string }>()

interface Flight {
  id: string
  callsign: string
  airline: string
  origin: string
  destination: string
  coords: [number, number]
  heading: number
  altitude: number
  speed: number
  aircraft: string
  status: 'Cruising' | 'Ascending' | 'Descending'
}

const mapRef = ref<MapRef | null>(null)

const flights: Flight[] = [
  {
    id: 'f-101',
    callsign: 'UAL482',
    airline: 'United Airlines',
    origin: 'SFO',
    destination: 'ORD',
    coords: [-112.0, 39.5],
    heading: 78,
    altitude: 34000,
    speed: 520,
    aircraft: 'B787-9',
    status: 'Cruising',
  },
  {
    id: 'f-102',
    callsign: 'DAL1209',
    airline: 'Delta Air Lines',
    origin: 'LAX',
    destination: 'JFK',
    coords: [-104.5, 36.2],
    heading: 72,
    altitude: 38000,
    speed: 545,
    aircraft: 'A350-900',
    status: 'Cruising',
  },
  {
    id: 'f-103',
    callsign: 'AAL89',
    airline: 'American Airlines',
    origin: 'DFW',
    destination: 'SEA',
    coords: [-107.2, 42.1],
    heading: 325,
    altitude: 29000,
    speed: 480,
    aircraft: 'B737-MAX8',
    status: 'Cruising',
  },
  {
    id: 'f-104',
    callsign: 'FDX14',
    airline: 'FedEx Express',
    origin: 'MEM',
    destination: 'OAK',
    coords: [-115.8, 38.0],
    heading: 285,
    altitude: 22000,
    speed: 440,
    aircraft: 'B777-F',
    status: 'Descending',
  },
]

const activeFlight = ref<Flight>(flights[0])

async function selectFlight(f: Flight) {
  activeFlight.value = f
  // `:center` is reactive, so Vue re-applies it on the next tick and would
  // otherwise cancel this flight and strand the camera at the default zoom.
  await nextTick()
  mapRef.value?.flyTo({ center: f.coords, zoom: 6.5 })
}
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[1fr_320px]">
    <div class="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
      <Map
        ref="mapRef"
        :access-token="accessToken"
        variant="dark"
        :center="activeFlight.coords"
        :zoom="5.2"
        class="h-full w-full"
      >
        <MapMarker v-for="f in flights" :key="f.id" :lng-lat="f.coords" anchor="center" @click="selectFlight(f)">
          <div class="group relative flex cursor-pointer flex-col items-center">
            <div
              class="flex size-7 items-center justify-center rounded-full font-bold text-sky-400 transition-transform hover:scale-125"
              :class="activeFlight.id === f.id ? 'bg-sky-500/20 ring-2 ring-sky-400' : 'bg-background/80'"
              :style="{ transform: `rotate(${f.heading}deg)` }"
            >
              ▲
            </div>
            <span
              class="border-border bg-card/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-semibold tracking-wider whitespace-nowrap shadow-xs"
              :class="activeFlight.id === f.id ? 'border-sky-400/50 text-sky-400' : 'text-foreground'"
            >
              {{ f.callsign }}
            </span>
          </div>
        </MapMarker>
      </Map>
    </div>

    <!-- Aviation Telemetry Radar Drawer -->
    <Card class="flex flex-col justify-between">
      <CardHeader>
        <div class="flex items-center justify-between">
          <Badge variant="outline" class="font-mono text-xs">{{ activeFlight.airline }}</Badge>
          <Badge class="border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">{{
            activeFlight.status
          }}</Badge>
        </div>
        <CardTitle class="mt-2 font-mono text-xl">{{ activeFlight.callsign }}</CardTitle>
        <CardDescription class="flex items-center gap-2 font-mono text-xs">
          <span>{{ activeFlight.origin }}</span>
          <span>✈ ─── ✈</span>
          <span>{{ activeFlight.destination }}</span>
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="border-border bg-muted/50 grid grid-cols-2 gap-2 rounded-lg border p-2.5 font-mono text-xs">
          <div>
            <div class="text-muted-foreground text-[10px] uppercase">Altitude</div>
            <div class="text-foreground text-sm font-bold">{{ activeFlight.altitude.toLocaleString() }} ft</div>
          </div>
          <div>
            <div class="text-muted-foreground text-[10px] uppercase">Ground Speed</div>
            <div class="text-foreground text-sm font-bold">{{ activeFlight.speed }} kts</div>
          </div>
          <div class="mt-2">
            <div class="text-muted-foreground text-[10px] uppercase">Heading</div>
            <div class="text-foreground text-sm font-bold">{{ activeFlight.heading }}°</div>
          </div>
          <div class="mt-2">
            <div class="text-muted-foreground text-[10px] uppercase">Equipment</div>
            <div class="text-foreground text-sm font-bold">{{ activeFlight.aircraft }}</div>
          </div>
        </div>

        <!-- Flight Selector List -->
        <div class="border-border space-y-1 border-t pt-3">
          <div class="text-muted-foreground mb-1.5 font-mono text-[10px] tracking-wider uppercase">
            Monitored In-Flight
          </div>
          <button
            v-for="f in flights"
            :key="f.id"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors"
            :class="
              activeFlight.id === f.id
                ? 'bg-accent text-accent-foreground font-semibold'
                : 'hover:bg-muted text-muted-foreground'
            "
            @click="selectFlight(f)"
          >
            <span class="font-mono">{{ f.callsign }} ({{ f.origin }}→{{ f.destination }})</span>
            <span class="font-mono text-[10px] opacity-75">{{ f.altitude / 1000 }}k ft</span>
          </button>
        </div>

        <Button variant="outline" size="sm" class="w-full font-mono text-xs" @click="selectFlight(activeFlight)">
          Recenter Camera
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
