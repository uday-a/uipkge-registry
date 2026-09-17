<!--
  CarouselItem
  
  Individual slide within the carousel.
  Each item snaps into view when scrolled.
  
  @example
  <CarouselItem>
    <img src="/img1.jpg" alt="Slide 1" />
  </CarouselItem>
-->
<script setup lang="ts">
import { inject, computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { carouselItemVariants } from './index'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const carousel = inject<{
  orientation: { value: 'horizontal' | 'vertical' }
} | null>('carousel', null)

const itemClass = computed(() => {
  const orientation = carousel?.orientation?.value ?? 'horizontal'
  return carouselItemVariants({ orientation })
})
</script>

<template>
  <div
    data-uipkge
    data-slot="carousel-item"
    :class="cn(itemClass, 'shrink-0 grow-0 basis-full', 'snap-start', 'relative', props.class)"
    role="group"
    aria-roledescription="slide"
  >
    <slot />
  </div>
</template>
