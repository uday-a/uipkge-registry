<script setup lang="ts">
import { computed, useId } from "vue";
import type { TargetRect } from "./use-tour-target";

const props = defineProps<{
  rect: TargetRect | null;
  zIndex: number;
  opacity?: number;
  padding?: number;
  radius?: number;
}>();

const opacity = computed(() => props.opacity ?? 0.5);
const padding = computed(() => props.padding ?? 4);
const radius = computed(() => props.radius ?? 6);
// Unique mask id so multiple open tours (or other SVG masks on the page) never collide.
const maskId = `uipkge-tour-mask-${useId()}`;

const cutout = computed(() => {
  const r = props.rect;
  if (!r) return null;
  return {
    x: r.x - padding.value,
    y: r.y - padding.value,
    w: r.width + padding.value * 2,
    h: r.height + padding.value * 2,
  };
});

/**
 * Clip-path leaves a hole over the target so pointer events pass through to the
 * highlighted element. SVG mask alone does not punch a hit-test hole.
 */
const hitClipPath = computed(() => {
  const c = cutout.value;
  if (!c) return undefined;
  const { x, y, w, h } = c;
  return `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${x}px ${y}px, ${x}px ${y + h}px, ${x + w}px ${y + h}px, ${x + w}px ${y}px, ${x}px ${y}px)`;
});

const reduceMotion = computed(() => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
});
</script>

<template>
  <!-- Visual dim with rounded cutout (decorative only — no hit testing). -->
  <svg
    class="pointer-events-none fixed inset-0"
    :style="{
      zIndex,
      '--tour-padding': `${padding}px`,
      '--tour-radius': `${radius}px`,
    }"
    width="100%"
    height="100%"
    aria-hidden="true"
  >
    <defs>
      <mask :id="maskId">
        <rect width="100%" height="100%" fill="white" />
        <rect
          v-if="cutout"
          :x="cutout.x"
          :y="cutout.y"
          :width="cutout.w"
          :height="cutout.h"
          :rx="radius"
          fill="black"
        />
      </mask>
    </defs>
    <rect
      width="100%"
      height="100%"
      :fill="`rgba(0, 0, 0, ${opacity})`"
      :mask="`url(#${maskId})`"
      :style="reduceMotion ? undefined : { transition: 'all 200ms ease' }"
    />
  </svg>
  <!-- Hit layer: blocks clicks outside the cutout; hole is click-through. -->
  <div
    class="fixed inset-0"
    aria-hidden="true"
    :style="{
      zIndex,
      clipPath: hitClipPath,
      // Transparent fill still receives pointer events where not clipped.
      background: 'transparent',
    }"
  />
</template>
