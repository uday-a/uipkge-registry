<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import type * as L from "leaflet";
import {
  defined,
  loadLeaflet,
  toLatLng,
  useLeafletMap,
  useParentLeafletLayer,
} from "./leaflet-context";

defineOptions({ name: "LeafletTooltip" });

const props = withDefaults(
  defineProps<{
    /** [lng, lat] — standalone tooltip on the map. Omit inside a layer to bind to it. */
    lngLat?: [number, number];
    offset?: [number, number];
    direction?: "top" | "bottom" | "left" | "right" | "center" | "auto";
    permanent?: boolean;
    sticky?: boolean;
    opacity?: number;
    className?: string;
    interactive?: boolean;
  }>(),
  {},
);

const map = useLeafletMap();
const parentLayer = useParentLeafletLayer();
const el = ref<HTMLElement | null>(null);
let tooltip: L.Tooltip | null = null;
let boundTo: L.Layer | null = null;

watch(
  [map, () => parentLayer?.value],
  async ([m, layer]) => {
    if (!m || !el.value) return;
    const L = await loadLeaflet();
    if (layer) {
      boundTo = layer;
      layer.bindTooltip(el.value, defined({ ...props, offset: props.offset }));
      return;
    }
    if (props.lngLat && !tooltip) {
      tooltip = L.tooltip(defined({ ...props, offset: props.offset }))
        .setLatLng(toLatLng(props.lngLat))
        .setContent(el.value);
      tooltip.addTo(m);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  try {
    boundTo?.unbindTooltip();
    tooltip?.remove();
  } catch {
    /* map already destroyed */
  }
});
</script>

<template>
  <div ref="el" class="uipkge-leaflet-tooltip-src"><slot /></div>
</template>
