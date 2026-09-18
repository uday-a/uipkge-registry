<!--
  Carousel Component
  
  A flexible carousel/slider for cycling through content.
  
  @example - Basic carousel with images
  <Carousel>
    <CarouselContent>
      <CarouselItem v-for="img in images" :key="img.id">
        <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover" />
      </CarouselItem>
    </CarouselContent>
  </Carousel>
  
  @example - Carousel with navigation controls
  <Carousel v-model:active-index="activeIndex" :loop="true">
    <CarouselContent>
      <CarouselItem v-for="slide in slides" :key="slide.id">
        <SlideContent :content="slide" />
      </CarouselItem>
    </CarouselContent>
    <template #footer>
      <CarouselPrevious />
      <CarouselIndicators />
      <CarouselNext />
    </template>
  </Carousel>
  
  @example - Vertical carousel
  <Carousel orientation="vertical" :loop="false">
    <CarouselContent>
      <CarouselItem v-for="item in items" :key="item.id">
        {{ item }}
      </CarouselItem>
    </CarouselContent>
  </Carousel>
-->
<script setup lang="ts">
import { provide, computed, watch, onMounted, onUnmounted, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useCarousel } from './useCarousel'
import { carouselVariants } from './carousel.variants'

export interface CarouselProps {
  modelValue?: number
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<CarouselProps>(), {
  modelValue: 0,
  orientation: 'horizontal',
  loop: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const carousel = useCarousel({
  loop: props.loop,
  orientation: props.orientation,
})

// Sync modelValue → scroll when controlled externally
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== carousel.activeIndex.value) {
      carousel.scrollTo(newVal, false)
    }
  },
)

// Emit scroll position changes back to parent
function onScroll() {
  const newIndex = carousel.activeIndex.value
  if (newIndex !== props.modelValue) {
    emit('update:modelValue', newIndex)
  }
}

onMounted(() => {
  if (carousel.rootRef.value) {
    carousel.rootRef.value.addEventListener('scroll', onScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (carousel.rootRef.value) {
    carousel.rootRef.value.removeEventListener('scroll', onScroll)
  }
})

// Provide to children
provide('carousel', {
  ...carousel,
  orientation: computed(() => props.orientation),
  loop: computed(() => props.loop),
})
</script>

<template>
  <div
    data-uipkge
    data-slot="carousel"
    :class="cn(carouselVariants({ orientation: props.orientation }), props.class)"
    role="region"
    aria-roledescription="carousel"
    aria-label="Carousel"
  >
    <slot />
  </div>
</template>
