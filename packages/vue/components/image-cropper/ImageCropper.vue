<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    aspectRatio?: number;
    minZoom?: number;
    maxZoom?: number;
    disabled?: boolean;
    showZoom?: boolean;
    rounded?: "lg" | "full";
    class?: HTMLAttributes["class"];
  }>(),
  {
    alt: "",
    minZoom: 1,
    maxZoom: 4,
    disabled: false,
    showZoom: false,
    rounded: "lg",
  },
);

const zoom = defineModel<number>("zoom", { default: 1 });
const viewportRef = ref<HTMLElement | null>(null);
const imgRef = ref<HTMLImageElement | null>(null);
const pan = ref({ x: 0, y: 0 });
const natural = ref({ w: 0, h: 0 });
const dragging = ref(false);
const lastPointer = ref({ x: 0, y: 0 });

function coverScale(vw: number, vh: number, nw: number, nh: number) {
  if (!nw || !nh) return 1;
  return Math.max(vw / nw, vh / nh);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function setZoom(value: number) {
  zoom.value = clamp(value, props.minZoom, props.maxZoom);
  nextTick(clampPan);
}

function onZoomInput(e: Event) {
  setZoom(Number((e.target as HTMLInputElement).value));
}

function clampPan() {
  const el = viewportRef.value;
  if (!el || !natural.value.w) return;
  const vw = el.clientWidth;
  const vh = el.clientHeight;
  const scale =
    coverScale(vw, vh, natural.value.w, natural.value.h) * zoom.value;
  const dw = natural.value.w * scale;
  const dh = natural.value.h * scale;
  const maxX = Math.abs(vw - dw) / 2;
  const maxY = Math.abs(vh - dh) / 2;
  pan.value = {
    x: clamp(pan.value.x, -maxX, maxX),
    y: clamp(pan.value.y, -maxY, maxY),
  };
}

const imgStyle = computed(() => {
  const el = viewportRef.value;
  const nw = natural.value.w;
  const nh = natural.value.h;
  if (!el || !nw) return { transform: "translate(-50%, -50%)" };
  const vw = el.clientWidth;
  const vh = el.clientHeight;
  const scale = coverScale(vw, vh, nw, nh) * zoom.value;
  return {
    width: `${nw * scale}px`,
    height: `${nh * scale}px`,
    transform: `translate(calc(-50% + ${pan.value.x}px), calc(-50% + ${pan.value.y}px))`,
  };
});

function onLoad() {
  const img = imgRef.value;
  if (!img) return;
  natural.value = { w: img.naturalWidth, h: img.naturalHeight };
  pan.value = { x: 0, y: 0 };
  nextTick(clampPan);
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return;
  dragging.value = true;
  lastPointer.value = { x: e.clientX, y: e.clientY };
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return;
  pan.value = {
    x: pan.value.x + (e.clientX - lastPointer.value.x),
    y: pan.value.y + (e.clientY - lastPointer.value.y),
  };
  lastPointer.value = { x: e.clientX, y: e.clientY };
  clampPan();
}

function onPointerUp(e: PointerEvent) {
  dragging.value = false;
  try {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  } catch {
    /* already released */
  }
}

function onWheel(e: WheelEvent) {
  if (props.disabled) return;
  e.preventDefault();
  setZoom(zoom.value + (e.deltaY > 0 ? -0.12 : 0.12));
}

watch(zoom, () => nextTick(clampPan));

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return;
  const step = 8;
  if (e.key === "ArrowLeft")
    pan.value = { ...pan.value, x: pan.value.x - step };
  if (e.key === "ArrowRight")
    pan.value = { ...pan.value, x: pan.value.x + step };
  if (e.key === "ArrowUp") pan.value = { ...pan.value, y: pan.value.y - step };
  if (e.key === "ArrowDown")
    pan.value = { ...pan.value, y: pan.value.y + step };
  if (e.key === "+" || e.key === "=") setZoom(zoom.value + 0.2);
  if (e.key === "-" || e.key === "_") setZoom(zoom.value - 0.2);
  clampPan();
}

function getCroppedCanvas() {
  const el = viewportRef.value;
  const img = imgRef.value;
  if (!el || !img || !natural.value.w) return null;
  const vw = el.clientWidth;
  const vh = el.clientHeight;
  const scale =
    coverScale(vw, vh, natural.value.w, natural.value.h) * zoom.value;
  const dw = natural.value.w * scale;
  const dh = natural.value.h * scale;
  const left = (vw - dw) / 2 + pan.value.x;
  const top = (vh - dh) / 2 + pan.value.y;
  const sx = -left / scale;
  const sy = -top / scale;
  const sw = vw / scale;
  const sh = vh / scale;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sw));
  canvas.height = Math.max(1, Math.round(sh));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function getCroppedBlob(type = "image/png", quality?: number) {
  return new Promise<Blob | null>((resolve) => {
    const canvas = getCroppedCanvas();
    if (!canvas) {
      resolve(null);
      return;
    }
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

defineExpose({ getCroppedCanvas, getCroppedBlob });

onBeforeUnmount(() => {
  dragging.value = false;
});
</script>

<template>
  <div
    data-uipkge
    data-slot="image-cropper"
    :class="cn('flex w-full max-w-md flex-col gap-3', props.class)"
  >
    <div
      ref="viewportRef"
      data-slot="image-cropper-viewport"
      role="application"
      aria-label="Image crop viewport"
      tabindex="0"
      :data-disabled="disabled ? '' : undefined"
      :class="
        cn(
          'bg-muted relative w-full overflow-hidden select-none',
          rounded === 'full' ? 'rounded-full' : 'rounded-lg',
          disabled
            ? 'pointer-events-none opacity-60'
            : 'cursor-grab active:cursor-grabbing',
        )
      "
      :style="
        aspectRatio
          ? { aspectRatio: String(aspectRatio) }
          : { aspectRatio: '1' }
      "
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @wheel="onWheel"
      @keydown="onKeydown"
    >
      <img
        ref="imgRef"
        data-slot="image-cropper-image"
        :src="src"
        :alt="alt"
        draggable="false"
        class="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
        :style="imgStyle"
        @load="onLoad"
      />
    </div>
    <label
      v-if="showZoom"
      data-slot="image-cropper-zoom"
      class="text-muted-foreground flex items-center gap-3 text-xs"
    >
      <span class="w-10">Zoom</span>
      <input
        type="range"
        :min="minZoom"
        :max="maxZoom"
        step="0.05"
        :value="zoom"
        class="accent-primary h-1.5 w-full cursor-pointer"
        aria-label="Zoom"
        @input="onZoomInput"
      />
      <span class="w-10 tabular-nums">{{ zoom.toFixed(1) }}×</span>
    </label>
  </div>
</template>
