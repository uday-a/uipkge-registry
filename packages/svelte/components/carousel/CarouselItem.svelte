<!--
  CarouselItem

  Individual slide within the carousel.
  Each item snaps into view when scrolled.

  @example
  <CarouselItem>
    <img src="/img1.jpg" alt="Slide 1" />
  </CarouselItem>
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { carouselItemVariants } from './carousel.variants'
  import { CAROUSEL_CONTEXT_KEY, type CarouselState } from './useCarousel.svelte'

  let { class: className, children, ref = $bindable(null), ...restProps }: CarouselItemProps = $props()

  const carousel = getContext<CarouselState | undefined>(CAROUSEL_CONTEXT_KEY)

  const itemClass = $derived(carouselItemVariants({ orientation: carousel?.orientation ?? 'horizontal' }))
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="carousel-item"
  class={cn(itemClass, 'snap-start', 'relative', className)}
  role="group"
  aria-roledescription="slide"
  {...restProps}
>
  {@render children?.()}
</div>
