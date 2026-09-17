<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import {
  SCROLL_SPY_CONTEXT_KEY,
  resolveScrollSpyColor,
  type ScrollSpyColor,
} from "./context";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  color?: ScrollSpyColor;
}>();

const ctx = inject(SCROLL_SPY_CONTEXT_KEY, null);
if (!ctx)
  throw new Error("ScrollSpyIndicator must be used inside <ScrollSpy>.");

const resolvedColor = computed(
  () => props.color ?? ctx.color.value ?? "primary",
);
const handleColor = computed(() => resolveScrollSpyColor(resolvedColor.value));

interface Marker {
  value: string;
  depth: number;
  x: number;
  y: number;
  top: number;
  bottom: number;
}

const measurePathRef = useTemplateRef<SVGPathElement>("measurePathRef");
const trackPath = ref("");
const pathLength = ref(0);
const activeStart = ref(0);
const activeEnd = ref(0);
const straightHighlight = ref({ top: 0, height: 0, visible: false });
const canAnimate = ref(false);
const activeMarker = ref<Marker | null>(null);

function depthX(
  relDepth: number,
  isRightRail: boolean,
  listWidth: number,
): number {
  if (!isRightRail) {
    if (relDepth <= 1) return 1;
    if (relDepth === 2) return 13;
    if (relDepth === 3) return 21;
    return 21 + (relDepth - 3) * 8;
  }
  // Right side rail
  const base = listWidth - 1;
  if (relDepth <= 1) return base;
  if (relDepth === 2) return base - 12;
  if (relDepth === 3) return base - 20;
  return base - 20 - (relDepth - 3) * 8;
}

function collectMarkers(): Marker[] {
  const list = ctx?.getListEl();
  if (!list || !ctx) return [];
  const listRect = list.getBoundingClientRect();
  const validItems = ctx.items.value.filter((i) => i.el && i.el.isConnected);
  if (validItems.length === 0) return [];

  const isRightRail =
    ctx.position.value === "left" && ctx.railPosition.value === "right";
  const listWidth = listRect.width || 180;

  const minDepth = Math.min(...validItems.map((i) => i.depth));
  const markers: Marker[] = [];

  for (const item of validItems) {
    if (!item.el) continue;
    const rect = item.el.getBoundingClientRect();
    const relDepth = Math.max(1, item.depth - minDepth + 1);
    const top = rect.top - listRect.top;
    const bottom = rect.bottom - listRect.top;
    markers.push({
      value: item.value,
      depth: item.depth,
      x: depthX(relDepth, isRightRail, listWidth),
      y: top + rect.height / 2,
      top,
      bottom,
    });
  }

  return markers.sort((a, b) => a.y - b.y);
}

function buildCircuitPath(
  markers: Marker[],
  endIndex: number,
  rounded: boolean,
  edge: "top" | "bottom",
): string {
  if (markers.length === 0 || endIndex < 0) return "";

  const end = Math.min(endIndex, markers.length - 1);
  const first = markers[0]!;
  const parts: string[] = [`M ${first.x} ${first.top}`];

  for (let i = 0; i <= end; i++) {
    const curr = markers[i]!;

    if (i === end) {
      const targetY = edge === "top" ? curr.top : curr.bottom;
      parts.push(`L ${curr.x} ${targetY}`);
      break;
    }

    const next = markers[i + 1];
    if (!next) {
      parts.push(`L ${curr.x} ${curr.bottom}`);
      break;
    }

    // Always draw down the full height of curr at curr.x first
    parts.push(`L ${curr.x} ${curr.bottom}`);

    if (curr.x === next.x) {
      parts.push(`L ${curr.x} ${next.top}`);
      continue;
    }

    // Smooth monotonic depth transition strictly bounded within [curr.bottom, next.top]
    const gap = Math.max(0, next.top - curr.bottom);
    const absDx = Math.abs(next.x - curr.x);
    const transitionH = Math.min(gap, absDx);

    if (transitionH <= 1) {
      parts.push(`L ${next.x} ${next.top}`);
      continue;
    }

    const y1 = curr.bottom + (gap - transitionH) / 2;
    let y2 = y1 + transitionH;
    if (next.top - y2 <= 0.5) {
      y2 = next.top;
    }

    // 1. Straight rail down to y1 at curr.x
    if (y1 - curr.bottom > 0.5) {
      parts.push(`L ${curr.x} ${y1}`);
    }

    // 2. Transition from (curr.x, y1) to (next.x, y2)
    if (rounded) {
      const midY = (y1 + y2) / 2;
      parts.push(`C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${y2}`);
    } else {
      parts.push(`L ${next.x} ${y2}`);
    }

    // 3. Connect to next.top if next.top > y2
    if (next.top - y2 > 0.5) {
      parts.push(`L ${next.x} ${next.top}`);
    }
  }

  return parts.join(" ");
}

