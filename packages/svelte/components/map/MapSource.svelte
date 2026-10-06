<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { AnySourceData, GeoJSONSource } from 'mapbox-gl'

  export interface MapSourceProps {
    id: string
    type?: string
    data?: any
    options?: AnySourceData
    children?: Snippet
  }
</script>

<script lang="ts">
  import { setMapSourceId, useMap } from './map-context.svelte'

  let { id, type, data, options, children }: MapSourceProps = $props()

  const mapCtx = useMap()
  // svelte-ignore state_referenced_locally — the source id is intentionally initial-only (matches Vue's provide).
  setMapSourceId(id)

  function getSourceOptions(): AnySourceData {
    if (options) return options
    return {
      type: (type || 'geojson') as any,
      data,
    }
  }

  function addOrUpdateSource(mapInstance: NonNullable<typeof mapCtx.map>) {
    try {
      if (mapInstance.getSource(id)) {
        const src = mapInstance.getSource(id) as GeoJSONSource | undefined
        if (src && typeof src.setData === 'function' && data) {
          src.setData(data)
        }
        return
      }
      mapInstance.addSource(id, getSourceOptions())
    } catch {
      // Retry on next frame if style is still configuring
    }
  }

  function removeSource(mapInstance: NonNullable<typeof mapCtx.map>) {
    try {
      if (mapInstance.getSource(id)) {
        const layers = mapInstance.getStyle()?.layers || []
        for (const l of layers) {
          if ('source' in l && l.source === id) {
            mapInstance.removeLayer(l.id)
          }
        }
        mapInstance.removeSource(id)
      }
    } catch {
      // Ignored during map destruction
    }
  }

  $effect(() => {
    const mapInstance = mapCtx.map
    if (!mapInstance) return
    if (mapInstance.isStyleLoaded()) {
      addOrUpdateSource(mapInstance)
    } else {
      mapInstance.once('style.load', () => addOrUpdateSource(mapInstance))
      mapInstance.once('load', () => addOrUpdateSource(mapInstance))
    }
    return () => removeSource(mapInstance)
  })

  $effect(() => {
    const newData = data
    const mapInstance = mapCtx.map
    if (!mapInstance || !newData) return
    try {
      const src = mapInstance.getSource(id) as GeoJSONSource | undefined
      if (src && typeof src.setData === 'function') {
        src.setData(newData)
      }
    } catch {
      // Ignored if source not yet ready or re-rendering
    }
  })
</script>

<div {id} style="display: contents">{@render children?.()}</div>
