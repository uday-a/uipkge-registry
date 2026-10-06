<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { CardVariants } from './card.variants'

  export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariants['variant']
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { cardVariants } from './card.variants'

  let { class: className, variant = 'default', children, ref = $bindable(null), ...restProps }: CardProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="card"
  data-variant={variant}
  class={cn(cardVariants({ variant }), 'overflow-hidden', className)}
  {...restProps}
>
  {@render children?.()}
</div>
