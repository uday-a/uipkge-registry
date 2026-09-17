<script setup lang="ts">
import { computed, inject } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { SCROLL_SPY_CONTEXT_KEY } from "./context";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const ctx = inject(SCROLL_SPY_CONTEXT_KEY, null);
const isRightRail = computed(
  () => ctx?.position.value === "left" && ctx?.railPosition.value === "right",
);
</script>

<template>
  <p
    data-slot="scroll-spy-title"
    :class="
      cn(
        'text-foreground mb-3 text-sm font-semibold tracking-tight',
        isRightRail && 'pr-3 text-right',
        props.class,
      )
    "
  >
    <slot />
  </p>
</template>
