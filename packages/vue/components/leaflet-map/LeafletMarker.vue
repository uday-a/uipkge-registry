<script setup lang="ts">
import { Comment, Text, computed, ref, useSlots, watch } from 'vue'
import type * as L from 'leaflet'
import { defined, toLatLng, useLeafletLayer } from './leaflet-context'

type MarkerAnchor =
  'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

const props = withDefaults(
  defineProps<{
    /** [lng, lat] — Mapbox order, matching the `map` component's MapMarker. */
    lngLat: [number, number]
    /** Which edge/corner of the marker content sits on the coordinate. */
    anchor?: MarkerAnchor
    draggable?: boolean
    opacity?: number
    zIndexOffset?: number
    title?: string
    alt?: string
  }>(),
  { anchor: 'center' },
)

const emit = defineEmits<{
  (e: 'click', ev: L.LeafletMouseEvent): void
  (e: 'ready', marker: L.Marker): void
}>()

const slots = useSlots()
const el = ref<HTMLElement | null>(null)

// LeafletPopup / LeafletTooltip children bind to the marker; every other slot
// node becomes custom div-icon content (a real element — listeners survive).
const hasIconContent = computed(() =>
  (slots.default?.() ?? []).some((n) => {
    if (n.type === Comment || n.type === Text) return false
    const name = (n.type as any)?.__name ?? (n.type as any)?.name
    return name !== 'LeafletPopup' && name !== 'LeafletTooltip'
  }),
)

const layer = useLeafletLayer((map, L) => {
  const options: L.MarkerOptions = defined({
    interactive: true,
    draggable: props.draggable,
    opacity: props.opacity,
    zIndexOffset: props.zIndexOffset,
    title: props.title,
    alt: props.alt,
  })
  if (hasIconContent.value && el.value) {
    options.icon = L.divIcon({ className: 'uipkge-leaflet-div-icon', html: el.value })
  }
  const marker = L.marker(toLatLng(props.lngLat), options)
  marker.on('click', (ev) => emit('click', ev))
  return marker
})

watch(
  layer,
  (m) => {
    if (m) emit('ready', m)
  },
  { immediate: true },
)

watch(
  () => props.lngLat,
  (v) => {
    if (v) layer.value?.setLatLng(toLatLng(v))
  },
)
watch(
  () => props.opacity,
  (v) => {
    if (v !== undefined) layer.value?.setOpacity(v)
  },
)
watch(
  () => props.zIndexOffset,
  (v) => {
    if (v !== undefined) layer.value?.setZIndexOffset(v)
  },
)
</script>

<template>
  <div ref="el" class="uipkge-leaflet-anchor" :data-anchor="anchor"><slot /></div>
</template>
