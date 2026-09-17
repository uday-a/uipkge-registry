<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
  orientation?: "horizontal" | "vertical";
  attached?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  orientation: "horizontal",
  attached: true,
});
</script>

<template>
  <div
    data-uipkge
    data-slot="button-group"
    role="group"
    :data-orientation="orientation"
    :data-attached="attached ? '' : undefined"
    :class="
      cn(
        'inline-flex items-center',
        orientation === 'vertical' ? 'flex-col items-stretch' : 'flex-row',
        attached && [
          '[&>[data-slot=button]]:relative [&>[data-slot=button]:focus-visible]:z-20 [&>[data-slot=button]:hover]:z-10',
          orientation === 'horizontal' && [
            '[&>[data-slot=button]]:rounded-none',
            'first:[&>[data-slot=button]]:rounded-l-md last:[&>[data-slot=button]]:rounded-r-md',
            '[&>[data-slot=button]:not(:first-child)]:-ml-px',
          ],
          orientation === 'vertical' && [
            '[&>[data-slot=button]]:rounded-none',
            'first:[&>[data-slot=button]]:rounded-t-md last:[&>[data-slot=button]]:rounded-b-md',
            '[&>[data-slot=button]:not(:first-child)]:-mt-px',
          ],
        ],
        !attached && (orientation === 'vertical' ? 'gap-1' : 'gap-1.5'),
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
