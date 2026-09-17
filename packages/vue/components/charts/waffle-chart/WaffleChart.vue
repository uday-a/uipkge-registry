<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

export interface WaffleSlice {
  name: string;
  value: number;
  color?: string;
}

interface Props {
  data: WaffleSlice[];
  height?: number | string;
  /** Cells per side (total = size²). Default 10. */
  size?: number;
  /** Cell corner radius. Default 2. */
  radius?: number;
  showLegend?: boolean;
  colors?: string[];
  class?: HTMLAttributes["class"];
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 260,
  size: 10,
  radius: 2,
  showLegend: true,
  colors: () => [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ],
});

const heightStyle = computed(() =>
  /^\d+$/.test(String(props.height))
    ? `${props.height}px`
    : String(props.height),
);
const total = computed(() => props.data.reduce((s, d) => s + d.value, 0) || 1);

const cells = computed(() => {
  const n = props.size * props.size;
  const counts = props.data.map((d) => Math.floor((d.value / total.value) * n));
  let rest = n - counts.reduce((s, c) => s + c, 0);
  const remainders = props.data
    .map((d, i) => ({ i, r: (d.value / total.value) * n - counts[i]! }))
    .sort((a, b) => b.r - a.r);
  for (const { i } of remainders) {
    if (rest <= 0) break;
    counts[i]!++;
    rest--;
  }
  const out: { color: string; name: string }[] = [];
  props.data.forEach((d, i) => {
    for (let k = 0; k < counts[i]!; k++)
      out.push({
        color: d.color ?? props.colors[i % props.colors.length]!,
        name: d.name,
      });
  });
  return out.reverse();
});
</script>

<template>
  <div
    data-slot="waffle-chart"
    role="img"
    tabindex="0"
    :aria-label="
      ariaLabel ||
      `Waffle chart: ${data.map((d) => `${d.name} ${Math.round((d.value / total) * 100)}%`).join(', ')}`
    "
    :style="{ height: heightStyle }"
    :class="
      cn(
        'focus-visible:ring-ring flex w-full items-center justify-center gap-5 focus-visible:ring-2 focus-visible:outline-none',
        props.class,
      )
    "
  >
    <svg
      :viewBox="`0 0 ${size * 12} ${size * 12}`"
      class="aspect-square h-full max-h-full"
      role="presentation"
    >
      <rect
        v-for="(c, i) in cells"
        :key="i"
        :x="(i % size) * 12 + 1"
        :y="Math.floor(i / size) * 12 + 1"
        width="10"
        height="10"
        :rx="radius"
        :fill="c.color"
      >
        <title>{{ c.name }}</title>
      </rect>
    </svg>
    <ul v-if="showLegend" class="space-y-1.5 text-xs">
      <li v-for="(d, i) in data" :key="d.name" class="flex items-center gap-2">
        <span
          class="size-2.5 rounded-[3px]"
          :style="{ background: d.color ?? colors[i % colors.length] }"
        />
        <span class="text-foreground font-medium">{{ d.name }}</span>
        <span class="text-muted-foreground tabular-nums"
          >{{ Math.round((d.value / total) * 100) }}%</span
        >
      </li>
    </ul>
  </div>
</template>
