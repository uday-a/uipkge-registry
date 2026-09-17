<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

export interface WordDatum {
  name: string;
  value: number;
}

interface Props {
  data: WordDatum[];
  height?: number | string;
  /** Optional palette override. Defaults to chart-1..5 tokens. */
  colors?: string[];
  class?: HTMLAttributes["class"];
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 280,
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

const words = computed(() => {
  if (!props.data.length) return [];
  const vals = props.data.map((d) => d.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = Math.max(1, max - min);
  return [...props.data]
    .sort((a, b) => b.value - a.value)
    .map((d, i) => ({
      ...d,
      size: 14 + ((d.value - min) / span) * 30,
      color: props.colors[i % props.colors.length]!,
      weight: d.value === max ? 700 : d.value >= min + span * 0.66 ? 600 : 500,
      opacity: 0.55 + ((d.value - min) / span) * 0.45,
    }));
});
</script>

<template>
  <div
    data-slot="word-cloud-chart"
    role="img"
    tabindex="0"
    :aria-label="ariaLabel || 'Chart'"
    :style="{ height: heightStyle }"
    :class="
      cn(
        'focus-visible:ring-ring w-full overflow-hidden focus-visible:ring-2 focus-visible:outline-none',
        props.class,
      )
    "
  >
    <div
      class="flex h-full w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 p-4"
    >
      <span
        v-for="w in words"
        :key="w.name"
        :title="`${w.name}: ${w.value}`"
        :style="{
          fontSize: `${Math.round(w.size)}px`,
          color: w.color,
          fontWeight: w.weight,
          opacity: w.opacity,
          lineHeight: 1.15,
        }"
        class="cursor-default transition-transform duration-150 hover:scale-110"
      >
        {{ w.name }}
      </span>
    </div>
  </div>
</template>
