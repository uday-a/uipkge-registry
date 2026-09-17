<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    items: T[];
    itemSize: number | ((item: T, index: number) => number);
    height: number | string;
    overscan?: number;
    keyField?: string;
    direction?: "vertical" | "horizontal";
    as?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    overscan: 3,
    keyField: "id",
    direction: "vertical",
    as: "div",
  },
);

const emits = defineEmits<{
  (e: "scroll", event: Event): void;
  (e: "range-change", range: [number, number]): void;
}>();

const scrollEl = ref<HTMLElement | null>(null);
const scrollOffset = ref(0);
const viewportSize = ref(
  typeof props.height === "number"
    ? props.height
    : Number.parseInt(String(props.height), 10) || 0,
);

const isVertical = computed(() => props.direction === "vertical");

const offsets = computed<number[]>(() => {
  const out: number[] = [0];
  for (let i = 0; i < props.items.length; i++) {
    const s =
      typeof props.itemSize === "function"
        ? props.itemSize(props.items[i]!, i)
        : props.itemSize;
    out.push(out[i]! + s);
  }
  return out;
});

const totalSize = computed(() => offsets.value[props.items.length] ?? 0);

function findIndex(target: number): number {
  const o = offsets.value;
  let lo = 0;
  let hi = o.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (o[mid]! <= target) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

const range = computed<[number, number]>(() => {
  if (!props.items.length || viewportSize.value === 0) return [0, 0];
  const start = Math.max(0, findIndex(scrollOffset.value) - props.overscan);
  const end = Math.min(
    props.items.length,
    findIndex(scrollOffset.value + viewportSize.value) + 1 + props.overscan,
  );
  return [start, end];
});

const visible = computed(() =>
  props.items.slice(range.value[0], range.value[1]),
);
const offsetStart = computed(() => offsets.value[range.value[0]] ?? 0);

watch(range, (r) => emits("range-change", r));

function onScroll(e: Event) {
  const el = e.target as HTMLElement;
  scrollOffset.value = isVertical.value ? el.scrollTop : el.scrollLeft;
  emits("scroll", e);
}

function measure() {
  if (!scrollEl.value) return;
  const measured = isVertical.value
    ? scrollEl.value.clientHeight
    : scrollEl.value.clientWidth;
  const fallback =
    typeof props.height === "number"
      ? props.height
      : Number.parseInt(String(props.height), 10) || 0;
  viewportSize.value = measured || fallback;
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  measure();
  if (typeof ResizeObserver !== "undefined" && scrollEl.value) {
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(scrollEl.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

watch(() => props.height, measure, { flush: "post" });

function sizeOf(item: T, i: number) {
  return typeof props.itemSize === "function"
    ? props.itemSize(item, i)
    : props.itemSize;
}

function getKey(item: T, fallback: number): string | number {
  const k = item[props.keyField];
  return k ?? fallback;
}

function scrollToOffset(px: number) {
  if (!scrollEl.value) return;
  if (isVertical.value) scrollEl.value.scrollTop = px;
  else scrollEl.value.scrollLeft = px;
}

function scrollToIndex(
  i: number,
  options: { align?: "start" | "center" | "end" } = {},
) {
  const align = options.align ?? "start";
  const start = offsets.value[i] ?? 0;
  const size = (offsets.value[i + 1] ?? start) - start;
  let target = start;
  if (align === "center") target = start - viewportSize.value / 2 + size / 2;
  else if (align === "end") target = start - viewportSize.value + size;
  scrollToOffset(Math.max(0, target));
}

function getVisibleRange(): [number, number] {
  return range.value;
}

defineExpose({ scrollToOffset, scrollToIndex, getVisibleRange });

const containerStyle = computed((): Record<string, string> => {
  const h =
    typeof props.height === "number" ? `${props.height}px` : props.height;
  return isVertical.value
    ? { height: h, overflowY: "auto" }
    : { width: h, overflowX: "auto" };
});

const innerStyle = computed((): Record<string, string> =>
  isVertical.value
    ? { height: `${totalSize.value}px`, position: "relative", width: "100%" }
    : { width: `${totalSize.value}px`, position: "relative", height: "100%" },
);

const offsetStyle = computed((): Record<string, string> =>
  isVertical.value
    ? { transform: `translateY(${offsetStart.value}px)` }
    : {
        transform: `translateX(${offsetStart.value}px)`,
        height: "100%",
        display: "flex",
      },
);
</script>

<template>
  <component
    :is="as"
    ref="scrollEl"
    data-uipkge
    data-slot="virtual-list"
    :class="cn('w-full', props.class)"
    :style="containerStyle"
    @scroll.passive="onScroll"
  >
    <div :style="innerStyle">
      <div :style="offsetStyle">
        <div
          v-for="(item, i) in visible"
          :key="getKey(item, range[0] + i)"
          :style="
            isVertical
              ? { height: sizeOf(item, range[0] + i) + 'px' }
              : { width: sizeOf(item, range[0] + i) + 'px', flexShrink: 0 }
          "
        >
          <slot :item="item" :index="range[0] + i" />
        </div>
      </div>
    </div>
  </component>
</template>
