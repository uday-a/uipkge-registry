<!--
  CarouselContent

  The embla viewport for carousel items. Mirrors the React twin's two-layer
  structure: the outer div is the viewport the engine attaches to (fixed
  scroll/snap classes), the inner div is the flex track that carries consumer
  `class` / props / `ref`.

  @example
  <CarouselContent>
    {#each slides as slide (slide.id)}
      <CarouselItem>
        <img src={slide.src} alt={slide.alt} />
      </CarouselItem>
    {/each}
  </CarouselContent>
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CarouselContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { CAROUSEL_CONTEXT_KEY, type CarouselState } from './useCarousel.svelte'

  let { class: className, children, ref = $bindable(null), ...restProps }: CarouselContentProps = $props()

  const carousel = getContext<CarouselState | undefined>(CAROUSEL_CONTEXT_KEY)

  let viewport: HTMLDivElement | null = $state(null)

  $effect(() => {
    if (viewport && carousel) {
      carousel.attach(viewport)
      return () => carousel.detach()
    }
  })

  const isHorizontal = $derived(carousel?.orientation !== 'vertical')

  // Class strings are 1:1 with the React twin's inlined snap classes.
  const scrollClass = $derived(
    isHorizontal
      ? 'flex snap-x snap-mandatory overflow-x-auto scroll-smooth'
      : 'flex snap-y snap-mandatory flex-col overflow-y-auto',
  )
</script>

<!-- svelte-ignore a11y_role_supports_aria_props: Vue twin carries the same role + aria-orientation pair -->
<div
  bind:this={viewport}
  data-uipkge
  data-slot="carousel-content"
  class={cn(
    scrollClass,
    'relative h-full w-full',
    '[-ms-overflow-style:none] [scrollbar-width:none]',
    '[&::-webkit-scrollbar]:hidden',
  )}
  aria-orientation={carousel?.orientation}
  role="group"
>
  <div
    bind:this={ref}
    class={cn(
      'flex',
      // w-full clamps the track to the viewport width. Without it the track's
      // min-width:auto sizes to the slides' intrinsic content and overflows the
      // viewport, so basis-full slides resolve against the wider track and
      // render too big. Keeps the two frameworks 1:1.
      isHorizontal ? 'w-full' : 'flex-col',
      className,
    )}
    {...restProps}
  >
    {@render children?.()}
  </div>
</div>
