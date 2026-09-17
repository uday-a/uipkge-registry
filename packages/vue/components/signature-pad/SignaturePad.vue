<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Eraser } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { signaturePadVariants } from "./signature-pad.variants";

interface Props {
  modelValue?: string | null;
  width?: number;
  height?: number;
  penColor?: string;
  penThickness?: number;
  backgroundColor?: string;
  exportFormat?: string;
  disabled?: boolean;
  readonly?: boolean;
  showClearButton?: boolean;
  clearLabel?: string;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  width: 400,
  height: 200,
  // Theme tokens are OKLCH (`--foreground` / `--background`). Resolve via
  // getComputedStyle — canvas cannot parse `hsl(var(--…))` or bare `var(--…)`.
  penColor: "",
  penThickness: 2,
  backgroundColor: "",
  exportFormat: "image/png",
  disabled: false,
  readonly: false,
  showClearButton: true,
  clearLabel: "Clear",
});

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  begin: [];
  end: [];
  change: [value: string | null];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const pointCount = ref(0);
const hasInk = ref(false);
const ctx = ref<CanvasRenderingContext2D | null>(null);
let lastX = 0;
let lastY = 0;

const isInteractive = computed(() => !props.disabled && !props.readonly);

/** Resolve theme CSS variables (and legacy `hsl(var(--x))`) to a paint color canvas accepts. */
function resolveColor(input: string | undefined, cssVar: string): string {
  let candidate = (input || "").trim();
  if (!candidate) candidate = `var(${cssVar})`;
  // Legacy shadcn hsl() wrapper around a CSS variable — unwrap.
  const hslWrapped = candidate.match(/^hsl\(\s*(var\(--[^)]+\))\s*\)$/i);
  if (hslWrapped) candidate = hslWrapped[1];
  if (candidate.startsWith("var(")) {
    const name = candidate.match(/var\((--[^),]+)/)?.[1];
    if (name && typeof document !== "undefined") {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      if (v) return v;
    }
  }
  return candidate;
}

function setupCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = props.width * dpr;
  canvas.height = props.height * dpr;
  canvas.style.width = `${props.width}px`;
  canvas.style.height = `${props.height}px`;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.scale(dpr, dpr);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = resolveColor(props.penColor, "--foreground");
  context.lineWidth = props.penThickness;
  context.fillStyle = resolveColor(props.backgroundColor, "--background");
  context.fillRect(0, 0, props.width, props.height);
  ctx.value = context;
  pointCount.value = 0;
  hasInk.value = false;
}

function getPointerPos(e: PointerEvent): { x: number; y: number } {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  // Map CSS pixels → logical canvas coords if the element is CSS-scaled.
  const scaleX = props.width / (rect.width || props.width);
  const scaleY = props.height / (rect.height || props.height);
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

function startDraw(e: PointerEvent) {
  if (!isInteractive.value || !ctx.value) return;
  e.preventDefault();
  isDrawing.value = true;
  const { x, y } = getPointerPos(e);
  lastX = x;
  lastY = y;
  ctx.value.beginPath();
  ctx.value.moveTo(x, y);
  pointCount.value += 1;
  hasInk.value = true;
  emit("begin");
  canvasRef.value?.setPointerCapture(e.pointerId);
}

function draw(e: PointerEvent) {
  if (!isDrawing.value || !ctx.value) return;
  e.preventDefault();
  const { x, y } = getPointerPos(e);
  ctx.value.beginPath();
  ctx.value.moveTo(lastX, lastY);
  ctx.value.lineTo(x, y);
  ctx.value.stroke();
  lastX = x;
  lastY = y;
  pointCount.value += 1;
}

function endDraw(e: PointerEvent) {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  if (ctx.value) ctx.value.closePath();
  canvasRef.value?.releasePointerCapture(e.pointerId);
  exportSignature();
  emit("end");
}

function exportSignature() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  if (!hasInk.value) {
    emit("update:modelValue", null);
    emit("change", null);
    return;
  }
  const dataUrl = canvas.toDataURL(props.exportFormat);
  emit("update:modelValue", dataUrl);
  emit("change", dataUrl);
}

function clear() {
  const canvas = canvasRef.value;
  const context = ctx.value;
  if (!canvas || !context) return;
  context.fillStyle = resolveColor(props.backgroundColor, "--background");
  context.fillRect(0, 0, props.width, props.height);
  pointCount.value = 0;
  hasInk.value = false;
  emit("update:modelValue", null);
  emit("change", null);
}

defineExpose({
  clear,
  exportSignature,
  toDataURL: exportSignature,
  pointCount: computed(() => pointCount.value),
  isEmpty: computed(() => !hasInk.value),
});

onMounted(() => {
  setupCanvas();
});

onBeforeUnmount(() => {
  ctx.value = null;
});

watch(
  () => [
    props.penColor,
    props.penThickness,
    props.backgroundColor,
    props.width,
    props.height,
  ],
  () => {
    setupCanvas();
  },
);
</script>

<template>
  <div
    data-uipkge
    data-slot="signature-pad"
    :data-disabled="disabled ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    :class="cn(signaturePadVariants(), props.class)"
  >
    <canvas
      ref="canvasRef"
      :class="
        cn(
          'block touch-none rounded-md',
          !isInteractive && 'pointer-events-none',
        )
      "
      :style="{ touchAction: 'none' }"
      :aria-label="
        'Signature pad' +
        (disabled ? ' (disabled)' : readonly ? ' (readonly)' : '')
      "
      :aria-disabled="disabled || undefined"
      role="img"
      @pointerdown="startDraw"
      @pointermove="draw"
      @pointerup="endDraw"
      @pointercancel="endDraw"
      @pointerleave="endDraw"
    />
    <div
      v-if="showClearButton && isInteractive"
      class="flex items-center justify-between gap-2 pt-2"
    >
      <span class="text-muted-foreground text-xs tabular-nums"
        >{{ pointCount }} points</span
      >
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-md text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        :disabled="!hasInk"
        @click="clear"
      >
        <Eraser class="size-4" />
        {{ clearLabel }}
      </button>
    </div>
    <slot
      name="actions"
      :clear="clear"
      :export="exportSignature"
      :empty="!hasInk"
    />
  </div>
</template>
