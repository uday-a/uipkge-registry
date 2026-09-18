<script setup lang="ts">
/**
 * Map — a thin, theme-aware wrapper around @studiometa/vue-mapbox-gl's
 * MapboxMap. Pass an `access-token`; drop `<MapMarker>` / `<MapPopup>` /
 * `<MapLayer>` (re-exported from this package) or any @studiometa child into
 * the default slot to build any kind of map.
 *
 * Supports all official Mapbox variants via `variant`:
 * - `streets`: Mapbox Streets v12 navigation & POI basemap
 * - `outdoors`: Mapbox Outdoors v12 topographic & hiking contours
 * - `light`: Mapbox Light v11 monochromatic
 * - `dark`: Mapbox Dark v11 monochromatic
 * - `satellite`: Mapbox Satellite v9 high-res aerial photography
 * - `satellite-streets`: Mapbox Satellite Streets v12 hybrid satellite + street labels
 * - `navigation-day`: Turn-by-turn navigation day palette
 * - `navigation-night`: Turn-by-turn navigation dark HUD palette
 * - `standard`: Mapbox Standard with dynamic 3D lighting & landmark models
 * - `muted`: Desaturated theme-aware minimal canvas for data dashboards
 * - `default`: Theme-aware light/dark basemap
 *
 * Additional 3D features:
 * - `pitch`: Camera tilt angle (0 - 85 degrees)
 * - `bearing`: Camera rotation angle (0 - 360 degrees)
 * - `buildings3d`: Adds 3D extruded building footprint layer
 * - `terrain3d`: Enables 3D digital elevation model (DEM) terrain
 *
 * Requires a Mapbox access token (https://account.mapbox.com).
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import { cn } from '@/lib/utils'
import { mapVariants, MAPBOX_STYLES, type MapVariant, type MapVariants } from './map.variants'
import 'mapbox-gl/dist/mapbox-gl.css'
import './map.css'

const DEFAULT_MAPBOX_TOKEN = ''

const props = withDefaults(
  defineProps<{
    /** Mapbox access token. */
    accessToken?: string
    /** Named Mapbox basemap variant preset ('streets' | 'outdoors' | 'satellite' | 'satellite-streets' | 'light' | 'dark' | 'navigation-day' | 'navigation-night' | 'standard' | 'muted' | 'default'). */
    variant?: MapVariant
    /** Height preset. Omit to size via `class` (blocks typically pass `size-full`). */
    size?: MapVariants['size']
    /** Override the base style. Defaults to variant or theme-aware light/dark style. */
    mapStyle?: string
    /** Initial [lng, lat]. */
    center?: [number, number]
    zoom?: number
    /** Camera pitch tilt angle in degrees (0 - 85). */
    pitch?: number
    /** Camera bearing rotation angle in degrees (0 - 360). */
    bearing?: number
    /** Automatically add 3D extruded building footprints. */
    buildings3d?: boolean
    /** Enable 3D digital elevation model terrain mesh. */
    terrain3d?: boolean
    /** 'mercator' (flat) or 'globe'. */
    projection?: string
    /** Show the zoom/compass control. */
    navigation?: boolean
    /** Placement position of the navigation control ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right'). */
    navigationPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    /** Explicitly show/hide compass in navigation control. Defaults to true when pitch > 0. */
    showCompass?: boolean
    /** Explicitly show/hide zoom buttons in navigation control. Defaults to true. */
    showZoom?: boolean
    /** Show the HTML5 fullscreen toggle control button. */
    fullscreen?: boolean
    /** Placement position of the fullscreen control ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right'). Defaults to 'top-right'. */
    fullscreenPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    /** Repaint the basemap to a quiet, desaturated canvas. */
    muted?: boolean
    class?: string
  }>(),
  {
    accessToken: () =>
      (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_MAPBOX_TOKEN || process.env?.PUBLIC_MAPBOX_TOKEN)) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_MAPBOX_TOKEN) ||
      DEFAULT_MAPBOX_TOKEN,
    variant: 'default',
    mapStyle: undefined,
    center: () => [0, 20],
    zoom: 1.4,
    pitch: 0,
    bearing: 0,
    buildings3d: false,
    terrain3d: false,
    projection: 'mercator',
    navigation: true,
    navigationPosition: 'bottom-right',
    showCompass: undefined,
    showZoom: true,
    fullscreen: false,
    fullscreenPosition: 'top-right',
    muted: false,
  },
)

const resolvedToken = computed(() => {
  // Explicit empty string opts out of the demo fallback — used by "missing token" stories.
  if (props.accessToken === '') return ''
  return (
    props.accessToken ||
    (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_MAPBOX_TOKEN || process.env?.PUBLIC_MAPBOX_TOKEN)) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_MAPBOX_TOKEN) ||
    DEFAULT_MAPBOX_TOKEN
  )
})

const emit = defineEmits<{ (e: 'created', map: mapboxgl.Map): void }>()

const htmlDark = ref(false)
const isDark = () => htmlDark.value

const isMuted = computed(() => props.muted || props.variant === 'muted')

