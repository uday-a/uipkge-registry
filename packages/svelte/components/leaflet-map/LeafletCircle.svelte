<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type * as L from 'leaflet'

  export interface LeafletCircleProps {
    /** [lng, lat] — Mapbox order. */
    center: [number, number]
    /** Radius in meters. */
    radius?: number
    color?: string
    weight?: number
    opacity?: number
    dashArray?: string | number[]
    fill?: boolean
    fillColor?: string
    fillOpacity?: number
    className?: string
    children?: Snippet
    onclick?: (ev: L.LeafletMouseEvent) => void
  }
</script>

<script lang="ts">
  import { defined, toLatLng, useLeafletLayer } from './leaflet-context.svelte'

  let {
    center,
    radius,
    color,
    weight,
    opacity,
    dashArray,
    fill,
    fillColor,
    fillOpacity,
    className,
    children,
    onclick,
  }: LeafletCircleProps = $props()

  const pathOptions = () =>
    defined({
      color,
      weight,
      opacity,
      dashArray,
      fill,
      fillColor,
      fillOpacity,
      className,
      interactive: true,
    } as L.CircleMarkerOptions)

  const layer = useLeafletLayer((map, Ll) => {
    const circle = Ll.circle(toLatLng(center), { ...pathOptions(), radius })
    circle.on('click', (ev) => onclick?.(ev))
    return circle
  })

  $effect(() => {
    if (center) layer.current?.setLatLng(toLatLng(center))
  })

  $effect(() => {
    if (radius !== undefined) layer.current?.setRadius(radius)
  })

  $effect(() => {
    // Touch every style prop so the effect re-runs when any of them changes.
    void [color, weight, opacity, fill, fillColor, fillOpacity, dashArray]
    layer.current?.setStyle(pathOptions())
  })
</script>

<div class="hidden">{@render children?.()}</div>
