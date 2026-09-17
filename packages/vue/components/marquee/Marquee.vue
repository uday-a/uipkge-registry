<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    /** Scroll axis. */
    orientation?: "horizontal" | "vertical";
    /** Travel direction. */
    direction?: "left" | "right" | "up" | "down";
    /** Animation duration in seconds. Lower = faster. */
    speed?: number;
    /** Pause the animation on hover. */
    pauseOnHover?: boolean;
    /** Gap between repeated content groups (px). */
    gap?: number;
    /** Number of times the slot content is duplicated for a seamless loop. */
    repeat?: number;
    /** Hard pause the animation. */
    paused?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    orientation: "horizontal",
    direction: "left",
    speed: 20,
    pauseOnHover: false,
    gap: 16,
    repeat: 2,
    paused: false,
  },
);

const isVertical = computed(() => props.orientation === "vertical");
const reverse = computed(
  () => props.direction === "right" || props.direction === "down",
);

const durationStyle = computed(() => `${props.speed}s`);
const gapStyle = computed(() => `${props.gap}px`);

const containerClass = computed(() =>
  cn(
    "group flex overflow-hidden",
    isVertical.value ? "flex-col" : "flex-row",
    props.pauseOnHover
      ? "hover:[&>[data-slot=marquee-track]]:[animation-play-state:paused]"
      : "",
    props.class,
  ),
);

const trackClass = computed(() =>
  cn(
    "flex shrink-0",
    isVertical.value ? "flex-col" : "flex-row",
    props.paused ? "![animation-play-state:paused]" : "",
  ),
);
</script>

<template>
  <div
    data-uipkge
    data-slot="marquee"
    :data-orientation="orientation"
    :data-direction="direction"
    :class="containerClass"
    :style="{
      '--marquee-gap': gapStyle,
    }"
    role="region"
    aria-roledescription="marquee"
  >
    <div
      v-for="i in repeat"
      :key="i"
      data-slot="marquee-track"
      :class="trackClass"
      :style="{
        gap: 'var(--marquee-gap)',
        animationName: isVertical ? 'uipkge-marquee-y' : 'uipkge-marquee-x',
        animationDuration: `${props.speed}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationDirection: reverse ? 'reverse' : 'normal',
      }"
      :aria-hidden="i > 1 ? 'true' : undefined"
    >
      <slot />
    </div>
  </div>
</template>

<style>
/* Global keyframes — must NOT be scoped so the inline animationName can find them */
@keyframes uipkge-marquee-x {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes uipkge-marquee-y {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="marquee-track"] {
    animation: none !important;
  }
}
</style>
