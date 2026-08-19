<script setup lang="ts">
import type { PaginationListProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { PaginationList as RkPaginationList } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<
  PaginationListProps & { class?: HTMLAttributes["class"] }
>();
</script>

<template>
  <RkPaginationList
    v-slot="slotProps"
    data-uipkge
    data-slot="pagination-list"
    v-bind="props"
    :class="cn('flex items-center gap-1', props.class)"
  >
    <slot v-bind="slotProps" />
  </RkPaginationList>
</template>
