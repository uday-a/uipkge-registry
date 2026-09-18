<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import type * as L from 'leaflet'
import { defined, loadLeaflet, toLatLng, useLeafletMap, useParentLeafletLayer } from './leaflet-context'

defineOptions({ name: 'LeafletPopup' })

const props = withDefaults(
  defineProps<{
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
  }>(),
  { minWidth: 200 },
)

const map = useLeafletMap()
const parentLayer = useParentLeafletLayer()
const el = ref<HTMLElement | null>(null)
let popup: L.Popup | null = null
let boundTo: L.Layer | null = null

watch(
  [map, () => parentLayer?.value],
  async ([m, layer]) => {
    if (!m || !el.value) return
    const L = await loadLeaflet()
    if (layer) {
      boundTo = layer
      layer.bindPopup(el.value, defined({ ...props, offset: props.offset }))
      return
    }
    if (props.lngLat && !popup) {
      popup = L.popup(defined({ ...props, offset: props.offset }))
        .setLatLng(toLatLng(props.lngLat))
        .setContent(el.value)
      popup.openOn(m)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  try {
    boundTo?.unbindPopup()
    popup?.remove()
  } catch {
    /* map already destroyed */
  }
})
</script>

<template>
  <div ref="el" class="uipkge-leaflet-popup-src"><slot /></div>
</template>
