<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from "vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    /** Text content for the watermark. Ignored when `image` is set. */
    content?: string;
    /** Image URL. When set, repeats the image instead of text. */
    image?: string;
    /** Rotation angle in degrees. */
    rotate?: number;
    /** Gap between repeats in pixels (both x and y). */
    gap?: number;
    /** Opacity 0-1. */
    opacity?: number;
    /** Font size in pixels (text only). */
    fontSize?: number;
    /** Font color (text only). */
    color?: string;
    /** Font family (text only). */
    fontFamily?: string;
    /** Font weight (text only). */
    fontWeight?: number | string;
    /** z-index of the overlay. */
    zIndex?: number;
    /** When true, the overlay captures pointer events (blocks interaction). Default false (pointer-events-none). */
    interactive?: boolean;
  }>(),
  {
    content: "",
    rotate: -22,
    gap: 100,
    opacity: 0.08,
    fontSize: 16,
    color: "currentColor",
    fontFamily: "sans-serif",
    fontWeight: "normal",
    zIndex: 9,
    interactive: false,
  },
);

const containerRef = ref<HTMLElement | null>(null);
const width = ref(0);
const height = ref(0);
let resizeObserver: ResizeObserver | null = null;

function measure() {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  width.value = rect.width;
  height.value = rect.height;
}

onMounted(() => {
  measure();
  if (typeof ResizeObserver !== "undefined" && containerRef.value) {
    resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(containerRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

// Build a tiled SVG data URL that repeats the text/image across a tile of
// size (gap + contentSize). The SVG is then used as a background-image on
// the overlay div, rotated to the requested angle.
const watermarkUrl = computed(() => {
  if (!width.value || !height.value) return "";
  const gap = props.gap;
  const fontSize = props.fontSize;
  const text = props.content || "";
  const rotate = props.rotate;

  if (props.image) {
    // For images we tile the image at its natural size within the gap.
    const tile = gap + 100;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}" viewBox="0 0 ${tile} ${tile}">
  <image href="${props.image}" x="${gap / 2}" y="${gap / 2}" width="100" height="100" opacity="${props.opacity}" transform="rotate(${rotate} ${tile / 2} ${tile / 2})"/>
</svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }

  if (!text) return "";

  // Estimate text width — rough heuristic, good enough for tiling.
  const textWidth = text.length * fontSize * 0.6;
  const tileW = gap + textWidth;
  const tileH = gap + fontSize * 1.5;

  const escapedText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${tileH}" viewBox="0 0 ${tileW} ${tileH}">
  <text x="${gap / 2}" y="${gap / 2 + fontSize}" font-size="${fontSize}" font-family="${props.fontFamily}" font-weight="${props.fontWeight}" fill="${props.color}" opacity="${props.opacity}" transform="rotate(${rotate} ${gap / 2} ${gap / 2 + fontSize / 2})">${escapedText}</text>
</svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
});

const overlayStyle = computed<CSSProperties>(() => ({
  backgroundImage: watermarkUrl.value
    ? `url("${watermarkUrl.value}")`
    : undefined,
  backgroundRepeat: "repeat",
  zIndex: props.zIndex,
  pointerEvents: props.interactive ? "auto" : "none",
}));
</script>

<template>
  <div
    ref="containerRef"
    data-uipkge
    data-slot="watermark"
    :class="cn('relative', props.class)"
  >
    <slot />
    <div
      data-uipkge
      data-slot="watermark-overlay"
      class="absolute inset-0 overflow-hidden"
      :style="overlayStyle"
      aria-hidden="true"
    />
  </div>
</template>
