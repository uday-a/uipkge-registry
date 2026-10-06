<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  // Module-script imports are visible to the instance script; importing the
  // value here (instead of `import type` + a second instance import) avoids a
  // duplicate-identifier error — both scripts share one scope.
  import mapboxgl from 'mapbox-gl'
  import type { MapVariant, MapVariants } from './map.variants'

  export type MapControlPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

  export interface MapProps extends HTMLAttributes<HTMLDivElement> {
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
    /** Placement position of the navigation control. */
    navigationPosition?: MapControlPosition
    /** Explicitly show/hide compass in navigation control. Defaults to true when pitch > 0. */
    showCompass?: boolean
    /** Explicitly show/hide zoom buttons in navigation control. Defaults to true. */
    showZoom?: boolean
    /** Show the HTML5 fullscreen toggle control button. */
    fullscreen?: boolean
    /** Placement position of the fullscreen control. Defaults to 'top-right'. */
    fullscreenPosition?: MapControlPosition
    /** Repaint the basemap to a quiet, desaturated canvas. */
    muted?: boolean
    /** Fires with the raw mapbox-gl `Map` once the style is ready. */
    oncreated?: (map: mapboxgl.Map) => void
    children?: Snippet
    ref?: HTMLDivElement | null
  }

  /** Handle returned by `bind:this` on <Map> — mirrors react-map-gl's MapRef.
   *  Carries the camera helpers plus `getMap()` for the raw mapbox-gl Map. */
  export interface MapRef {
    getMap: () => mapboxgl.Map | null
    flyTo: (...args: Parameters<mapboxgl.Map['flyTo']>) => void
    easeTo: (...args: Parameters<mapboxgl.Map['easeTo']>) => void
    jumpTo: (...args: Parameters<mapboxgl.Map['jumpTo']>) => void
    fitBounds: (...args: Parameters<mapboxgl.Map['fitBounds']>) => void
    resize: () => void
  }
</script>

