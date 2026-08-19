<script setup lang="ts">
import { watch } from "vue";
import type * as L from "leaflet";
import { defined, toLatLng, useLeafletLayer } from "./leaflet-context";

defineOptions({ name: "LeafletCircleMarker" });

const props = defineProps<{
  /** [lng, lat] — Mapbox order. */
  center: [number, number];
  /** Radius in pixels. */
  radius?: number;
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string | number[];
  fill?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  className?: string;
}>();

const emit = defineEmits<{ (e: "click", ev: L.LeafletMouseEvent): void }>();

const pathOptions = () =>
  defined({
    color: props.color,
    weight: props.weight,
    opacity: props.opacity,
    dashArray: props.dashArray,
    fill: props.fill,
    fillColor: props.fillColor,
    fillOpacity: props.fillOpacity,
    className: props.className,
    interactive: true,
  } as L.CircleMarkerOptions);

const layer = useLeafletLayer((map, L) => {
  const marker = L.circleMarker(toLatLng(props.center), {
    ...pathOptions(),
    radius: props.radius,
  });
  marker.on("click", (ev) => emit("click", ev));
  return marker;
});

watch(
  () => props.center,
  (v) => {
    if (v) layer.value?.setLatLng(toLatLng(v));
  },
);
watch(
  () => props.radius,
  (v) => {
    if (v !== undefined) layer.value?.setRadius(v);
  },
);
watch(
  () => [
    props.color,
    props.weight,
    props.opacity,
    props.fill,
    props.fillColor,
    props.fillOpacity,
    props.dashArray,
  ],
  () => layer.value?.setStyle(pathOptions()),
);
</script>

<template>
  <div class="hidden"><slot /></div>
</template>
