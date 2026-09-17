<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { TabsContent } from "reka-ui";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
  value: string;
  forceMount?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <TabsContent
    v-slot="slotProps"
    :value="props.value"
    :force-mount="props.forceMount"
    :class="
      cn(
        'ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 motion-safe:data-[state=active]:blur-in-2 motion-safe:data-[state=active]:slide-in-from-bottom-1 motion-safe:data-[state=active]:ease-emphasized flex-1 focus-visible:ring-2 focus-visible:ring-[3px] focus-visible:outline-none motion-safe:data-[state=active]:duration-200',
        props.class,
      )
    "
    data-uipkge
    data-slot="tabs-content"
  >
    <slot v-bind="slotProps" />
  </TabsContent>
</template>
