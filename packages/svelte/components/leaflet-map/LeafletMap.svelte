<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type * as L from 'leaflet'
  import type { LeafletMapVariant, LeafletMapVariants } from './leaflet-map.variants'
  import type { LeafletPosition } from './leaflet-context.svelte'

  export interface LeafletMapProps extends HTMLAttributes<HTMLDivElement> {
    /** Named raster basemap preset ('streets' | 'outdoors' | 'satellite' | 'satellite-streets' | 'light' | 'dark' | 'navigation-day' | 'navigation-night' | 'standard' | 'muted' | 'default'). */
    variant?: LeafletMapVariant
    /** Height preset. Omit to size via `class` (blocks typically pass `size-full`). */
    size?: LeafletMapVariants['size']
    /** Custom raster tile URL template — overrides `variant`. */
    tileUrl?: string
    /** Attribution HTML for a custom `tileUrl`. Defaults to the OpenStreetMap credit. */
    tileAttribution?: string
    /** Tile subdomains for a custom `tileUrl` ('abcd' or ['a','b']). */
    tileSubdomains?: string | string[]
    /** Initial [lng, lat] — Mapbox order, matching the `map` component. */
    center?: [number, number]
    zoom?: number
    minZoom?: number
    /** Caps the map's max zoom. Defaults to the tile provider's own maxZoom. */
    maxZoom?: number
    /** Show the zoom control. */
    navigation?: boolean
    /** Placement of the zoom control ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right'). */
    navigationPosition?: LeafletPosition
    /** Show the HTML5 fullscreen toggle button. */
    fullscreen?: boolean
    /** Placement of the fullscreen button. Defaults to 'top-right'. */
    fullscreenPosition?: LeafletPosition
    /** Show tile credits behind a ⓘ button (reveals on hover/tap). Keep on — OSM/Esri tiles require attribution. */
    attribution?: boolean
    /** Wheel zoom. Set false for maps embedded in scrollable pages. */
    scrollWheelZoom?: boolean
    /** Desaturate the tile pane to a quiet canvas (markers stay coloured). */
    muted?: boolean
    /** Fires with the raw `L.Map` once it is created. */
    oncreated?: (map: L.Map) => void
    children?: Snippet
    ref?: HTMLDivElement | null
  }

  export interface LeafletFlyToOptions {
    /** [lng, lat] — Mapbox order. */
    center?: [number, number]
    zoom?: number
    /** Milliseconds (converted to Leaflet's seconds). */
    duration?: number
  }

  export interface LeafletViewOptions {
    center?: [number, number]
    zoom?: number
  }

  /** Handle returned by `bind:this` on <LeafletMap> — mirrors the `map`
   *  component's MapRef: camera helpers plus `getMap()` for the raw
   *  Leaflet Map. React's `readonly map` property has no Svelte equivalent
   *  (`bind:this` publishes functions, not live property bindings) —
   *  `getMap()` covers it. */
  export interface LeafletMapRef {
    getMap: () => L.Map | null
    flyTo: (options?: LeafletFlyToOptions) => void
    setView: (options?: LeafletViewOptions) => void
    jumpTo: (options?: LeafletViewOptions) => void
    /** [[west,south],[east,north]] in [lng, lat], or any Leaflet bounds expression. */
    fitBounds: (
      bounds: [[number, number], [number, number]] | L.LatLngBoundsExpression,
      options?: L.FitBoundsOptions,
    ) => void
    panTo: (center: [number, number]) => void
    zoomIn: () => void
    zoomOut: () => void
    resize: () => void
  }
</script>

