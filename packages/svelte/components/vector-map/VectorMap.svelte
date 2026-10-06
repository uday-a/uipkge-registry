<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

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

  export interface VectorMapProps extends HTMLAttributes<HTMLDivElement> {
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
    ariaLabel?: string
    projection?: 'globe' | 'mercator'
    /** React-parity selection callback (fires alongside the `bind:selectedRegion` update). */
    onSelectedRegionChange?: (id: string) => void
    /** @deprecated Renamed to `onSelectedRegionChange` for React parity; kept as an alias. */
    onselectregion?: (id: string) => void
    /** Fired when a pin is clicked. */
    onSelectPin?: (pin: MapPin) => void
    /** @deprecated Renamed to `onSelectPin` for React-style casing; kept as an alias. */
    onselectpin?: (pin: MapPin) => void
    ref?: HTMLDivElement | null
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
  void REGION_CENTROIDS
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { Globe } from '@lucide/svelte'
  import { Map, MapMarker, MapSource, MapLayer } from '$lib/components/ui/map'
  import { cn } from '$lib/utils'

  let {
    mode: _mode = 'continents',
    regions = WORLD_REGIONS,
    regionData = {},
    selectedRegion = $bindable(),
    pins = [],
    routes = [],
    height = 460,
    interactive = true,
    projection = 'globe',
    onSelectedRegionChange,
    onselectregion,
    onSelectPin,
    onselectpin,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: VectorMapProps = $props()

  let activeRegion = $state(untrack(() => selectedRegion) || 'northAmerica')
  let currentProjection = $state<'globe' | 'mercator'>(untrack(() => projection))
  let hoveredPin = $state<MapPin | null>(null)

  $effect(() => {
    activeRegion = selectedRegion ?? 'northAmerica'
  })

  const activeRecord = $derived(regionData[activeRegion] || null)

  function selectRegion(id: string) {
    if (!interactive) return
    activeRegion = id
    selectedRegion = id
    onSelectedRegionChange?.(id)
    onselectregion?.(id)
  }

  function selectPin(pin: MapPin) {
    onSelectPin?.(pin)
    onselectpin?.(pin)
  }

  function toggleProjection() {
    currentProjection = currentProjection === 'globe' ? 'mercator' : 'globe'
  }

  const routesGeoJson = $derived.by(() => {
    if (!routes || !routes.length) return null
    return {
      type: 'FeatureCollection',
      features: routes.map((r, i) => {
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

  const heightStyle = $derived(
    typeof height === 'number' ? `${height}px` : /^\d+$/.test(String(height)) ? `${height}px` : height,
  )
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="vector-map"
  class={cn('group relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-xs', className)}
  style="height: {heightStyle}"
  {...restProps}
>
  <Map variant="dark" projection={currentProjection} center={[10, 25]} zoom={1.6} class="size-full">
    <!-- Flow Routes Layer -->
    {#if routesGeoJson}
      <MapSource id="vector-routes-source" type="geojson" data={routesGeoJson}>
        <MapLayer id="vector-routes-layer" type="line" paint={routeLinePaint} />
      </MapSource>
    {/if}

    <!-- Pins Layer -->
    {#each pins as pin, i (i)}
      <MapMarker lngLat={[pin.lng ?? 0, pin.lat ?? 0]} anchor="center" class="cursor-pointer select-none">
        <div
          class="relative flex size-6 items-center justify-center"
          onmouseenter={() => (hoveredPin = pin)}
          onmouseleave={() => (hoveredPin = null)}
          onclick={() => selectPin(pin)}
        >
          <span
            class="absolute inline-flex size-full animate-ping rounded-full opacity-60"
            style="background-color: {pin.color || 'oklch(0.65 0.20 145)'}"
          ></span>
          <span
            class="relative inline-flex size-2.5 rounded-full shadow-xs ring-2 ring-background"
            style="background-color: {pin.color ||
              'oklch(0.65 0.20 145)'}; box-shadow: 0 0 10px {pin.color || 'oklch(0.65 0.20 145)'}"
          ></span>
        </div>
      </MapMarker>
    {/each}
  </Map>

  <!-- Top-Left Region Selector Chips -->
  <div
    class="absolute top-3 left-3 z-10 hidden max-w-md flex-wrap gap-1 rounded-lg border border-border/70 bg-card/85 p-1.5 shadow-xs backdrop-blur-md md:flex"
  >
    {#each regions as r (r.id)}
      <button
        type="button"
        class={cn(
          'rounded-md px-2 py-0.5 text-xs font-medium transition',
          activeRegion === r.id
            ? 'bg-primary font-semibold text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
        onclick={() => selectRegion(r.id)}
      >
        {r.name}
      </button>
    {/each}
  </div>

  <!-- Top-Right Controls -->
  <div
    class="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border border-border/70 bg-card/85 p-1 shadow-xs backdrop-blur-md"
  >
    <button
      type="button"
      class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
      onclick={toggleProjection}
    >
      <Globe class="size-3.5" />
      <span class="capitalize">{currentProjection}</span>
    </button>
  </div>

  <!-- Bottom-Left Region Detail Card -->
  {#if activeRecord}
    <div
      class="absolute bottom-3 left-3 z-10 max-w-sm animate-in rounded-xl border border-border/80 bg-card/95 p-3.5 shadow-lg backdrop-blur-md duration-150 fade-in slide-in-from-bottom-2"
    >
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-full" style="background-color: {activeRecord.color || 'oklch(0.65 0.20 145)'}" ></span>
        <h4 class="text-sm font-semibold text-foreground capitalize">
          {activeRegion.replace(/([A-Z])/g, ' $1')}
        </h4>
        <span class="ml-auto font-mono text-xs text-muted-foreground uppercase">
          {activeRecord.status || 'Optimal'}
        </span>
      </div>

      {#if activeRecord.value !== undefined}
        <div
          class="mt-2.5 flex items-baseline justify-between border-t border-border/60 pt-2 font-mono text-xs"
        >
          <span class="text-muted-foreground">Active Nodes</span>
          <span class="font-semibold text-foreground">
            {activeRecord.value.toLocaleString()}
          </span>
        </div>
      {/if}

      {#if activeRecord.description}
        <p class="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {activeRecord.description}
        </p>
      {/if}
    </div>
  {/if}

  <!-- Hovered Pin HUD -->
  {#if hoveredPin}
    <div
      class="absolute right-3 bottom-3 z-10 max-w-xs animate-in rounded-xl border border-border/80 bg-card/95 p-3 shadow-lg backdrop-blur-md duration-150 fade-in slide-in-from-bottom-2"
    >
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-full" style="background-color: {hoveredPin.color || 'oklch(0.65 0.20 145)'}" ></span>
        <h5 class="text-xs font-semibold text-foreground">
          {hoveredPin.label || 'Hub'}
        </h5>
      </div>
      {#if hoveredPin.description}
        <p class="mt-1 text-xs text-muted-foreground">
          {hoveredPin.description}
        </p>
      {/if}
      {#if hoveredPin.value !== undefined}
        <div class="mt-2 flex items-baseline justify-between border-t border-border/60 pt-1.5 font-mono text-xs">
          <span class="text-muted-foreground">Throughput</span>
          <span class="font-semibold text-foreground">{hoveredPin.value}</span>
        </div>
      {/if}
    </div>
  {/if}
</div>
