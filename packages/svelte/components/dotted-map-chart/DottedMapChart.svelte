<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { MapVariant } from '$lib/components/ui/map'

  export interface MapPin {
    lat: number
    lng: number
    label?: string
    color?: string
    description?: string
    value?: string | number
    status?: string
  }

  export interface MapRoute {
    from: { lat: number; lng: number }
    to: { lat: number; lng: number }
    color?: string
    width?: number
    curvature?: number
    animated?: boolean
    dashed?: boolean
    duration?: number
    label?: string
  }

  export interface DottedMapChartProps extends HTMLAttributes<HTMLDivElement> {
    pins?: MapPin[]
    routes?: MapRoute[]
    map?: 'world' | 'usa'
    grid?: 'vertical' | 'diagonal'
    shape?: 'circle' | 'hexagon'
    dotColor?: string
    pulse?: boolean
    height?: number | string
    ariaLabel?: string
    interactive?: boolean
    variant?: MapVariant
    projection?: 'globe' | 'mercator'
    onPinClick?: (pin: MapPin) => void
    onPinHover?: (pin: MapPin | null) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Globe } from '@lucide/svelte'
  import { Map, MapLayer, MapMarker, MapSource } from '$lib/components/ui/map'
  import { cn } from '$lib/utils'

  // Mapbox GL paint needs a concrete color — resolve `var(--token)` values
  // (the natural way to pass theme colors) via getComputedStyle first.
  // Inlined (svelte charts vendor their own theme code per-component).
  let _hexCanvas: CanvasRenderingContext2D | null = null
  function toCanvasColor(cssColor: string): string {
    const value = cssColor.trim()
    const match = value.match(
      /^oklch\(\s*([+-]?(?:\d+\.?\d*|\.\d+))(%?)\s+([+-]?(?:\d+\.?\d*|\.\d+))\s+([+-]?(?:\d+\.?\d*|\.\d+))(?:deg)?(?:\s*\/\s*([+-]?(?:\d+\.?\d*|\.\d+))(%?))?\s*\)$/i,
    )
    if (match) {
      const lightness = Number(match[1]) / (match[2] === '%' ? 100 : 1)
      const chroma = Number(match[3])
      const hue = (Number(match[4]) * Math.PI) / 180
      const alpha = match[5] == null ? 1 : Number(match[5]) / (match[6] === '%' ? 100 : 1)
      const a = chroma * Math.cos(hue)
      const b = chroma * Math.sin(hue)
      const l = Math.pow(lightness + 0.3963377774 * a + 0.2158037573 * b, 3)
      const m = Math.pow(lightness - 0.1055613458 * a - 0.0638541728 * b, 3)
      const s = Math.pow(lightness - 0.0894841775 * a - 1.291485548 * b, 3)
      const linear = [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
      ]
      const rgb = linear.map((channel) => {
        const encoded = channel <= 0.0031308 ? 12.92 * channel : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055
        return Math.round(Math.min(1, Math.max(0, encoded)) * 255)
      })
      return alpha < 1 ? `rgba(${rgb.join(', ')}, ${alpha})` : `rgb(${rgb.join(', ')})`
    }
    if (typeof document === 'undefined') return cssColor
    if (!_hexCanvas) _hexCanvas = document.createElement('canvas').getContext('2d')
    if (!_hexCanvas) return cssColor
    _hexCanvas.fillStyle = '#010203'
    _hexCanvas.fillStyle = value
    const normalized = _hexCanvas.fillStyle as string
    return normalized === '#010203' && value.toLowerCase() !== '#010203' ? value : normalized
  }
  function resolvePaintColor(value: string): string {
    const match = value.trim().match(/^var\(\s*(--[\w-]+)\s*\)$/)
    const name = match?.[1]
    if (!name || typeof window === 'undefined') return value
    const resolved = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    return resolved ? toCanvasColor(resolved) : value
  }

  let {
    class: className,
    pins = [],
    routes = [],
    map = 'world',
    // Accepted for twin parity; the map renderer currently draws circles only.
    grid = 'vertical',
    shape = 'circle',
    dotColor = 'rgba(255, 255, 255, 0.22)',
    pulse = true,
    height = 420,
    ariaLabel,
    interactive = true,
    variant = 'dark',
    projection = 'globe',
    onPinClick,
    onPinHover,
    ref = $bindable(null),
    ...restProps
  }: DottedMapChartProps = $props()

  void grid
  void shape

  let currentProjection = $state<'globe' | 'mercator'>(projection)
  let hoveredPin = $state<MapPin | null>(null)

  function onPinEnter(pin: MapPin) {
    hoveredPin = pin
    onPinHover?.(pin)
  }

  function onPinLeave() {
    hoveredPin = null
    onPinHover?.(null)
  }

  function toggleProjection() {
    currentProjection = currentProjection === 'globe' ? 'mercator' : 'globe'
  }

  const mapCenter = $derived<[number, number]>(map === 'usa' ? [-98, 39] : [0, 20])
  const mapZoom = $derived(map === 'usa' ? 3.5 : 1.5)

  // Generate synthetic telemetry dot matrix over land
  const dotGridGeoJson = $derived.by(() => {
    const features: any[] = []
    const step = map === 'usa' ? 3 : 6
    const latMin = map === 'usa' ? 25 : -55
    const latMax = map === 'usa' ? 50 : 70
    const lngMin = map === 'usa' ? -125 : -170
    const lngMax = map === 'usa' ? -66 : 170

    for (let lat = latMin; lat <= latMax; lat += step) {
      for (let lng = lngMin; lng <= lngMax; lng += step) {
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        })
      }
    }

    return {
      type: 'FeatureCollection',
      features,
    }
  })

  const routesGeoJson = $derived(
    !routes || !routes.length
      ? null
      : {
          type: 'FeatureCollection',
          features: routes.map((r, i) => ({
            type: 'Feature',
            id: i,
            properties: {
              color: r.color || 'rgba(56, 189, 248, 0.75)',
              dashed: r.dashed ?? true,
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [r.from.lng, r.from.lat],
                [(r.from.lng + r.to.lng) / 2, (r.from.lat + r.to.lat) / 2 + 5],
                [r.to.lng, r.to.lat],
              ],
            },
          })),
        },
  )

  const dotPaint = $derived({
    'circle-radius': 1.5,
    'circle-color': resolvePaintColor(dotColor || 'rgba(255, 255, 255, 0.22)'),
    'circle-opacity': 0.4,
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
  role="img"
  aria-label={ariaLabel || 'Dotted map chart'}
  class={cn('border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs', className)}
  style:height={heightStyle}
  {...restProps}
>
  <Map {variant} projection={currentProjection} center={mapCenter} zoom={mapZoom} class="size-full">
    <!-- Telemetry Dot Grid -->
    <MapSource id="dot-grid-source" type="geojson" data={dotGridGeoJson}>
      <MapLayer id="dot-grid-layer" type="circle" paint={dotPaint} />
    </MapSource>

    <!-- Connection Routes -->
    {#if routesGeoJson}
      <MapSource id="routes-source" type="geojson" data={routesGeoJson}>
        <MapLayer id="routes-layer" type="line" paint={routeLinePaint} />
      </MapSource>
    {/if}

    <!-- Pins -->
    {#each pins as pin, i (i)}
      <MapMarker lngLat={[pin.lng, pin.lat]} anchor="center" class="cursor-pointer select-none">
        <div
          class="relative flex size-6 items-center justify-center"
          onmouseenter={() => onPinEnter(pin)}
          onmouseleave={onPinLeave}
          onclick={() => onPinClick?.(pin)}
        >
          {#if pulse}
            <span
              class="absolute inline-flex size-full animate-ping rounded-full opacity-60"
              style="background-color: {pin.color || 'oklch(0.65 0.20 145)'}"
            ></span>
          {/if}
          <span
            class="ring-background relative inline-flex size-2.5 rounded-full shadow-xs ring-2"
            style="background-color: {pin.color || 'oklch(0.65 0.20 145)'}; box-shadow: 0 0 10px {pin.color ||
              'oklch(0.65 0.20 145)'};"
          ></span>
        </div>
      </MapMarker>
    {/each}
  </Map>

  <!-- Projection Switcher -->
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

  <!-- Active Pin Card -->
  {#if hoveredPin && interactive}
    <div
      class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150"
    >
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-full" style="background-color: {hoveredPin.color || 'oklch(0.65 0.20 145)'}"
        ></span>
        <h5 class="text-foreground text-xs font-semibold">
          {hoveredPin.label || 'Telemetry Node'}
        </h5>
      </div>
      {#if hoveredPin.description}
        <p class="text-muted-foreground mt-1 text-xs">
          {hoveredPin.description}
        </p>
      {/if}
      {#if hoveredPin.value !== undefined}
        <div
          class="border-border/60 mt-2 flex items-baseline justify-between border-t pt-1.5 font-mono text-xs"
        >
          <span class="text-muted-foreground">Value</span>
          <span class="text-foreground font-semibold">{hoveredPin.value}</span>
        </div>
      {/if}
    </div>
  {/if}
</div>
