<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { MapVariant } from '$lib/components/ui/map'

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

  export interface ChoroplethMapChartProps extends HTMLAttributes<HTMLDivElement> {
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
    ariaLabel?: string
  }
</script>

<script lang="ts">
  import { Globe } from '@lucide/svelte'
  import { Map, MapLayer, MapMarker, MapSource } from '$lib/components/ui/map'
  import { cn } from '$lib/utils'

  let {
    class: className,
    geoJson,
    mapName: _mapName = 'uipkge-map',
    data,
    idField: _idField = 'id',
    pins,
    links,
    showScale = true,
    height = 420,
    center = [0, 20],
    zoom = 1.5,
    variant = 'dark',
    projection = 'globe',
    ariaLabel,
    ...restProps
  }: ChoroplethMapChartProps = $props()

  // `_mapName` / `_idField` are destructured aside (accepted for API parity
  // with the Vue twin) so they never leak into `...restProps` and onto the DOM.
  // Intentional one-shot seed: the switcher button owns the projection after mount.
  // svelte-ignore state_referenced_locally
  let currentProjection: 'globe' | 'mercator' = $state(projection)

  function toggleProjection() {
    currentProjection = currentProjection === 'globe' ? 'mercator' : 'globe'
  }

  const dataMap = $derived.by(() => {
    const map = new globalThis.Map<string, number>()
    if (!data) return map
    for (const d of data) {
      map.set(String(d.id).toLowerCase(), d.value)
      if (d.name) map.set(String(d.name).toLowerCase(), d.value)
    }
    return map
  })

  const values = $derived(data ? data.map((d) => d.value) : [])
  const minValue = $derived(values.length ? Math.min(...values) : 0)
  const maxValue = $derived(values.length ? Math.max(...values) : 100)

  const enrichedGeoJson = $derived.by(() => {
    if (!geoJson || !geoJson.features) return geoJson
    const features = geoJson.features.map((f: any) => {
      const idVal = f.id !== undefined ? String(f.id).toLowerCase() : ''
      const nameVal = f.properties?.name ? String(f.properties.name).toLowerCase() : ''
      const matchedVal = dataMap.get(idVal) ?? dataMap.get(nameVal) ?? null

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
      ...geoJson,
      features,
    }
  })

  const fillPaint = $derived({
    'fill-color': [
      'case',
      ['!=', ['get', 'value'], null],
      [
        'interpolate',
        ['linear'],
        ['get', 'value'],
        minValue,
        'rgba(56, 189, 248, 0.25)',
        maxValue,
        'rgba(56, 189, 248, 0.9)',
      ],
      'rgba(255, 255, 255, 0.04)',
    ],
    'fill-opacity': 0.85,
  })

  const strokePaint = {
    'line-color': 'rgba(255, 255, 255, 0.25)',
    'line-width': 1,
  }

  const linksGeoJson = $derived.by(() => {
    if (!links || !links.length) return null
    return {
      type: 'FeatureCollection',
      features: links.map((link) => ({
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

  const heightStyle = $derived(
    typeof height === 'number' ? `${height}px` : /^\d+$/.test(String(height)) ? `${height}px` : height,
  )
</script>

<div
  role="img"
  aria-label={ariaLabel || 'Chart'}
  class={cn('border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs', className)}
  style="height: {heightStyle};"
  {...restProps}
>
  <Map {variant} projection={currentProjection} {center} {zoom} class="size-full">
    <!-- GeoJSON Choropleth Source & Layers -->
    <MapSource id="choropleth-source" type="geojson" data={enrichedGeoJson}>
      <MapLayer id="choropleth-fill" type="fill" paint={fillPaint} />
      <MapLayer id="choropleth-stroke" type="line" paint={strokePaint} />
    </MapSource>

    <!-- Links Layer -->
    {#if linksGeoJson}
      <MapSource id="choropleth-links-source" type="geojson" data={linksGeoJson}>
        <MapLayer id="choropleth-links" type="line" paint={linkLinePaint} />
      </MapSource>
    {/if}

    <!-- Point Pins -->
    {#each pins || [] as pin, i (i)}
      <MapMarker lngLat={pin.coord} anchor="bottom">
        <div class="flex flex-col items-center">
          <span
            class="size-3 rounded-full shadow-md ring-4"
            style="background-color: {pin.color || 'oklch(0.65 0.20 145)'}; box-shadow: 0 0 10px {pin.color ||
              'oklch(0.65 0.20 145)'};"
          ></span>
          <span
            class="border-border/80 bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs backdrop-blur-xs"
          >
            {pin.name}
          </span>
        </div>
      </MapMarker>
    {/each}
  </Map>

  <!-- Top-Right Projection Switcher -->
  <div
    class="border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md"
  >
    <button
      type="button"
      class="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
      onclick={toggleProjection}
    >
      <Globe class="size-3.5" />
      <span class="capitalize">{currentProjection}</span>
    </button>
  </div>

  <!-- Bottom-Right Continuous Value Scale Legend -->
  {#if showScale && values.length > 0}
    <div
      class="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-2.5 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex"
    >
      <span class="text-muted-foreground font-mono text-[11px]">Range</span>
      <span class="text-muted-foreground font-mono text-[10px]">{minValue}</span>
      <div class="h-2 w-24 rounded-full bg-gradient-to-r from-sky-400/30 to-sky-400"></div>
      <span class="text-foreground font-mono text-[10px] font-semibold">{maxValue}</span>
    </div>
  {/if}
</div>