<script lang="ts">
  /**
   * LeafletMap — a thin, theme-aware Leaflet wrapper that renders free raster
   * tiles (OpenStreetMap, OpenTopoMap, Esri). No API key required.
   *
   * Drop `<LeafletMarker>` / `<LeafletPopup>` / `<LeafletPolyline>` /
   * `<LeafletPolygon>` / `<LeafletCircle>` / `<LeafletCircleMarker>` /
   * `<LeafletGeoJson>` / `<LeafletTileLayer>` into the children to build any
   * map — the same composition model as the Mapbox `map` component.
   *
   * Not supported (Leaflet has no vector/GL renderer): pitch, bearing, 3D
   * buildings/terrain, globe projection. Use a `variant` preset or `tileUrl`
   * for custom raster tiles instead.
   */
  import { onDestroy, onMount, untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import {
    defined,
    fixDefaultLeafletIcon,
    loadLeaflet,
    setLeafletMapContext,
    toLatLng,
    toLatLngBounds,
  } from './leaflet-context.svelte'
  import type { LeafletTilePreset } from './leaflet-map.variants'
  import {
    leafletMapVariants,
    LEAFLET_TILES,
    LEAFLET_THEME_TILES,
  } from './leaflet-map.variants'
  import 'leaflet/dist/leaflet.css'
  import './leaflet-map.css'

  let {
    variant = 'default',
    size,
    tileUrl,
    tileAttribution,
    tileSubdomains,
    center = [0, 20],
    zoom = 2,
    minZoom,
    maxZoom,
    navigation = true,
    navigationPosition = 'bottom-right',
    fullscreen = false,
    fullscreenPosition = 'top-right',
    attribution = true,
    scrollWheelZoom = true,
    muted = false,
    oncreated,
    children,
    ref = $bindable(null),
    class: className,
    ...restProps
  }: LeafletMapProps = $props()

  let htmlDark = $state(false)
  const isMuted = $derived(muted || variant === 'muted')

  const resolvedTiles = $derived.by<LeafletTilePreset>(() => {
    if (tileUrl) {
      return {
        url: tileUrl,
        attribution:
          tileAttribution ?? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: tileSubdomains,
        maxZoom,
      }
    }
    if (
      variant &&
      variant !== 'default' &&
      variant !== 'muted' &&
      LEAFLET_TILES[variant as keyof typeof LEAFLET_TILES]
    ) {
      return LEAFLET_TILES[variant as keyof typeof LEAFLET_TILES]
    }
    return htmlDark ? LEAFLET_THEME_TILES.dark : LEAFLET_THEME_TILES.light
  })

  // Client-only: Leaflet needs the DOM, so SSR renders just the bg-muted shell.
  let mounted = $state(false)
  let inView = $state(false)
  let mapEl = $state<HTMLDivElement | null>(null)
  let mapInstance = $state<L.Map | null>(null)
  let Lmod: typeof import('leaflet') | null = null
  let baseLayer: L.TileLayer | null = null
  let overlayLayer: L.TileLayer | null = null
  let lastTiles: LeafletTilePreset | null = null
  let resizeObserver: ResizeObserver | null = null
  let intersectionObserver: IntersectionObserver | null = null
  let themeObserver: MutationObserver | null = null

  // Published to LeafletMarker / LeafletPopup / … children.
  setLeafletMapContext({
    get map() {
      return mapInstance
    },
  })

  function applyTiles(tiles: LeafletTilePreset) {
    const m = mapInstance
    const Ll = Lmod
    if (!m || !Ll) return
    baseLayer?.remove()
    baseLayer = null
    overlayLayer?.remove()
    overlayLayer = null
    baseLayer = Ll.tileLayer(tiles.url, {
      attribution: tiles.attribution,
      ...(tiles.subdomains ? { subdomains: tiles.subdomains } : {}),
      maxZoom: tiles.maxZoom ?? 19,
    })
    baseLayer.addTo(m)
    if (tiles.overlayUrl) {
      overlayLayer = Ll.tileLayer(tiles.overlayUrl, { maxZoom: tiles.maxZoom ?? 19 })
      overlayLayer.addTo(m)
    }
  }

  // Collect attribution strings from every layer (base tiles, overlays, custom
  // LeafletTileLayers) — deduped, rendered by the ⓘ popover.
  let attributions = $state<string[]>([])
  let showAttribution = $state(false)
  function collectAttributions() {
    const m = mapInstance
    if (!m) return
    const seen = new Set<string>()
    m.eachLayer((layer) => {
      const a = (layer as L.TileLayer).options?.attribution
      if (typeof a === 'string' && a) seen.add(a)
    })
    attributions = [...seen]
  }

  let canZoomIn = $state(true)
  let canZoomOut = $state(true)
  function syncZoomBounds() {
    const m = mapInstance
    if (!m) return
    canZoomIn = m.getZoom() < m.getMaxZoom()
    canZoomOut = m.getZoom() > m.getMinZoom()
  }

  function createMap() {
    const el = mapEl
    const Ll = Lmod
    if (!el || !Ll || mapInstance) return
    fixDefaultLeafletIcon(Ll)
    const tiles = resolvedTiles
    const m = Ll.map(
      el,
      defined({
        center: toLatLng(center ?? [0, 20]),
        zoom,
        minZoom,
        maxZoom: maxZoom ?? tiles.maxZoom,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom,
      }),
    )
    mapInstance = m
    lastTiles = tiles
    applyTiles(tiles)
    m.on('zoomend', syncZoomBounds)
    syncZoomBounds()
    m.on('layeradd layerremove', collectAttributions)
    collectAttributions()
    oncreated?.(m)
  }

  onMount(() => {
    const root = document.documentElement
    const syncTheme = () => {
      htmlDark = root.classList.contains('dark')
    }
    syncTheme()
    themeObserver = new MutationObserver(syncTheme)
    themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
    mounted = true

    const el = ref
    if (!el || typeof IntersectionObserver === 'undefined') {
      inView = true
    } else {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          inView = entry!.isIntersecting
        },
        { rootMargin: '160px', threshold: 0.01 },
      )
      intersectionObserver.observe(el)
    }
    if (typeof ResizeObserver !== 'undefined' && el) {
      resizeObserver = new ResizeObserver(() => {
        mapInstance?.invalidateSize()
      })
      resizeObserver.observe(el)
    }

    const onFullscreenChange = () => {
      isFullscreen = Boolean(document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  })

  onDestroy(() => {
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
    themeObserver?.disconnect()
    try {
      mapInstance?.remove()
    } catch {
      /* already destroyed */
    }
    mapInstance = null
  })

  // Leaflet module loads lazily once the container is both mounted and in view.
  $effect(() => {
    if (!mounted || !inView || mapInstance) return
    let alive = true
    void (async () => {
      const Ll = await loadLeaflet()
      if (!alive) return
      Lmod = Ll
      createMap()
    })()
    return () => {
      alive = false
    }
  })

  // Retile on variant / theme / custom-tile changes (skip the initial run —
  // createMap already applied them).
  $effect(() => {
    const tiles = resolvedTiles
    if (mapInstance && tiles !== lastTiles) {
      lastTiles = tiles
      applyTiles(tiles)
    }
  })

  // Track the coordinates, not the array: a parent re-render that passes a
  // fresh `[lng, lat]` literal must not snap the user's pan/zoom back. The map
  // is read untracked so creation (and any `oncreated` fitBounds) isn't undone.
  const centerLng = $derived(center?.[0])
  const centerLat = $derived(center?.[1])
  $effect(() => {
    const lng = centerLng
    const lat = centerLat
    const z = zoom
    const m = untrack(() => mapInstance)
    if (m && lng !== undefined && lat !== undefined) m.setView(toLatLng([lng, lat]), z)
  })

  $effect(() => {
    if (!attribution) showAttribution = false
  })

  $effect(() => {
    const enabled = scrollWheelZoom
    if (!mapInstance) return
    if (enabled) mapInstance.scrollWheelZoom.enable()
    else mapInstance.scrollWheelZoom.disable()
  })

  let isFullscreen = $state(false)
  function toggleFullscreen() {
    const el = ref
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void el.requestFullscreen?.()
  }

  // Zoom/fullscreen chrome is plain HTML overlaid on the map (like Mapbox's
  // controls) — a corner stack per occupied corner, zoom group above fullscreen.
  const cornerOrder = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const
  const cornerClasses = $derived<Record<(typeof cornerOrder)[number], string>>({
    'top-left': 'left-3 top-3',
    'top-right': 'right-3 top-3',
    // above the ⓘ button (bottom-left) when credits are shown
    'bottom-left': attribution && attributions.length ? 'bottom-9 left-3' : 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
  })
  const navPosition = $derived(navigationPosition ?? 'bottom-right')
  const fsPosition = $derived(fullscreenPosition ?? 'top-right')

  /** Mapbox-style camera shim — accepts { center: [lng, lat], zoom, duration(ms) }. */
  export function flyTo(options: LeafletFlyToOptions = {}) {
    const m = mapInstance
    if (!m) return
    const target = options.center ? toLatLng(options.center) : m.getCenter()
    m.flyTo(target, options.zoom ?? m.getZoom(), {
      duration: (options.duration ?? 800) / 1000,
    })
  }

  export function setView(options: LeafletViewOptions = {}) {
    const m = mapInstance
    if (!m) return
    m.setView(options.center ? toLatLng(options.center) : m.getCenter(), options.zoom ?? m.getZoom())
  }

  export function jumpTo(options: LeafletViewOptions = {}) {
    const m = mapInstance
    if (!m) return
    m.setView(options.center ? toLatLng(options.center) : m.getCenter(), options.zoom ?? m.getZoom(), {
      animate: false,
    })
  }

  // `bind:this` on <LeafletMap> hands back these camera helpers plus
  // `getMap()` for the raw L.Map. It mirrors the `map` component's MapRef.
  /** The underlying Leaflet Map, or null until it is created. */
  export function getMap() {
    return mapInstance
  }
  export function fitBounds(
    bounds: [[number, number], [number, number]] | L.LatLngBoundsExpression,
    options?: L.FitBoundsOptions,
  ) {
    mapInstance?.fitBounds(toLatLngBounds(bounds as [[number, number], [number, number]]), options)
  }
  export function panTo(center: [number, number]) {
    mapInstance?.panTo(toLatLng(center))
  }
  export function zoomIn() {
    mapInstance?.zoomIn()
  }
  export function zoomOut() {
    mapInstance?.zoomOut()
  }
  export function resize() {
    mapInstance?.invalidateSize()
  }
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="leaflet-map"
  data-variant={variant}
  data-muted={isMuted}
  class={cn(leafletMapVariants({ variant, ...(size ? { size } : {}) }), className)}
  {...restProps}
>
  <div bind:this={mapEl} class="size-full" hidden={!inView}></div>
  {#each cornerOrder as corner (corner)}
    {#if mapInstance && ((navigation && navPosition === corner) || (fullscreen && fsPosition === corner))}
      <div class="absolute z-[1000] flex flex-col gap-2.5 {cornerClasses[corner]}">
        {#if navigation && navPosition === corner}
          <div
            class="border-border bg-card divide-border flex flex-col divide-y overflow-hidden rounded-lg border shadow-sm"
          >
            <button
              type="button"
              class="text-muted-foreground hover:bg-muted flex size-8 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-40"
              aria-label="Zoom in"
              disabled={!canZoomIn}
              onclick={() => mapInstance?.zoomIn()}
            >
              <svg class="size-full" viewBox="0 0 29 29" fill="currentColor" aria-hidden="true">
                <path
                  d="M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z"
                />
              </svg>
            </button>
            <button
              type="button"
              class="text-muted-foreground hover:bg-muted flex size-8 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-40"
              aria-label="Zoom out"
              disabled={!canZoomOut}
              onclick={() => mapInstance?.zoomOut()}
            >
              <svg class="size-full" viewBox="0 0 29 29" fill="currentColor" aria-hidden="true">
                <path d="M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z" />
              </svg>
            </button>
          </div>
        {/if}
        {#if fullscreen && fsPosition === corner}
          <button
            type="button"
            class="border-border bg-card text-muted-foreground hover:bg-muted flex size-8 items-center justify-center rounded-lg border shadow-sm transition-colors"
            aria-label="Toggle fullscreen"
            onclick={toggleFullscreen}
          >
            <svg class="size-full" viewBox="0 0 29 29" fill="currentColor" aria-hidden="true">
              {#if isFullscreen}
                <path
                  d="M18.5 16c-1.75 0-2.5.75-2.5 2.5V24h1l1.5-3 5.5 4 1-1-4-5.5 3-1.5v-1h-5.5zM13 18.5c0-1.75-.75-2.5-2.5-2.5H5v1l3 1.5L4 24l1 1 5.5-4 1.5 3h1v-5.5zm3-8c0 1.75.75 2.5 2.5 2.5H24v-1l-3-1.5L25 5l-1-1-5.5 4L17 5h-1v5.5zM10.5 13c1.75 0 2.5-.75 2.5-2.5V5h-1l-1.5 3L5 4 4 5l4 5.5L5 12v1h5.5z"
                />
              {:else}
                <path
                  d="M24 16v5.5c0 1.75-.75 2.5-2.5 2.5H16v-1l3-1.5-4-5.5 1-1 5.5 4 1.5-3h1zM6 16l1.5 3 5.5-4 1 1-4 5.5 3 1.5v1H7.5C5.75 24 5 23.25 5 21.5V16h1zm7-11v1l-3 1.5 4 5.5-1 1-5.5-4L6 13H5V7.5C5 5.75 5.75 5 7.5 5H13zm11 2.5c0-1.75-.75-2.5-2.5-2.5H16v1l3 1.5-4 5.5 1 1 5.5-4 1.5 3h1V7.5z"
                />
              {/if}
            </svg>
          </button>
        {/if}
      </div>
    {/if}
  {/each}
  <!-- Tile credits behind a Mapbox-style ⓘ button: hover reveals on desktop,
       tap toggles on touch. Keep visible — OSM/Esri tiles require credit. -->
  {#if mapInstance && attribution && attributions.length}
    <div class="group absolute bottom-3 left-3 z-[1000] flex flex-col items-start gap-1.5">
      <div
        class="border-border bg-popover text-popover-foreground max-w-64 rounded-md border px-2.5 py-1.5 text-[11px] leading-relaxed shadow-md transition-opacity [&_a]:underline {showAttribution
          ? 'visible opacity-100'
          : 'invisible opacity-0 group-hover:visible group-hover:opacity-100'}"
        role="note"
      >
        {@html attributions.join(' | ')}
      </div>
      <button
        type="button"
        class="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground flex size-4 items-center justify-center rounded-full border shadow-xs transition-colors"
        aria-label="Map data attribution"
        aria-expanded={showAttribution}
        onclick={() => (showAttribution = !showAttribution)}
      >
        <svg
          class="size-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>
    </div>
  {/if}
  {@render children?.()}
</div>
