<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    /** 0–100 progress value. Use with v-model or drive via the composable. */
    modelValue?: number;
    /** Bar color. Accepts any CSS color value. */
    color?: string;
    /** Bar height in px. */
    height?: number;
    /** Indeterminate sliding animation (ignores modelValue). */
    indeterminate?: boolean;
    /** Anchor the bar to the top or bottom of the viewport. */
    position?: "top" | "bottom";
    /** Show a spinner at the trailing edge of the bar. */
    spinner?: boolean;
    /** Error state tints the bar. */
    error?: boolean;
    /** Hide the bar entirely (e.g. when finished). */
    hidden?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    modelValue: 0,
    color: "",
    height: 3,
    indeterminate: false,
    position: "top",
    spinner: false,
    error: false,
    hidden: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "finish"): void;
}>();

const internal = ref(props.modelValue);
/** Imperative fail() tints the bar without requiring the error prop. */
const internalError = ref(false);
/** After finish/fail, fade out then reset. */
const fading = ref(false);
let raf: number | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
/** Bumped on start/finish/fail so in-flight trickle frames abort. */
let generation = 0;

watch(
  () => props.modelValue,
  (v) => {
    internal.value = v;
  },
);

const pct = computed(() => Math.min(100, Math.max(0, internal.value)));
const isError = computed(() => props.error || internalError.value);
const barColor = computed(
  () =>
    props.color || (isError.value ? "var(--destructive)" : "var(--primary)"),
);
const visible = computed(
  () =>
    !props.hidden &&
    !fading.value &&
    (props.indeterminate || internal.value > 0),
);

function clearTimers() {
  if (raf) {
    cancelAnimationFrame(raf);
    raf = null;
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function set(v: number) {
  internal.value = v;
  emit("update:modelValue", v);
}

// Imperative API exposed for the composable / parent to drive the bar.
function start(from = 20) {
  clearTimers();
  generation += 1;
  const gen = generation;
  internalError.value = false;
  fading.value = false;
  set(from);
  // Trickle toward ~95 while the consumer is still working (classic NProgress).
  trickle(gen);
}

/** Slowly creep the bar toward a soft ceiling so progress feels alive. */
function trickle(gen: number) {
  if (raf) cancelAnimationFrame(raf);
  const step = () => {
    if (gen !== generation || internalError.value || fading.value) return;
    if (internal.value >= 95) return;
    // Asymptotic crawl — slows as it approaches the ceiling.
    const next = Math.min(
      95,
      internal.value + (95 - internal.value) * 0.04 + 0.15,
    );
    set(next);
    if (next < 95 && gen === generation) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

function inc(amount = 10) {
  if (fading.value) return;
  set(Math.min(99, internal.value + amount));
}

function finish() {
  clearTimers();
  generation += 1;
  internalError.value = false;
  set(100);
  emit("finish");
  // Hold full bar briefly, then fade + reset so the next start() is clean.
  hideTimer = setTimeout(() => {
    fading.value = true;
    hideTimer = setTimeout(() => {
      internal.value = 0;
      emit("update:modelValue", 0);
      fading.value = false;
      hideTimer = null;
    }, 300);
  }, 200);
}

function fail() {
  clearTimers();
  generation += 1;
  internalError.value = true;
  internal.value = 100;
  emit("update:modelValue", 100);
  emit("finish");
  hideTimer = setTimeout(() => {
    fading.value = true;
    hideTimer = setTimeout(() => {
      internal.value = 0;
      internalError.value = false;
      emit("update:modelValue", 0);
      fading.value = false;
      hideTimer = null;
    }, 300);
  }, 400);
}

onBeforeUnmount(() => {
  clearTimers();
});

defineExpose({ start, finish, fail, error: fail, inc, set });
</script>

<template>
  <div
    data-uipkge
    data-slot="loading-bar"
    :data-position="position"
    :data-state="
      isError ? 'error' : indeterminate ? 'indeterminate' : 'determinate'
    "
    :class="
      cn(
        'pointer-events-none fixed left-0 z-[9999] w-full transition-opacity duration-300',
        position === 'top' ? 'top-0' : 'bottom-0',
        visible ? 'opacity-100' : 'opacity-0',
        props.class,
      )
    "
    :style="{ height: `${height}px` }"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="indeterminate ? undefined : pct"
    :aria-busy="visible && !isError ? true : undefined"
    :aria-hidden="!visible"
  >
    <!-- Track -->
    <div class="absolute inset-0 bg-transparent" />

    <!-- Determinate bar -->
    <div
      v-if="!indeterminate"
      data-slot="loading-bar-fill"
      class="absolute inset-y-0 left-0 transition-[width] duration-200 ease-out"
      :style="{ width: `${pct}%`, backgroundColor: barColor }"
    >
      <div
        v-if="spinner"
        data-slot="loading-bar-spinner"
        class="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent"
        :style="{ color: barColor }"
      />
    </div>

    <!-- Indeterminate sliding bar -->
    <div
      v-else
      data-slot="loading-bar-indeterminate"
      class="loading-bar-indeterminate absolute inset-y-0 w-1/3"
      :style="{ backgroundColor: barColor }"
    >
      <div
        v-if="spinner"
        data-slot="loading-bar-spinner"
        class="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent"
        :style="{ color: barColor }"
      />
    </div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .loading-bar-indeterminate {
    animation: loading-bar-slide 1.2s ease-in-out infinite;
  }
}

@keyframes loading-bar-slide {
  0% {
    left: -33%;
  }
  100% {
    left: 100%;
  }
}
</style>