function measurePathLength(pathD: string): number {
  const el = measurePathRef.value;
  if (!el || !pathD) return 0;
  el.setAttribute("d", pathD);
  if (typeof el.getTotalLength === "function") {
    try {
      return el.getTotalLength();
    } catch {
      // ignore
    }
  }
  return 100;
}

async function updateGeometry() {
  if (!ctx) return;
  const markers = collectMarkers();
  const activeValue = ctx.activeValue.value;
  const activeIndex = markers.findIndex(
    (m) =>
      m.value === activeValue ||
      m.value.replace(/^#/, "") === activeValue.replace(/^#/, ""),
  );
  const turn = ctx.turn.value;
  const indicator = ctx.indicator.value;
  const isRightRail =
    ctx.position.value === "left" && ctx.railPosition.value === "right";

  if (markers.length === 0) {
    trackPath.value = "";
    pathLength.value = 0;
    activeStart.value = 0;
    activeEnd.value = 0;
    activeMarker.value = null;
    straightHighlight.value = { top: 0, height: 0, visible: false };
    return;
  }

  const first = markers[0]!;
  const last = markers[markers.length - 1]!;

  if (turn === "straight") {
    const railX = isRightRail ? first.x : 1;
    trackPath.value = `M ${railX} ${first.top} L ${railX} ${last.bottom}`;
    pathLength.value = 0;
    activeStart.value = 0;
    activeEnd.value = 0;

    if (indicator === "progress") {
      const list = ctx.getListEl();
      const totalHeight = list ? list.clientHeight : last.bottom - first.top;
      straightHighlight.value = {
        top: first.top,
        height: Math.max(0, totalHeight * ctx.scrollProgress.value),
        visible: true,
      };
      activeMarker.value = null;
      enableAnimation();
      return;
    }

    if (activeIndex < 0) {
      straightHighlight.value = { top: 0, height: 0, visible: false };
      activeMarker.value = null;
      return;
    }

    const active = markers[activeIndex]!;
    activeMarker.value = active;

    const isFillMode =
      indicator === "fill" || (ctx?.keepScrolled.value ?? false);

    if (isFillMode) {
      straightHighlight.value = {
        top: first.top,
        height: Math.max(active.bottom - first.top, 14),
        visible: true,
      };
    } else {
      straightHighlight.value = {
        top: active.top,
        height: Math.max(active.bottom - active.top, 14),
        visible: true,
      };
    }
    enableAnimation();
    return;
  }

  // Circuit Mode: sharp 45° angle or rounded curves
  const rounded = turn === "rounded";
  const fullPath = buildCircuitPath(
    markers,
    markers.length - 1,
    rounded,
    "bottom",
  );
  trackPath.value = fullPath;
  straightHighlight.value = { top: 0, height: 0, visible: false };

  await nextTick();

  const total = measurePathLength(fullPath);
  pathLength.value = total;

  if (total === 0) {
    activeStart.value = 0;
    activeEnd.value = 0;
    activeMarker.value = null;
    return;
  }

  if (indicator === "progress") {
    activeStart.value = 0;
    activeEnd.value = total * ctx.scrollProgress.value;
    activeMarker.value = null;
    enableAnimation();
    return;
  }

  if (activeIndex < 0) {
    activeStart.value = 0;
    activeEnd.value = 0;
    activeMarker.value = null;
    return;
  }

  const active = markers[activeIndex]!;
  activeMarker.value = active;

  const isFillMode = indicator === "fill" || (ctx?.keepScrolled.value ?? false);
  const startLength = isFillMode
    ? 0
    : measurePathLength(buildCircuitPath(markers, activeIndex, rounded, "top"));
  const endLength = measurePathLength(
    buildCircuitPath(markers, activeIndex, rounded, "bottom"),
  );

  activeStart.value = startLength;
  activeEnd.value = endLength;
  enableAnimation();
}

function enableAnimation() {
  if (!canAnimate.value) {
    if (typeof requestAnimationFrame !== "undefined") {
      requestAnimationFrame(() => {
        canAnimate.value = true;
      });
    } else {
      canAnimate.value = true;
    }
  }
}

let rafId = 0;
function scheduleUpdate() {
  if (typeof window === "undefined") return;
  if (typeof cancelAnimationFrame !== "undefined") {
    cancelAnimationFrame(rafId);
  }
  if (typeof requestAnimationFrame !== "undefined") {
    rafId = requestAnimationFrame(() => {
      updateGeometry();
    });
  } else {
    updateGeometry();
  }
}

onMounted(() => {
  scheduleUpdate();
  window.addEventListener("resize", scheduleUpdate);
});

onBeforeUnmount(() => {
  if (typeof cancelAnimationFrame !== "undefined") {
    cancelAnimationFrame(rafId);
  }
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", scheduleUpdate);
  }
});

