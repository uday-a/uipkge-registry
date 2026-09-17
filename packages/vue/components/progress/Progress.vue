<script setup lang="ts">
import type { ProgressRootProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { computed } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { ProgressIndicator, ProgressRoot } from "reka-ui";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<ProgressRootProps & { class?: HTMLAttributes["class"] }>(),
  {
    modelValue: 0,
  },
);

const delegatedProps = reactiveOmit(props, "class");

// Clamp so out-of-range modelValue cannot push the indicator past the track.
const clampedValue = computed(() =>
  Math.min(100, Math.max(0, props.modelValue ?? 0)),
);
</script>

<template>
  <ProgressRoot
    data-uipkge
    data-slot="progress"
    v-bind="delegatedProps"
    :model-value="clampedValue"
    :aria-label="
      $attrs['aria-label'] !== undefined ||
      $attrs['aria-labelledby'] !== undefined
        ? undefined
        : 'Progress'
    "
    :class="
      cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        props.class,
      )
    "
  >
    <ProgressIndicator
      data-uipkge
      data-slot="progress-indicator"
      class="bg-primary h-full w-full flex-1 transition-transform duration-500 ease-out motion-reduce:transition-none"
      :style="`transform: translateX(-${100 - clampedValue}%);`"
    />
  </ProgressRoot>
</template>