const resolvedStyle = computed(() => {
  if (props.mapStyle) return props.mapStyle
  if (
    props.variant &&
    props.variant !== 'default' &&
    props.variant !== 'muted' &&
    MAPBOX_STYLES[props.variant as keyof typeof MAPBOX_STYLES]
  ) {
    return MAPBOX_STYLES[props.variant as keyof typeof MAPBOX_STYLES]
  }
  return htmlDark.value ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11'
})

// Render the map only on the client — Mapbox needs the DOM, and rendering it on
// the server would hydrate-mismatch. The bg-muted box is the SSR placeholder.
const mounted = ref(false)
const inView = ref(false)
const containerRef = ref<HTMLDivElement | null>(null)
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let themeObserver: MutationObserver | null = null

onMounted(() => {
  const root = document.documentElement
  const syncTheme = () => {
    htmlDark.value = root.classList.contains('dark')
  }
  syncTheme()
  themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
  mounted.value = true
  if (!containerRef.value) {
    inView.value = true
    return
  }
  if (typeof IntersectionObserver !== 'undefined') {
    // Latch: the observer only defers the first paint. Un-setting it on scroll
    // would tear the WebGL map down and rebuild it (fresh style fetch, camera
    // reset, markers re-laid-out against a stale canvas size) every time the
    // block leaves the viewport.
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        inView.value = true
        intersectionObserver?.disconnect()
        intersectionObserver = null
      },
      { rootMargin: '160px', threshold: 0.01 },
    )
    intersectionObserver.observe(containerRef.value)
  } else {
    inView.value = true
  }
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      map?.resize()
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  intersectionObserver?.disconnect()
  intersectionObserver = null
  themeObserver?.disconnect()
  themeObserver = null
})

let map: mapboxgl.Map | null = null

/** Desaturate the basemap to a quiet canvas. Each op is guarded — style layer
 *  ids drift between style versions and the wrong property for a layer type
 *  throws. */
function applyMuted() {
  if (!map) return
  let styleLayers: any[]
  try {
    styleLayers = map.getStyle()?.layers ?? []
  } catch {
    return // style not loaded yet
  }
  const dark = isDark()
  const P = dark
    ? {
        land: 'rgb(24,24,27)',
        water: 'rgb(39,39,42)',
        use: 'rgb(30,30,34)',
        road: 'rgb(45,46,52)',
        label: 'rgb(161,161,170)',
        halo: 'rgb(24,24,27)',
        admin: 'rgb(50,52,60)',
      }
    : {
        land: 'rgb(246,247,249)',
        water: 'rgb(226,230,235)',
        use: 'rgb(238,240,243)',
        road: 'rgb(221,224,229)',
        label: 'rgb(120,124,134)',
        halo: 'rgb(246,247,249)',
        admin: 'rgb(213,216,221)',
      }
  for (const l of styleLayers) {
    const id = l.id
    try {
      if (id === 'background' || id === 'land') map.setPaintProperty(id, 'background-color', P.land)
      else if (/water/.test(id) && l.type === 'fill') map.setPaintProperty(id, 'fill-color', P.water)
      else if (/landuse|landcover|national-park/.test(id) && l.type === 'fill')
        map.setPaintProperty(id, 'fill-color', P.use)
      else if (/^road-(motorway|trunk|primary)/.test(id) && l.type === 'line') {
        map.setPaintProperty(id, 'line-color', P.road)
        map.setPaintProperty(id, 'line-opacity', 0.55)
      } else if (/^road-(secondary|tertiary|street|minor|service|path|pedestrian)/.test(id)) {
        map.setLayoutProperty(id, 'visibility', 'none')
      } else if (/poi|transit|airport|natural-point|water-point|waterway-label|building/.test(id)) {
        map.setLayoutProperty(id, 'visibility', 'none')
      } else if (
        /road-label|settlement-major-label|settlement-minor-label|state-label/.test(id) &&
        l.type === 'symbol'
      ) {
        map.setPaintProperty(id, 'text-color', P.label)
        map.setPaintProperty(id, 'text-halo-color', P.halo)
        map.setPaintProperty(id, 'text-opacity', 0.6)
      } else if (id === 'admin-1-boundary' && l.type === 'line') {
        map.setPaintProperty(id, 'line-color', P.admin)
        map.setPaintProperty(id, 'line-opacity', 0.6)
      } else if (id === 'admin-1-boundary-bg') map.setPaintProperty(id, 'line-opacity', 0)
    } catch {
      /* skip */
    }
  }
}

function apply3DBuildings() {
  if (!map || !props.buildings3d) return
  if (map.getLayer('3d-buildings')) return

  const layers = map.getStyle()?.layers
  let labelLayerId: string | undefined
  if (layers) {
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && (layers[i].layout as any)?.['text-field']) {
        labelLayerId = layers[i].id
        break
      }
    }
  }

  try {
    map.addLayer(
      {
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 14,
        paint: {
          'fill-extrusion-color': isDark() ? '#27272a' : '#d4d4d8',
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.05, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.05, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.8,
        },
      },
      labelLayerId,
    )
  } catch {
    /* building layer not present in raster styles */
  }
}

