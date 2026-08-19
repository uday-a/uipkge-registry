<script setup lang="ts">
import { computed } from "vue";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const props = defineProps<{
  label: string;
  value: number;
  secondaryLabel?: string;
  barClass?: string;
  class?: string;
  colorIndex?: number;
}>();

// Maps to canonical shadcn chart tokens (chart-1..5). Cycles through 5 hues.
const barColors = [
  "[&_[data-slot=progress-indicator]]:bg-primary",
  "[&_[data-slot=progress-indicator]]:bg-[var(--chart-1)]",
  "[&_[data-slot=progress-indicator]]:bg-[var(--chart-2)]",
  "[&_[data-slot=progress-indicator]]:bg-[var(--chart-3)]",
  "[&_[data-slot=progress-indicator]]:bg-[var(--chart-4)]",
  "[&_[data-slot=progress-indicator]]:bg-[var(--chart-5)]",
];

const colorClass = computed(() =>
  props.colorIndex !== undefined
    ? barColors[props.colorIndex % barColors.length]
    : "",
);
</script>

<template>
  <div
    data-uipkge
    data-slot="progress-item"
    :class="cn('group/progress space-y-1.5', props.class)"
  >
    <div class="flex items-center justify-between text-sm">
      <span class="font-medium">{{ label }}</span>
      <span class="text-muted-foreground text-xs tabular-nums">{{
        secondaryLabel ?? `${value}%`
      }}</span>
    </div>
    <Progress
      :model-value="value"
      :class="cn('h-2 transition-colors duration-200', colorClass, barClass)"
    />
  </div>
</template>
