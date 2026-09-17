<script setup lang="ts">
import { PaginationPrev as RkPaginationPrev } from "reka-ui";
import { ChevronLeft } from "lucide-vue-next";
</script>
<template>
  <RkPaginationPrev aria-label="Go to previous page"
    ><slot><ChevronLeft class="size-4" aria-hidden="true" /></slot
  ></RkPaginationPrev>
</template>
