<script setup lang="ts">
import { watch } from 'vue'
import type * as L from 'leaflet'
import { defined, toLatLngs, useLeafletLayer } from './leaflet-context'

defineOptions({ name: 'LeafletPolygon' })

const props = defineProps<{
  /** Ring points as [lng, lat][] — or [lng, lat][][] for holes/multi-polygons. */
  lngLatPath: [number, number][] | [number, number][][]
  color?: string
  weight?: number
  opacity?: number
  lineCap?: 'butt' | 'round' | 'square'
  lineJoin?: 'miter' | 'round' | 'bevel'
  dashArray?: string | number[]
  dashOffset?: string
  fill?: boolean
  fillColor?: string
  fillOpacity?: number
  className?: string
}>()

const emit = defineEmits<{ (e: 'click', ev: L.LeafletMouseEvent): void }>()

const pathOptions = () =>
  defined({
    color: props.color,
    weight: props.weight,
    opacity: props.opacity,
    lineCap: props.lineCap,
    lineJoin: props.lineJoin,
    dashArray: props.dashArray,
    dashOffset: props.dashOffset,
    fill: props.fill,
    fillColor: props.fillColor,
    fillOpacity: props.fillOpacity,
    className: props.className,
    interactive: true,
  } as L.PolylineOptions)

const layer = useLeafletLayer((map, L) => {
  const polygon = L.polygon(toLatLngs(props.lngLatPath) as L.LatLngExpression[], pathOptions())
  polygon.on('click', (ev) => emit('click', ev))
  return polygon
})

watch(
  () => props.lngLatPath,
  (v) => layer.value?.setLatLngs(toLatLngs(v) as L.LatLngExpression[]),
  { deep: true },
)

watch(
  () => [props.color, props.weight, props.opacity, props.fill, props.fillColor, props.fillOpacity, props.dashArray],
  () => layer.value?.setStyle(pathOptions()),
)
</script>

<template>
  <div class="hidden"><slot /></div>
</template>
