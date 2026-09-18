<script setup lang="ts">
import { inject, onMounted, onUnmounted, unref, watch } from 'vue'
import { useMap } from '@studiometa/vue-mapbox-gl'
import type { AnyLayer } from 'mapbox-gl'

const props = defineProps<{
  id: string
  /** Optional: `options` carries its own `type`, so only the flat form needs it. */
  type?: string
  source?: string
  paint?: Record<string, any>
  layout?: Record<string, any>
  beforeId?: string
  options?: any
}>()

const parentSourceId = inject<string | undefined>('uipkge-map-source-id', undefined)
const { map } = useMap()

function getLayerConfig(): AnyLayer {
  if (props.options) return { ...props.options, id: props.id }
  return {
    id: props.id,
    type: props.type as any,
    source: props.source || parentSourceId,
    paint: props.paint || {},
    layout: props.layout || {},
  } as AnyLayer
}

function addLayerSafe() {
  const mapInstance = unref(map)
  if (!mapInstance) return
  try {
    if (mapInstance.getLayer(props.id)) {
      mapInstance.removeLayer(props.id)
    }
    const config = getLayerConfig()
    if (config.source && !mapInstance.getSource(config.source as string)) {
      // Source not ready yet, wait for sourcedata event
      const checkAndAdd = () => {
        try {
          if (!mapInstance.getLayer(props.id) && mapInstance.getSource(config.source as string)) {
            mapInstance.addLayer(config, props.beforeId)
            mapInstance.off('sourcedata', checkAndAdd)
          }
        } catch {
          // Ignored
        }
      }
      mapInstance.on('sourcedata', checkAndAdd)
      return
    }
    mapInstance.addLayer(config, props.beforeId)
  } catch {
    // Retry if style loading
  }
}

watch(
  () => props.paint,
  (newPaint) => {
    const mapInstance = unref(map)
    if (!mapInstance || !newPaint) return
    try {
      if (mapInstance.getLayer(props.id)) {
        for (const [key, value] of Object.entries(newPaint)) {
          // Keys come from a caller-supplied record; mapbox generics the name
          // against a closed union of every paint property, which a plain
          // string cannot satisfy.
          ;(mapInstance.setPaintProperty as (layer: string, name: string, value: unknown) => void)(props.id, key, value)
        }
      }
    } catch {
      // Ignored
    }
  },
  { deep: true },
)

onMounted(() => {
  const mapInstance = unref(map)
  if (!mapInstance) return
  if (mapInstance.isStyleLoaded && mapInstance.isStyleLoaded()) {
    addLayerSafe()
  } else {
    mapInstance.once('style.load', addLayerSafe)
    mapInstance.once('load', addLayerSafe)
  }
})

onUnmounted(() => {
  const mapInstance = unref(map)
  if (!mapInstance) return
  try {
    if (mapInstance.getLayer(props.id)) {
      mapInstance.removeLayer(props.id)
    }
  } catch {
    // Ignored
  }
})
</script>

<template>
  <div :id="id" style="display: none" />
</template>
