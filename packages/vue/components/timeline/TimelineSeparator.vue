<script setup lang="ts">
import { computed, inject } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { TIMELINE_ITEM_CONTEXT } from "./context";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  /** Manually hide the auto-generated connector line. */
  hideConnector?: boolean;
}>();

const item = inject(TIMELINE_ITEM_CONTEXT, null);
const direction = computed(() => item?.direction.value ?? "vertical");
const isFirst = computed(() => item?.isFirst.value ?? true);
const isLast = computed(() => item?.isLast.value ?? true);
const showConnector = computed(
  () => !props.hideConnector && !(isFirst.value && isLast.value),
);
</script>

<template>
  <!-- Legacy compact separator: 16px marker, customizable inner dot via #dot
       slot. Uses the same single-absolute-line strategy as TimelineMedia so
       the connector is pixel-aligned across items. --marker-half = 0.5rem
       (= size-4 / 2). -->
  <div
    data-uipkge
    data-slot="timeline-separator"
    :class="
      cn(
        'relative shrink-0 self-stretch',
        direction === 'vertical'
          ? 'flex w-4 flex-col items-center'
          : 'flex h-4 flex-row items-center',
        props.class,
      )
    "
    style="--timeline-marker-half: 0.5rem"
    v-bind="$attrs"
  >
    <div
      v-if="showConnector"
      aria-hidden="true"
      :class="
        direction === 'vertical'
          ? 'bg-border absolute left-1/2 w-px -translate-x-1/2'
          : 'bg-border absolute top-1/2 h-px -translate-y-1/2'
      "
      :style="
        direction === 'vertical'
          ? {
              top: isFirst ? 'var(--timeline-marker-half)' : '0',
              bottom: isLast ? 'calc(100% - var(--timeline-marker-half))' : '0',
            }
          : {
              left: isFirst ? 'var(--timeline-marker-half)' : '0',
              right: isLast ? 'calc(100% - var(--timeline-marker-half))' : '0',
            }
      "
    />
    <div
      data-slot="timeline-separator-marker"
      class="bg-primary ring-background relative z-10 flex size-4 items-center justify-center rounded-full ring-4"
    >
      <slot name="dot">
        <div class="bg-primary-foreground size-2 rounded-full" />
      </slot>
    </div>
  </div>
</template>
