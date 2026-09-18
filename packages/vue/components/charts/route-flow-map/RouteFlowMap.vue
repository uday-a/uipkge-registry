<script lang="ts">
import type { HTMLAttributes } from 'vue'

export interface RouteHub {
  id: string
  name: string
  city?: string
  lat: number
  lng: number
  status?: 'optimal' | 'busy' | 'delayed' | string
  latency?: string | number
  color?: string
}

export interface FlightRoute {
  id: string
  from: string
  to: string
  callsign?: string
  aircraft?: string
  speed?: string
  altitude?: string
  progress?: number
  eta?: string
  status?: 'en-route' | 'scheduled' | 'approaching' | 'diverted' | string
  color?: string
  vehicleType?: 'plane' | 'ship' | 'packet' | 'pulse' | 'dot'
  duration?: number
  curvature?: number
}

export interface RouteFlowMapProps {
  hubs?: RouteHub[]
  routes?: FlightRoute[]
  selectedRoute?: string
  showHubLabels?: boolean
  showGraticule?: boolean
  height?: number | string
  interactive?: boolean
  class?: HTMLAttributes['class']
  ariaLabel?: string
  projection?: 'globe' | 'mercator'
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Map, MapMarker, MapSource, MapLayer, type MapVariant } from '@/components/ui/map'
import { cn } from '@/lib/utils'
import { chartAccentColor } from '../useChartTheme'
import { Globe, Plane, Navigation2 } from 'lucide-vue-next'

const props = withDefaults(defineProps<RouteFlowMapProps>(), {
  hubs: () => [],
  routes: () => [],
  selectedRoute: undefined,
  showHubLabels: true,
  showGraticule: true,
  height: 480,
  interactive: true,
  ariaLabel: 'Global Route and Flight Flow Map',
  projection: 'globe',
})

const emit = defineEmits<{
  (e: 'update:selectedRoute', id: string): void
  (e: 'routeSelect', route: FlightRoute): void
  (e: 'hubClick', hub: RouteHub): void
}>()

const activeRouteId = ref(props.selectedRoute || '')
const currentProjection = ref<'globe' | 'mercator'>(props.projection)
const hoveredHub = ref<RouteHub | null>(null)

watch(
  () => props.selectedRoute,
  (newVal) => {
    if (newVal !== undefined) activeRouteId.value = newVal
  },
)

const hubMap = computed(() => {
  const map = new globalThis.Map<string, RouteHub>()
  for (const h of props.hubs) map.set(h.id, h)
  return map
})

const routesGeoJson = computed(() => {
  if (!props.routes || !props.routes.length) return null
  return {
    type: 'FeatureCollection',
    features: props.routes
      .map((r) => {
        const fromHub = hubMap.value.get(r.from)
        const toHub = hubMap.value.get(r.to)
        if (!fromHub || !toHub) return null

        const midLng = (fromHub.lng + toHub.lng) / 2
        const midLat = (fromHub.lat + toHub.lat) / 2 + 10

        return {
          type: 'Feature',
          id: r.id,
          properties: {
            id: r.id,
            color: r.color || 'rgba(56, 189, 248, 0.8)',
            selected: activeRouteId.value === r.id,
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [fromHub.lng, fromHub.lat],
              [midLng, midLat],
              [toHub.lng, toHub.lat],
            ],
          },
        }
      })
      .filter(Boolean),
  }
})

const routeLinePaint = computed(() => ({
  'line-color': ['case', ['==', ['get', 'id'], activeRouteId.value], chartAccentColor.value, ['get', 'color']],
  'line-width': ['case', ['==', ['get', 'id'], activeRouteId.value], 3, 1.5],
  'line-dasharray': [2, 2],
}))

const activeRoute = computed(() => props.routes.find((r) => r.id === activeRouteId.value))

function selectRoute(r: FlightRoute) {
  if (!props.interactive) return
  activeRouteId.value = r.id
  emit('update:selectedRoute', r.id)
  emit('routeSelect', r)
}

function getVehiclePosition(r: FlightRoute): [number, number] | null {
  const fromHub = hubMap.value.get(r.from)
  const toHub = hubMap.value.get(r.to)
  if (!fromHub || !toHub) return null
  const progress = (r.progress ?? 50) / 100
  const lng = fromHub.lng + (toHub.lng - fromHub.lng) * progress
  const lat = fromHub.lat + (toHub.lat - fromHub.lat) * progress + Math.sin(progress * Math.PI) * 10
  return [lng, lat]
}

function toggleProjection() {
  currentProjection.value = currentProjection.value === 'globe' ? 'mercator' : 'globe'
}
</script>

