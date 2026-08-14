<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeafletMap, LeafletMarker, type LeafletMapRef } from '@/components/ui/leaflet-map'

export type VehicleStatus = 'moving' | 'idling' | 'parked'

export interface FleetVehicle {
  id: string
  identifier: string
  model: string
  driver: string
  status: VehicleStatus
  speed: number
  lat: number
  lng: number
}

export interface LeafletFleetVehicleMapProps {
  class?: HTMLAttributes['class']
  vehicles?: FleetVehicle[]
}

const DEFAULT_VEHICLES: FleetVehicle[] = [
  {
    id: 'v-104',
    identifier: 'Truck #104',
    model: 'Volvo VNL 860',
    driver: 'Marcus Vance',
    status: 'moving',
    speed: 64,
    lat: 41.5868,
    lng: -93.625,
  },
  {
    id: 'v-208',
    identifier: 'Van #208',
    model: 'Ford E-Transit 350',
    driver: 'Elena Rostova',
    status: 'moving',
    speed: 48,
    lat: 41.6005,
    lng: -93.712,
  },
  {
    id: 'v-109',
    identifier: 'Truck #109',
    model: 'Freightliner Cascadia',
    driver: 'Derrick Hayes',
    status: 'idling',
    speed: 0,
    lat: 41.984,
    lng: -93.582,
  },
  {
    id: 'v-212',
    identifier: 'Van #212',
    model: 'Mercedes Sprinter',
    driver: 'Aaliyah Patel',
    status: 'moving',
    speed: 52,
    lat: 41.591,
    lng: -93.604,
  },
]

const props = defineProps<LeafletFleetVehicleMapProps>()

const vehicles = computed(() => props.vehicles ?? DEFAULT_VEHICLES)
const selectedId = ref(DEFAULT_VEHICLES[0]?.id ?? '')
const selected = computed(() => vehicles.value.find((v) => v.id === selectedId.value) ?? vehicles.value[0])

const mapRef = ref<LeafletMapRef | null>(null)

function selectVehicle(vehicle: FleetVehicle) {
  selectedId.value = vehicle.id
  mapRef.value?.flyTo?.({
    center: [vehicle.lng, vehicle.lat],
    zoom: 12,
    duration: 800,
  })
}

function statusVariant(status: VehicleStatus) {
  if (status === 'moving') return 'info'
  if (status === 'idling') return 'warning'
  return 'secondary'
}
</script>

<template>
  <div data-slot="leaflet-fleet-vehicle-map" :class="cn('flex h-full min-h-0 flex-col gap-4', props.class)">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-foreground text-lg font-semibold tracking-tight">Fleet</h2>
      <p class="text-muted-foreground text-xs">{{ vehicles.length }} units</p>
    </div>

    <div class="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
        <div class="relative min-h-[360px] flex-1 overflow-hidden">
          <LeafletMap
            ref="mapRef"
            variant="dark"
            :center="selected ? [selected.lng, selected.lat] : [-93.625, 41.59]"
            :zoom="11"
            class="absolute inset-0 size-full"
          >
            <LeafletMarker
              v-for="vehicle in vehicles"
              :key="vehicle.id"
              :lng-lat="[vehicle.lng, vehicle.lat]"
              anchor="center"
            >
              <button
                type="button"
                class="rounded-full border px-2 py-0.5 font-mono text-xs font-semibold shadow-xs"
                :class="
                  selectedId === vehicle.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground'
                "
                @click.stop="selectVehicle(vehicle)"
              >
                {{ vehicle.identifier.replace('Truck ', '').replace('Van ', '') }}
              </button>
            </LeafletMarker>
          </LeafletMap>
        </div>
      </Card>

      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-4">
        <CardHeader class="border-border border-b p-4">
          <CardTitle class="text-sm font-semibold">Vehicles</CardTitle>
        </CardHeader>
        <CardContent class="divide-border min-h-0 flex-1 divide-y overflow-auto p-0">
          <button
            v-for="vehicle in vehicles"
            :key="vehicle.id"
            type="button"
            :class="
              cn(
                'hover:bg-accent/50 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
                selectedId === vehicle.id && 'bg-accent/60',
              )
            "
            @click="selectVehicle(vehicle)"
          >
            <div class="min-w-0">
              <p class="text-foreground truncate text-sm font-medium">{{ vehicle.identifier }}</p>
              <p class="text-muted-foreground truncate text-xs">{{ vehicle.driver }} · {{ vehicle.model }}</p>
            </div>
            <Badge :variant="statusVariant(vehicle.status)" class="shrink-0 text-xs capitalize">
              {{ vehicle.status === 'moving' ? `${vehicle.speed} mph` : vehicle.status }}
            </Badge>
          </button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
