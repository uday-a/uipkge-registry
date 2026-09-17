<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import { TabsTrigger } from "reka-ui";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
  value: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const delegated = computed(() => {
  const { class: _, ...rest } = props;
  return rest;
});
</script>

<template>
  <TabsTrigger
    v-slot="slotProps"
    data-uipkge
    data-slot="vertical-tabs-trigger"
    v-bind="delegated"
    :class="
      cn(
        // z-10 keeps label above the sliding indicator; active surface paints on the list
        // indicator when the parent list has data-animated=true. Static active chrome
        // restores when data-animated=false (group-data variants below).
        'group/trigger text-muted-foreground relative z-10 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-[color,background-color] duration-150',
        'hover:bg-muted/60 hover:text-foreground',
        'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:text-foreground',
        'group-data-[animated=false]/list:data-[state=active]:bg-muted',
        // Static primary rail (only when list animation is off).
        `before:bg-primary before:pointer-events-none before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:opacity-0 before:content-['']`,
        'group-data-[animated=false]/list:data-[state=active]:before:opacity-100',
        '[&>svg]:size-4 [&>svg]:shrink-0',
        props.class,
      )
    "
    :disabled="props.disabled"
  >
    <slot v-bind="slotProps" />
  </TabsTrigger>
</template>
