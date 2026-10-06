<!--
  CarouselFooter

  Wrapper for carousel footer content (pagination, indicators).

  @example
  <CarouselFooter>
    <CarouselIndicators />
  </CarouselFooter>
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CarouselFooterProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: CarouselFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="carousel-footer"
  class={cn('flex items-center justify-between px-1 pt-2', className)}
  {...restProps}
>
  {@render children?.()}
</div>
