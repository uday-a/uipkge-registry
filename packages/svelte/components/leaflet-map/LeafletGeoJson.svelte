<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type * as L from 'leaflet'

  export interface LeafletGeoJsonProps {
    /** GeoJSON FeatureCollection / Feature / geometry. */
    geojson: GeoJSON.GeoJSON
    /** Leaflet GeoJSON options: `style`, `pointToLayer`, `onEachFeature`, `filter`, `coordsToLatLng`. */
    options?: L.GeoJSONOptions
    children?: Snippet
    onclick?: (ev: L.LeafletMouseEvent) => void
  }
</script>

<script lang="ts">
  import { useLeafletLayer } from './leaflet-context.svelte'

  let { geojson, options, children, onclick }: LeafletGeoJsonProps = $props()

  const layer = useLeafletLayer((map, Ll) => {
    const gj = Ll.geoJSON(geojson as any, options)
    gj.on('click', (ev) => onclick?.(ev))
    return gj
  })

  $effect(() => {
    const v = geojson
    if (!layer.current || !v) return
    layer.current.clearLayers()
    layer.current.addData(v as any)
  })
</script>

<div class="hidden">{@render children?.()}</div>
