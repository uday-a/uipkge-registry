<script lang="ts" setup>
import type { PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<PrimitiveProps & { class?: HTMLAttributes["class"] }>(),
  {
    as: "a",
  },
);
</script>

<template>
  <Primitive
    data-uipkge
    data-slot="breadcrumb-link"
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        'hover:text-foreground focus-visible:outline-ring rounded-sm underline-offset-4 transition-colors duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2',
        props.class,
      )
    "
  >
    <slot />
  </Primitive>
</template>
