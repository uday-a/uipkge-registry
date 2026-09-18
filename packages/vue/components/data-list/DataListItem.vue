<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-uipkge
    data-slot="data-list-item"
    :class="
      cn(
        'flex flex-row items-center justify-between border-b py-4 transition-colors duration-200 first:pt-0 last:border-0 last:pb-0',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
