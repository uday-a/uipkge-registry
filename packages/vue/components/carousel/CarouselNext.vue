<!--
  CarouselNext
  
  Navigation button to go to the next slide.
  
  @example
  <CarouselNext label="Next slide" />
-->
<script setup lang="ts">
import { inject, computed, type HTMLAttributes } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Props {
  class?: HTMLAttributes['class']
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Next slide',
})

const carousel = inject<{
  canScrollNext: { value: boolean }
  scrollToNext: (smooth?: boolean) => void
  orientation: { value: 'horizontal' | 'vertical' }
} | null>('carousel', null)

const isHorizontal = computed(() => carousel?.orientation?.value !== 'vertical')
</script>

<template>
  <Button
    type="button"
    variant="outline"
    size="icon"
    :class="
      cn(
        'absolute z-10 size-8 shrink-0 rounded-full',
        'bg-background/80 border shadow-md backdrop-blur-sm',
        'hover:bg-accent hover:text-accent-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        isHorizontal ? 'top-1/2 -right-3 -translate-y-1/2' : '-bottom-3 left-1/2 -translate-x-1/2 rotate-90',
        props.class,
      )
    "
    :disabled="!carousel?.canScrollNext?.value"
    :aria-label="props.label"
    @click="carousel?.scrollToNext(true)"
  >
    <slot>
      <ChevronRight class="size-4" aria-hidden="true" />
    </slot>
  </Button>
</template>
