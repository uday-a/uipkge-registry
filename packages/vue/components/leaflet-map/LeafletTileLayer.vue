<script setup lang="ts">
import { watch } from 'vue'
import { defined, useLeafletLayer } from './leaflet-context'

defineOptions({ name: 'LeafletTileLayer' })

const props = defineProps<{
  /** Raster tile URL template ({z}/{x}/{y}, optional {s} subdomains + {r} retina). */
  url: string
  attribution?: string
  subdomains?: string | string[]
  minZoom?: number
  maxZoom?: number
  opacity?: number
  zIndex?: number
  tms?: boolean
}>()

const layer = useLeafletLayer((map, L) =>
  L.tileLayer(
    props.url,
    defined({
      attribution: props.attribution,
      subdomains: props.subdomains,
      minZoom: props.minZoom,
      maxZoom: props.maxZoom,
      opacity: props.opacity,
      zIndex: props.zIndex,
      tms: props.tms,
    }),
  ),
)

watch(
  () => props.url,
  (url) => {
    if (url) layer.value?.setUrl(url)
  },
)
watch(
  () => props.opacity,
  (v) => {
    if (v !== undefined) layer.value?.setOpacity(v)
  },
)
watch(
  () => props.zIndex,
  (v) => {
    if (v !== undefined) layer.value?.setZIndex(v)
  },
)
</script>

<template>
  <div class="hidden" />
</template>
