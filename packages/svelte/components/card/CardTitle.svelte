<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, as = 'h3', children, ref = $bindable(null), ...restProps }: CardTitleProps = $props()
</script>

<svelte:element
  this={as}
  bind:this={ref}
  data-uipkge
  data-slot="card-title"
  class={cn('leading-none font-semibold tracking-tight', className)}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
