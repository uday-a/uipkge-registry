<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type * as L from 'leaflet'

  export interface LeafletTooltipProps {
    /** [lng, lat] — standalone tooltip on the map. Omit inside a layer to bind to it. */
    lngLat?: [number, number]
    offset?: [number, number]
    direction?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto'
    permanent?: boolean
    sticky?: boolean
    opacity?: number
    className?: string
    interactive?: boolean
    children?: Snippet
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { defined, loadLeaflet, toLatLng, useLeafletMap, useParentLeafletLayer } from './leaflet-context.svelte'

  let {
    lngLat,
    offset,
    direction,
    permanent,
    sticky,
    opacity,
    className,
    interactive,
    children,
  }: LeafletTooltipProps = $props()

  const mapCtx = useLeafletMap()
  const parentLayer = useParentLeafletLayer()
  let el = $state<HTMLElement | null>(null)
  let tooltip: L.Tooltip | null = null
  let boundTo: L.Layer | null = null

  $effect(() => {
    const m = mapCtx.map
    const layer = parentLayer?.current ?? null
    const node = el
    if (!m || !node) return
    let alive = true
    void (async () => {
      const Ll = await loadLeaflet()
      if (!alive) return
      const options = defined({ offset, direction, permanent, sticky, opacity, className, interactive })
      if (layer) {
        if (boundTo && boundTo !== layer) {
          try {
            boundTo.unbindTooltip()
          } catch {
            /* already gone */
          }
        }
        boundTo = layer
        layer.bindTooltip(node, options)
        return
      }
      if (lngLat && !tooltip) {
        tooltip = Ll.tooltip(options).setLatLng(toLatLng(lngLat)).setContent(node)
        tooltip.addTo(m)
      }
    })()
    return () => {
      alive = false
    }
  })

  onDestroy(() => {
    try {
      boundTo?.unbindTooltip()
      tooltip?.remove()
    } catch {
      /* map already destroyed */
    }
    boundTo = null
    tooltip = null
  })
</script>

<div bind:this={el} class="uipkge-leaflet-tooltip-src">{@render children?.()}</div>
