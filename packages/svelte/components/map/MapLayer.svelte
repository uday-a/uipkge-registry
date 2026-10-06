<script lang="ts" module>
  import type { AnyLayer } from 'mapbox-gl'

  export interface MapLayerProps {
    id: string
    /** Optional: `options` carries its own `type`, so only the flat form needs it. */
    type?: string
    source?: string
    paint?: Record<string, any>
    layout?: Record<string, any>
    beforeId?: string
    options?: any
  }
</script>

<script lang="ts">
  import { useMap, useMapSourceId } from './map-context.svelte'

  let { id, type, source, paint, layout, beforeId, options }: MapLayerProps = $props()

  const parentSourceId = useMapSourceId()
  const mapCtx = useMap()

  function getLayerConfig(): AnyLayer {
    if (options) return { ...options, id }
    return {
      id,
      type: type as any,
      source: source || parentSourceId,
      paint: paint || {},
      layout: layout || {},
    } as AnyLayer
  }

  function addLayerSafe(mapInstance: NonNullable<typeof mapCtx.map>) {
    try {
      if (mapInstance.getLayer(id)) {
        mapInstance.removeLayer(id)
      }
      const config = getLayerConfig()
      if (config.source && !mapInstance.getSource(config.source as string)) {
        // Source not ready yet, wait for sourcedata event
        const checkAndAdd = () => {
          try {
            if (!mapInstance.getLayer(id) && mapInstance.getSource(config.source as string)) {
              mapInstance.addLayer(config, beforeId)
              mapInstance.off('sourcedata', checkAndAdd)
            }
          } catch {
            // Ignored
          }
        }
        mapInstance.on('sourcedata', checkAndAdd)
        return
      }
      mapInstance.addLayer(config, beforeId)
    } catch {
      // Retry if style loading
    }
  }

  $effect(() => {
    const mapInstance = mapCtx.map
    if (!mapInstance) return
    if (mapInstance.isStyleLoaded()) {
      addLayerSafe(mapInstance)
    } else {
      mapInstance.once('style.load', () => addLayerSafe(mapInstance))
      mapInstance.once('load', () => addLayerSafe(mapInstance))
    }
    return () => {
      try {
        if (mapInstance.getLayer(id)) {
          mapInstance.removeLayer(id)
        }
      } catch {
        // Ignored
      }
    }
  })

  $effect(() => {
    const newPaint = paint
    const mapInstance = mapCtx.map
    if (!mapInstance || !newPaint) return
    try {
      if (mapInstance.getLayer(id)) {
        for (const [key, value] of Object.entries(newPaint)) {
          // Keys come from a caller-supplied record; mapbox generics the name
          // against a closed union of every paint property, which a plain
          // string cannot satisfy.
          ;(mapInstance.setPaintProperty as (layer: string, name: string, value: unknown) => void)(id, key, value)
        }
      }
    } catch {
      // Ignored
    }
  })
</script>

<div {id} style="display: none"></div>
