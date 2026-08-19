<script setup lang="ts">
import type { AccordionHeaderProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { AccordionHeader as RkAccordionHeader } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<
  AccordionHeaderProps & { class?: HTMLAttributes["class"] }
>();
const delegated = reactiveOmit(props, "class");
</script>

<template>
  <RkAccordionHeader
    data-uipkge
    data-slot="accordion-header"
    v-bind="delegated"
    :class="cn('flex', props.class)"
  >
    <slot />
  </RkAccordionHeader>
</template>
