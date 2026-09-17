<script setup lang="ts">
import { computed, ref } from 'vue'
import { Map, MapMarker, MapSource, MapLayer, type MapVariant } from '@/components/ui/map'
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-vue-next'

export interface ChoroplethDatum {
  id: string
  value: number
  name?: string
}

export interface ChoroplethPin {
  name: string
  coord: [number, number]
  color?: string
}

export interface ChoroplethLink {
  from: [number, number]
  to: [number, number]
  label?: string
}

interface Props {
  geoJson: any
  mapName?: string
  data?: ChoroplethDatum[]
  idField?: 'id' | 'name'
  pins?: ChoroplethPin[]
  links?: ChoroplethLink[]
  showScale?: boolean
  height?: number | string
  center?: [number, number]
  zoom?: number
  variant?: MapVariant
  projection?: 'globe' | 'mercator'
  class?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  mapName: 'uipkge-map',
  idField: 'id',
  showScale: true,
  height: 420,
  center: () => [0, 20],
  zoom: 1.5,
  variant: 'dark',
  projection: 'globe',
})

const currentProjection = ref<'globe' | 'mercator'>(props.projection)
const hoveredRegion = ref<{ title: string; value: number | null } | null>(null)

function toggleProjection() {
  currentProjection.value = currentProjection.value === 'globe' ? 'mercator' : 'globe'
}

const dataMap = computed(() => {
  const map = new globalThis.Map<string, number>()
  if (!props.data) return map
  for (const d of props.data) {
    map.set(String(d.id).toLowerCase(), d.value)
    if (d.name) map.set(String(d.name).toLowerCase(), d.value)
  }
  return map
})

const values = computed(() => (props.data ? props.data.map((d) => d.value) : []))
const minValue = computed(() => (values.value.length ? Math.min(...values.value) : 0))
const maxValue = computed(() => (values.value.length ? Math.max(...values.value) : 100))

const enrichedGeoJson = computed(() => {
  if (!props.geoJson || !props.geoJson.features) return props.geoJson
  const features = props.geoJson.features.map((f: any) => {
    const idVal = f.id !== undefined ? String(f.id).toLowerCase() : ''
    const nameVal = f.properties?.name ? String(f.properties.name).toLowerCase() : ''
    const matchedVal = dataMap.value.get(idVal) ?? dataMap.value.get(nameVal) ?? null

    return {
      ...f,
      properties: {
        ...f.properties,
        value: matchedVal,
        title: f.properties?.name || f.id || 'Region',
      },
    }
  })

  return {
    ...props.geoJson,
    features,
  }
})

const fillPaint = computed(() => ({
  'fill-color': [
    'case',
    ['!=', ['get', 'value'], null],
    [
      'interpolate',
      ['linear'],
      ['get', 'value'],
      minValue.value,
      'rgba(56, 189, 248, 0.25)',
      maxValue.value,
      'rgba(56, 189, 248, 0.9)',
    ],
    'rgba(255, 255, 255, 0.04)',
  ],
  'fill-opacity': 0.85,
}))

const strokePaint = {
  'line-color': 'rgba(255, 255, 255, 0.25)',
  'line-width': 1,
}

const linksGeoJson = computed(() => {
  if (!props.links || !props.links.length) return null
  return {
    type: 'FeatureCollection',
    features: props.links.map((link) => ({
      type: 'Feature',
      properties: { label: link.label },
      geometry: {
        type: 'LineString',
        coordinates: [link.from, link.to],
      },
    })),
  }
})

const linkLinePaint = {
  'line-color': 'rgba(245, 158, 11, 0.75)',
  'line-width': 2,
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
    <Map :variant="variant" :projection="currentProjection" :center="center" :zoom="zoom" class="size-full">
      <!-- GeoJSON Choropleth Source & Layers -->
      <MapSource id="choropleth-source" type="geojson" :data="enrichedGeoJson">
        <MapLayer id="choropleth-fill" type="fill" :paint="fillPaint" />
        <MapLayer id="choropleth-stroke" type="line" :paint="strokePaint" />
      </MapSource>

      <!-- Links Layer -->
      <MapSource v-if="linksGeoJson" id="choropleth-links-source" type="geojson" :data="linksGeoJson">
        <MapLayer id="choropleth-links" type="line" :paint="linkLinePaint" />
      </MapSource>

      <!-- Point Pins -->
      <MapMarker v-for="(pin, i) in pins || []" :key="i" :lng-lat="pin.coord" anchor="bottom">
        <div class="flex flex-col items-center">
          <span
            class="size-3 rounded-full shadow-md ring-4"
            :style="{
              backgroundColor: pin.color || 'oklch(0.65 0.20 145)',
              boxShadow: `0 0 10px ${pin.color || 'oklch(0.65 0.20 145)'}`,
            }"
          />
          <span
            class="border-border/80 bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs backdrop-blur-xs"
          >
            {{ pin.name }}
          </span>
        </div>
      </MapMarker>
    </Map>

    <!-- Top-Right Projection Switcher -->
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

    <!-- Bottom-Right Continuous Value Scale Legend -->
    <div
      v-if="showScale && values.length > 0"
      class="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-2.5 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex"
    >
      <span class="text-muted-foreground font-mono text-[11px]">Range</span>
      <span class="text-muted-foreground font-mono text-[10px]">{{ minValue }}</span>
      <div class="h-2 w-24 rounded-full bg-gradient-to-r from-sky-400/30 to-sky-400" />
      <span class="text-foreground font-mono text-[10px] font-semibold">{{ maxValue }}</span>
    </div>
  </div>
</template>
