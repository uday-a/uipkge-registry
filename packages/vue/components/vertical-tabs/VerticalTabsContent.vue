<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import { TabsContent } from "reka-ui";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
  value: string;
  forceMount?: boolean;
}

const props = defineProps<Props>();

const delegated = computed(() => {
  const { class: _, ...rest } = props;
  return rest;
});
</script>

<template>
  <TabsContent
    v-slot="slotProps"
    data-uipkge
    data-slot="vertical-tabs-content"
    v-bind="delegated"
    :class="
      cn(
        'ring-offset-background focus-visible:ring-ring/50 flex-1 focus-visible:ring-2 focus-visible:outline-none',
        props.class,
      )
    "
    :force-mount="props.forceMount"
  >
    <slot v-bind="slotProps" />
  </TabsContent>
</template>
