<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    data-uipkge
    data-slot="breadcrumb-page"
    aria-current="page"
    :class="cn('text-foreground cursor-default font-normal', props.class)"
  >
    <slot />
  </span>
</template>
