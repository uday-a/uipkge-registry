<script lang="ts">
import type { HTMLAttributes } from 'vue'

export interface MapRegion {
  id: string
  name: string
  path?: string
}

export interface MapPin {
  id?: string
  lat?: number
  lng?: number
  x?: number
  y?: number
  label?: string
  value?: string | number
  color?: string
  status?: string
  description?: string
}

export interface FlowRoute {
  id?: string
  from: { lat?: number; lng?: number; x?: number; y?: number }
  to: { lat?: number; lng?: number; x?: number; y?: number }
  color?: string
  width?: number
  curvature?: number
  animated?: boolean
  dashed?: boolean
  duration?: number
  label?: string
}

export interface RegionDataRecord {
  value?: number
  label?: string
  status?: string
  color?: string
  description?: string
}

export interface VectorMapProps {
  mode?: 'countries' | 'continents'
  regions?: MapRegion[]
  regionData?: Record<string, RegionDataRecord>
  selectedRegion?: string
  pins?: MapPin[]
  routes?: FlowRoute[]
  height?: number | string
  interactive?: boolean
  showGraticule?: boolean
  showRegionLabels?: boolean
  fillColor?: string
  hoverColor?: string
  strokeColor?: string
  class?: HTMLAttributes['class']
  ariaLabel?: string
  projection?: 'globe' | 'mercator'
}

export const WORLD_REGIONS: MapRegion[] = [
  { id: 'northAmerica', name: 'North America' },
  { id: 'southAmerica', name: 'South America' },
  { id: 'europe', name: 'Europe' },
  { id: 'asia', name: 'Asia' },
  { id: 'africa', name: 'Africa' },
  { id: 'australiaOceania', name: 'Oceania' },
  { id: 'unitedKingdom', name: 'United Kingdom' },
  { id: 'japan', name: 'Japan' },
]

export const WORLD_COUNTRIES: MapRegion[] = [
  { id: 'US', name: 'United States' },
  { id: 'CA', name: 'Canada' },
  { id: 'GB', name: 'United Kingdom' },
  { id: 'DE', name: 'Germany' },
  { id: 'FR', name: 'France' },
  { id: 'JP', name: 'Japan' },
  { id: 'CN', name: 'China' },
  { id: 'IN', name: 'India' },
  { id: 'BR', name: 'Brazil' },
  { id: 'AU', name: 'Australia' },
]

export function projectPoint(pt: { lat?: number; lng?: number; x?: number; y?: number }) {
  if (pt.x !== undefined && pt.y !== undefined) return { x: pt.x, y: pt.y }
  const lng = pt.lng ?? 0
  const lat = pt.lat ?? 0
  const x = ((lng + 180) / 360) * 1000
  const y = ((90 - lat) / 180) * 500
  return { x, y }
}

const REGION_CENTROIDS: Record<string, [number, number]> = {
  northAmerica: [-100, 45],
  southAmerica: [-60, -15],
  europe: [15, 52],
  asia: [100, 40],
  africa: [20, 5],
  australiaOceania: [135, -25],
  unitedKingdom: [-2, 54],
  japan: [138, 38],
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Map, MapMarker, MapSource, MapLayer, type MapVariant } from '@/components/ui/map'
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-vue-next'

const props = withDefaults(defineProps<VectorMapProps>(), {
  mode: 'continents',
  regions: () => WORLD_REGIONS,
  regionData: () => ({}),
  selectedRegion: undefined,
  pins: () => [],
  routes: () => [],
  height: 460,
  interactive: true,
  projection: 'globe',
})

const emit = defineEmits<{
  (e: 'update:selectedRegion', id: string): void
  (e: 'selectRegion', id: string): void
  (e: 'selectPin', pin: MapPin): void
}>()

const activeRegion = ref(props.selectedRegion || 'northAmerica')
const currentProjection = ref<'globe' | 'mercator'>(props.projection)
const hoveredPin = ref<MapPin | null>(null)

watch(
  () => props.selectedRegion,
  (newVal) => {
    if (newVal !== undefined) activeRegion.value = newVal
  },
)

const activeRecord = computed(() => {
  return props.regionData[activeRegion.value] || null
})

function selectRegion(id: string) {
  if (!props.interactive) return
  activeRegion.value = id
  emit('update:selectedRegion', id)
  emit('selectRegion', id)
}

function toggleProjection() {
  currentProjection.value = currentProjection.value === 'globe' ? 'mercator' : 'globe'
}

