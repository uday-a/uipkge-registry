<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
  <div
    data-uipkge
    data-slot="list-item-content"
    :class="cn('flex min-w-0 flex-1 flex-col gap-0.5 self-center', props.class)"
  >
    <slot />
  </div>
</template>