function apply3DTerrain() {
  if (!map || !props.terrain3d) return
  try {
    if (!map.getSource('mapbox-dem')) {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })
    }
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
  } catch {
    /* terrain not supported in current projection */
  }
}

let navControl: mapboxgl.NavigationControl | null = null
let fullscreenControl: mapboxgl.FullscreenControl | null = null

function updateNavControl() {
  if (!map) return
  if (navControl) {
    try {
      map.removeControl(navControl)
    } catch {
      /* ignore */
    }
    navControl = null
  }
  if (props.navigation) {
    const showCompass = props.showCompass !== undefined ? props.showCompass : (props.pitch ?? 0) > 0
    const showZoom = props.showZoom ?? true
    navControl = new mapboxgl.NavigationControl({ showCompass, showZoom })
    map.addControl(navControl, props.navigationPosition ?? 'bottom-right')
  }
}

function updateFullscreenControl() {
  if (!map) return
  if (fullscreenControl) {
    try {
      map.removeControl(fullscreenControl)
    } catch {
      /* ignore */
    }
    fullscreenControl = null
  }
  if (props.fullscreen) {
    fullscreenControl = new mapboxgl.FullscreenControl()
    map.addControl(fullscreenControl, props.fullscreenPosition ?? 'top-right')
  }
}

function onCreated(instance: mapboxgl.Map) {
  map = instance
  // The ResizeObserver's first callback runs before this instance exists, so a
  // container that settled its height during mount would leave the canvas --
  // and every marker laid out against it -- at the stale size.
  map.resize()
  try {
    ;(map as any).setProjection(props.projection)
  } catch {
    /* older api */
  }
  if (props.pitch) {
    try {
      map.setPitch(props.pitch)
    } catch {
      /* ignore */
    }
  }
  if (props.bearing) {
    try {
      map.setBearing(props.bearing)
    } catch {
      /* ignore */
    }
  }

  updateNavControl()
  updateFullscreenControl()

  const ready = () => {
    if (isMuted.value) applyMuted()
    if (props.buildings3d) apply3DBuildings()
    if (props.terrain3d) apply3DTerrain()
    emit('created', map!)
  }
  if (map.isStyleLoaded()) ready()
  else map.once('load', ready)
  map.on('style.load', () => {
    if (isMuted.value) applyMuted()
    if (props.buildings3d) apply3DBuildings()
    if (props.terrain3d) apply3DTerrain()
  })
}

// <script setup> components are closed by default, so a template ref on <Map>
// would hand back an instance with nothing on it. react-map-gl's ref exposes
// the map's own methods, so mirror that: expose the mapbox-gl Map itself, plus
// the camera helpers blocks reach for directly off the ref.
defineExpose({
  /** The underlying mapbox-gl Map, or null until it is created. */
  get map() {
    return map
  },
  getMap: () => map,
  // Option types are read off the Map class so they track mapbox-gl's own
  // signatures instead of drifting against renamed exports.
  flyTo: (...args: Parameters<mapboxgl.Map['flyTo']>) => map?.flyTo(...args),
  easeTo: (...args: Parameters<mapboxgl.Map['easeTo']>) => map?.easeTo(...args),
  jumpTo: (...args: Parameters<mapboxgl.Map['jumpTo']>) => map?.jumpTo(...args),
  fitBounds: (...args: Parameters<mapboxgl.Map['fitBounds']>) => map?.fitBounds(...args),
  resize: () => map?.resize(),
})

watch(
  () => props.pitch,
  (newPitch) => {
    if (map && newPitch !== undefined) {
      map.setPitch(newPitch)
    }
  },
)

watch(
  () => props.bearing,
  (newBearing) => {
    if (map && newBearing !== undefined) {
      map.setBearing(newBearing)
    }
  },
)

watch(
  () => [props.navigation, props.navigationPosition, props.showCompass, props.showZoom],
  () => {
    updateNavControl()
  },
)

watch(
  () => [props.fullscreen, props.fullscreenPosition],
  () => {
    updateFullscreenControl()
  },
)
</script>

<template>
  <div
    ref="containerRef"
    data-uipkge
    data-slot="map"
    :data-variant="variant"
    :data-muted="isMuted"
    :class="cn(mapVariants({ variant, ...(size ? { size } : {}) }), props.class)"
  >
    <MapboxMap
      v-if="mounted && inView && resolvedToken"
      class="size-full"
      :access-token="resolvedToken"
      :map-style="resolvedStyle"
      :center="center"
      :zoom="zoom"
      :attribution-control="false"
      @mb-created="onCreated"
    >
      <slot />
    </MapboxMap>
    <div
      v-else-if="mounted && !resolvedToken"
      class="text-muted-foreground flex size-full flex-col items-center justify-center gap-1 px-6 text-center text-sm"
    >
      <span class="text-foreground font-medium">Mapbox token required</span>
      <span>Pass an access token to render the map.</span>
    </div>
  </div>
</template>
