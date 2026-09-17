<script setup lang="ts">
import { computed, ref, type Component, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

export interface DockItem {
  /** Unique id for the item. */
  id: string;
  /** Lucide icon component to render. */
  icon: Component;
  /** Label shown in the tooltip on hover. */
  label: string;
  /** Click handler. */
  handler?: () => void;
  /** Whether this item is the active one. */
  active?: boolean;
}

interface Props {
  /** Dock items. */
  items: DockItem[];
  /** Base icon size in pixels. Default 48. */
  baseSize?: number;
  /** Peak magnification scale as the cursor hovers directly over an item. Default 1.6. */
  magnification?: number;
  /** Pixel radius within which items magnify. Default 120. */
  distance?: number;
  /** Orientation. Only 'horizontal' (bottom dock) is supported. */
  orientation?: "horizontal";
  /** Show the tooltip label on hover. Default true. */
  showTooltips?: boolean;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  baseSize: 48,
  magnification: 1.6,
  distance: 120,
  orientation: "horizontal",
  showTooltips: true,
});

const mouseX = ref<number | null>(null);
const hoveredId = ref<string | null>(null);

function onMove(e: MouseEvent) {
  mouseX.value = e.clientX;
}

function onLeave() {
  mouseX.value = null;
  hoveredId.value = null;
}

function sizeFor(item: DockItem, index: number): number {
  if (mouseX.value === null) return props.baseSize;
  const el = itemRefs.value[index];
  if (!el) return props.baseSize;
  const rect = el.getBoundingClientRect();
  const center = rect.left + rect.width / 2;
  const dist = Math.abs(mouseX.value - center);
  if (dist > props.distance) return props.baseSize;
  // Cosine bell curve so magnification falls off smoothly.
  const t = 1 - dist / props.distance;
  const scale = 1 + (props.magnification - 1) * t;
  return props.baseSize * scale;
}

const itemRefs = ref<HTMLElement[]>([]);

function setRef(el: any, index: number) {
  if (el) itemRefs.value[index] = el as HTMLElement;
}

const sizes = computed(() =>
  props.items.map((_, i) => sizeFor(props.items[i]!, i)),
);
</script>

<template>
  <div
    data-uipkge
    data-slot="dock"
    :data-orientation="orientation"
    :class="
      cn(
        'border-border/60 bg-background/60 flex items-end justify-center gap-3 rounded-2xl border px-3 py-2 backdrop-blur-md',
        props.class,
      )
    "
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id"
      :ref="(el) => setRef(el, index)"
      data-slot="dock-item"
      :data-active="item.active ? '' : undefined"
      role="button"
      tabindex="0"
      :aria-label="item.label"
      :aria-current="item.active ? 'true' : undefined"
      class="group focus-visible:ring-ring/50 relative flex shrink-0 cursor-pointer items-end justify-center rounded-xl outline-none focus-visible:ring-[3px]"
      @mouseenter="hoveredId = item.id"
      @mouseleave="hoveredId = null"
      @click="item.handler?.()"
      @keydown.enter="item.handler?.()"
      @keydown.space.prevent="item.handler?.()"
    >
      <!-- Tooltip -->
      <span
        v-if="showTooltips && hoveredId === item.id"
        class="border-border bg-popover text-popover-foreground pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md border px-2 py-1 text-xs whitespace-nowrap shadow-md"
      >
        {{ item.label }}
      </span>

      <!-- Icon tile -->
      <span
        :class="
          cn(
            'flex items-center justify-center rounded-xl border transition-[width,height] duration-100 ease-out will-change-[width,height]',
            item.active
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border/50 bg-muted/40 text-foreground hover:bg-muted',
          )
        "
        :style="{ width: `${sizes[index]}px`, height: `${sizes[index]}px` }"
      >
        <component
          :is="item.icon"
          :style="{
            width: `${sizes[index] * 0.5}px`,
            height: `${sizes[index] * 0.5}px`,
          }"
        />
      </span>

      <!-- Active indicator dot -->
      <span
        v-if="item.active"
        class="bg-primary absolute -bottom-2 size-1 rounded-full"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
