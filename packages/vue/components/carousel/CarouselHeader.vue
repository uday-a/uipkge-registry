<!--
  CarouselHeader
  
  Wrapper for carousel header content (title, controls).
  
  @example
  <CarouselHeader>
    <h3>Featured Products</h3>
  </CarouselHeader>
-->
<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div data-uipkge data-slot="carousel-header" :class="cn('flex items-center justify-between px-1 pb-2', props.class)">
    <slot />
  </div>
</template>
