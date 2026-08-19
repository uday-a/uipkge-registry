<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    min?: number;
    max?: number;
    step?: number;
    size?: number;
    strokeWidth?: number;
    valueColor?: string;
    rangeColor?: string;
    disabled?: boolean;
    readonly?: boolean;
    showValue?: boolean;
    /** Accessible name for the slider. Prefer over a visible label when none is nearby. */
    ariaLabel?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    size: 100,
    strokeWidth: 14,
    valueColor: "var(--primary)",
    rangeColor: "var(--muted)",
    disabled: false,
    readonly: false,
    showValue: true,
  },
);

const emits = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "change", value: number): void;
}>();

const svg = ref<SVGSVGElement | null>(null);
const isDragging = ref(false);

const value = computed(() => clamp(props.modelValue, props.min, props.max));
const percent = computed(() => {
  if (props.max === props.min) return 0;
  return (value.value - props.min) / (props.max - props.min);
});

const startAngle = -Math.PI * 0.75;
const endAngle = Math.PI * 0.75;
const sweep = endAngle - startAngle;

const rangePath = computed(() => arcPath(50, 50, 40, startAngle, endAngle));
const valuePath = computed(() =>
  arcPath(50, 50, 40, startAngle, startAngle + sweep * percent.value),
);

function arcPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2);
  const y2 = cy + r * Math.sin(a2);
  const large = a2 - a1 > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function snap(v: number) {
  const stepped =
    Math.round((v - props.min) / props.step) * props.step + props.min;
  return clamp(stepped, props.min, props.max);
}

function setValue(v: number) {
  if (props.disabled || props.readonly) return;
  const next = snap(v);
  if (next === props.modelValue) return;
  emits("update:modelValue", next);
  emits("change", next);
}

function angleFromEvent(e: PointerEvent): number {
  const rect = svg.value!.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return Math.atan2(e.clientY - cy, e.clientX - cx);
}

function angleToValue(angle: number): number {
  let a = angle - startAngle;
  if (a < 0) a += Math.PI * 2;
  if (a > sweep) {
    return a < (Math.PI * 2 + sweep) / 2 ? props.max : props.min;
  }
  return props.min + (a / sweep) * (props.max - props.min);
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled || props.readonly) return;
  (e.target as Element).setPointerCapture(e.pointerId);
  isDragging.value = true;
  setValue(angleToValue(angleFromEvent(e)));
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return;
  setValue(angleToValue(angleFromEvent(e)));
}

function onPointerUp(e: PointerEvent) {
  if (!isDragging.value) return;
  isDragging.value = false;
  (e.target as Element).releasePointerCapture(e.pointerId);
}

function onKeyDown(e: KeyboardEvent) {
  if (props.disabled || props.readonly) return;
  const big = props.step * 10;
  switch (e.key) {
    case "ArrowUp":
    case "ArrowRight":
      e.preventDefault();
      setValue(value.value + props.step);
      break;
    case "ArrowDown":
    case "ArrowLeft":
      e.preventDefault();
      setValue(value.value - props.step);
      break;
    case "PageUp":
      e.preventDefault();
      setValue(value.value + big);
      break;
    case "PageDown":
      e.preventDefault();
      setValue(value.value - big);
      break;
    case "Home":
      e.preventDefault();
      setValue(props.min);
      break;
    case "End":
      e.preventDefault();
      setValue(props.max);
      break;
  }
}

function onWheel(e: WheelEvent) {
  if (props.disabled || props.readonly) return;
  // Value change handled here; preventDefault is applied by the non-passive
  // native listener below (Vue's @wheel can be passive in some environments).
  setValue(value.value + (e.deltaY < 0 ? props.step : -props.step));
}

// Non-passive wheel listener so preventDefault actually blocks page scroll.
let wheelHandler: ((e: WheelEvent) => void) | null = null;
onMounted(() => {
  const node = svg.value;
  if (!node) return;
  wheelHandler = (e: WheelEvent) => {
    if (props.disabled || props.readonly) return;
    e.preventDefault();
  };
  node.addEventListener("wheel", wheelHandler, { passive: false });
});
onBeforeUnmount(() => {
  if (svg.value && wheelHandler)
    svg.value.removeEventListener("wheel", wheelHandler);
});
</script>

<template>
  <svg
    ref="svg"
    data-uipkge
    data-slot="knob"
    :class="
      cn(
        'focus-visible:ring-ring inline-block touch-none rounded-full outline-none select-none focus-visible:ring-2',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && !readonly && 'cursor-pointer',
        props.class,
      )
    "
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    role="slider"
    :aria-label="ariaLabel ?? 'Value'"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="value"
    :aria-disabled="disabled || undefined"
    :aria-readonly="readonly || undefined"
    :tabindex="disabled ? -1 : 0"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @keydown="onKeyDown"
    @wheel="onWheel"
  >
    <path
      :d="rangePath"
      :stroke="rangeColor"
      :stroke-width="strokeWidth"
      fill="none"
      stroke-linecap="round"
    />
    <path
      :d="valuePath"
      :stroke="valueColor"
      :stroke-width="strokeWidth"
      fill="none"
      stroke-linecap="round"
    />
    <text
      v-if="showValue"
      x="50"
      y="55"
      text-anchor="middle"
      font-size="18"
      class="fill-foreground font-medium"
    >
      <slot name="value" :value="value">{{ value }}</slot>
    </text>
  </svg>
</template>