const routesGeoJson = computed(() => {
  if (!props.routes || !props.routes.length) return null
  return {
    type: 'FeatureCollection',
    features: props.routes.map((r, i) => {
      const fromLng = r.from.lng ?? -74
      const fromLat = r.from.lat ?? 40
      const toLng = r.to.lng ?? 8
      const toLat = r.to.lat ?? 50
      return {
        type: 'Feature',
        id: i,
        properties: {
          color: r.color || 'rgba(56, 189, 248, 0.75)',
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [fromLng, fromLat],
            [(fromLng + toLng) / 2, (fromLat + toLat) / 2 + 5],
            [toLng, toLat],
          ],
        },
      }
    }),
  }
})

const routeLinePaint = {
  'line-color': ['get', 'color'],
  'line-width': 1.5,
  'line-dasharray': [2, 2],
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
      <!-- Flow Routes Layer -->
      <MapSource v-if="routesGeoJson" id="vector-routes-source" type="geojson" :data="routesGeoJson">
        <MapLayer id="vector-routes-layer" type="line" :paint="routeLinePaint" />
      </MapSource>

      <!-- Pins Layer -->
      <MapMarker
        v-for="(pin, i) in pins"
        :key="i"
        :lng-lat="[pin.lng ?? 0, pin.lat ?? 0]"
        anchor="center"
        class="cursor-pointer select-none"
      >
        <div
          class="relative flex size-6 items-center justify-center"
          @mouseenter="hoveredPin = pin"
          @mouseleave="hoveredPin = null"
          @click="emit('selectPin', pin)"
        >
          <span
            class="absolute inline-flex size-full animate-ping rounded-full opacity-60"
            :style="{ backgroundColor: pin.color || 'oklch(0.65 0.20 145)' }"
          />
          <span
            class="ring-background relative inline-flex size-2.5 rounded-full shadow-xs ring-2"
            :style="{
              backgroundColor: pin.color || 'oklch(0.65 0.20 145)',
              boxShadow: `0 0 10px ${pin.color || 'oklch(0.65 0.20 145)'}`,
            }"
          />
        </div>
      </MapMarker>
    </Map>

    <!-- Top-Left Region Selector Chips -->
    <div
      class="border-border/70 bg-card/85 absolute top-3 left-3 z-10 hidden max-w-md flex-wrap gap-1 rounded-lg border p-1.5 shadow-xs backdrop-blur-md md:flex"
    >
      <button
        v-for="r in regions"
        :key="r.id"
        type="button"
        :class="
          cn(
            'rounded-md px-2 py-0.5 text-xs font-medium transition',
            activeRegion === r.id
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )
        "
        @click="selectRegion(r.id)"
      >
        {{ r.name }}
      </button>
    </div>

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

    <!-- Bottom-Left Region Detail Card -->
    <div
      v-if="activeRecord"
      class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150"
    >
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-full" :style="{ backgroundColor: activeRecord.color || 'oklch(0.65 0.20 145)' }" />
        <h4 class="text-foreground text-sm font-semibold capitalize">
          {{ activeRegion.replace(/([A-Z])/g, ' $1') }}
        </h4>
        <span class="text-muted-foreground ml-auto font-mono text-xs uppercase">
          {{ activeRecord.status || 'Optimal' }}
        </span>
      </div>

      <div
        v-if="activeRecord.value !== undefined"
        class="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs"
      >
        <span class="text-muted-foreground">Active Nodes</span>
        <span class="text-foreground font-semibold">
          {{ activeRecord.value.toLocaleString() }}
        </span>
      </div>

      <p v-if="activeRecord.description" class="text-muted-foreground mt-1.5 text-xs leading-relaxed">
        {{ activeRecord.description }}
      </p>
    </div>

    <!-- Hovered Pin HUD -->
    <div
      v-if="hoveredPin"
      class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute right-3 bottom-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150"
    >
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-full" :style="{ backgroundColor: hoveredPin.color || 'oklch(0.65 0.20 145)' }" />
        <h5 class="text-foreground text-xs font-semibold">
          {{ hoveredPin.label || 'Hub' }}
        </h5>
      </div>
      <p v-if="hoveredPin.description" class="text-muted-foreground mt-1 text-xs">
        {{ hoveredPin.description }}
      </p>
      <div
        v-if="hoveredPin.value !== undefined"
        class="border-border/60 mt-2 flex items-baseline justify-between border-t pt-1.5 font-mono text-xs"
      >
        <span class="text-muted-foreground">Throughput</span>
        <span class="text-foreground font-semibold">{{ hoveredPin.value }}</span>
      </div>
    </div>
  </div>
</template>
