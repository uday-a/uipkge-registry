<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    /** Bar thickness in pixels. */
    height?: number;
    /** Any CSS color or gradient — applied to `background` verbatim. */
    color?: string;
    /** `fixed` pins to the viewport; `absolute` fills a positioned scrollable parent. */
    position?: "fixed" | "absolute";
    /** Scrollable element to measure. Defaults to the window/document. */
    container?: HTMLElement | null;
    /** Lerp-smooth the displayed value toward the real progress each frame. */
    smooth?: boolean;
  }>(),
  {
    height: 3,
    color: "var(--primary)",
    position: "fixed",
    container: null,
    smooth: true,
  },
);

const progress = ref(0);

let display = 0;
let target = 0;
let rafId: number | null = null;
let boundTarget: EventTarget | null = null;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function readProgress(): number {
  if (props.container) {
    const max = props.container.scrollHeight - props.container.clientHeight;
    return max > 0 ? clamp01(props.container.scrollTop / max) : 0;
  }
  const doc = document.documentElement;
  const scrollTop =
    window.scrollY || doc.scrollTop || document.body.scrollTop || 0;
  const max = doc.scrollHeight - doc.clientHeight;
  return max > 0 ? clamp01(scrollTop / max) : 0;
}

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function tick() {
  display += (target - display) * 0.18;
  progress.value = display;
  if (Math.abs(target - display) < 0.001) {
    display = target;
    progress.value = target;
    rafId = null;
    return;
  }
  rafId = requestAnimationFrame(tick);
}

function sync() {
  target = readProgress();
  if (!props.smooth || prefersReducedMotion()) {
    stopLoop();
    display = target;
    progress.value = target;
    return;
  }
  if (rafId === null) rafId = requestAnimationFrame(tick);
}

function detach() {
  if (boundTarget) boundTarget.removeEventListener("scroll", sync);
  boundTarget = null;
  if (typeof window !== "undefined") window.removeEventListener("resize", sync);
  stopLoop();
}

function attach() {
  if (typeof window === "undefined") return;
  detach();
  boundTarget = props.container ?? window;
  boundTarget.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  // Sync instantly on mount / container swap so the bar never animates up from zero.
  target = readProgress();
  display = target;
  progress.value = target;
}

watch(() => props.container, attach);
onMounted(attach);
onBeforeUnmount(detach);
</script>

<template>
  <div
    data-uipkge
    data-slot="scroll-progress"
    aria-hidden="true"
    :data-position="position"
    :data-smooth="smooth || undefined"
    :class="
      cn(
        'pointer-events-none top-0 left-0 z-50 w-full origin-left',
        position === 'fixed' ? 'fixed' : 'absolute',
        props.class,
      )
    "
    :style="{
      height: `${height}px`,
      background: color,
      transform: `scaleX(${progress})`,
      willChange: 'transform',
    }"
  />
</template>
