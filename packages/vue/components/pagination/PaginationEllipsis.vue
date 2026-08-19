<script setup lang="ts">
import { PaginationEllipsis as RkPaginationEllipsis } from "reka-ui";
import { MoreHorizontal } from "lucide-vue-next";
</script>
<template>
  <RkPaginationEllipsis aria-hidden="true">
    <slot>
      <MoreHorizontal class="size-4" aria-hidden="true" />
    </slot>
  </RkPaginationEllipsis>
</template>
