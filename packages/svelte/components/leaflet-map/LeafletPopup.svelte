<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type * as L from 'leaflet'

  export interface LeafletPopupProps {
    /** [lng, lat] — standalone popup on the map. Omit inside a layer to bind to it. */
    lngLat?: [number, number]
    maxWidth?: number
    /** Minimum popup width. Defaults to 200 — keeps card-style content from collapsing narrow. */
    minWidth?: number
    offset?: [number, number]
    className?: string
    autoClose?: boolean
    closeOnClick?: boolean
    closeButton?: boolean
    keepInView?: boolean
    children?: Snippet
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { defined, loadLeaflet, toLatLng, useLeafletMap, useParentLeafletLayer } from './leaflet-context.svelte'

  let {
    lngLat,
    maxWidth,
    minWidth = 200,
    offset,
    className,
    autoClose,
    closeOnClick,
    closeButton,
    keepInView,
    children,
  }: LeafletPopupProps = $props()

  const mapCtx = useLeafletMap()
  const parentLayer = useParentLeafletLayer()
  let el = $state<HTMLElement | null>(null)
  let popup: L.Popup | null = null
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
      const options = defined({ maxWidth, minWidth, offset, className, autoClose, closeOnClick, closeButton, keepInView })
      if (layer) {
        // Re-bind if the parent layer instance was recreated.
        if (boundTo && boundTo !== layer) {
          try {
            boundTo.unbindPopup()
          } catch {
            /* already gone */
          }
        }
        boundTo = layer
        layer.bindPopup(node, options)
        return
      }
      if (lngLat && !popup) {
        popup = Ll.popup(options).setLatLng(toLatLng(lngLat)).setContent(node)
        popup.openOn(m)
      }
    })()
    return () => {
      alive = false
    }
  })

  onDestroy(() => {
    try {
      boundTo?.unbindPopup()
      popup?.remove()
    } catch {
      /* map already destroyed */
    }
    boundTo = null
    popup = null
  })
</script>

<div bind:this={el} class="uipkge-leaflet-popup-src">{@render children?.()}</div>
