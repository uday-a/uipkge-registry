<script setup lang="ts">
import type { PaginationRootEmits, PaginationRootProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { PaginationRoot, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<
  PaginationRootProps & { class?: HTMLAttributes["class"]; ariaLabel?: string }
>();
const emits = defineEmits<PaginationRootEmits>();

const delegated = reactiveOmit(props, "class", "as", "ariaLabel");
const forwarded = useForwardPropsEmits(delegated, emits);
</script>

<template>
  <PaginationRoot
    v-slot="slotProps"
    :as="props.as ?? 'nav'"
    :aria-label="props.ariaLabel ?? 'Pagination'"
    data-uipkge
    data-slot="pagination"
    v-bind="forwarded"
    :class="cn('flex items-center gap-1', props.class)"
  >
    <slot v-bind="slotProps" />
  </PaginationRoot>
</template>
