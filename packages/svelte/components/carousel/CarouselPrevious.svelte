<!--
  CarouselPrevious

  Navigation button to go to the previous slide.

  @example
  <CarouselPrevious label="Previous slide" />
-->
<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface CarouselPreviousProps extends HTMLButtonAttributes {
    label?: string
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { ChevronLeft } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { Button } from '$lib/components/ui/button'
  import { CAROUSEL_CONTEXT_KEY, type CarouselState } from './useCarousel.svelte'

  let {
    class: className,
    label = 'Previous slide',
    children,
    ref = $bindable(null),
    ...restProps
  }: CarouselPreviousProps = $props()

  const carousel = getContext<CarouselState | undefined>(CAROUSEL_CONTEXT_KEY)

  const isHorizontal = $derived(carousel?.orientation !== 'vertical')
</script>

<Button
  type="button"
  variant="outline"
  size="icon"
  bind:ref
  class={cn(
    'absolute z-10 size-8 shrink-0 rounded-full',
    'bg-background/80 border shadow-md backdrop-blur-sm',
    'hover:bg-accent hover:text-accent-foreground',
    'disabled:pointer-events-none disabled:opacity-50',
    isHorizontal ? 'top-1/2 -left-3 -translate-y-1/2' : '-top-3 left-1/2 -translate-x-1/2 rotate-90',
    className,
  )}
  disabled={!carousel?.canScrollPrev}
  aria-label={label}
  onclick={() => carousel?.scrollPrev()}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    <ChevronLeft class="size-4" aria-hidden="true" />
  {/if}
</Button>
