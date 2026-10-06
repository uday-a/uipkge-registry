<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type * as L from 'leaflet'

  export type LeafletMarkerAnchor =
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'

  export interface LeafletMarkerProps {
    /** [lng, lat] — Mapbox order, matching the `map` component's MapMarker. */
    lngLat: [number, number]
    /** Which edge/corner of the marker content sits on the coordinate. */
    anchor?: LeafletMarkerAnchor
    draggable?: boolean
    opacity?: number
    zIndexOffset?: number
    title?: string
    alt?: string
    /** Custom marker HTML. Omit for Leaflet's default pin. */
    icon?: Snippet
    /** Overlay children (`<LeafletPopup>` / `<LeafletTooltip>`) bound to the marker. */
    children?: Snippet
    onclick?: (ev: L.LeafletMouseEvent) => void
    onready?: (marker: L.Marker) => void
  }
</script>

<script lang="ts">
  import { defined, toLatLng, useLeafletLayer } from './leaflet-context.svelte'

  let {
    lngLat,
    anchor = 'center',
    draggable,
    opacity,
    zIndexOffset,
    title,
    alt,
    icon,
    children,
    onclick,
    onready,
  }: LeafletMarkerProps = $props()

  let el = $state<HTMLElement | null>(null)

  const layer = useLeafletLayer((map, Ll) => {
    const options: L.MarkerOptions = defined({
      interactive: true,
      draggable,
      opacity,
      zIndexOffset,
      title,
      alt,
    })
    if (icon && el) {
      options.icon = Ll.divIcon({ className: 'uipkge-leaflet-div-icon', html: el })
    }
    const marker = Ll.marker(toLatLng(lngLat), options)
    marker.on('click', (ev) => onclick?.(ev))
    return marker
  })

  $effect(() => {
    const m = layer.current
    if (m) onready?.(m)
  })

  $effect(() => {
    const v = lngLat
    if (v) layer.current?.setLatLng(toLatLng(v))
  })

  $effect(() => {
    if (opacity !== undefined) layer.current?.setOpacity(opacity)
  })

  $effect(() => {
    if (zIndexOffset !== undefined) layer.current?.setZIndexOffset(zIndexOffset)
  })
</script>

<div bind:this={el} class="uipkge-leaflet-anchor" data-anchor={anchor}>
  {#if icon}
    {@render icon()}
  {/if}
</div>
{#if children}
  <div class="hidden">{@render children()}</div>
{/if}
