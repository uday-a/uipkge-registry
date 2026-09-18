<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div data-uipkge data-slot="card-footer" :class="cn('flex items-center p-6 pt-0', props.class)">
    <slot />
  </div>
</template>
