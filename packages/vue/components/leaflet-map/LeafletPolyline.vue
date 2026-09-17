<script setup lang="ts">
import { watch } from "vue";
import type * as L from "leaflet";
import { defined, toLatLngs, useLeafletLayer } from "./leaflet-context";

defineOptions({ name: "LeafletPolyline" });

const props = defineProps<{
  /** Path points as [lng, lat][] — or [lng, lat][][] for multi-part lines. */
  lngLatPath: [number, number][] | [number, number][][];
  color?: string;
  weight?: number;
  opacity?: number;
  lineCap?: "butt" | "round" | "square";
  lineJoin?: "miter" | "round" | "bevel";
  dashArray?: string | number[];
  dashOffset?: string;
  smoothFactor?: number;
  noClip?: boolean;
  className?: string;
}>();

const emit = defineEmits<{ (e: "click", ev: L.LeafletMouseEvent): void }>();

const pathOptions = () =>
  defined({
    color: props.color,
    weight: props.weight,
    opacity: props.opacity,
    lineCap: props.lineCap,
    lineJoin: props.lineJoin,
    dashArray: props.dashArray,
    dashOffset: props.dashOffset,
    smoothFactor: props.smoothFactor,
    noClip: props.noClip,
    className: props.className,
    interactive: true,
  } as L.PolylineOptions);

const layer = useLeafletLayer((map, L) => {
  const line = L.polyline(
    toLatLngs(props.lngLatPath) as L.LatLngExpression[],
    pathOptions(),
  );
  line.on("click", (ev) => emit("click", ev));
  return line;
});

watch(
  () => props.lngLatPath,
  (v) => layer.value?.setLatLngs(toLatLngs(v) as L.LatLngExpression[]),
  { deep: true },
);

watch(
  () => [
    props.color,
    props.weight,
    props.opacity,
    props.dashArray,
    props.dashOffset,
    props.lineCap,
    props.lineJoin,
  ],
  () => layer.value?.setStyle(pathOptions()),
);
</script>

<template>
  <div class="hidden"><slot /></div>
</template>
