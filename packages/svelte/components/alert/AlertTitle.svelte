<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AlertTitleProps extends HTMLAttributes<HTMLElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { as = 'h5', class: className, children, ...restProps }: AlertTitleProps = $props()
</script>

<svelte:element
  this={as}
  data-uipkge=""
  data-slot="alert-title"
  class={cn('mb-1 text-sm leading-none font-medium tracking-tight', className)}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
