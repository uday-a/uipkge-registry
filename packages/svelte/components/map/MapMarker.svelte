<script lang="ts" module>
  import type { Snippet } from 'svelte'
  // Value import in the module script (visible to the instance script) — both
  // scripts share one scope, so a second instance import would collide.
  import mapboxgl from 'mapbox-gl'

  export interface MapMarkerProps {
    /** [lng, lat] position. */
    lngLat: [number, number]
    /** Default-pin colour (only when no `children` custom content is given). */
    color?: string
    /** Scale factor for the default pin. */
    scale?: number
    draggable?: boolean
    rotation?: number
    rotationAlignment?: 'map' | 'viewport' | 'auto'
    pitchAlignment?: 'map' | 'viewport' | 'auto'
    /** Which part of the marker sits on the coordinates. Passed to Mapbox. */
    anchor?:
      | 'center'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right'
    /** Class applied to the custom-content wrapper (only rendered with `children`). */
    class?: string
    /** Custom marker content. Omit for the default Mapbox pin. */
    children?: Snippet
    /** Fires after the marker is dragged. */
    ondragend?: (ev: { target: mapboxgl.Marker }) => void
    onclick?: (ev: MouseEvent) => void
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { useMap } from './map-context.svelte'

  let {
    lngLat,
    color,
    scale,
    draggable,
    rotation,
    rotationAlignment,
    pitchAlignment,
    anchor,
    class: className,
    children,
    ondragend,
    onclick,
  }: MapMarkerProps = $props()

  const mapCtx = useMap()
  let el = $state<HTMLElement | null>(null)
  let marker: mapboxgl.Marker | null = null

  $effect(() => {
    const mapInstance = mapCtx.map
    const node = el
    // `children` decides default pin vs custom element; read it so the marker
    // rebuilds if custom content appears after mount. Everything else is
    // initial-only — position syncs via the effect below, so option/callback
    // identity churn must not recreate the marker.
    const hasCustomContent = Boolean(children)
    if (!mapInstance || (hasCustomContent && !node)) return
    const initial = untrack(() => ({
      lngLat,
      color,
      scale,
      draggable,
      rotation,
      rotationAlignment,
      pitchAlignment,
      anchor,
      ondragend,
      onclick,
    }))
    marker = new mapboxgl.Marker({
      ...(hasCustomContent && node ? { element: node } : {}),
      ...(initial.color ? { color: initial.color } : {}),
      ...(initial.scale !== undefined ? { scale: initial.scale } : {}),
      ...(initial.draggable !== undefined ? { draggable: initial.draggable } : {}),
      ...(initial.rotation !== undefined ? { rotation: initial.rotation } : {}),
      ...(initial.rotationAlignment ? { rotationAlignment: initial.rotationAlignment } : {}),
      ...(initial.pitchAlignment ? { pitchAlignment: initial.pitchAlignment } : {}),
      ...(initial.anchor ? { anchor: initial.anchor } : {}),
    })
      .setLngLat(initial.lngLat)
      .addTo(mapInstance)
    if (initial.ondragend) {
      const cb = initial.ondragend
      marker.on('dragend', () => cb({ target: marker! }))
    }
    const markerNode = marker.getElement()
    const handleClick = (ev: MouseEvent) => initial.onclick?.(ev)
    if (initial.onclick) markerNode.addEventListener('click', handleClick)
    const instance = marker
    return () => {
      if (onclick) markerNode.removeEventListener('click', handleClick)
      instance.remove()
      if (marker === instance) marker = null
    }
  })

  $effect(() => {
    if (marker && lngLat) marker.setLngLat(lngLat)
  })
</script>

{#if children}
  <!-- Plain wrapper (no display:contents): Mapbox positions this element with
       a transform, which needs a real box — same box the `class` prop styles. -->
  <div bind:this={el} class={className}>{@render children()}</div>
{/if}
