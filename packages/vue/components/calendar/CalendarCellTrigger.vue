<script lang="ts" setup>
import type { CalendarCellTriggerProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { CalendarCellTrigger, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const props = withDefaults(
  defineProps<CalendarCellTriggerProps & { class?: HTMLAttributes["class"] }>(),
  {
    as: "button",
  },
);

const delegatedProps = reactiveOmit(props, "class");

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <CalendarCellTrigger
    data-uipkge
    data-slot="calendar-cell-trigger"
    :class="
      cn(
        buttonVariants({ variant: 'ghost' }),
        'size-9 cursor-pointer p-0 font-normal transition-[color,background-color,transform,box-shadow] duration-150 aria-selected:opacity-100',
        '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground',
        // Selected
        'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground data-[selected]:opacity-100 data-[selected]:shadow-sm motion-safe:data-[selected]:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both]',
        // Disabled
        'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
        // Unavailable
        'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
        // Outside months
        'data-[outside-view]:text-muted-foreground',
        props.class,
      )
    "
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCellTrigger>
</template>

<style>
@keyframes calendar-day-pop {
  0% {
    transform: scale(0.86);
  }
  70% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="calendar-cell-trigger"] {
    animation: none !important;
    transition: none !important;
  }
}
</style>
