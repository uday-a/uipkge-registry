<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { cardVariants } from './card.variants'

// Inlined union: SFC compiler can't extract runtime props from
// `CardVariants['variant']`.
const props = defineProps<{
  variant?: 'default' | 'elevated' | 'outline' | 'ghost'
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div data-uipkge data-slot="card" :class="cn(cardVariants({ variant }), 'overflow-hidden', props.class)">
    <slot />
  </div>
</template>
