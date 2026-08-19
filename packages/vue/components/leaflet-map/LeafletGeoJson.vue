<script setup lang="ts">
import { watch } from "vue";
import type * as L from "leaflet";
import { useLeafletLayer } from "./leaflet-context";

defineOptions({ name: "LeafletGeoJson" });

const props = defineProps<{
  /** GeoJSON FeatureCollection / Feature / geometry. */
  geojson: GeoJSON.GeoJSON;
  /** Leaflet GeoJSON options: `style`, `pointToLayer`, `onEachFeature`, `filter`, `coordsToLatLng`. */
  options?: L.GeoJSONOptions;
}>();

const emit = defineEmits<{ (e: "click", ev: L.LeafletMouseEvent): void }>();

const layer = useLeafletLayer((map, L) => {
  const gj = L.geoJSON(props.geojson as any, props.options);
  gj.on("click", (ev) => emit("click", ev));
  return gj;
});

watch(
  () => props.geojson,
  (v) => {
    if (!layer.value || !v) return;
    layer.value.clearLayers();
    layer.value.addData(v as any);
  },
  { deep: true },
);
</script>

<template>
  <div class="hidden"><slot /></div>
</template>
