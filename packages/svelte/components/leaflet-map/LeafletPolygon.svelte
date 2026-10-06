<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type * as L from 'leaflet'

  export interface LeafletPolygonProps {
    /** Ring points as [lng, lat][] — or [lng, lat][][] for holes/multi-polygons. */
    lngLatPath: [number, number][] | [number, number][][]
    color?: string
    weight?: number
    opacity?: number
    lineCap?: 'butt' | 'round' | 'square'
    lineJoin?: 'miter' | 'round' | 'bevel'
    dashArray?: string | number[]
    dashOffset?: string
    fill?: boolean
    fillColor?: string
    fillOpacity?: number
    className?: string
    children?: Snippet
    onclick?: (ev: L.LeafletMouseEvent) => void
  }
</script>

<script lang="ts">
  import { defined, toLatLngs, useLeafletLayer } from './leaflet-context.svelte'

  let {
    lngLatPath,
    color,
    weight,
    opacity,
    lineCap,
    lineJoin,
    dashArray,
    dashOffset,
    fill,
    fillColor,
    fillOpacity,
    className,
    children,
    onclick,
  }: LeafletPolygonProps = $props()

  const pathOptions = () =>
    defined({
      color,
      weight,
      opacity,
      lineCap,
      lineJoin,
      dashArray,
      dashOffset,
      fill,
      fillColor,
      fillOpacity,
      className,
      interactive: true,
    } as L.PolylineOptions)

  const layer = useLeafletLayer((map, Ll) => {
    const polygon = Ll.polygon(toLatLngs(lngLatPath) as L.LatLngExpression[], pathOptions())
    polygon.on('click', (ev) => onclick?.(ev))
    return polygon
  })

  $effect(() => {
    layer.current?.setLatLngs(toLatLngs(lngLatPath) as L.LatLngExpression[])
  })

  $effect(() => {
    // Touch every style prop so the effect re-runs when any of them changes.
    void [color, weight, opacity, fill, fillColor, fillOpacity, dashArray]
    layer.current?.setStyle(pathOptions())
  })
</script>

<div class="hidden">{@render children?.()}</div>
