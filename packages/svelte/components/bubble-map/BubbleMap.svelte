<script lang="ts" module>
  import type { MapVariant } from '$lib/components/ui/map'

  export interface MapBubble {
    id: string
    name: string
    lat: number
    lng: number
    value: number
    formattedValue?: string
    category?: string
    status?: 'optimal' | 'warning' | 'destructive' | 'neutral' | 'active'
    color?: string
    pulse?: boolean
    description?: string
  }

  export interface BubbleMapProps {
    bubbles?: MapBubble[]
    minRadius?: number
    maxRadius?: number
    showLegend?: boolean
    legendTitle?: string
    /** Selected bubble id. Two-way bindable (`bind:selectedId`). */
    selectedId?: string
    /** React-parity selection callback (fires alongside the `bind:selectedId` update). */
    onSelectedIdChange?: (id: string | undefined) => void
    interactive?: boolean
    projection?: 'globe' | 'mercator'
    variant?: MapVariant
    center?: [number, number]
    zoom?: number
    class?: string
    onselect?: (bubble: MapBubble) => void
    ref?: HTMLDivElement | null
  }

  export function projectPoint(lat: number, lng: number): { x: number; y: number } {
    const x = ((lng + 180) / 360) * 1000
    const y = ((90 - lat) / 180) * 500
    return { x, y }
  }

  export const CONTINENT_LANDMASSES: Array<{ id: string; name: string; d: string }> = []
</script>

<script lang="ts">
  import { Map, MapMarker } from '$lib/components/ui/map'
  import { Globe } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let {
    bubbles = [],
    minRadius = 10,
    maxRadius = 42,
    showLegend = true,
    legendTitle = 'Scale by Magnitude',
    selectedId = $bindable<string | undefined>(undefined),
    onSelectedIdChange,
    interactive = true,
    projection = 'globe',
    variant = 'dark',
    center = [0, 20],
    zoom = 1.5,
    class: className,
    onselect,
    ref = $bindable(null),
  }: BubbleMapProps = $props()

  let activeId = $state(selectedId || '')
  // Initial capture is intentional (mirrors the Vue twin): projection is view state owned by the map after mount.
  // svelte-ignore state_referenced_locally
  let currentProjection = $state<'globe' | 'mercator'>(projection)

  // Sync internal selection when the parent drives `selectedId`.
  $effect(() => {
    activeId = selectedId ?? ''
  })

  const values = $derived(bubbles.map((b) => b.value))
  const minValue = $derived(values.length ? Math.min(...values) : 1)
  const maxValue = $derived(values.length ? Math.max(...values) : 100)

  function getRadius(val: number): number {
    if (maxValue === minValue) return (minRadius + maxRadius) / 2
    const ratio = Math.sqrt(Math.max(0, val - minValue) / (maxValue - minValue))
    return Math.round(minRadius + ratio * (maxRadius - minRadius))
  }

  const STATUS_COLORS: Record<string, string> = {
    optimal: 'oklch(0.65 0.20 145)',
    active: 'oklch(0.60 0.20 250)',
    warning: 'oklch(0.75 0.18 65)',
    destructive: 'oklch(0.60 0.22 25)',
    neutral: 'oklch(0.65 0.05 240)',
  }

  function getBubbleColor(b: MapBubble): string {
    if (b.color) return b.color
    if (b.status && STATUS_COLORS[b.status]) return STATUS_COLORS[b.status]
    return 'oklch(0.60 0.20 250)'
  }

  const activeBubble = $derived(bubbles.find((b) => b.id === activeId))

  function selectBubble(b: MapBubble) {
    if (!interactive) return
    activeId = b.id
    selectedId = b.id
    onSelectedIdChange?.(b.id)
    onselect?.(b)
  }

  function clearSelection() {
    activeId = ''
    selectedId = undefined
    onSelectedIdChange?.(undefined)
  }

  function toggleProjection() {
    currentProjection = currentProjection === 'globe' ? 'mercator' : 'globe'
  }
</script>

<div
  bind:this={ref}
  class={cn(
    'border-border bg-card group relative h-[420px] w-full overflow-hidden rounded-xl border shadow-xs',
    className,
  )}
>
  <Map {variant} projection={currentProjection} {center} {zoom} class="size-full">
    {#each bubbles as b (b.id)}
      <MapMarker
        lngLat={[b.lng, b.lat]}
        anchor="center"
        class={cn('cursor-pointer transition-transform select-none', activeId === b.id ? 'z-30 scale-110' : 'z-20 hover:scale-105')}
      >
        <div
          class="relative flex items-center justify-center"
          style={`width: ${getRadius(b.value) * 2}px; height: ${getRadius(b.value) * 2}px`}
          onclick={() => selectBubble(b)}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              selectBubble(b)
            }
          }}
          role="button"
          tabindex={interactive ? 0 : -1}
          aria-label={b.name}
        >
          {#if b.pulse}
            <span
              class="absolute inline-flex size-full animate-ping rounded-full opacity-40"
              style={`background-color: ${getBubbleColor(b)}`}
            ></span>
          {/if}

          <div class="absolute inset-0 rounded-full opacity-25" style={`background-color: ${getBubbleColor(b)}`}></div>

          <div
            class="relative flex size-4/5 items-center justify-center rounded-full border border-white/40 shadow-sm backdrop-blur-[1px] transition-[background-color,box-shadow]"
            style={`background-color: ${getBubbleColor(b)}; box-shadow: ${activeId === b.id ? `0 0 16px ${getBubbleColor(b)}` : 'none'}`}
          >
            {#if getRadius(b.value) >= 20}
              <span class="px-1 text-center font-mono text-[10px] font-bold text-white drop-shadow-xs">
                {b.formattedValue || b.value}
              </span>
            {:else}
              <span class="size-1.5 rounded-full bg-white shadow-xs"></span>
            {/if}
          </div>
        </div>
      </MapMarker>
    {/each}
  </Map>

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

  {#if activeBubble}
    <div
      class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full ring-2 ring-white/20" style={`background-color: ${getBubbleColor(activeBubble)}`}></span>
            <span class="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              {activeBubble.category || 'Node'}
            </span>
          </div>
          <h4 class="text-foreground mt-0.5 text-sm font-semibold">
            {activeBubble.name}
          </h4>
        </div>
        <button type="button" class="text-muted-foreground hover:text-foreground text-xs" onclick={clearSelection}>
          ✕
        </button>
      </div>

      <div class="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs">
        <span class="text-muted-foreground">Magnitude</span>
        <span class="text-foreground font-semibold">
          {activeBubble.formattedValue || activeBubble.value.toLocaleString()}
        </span>
      </div>

      {#if activeBubble.description}
        <p class="text-muted-foreground mt-1.5 text-xs leading-relaxed">
          {activeBubble.description}
        </p>
      {/if}
    </div>
  {/if}

  {#if showLegend && bubbles.length > 0}
    <div
      class="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-3 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex"
    >
      <span class="text-muted-foreground font-mono text-[11px]">{legendTitle}</span>
      <div class="flex items-center gap-2">
        <span class="bg-muted-foreground/40 size-2 rounded-full"></span>
        <span class="text-muted-foreground font-mono text-[10px]">{minValue.toLocaleString()}</span>
        <span class="bg-muted-foreground/60 size-4 rounded-full"></span>
        <span class="text-foreground font-mono text-[10px] font-semibold">{maxValue.toLocaleString()}</span>
      </div>
    </div>
  {/if}
</div>
