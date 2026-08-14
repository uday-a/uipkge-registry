<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { spinnerVariants } from './spinner.variants'

// Inlined union: SFC compiler can't extract runtime props from
// `SpinnerVariants['size']`.
const props = defineProps<{
  class?: HTMLAttributes['class']
  size?: 'default' | 'sm' | 'lg' | 'icon'
}>()
</script>

<template>
  <Loader2
    data-uipkge
    data-slot="spinner"
    :class="cn(spinnerVariants({ size: size ?? 'default' }), props.class)"
    aria-label="Loading"
    role="status"
  />
</template>
