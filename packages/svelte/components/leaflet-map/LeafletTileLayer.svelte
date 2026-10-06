<script lang="ts" module>
  import type * as L from 'leaflet'

  export interface LeafletTileLayerProps {
    /** Raster tile URL template ({z}/{x}/{y}, optional {s} subdomains + {r} retina). */
    url: string
    attribution?: string
    subdomains?: string | string[]
    minZoom?: number
    maxZoom?: number
    opacity?: number
    zIndex?: number
    tms?: boolean
  }
</script>

<script lang="ts">
  import { defined, useLeafletLayer } from './leaflet-context.svelte'

  let { url, attribution, subdomains, minZoom, maxZoom, opacity, zIndex, tms }: LeafletTileLayerProps = $props()

  const layer = useLeafletLayer((map, Ll) =>
    Ll.tileLayer(
      url,
      defined({
        attribution,
        subdomains,
        minZoom,
        maxZoom,
        opacity,
        zIndex,
        tms,
      }),
    ),
  )

  $effect(() => {
    if (url) layer.current?.setUrl(url)
  })

  $effect(() => {
    if (opacity !== undefined) layer.current?.setOpacity(opacity)
  })

  $effect(() => {
    if (zIndex !== undefined) layer.current?.setZIndex(zIndex)
  })
</script>

<div class="hidden"></div>
