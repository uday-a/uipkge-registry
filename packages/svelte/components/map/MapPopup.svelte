<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface MapPopupProps {
    /** [lng, lat] anchor. */
    lngLat: [number, number]
    closeButton?: boolean
    closeOnClick?: boolean
    closeOnMove?: boolean
    maxWidth?: string
    className?: string
    offset?: number | [number, number]
    children?: Snippet
    onopen?: () => void
    onclose?: () => void
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import mapboxgl from 'mapbox-gl'
  import { useMap } from './map-context.svelte'

  let {
    lngLat,
    closeButton,
    closeOnClick,
    closeOnMove,
    maxWidth,
    className,
    offset,
    children,
    onopen,
    onclose,
  }: MapPopupProps = $props()

  const mapCtx = useMap()
  let el = $state<HTMLElement | null>(null)
  let popup: mapboxgl.Popup | null = null

  $effect(() => {
    const mapInstance = mapCtx.map
    const node = el
    if (!mapInstance || !node) return
    // Options are initial-only; position syncs via the effect below.
    const initial = untrack(() => ({
      lngLat,
      closeButton,
      closeOnClick,
      closeOnMove,
      maxWidth,
      className,
      offset,
      onopen,
      onclose,
    }))
    popup = new mapboxgl.Popup({
      ...(initial.closeButton !== undefined ? { closeButton: initial.closeButton } : {}),
      ...(initial.closeOnClick !== undefined ? { closeOnClick: initial.closeOnClick } : {}),
      ...(initial.closeOnMove !== undefined ? { closeOnMove: initial.closeOnMove } : {}),
      ...(initial.maxWidth ? { maxWidth: initial.maxWidth } : {}),
      ...(initial.className ? { className: initial.className } : {}),
      ...(initial.offset !== undefined ? { offset: initial.offset } : {}),
    })
      .setLngLat(initial.lngLat)
      .setDOMContent(node)
      .addTo(mapInstance)
    if (initial.onopen) popup.on('open', initial.onopen)
    if (initial.onclose) popup.on('close', initial.onclose)
    const instance = popup
    return () => {
      instance.remove()
      if (popup === instance) popup = null
    }
  })

  $effect(() => {
    if (popup && lngLat) popup.setLngLat(lngLat)
  })
</script>

<div bind:this={el}>{@render children?.()}</div>
