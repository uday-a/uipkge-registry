<!--
  CarouselIndicators
  
  Pagination dots showing current slide position.
  Clicking a dot navigates to that slide.
  
  @example
  <CarouselIndicators />
-->
<script setup lang="ts">
import { inject, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

defineProps<Props>()

const carousel = inject<{
  activeIndex: { value: number }
  scrollSnaps: { value: number[] }
  scrollTo: (index: number, smooth?: boolean) => void
} | null>('carousel', null)
</script>

<template>
  <div
    v-if="carousel"
    data-uipkge
    data-slot="carousel-indicators"
    class="flex items-center justify-center gap-1.5 py-2"
    role="tablist"
    aria-label="Carousel navigation"
  >
    <button
      v-for="(_, index) in carousel.scrollSnaps.value"
      :key="index"
      type="button"
      role="tab"
      :aria-label="`Go to slide ${index + 1}`"
      :aria-selected="index === carousel.activeIndex.value"
      :class="
        cn(
          'h-2 w-2 rounded-full transition-colors duration-200',
          index === carousel.activeIndex.value
            ? 'bg-primary w-6'
            : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
        )
      "
      @click="carousel.scrollTo(index, true)"
    />
  </div>
</template>
