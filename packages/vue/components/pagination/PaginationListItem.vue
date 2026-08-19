<script setup lang="ts">
import type { PaginationListItemProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { PaginationListItem as RkPaginationListItem } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<
  PaginationListItemProps & { class?: HTMLAttributes["class"] }
>();
const delegated = reactiveOmit(props, "class");
</script>

<template>
  <RkPaginationListItem
    data-uipkge
    data-slot="pagination-list-item"
    v-bind="delegated"
    :class="cn('shrink-0', props.class)"
  >
    <slot />
  </RkPaginationListItem>
</template>
