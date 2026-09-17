<script setup lang="ts">
import { onMounted, onUnmounted, provide, unref, watch } from "vue";
import { useMap } from "@studiometa/vue-mapbox-gl";
import type { AnySourceData, GeoJSONSource } from "mapbox-gl";

const props = defineProps<{
  id: string;
  type?: string;
  data?: any;
  options?: AnySourceData;
}>();

const { map } = useMap();
provide("uipkge-map-source-id", props.id);

function getSourceOptions(): AnySourceData {
  if (props.options) return props.options;
  return {
    type: (props.type || "geojson") as any,
    data: props.data,
  };
}

watch(
  () => props.data,
  (newData) => {
    const mapInstance = unref(map);
    if (!mapInstance || !newData) return;
    try {
      const src = mapInstance.getSource(props.id) as GeoJSONSource | undefined;
      if (src && typeof src.setData === "function") {
        src.setData(newData);
      }
    } catch {
      // Ignored if source not yet ready or re-rendering
    }
  },
  { deep: true },
);

function addOrUpdateSource() {
  const mapInstance = unref(map);
  if (!mapInstance) return;
  try {
    if (mapInstance.getSource(props.id)) {
      const src = mapInstance.getSource(props.id) as GeoJSONSource | undefined;
      if (src && typeof src.setData === "function" && props.data) {
        src.setData(props.data);
      }
      return;
    }
    mapInstance.addSource(props.id, getSourceOptions());
  } catch {
    // Retry on next frame if style is still configuring
  }
}

onMounted(() => {
  const mapInstance = unref(map);
  if (!mapInstance) return;
  if (mapInstance.isStyleLoaded && mapInstance.isStyleLoaded()) {
    addOrUpdateSource();
  } else {
    mapInstance.once("style.load", addOrUpdateSource);
    mapInstance.once("load", addOrUpdateSource);
  }
});

onUnmounted(() => {
  const mapInstance = unref(map);
  if (!mapInstance) return;
  try {
    if (mapInstance.getSource(props.id)) {
      const layers = mapInstance.getStyle()?.layers || [];
      for (const l of layers) {
        if ("source" in l && l.source === props.id) {
          mapInstance.removeLayer(l.id);
        }
      }
      mapInstance.removeSource(props.id);
    }
  } catch {
    // Ignored during map destruction
  }
});
</script>

<template>
  <div :id="id" style="display: contents">
    <slot />
  </div>
</template>
