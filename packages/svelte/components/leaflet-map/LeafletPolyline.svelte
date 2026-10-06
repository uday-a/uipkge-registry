<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type * as L from 'leaflet'

  export interface LeafletPolylineProps {
    /** Path points as [lng, lat][] — or [lng, lat][][] for multi-part lines. */
    lngLatPath: [number, number][] | [number, number][][]
    color?: string
    weight?: number
    opacity?: number
    lineCap?: 'butt' | 'round' | 'square'
    lineJoin?: 'miter' | 'round' | 'bevel'
    dashArray?: string | number[]
    dashOffset?: string
    smoothFactor?: number
    noClip?: boolean
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
    smoothFactor,
    noClip,
    className,
    children,
    onclick,
  }: LeafletPolylineProps = $props()

  const pathOptions = () =>
    defined({
      color,
      weight,
      opacity,
      lineCap,
      lineJoin,
      dashArray,
      dashOffset,
      smoothFactor,
      noClip,
      className,
      interactive: true,
    } as L.PolylineOptions)

  const layer = useLeafletLayer((map, Ll) => {
    const line = Ll.polyline(toLatLngs(lngLatPath) as L.LatLngExpression[], pathOptions())
    line.on('click', (ev) => onclick?.(ev))
    return line
  })

  $effect(() => {
    layer.current?.setLatLngs(toLatLngs(lngLatPath) as L.LatLngExpression[])
  })

  $effect(() => {
    // Touch every style prop so the effect re-runs when any of them changes.
    void [color, weight, opacity, dashArray, dashOffset, lineCap, lineJoin]
    layer.current?.setStyle(pathOptions())
  })
</script>

<div class="hidden">{@render children?.()}</div>