<script lang="ts">
  /**
   * Map — a thin, theme-aware Mapbox GL JS wrapper. Pass an `accessToken`;
   * drop `<MapMarker>` / `<MapPopup>` / `<MapSource>` / `<MapLayer>` into the
   * children to build any kind of map.
   *
   * Requires a Mapbox access token (https://account.mapbox.com).
   */
  import { onDestroy, onMount } from 'svelte'
  import { cn } from '$lib/utils'
  import { setMapContext } from './map-context.svelte'
  import { mapVariants, MAPBOX_STYLES } from './map.variants'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import './map.css'

  const DEFAULT_MAPBOX_TOKEN = ''

  function envToken(): string {
    return (
      (typeof process !== 'undefined' &&
        (process.env?.NEXT_PUBLIC_MAPBOX_TOKEN || process.env?.PUBLIC_MAPBOX_TOKEN)) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_MAPBOX_TOKEN) ||
      DEFAULT_MAPBOX_TOKEN
    )
  }

  let {
    accessToken = envToken(),
    variant = 'default',
    size,
    mapStyle,
    center = [0, 20],
    zoom = 1.4,
    pitch = 0,
    bearing = 0,
    buildings3d = false,
    terrain3d = false,
    projection = 'mercator',
    navigation = true,
    navigationPosition = 'bottom-right',
    showCompass,
    showZoom = true,
    fullscreen = false,
    fullscreenPosition = 'top-right',
    muted = false,
    oncreated,
    children,
    ref = $bindable(null),
    class: className,
    ...restProps
  }: MapProps = $props()

  const resolvedToken = $derived.by(() => {
    // Explicit empty string opts out of the demo fallback — used by "missing token" stories.
    if (accessToken === '') return ''
    return accessToken || envToken()
  })

  let htmlDark = $state(false)
  const isDark = () => htmlDark

  const isMuted = $derived(muted || variant === 'muted')

  const resolvedStyle = $derived.by(() => {
    if (mapStyle) return mapStyle
    if (
      variant &&
      variant !== 'default' &&
      variant !== 'muted' &&
      MAPBOX_STYLES[variant as keyof typeof MAPBOX_STYLES]
    ) {
      return MAPBOX_STYLES[variant as keyof typeof MAPBOX_STYLES]
    }
    return htmlDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11'
  })

  // Render the map only on the client — Mapbox needs the DOM, and rendering it
  // on the server would hydrate-mismatch. The bg-muted box is the SSR placeholder.
  let mounted = $state(false)
  let inView = $state(false)
  let mapEl = $state<HTMLDivElement | null>(null)
  let mapInstance = $state<mapboxgl.Map | null>(null)
  let lastStyle: string | null = null
  let resizeObserver: ResizeObserver | null = null
  let intersectionObserver: IntersectionObserver | null = null
  let themeObserver: MutationObserver | null = null

  // Published to MapMarker / MapPopup / MapSource / MapLayer children.
  setMapContext({
    get map() {
      return mapInstance
    },
  })

  onMount(() => {
    const root = document.documentElement
    const syncTheme = () => {
      htmlDark = root.classList.contains('dark')
    }
    syncTheme()
    themeObserver = new MutationObserver(syncTheme)
    themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
    mounted = true
    if (!ref) {
      inView = true
      return
    }
    if (typeof IntersectionObserver !== 'undefined') {
      // Latch: the observer only defers the first paint. Un-setting it on scroll
      // would tear the WebGL map down and rebuild it (fresh style fetch, camera
      // reset, markers re-laid-out against a stale canvas size) every time the
      // block leaves the viewport.
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry!.isIntersecting) return
          inView = true
          intersectionObserver?.disconnect()
          intersectionObserver = null
        },
        { rootMargin: '160px', threshold: 0.01 },
      )
      intersectionObserver.observe(ref)
    } else {
      inView = true
    }
    if (typeof ResizeObserver !== 'undefined' && ref) {
      const container = ref
      resizeObserver = new ResizeObserver(() => {
        mapInstance?.resize()
      })
      resizeObserver.observe(container)
    }
  })

  onDestroy(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
    intersectionObserver?.disconnect()
    intersectionObserver = null
    themeObserver?.disconnect()
    themeObserver = null
    try {
      mapInstance?.remove()
    } catch {
      /* already destroyed */
    }
    mapInstance = null
  })

  /** Desaturate the basemap to a quiet canvas. Each op is guarded — style layer
   *  ids drift between style versions and the wrong property for a layer type
   *  throws. */
  function applyMuted() {
    const map = mapInstance
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
    const map = mapInstance
    if (!map || !buildings3d) return
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
    const map = mapInstance
    if (!map || !terrain3d) return
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
    const map = mapInstance
    if (!map) return
    if (navControl) {
      try {
        map.removeControl(navControl)
      } catch {
        /* ignore */
      }
      navControl = null
    }
    if (navigation) {
      const compass = showCompass !== undefined ? showCompass : pitch > 0
      navControl = new mapboxgl.NavigationControl({ showCompass: compass, showZoom })
      map.addControl(navControl, navigationPosition ?? 'bottom-right')
    }
  }

  function updateFullscreenControl() {
    const map = mapInstance
    if (!map) return
    if (fullscreenControl) {
      try {
        map.removeControl(fullscreenControl)
      } catch {
        /* ignore */
      }
      fullscreenControl = null
    }
    if (fullscreen) {
      fullscreenControl = new mapboxgl.FullscreenControl()
      map.addControl(fullscreenControl, fullscreenPosition ?? 'top-right')
    }
  }

  function createMap() {
    const el = mapEl
    const token = resolvedToken
    if (!el || !token || mapInstance) return
    const map = new mapboxgl.Map({
      container: el,
      accessToken: token,
      style: resolvedStyle,
      center,
      zoom,
      attributionControl: false,
    })
    mapInstance = map
    lastStyle = resolvedStyle
    // The ResizeObserver's first callback runs before this instance exists, so a
    // container that settled its height during mount would leave the canvas --
    // and every marker laid out against it -- at the stale size.
    map.resize()
    try {
      ;(map as any).setProjection(projection)
    } catch {
      /* older api */
    }
    if (pitch) {
      try {
        map.setPitch(pitch)
      } catch {
        /* ignore */
      }
    }
    if (bearing) {
      try {
        map.setBearing(bearing)
      } catch {
        /* ignore */
      }
    }

    updateNavControl()
    updateFullscreenControl()

    const ready = () => {
      if (isMuted) applyMuted()
      if (buildings3d) apply3DBuildings()
      if (terrain3d) apply3DTerrain()
      oncreated?.(map)
    }
    if (map.isStyleLoaded()) ready()
    else map.once('load', ready)
    map.on('style.load', () => {
      if (isMuted) applyMuted()
      if (buildings3d) apply3DBuildings()
      if (terrain3d) apply3DTerrain()
    })
  }

  $effect(() => {
    if (mounted && inView && resolvedToken && mapEl && !mapInstance) createMap()
  })

  // Re-style on variant / theme / mapStyle changes (skip the initial run —
  // createMap already applied it).
  $effect(() => {
    const style = resolvedStyle
    if (mapInstance && style !== lastStyle) {
      lastStyle = style
      try {
        mapInstance.setStyle(style)
      } catch {
        /* style still configuring */
      }
    }
  })

  $effect(() => {
    if (mapInstance && pitch !== undefined) mapInstance.setPitch(pitch)
  })

  $effect(() => {
    if (mapInstance && bearing !== undefined) mapInstance.setBearing(bearing)
  })

  $effect(() => {
    void [navigation, navigationPosition, showCompass, showZoom]
    updateNavControl()
  })

  $effect(() => {
    void [fullscreen, fullscreenPosition]
    updateFullscreenControl()
  })

  // `bind:this` on <Map> hands back the mapbox-gl Map itself, plus the camera
  // helpers blocks reach for directly off the ref.
  /** The underlying mapbox-gl Map, or null until it is created. */
  export function getMap() {
    return mapInstance
  }
  // Option types are read off the Map class so they track mapbox-gl's own
  // signatures instead of drifting against renamed exports.
  export function flyTo(...args: Parameters<mapboxgl.Map['flyTo']>) {
    mapInstance?.flyTo(...args)
  }
  export function easeTo(...args: Parameters<mapboxgl.Map['easeTo']>) {
    mapInstance?.easeTo(...args)
  }
  export function jumpTo(...args: Parameters<mapboxgl.Map['jumpTo']>) {
    mapInstance?.jumpTo(...args)
  }
  export function fitBounds(...args: Parameters<mapboxgl.Map['fitBounds']>) {
    mapInstance?.fitBounds(...args)
  }
  export function resize() {
    mapInstance?.resize()
  }
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="map"
  data-variant={variant}
  data-muted={isMuted}
  class={cn(mapVariants({ variant, ...(size ? { size } : {}) }), className)}
  {...restProps}
>
  {#if mounted && inView && resolvedToken}
    <div bind:this={mapEl} class="size-full"></div>
    {@render children?.()}
  {:else if mounted && !resolvedToken}
    <div
      class="text-muted-foreground flex size-full flex-col items-center justify-center gap-1 px-6 text-center text-sm"
    >
      <span class="text-foreground font-medium">Mapbox token required</span>
      <span>Pass an access token to render the map.</span>
    </div>
  {/if}
</div>
