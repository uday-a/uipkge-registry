<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <th
    data-uipkge
    data-slot="table-head"
    :class="
      cn(
        'text-foreground h-10 px-3 text-left align-middle text-sm font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5',
        props.class,
      )
    "
  >
    <slot />
  </th>
</template>
