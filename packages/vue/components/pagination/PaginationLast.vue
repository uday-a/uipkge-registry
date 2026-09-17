<script setup lang="ts">
import { PaginationLast as RkPaginationLast } from "reka-ui";
import { ChevronsRight } from "lucide-vue-next";
</script>
<template>
  <RkPaginationLast aria-label="Go to last page"
    ><slot><ChevronsRight class="size-4" aria-hidden="true" /></slot
  ></RkPaginationLast>
</template>
