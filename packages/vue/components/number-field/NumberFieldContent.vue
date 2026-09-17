<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed } from "vue";
import { cn } from "@/lib/utils";
import { injectNumberFieldContext } from "./NumberFieldContext";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const uiContext = injectNumberFieldContext();

const isRight = computed(() => uiContext.controlsPosition.value === "right");
</script>

<template>
  <div
    :class="
      cn(
        'relative',
        isRight &&
          'border-input focus-within:ring-ring inline-grid grid-cols-[1fr_auto] grid-rows-[1fr_1fr] items-stretch overflow-hidden rounded-md border focus-within:ring-1',
        !isRight &&
          '[&>[data-slot=input]]:has-[[data-slot=decrement]]:pl-9 [&>[data-slot=input]]:has-[[data-slot=increment]]:pr-9',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
