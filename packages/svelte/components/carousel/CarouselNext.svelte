<!--
  CarouselNext

  Navigation button to go to the next slide.

  @example
  <CarouselNext label="Next slide" />
-->
<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface CarouselNextProps extends HTMLButtonAttributes {
    label?: string
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { ChevronRight } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { Button } from '$lib/components/ui/button'
  import { CAROUSEL_CONTEXT_KEY, type CarouselState } from './useCarousel.svelte'

  let {
    class: className,
    label = 'Next slide',
    children,
    ref = $bindable(null),
    ...restProps
  }: CarouselNextProps = $props()

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
    isHorizontal ? 'top-1/2 -right-3 -translate-y-1/2' : '-bottom-3 left-1/2 -translate-x-1/2 rotate-90',
    className,
  )}
  disabled={!carousel?.canScrollNext}
  aria-label={label}
  onclick={() => carousel?.scrollNext()}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    <ChevronRight class="size-4" aria-hidden="true" />
  {/if}
</Button>
