<script setup lang="ts">
import { PaginationNext as RkPaginationNext } from 'reka-ui'
import { ChevronRight } from 'lucide-vue-next'
</script>
<template>
  <RkPaginationNext aria-label="Go to next page"
    ><slot><ChevronRight class="size-4" aria-hidden="true" /></slot
  ></RkPaginationNext>
</template>