<template>
  <div
    :class="cn('border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs', props.class)"
    :style="{
      height:
        typeof props.height === 'number'
          ? `${props.height}px`
          : /^\d+$/.test(String(props.height))
            ? `${props.height}px`
            : props.height,
    }"
  >
    <Map variant="dark" :projection="currentProjection" :center="[10, 25]" :zoom="1.6" class="size-full">
      <!-- Great Circle Route Arcs -->
      <MapSource v-if="routesGeoJson" id="flight-routes-source" type="geojson" :data="routesGeoJson">
        <MapLayer id="flight-routes-layer" type="line" :paint="routeLinePaint" />
      </MapSource>

      <!-- Hub Markers -->
      <MapMarker
        v-for="hub in hubs"
        :key="hub.id"
        :lng-lat="[hub.lng, hub.lat]"
        anchor="center"
        class="cursor-pointer select-none"
      >
        <div
          class="relative flex flex-col items-center"
          @mouseenter="hoveredHub = hub"
          @mouseleave="hoveredHub = null"
          @click="emit('hubClick', hub)"
        >
          <span
            class="size-2 rounded-full shadow-xs ring-2"
            :style="{
              backgroundColor: hub.color || 'oklch(0.65 0.20 145)',
              boxShadow: `0 0 8px ${hub.color || 'oklch(0.65 0.20 145)'}`,
            }"
          />
          <span
            v-if="showHubLabels"
            class="border-border/80 bg-background/85 py-0.2 text-foreground mt-1 rounded border px-1 font-mono text-[9px] font-bold shadow-xs backdrop-blur-xs"
          >
            {{ hub.id }}
          </span>
        </div>
      </MapMarker>

      <!-- Aircraft / Cargo Vehicles in Flight -->
      <template v-for="r in routes" :key="`vehicle-${r.id}`">
        <MapMarker
          v-if="getVehiclePosition(r)"
          :lng-lat="getVehiclePosition(r)!"
          anchor="center"
          :class="
            cn(
              'cursor-pointer transition-transform select-none',
              activeRouteId === r.id ? 'z-30 scale-125' : 'z-20 hover:scale-110',
            )
          "
        >
          <div
            class="flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-950/80 px-1.5 py-0.5 shadow-md backdrop-blur-xs"
            @click="selectRoute(r)"
          >
            <Plane class="size-3 rotate-45 text-sky-400" />
            <span class="font-mono text-[9px] font-semibold text-sky-200">
              {{ r.callsign || r.id }}
            </span>
          </div>
        </MapMarker>
      </template>
    </Map>

    <!-- Top-Right Controls -->
    <div
      class="border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md"
    >
      <button
        type="button"
        class="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
        @click="toggleProjection"
      >
        <Globe class="size-3.5" />
        <span class="capitalize">{{ currentProjection }}</span>
      </button>
    </div>

    <!-- Active Flight Route HUD Card -->
    <div
      v-if="activeRoute"
      class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="size-2 animate-pulse rounded-full bg-sky-400" />
            <span class="text-foreground font-mono text-xs font-semibold tracking-wider uppercase">
              {{ activeRoute.callsign || activeRoute.id }}
            </span>
            <span class="py-0.2 rounded bg-sky-500/10 px-1.5 font-mono text-[10px] text-sky-400 capitalize">
              {{ activeRoute.status || 'En-route' }}
            </span>
          </div>
          <div class="text-muted-foreground mt-1 flex items-center gap-2 font-mono text-xs">
            <span>{{ activeRoute.from }}</span>
            <span>→</span>
            <span>{{ activeRoute.to }}</span>
            <span v-if="activeRoute.aircraft" class="text-[10px]">({{ activeRoute.aircraft }})</span>
          </div>
        </div>
        <button type="button" class="text-muted-foreground hover:text-foreground text-xs" @click="activeRouteId = ''">
          ✕
        </button>
      </div>

      <div class="border-border/60 mt-3 grid grid-cols-3 gap-2 border-t pt-2 font-mono text-[11px]">
        <div>
          <span class="text-muted-foreground block text-[9px] uppercase">Speed</span>
          <span class="text-foreground font-semibold">{{ activeRoute.speed || '480 kts' }}</span>
        </div>
        <div>
          <span class="text-muted-foreground block text-[9px] uppercase">Altitude</span>
          <span class="text-foreground font-semibold">{{ activeRoute.altitude || 'FL360' }}</span>
        </div>
        <div>
          <span class="text-muted-foreground block text-[9px] uppercase">ETA</span>
          <span class="text-foreground font-semibold">{{ activeRoute.eta || '02h 15m' }}</span>
        </div>
      </div>
    </div>

    <!-- Hovered Hub HUD -->
    <div
      v-if="hoveredHub"
      class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute right-3 bottom-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150"
    >
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-full" :style="{ backgroundColor: hoveredHub.color || 'oklch(0.65 0.20 145)' }" />
        <h5 class="text-foreground text-xs font-semibold">{{ hoveredHub.name }} ({{ hoveredHub.id }})</h5>
      </div>
      <div v-if="hoveredHub.latency" class="mt-1.5 flex items-baseline justify-between font-mono text-xs">
        <span class="text-muted-foreground">Turnaround</span>
        <span class="text-foreground font-semibold">{{ hoveredHub.latency }}</span>
      </div>
    </div>
  </div>
</template>
