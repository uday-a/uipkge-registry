<!-- @fallthroughAttributes true -->
<!-- @strictTemplates true -->

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const dataAttrs = { 'data-slot': 'native-select-option' }
</script>

<template>
  <option v-bind="dataAttrs" :class="cn('bg-popover text-popover-foreground', props.class)">
    <slot />
  </option>
</template>
