<!--
  CarouselIndicators

  Pagination dots showing current slide position.
  Clicking a dot navigates to that slide.

  @example
  <CarouselIndicators />
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CarouselIndicatorsProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { CAROUSEL_CONTEXT_KEY, type CarouselState } from './useCarousel.svelte'

  let { class: className, ref = $bindable(null), ...restProps }: CarouselIndicatorsProps = $props()

  const carousel = getContext<CarouselState | undefined>(CAROUSEL_CONTEXT_KEY)
</script>

{#if carousel?.api}
  <div
    bind:this={ref}
    data-uipkge
    data-slot="carousel-indicators"
    class={cn('flex items-center justify-center gap-1.5 py-2', className)}
    role="tablist"
    aria-label="Carousel navigation"
    {...restProps}
  >
    {#each carousel.scrollSnaps as _, index (index)}
      <button
        type="button"
        role="tab"
        aria-label={`Go to slide ${index + 1}`}
        aria-selected={index === carousel.selectedIndex}
        class={cn(
          'h-2 w-2 rounded-full transition-colors duration-200',
          index === carousel.selectedIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
        )}
        onclick={() => carousel.scrollTo(index, true)}
      ></button>
    {/each}
  </div>
{/if}
