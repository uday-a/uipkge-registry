<script setup lang="ts">
import { PaginationFirst as RkPaginationFirst } from "reka-ui";
import { ChevronsLeft } from "lucide-vue-next";
</script>
<template>
  <RkPaginationFirst aria-label="Go to first page"
    ><slot><ChevronsLeft class="size-4" aria-hidden="true" /></slot
  ></RkPaginationFirst>
</template>
