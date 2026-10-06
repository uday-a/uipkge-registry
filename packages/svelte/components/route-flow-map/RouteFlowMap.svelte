<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

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

  export interface RouteFlowMapProps extends HTMLAttributes<HTMLDivElement> {
    hubs?: RouteHub[]
    routes?: FlightRoute[]
    selectedRoute?: string
    /** React-parity selection callback (fires alongside the `bind:selectedRoute` update). */
    onSelectedRouteChange?: (id: string | undefined) => void
    showHubLabels?: boolean
    showGraticule?: boolean
    height?: number | string
    interactive?: boolean
    ariaLabel?: string
    projection?: 'globe' | 'mercator'
    onRouteSelect?: (route: FlightRoute) => void
    onHubClick?: (hub: RouteHub) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Globe, Plane } from '@lucide/svelte'
  import { Map, MapMarker, MapSource, MapLayer } from '$lib/components/ui/map'
  import { cn } from '$lib/utils'
  import { chartAccentColor } from './chart-theme'

  let {
    class: className,
    hubs = [],
    routes = [],
    selectedRoute = $bindable<string | undefined>(),
    onSelectedRouteChange,
    showHubLabels = true,
    showGraticule = true,
    height = 480,
    interactive = true,
    ariaLabel = 'Global Route and Flight Flow Map',
    projection = 'globe',
    onRouteSelect,
    onHubClick,
    ref = $bindable(null),
    ...restProps
  }: RouteFlowMapProps = $props()

  let activeRouteId = $state(selectedRoute || '')
  let currentProjection = $state<'globe' | 'mercator'>(projection)
  let hoveredHub = $state<RouteHub | null>(null)
  let themeTick = $state(0)

  // Sync controlled selection from the parent.
  $effect(() => {
    activeRouteId = selectedRoute ?? ''
  })

  $effect(() => {
    if (projection !== currentProjection) currentProjection = projection
  })

  // Re-resolve the accent color when the theme flips (shadcn dark-mode pivot).
  $effect(() => {
    if (typeof window === 'undefined') return
    const raf = requestAnimationFrame(() => themeTick++)
    const mo = new MutationObserver(() => themeTick++)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
    }
  })

  const hubMap = $derived.by(() => {
    const map = new globalThis.Map<string, RouteHub>()
    for (const h of hubs) map.set(h.id, h)
    return map
  })

  const routesGeoJson = $derived.by(() => {
    if (!routes || !routes.length) return null
    return {
      type: 'FeatureCollection',
      features: routes
        .map((r) => {
          const fromHub = hubMap.get(r.from)
          const toHub = hubMap.get(r.to)
          if (!fromHub || !toHub) return null

          const midLng = (fromHub.lng + toHub.lng) / 2
          const midLat = (fromHub.lat + toHub.lat) / 2 + 10

          return {
            type: 'Feature',
            id: r.id,
            properties: {
              id: r.id,
              color: r.color || 'rgba(56, 189, 248, 0.8)',
              selected: activeRouteId === r.id,
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

  const routeLinePaint = $derived.by(() => {
    void themeTick
    return {
      'line-color': ['case', ['==', ['get', 'id'], activeRouteId], chartAccentColor(), ['get', 'color']],
      'line-width': ['case', ['==', ['get', 'id'], activeRouteId], 3, 1.5],
      'line-dasharray': [2, 2],
    }
  })

  const activeRoute = $derived(routes.find((r) => r.id === activeRouteId))

  function selectRoute(r: FlightRoute) {
    if (!interactive) return
    activeRouteId = r.id
    selectedRoute = r.id
    onSelectedRouteChange?.(r.id)
    onRouteSelect?.(r)
  }

  function clearSelection() {
    activeRouteId = ''
    selectedRoute = undefined
    onSelectedRouteChange?.(undefined)
  }

  function getVehiclePosition(r: FlightRoute): [number, number] | null {
    const fromHub = hubMap.get(r.from)
    const toHub = hubMap.get(r.to)
    if (!fromHub || !toHub) return null
    const progress = (r.progress ?? 50) / 100
    const lng = fromHub.lng + (toHub.lng - fromHub.lng) * progress
    const lat = fromHub.lat + (toHub.lat - fromHub.lat) * progress + Math.sin(progress * Math.PI) * 10
    return [lng, lat]
  }

  function toggleProjection() {
    currentProjection = currentProjection === 'globe' ? 'mercator' : 'globe'
  }

  const heightStyle = $derived(
    typeof height === 'number' ? `${height}px` : /^\d+$/.test(String(height)) ? `${height}px` : height,
  )

  // Reference otherwise-unused parity props so intent stays explicit.
  void showGraticule
  void ariaLabel
</script>

<div
  bind:this={ref}
  class={cn('border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs', className)}
  style="height: {heightStyle};"
  {...restProps}
>
  <Map variant="dark" projection={currentProjection} center={[10, 25]} zoom={1.6} class="size-full">
    <!-- Great Circle Route Arcs -->
    {#if routesGeoJson}
      <MapSource id="flight-routes-source" type="geojson" data={routesGeoJson}>
        <MapLayer id="flight-routes-layer" type="line" paint={routeLinePaint} />
      </MapSource>
    {/if}

    <!-- Hub Markers -->
    {#each hubs as hub (hub.id)}
      <MapMarker lngLat={[hub.lng, hub.lat]} anchor="center" class="cursor-pointer select-none">
        <div
          class="relative flex flex-col items-center"
          onmouseenter={() => (hoveredHub = hub)}
          onmouseleave={() => (hoveredHub = null)}
          onclick={() => onHubClick?.(hub)}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onHubClick?.(hub)
          }}
          role="button"
          tabindex="0"
        >
          <span
            class="size-2 rounded-full shadow-xs ring-2"
            style="background-color: {hub.color || 'oklch(0.65 0.20 145)'}; box-shadow: 0 0 8px {hub.color ||
              'oklch(0.65 0.20 145)'};"
          ></span>
          {#if showHubLabels}
            <span class="border-border/80 bg-background/85 py-0.2 text-foreground mt-1 rounded border px-1 font-mono text-[9px] font-bold shadow-xs backdrop-blur-xs">
              {hub.id}
            </span>
          {/if}
        </div>
      </MapMarker>
    {/each}

    <!-- Aircraft / Cargo Vehicles in Flight -->
    {#each routes as r (r.id)}
      {@const vehiclePos = getVehiclePosition(r)}
      {#if vehiclePos}
        <MapMarker
          lngLat={vehiclePos}
          anchor="center"
          class={cn('cursor-pointer transition-transform select-none', activeRouteId === r.id ? 'z-30 scale-125' : 'z-20 hover:scale-110')}
        >
          <div
            class="flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-950/80 px-1.5 py-0.5 shadow-md backdrop-blur-xs"
            onclick={() => selectRoute(r)}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') selectRoute(r)
            }}
            role="button"
            tabindex="0"
          >
            <Plane class="size-3 rotate-45 text-sky-400" />
            <span class="font-mono text-[9px] font-semibold text-sky-200">
              {r.callsign || r.id}
            </span>
          </div>
        </MapMarker>
      {/if}
    {/each}
  </Map>

  <!-- Top-Right Controls -->
  <div class="border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md">
    <button
      type="button"
      class="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
      onclick={toggleProjection}
    >
      <Globe class="size-3.5" />
      <span class="capitalize">{currentProjection}</span>
    </button>
  </div>

  <!-- Active Flight Route HUD Card -->
  {#if activeRoute}
    <div class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="size-2 animate-pulse rounded-full bg-sky-400"></span>
            <span class="text-foreground font-mono text-xs font-semibold tracking-wider uppercase">
              {activeRoute.callsign || activeRoute.id}
            </span>
            <span class="py-0.2 rounded bg-sky-500/10 px-1.5 font-mono text-[10px] text-sky-400 capitalize">
              {activeRoute.status || 'En-route'}
            </span>
          </div>
          <div class="text-muted-foreground mt-1 flex items-center gap-2 font-mono text-xs">
            <span>{activeRoute.from}</span>
            <span>→</span>
            <span>{activeRoute.to}</span>
            {#if activeRoute.aircraft}
              <span class="text-[10px]">({activeRoute.aircraft})</span>
            {/if}
          </div>
        </div>
        <button type="button" class="text-muted-foreground hover:text-foreground text-xs" onclick={clearSelection}>
          ✕
        </button>
      </div>

      <div class="border-border/60 mt-3 grid grid-cols-3 gap-2 border-t pt-2 font-mono text-[11px]">
        <div>
          <span class="text-muted-foreground block text-[9px] uppercase">Speed</span>
          <span class="text-foreground font-semibold">{activeRoute.speed || '480 kts'}</span>
        </div>
        <div>
          <span class="text-muted-foreground block text-[9px] uppercase">Altitude</span>
          <span class="text-foreground font-semibold">{activeRoute.altitude || 'FL360'}</span>
        </div>
        <div>
          <span class="text-muted-foreground block text-[9px] uppercase">ETA</span>
          <span class="text-foreground font-semibold">{activeRoute.eta || '02h 15m'}</span>
        </div>
      </div>
    </div>
  {/if}

  <!-- Hovered Hub HUD -->
  {#if hoveredHub}
    <div class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute right-3 bottom-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150">
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-full" style="background-color: {hoveredHub.color || 'oklch(0.65 0.20 145)'}"></span>
        <h5 class="text-foreground text-xs font-semibold">{hoveredHub.name} ({hoveredHub.id})</h5>
      </div>
      {#if hoveredHub.latency}
        <div class="mt-1.5 flex items-baseline justify-between font-mono text-xs">
          <span class="text-muted-foreground">Turnaround</span>
          <span class="text-foreground font-semibold">{hoveredHub.latency}</span>
        </div>
      {/if}
    </div>
  {/if}
</div>
