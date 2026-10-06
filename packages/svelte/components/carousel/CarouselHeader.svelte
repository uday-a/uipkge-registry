<!--
  CarouselHeader

  Wrapper for carousel header content (title, controls).

  @example
  <CarouselHeader>
    <h3>Featured Products</h3>
  </CarouselHeader>
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CarouselHeaderProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: CarouselHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="carousel-header"
  class={cn('flex items-center justify-between px-1 pb-2', className)}
  {...restProps}
>
  {@render children?.()}
</div>