watch(
  () => [
    ctx?.activeValue.value,
    ctx?.items.value,
    ctx?.turn.value,
    ctx?.indicator.value,
    ctx?.keepScrolled.value,
    ctx?.resolvedLineWidth.value,
    ctx?.position.value,
    ctx?.railPosition.value,
    ctx?.scrollProgress.value,
  ],
  () => {
    scheduleUpdate();
  },
  { deep: true },
);
</script>

<template>
  <div
    data-slot="scroll-spy-indicator"
    :class="
      cn('pointer-events-none absolute inset-0 overflow-visible', props.class)
    "
    aria-hidden="true"
  >
    <svg
      v-if="ctx?.turn.value !== 'straight'"
      class="absolute inset-0 size-full overflow-visible"
      fill="none"
    >
      <path ref="measurePathRef" class="invisible" fill="none" />
      <path
        :d="trackPath"
        class="stroke-border"
        :stroke-width="ctx?.resolvedLineWidth.value ?? 2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        v-if="trackPath && activeEnd > 0"
        :d="trackPath"
        :class="handleColor.strokeClass"
        :stroke-width="ctx?.resolvedLineWidth.value ?? 2.5"
        stroke-linecap="butt"
        stroke-linejoin="round"
        :style="{
          stroke: handleColor.customColor,
          strokeDasharray: `${Math.max(activeEnd - activeStart, 0)} ${Math.max(pathLength, 1)}`,
          strokeDashoffset: -activeStart,
          transition:
            canAnimate && ctx?.indicator.value !== 'progress'
              ? 'stroke-dashoffset 260ms cubic-bezier(0.16, 1, 0.3, 1), stroke-dasharray 260ms cubic-bezier(0.16, 1, 0.3, 1)'
              : 'none',
        }"
      />
    </svg>

    <div
      v-if="
        ctx?.turn.value === 'straight' &&
        straightHighlight.visible &&
        (ctx?.indicator.value !== 'segment' || ctx?.keepScrolled.value)
      "
      :class="cn('absolute z-10 rounded-none', handleColor.bgClass)"
      :style="{
        top: `${straightHighlight.top}px`,
        height: `${straightHighlight.height}px`,
        width: `${ctx?.resolvedLineWidth.value ?? 2.5}px`,
        backgroundColor: handleColor.customColor,
        left:
          ctx?.position.value === 'left' && ctx?.railPosition.value === 'right'
            ? undefined
            : `-${ctx?.resolvedLineWidth.value ?? 2.5}px`,
        right:
          ctx?.position.value === 'left' && ctx?.railPosition.value === 'right'
            ? `-${ctx?.resolvedLineWidth.value ?? 2.5}px`
            : undefined,
        transition:
          canAnimate && ctx?.indicator.value !== 'progress'
            ? 'top 260ms cubic-bezier(0.16, 1, 0.3, 1), height 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease-out'
            : 'none',
      }"
    />
  </div>
</template>
